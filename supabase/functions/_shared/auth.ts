import { corsHeaders } from "./cors.ts";

/**
 * Require that the request was made with the service-role key.
 * Use this to protect internal-only Edge Functions (sync-transactions,
 * embed-transaction, nightly-analysis) from being called by end-users.
 *
 * Returns null when authorised; otherwise returns an error Response that
 * the caller should return immediately.
 */
export function requireServiceRole(req: Request): Response | null {
  const authHeader = req.headers.get("Authorization");
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

  if (!authHeader || authHeader !== `Bearer ${serviceKey}`) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  return null;
}
