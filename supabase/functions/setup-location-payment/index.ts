
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { location_id, location_name, billing_name } = await req.json()

    if (!location_id) {
      throw new Error('Location ID is required')
    }

    console.log('Setting up payment for location:', { location_id, location_name, billing_name })

    // Create or get Stripe customer for this location
    const stripe = new (await import('https://esm.sh/stripe@13.11.0')).default(
      Deno.env.get('STRIPE_SECRET_KEY') ?? '',
      { apiVersion: '2023-10-16' }
    )

    // Check if location billing record exists
    const { data: existingBilling } = await supabaseClient
      .from('location_billing')
      .select('stripe_customer_id')
      .eq('location_id', location_id)
      .maybeSingle()

    let customerId = existingBilling?.stripe_customer_id

    // Create Stripe customer if doesn't exist
    if (!customerId) {
      const customer = await stripe.customers.create({
        name: billing_name || location_name,
        description: `Location: ${location_name}`,
        metadata: {
          location_id: location_id,
          location_name: location_name
        }
      })
      customerId = customer.id

      // Insert or update location billing record
      await supabaseClient
        .from('location_billing')
        .upsert({
          location_id: location_id,
          stripe_customer_id: customerId,
          billing_name: billing_name || location_name
        })
    }

    // Create Stripe setup session
    const setupSession = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'setup',
      success_url: `${req.headers.get('origin')}/settings?setup_success=true&location_id=${location_id}`,
      cancel_url: `${req.headers.get('origin')}/settings?setup_cancelled=true`,
      metadata: {
        location_id: location_id,
        location_name: location_name
      }
    })

    console.log('Created setup session:', setupSession.id)

    return new Response(
      JSON.stringify({ url: setupSession.url }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )

  } catch (error) {
    console.error('Error in setup-location-payment:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )
  }
})
