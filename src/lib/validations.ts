// ═══════════════════════════════════════════════
// ALBELI — Zod Validation Schemas
// ═══════════════════════════════════════════════
import { z } from "zod";

// ── Enquiry Form ─────────────────────────────────
export const enquirySchema = z.object({
  productId: z.string().uuid().optional(),
  productIds: z.array(z.string().uuid()).optional(),
  customerName: z.string().min(1, "Name is required").max(100),
  customerPhone: z
    .string()
    .regex(/^\+?[0-9]{10,15}$/, "Enter a valid phone number")
    .optional()
    .or(z.literal("")),
  customerEmail: z.string().email("Enter a valid email").optional().or(z.literal("")),
  source: z.enum(["whatsapp", "instagram", "website", "custom_design"]),
  message: z.string().max(1000).optional(),
});

export type EnquiryFormData = z.infer<typeof enquirySchema>;

// ── Waitlist Signup ──────────────────────────────
export const waitlistSchema = z.object({
  productId: z.string().uuid().optional(),
  email: z.string().email().optional().or(z.literal("")),
  phone: z
    .string()
    .regex(/^\+?[0-9]{10,15}$/)
    .optional()
    .or(z.literal("")),
  type: z.enum(["launch", "restock", "drop"]),
});

export type WaitlistFormData = z.infer<typeof waitlistSchema>;

// ── Custom Design Request ────────────────────────
export const customDesignSchema = z.object({
  customerName: z.string().min(1).max(100),
  customerPhone: z.string().regex(/^\+?[0-9]{10,15}$/).optional().or(z.literal("")),
  customerEmail: z.string().email().optional().or(z.literal("")),
  description: z.string().min(10, "Please describe your design idea").max(2000),
  budgetRange: z.string().optional(),
});

export type CustomDesignFormData = z.infer<typeof customDesignSchema>;

// ── Newsletter Signup ────────────────────────────
export const newsletterSchema = z.object({
  email: z.string().email("Enter a valid email"),
});

export type NewsletterFormData = z.infer<typeof newsletterSchema>;

// ── Product (Admin) ──────────────────────────────
export const productSchema = z.object({
  name: z.string().min(1, "Product name is required").max(200),
  slug: z.string().min(1).max(200),
  description: z.string().max(5000).optional(),
  price: z.number().int().min(0, "Price must be positive"),
  compareAtPrice: z.number().int().min(0).optional().nullable(),
  stock: z.number().int().min(0).default(0),
  sku: z.string().max(50).optional().nullable(),
  categoryId: z.string().uuid().optional().nullable(),
  attributes: z.record(z.string(), z.union([z.string(), z.array(z.string())])).default({}),
  badges: z.array(z.enum(["best_seller", "new_arrival", "sale"])).default([]),
  tags: z.array(z.string()).default([]),
  outfitPairings: z.array(z.string()).default([]),
  status: z.enum(["draft", "published", "scheduled", "archived"]).default("draft"),
  materialsCare: z.string().max(2000).optional().nullable(),
  shippingInfo: z.string().max(1000).optional().nullable(),
});

export type ProductFormData = z.infer<typeof productSchema>;

// ── Review ───────────────────────────────────────
export const reviewSchema = z.object({
  productId: z.string().uuid(),
  customerName: z.string().min(1).max(100),
  rating: z.number().int().min(1).max(5),
  title: z.string().max(200).optional(),
  body: z.string().max(2000).optional(),
  instagramHandle: z.string().max(50).optional(),
});

export type ReviewFormData = z.infer<typeof reviewSchema>;

// ── Contact Form ─────────────────────────────────
export const contactSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  subject: z.string().min(1).max(200),
  message: z.string().min(10).max(2000),
});

export type ContactFormData = z.infer<typeof contactSchema>;
