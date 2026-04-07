const allowedOrigin =
  Deno.env.get("ALLOWED_ORIGIN") ??
  Deno.env.get("SUPABASE_URL") ??
  "";

export const corsHeaders: Record<string, string> = {
  "Access-Control-Allow-Origin": allowedOrigin,
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Max-Age": "86400",
};
