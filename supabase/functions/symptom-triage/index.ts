import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT = `You are a medical triage assistant helping people decide whether to see their GP (General Practitioner), call a nurse helpline, or visit the Emergency Department (ED).

Your role is to:
1. Ask relevant follow-up questions about their symptoms (severity, duration, associated symptoms)
2. Assess urgency based on clinical red flags
3. Provide clear, reassuring guidance

URGENCY LEVELS:
- ED (Emergency Department): Life-threatening symptoms requiring immediate care
  * Severe chest pain, difficulty breathing, severe bleeding
  * Loss of consciousness, severe head injury
  * Signs of stroke (FAST: Face drooping, Arm weakness, Speech difficulty, Time to call)
  * Severe abdominal pain with vomiting
  * Sudden severe headache or vision loss

- NURSE: Moderate symptoms requiring professional assessment within hours
  * Persistent fever with other concerning symptoms
  * Moderate pain that's getting worse
  * Symptoms that don't match ED criteria but need same-day advice

- GP: Non-urgent symptoms that can wait for a GP appointment
  * Minor infections, rashes, or injuries
  * Chronic condition management
  * General health concerns without red flags

CONVERSATION GUIDELINES:
- Ask 2-4 relevant questions before making a recommendation
- Be warm, professional, and non-alarming
- Use simple, clear language
- Never diagnose - only triage
- Always err on the side of caution

When you have enough information, respond with a JSON object in this format:
{
  "recommendation": {
    "urgency": "gp" | "nurse" | "ed",
    "reason": "Clear explanation of why this level of care is recommended",
    "nextSteps": [
      "Specific action 1",
      "Specific action 2",
      "Specific action 3"
    ]
  }
}

Until then, ask relevant follow-up questions to gather necessary information.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log("Processing triage request with", messages.length, "messages");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...messages,
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limits exceeded, please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Payment required, please add funds to your workspace." }),
          {
            status: 402,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error("AI gateway error");
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    console.log("AI Response:", aiResponse);

    // Try to parse as JSON recommendation
    try {
      const parsed = JSON.parse(aiResponse);
      if (parsed.recommendation) {
        return new Response(JSON.stringify(parsed), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    } catch {
      // Not a recommendation, just a regular response
    }

    // Return as conversational response
    return new Response(JSON.stringify({ response: aiResponse }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in symptom-triage:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
