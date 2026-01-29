import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// Input validation schema - Lovable API keys are alphanumeric strings
const LovableKeySchema = z.object({
  lovableApiKey: z.string()
    .min(20, "API key is too short")
    .max(500, "API key is too long")
    .regex(/^[a-zA-Z0-9_\-]+$/, "Invalid API key format. Keys should contain only alphanumeric characters, underscores, and hyphens"),
});

serve(async (req) => {
  // Handle CORS preflight requests
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

    const parseResult = LovableKeySchema.safeParse(body);
    if (!parseResult.success) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: parseResult.error.errors[0]?.message || "Invalid input" 
        }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const { lovableApiKey } = parseResult.data;

    // Save the key to site_config using service role (bypasses RLS)
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Check if key already exists - only allow initial setup
    const { data: existingKey } = await supabase
      .from("site_config")
      .select("key")
      .eq("key", "lovable_api_key_secret")
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

    // Store a masked version for display and the actual key
    const maskedKey = lovableApiKey.substring(0, 8) + "..." + lovableApiKey.substring(lovableApiKey.length - 4);

    // Insert both the masked display version and the actual secret
    const { error: maskedError } = await supabase
      .from("site_config")
      .insert({ key: "lovable_api_key", value: maskedKey });

    if (maskedError) throw maskedError;

    const { error: secretError } = await supabase
      .from("site_config")
      .insert({ key: "lovable_api_key_secret", value: lovableApiKey });

    if (secretError) throw secretError;

    console.log("Lovable API key saved successfully");

    return new Response(
      JSON.stringify({ success: true, maskedKey }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error: unknown) {
    console.error("Error saving Lovable API key:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
});
