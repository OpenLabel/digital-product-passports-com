import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// Input validation schema
const WineOCRSchema = z.object({
  image: z.string()
    .min(1, "Image is required")
    .max(10_000_000, "Image data too large (max ~7MB)")
    .refine(
      (val) => /^data:image\/(png|jpeg|jpg|webp|gif);base64,/.test(val),
      "Invalid image format - must be a valid base64 data URL"
    ),
});

const MONTHLY_LIMIT = 100;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // ===== AUTHENTICATION CHECK =====
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(
        JSON.stringify({ error: "Unauthorized", code: "AUTH_REQUIRED" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    // Create client with user's auth token to verify authentication
    const supabaseAuth = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } }
    });

    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: claimsError } = await supabaseAuth.auth.getClaims(token);
    
    if (claimsError || !claimsData?.claims) {
      return new Response(
        JSON.stringify({ error: "Unauthorized", code: "INVALID_TOKEN" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const userId = claimsData.claims.sub;
    console.log("Authenticated user:", userId);

    // ===== RATE LIMITING CHECK =====
    // Use service role to call the increment function
    const supabaseService = createClient(supabaseUrl, supabaseServiceKey);
    
    const { data: usageData, error: usageError } = await supabaseService.rpc(
      "increment_api_usage",
      {
        p_user_id: userId,
        p_function_name: "wine-label-ocr",
        p_limit: MONTHLY_LIMIT
      }
    );

    if (usageError) {
      console.error("Usage tracking error:", usageError);
      // Don't block the request if usage tracking fails, but log it
    } else if (usageData && !usageData.allowed) {
      console.log("Rate limit exceeded for user:", userId, usageData);
      return new Response(
        JSON.stringify({ 
          error: usageData.message,
          code: "QUOTA_EXCEEDED",
          current_count: usageData.current_count,
          limit: usageData.limit
        }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // ===== INPUT VALIDATION =====
    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return new Response(
        JSON.stringify({ error: "Invalid JSON body" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const parseResult = WineOCRSchema.safeParse(body);
    if (!parseResult.success) {
      return new Response(
        JSON.stringify({ 
          error: "Invalid input", 
          details: parseResult.error.errors.map(e => e.message) 
        }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { image } = parseResult.data;

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Call Lovable AI with the wine label image
    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: `You are a wine label data extractor. Analyze wine label images and extract structured information.
            
Extract the following fields if visible on the label:
- grape_variety: The grape variety (e.g., "Cabernet Sauvignon", "Merlot", "Chardonnay")
- vintage: The year (e.g., "2020") or "NV" for non-vintage
- volume: The bottle volume as a number (e.g., 750 for 750ml)
- volume_unit: The unit (ml, cl, or L)
- country: The country of origin
- region: The wine region (e.g., "Bordeaux", "Napa Valley")
- denomination: Any designation (AOC, AOP, IGP, DOC, DOCG, etc.)
- alcohol_percent: The alcohol percentage as a number (e.g., 13.5)
- producer_name: The winery/producer name
- sugar_classification: Sugar level if mentioned (Brut, Sec, Demi-Sec, Doux, etc.)
- residual_sugar: Residual sugar in g/L if mentioned

Be conservative - only extract data you can clearly read from the label. Do not guess or make up values.`
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Please analyze this wine label and extract all visible information. Return a JSON object with the extracted fields."
              },
              {
                type: "image_url",
                image_url: {
                  url: image
                }
              }
            ]
          }
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "extract_wine_label_data",
              description: "Extract structured data from a wine label image",
              parameters: {
                type: "object",
                properties: {
                  grape_variety: { type: "string", description: "The grape variety" },
                  vintage: { type: "string", description: "The vintage year or NV" },
                  volume: { type: "number", description: "Bottle volume as a number" },
                  volume_unit: { type: "string", enum: ["ml", "cl", "L"], description: "Volume unit" },
                  country: { type: "string", description: "Country of origin" },
                  region: { type: "string", description: "Wine region" },
                  denomination: { type: "string", description: "Wine designation (AOC, AOP, etc.)" },
                  alcohol_percent: { type: "number", description: "Alcohol percentage" },
                  producer_name: { type: "string", description: "Producer/winery name" },
                  sugar_classification: { type: "string", description: "Sugar classification" },
                  residual_sugar: { type: "number", description: "Residual sugar in g/L" }
                },
                additionalProperties: false
              }
            }
          }
        ],
        tool_choice: { type: "function", function: { name: "extract_wine_label_data" } }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI service quota exceeded. Please contact support." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      throw new Error(`AI processing failed: ${response.status}`);
    }

    const aiResponse = await response.json();
    console.log("AI Response for user", userId, ":", JSON.stringify(aiResponse, null, 2));

    // Extract the tool call arguments
    const toolCall = aiResponse.choices?.[0]?.message?.tool_calls?.[0];
    
    if (!toolCall || toolCall.function.name !== "extract_wine_label_data") {
      throw new Error("Unexpected AI response format");
    }

    const extractedData = JSON.parse(toolCall.function.arguments);
    
    // Clean up the data - remove undefined/null values
    const cleanedData: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(extractedData)) {
      if (value !== null && value !== undefined && value !== "") {
        cleanedData[key] = value;
      }
    }

    console.log("Extracted wine data for user", userId, ":", cleanedData);

    // Include remaining quota in response
    const remaining = usageData ? usageData.remaining : null;

    return new Response(
      JSON.stringify({ 
        success: true, 
        extractedData: cleanedData,
        ...(remaining !== null && { quota: { remaining, limit: MONTHLY_LIMIT } })
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("wine-label-ocr error:", error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "Failed to process wine label" 
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
