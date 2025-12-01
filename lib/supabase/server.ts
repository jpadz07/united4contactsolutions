import { createClient, SupabaseClient } from "@supabase/supabase-js";

function createSupabaseAdmin(): SupabaseClient {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    // During build time on Vercel, env vars might not be available
    // Create a placeholder client that will fail gracefully at runtime
    if (process.env.VERCEL || process.env.NEXT_PHASE === "phase-production-build") {
      return createClient(
        "https://placeholder.supabase.co",
        "placeholder-service-role-key",
        {
          auth: {
            autoRefreshToken: false,
            persistSession: false,
          },
        }
      );
    }
    throw new Error("Missing Supabase environment variables");
  }

  // Server-side client with service role key for admin operations
  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

// Lazy initialization to prevent build-time errors
export const supabaseAdmin = createSupabaseAdmin();

