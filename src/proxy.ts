// ═══════════════════════════════════════════════
// ALBELI — Proxy (replaces middleware.ts in Next.js 16+)
// ═══════════════════════════════════════════════
// Handles: Supabase session refresh, admin route protection,
// security headers, optional admin subdomain rewrite.

import { NextResponse, type NextRequest } from "next/server";
import { updateSupabaseSession } from "@/lib/supabase/proxy";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ── 1. Supabase session refresh ──
  const { supabaseResponse, user, supabase } = await updateSupabaseSession(request);

  // ── 2. Admin route protection ──
  if (pathname.startsWith("/admin")) {
    // If Supabase isn't configured or dev cookie present in development, allow access
    const devCookie = request.cookies.get("albeli_admin_dev")?.value;
    if (!supabase || (process.env.NODE_ENV === "development" && devCookie === "true")) {
      return supabaseResponse;
    }

    // Not logged in → redirect to login
    if (!user) {
      const loginUrl = new URL("/auth/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Check role
    const { data: profile } = (await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single()) as { data: { role: string } | null };

    const allowedRoles = ["owner", "admin", "staff"];
    if (!profile || !allowedRoles.includes(profile.role)) {
      // Non-admin users silently redirected to storefront
      return NextResponse.redirect(new URL("/", request.url));
    }

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
  }

  // ── 3. Security headers ──
  const response = supabaseResponse;
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()"
  );

  return response;
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
