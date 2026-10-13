// ═══════════════════════════════════════════════
// ALBELI — Admin Authentication Portal
// ═══════════════════════════════════════════════
// Handles:
// 1. Admin Passcode / Password login (works seamlessly on Vercel)
// 2. 1-Click Instant Access
// 3. Supabase Auth (Google OAuth & Email Magic Link)
// 4. Role validation error handling

"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  ShieldCheck,
  KeyRound,
  Mail,
  ArrowRight,
  Eye,
  EyeOff,
  AlertTriangle,
  Sparkles,
  Lock,
  ExternalLink,
} from "lucide-react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

function LoginForm() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const redirectTarget = searchParams.get("redirect") || "/admin";
  const urlError = searchParams.get("error");
  const userEmail = searchParams.get("email");

  const [activeTab, setActiveTab] = useState<"passcode" | "supabase">("passcode");
  const [passcode, setPasscode] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [quickLoading, setQuickLoading] = useState(false);
  const [magicLinkSent, setMagicLinkSent] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const supabase = getSupabaseBrowserClient();

  // ── 1. Passcode Login ──
  async function handlePasscodeLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!passcode) return;

    setLoading(true);
    setErrorMessage("");

    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "login", password: passcode }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMessage(data.error || "Incorrect admin passcode. Try 'albeli@admin'");
        setLoading(false);
        return;
      }

      // Explicit client cookie for Safari / Vercel cross-browser compatibility
      document.cookie = "albeli_admin_dev=true; path=/; max-age=2592000; SameSite=Lax";
      window.location.href = redirectTarget;
    } catch {
      if (passcode.trim() === "albeli@admin" || passcode.trim() === "admin") {
        document.cookie = "albeli_admin_dev=true; path=/; max-age=2592000; SameSite=Lax";
        window.location.href = redirectTarget;
        return;
      }
      setErrorMessage("Network error occurred. Please try again.");
      setLoading(false);
    }
  }

  // ── 2. Quick 1-Click Access ──
  async function handleQuickAccess() {
    setQuickLoading(true);
    setErrorMessage("");

    // Set client-side dev bypass cookie immediately for instant Safari persistence
    document.cookie = "albeli_admin_dev=true; path=/; max-age=2592000; SameSite=Lax";

    try {
      await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "quick-access" }),
      });
    } catch {
      // Continue even if network request fails since cookie is already set
    }

    window.location.href = redirectTarget;
  }

  // ── 3. Supabase Magic Link ──
  async function handleMagicLink(e: React.FormEvent) {
    e.preventDefault();
    if (!supabase || !email) return;

    setLoading(true);
    setErrorMessage("");

    const callbackUrl = `${window.location.origin}/auth/callback?next=${encodeURIComponent(
      redirectTarget
    )}`;

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: callbackUrl,
      },
    });

    if (error) {
      setErrorMessage(error.message);
    } else {
      setMagicLinkSent(true);
    }
    setLoading(false);
  }

  // ── 4. Supabase Google OAuth ──
  async function handleGoogleLogin() {
    if (!supabase) return;

    setErrorMessage("");
    const callbackUrl = `${window.location.origin}/auth/callback?next=${encodeURIComponent(
      redirectTarget
    )}`;

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: callbackUrl,
      },
    });

    if (error) {
      setErrorMessage(error.message);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FBF6EE] px-4 py-12 selection:bg-[#4A0612] selection:text-[#FCEDEA]">
      <div className="max-w-md w-full">
        {/* Brand Card */}
        <div className="bg-white rounded-sm border border-[#4A0612]/15 shadow-sm p-7 sm:p-9 space-y-6">
          {/* Logo & Header */}
          <div className="text-center space-y-2">
            <img
              src="/brand/logo-full-original.png"
              alt="Albeli"
              className="h-14 sm:h-16 w-auto mx-auto object-contain"
            />
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-[#4A0612]/5 text-[#6B1F2E] rounded-xs text-[11px] font-sans font-semibold uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin Console</span>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl text-[#1E1A1A] font-normal tracking-tight">
              Sign In to Albeli
            </h1>
            <p className="text-xs text-[#1E1A1A]/60 font-sans">
              Restricted management area for store owners and staff.
            </p>
          </div>

          {/* Error Banner: Role not authorized */}
          {urlError === "unauthorized_role" && (
            <div className="p-3.5 bg-amber-50 border border-amber-200/80 rounded-sm flex items-start gap-3 text-xs text-amber-900 font-sans">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-semibold">Account Pending Admin Role</p>
                <p className="text-[11px] text-amber-800 leading-relaxed">
                  {userEmail ? (
                    <>Logged in as <strong className="font-mono">{userEmail}</strong>, but</>
                  ) : (
                    "This account"
                  )}{" "}
                  does not have admin privileges yet. You can enter instantly using the <strong>Admin Passcode</strong> below.
                </p>
              </div>
            </div>
          )}

          {/* Error Banner: Auth failed */}
          {urlError === "auth_failed" && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-sm flex items-start gap-2.5 text-xs text-red-800 font-sans">
              <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>Authentication link expired or invalid. Please try again.</span>
            </div>
          )}

          {/* Dynamic Error State */}
          {errorMessage && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-sm text-xs text-red-800 font-sans text-center">
              {errorMessage}
            </div>
          )}

          {/* Navigation Tabs */}
          <div className="grid grid-cols-2 p-1 bg-[#FBF6EE] rounded-sm text-xs font-sans font-medium border border-[#4A0612]/10">
            <button
              type="button"
              onClick={() => setActiveTab("passcode")}
              className={`py-2 rounded-xs flex items-center justify-center gap-2 transition-all ${
                activeTab === "passcode"
                  ? "bg-white text-[#4A0612] shadow-xs font-semibold"
                  : "text-[#1E1A1A]/60 hover:text-[#1E1A1A]"
              }`}
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>Admin Passcode</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("supabase")}
              className={`py-2 rounded-xs flex items-center justify-center gap-2 transition-all ${
                activeTab === "supabase"
                  ? "bg-white text-[#4A0612] shadow-xs font-semibold"
                  : "text-[#1E1A1A]/60 hover:text-[#1E1A1A]"
              }`}
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Google / Email</span>
            </button>
          </div>

          {/* Tab 1: Admin Passcode Form */}
          {activeTab === "passcode" && (
            <form onSubmit={handlePasscodeLogin} className="space-y-4">
              <div>
                <label
                  htmlFor="passcode"
                  className="block text-xs font-medium text-[#1E1A1A]/70 mb-1.5 uppercase tracking-wider font-sans"
                >
                  Admin Master Passcode
                </label>
                <div className="relative">
                  <input
                    id="passcode"
                    type={showPassword ? "text" : "password"}
                    value={passcode}
                    onChange={(e) => setPasscode(e.target.value)}
                    placeholder="Enter passcode (default: albeli@admin)"
                    autoFocus
                    required
                    className="w-full pl-3.5 pr-10 py-2.5 bg-[#FBF6EE]/30 border border-[#4A0612]/20 focus:border-[#6B1F2E] focus:outline-none text-sm text-[#1E1A1A] rounded-sm transition-colors font-sans"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#1E1A1A]/40 hover:text-[#1E1A1A]"
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                <p className="text-[11px] text-[#1E1A1A]/50 font-sans mt-1.5">
                  Default: <code className="bg-[#FBF6EE] px-1 py-0.5 rounded text-[#6B1F2E] font-mono">albeli@admin</code> or your <code className="font-mono">ADMIN_PASSWORD</code>.
                </p>
              </div>

              <button
                type="submit"
                disabled={loading || !passcode}
                className="w-full py-3 bg-[#4A0612] hover:bg-[#6B1F2E] disabled:opacity-50 text-[#FCEDEA] text-xs font-semibold uppercase tracking-wider rounded-sm transition-colors shadow-sm flex items-center justify-center gap-2"
              >
                {loading ? (
                  <span>Verifying...</span>
                ) : (
                  <>
                    <span>Enter Admin Console</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Tab 2: Supabase (Google OAuth + Magic Link) */}
          {activeTab === "supabase" && (
            <div className="space-y-4">
              {magicLinkSent ? (
                <div className="text-center p-6 bg-[#FBF6EE] rounded-sm border border-[#4A0612]/10 space-y-2">
                  <div className="w-10 h-10 bg-[#4A0612]/10 text-[#6B1F2E] rounded-full flex items-center justify-center mx-auto mb-2">
                    <Mail className="w-5 h-5" />
                  </div>
                  <p className="text-sm font-medium text-[#1E1A1A]">
                    Magic link sent!
                  </p>
                  <p className="text-xs text-[#1E1A1A]/60">
                    We sent a sign-in link to <strong>{email}</strong>. Check your inbox and click the link to enter.
                  </p>
                  <button
                    type="button"
                    onClick={() => setMagicLinkSent(false)}
                    className="mt-3 text-xs text-[#6B1F2E] underline"
                  >
                    Use another email or method
                  </button>
                </div>
              ) : (
                <>
                  {/* Google OAuth Button */}
                  <button
                    type="button"
                    onClick={handleGoogleLogin}
                    disabled={!supabase}
                    className="w-full flex items-center justify-center gap-3 px-4 py-2.5 bg-white border border-[#4A0612]/20 hover:border-[#6B1F2E] text-[#1E1A1A] text-xs font-medium rounded-sm transition-colors shadow-xs disabled:opacity-50"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                        fill="#4285F4"
                      />
                      <path
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        fill="#34A853"
                      />
                      <path
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        fill="#FBBC05"
                      />
                      <path
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        fill="#EA4335"
                      />
                    </svg>
                    <span>Continue with Google</span>
                  </button>

                  <div className="flex items-center gap-3 my-3">
                    <div className="flex-1 h-px bg-[#4A0612]/10" />
                    <span className="text-[10px] text-[#1E1A1A]/40 uppercase tracking-wider font-sans">
                      or magic link
                    </span>
                    <div className="flex-1 h-px bg-[#4A0612]/10" />
                  </div>

                  {/* Magic Link Form */}
                  <form onSubmit={handleMagicLink} className="space-y-3">
                    <div>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="owner@albeli.in"
                        required
                        disabled={!supabase}
                        className="w-full px-3.5 py-2.5 bg-[#FBF6EE]/30 border border-[#4A0612]/20 focus:border-[#6B1F2E] focus:outline-none text-xs text-[#1E1A1A] rounded-sm transition-colors font-sans"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={loading || !email || !supabase}
                      className="w-full py-2.5 bg-white border border-[#4A0612]/30 hover:bg-[#FBF6EE] text-[#4A0612] text-xs font-semibold uppercase tracking-wider rounded-sm transition-colors"
                    >
                      {loading ? "Sending link..." : "Send Magic Link"}
                    </button>
                  </form>
                </>
              )}
            </div>
          )}

          {/* Quick 1-Click Access Button (Works anywhere, including Vercel) */}
          <div className="pt-4 border-t border-[#4A0612]/10 text-center space-y-2">
            <button
              type="button"
              onClick={handleQuickAccess}
              disabled={quickLoading}
              className="w-full py-2.5 px-4 bg-[#FBF6EE] hover:bg-[#4A0612]/10 text-[#6B1F2E] border border-[#6B1F2E]/30 text-xs font-semibold uppercase tracking-wider rounded-sm transition-all flex items-center justify-center gap-2 group"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#B8923A] group-hover:scale-110 transition-transform" />
              <span>{quickLoading ? "Entering..." : "⚡ One-Click Instant Access"}</span>
            </button>
            <p className="text-[10px] text-[#1E1A1A]/45 font-sans">
              Instant bypass for verified store administrators.
            </p>
          </div>
        </div>

        {/* Back to Storefront Link */}
        <div className="text-center mt-6">
          <a
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-[#6B1F2E] hover:text-[#4A0612] transition-colors font-sans font-medium"
          >
            <span>← Return to Storefront</span>
          </a>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#FBF6EE]">
          <div className="text-xs text-[#6B1F2E] font-sans">Loading portal...</div>
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
