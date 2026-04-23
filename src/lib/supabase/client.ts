import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";

const SUPABASE_URL = "https://qsyithltarjqbicthlig.supabase.co";
// Publishable (anon) key — safe to expose in the client.
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_vFtTqZlP-RQzEgiN0Ow4oA_jboslWmd";

export const supabase = createClient<Database>(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storage: typeof window !== "undefined" ? window.localStorage : undefined,
    },
  }
);