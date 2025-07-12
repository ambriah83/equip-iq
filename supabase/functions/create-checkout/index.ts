import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { getCorsHeaders, handleCors } from "../_shared/cors.ts";
import { requireAuth } from "../_shared/auth.ts";
import { validateRequired, validateString, validateEnum } from "../_shared/validation.ts";
import { checkRateLimit } from "../_shared/rate-limit.ts";

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CREATE-CHECKOUT] ${step}${detailsStr}`);
};

serve(async (req) => {
  // Handle CORS preflight
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  const corsHeaders = getCorsHeaders(req);

  try {
    logStep("Function started");

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");
    logStep("Stripe key verified");

    // Require authentication and get service-role supabase client
    const { user, supabase: supabaseClient } = await requireAuth(req);
    if (!user?.email) throw new Error("User email not available");
    logStep("User authenticated", { userId: user.id, email: user.email });

    // Rate limiting - 10 checkout sessions per hour per user
    const rateLimitResult = await checkRateLimit(req, user.id, {
      maxRequests: 10,
      windowMs: 60 * 60 * 1000, // 1 hour
      identifier: "create-checkout"
    });

    if (!rateLimitResult.allowed) {
      return new Response(JSON.stringify({
        error: "Rate limit exceeded. Please try again later.",
        remaining: rateLimitResult.remaining,
        resetAt: rateLimitResult.resetAt
      }), {
        status: 429,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json',
          'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
          'X-RateLimit-Reset': rateLimitResult.resetAt.toISOString()
        },
      });
    }

    const requestData = await req.json();
    const { plan } = requestData;
    
    // Validate input
    validateRequired(plan, "plan");
    validateString(plan, "plan", 1, 50);
    validateEnum(plan, "plan", ["basic", "professional", "enterprise"]);
    
    logStep("Plan selected", { plan });

    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });
    
    // Check if customer already exists
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    let customerId;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
      logStep("Found existing customer", { customerId });
    }

    // Define pricing
    const prices = {
      basic: { amount: 2900, name: "Basic Plan" },
      professional: { amount: 9900, name: "Professional Plan" },
      enterprise: { amount: 29900, name: "Enterprise Plan" }
    };

    const selectedPrice = prices[plan as keyof typeof prices];
    if (!selectedPrice) throw new Error("Invalid plan selected");

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_email: customerId ? undefined : user.email,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: { name: selectedPrice.name },
            unit_amount: selectedPrice.amount,
            recurring: { interval: "month" },
          },
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${req.headers.get("origin") || 'https://equip-iq.com'}/?success=true`,
      cancel_url: `${req.headers.get("origin") || 'https://equip-iq.com'}/?canceled=true`,
    });

    logStep("Checkout session created", { sessionId: session.id });

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in create-checkout", { message: errorMessage });
    
    const status = error.message?.includes('Authentication') ? 401 : 
                   error.message?.includes('Rate limit') ? 429 : 
                   error.message?.includes('Invalid plan') ? 400 : 500;
    
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status,
    });
  }
});