import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// Input validation schema - Resend API keys start with "re_" and are alphanumeric
const ResendKeySchema = z.object({
  resendApiKey: z.string()
    .min(20, "API key is too short")
    .max(200, "API key is too long")
    .regex(/^re_[a-zA-Z0-9_]+$/, "Invalid Resend API key format. Keys should start with 're_' and contain only alphanumeric characters and underscores"),
});

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse and validate input
    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return new Response(
        JSON.stringify({ success: false, error: "Invalid JSON body" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const parseResult = ResendKeySchema.safeParse(body);
    if (!parseResult.success) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: parseResult.error.errors[0]?.message || "Invalid input" 
        }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const { resendApiKey } = parseResult.data;

    // Store the API key in the site_config table
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Check if key already exists - only allow initial setup
    const { data: existingKey } = await supabase
      .from("site_config")
      .select("key")
      .eq("key", "resend_api_key_secret")
      .maybeSingle();

    if (existingKey) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "API key already configured. To modify, manually clear the site_config table first." 
        }),
        { status: 403, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Store masked version in site_config for UI display
    const maskedKey = resendApiKey.slice(0, 8) + "..." + resendApiKey.slice(-4);
    
    const { error: error1 } = await supabase
      .from("site_config")
      .insert({ key: "resend_api_key", value: maskedKey });

    if (error1) {
      console.error("Error saving masked key:", error1);
      throw new Error("Failed to save API key");
    }

    // Store the actual key in a separate config entry
    const { error: error2 } = await supabase
      .from("site_config")
      .insert({ key: "resend_api_key_secret", value: resendApiKey });

    if (error2) {
      console.error("Error saving secret key:", error2);
      throw new Error("Failed to save API key");
    }

    console.log("Resend API key saved successfully");

    return new Response(
      JSON.stringify({ success: true, message: "Resend API key saved successfully" }),
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
