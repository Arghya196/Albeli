// ═══════════════════════════════════════════════
// ALBELI — Auth Helpers
// ═══════════════════════════════════════════════
import { getSupabaseServerClient } from "@/lib/supabase/server";
import type { UserRole } from "@/types/database";

export interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
  fullName: string | null;
  avatarUrl: string | null;
}

/** Get the current authenticated user with their role (server-side) */
export async function getCurrentUser(): Promise<AuthUser | null> {
  const supabase = await getSupabaseServerClient();
  if (!supabase) return null;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = (await supabase
    .from("profiles")
    .select("role, full_name, avatar_url")
    .eq("id", user.id)
    .single()) as {
    data: { role: UserRole; full_name: string | null; avatar_url: string | null } | null;
  };

  if (!profile) return null;

  return {
    id: user.id,
    email: user.email || "",
    role: profile.role,
    fullName: profile.full_name,
    avatarUrl: profile.avatar_url,
  };
}

/** Check if user has a specific role or higher */
export function hasRole(user: AuthUser | null, ...roles: UserRole[]): boolean {
  if (!user) return false;
  return roles.includes(user.role);
}

/** Check if user is admin or owner */
export function isAdmin(user: AuthUser | null): boolean {
  return hasRole(user, "owner", "admin");
}

/** Check if user is staff or above */
export function isStaffOrAbove(user: AuthUser | null): boolean {
  return hasRole(user, "owner", "admin", "staff");
}

// ═══════════════════════════════════════════════
// Admin Passcode & Session Management
// ═══════════════════════════════════════════════

export const ADMIN_COOKIE_NAME = "albeli_admin_session";
export const DEV_COOKIE_NAME = "albeli_admin_dev";

/** Default fallback passcode when ADMIN_PASSWORD is not set */
export const DEFAULT_ADMIN_PASSWORD = "albeli@admin";

/** Secret for signing admin session tokens */
function getAdminSecret(): string {
  return (
    process.env.ADMIN_SECRET ||
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    "albeli-royal-heritage-secret-key-2026"
  );
}

/** Verify if a provided passcode matches the admin configuration */
export function verifyAdminPasscode(inputPassword: string): boolean {
  if (!inputPassword) return false;
  const configuredPassword = process.env.ADMIN_PASSWORD;

  // If specific ADMIN_PASSWORD is set in env, check against it
  if (configuredPassword) {
    return inputPassword.trim() === configuredPassword.trim();
  }

  // Fallback accepted passwords for seamless setup
  const acceptedPasswords = [
    DEFAULT_ADMIN_PASSWORD,
    "albeli2026",
    "albeli-admin",
    "admin",
  ];
  return acceptedPasswords.includes(inputPassword.trim());
}

/** Create a cryptographically signed admin session token valid for 30 days */
export function createAdminSessionToken(): string {
  const payload = {
    role: "owner",
    iat: Date.now(),
    exp: Date.now() + 30 * 24 * 60 * 60 * 1000, // 30 days
  };

  const payloadStr = JSON.stringify(payload);
  const payloadBase64 = Buffer.from(payloadStr).toString("base64url");

  // Sign with HMAC-SHA256
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const crypto = require("crypto");
  const signature = crypto
    .createHmac("sha256", getAdminSecret())
    .update(payloadBase64)
    .digest("hex");

  return `${payloadBase64}.${signature}`;
}

/** Verify an admin session token */
export function verifyAdminSessionToken(token: string | null | undefined): boolean {
  if (!token) return false;

  try {
    const parts = token.split(".");
    if (parts.length !== 2) return false;

    const [payloadBase64, providedSignature] = parts;

    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const crypto = require("crypto");
    const expectedSignature = crypto
      .createHmac("sha256", getAdminSecret())
      .update(payloadBase64)
      .digest("hex");

    if (providedSignature !== expectedSignature) {
      return false;
    }

    const payload = JSON.parse(
      Buffer.from(payloadBase64, "base64url").toString("utf-8")
    );

    if (!payload.exp || Date.now() > payload.exp) {
      return false;
    }

    return payload.role === "owner" || payload.role === "admin";
  } catch {
    return false;
  }
}
