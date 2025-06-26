
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const stripe = new (await import('https://esm.sh/stripe@13.11.0')).default(
      Deno.env.get('STRIPE_SECRET_KEY') ?? '',
      { apiVersion: '2023-10-16' }
    )

    const signature = req.headers.get('stripe-signature')
    const body = await req.text()

    const event = stripe.webhooks.constructEvent(
      body,
      signature!,
      Deno.env.get('STRIPE_WEBHOOK_SECRET') ?? ''
    )

    console.log('Received webhook event:', event.type)

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object
      
      if (session.mode === 'setup') {
        const customerId = session.customer as string
        const locationId = session.metadata?.location_id

        if (locationId) {
          // Get the setup intent to retrieve payment method
          const setupIntent = await stripe.setupIntents.retrieve(session.setup_intent as string)
          const paymentMethodId = setupIntent.payment_method as string

          if (paymentMethodId) {
            // Get payment method details
            const paymentMethod = await stripe.paymentMethods.retrieve(paymentMethodId)
            
            // Update location billing with payment method info
            await supabaseClient
              .from('location_billing')
              .update({
                stripe_payment_method_id: paymentMethodId,
                card_last_four: paymentMethod.card?.last4,
                card_brand: paymentMethod.card?.brand,
                updated_at: new Date().toISOString()
              })
              .eq('location_id', locationId)

            console.log('Updated location billing for location:', locationId)
          }
        }
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('Webhook error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
