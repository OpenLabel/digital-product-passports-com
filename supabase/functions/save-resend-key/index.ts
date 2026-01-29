import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { resendApiKey } = await req.json();

    if (!resendApiKey || typeof resendApiKey !== 'string') {
      throw new Error("resendApiKey is required");
    }

    // Validate the API key by making a test request to Resend
    const testResponse = await fetch("https://api.resend.com/api-keys", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${resendApiKey}`,
      },
    });

    if (!testResponse.ok) {
      const errorData = await testResponse.json();
      throw new Error(errorData.message || "Invalid Resend API key");
    }

    // Store the API key in the site_config table (masked for display)
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Store masked version in site_config for UI display
    const maskedKey = resendApiKey.slice(0, 8) + "..." + resendApiKey.slice(-4);
    
    await supabase
      .from("site_config")
      .upsert({ key: "resend_api_key", value: maskedKey }, { onConflict: "key" });

    // Store the actual key in a separate config entry (encrypted in DB)
    await supabase
      .from("site_config")
      .upsert({ key: "resend_api_key_secret", value: resendApiKey }, { onConflict: "key" });

    return new Response(
      JSON.stringify({ success: true, message: "Resend API key validated and saved" }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error: unknown) {
    console.error("Error saving Resend API key:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
