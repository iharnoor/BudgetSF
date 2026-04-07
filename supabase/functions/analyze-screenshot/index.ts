import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { supabaseAdmin, getUserId } from "../_shared/supabase.ts";
import { errorResponse } from "../_shared/errors.ts";

const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY")!;
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const EXTRACTION_PROMPT = `You are a financial data extraction assistant. Analyze this bank app screenshot and extract every visible transaction.

Return a JSON array where each element has:
- merchant_name (string): the merchant or payee name
- amount (number): the transaction amount as a positive number
- date (string): the transaction date in YYYY-MM-DD format
- category (string): best-guess category (e.g. "Food & Drink", "Shopping", "Transport", "Entertainment", "Groceries", "Utilities", "Health", "Travel")
- location (string | null): city or location if visible, otherwise null

Only return the JSON array, no other text.`;

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

    const userId = await getUserId(authHeader);

    const { image_url } = await req.json();
    if (!image_url || typeof image_url !== "string") {
      return errorResponse("Missing image_url", 400, "image_url is required");
    }

    // Create screenshot_uploads record
    const { data: upload, error: uploadError } = await supabaseAdmin
      .from("screenshot_uploads")
      .insert({
        user_id: userId,
        image_url,
        status: "processing",
      })
      .select("id")
      .single();

    if (uploadError) throw uploadError;
    const uploadId = upload.id;

    // Call GPT-4o Vision to extract transactions
    const visionRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: EXTRACTION_PROMPT },
              { type: "image_url", image_url: { url: image_url } },
            ],
          },
        ],
        max_tokens: 2000,
      }),
    });

    if (!visionRes.ok) {
      const err = await visionRes.json();
      console.error("OpenAI Vision error:", err);
      await supabaseAdmin
        .from("screenshot_uploads")
        .update({ status: "error", error_message: "Vision API call failed" })
        .eq("id", uploadId);
      throw new Error("Screenshot analysis failed");
    }

    const visionData = await visionRes.json();
    const rawContent = visionData.choices?.[0]?.message?.content ?? "[]";

    // Parse extracted transactions — strip markdown fences if present
    let extracted: Array<{
      merchant_name: string;
      amount: number;
      date: string;
      category: string;
      location: string | null;
    }>;
    try {
      const cleaned = rawContent.replace(/```json?\n?/g, "").replace(/```/g, "").trim();
      extracted = JSON.parse(cleaned);
    } catch {
      await supabaseAdmin
        .from("screenshot_uploads")
        .update({ status: "error", error_message: "Failed to parse extracted data" })
        .eq("id", uploadId);
      return errorResponse("Parse error", 422, "Could not parse transactions from screenshot");
    }

    // Insert transactions
    const insertedIds: string[] = [];
    for (const tx of extracted) {
      const { data: inserted, error: insertError } = await supabaseAdmin
        .from("transactions")
        .insert({
          user_id: userId,
          amount: tx.amount,
          merchant: tx.merchant_name,
          category: tx.category,
          date: tx.date,
          source: "screenshot",
          city: tx.location ?? "San Francisco",
        })
        .select("id")
        .single();

      if (insertError) {
        console.error("Transaction insert error:", insertError);
        continue;
      }

      insertedIds.push(inserted.id);

      // Trigger embed-transaction for each inserted transaction
      try {
        await fetch(`${SUPABASE_URL}/functions/v1/embed-transaction`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
          },
          body: JSON.stringify({
            transaction_id: inserted.id,
            user_id: userId,
          }),
        });
      } catch (embedErr) {
        console.error("Embed trigger error:", embedErr);
      }
    }

    // Update screenshot_uploads with results
    await supabaseAdmin
      .from("screenshot_uploads")
      .update({
        status: "completed",
        extracted_data: extracted,
      })
      .eq("id", uploadId);

    return new Response(
      JSON.stringify({
        upload_id: uploadId,
        transactions_created: insertedIds.length,
        transaction_ids: insertedIds,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    return errorResponse(error, 500, "Screenshot analysis failed");
  }
});
