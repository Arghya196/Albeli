// ═══════════════════════════════════════════════
// ALBELI — Auth Callback Handler
// ═══════════════════════════════════════════════
// Handles the redirect from Supabase auth (magic link, OAuth).
// Exchanges the code for a session, then redirects to the intended page.

import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import {
  ADMIN_COOKIE_NAME,
  DEV_COOKIE_NAME,
  createAdminSessionToken,
} from "@/lib/auth";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/admin";

  if (code) {
    const supabase = await getSupabaseServerClient();
    if (supabase) {
      const { data, error } = await supabase.auth.exchangeCodeForSession(code);
      if (!error && data?.session) {
        const response = NextResponse.redirect(`${origin}${next}`);

        // Set admin session tokens for verified login
        const token = createAdminSessionToken();
        const maxAge = 30 * 24 * 60 * 60;
        const isProduction = process.env.NODE_ENV === "production";

        response.cookies.set({
          name: ADMIN_COOKIE_NAME,
          value: token,
          httpOnly: true,
          secure: isProduction,
          sameSite: "lax",
          path: "/",
          maxAge,
        });

        response.cookies.set({
          name: DEV_COOKIE_NAME,
          value: "true",
          httpOnly: false,
          secure: isProduction,
          sameSite: "lax",
          path: "/",
          maxAge,
        });

        return response;
      }
    }
  }

  // If something went wrong, redirect to login with error
  return NextResponse.redirect(`${origin}/auth/login?error=auth_failed`);
}
