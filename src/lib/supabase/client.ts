// ═══════════════════════════════════════════════
// ALBELI — Supabase Client (Browser)
// ═══════════════════════════════════════════════
import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/types/database";

let client: ReturnType<typeof createBrowserClient<Database>> | null = null;

export function getSupabaseBrowserClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    return null;
  }

  if (!client) {
    client = createBrowserClient<Database>(url, anonKey);
  }
  return client;
}
