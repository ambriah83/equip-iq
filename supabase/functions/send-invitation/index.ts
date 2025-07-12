import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { Resend } from "npm:resend@2.0.0";
import { getCorsHeaders, handleCors } from "../_shared/cors.ts";
import { requireAuth } from "../_shared/auth.ts";
import { validateRequired, validateString, validateEmail, validateArray, validateEnum } from "../_shared/validation.ts";
import { checkRateLimit } from "../_shared/rate-limit.ts";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

interface InvitationRequest {
  email: string;
  role: string;
  invitedBy: string;
  companyName?: string;
  locationAccess?: string[];
}

const VALID_ROLES = ["admin", "manager", "viewer", "super_admin"];

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  const corsHeaders = getCorsHeaders(req);

  try {
    // Require authentication
    const { user, supabase: supabaseClient } = await requireAuth(req);
    
    // Rate limiting - 5 invitations per hour per user to prevent spam
    const rateLimitResult = await checkRateLimit(req, user.id, {
      maxRequests: 5,
      windowMs: 60 * 60 * 1000, // 1 hour
      identifier: "send-invitation"
    });

    if (!rateLimitResult.allowed) {
      return new Response(JSON.stringify({
        error: "Rate limit exceeded. You can only send 5 invitations per hour.",
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

    const requestData: InvitationRequest = await req.json();
    const { email, role, invitedBy, companyName, locationAccess = [] } = requestData;

    // Validate inputs
    validateRequired(email, "email");
    validateEmail(email);
    
    validateRequired(role, "role");
    validateString(role, "role", 1, 50);
    validateEnum(role, "role", VALID_ROLES);
    
    validateRequired(invitedBy, "invitedBy");
    validateString(invitedBy, "invitedBy", 1, 100);
    
    if (companyName) {
      validateString(companyName, "companyName", 1, 100);
    }
    
    if (locationAccess && locationAccess.length > 0) {
      validateArray(locationAccess, "locationAccess", 0, 50);
      locationAccess.forEach((loc, index) => {
        validateString(loc, `locationAccess[${index}]`, 1, 100);
      });
    }

    // Check if the inviting user has permission to send invitations
    const { data: inviterData, error: inviterError } = await supabaseClient
      .from('user_permissions')
      .select('permission')
      .eq('user_id', user.id)
      .in('permission', ['super_admin', 'can_invite_users'])
      .single();

    if (inviterError || !inviterData) {
      // Also check if they're a location admin
      const { data: adminLocations } = await supabaseClient
        .from('user_location_access')
        .select('location_id')
        .eq('user_id', user.id)
        .eq('access_level', 'admin');

      if (!adminLocations || adminLocations.length === 0) {
        throw new Error("You don't have permission to send invitations");
      }
    }

    // Check if user already exists
    const { data: existingUser } = await supabaseClient
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    if (existingUser) {
      throw new Error("A user with this email already exists");
    }

    // Check if there's already a pending invitation
    const { data: existingInvitation } = await supabaseClient
      .from('user_invitations')
      .select('id')
      .eq('email', email)
      .eq('status', 'pending')
      .single();

    if (existingInvitation) {
      throw new Error("There's already a pending invitation for this email");
    }

    // Generate invitation token
    const invitationToken = crypto.randomUUID();
    const siteUrl = Deno.env.get('SITE_URL') || 
                   Deno.env.get('SUPABASE_URL')?.replace('https://', 'https://').replace('.supabase.co', '.lovableproject.com') || 
                   'http://localhost:3000';
    const invitationUrl = `${siteUrl}/accept-invitation?token=${invitationToken}`;

    // Store invitation in database with location access
    const { error: dbError } = await supabaseClient
      .from('user_invitations')
      .insert({
        email,
        role,
        invited_by: user.id, // Use authenticated user's ID
        invitation_token: invitationToken,
        status: 'pending',
        location_access: locationAccess,
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days
      });

    if (dbError) {
      console.error("Database error:", dbError);
      throw new Error(`Failed to create invitation: ${dbError.message}`);
    }

    // Send invitation email
    try {
      const emailResponse = await resend.emails.send({
        from: "EquipIQ <onboarding@resend.dev>",
        to: [email],
        subject: `You're invited to join ${companyName || 'our team'} on EquipIQ`,
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #1e293b; font-size: 28px; margin: 0;">EquipIQ</h1>
              <p style="color: #64748b; font-size: 16px; margin: 5px 0 0 0;">AI-Powered Equipment Management</p>
            </div>
            
            <div style="background: #f8fafc; border-radius: 8px; padding: 30px; margin-bottom: 30px;">
              <h2 style="color: #1e293b; font-size: 24px; margin: 0 0 15px 0;">You're Invited!</h2>
              <p style="color: #475569; font-size: 16px; line-height: 1.5; margin: 0 0 20px 0;">
                You've been invited to join ${companyName || 'the team'} on EquipIQ as a <strong>${role}</strong>. 
                EquipIQ helps manage equipment maintenance, track warranties, and streamline operations with AI assistance.
              </p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${invitationUrl}" 
                   style="background: #3b82f6; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: 600; display: inline-block;">
                  Accept Invitation
                </a>
              </div>
              
              <p style="color: #64748b; font-size: 14px; margin: 20px 0 0 0;">
                This invitation will expire in 7 days. If you have any questions, please contact your administrator.
              </p>
            </div>
            
            <div style="text-align: center; color: #94a3b8; font-size: 12px;">
              <p>If you didn't expect this invitation, you can safely ignore this email.</p>
            </div>
          </div>
        `,
      });

      console.log(`Invitation sent to ${email} by user ${user.id}`);

      return new Response(JSON.stringify({ 
        success: true, 
        message: "Invitation sent successfully",
        remaining: rateLimitResult.remaining - 1
      }), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
          'X-RateLimit-Remaining': (rateLimitResult.remaining - 1).toString(),
          'X-RateLimit-Reset': rateLimitResult.resetAt.toISOString()
        },
      });
    } catch (emailError) {
      console.error("Email sending error:", emailError);
      // Delete the invitation if email fails
      await supabaseClient
        .from('user_invitations')
        .delete()
        .eq('invitation_token', invitationToken);
      
      throw new Error("Failed to send invitation email. Please try again.");
    }
  } catch (error: any) {
    console.error("Error in send-invitation function:", error);
    
    const status = error.message?.includes('Authentication') ? 401 : 
                   error.message?.includes('Rate limit') ? 429 : 
                   error.message?.includes('permission') ? 403 :
                   error.message?.includes('already exists') ? 409 : 400;
    
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);