// ═══════════════════════════════════════════════
// ALBELI — Environment Configuration
// ═══════════════════════════════════════════════
// Centralised env access with runtime validation.
// Optional services degrade gracefully when keys are missing.

function getEnvVar(key: string, fallback?: string): string {
  const value = process.env[key] || fallback;
  if (!value) {
    // Don't throw — just warn. App should work without optional services.
    if (typeof window === "undefined") {
      console.warn(`[env] Missing: ${key}`);
    }
    return "";
  }
  return value;
}

export const env = {
  // ── Supabase (optional — app works without) ──
  supabase: {
    url: getEnvVar("NEXT_PUBLIC_SUPABASE_URL"),
    anonKey: getEnvVar("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
    serviceRoleKey: getEnvVar("SUPABASE_SERVICE_ROLE_KEY"),
    get isConfigured() {
      return Boolean(this.url && this.anonKey);
    },
  },

  // ── Site ──
  site: {
    url: getEnvVar("NEXT_PUBLIC_SITE_URL", "http://localhost:3000"),
    whatsappNumber: getEnvVar("NEXT_PUBLIC_WHATSAPP_NUMBER", "+91XXXXXXXXXX"),
    instagramHandle: getEnvVar("NEXT_PUBLIC_INSTAGRAM_HANDLE", "albelihouse"),
  },

  // ── Optional Services ──
  resend: {
    apiKey: getEnvVar("RESEND_API_KEY"),
    get isConfigured() {
      return Boolean(this.apiKey);
    },
  },

  upstash: {
    redisUrl: getEnvVar("UPSTASH_REDIS_REST_URL"),
    redisToken: getEnvVar("UPSTASH_REDIS_REST_TOKEN"),
    get isConfigured() {
      return Boolean(this.redisUrl && this.redisToken);
    },
  },

  analytics: {
    gaMeasurementId: getEnvVar("NEXT_PUBLIC_GA_MEASUREMENT_ID"),
    sentryDsn: getEnvVar("SENTRY_DSN"),
  },

  admin: {
    hostname: getEnvVar("ADMIN_HOSTNAME"),
  },
} as const;
