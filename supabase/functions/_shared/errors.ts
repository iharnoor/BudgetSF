import { corsHeaders } from "./cors.ts";

/**
 * Build a safe error Response.
 *
 * Logs the full error server-side but only returns a generic message to the
 * client so internal details (SQL errors, stack traces, file paths) are never
 * exposed.
 */
export function errorResponse(
  error: unknown,
  status = 400,
  publicMessage = "An error occurred. Please try again.",
): Response {
  // Log full detail for operators
  console.error("[Edge Function Error]", error);

  return new Response(
    JSON.stringify({ error: publicMessage }),
    {
      status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    },
  );
}
