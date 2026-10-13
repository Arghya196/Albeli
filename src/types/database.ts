// ═══════════════════════════════════════════════
// ALBELI — Database Type Definitions
// ═══════════════════════════════════════════════
// These types mirror the Supabase schema.
// Auto-generation via `supabase gen types` is recommended after migrations.

export type UserRole = "owner" | "admin" | "staff" | "customer";

export type EnquiryStatus = "new" | "contacted" | "converted" | "lost";
export type EnquirySource = "whatsapp" | "instagram" | "website" | "custom_design";

export type ProductStatus = "draft" | "published" | "scheduled" | "archived";

export type SectionType =
  | "announcement"
  | "hero_carousel"
  | "theme_cards"
  | "product_row"
  | "collection_banner"
  | "image_text"
  | "video"
  | "ugc_grid"
  | "reviews"
  | "countdown"
  | "featured_in"
  | "story_block"
  | "icon_trio"
  | "faq"
  | "newsletter"
  | "instagram"
  | "rich_text"
  | "spacer_divider";

export type Badge = "best_seller" | "new_arrival" | "sale";

// ── Core Types ───────────────────────────────────

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  role: UserRole;
  phone: string | null;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  parent_id: string | null;
  sort_order: number;
  is_visible: boolean;
  created_at: string;
  updated_at: string;
}

export interface Collection {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  is_manual: boolean;
  rules: Record<string, unknown> | null; // JSONB for rule-based collections
  is_visible: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface AttributeDefinition {
  id: string;
  name: string;          // e.g. "Color", "Material", "Size"
  slug: string;
  type: "select" | "multi_select" | "text";
  options: string[];     // JSONB array of possible values
  is_filterable: boolean;
  sort_order: number;
  created_at: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;              // in paise
  compare_at_price: number | null;
  cost_price: number | null;
  stock: number;
  sku: string | null;
  category_id: string | null;
  attributes: Record<string, string | string[]>; // JSONB
  badges: Badge[];
  tags: string[];
  outfit_pairings: string[];  // "Pairs well with: kurta, saree"
  status: ProductStatus;
  is_placeholder: boolean;
  published_at: string | null;
  scheduled_at: string | null;
  sort_order: number;
  materials_care: string | null;
  shipping_info: string | null;
  deleted_at: string | null;  // soft delete
  created_at: string;
  updated_at: string;
}

export interface ProductImage {
  id: string;
  product_id: string;
  url: string;
  alt: string | null;
  sort_order: number;
  is_cover: boolean;           // first image
  is_hover: boolean;           // second image (for hover swap)
  focal_x: number | null;
  focal_y: number | null;
  created_at: string;
}

export interface ProductCollection {
  product_id: string;
  collection_id: string;
}

export interface ProductVariant {
  id: string;
  product_id: string;
  name: string;                // e.g. "Gold", "Silver"
  sku: string | null;
  price_override: number | null;
  stock: number;
  attributes: Record<string, string>;
  sort_order: number;
  created_at: string;
}

export interface SavedDesign {
  id: string;
  user_id: string | null;      // null for guest saves (localStorage only)
  product_id: string;
  created_at: string;
}

export interface Enquiry {
  id: string;
  product_id: string | null;
  customer_name: string | null;
  customer_phone: string | null;
  customer_email: string | null;
  source: EnquirySource;
  message: string | null;
  product_ids: string[];       // for bulk enquiries
  status: EnquiryStatus;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface WaitlistSignup {
  id: string;
  product_id: string | null;
  email: string | null;
  phone: string | null;
  type: "launch" | "restock" | "drop";
  created_at: string;
}

export interface CustomDesignRequest {
  id: string;
  customer_name: string;
  customer_phone: string | null;
  customer_email: string | null;
  description: string;
  reference_image_urls: string[];
  budget_range: string | null;
  status: EnquiryStatus;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface Review {
  id: string;
  product_id: string;
  customer_name: string;
  rating: number;
  title: string | null;
  body: string | null;
  photo_urls: string[];
  instagram_handle: string | null;
  is_approved: boolean;
  created_at: string;
}

export interface UGCItem {
  id: string;
  image_url: string;
  caption: string | null;
  instagram_handle: string | null;
  product_ids: string[];     // linked products for "shop the look"
  hotspots: Record<string, unknown>[]; // JSONB
  is_visible: boolean;
  sort_order: number;
  created_at: string;
}

export interface PageSection {
  id: string;
  page_id: string;          // "home" or a custom page id
  type: SectionType;
  title: string | null;
  data: Record<string, unknown>; // JSONB — section-specific content
  is_visible: boolean;
  is_placeholder: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface PageVersion {
  id: string;
  page_id: string;
  sections_snapshot: PageSection[];
  created_by: string;
  created_at: string;
}

export interface Page {
  id: string;
  title: string;
  slug: string;
  content: string | null;       // rich text for custom pages
  is_visible: boolean;
  created_at: string;
  updated_at: string;
}

export interface NavItem {
  id: string;
  location: "header" | "footer";
  label: string;
  url: string;
  parent_id: string | null;
  sort_order: number;
  is_visible: boolean;
  created_at: string;
}

export interface MediaAsset {
  id: string;
  url: string;
  filename: string;
  alt: string | null;
  tags: string[];
  size_bytes: number;
  mime_type: string;
  focal_x: number | null;
  focal_y: number | null;
  usage_count: number;
  created_at: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  cover_image_url: string | null;
  author_id: string;
  tags: string[];
  is_published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface SiteSettings {
  id: string;            // always "default"
  logo_light_url: string | null;
  logo_dark_url: string | null;
  logo_mark_url: string | null;
  favicon_url: string | null;
  splash_enabled: boolean;
  splash_tagline: string;
  custom_cursor_enabled: boolean;
  reduce_animations: boolean;
  whatsapp_number: string;
  instagram_handle: string;
  contact_email: string | null;
  contact_phone: string | null;
  contact_address: string | null;
  shipping_text: string;
  announcement_messages: string[];
  feature_cart: boolean;
  feature_saved_designs: boolean;
  feature_reviews: boolean;
  feature_language_toggle: boolean;
  primary_color: string;
  secondary_color: string;
  font_pair: string;
  button_style: "filled" | "outlined" | "minimal";
  created_at: string;
  updated_at: string;
}

export interface AuditLog {
  id: string;
  user_id: string;
  action: string;
  entity_type: string;
  entity_id: string | null;
  details: Record<string, unknown> | null;
  created_at: string;
}

export interface ManualOrder {
  id: string;
  customer_name: string;
  customer_phone: string | null;
  customer_email: string | null;
  items: Record<string, unknown>[]; // JSONB
  total_amount: number;             // paise
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
  courier: string | null;
  tracking_number: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

// ── Supabase Database Interface ──────────────────
// Minimal interface for type safety. Replace with auto-generated types.
export interface Database {
  public: {
    Tables: {
      profiles: { Row: Profile; Insert: Partial<Profile>; Update: Partial<Profile> };
      categories: { Row: Category; Insert: Partial<Category>; Update: Partial<Category> };
      collections: { Row: Collection; Insert: Partial<Collection>; Update: Partial<Collection> };
      attribute_definitions: { Row: AttributeDefinition; Insert: Partial<AttributeDefinition>; Update: Partial<AttributeDefinition> };
      products: { Row: Product; Insert: Partial<Product>; Update: Partial<Product> };
      product_images: { Row: ProductImage; Insert: Partial<ProductImage>; Update: Partial<ProductImage> };
      product_collections: { Row: ProductCollection; Insert: ProductCollection; Update: Partial<ProductCollection> };
      product_variants: { Row: ProductVariant; Insert: Partial<ProductVariant>; Update: Partial<ProductVariant> };
      saved_designs: { Row: SavedDesign; Insert: Partial<SavedDesign>; Update: Partial<SavedDesign> };
      enquiries: { Row: Enquiry; Insert: Partial<Enquiry>; Update: Partial<Enquiry> };
      waitlist_signups: { Row: WaitlistSignup; Insert: Partial<WaitlistSignup>; Update: Partial<WaitlistSignup> };
      custom_design_requests: { Row: CustomDesignRequest; Insert: Partial<CustomDesignRequest>; Update: Partial<CustomDesignRequest> };
      reviews: { Row: Review; Insert: Partial<Review>; Update: Partial<Review> };
      ugc_items: { Row: UGCItem; Insert: Partial<UGCItem>; Update: Partial<UGCItem> };
      page_sections: { Row: PageSection; Insert: Partial<PageSection>; Update: Partial<PageSection> };
      page_versions: { Row: PageVersion; Insert: Partial<PageVersion>; Update: Partial<PageVersion> };
      pages: { Row: Page; Insert: Partial<Page>; Update: Partial<Page> };
      nav_items: { Row: NavItem; Insert: Partial<NavItem>; Update: Partial<NavItem> };
      media_assets: { Row: MediaAsset; Insert: Partial<MediaAsset>; Update: Partial<MediaAsset> };
      blog_posts: { Row: BlogPost; Insert: Partial<BlogPost>; Update: Partial<BlogPost> };
      settings: { Row: SiteSettings; Insert: Partial<SiteSettings>; Update: Partial<SiteSettings> };
      audit_logs: { Row: AuditLog; Insert: Partial<AuditLog>; Update: Partial<AuditLog> };
      manual_orders: { Row: ManualOrder; Insert: Partial<ManualOrder>; Update: Partial<ManualOrder> };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      user_role: UserRole;
      enquiry_status: EnquiryStatus;
      enquiry_source: EnquirySource;
      product_status: ProductStatus;
      section_type: SectionType;
    };
  };
}
