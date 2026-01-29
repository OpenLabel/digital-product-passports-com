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

    const { data: configData, error: configError } = await supabase
      .from("site_config")
      .select("value")
      .eq("key", "resend_api_key_secret")
      .single();

    if (configError || !configData?.value) {
      throw new Error("Resend API key not configured. Please set it up in the Setup page.");
    }

    const RESEND_API_KEY = configData.value;

    const { userEmail, passportName, passportUrl }: CounterfeitRequest = await req.json();

    if (!userEmail || !passportName || !passportUrl) {
      throw new Error("Missing required fields: userEmail, passportName, passportUrl");
    }

    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "EU Digital Product Passports <onboarding@resend.dev>",
        to: ["contact@cypheme.com"],
        cc: [userEmail],
        subject: `Counterfeit Protection Request - ${passportName}`,
        html: `
          <h1>Counterfeit Protection Request</h1>
          <p>A user has requested counterfeit protection for their Digital Product Passport.</p>
          
          <h2>Details</h2>
          <ul>
            <li><strong>Product Name:</strong> ${passportName}</li>
            <li><strong>Passport URL:</strong> <a href="${passportUrl}">${passportUrl}</a></li>
            <li><strong>User Email:</strong> ${userEmail}</li>
          </ul>
          
          <p>I created this digital product passport and I would like to add a counterfeit protection with a security seal.</p>
          
          <p>Please contact the user to deliver the security seal.</p>
          
          <hr />
          <p style="color: #666; font-size: 12px;">
            This email was sent from <a href="https://www.digital-product-passports.com">EU Digital Product Passports</a>
          </p>
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
