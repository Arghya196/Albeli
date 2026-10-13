// ═══════════════════════════════════════════════
// ALBELI — Admin Authentication API Route
// ═══════════════════════════════════════════════
// Handles admin passcode login, 1-click access session creation,
// session verification, and admin logout.

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  ADMIN_COOKIE_NAME,
  DEV_COOKIE_NAME,
  verifyAdminPasscode,
  createAdminSessionToken,
  verifyAdminSessionToken,
} from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, password } = body;

    if (action === "login") {
      if (!password || !verifyAdminPasscode(password)) {
        return NextResponse.json(
          {
            success: false,
            error: "Incorrect admin passcode. Please try again or check your environment variables.",
          },
          { status: 401 }
        );
      }

      const token = createAdminSessionToken();
      const response = NextResponse.json({
        success: true,
        message: "Admin authentication successful",
      });

      // 30 days admin session
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

    if (action === "quick-access") {
      const token = createAdminSessionToken();
      const response = NextResponse.json({
        success: true,
        message: "Admin session created via quick access",
      });

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

    if (action === "logout") {
      const response = NextResponse.json({
        success: true,
        message: "Admin logged out successfully",
      });

      response.cookies.set({
        name: ADMIN_COOKIE_NAME,
        value: "",
        path: "/",
        maxAge: 0,
      });

      response.cookies.set({
        name: DEV_COOKIE_NAME,
        value: "",
        path: "/",
        maxAge: 0,
      });

      return response;
    }

    return NextResponse.json(
      { success: false, error: "Invalid action." },
      { status: 400 }
    );
  } catch (error) {
    console.error("[admin auth error]:", error);
    return NextResponse.json(
      { success: false, error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  const devCookie = cookieStore.get(DEV_COOKIE_NAME)?.value;

  const authenticated = verifyAdminSessionToken(token) || devCookie === "true";

  return NextResponse.json({ authenticated });
}
