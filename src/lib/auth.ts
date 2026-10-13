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
