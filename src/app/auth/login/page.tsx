// ═══════════════════════════════════════════════
// ALBELI — Auth Login Page
// ═══════════════════════════════════════════════
// Used for admin access. Customers don't need to log in.
// Supports Google OAuth + email magic link via Supabase.

"use client";

import { useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const supabase = getSupabaseBrowserClient();

  async function handleMagicLink(e: React.FormEvent) {
    e.preventDefault();
    if (!supabase || !email) return;

    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setError(error.message);
    } else {
      setSent(true);
    }
    setLoading(false);
  }

  async function handleGoogleLogin() {
    if (!supabase) return;

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setError(error.message);
    }
  }

  if (!supabase) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FBF6EE] px-4">
        <div className="max-w-md w-full text-center p-8 bg-white rounded-sm border border-[#4A0612]/10 shadow-xs">
          <img
            src="/brand/logo-full-original.png"
            alt="Albeli"
            className="h-16 w-auto mx-auto mb-6"
          />
          <h1 className="font-display text-2xl text-[#1E1A1A] mb-2">Admin Portal</h1>
          <p className="text-xs text-[#1E1A1A]/70 leading-relaxed mb-6">
            Supabase auth credentials are not yet configured in <code className="text-[#6B1F2E] font-mono">.env.local</code>. You can access the Admin Panel directly in <strong>Local Development Mode</strong>.
          </p>
          <div className="space-y-3">
            <a
              href="/admin"
              className="block w-full py-3 bg-[#4A0612] hover:bg-[#6B1F2E] text-[#FCEDEA] text-xs font-semibold uppercase tracking-wider rounded-sm transition-colors shadow-sm"
            >
              Enter Admin Panel (Dev Mode) →
            </a>
            <a
              href="/"
              className="block text-xs text-[#6B1F2E] hover:underline"
            >
              ← Return to Storefront
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-cream px-4">
      <div className="max-w-sm w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <img
            src="/brand/logo-full-original.png"
            alt="Albeli"
            className="h-16 w-auto mx-auto mb-4"
          />
          <h1 className="font-display text-2xl text-oxblood">Sign in</h1>
          <p className="text-sm text-kajal/60 mt-1">
            Admin access only. Customers don&apos;t need to log in.
          </p>
        </div>

        {sent ? (
          <div className="text-center p-6 bg-white rounded-sm border border-rose">
            <p className="text-sm text-kajal">
              ✨ Magic link sent to <strong>{email}</strong>
            </p>
            <p className="text-xs text-kajal/50 mt-2">
              Check your inbox and click the link to sign in.
            </p>
          </div>
        ) : (
          <>
            {/* Google Login */}
            <button
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white border border-rose hover:border-maroon text-kajal text-sm font-medium rounded-sm transition-colors duration-200"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
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
              Continue with Google
            </button>

            <div className="flex items-center gap-4 my-6">
              <div className="flex-1 h-px bg-rose" />
              <span className="text-xs text-kajal/40 uppercase tracking-wider">
                or
              </span>
              <div className="flex-1 h-px bg-rose" />
            </div>

            {/* Magic Link */}
            <form onSubmit={handleMagicLink} className="space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="block text-xs font-medium text-kajal/70 mb-1.5 uppercase tracking-wider"
                >
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full px-4 py-3 bg-white border border-rose focus:border-maroon focus:outline-none text-sm text-kajal rounded-sm transition-colors duration-200"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full px-4 py-3 bg-oxblood text-blush text-sm font-medium rounded-sm hover:bg-maroon transition-colors duration-200 disabled:opacity-50 active:scale-[0.98]"
              >
                {loading ? "Sending..." : "Send magic link"}
              </button>
            </form>
            {/* Dev Mode Instant Access */}
            <div className="mt-6 pt-6 border-t border-rose/60 text-center">
              <button
                type="button"
                onClick={() => {
                  document.cookie = "albeli_admin_dev=true; path=/; max-age=86400";
                  window.location.href = "/admin";
                }}
                className="w-full py-2.5 px-4 bg-white border border-maroon/30 text-maroon hover:bg-maroon hover:text-blush text-xs font-semibold uppercase tracking-wider rounded-sm transition-all"
              >
                ⚡ Enter as Admin (Local Dev Mode)
              </button>
              <p className="text-[10px] text-kajal/40 mt-1.5">
                Bypasses OAuth for instant local testing of admin CRUD
              </p>
            </div>
          </>
        )}

        {error && (
          <p className="mt-4 text-xs text-red-600 text-center">{error}</p>
        )}

        {/* Back to store */}
        <div className="text-center mt-6">
          <a
            href="/"
            className="text-xs text-maroon hover:text-oxblood transition-colors duration-200"
          >
            ← Back to store
          </a>
        </div>
      </div>
    </div>
  );
}
