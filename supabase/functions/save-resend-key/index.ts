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
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    // Use service role client to check setup status (no auth needed for this check)
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Check if setup is already complete
    const { data: setupData } = await supabase
      .from("site_config")
      .select("value")
      .eq("key", "setup_complete")
      .single();

    const isSetupComplete = setupData?.value === "true";

    // If setup is complete, require authentication
    if (isSetupComplete) {
      const authHeader = req.headers.get("Authorization");
      if (!authHeader?.startsWith("Bearer ")) {
        return new Response(
          JSON.stringify({ success: false, error: "Unauthorized" }),
          { status: 401, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      // Verify the user is authenticated
      const supabaseAuth = createClient(supabaseUrl, supabaseAnonKey, {
        global: { headers: { Authorization: authHeader } }
      });

      const token = authHeader.replace("Bearer ", "");
      const { data: claimsData, error: claimsError } = await supabaseAuth.auth.getClaims(token);
      
      if (claimsError || !claimsData?.claims) {
        return new Response(
          JSON.stringify({ success: false, error: "Unauthorized" }),
          { status: 401, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      console.log("Authenticated request from user:", claimsData.claims.sub);
    } else {
      console.log("Initial setup mode - allowing unauthenticated access");
    }

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

    // Check if key already exists - only allow initial setup
    const { data: existingKey } = await supabase.rpc("encrypted_secret_exists", {
      p_name: "resend_api_key"
    });

    if (existingKey) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "API key already configured. To modify, manually clear the encrypted_secrets table first." 
        }),
        { status: 403, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Store encrypted using pgcrypto
    const { error: encryptError } = await supabase.rpc("store_encrypted_secret", {
      p_name: "resend_api_key",
      p_value: resendApiKey,
      p_description: "Resend API key for sending emails"
    });

    if (encryptError) {
      console.error("Error storing encrypted key:", encryptError);
      throw new Error("Failed to save API key");
    }

    // Store masked version in site_config for UI display
    const maskedKey = resendApiKey.slice(0, 8) + "..." + resendApiKey.slice(-4);
    
    const { error: configError } = await supabase
      .from("site_config")
      .upsert({ key: "resend_api_key", value: maskedKey }, { onConflict: "key" });

    if (configError) {
      console.error("Error saving masked key:", configError);
      // Non-fatal - the encrypted key is what matters
    }

    console.log("Resend API key saved successfully (encrypted)");

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
