import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { image } = await req.json();
    
    if (!image) {
      return new Response(
        JSON.stringify({ error: "No image provided" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

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
    console.log("AI Response:", JSON.stringify(aiResponse, null, 2));

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

    console.log("Extracted wine data:", cleanedData);

    return new Response(
      JSON.stringify({ 
        success: true, 
        extractedData: cleanedData 
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
