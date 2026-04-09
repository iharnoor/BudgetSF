import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { supabaseAdmin } from "../_shared/supabase.ts";
import { requireServiceRole } from "../_shared/auth.ts";
import { errorResponse } from "../_shared/errors.ts";

const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY")!;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  // Only callable with the service-role key (from sync-transactions)
  const denied = requireServiceRole(req);
  if (denied) return denied;

  try {
    const { transaction_id, user_id } = await req.json();
    if (
      !transaction_id ||
      typeof transaction_id !== "string" ||
      !user_id ||
      typeof user_id !== "string"
    ) {
      return errorResponse("Invalid parameters", 400, "Bad request");
    }

    // Fetch the transaction
    const { data: txn, error: txnError } = await supabaseAdmin
      .from("transactions")
      .select("merchant, category, amount, date")
      .eq("id", transaction_id)
      .eq("user_id", user_id)
      .single();

    if (txnError || !txn) {
      throw new Error("Transaction not found");
    }

    // Build text for embedding
    const text = `${txn.merchant ?? "Unknown"} | ${txn.category ?? "Uncategorized"} | $${txn.amount} | ${txn.date}`;

    // Call OpenAI embeddings API
    const embeddingRes = await fetch("https://api.openai.com/v1/embeddings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "text-embedding-3-small",
        input: text,
      }),
    });

    if (!embeddingRes.ok) {
      const err = await embeddingRes.json();
      console.error("OpenAI embedding error:", err);
      throw new Error("Embedding generation failed");
    }

    const embeddingData = await embeddingRes.json();
    const embedding = embeddingData.data[0].embedding;

    // Update the transaction with the embedding vector
    const { error: updateError } = await supabaseAdmin
      .from("transactions")
      .update({ embedding })
      .eq("id", transaction_id);

    if (updateError) {
      throw new Error(`Failed to update embedding: ${updateError.message}`);
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return errorResponse(error, 500, "Embedding update failed");
  }
});
