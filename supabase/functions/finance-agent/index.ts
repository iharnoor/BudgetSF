import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { supabaseAdmin, getUserId } from "../_shared/supabase.ts";
import { errorResponse } from "../_shared/errors.ts";

const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY")!;
const MAX_MESSAGE_LENGTH = 2000;

const SYSTEM_PROMPT = `You are WealthLens AI, a personal finance assistant for San Francisco residents.
You help users save money by suggesting cheaper, local alternatives to expensive chains and services.
You have deep knowledge of SF neighborhoods, local restaurants, grocery stores, bars, and services.

When recommending places, be specific: include the name, neighborhood, address if you know it, and approximate price.
Prioritize local/independent businesses over chains.
Keep responses concise, friendly, and actionable.
If you reference a venue from the context below, use the real data provided.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("Missing Authorization header");

    const userId = await getUserId(authHeader);

    // ---------- POST: chat with AI ----------
    const { message } = await req.json();
    if (!message || typeof message !== "string") {
      return errorResponse("Missing message", 400, "Message is required");
    }
    if (message.length > MAX_MESSAGE_LENGTH) {
      return errorResponse(
        `Message too long: ${message.length}`,
        400,
        `Message must be ${MAX_MESSAGE_LENGTH} characters or fewer`,
      );
    }
    const sanitizedMessage = message.replace(/<[^>]*>/g, "");

    // 1. Pull relevant venue data for context
    let venueContext = "";
    try {
      // Search for venues matching keywords in the message
      const keywords = sanitizedMessage.toLowerCase();
      let venueQuery = supabaseAdmin
        .from("sf_venues")
        .select("name, category, subcategory, neighborhood, address, price_tier, avg_price, tags, description")
        .eq("city", "San Francisco")
        .lte("price_tier", 2)
        .limit(20);

      // Try to match category from message
      if (keywords.includes("coffee")) {
        venueQuery = venueQuery.eq("subcategory", "coffee");
      } else if (keywords.includes("burrito") || keywords.includes("mexican") || keywords.includes("chipotle") || keywords.includes("taqueria")) {
        venueQuery = venueQuery.eq("subcategory", "mexican");
      } else if (keywords.includes("pizza")) {
        venueQuery = venueQuery.eq("subcategory", "pizza");
      } else if (keywords.includes("pho") || keywords.includes("vietnamese") || keywords.includes("banh mi")) {
        venueQuery = venueQuery.eq("subcategory", "vietnamese");
      } else if (keywords.includes("boba") || keywords.includes("bubble tea")) {
        venueQuery = venueQuery.eq("subcategory", "boba");
      } else if (keywords.includes("ice cream")) {
        venueQuery = venueQuery.eq("subcategory", "ice_cream");
      } else if (keywords.includes("burger")) {
        venueQuery = venueQuery.eq("subcategory", "burgers");
      } else if (keywords.includes("grocer") || keywords.includes("whole foods") || keywords.includes("supermarket")) {
        venueQuery = venueQuery.eq("category", "groceries");
      } else if (keywords.includes("bar") || keywords.includes("drink") || keywords.includes("beer") || keywords.includes("cocktail")) {
        venueQuery = venueQuery.eq("category", "bars");
      } else if (keywords.includes("gym") || keywords.includes("fitness") || keywords.includes("workout")) {
        venueQuery = venueQuery.eq("category", "fitness");
      } else if (keywords.includes("chinese") || keywords.includes("dim sum")) {
        venueQuery = venueQuery.eq("subcategory", "chinese");
      } else if (keywords.includes("mediterranean") || keywords.includes("falafel") || keywords.includes("shawarma")) {
        venueQuery = venueQuery.eq("subcategory", "mediterranean");
      } else {
        // General food query
        venueQuery = venueQuery.eq("category", "food");
      }

      const { data: venues } = await venueQuery;

      if (venues && venues.length > 0) {
        venueContext = "\n\nLocal SF venues data:\n";
        for (const v of venues) {
          venueContext += `- ${v.name} | ${v.subcategory ?? v.category} | ${v.neighborhood ?? "various"} | ${v.avg_price ?? ""} | ${v.description ?? ""}\n`;
        }
      }
    } catch (e) {
      console.error("Venue lookup failed:", e);
      // Continue without context — Gemini can still answer from general knowledge
    }

    // 2. Also pull user's recent transactions for spending context
    let txContext = "";
    try {
      const { data: recentTx } = await supabaseAdmin
        .from("transactions")
        .select("merchant, category, amount, date")
        .eq("user_id", userId)
        .order("date", { ascending: false })
        .limit(20);

      if (recentTx && recentTx.length > 0) {
        txContext = "\n\nUser's recent transactions:\n";
        for (const tx of recentTx) {
          txContext += `- ${tx.merchant ?? "Unknown"} | ${tx.category ?? "N/A"} | $${tx.amount} | ${tx.date}\n`;
        }
      }
    } catch {
      // No transactions table or no data — that's fine
    }

    // 3. Call Gemini
    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: `${SYSTEM_PROMPT}${venueContext}${txContext}\n\nUser question: ${sanitizedMessage}` }],
            },
          ],
          generationConfig: { maxOutputTokens: 1000 },
        }),
      },
    );

    if (!geminiRes.ok) {
      const err = await geminiRes.json();
      console.error("Gemini error:", err);
      throw new Error("AI response generation failed");
    }

    const geminiData = await geminiRes.json();
    const assistantContent =
      geminiData.candidates?.[0]?.content?.parts?.[0]?.text ?? "I couldn't generate a response. Please try again.";

    // 4. Save both messages
    await supabaseAdmin.from("chat_messages").insert([
      { user_id: userId, role: "user", content: sanitizedMessage },
      { user_id: userId, role: "assistant", content: assistantContent },
    ]);

    // 5. Return as SSE format (matching what the iOS client expects)
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      start(controller) {
        // Send the full response as one chunk
        const chunk = JSON.stringify({
          choices: [{ delta: { content: assistantContent } }],
        });
        controller.enqueue(encoder.encode(`data: ${chunk}\n\n`));
        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        ...corsHeaders,
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    return errorResponse(error);
  }
});
