// ═══════════════════════════════════════════════
// ALBELI — Proxy (replaces middleware.ts in Next.js 16+)
// ═══════════════════════════════════════════════
// Handles: Supabase session refresh, admin route protection,
// security headers, optional admin subdomain rewrite.

import { NextResponse, type NextRequest } from "next/server";
import { updateSupabaseSession } from "@/lib/supabase/proxy";
import {
  ADMIN_COOKIE_NAME,
  DEV_COOKIE_NAME,
  verifyAdminSessionToken,
} from "@/lib/auth";

function applySecurityHeaders(res: NextResponse): NextResponse {
  res.headers.set("X-Frame-Options", "DENY");
  res.headers.set("X-Content-Type-Options", "nosniff");
  res.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  res.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()"
  );
  return res;
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ── 1. Supabase session refresh ──
  const { supabaseResponse, user, supabase } = await updateSupabaseSession(request);

  // ── 2. Admin route protection ──
  if (pathname.startsWith("/admin")) {
    // Check for verified admin session token or dev bypass cookie
    const adminSessionToken = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
    const devCookie = request.cookies.get(DEV_COOKIE_NAME)?.value;

    const hasValidSession = adminSessionToken
      ? verifyAdminSessionToken(adminSessionToken)
      : false;
    const hasDevBypass = devCookie === "true";

    if (hasValidSession || hasDevBypass) {
      return applySecurityHeaders(supabaseResponse);
    }

    // If Supabase isn't configured, allow direct access
    if (!supabase) {
      return applySecurityHeaders(supabaseResponse);
    }

    // Not logged in → redirect to login
    if (!user) {
      const loginUrl = new URL("/auth/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Check if user's email matches admin email environment variable
    const adminEmails = [
      process.env.ADMIN_EMAIL,
      process.env.ADMIN_EMAILS,
      process.env.OWNER_EMAIL,
    ]
      .filter(Boolean)
      .flatMap((s) => s!.split(",").map((e) => e.trim().toLowerCase()));

    if (user.email && adminEmails.includes(user.email.toLowerCase())) {
      return applySecurityHeaders(supabaseResponse);
    }

    // Check role in Supabase database profiles
    const { data: profile } = (await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single()) as { data: { role: string } | null };

    const allowedRoles = ["owner", "admin", "staff"];
    if (profile && allowedRoles.includes(profile.role)) {
      // Staff can only access certain admin routes
      if (profile.role === "staff") {
        const staffAllowed = ["/admin", "/admin/products", "/admin/enquiries"];
        const isAllowed = staffAllowed.some(
          (path) => pathname === path || pathname.startsWith(path + "/")
        );
        if (!isAllowed) {
          return NextResponse.redirect(new URL("/admin", request.url));
        }
      }
      return applySecurityHeaders(supabaseResponse);
    }

    // Non-admin Supabase user → redirect to login with clear error
    const unauthorizedUrl = new URL("/auth/login", request.url);
    unauthorizedUrl.searchParams.set("error", "unauthorized_role");
    if (user.email) {
      unauthorizedUrl.searchParams.set("email", user.email);
    }
    return NextResponse.redirect(unauthorizedUrl);
  }

  // ── 3. Security headers for other routes ──
  return applySecurityHeaders(supabaseResponse);
}

export const config = {
  matcher: [
    /*
     * Match all paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico, sitemap.xml, robots.txt
     * - public assets (brand/, images/)
     */
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|brand/|images/).*)",
  ],
};
