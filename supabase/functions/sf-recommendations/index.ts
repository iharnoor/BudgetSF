import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { getUserId } from "../_shared/supabase.ts";
import { errorResponse } from "../_shared/errors.ts";

const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY")!;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return errorResponse("Method not allowed", 405, "Method not allowed");
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("Missing Authorization header");

    await getUserId(authHeader); // verify auth

    const { category, budget_range } = await req.json();
    if (!category || typeof category !== "string") {
      return errorResponse("Missing category", 400, "category is required");
    }

    const budgetClause = budget_range
      ? ` The user's budget range is ${budget_range}.`
      : "";

    const prompt = `Recommend the top 5 spots in San Francisco for the "${category}" spending category.${budgetClause}

Return a JSON array where each element has:
- name (string): business name
- category (string): specific sub-category
- price_range (string): e.g. "$", "$$", "$$$"
- neighborhood (string): SF neighborhood
- description (string): one-sentence description of why it's recommended
- estimated_cost (string): typical cost per visit

Only return the JSON array, no other text.`;

    const chatRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 1500,
      }),
    });

    if (!chatRes.ok) {
      const err = await chatRes.json();
      console.error("OpenAI error:", err);
      throw new Error("Failed to generate recommendations");
    }

    const chatData = await chatRes.json();
    const rawContent = chatData.choices?.[0]?.message?.content ?? "[]";

    let recommendations: unknown[];
    try {
      const cleaned = rawContent.replace(/```json?\n?/g, "").replace(/```/g, "").trim();
      recommendations = JSON.parse(cleaned);
    } catch {
      throw new Error("Failed to parse recommendations from AI response");
    }

    return new Response(
      JSON.stringify({
        category,
        city: "San Francisco",
        budget_range: budget_range ?? null,
        recommendations,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    return errorResponse(error, 500, "Failed to generate recommendations");
  }
});
