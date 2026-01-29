import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface SaveKeyRequest {
  lovableApiKey: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { lovableApiKey }: SaveKeyRequest = await req.json();

    if (!lovableApiKey || !lovableApiKey.trim()) {
      return new Response(
        JSON.stringify({ success: false, error: "API key is required" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Validate format - Lovable API keys typically start with specific prefixes
    const key = lovableApiKey.trim();
    if (key.length < 20) {
      return new Response(
        JSON.stringify({ success: false, error: "Invalid API key format" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Save the key to site_config using service role (bypasses RLS)
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Store a masked version for display and the actual key
    const maskedKey = key.substring(0, 8) + "..." + key.substring(key.length - 4);

    // Upsert both the masked display version and the actual secret
    const { error: maskedError } = await supabase
      .from("site_config")
      .upsert({ key: "lovable_api_key", value: maskedKey }, { onConflict: "key" });

    if (maskedError) throw maskedError;

    const { error: secretError } = await supabase
      .from("site_config")
      .upsert({ key: "lovable_api_key_secret", value: key }, { onConflict: "key" });

    if (secretError) throw secretError;

    console.log("Lovable API key saved successfully");

    return new Response(
      JSON.stringify({ success: true, maskedKey }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error: any) {
    console.error("Error saving Lovable API key:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
});
