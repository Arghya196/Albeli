-- ═══════════════════════════════════════════════
-- ALBELI — Database Schema Migration (Initial)
-- ═══════════════════════════════════════════════
-- Run against Supabase Postgres. All tables have RLS enabled.
-- Prices stored as integers (paise). UUIDs as PKs.

-- ── Extensions ───────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "pg_trgm";    -- fuzzy search
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";  -- uuid generation

-- ── Enums ────────────────────────────────────────
CREATE TYPE user_role AS ENUM ('owner', 'admin', 'staff', 'customer');
CREATE TYPE enquiry_status AS ENUM ('new', 'contacted', 'converted', 'lost');
CREATE TYPE enquiry_source AS ENUM ('whatsapp', 'instagram', 'website', 'custom_design');
CREATE TYPE product_status AS ENUM ('draft', 'published', 'scheduled', 'archived');
CREATE TYPE section_type AS ENUM (
  'announcement', 'hero_carousel', 'theme_cards', 'product_row',
  'collection_banner', 'image_text', 'video', 'ugc_grid', 'reviews',
  'countdown', 'featured_in', 'story_block', 'icon_trio', 'faq',
  'newsletter', 'instagram', 'rich_text', 'spacer_divider'
);

-- ── 1. Profiles ──────────────────────────────────
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  role user_role NOT NULL DEFAULT 'customer',
  phone TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_profiles_email ON profiles(email);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name'),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ── 2. Categories ────────────────────────────────
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  image_url TEXT,
  parent_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_visible BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_categories_slug ON categories(slug);
CREATE INDEX idx_categories_parent ON categories(parent_id);

-- ── 3. Collections ───────────────────────────────
CREATE TABLE collections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  image_url TEXT,
  is_manual BOOLEAN NOT NULL DEFAULT true,
  rules JSONB DEFAULT '{}',
  is_visible BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_collections_slug ON collections(slug);

-- ── 4. Attribute Definitions ─────────────────────
CREATE TABLE attribute_definitions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  type TEXT NOT NULL DEFAULT 'select' CHECK (type IN ('select', 'multi_select', 'text')),
  options JSONB NOT NULL DEFAULT '[]',
  is_filterable BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── 5. Products ──────────────────────────────────
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  price INTEGER NOT NULL DEFAULT 0,              -- paise
  compare_at_price INTEGER,
  cost_price INTEGER,
  stock INTEGER NOT NULL DEFAULT 0,
  sku TEXT,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  attributes JSONB NOT NULL DEFAULT '{}',
  badges TEXT[] NOT NULL DEFAULT '{}',
  tags TEXT[] NOT NULL DEFAULT '{}',
  outfit_pairings TEXT[] NOT NULL DEFAULT '{}',
  status product_status NOT NULL DEFAULT 'draft',
  is_placeholder BOOLEAN NOT NULL DEFAULT false,
  published_at TIMESTAMPTZ,
  scheduled_at TIMESTAMPTZ,
  sort_order INTEGER NOT NULL DEFAULT 0,
  materials_care TEXT,
  shipping_info TEXT,
  deleted_at TIMESTAMPTZ,                        -- soft delete
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_price ON products(price);
CREATE INDEX idx_products_deleted ON products(deleted_at);
CREATE INDEX idx_products_search ON products USING gin(
  (name || ' ' || COALESCE(description, '')) gin_trgm_ops
);

-- ── 6. Product Images ────────────────────────────
CREATE TABLE product_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  alt TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_cover BOOLEAN NOT NULL DEFAULT false,
  is_hover BOOLEAN NOT NULL DEFAULT false,
  focal_x REAL,
  focal_y REAL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_product_images_product ON product_images(product_id);

-- ── 7. Product Collections (junction) ────────────
CREATE TABLE product_collections (
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  collection_id UUID NOT NULL REFERENCES collections(id) ON DELETE CASCADE,
  PRIMARY KEY (product_id, collection_id)
);

-- ── 8. Product Variants ──────────────────────────
CREATE TABLE product_variants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  sku TEXT,
  price_override INTEGER,
  stock INTEGER NOT NULL DEFAULT 0,
  attributes JSONB NOT NULL DEFAULT '{}',
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_product_variants_product ON product_variants(product_id);

-- ── 9. Saved Designs ─────────────────────────────
CREATE TABLE saved_designs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

CREATE INDEX idx_saved_designs_user ON saved_designs(user_id);

-- ── 10. Enquiries ────────────────────────────────
CREATE TABLE enquiries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  customer_name TEXT,
  customer_phone TEXT,
  customer_email TEXT,
  source enquiry_source NOT NULL DEFAULT 'whatsapp',
  message TEXT,
  product_ids UUID[] NOT NULL DEFAULT '{}',
  status enquiry_status NOT NULL DEFAULT 'new',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_enquiries_status ON enquiries(status);
CREATE INDEX idx_enquiries_created ON enquiries(created_at DESC);

-- ── 11. Waitlist Signups ─────────────────────────
CREATE TABLE waitlist_signups (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  email TEXT,
  phone TEXT,
  type TEXT NOT NULL DEFAULT 'launch' CHECK (type IN ('launch', 'restock', 'drop')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── 12. Custom Design Requests ───────────────────
CREATE TABLE custom_design_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_name TEXT NOT NULL,
  customer_phone TEXT,
  customer_email TEXT,
  description TEXT NOT NULL,
  reference_image_urls TEXT[] NOT NULL DEFAULT '{}',
  budget_range TEXT,
  status enquiry_status NOT NULL DEFAULT 'new',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── 13. Reviews ──────────────────────────────────
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  customer_name TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title TEXT,
  body TEXT,
  photo_urls TEXT[] NOT NULL DEFAULT '{}',
  instagram_handle TEXT,
  is_approved BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_reviews_product ON reviews(product_id);
CREATE INDEX idx_reviews_approved ON reviews(is_approved);

-- ── 14. UGC Items ────────────────────────────────
CREATE TABLE ugc_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  image_url TEXT NOT NULL,
  caption TEXT,
  instagram_handle TEXT,
  product_ids UUID[] NOT NULL DEFAULT '{}',
  hotspots JSONB NOT NULL DEFAULT '[]',
  is_visible BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── 15. Page Sections ────────────────────────────
CREATE TABLE page_sections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  page_id TEXT NOT NULL DEFAULT 'home',
  type section_type NOT NULL,
  title TEXT,
  data JSONB NOT NULL DEFAULT '{}',
  is_visible BOOLEAN NOT NULL DEFAULT true,
  is_placeholder BOOLEAN NOT NULL DEFAULT false,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_page_sections_page ON page_sections(page_id);
CREATE INDEX idx_page_sections_order ON page_sections(page_id, sort_order);

-- ── 16. Page Versions ────────────────────────────
CREATE TABLE page_versions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  page_id TEXT NOT NULL,
  sections_snapshot JSONB NOT NULL,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_page_versions_page ON page_versions(page_id, created_at DESC);

-- ── 17. Pages (custom) ──────────────────────────
CREATE TABLE pages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  content TEXT,
  is_visible BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_pages_slug ON pages(slug);

-- ── 18. Navigation Items ─────────────────────────
CREATE TABLE nav_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  location TEXT NOT NULL CHECK (location IN ('header', 'footer')),
  label TEXT NOT NULL,
  url TEXT NOT NULL,
  parent_id UUID REFERENCES nav_items(id) ON DELETE CASCADE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_visible BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_nav_items_location ON nav_items(location);

-- ── 19. Media Assets ─────────────────────────────
CREATE TABLE media_assets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  url TEXT NOT NULL,
  filename TEXT NOT NULL,
  alt TEXT,
  tags TEXT[] NOT NULL DEFAULT '{}',
  size_bytes INTEGER NOT NULL DEFAULT 0,
  mime_type TEXT NOT NULL DEFAULT 'image/jpeg',
  focal_x REAL,
  focal_y REAL,
  usage_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── 20. Blog Posts ───────────────────────────────
CREATE TABLE blog_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT,
  content TEXT NOT NULL DEFAULT '',
  cover_image_url TEXT,
  author_id UUID REFERENCES auth.users(id),
  tags TEXT[] NOT NULL DEFAULT '{}',
  is_published BOOLEAN NOT NULL DEFAULT false,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX idx_blog_posts_published ON blog_posts(is_published);

-- ── 21. Site Settings (singleton) ────────────────
CREATE TABLE settings (
  id TEXT PRIMARY KEY DEFAULT 'default',
  logo_light_url TEXT,
  logo_dark_url TEXT,
  logo_mark_url TEXT,
  favicon_url TEXT,
  splash_enabled BOOLEAN NOT NULL DEFAULT true,
  splash_tagline TEXT NOT NULL DEFAULT 'Not so ordinary.',
  custom_cursor_enabled BOOLEAN NOT NULL DEFAULT true,
  reduce_animations BOOLEAN NOT NULL DEFAULT false,
  whatsapp_number TEXT NOT NULL DEFAULT '+91XXXXXXXXXX',
  instagram_handle TEXT NOT NULL DEFAULT 'albelihouse',
  contact_email TEXT,
  contact_phone TEXT,
  contact_address TEXT,
  shipping_text TEXT NOT NULL DEFAULT 'Free shipping on orders above ₹999. Ships all over India & worldwide.',
  announcement_messages TEXT[] NOT NULL DEFAULT ARRAY[
    'Shipping all over India & worldwide ✨',
    'New drop is live — shop now!'
  ],
  feature_cart BOOLEAN NOT NULL DEFAULT false,
  feature_saved_designs BOOLEAN NOT NULL DEFAULT true,
  feature_reviews BOOLEAN NOT NULL DEFAULT true,
  feature_language_toggle BOOLEAN NOT NULL DEFAULT false,
  primary_color TEXT NOT NULL DEFAULT '#4A0612',
  secondary_color TEXT NOT NULL DEFAULT '#6B1F2E',
  font_pair TEXT NOT NULL DEFAULT 'cormorant-dm-sans',
  button_style TEXT NOT NULL DEFAULT 'filled' CHECK (button_style IN ('filled', 'outlined', 'minimal')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── 22. Audit Logs ───────────────────────────────
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT,
  details JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_created ON audit_logs(created_at DESC);

-- ── 23. Manual Orders (optional) ─────────────────
CREATE TABLE manual_orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_name TEXT NOT NULL,
  customer_phone TEXT,
  customer_email TEXT,
  items JSONB NOT NULL DEFAULT '[]',
  total_amount INTEGER NOT NULL DEFAULT 0,   -- paise
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled')),
  courier TEXT,
  tracking_number TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Updated_at Trigger ───────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to all tables with updated_at
DO $$
DECLARE
  t TEXT;
BEGIN
  FOR t IN
    SELECT table_name FROM information_schema.columns
    WHERE column_name = 'updated_at'
      AND table_schema = 'public'
      AND table_name != 'settings'
  LOOP
    EXECUTE format(
      'CREATE TRIGGER set_updated_at BEFORE UPDATE ON %I FOR EACH ROW EXECUTE FUNCTION update_updated_at()',
      t
    );
  END LOOP;
END;
$$;

-- Settings also gets the trigger
CREATE TRIGGER set_settings_updated_at
  BEFORE UPDATE ON settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
