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

    // Validate the API key format (Resend keys start with "re_")
    if (!resendApiKey.startsWith('re_')) {
      throw new Error("Invalid Resend API key format. Keys should start with 're_'");
    }

    if (resendApiKey.length < 20) {
      throw new Error("Invalid Resend API key format. Key appears too short.");
    }

    // Test the API key by fetching domains (works with most key permissions)
    const testResponse = await fetch("https://api.resend.com/domains", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${resendApiKey}`,
      },
    });

    // If we get 401, the key is invalid
    if (testResponse.status === 401) {
      throw new Error("Invalid Resend API key");
    }

    // If we get 403 (forbidden), the key is valid but restricted - that's OK for sending emails
    // If we get 200, the key has full access
    // Both are acceptable
    if (testResponse.status !== 200 && testResponse.status !== 403) {
      const errorData = await testResponse.json();
      throw new Error(errorData.message || "Failed to validate Resend API key");
    }

    // Store the API key in the site_config table
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Store masked version in site_config for UI display
    const maskedKey = resendApiKey.slice(0, 8) + "..." + resendApiKey.slice(-4);
    
    await supabase
      .from("site_config")
      .upsert({ key: "resend_api_key", value: maskedKey }, { onConflict: "key" });

    // Store the actual key in a separate config entry
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
