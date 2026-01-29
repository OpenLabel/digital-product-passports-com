import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface CounterfeitRequest {
  userEmail: string;
  passportName: string;
  passportUrl: string;
  requestedAt: string; // ISO timestamp
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get Resend API key from site_config
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Fetch Resend API key
    const { data: configData, error: configError } = await supabase
      .from("site_config")
      .select("key, value")
      .in("key", ["resend_api_key_secret", "sender_email", "company_name"]);

    if (configError) {
      throw new Error("Failed to fetch configuration");
    }

    const config: Record<string, string> = {};
    configData?.forEach((row: { key: string; value: string | null }) => {
      config[row.key] = row.value || "";
    });

    if (!config.resend_api_key_secret) {
      throw new Error("Resend API key not configured. Please set it up in the Setup page.");
    }

    const RESEND_API_KEY = config.resend_api_key_secret;
    const senderEmail = config.sender_email;
    const companyName = config.company_name || "Digital Product Passports";

    if (!senderEmail) {
      throw new Error("Sender email not configured. Please set it up in the Setup page.");
    }

    const { userEmail, passportName, passportUrl, requestedAt }: CounterfeitRequest = await req.json();

    if (!userEmail || !passportName || !passportUrl) {
      throw new Error("Missing required fields: userEmail, passportName, passportUrl");
    }

    // Format the date and time
    const requestDate = new Date(requestedAt || new Date().toISOString());
    const formattedDate = requestDate.toLocaleDateString('en-GB', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    });
    const formattedTime = requestDate.toLocaleTimeString('en-GB', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });

    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: `${companyName} <${senderEmail}>`,
        to: ["contact@cypheme.com"],
        cc: [userEmail],
        subject: `Counterfeit Protection Request - ${passportName}`,
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #1a1a1a; margin-bottom: 24px;">Counterfeit Protection Request</h2>
            
            <p style="color: #333; font-size: 16px; line-height: 1.6;">
              Hello,
            </p>
            
            <p style="color: #333; font-size: 16px; line-height: 1.6;">
              I have created a Digital Product Passport and would like to add counterfeit protection with a security seal.
            </p>
            
            <div style="background-color: #f8f9fa; border-radius: 8px; padding: 20px; margin: 24px 0;">
              <h3 style="color: #1a1a1a; margin: 0 0 16px 0; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">Product Details</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="color: #666; padding: 8px 0; font-size: 14px; width: 120px;">Product Name</td>
                  <td style="color: #1a1a1a; padding: 8px 0; font-size: 14px; font-weight: 500;">${passportName}</td>
                </tr>
                <tr>
                  <td style="color: #666; padding: 8px 0; font-size: 14px;">Passport URL</td>
                  <td style="padding: 8px 0; font-size: 14px;">
                    <a href="${passportUrl}" style="color: #2563eb; text-decoration: none;">${passportUrl}</a>
                  </td>
                </tr>
                <tr>
                  <td style="color: #666; padding: 8px 0; font-size: 14px;">Contact Email</td>
                  <td style="color: #1a1a1a; padding: 8px 0; font-size: 14px;">${userEmail}</td>
                </tr>
              </table>
            </div>
            
            <p style="color: #333; font-size: 16px; line-height: 1.6;">
              Please contact me to discuss the security seal options and delivery.
            </p>
            
            <p style="color: #333; font-size: 16px; line-height: 1.6;">
              Thank you,<br/>
              <span style="color: #666;">${userEmail}</span>
            </p>
            
            <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 32px 0;" />
            
            <p style="color: #999; font-size: 12px; line-height: 1.5;">
              <strong>Why did I receive this email?</strong><br/>
              This email was sent because on ${formattedDate} at ${formattedTime}, the user clicked "Enable" on the counterfeit protection feature 
              in their Digital Product Passport editor.
            </p>
            
            <p style="color: #999; font-size: 12px; line-height: 1.5;">
              <strong>Was this a mistake?</strong><br/>
              If you did not intend to request counterfeit protection, simply reply to this email thread to let us know it was sent in error.
            </p>
          </div>
        `,
      }),
    });

    const responseData = await emailResponse.json();

    if (!emailResponse.ok) {
      console.error("Resend API error:", responseData);
      throw new Error(responseData.message || "Failed to send email");
    }

    console.log("Counterfeit protection email sent:", responseData);

    return new Response(JSON.stringify({ success: true, data: responseData }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: unknown) {
    console.error("Error sending counterfeit protection email:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
