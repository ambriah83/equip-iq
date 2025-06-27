
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface InvitationRequest {
  email: string;
  role: string;
  invitedBy: string;
  companyName?: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    )

    const { email, role, invitedBy, companyName }: InvitationRequest = await req.json();

    // Generate invitation token
    const invitationToken = crypto.randomUUID();
    const siteUrl = Deno.env.get('SUPABASE_URL')?.replace('https://', 'https://').replace('.supabase.co', '.lovableproject.com') || 'http://localhost:3000';
    const invitationUrl = `${siteUrl}/accept-invitation?token=${invitationToken}`;

    // Store invitation in database
    const { error: dbError } = await supabaseClient
      .from('user_invitations')
      .insert({
        email,
        role,
        invited_by: invitedBy,
        invitation_token: invitationToken,
        status: 'pending'
      });

    if (dbError) {
      throw new Error(`Database error: ${dbError.message}`);
    }

    // Send invitation email
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

    console.log("Invitation email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, invitationToken }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-invitation function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
