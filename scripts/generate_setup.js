const fs = require("fs");
const path = require("path");

// 1. Read PLACEHOLDER_PRODUCTS
const placeholderContent = fs.readFileSync(path.join(__dirname, "../src/lib/placeholder-data.ts"), "utf8");
// 2. Read adminStore
const storeContent = fs.readFileSync(path.join(__dirname, "../src/lib/store/adminStore.ts"), "utf8");

// Parse products
const { PLACEHOLDER_PRODUCTS } = require("../src/lib/placeholder-data.ts");

// Parse categories
const catMatch = storeContent.match(/export const DEFAULT_CATEGORIES: AdminCategory\[\] = (\[[\s\S]*?\n\];)/);
const categories = eval(catMatch[1]);

// Parse slides
const slideMatch = storeContent.match(/export const DEFAULT_HERO_SLIDES: HeroSlide\[\] = (\[[\s\S]*?\n\];)/);
const heroSlides = eval(slideMatch[1]);

let sql = `-- ═════════════════════════════════════════════════════════════
-- ALBELI — COMPLETE SUPABASE DATABASE SETUP & SEED SCRIPT
-- Paste and Run this in: Supabase Dashboard -> SQL Editor
-- ═════════════════════════════════════════════════════════════

-- 1. Enable Extensions
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Drop existing tables if needed (Clean rebuild)
DROP TABLE IF EXISTS audit_logs CASCADE;
DROP TABLE IF EXISTS manual_orders CASCADE;
DROP TABLE IF EXISTS saved_designs CASCADE;
DROP TABLE IF EXISTS product_images CASCADE;
DROP TABLE IF EXISTS product_collections CASCADE;
DROP TABLE IF EXISTS product_variants CASCADE;
DROP TABLE IF EXISTS waitlist_signups CASCADE;
DROP TABLE IF EXISTS custom_design_requests CASCADE;
DROP TABLE IF EXISTS ugc_items CASCADE;
DROP TABLE IF EXISTS page_versions CASCADE;
DROP TABLE IF EXISTS media_assets CASCADE;
DROP TABLE IF EXISTS blog_posts CASCADE;
DROP TABLE IF EXISTS attribute_definitions CASCADE;
DROP TABLE IF EXISTS collections CASCADE;
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS enquiries CASCADE;
DROP TABLE IF EXISTS nav_items CASCADE;
DROP TABLE IF EXISTS page_sections CASCADE;
DROP TABLE IF EXISTS hero_slides CASCADE;
DROP TABLE IF EXISTS settings CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- 3. Create Tables

-- Categories
CREATE TABLE categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  image_url TEXT,
  parent_id TEXT REFERENCES categories(id) ON DELETE CASCADE,
  item_count INTEGER NOT NULL DEFAULT 0,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_visible BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Products
CREATE TABLE products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  price INTEGER NOT NULL DEFAULT 0,
  compare_at_price INTEGER,
  stock INTEGER NOT NULL DEFAULT 0,
  sku TEXT,
  category TEXT NOT NULL,
  category_slug TEXT NOT NULL,
  category_id TEXT REFERENCES categories(id) ON DELETE SET NULL,
  subcategory TEXT,
  subcategory_slug TEXT,
  primary_image TEXT NOT NULL,
  secondary_image TEXT,
  images TEXT[] NOT NULL DEFAULT '{}',
  video_url TEXT,
  badges TEXT[] NOT NULL DEFAULT '{}',
  tags TEXT[] NOT NULL DEFAULT '{}',
  outfit_pairings TEXT[] NOT NULL DEFAULT '{}',
  materials_care TEXT,
  shipping_info TEXT,
  status TEXT NOT NULL DEFAULT 'published',
  is_placeholder BOOLEAN NOT NULL DEFAULT false,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Reviews
CREATE TABLE reviews (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  product_id TEXT,
  product_name TEXT,
  customer_name TEXT NOT NULL,
  location TEXT,
  rating INTEGER NOT NULL DEFAULT 5,
  comment TEXT NOT NULL,
  verified BOOLEAN NOT NULL DEFAULT true,
  visible BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enquiries
CREATE TABLE enquiries (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  customer_name TEXT,
  customer_contact TEXT,
  product_name TEXT NOT NULL,
  channel TEXT NOT NULL DEFAULT 'whatsapp',
  status TEXT NOT NULL DEFAULT 'new',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Site Settings
CREATE TABLE settings (
  id TEXT PRIMARY KEY DEFAULT 'default',
  data JSONB NOT NULL DEFAULT '{}',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Hero Slides
CREATE TABLE hero_slides (
  id TEXT PRIMARY KEY,
  image TEXT NOT NULL,
  badge TEXT,
  headline TEXT NOT NULL,
  hindi_tagline TEXT,
  desktop_desc TEXT,
  cta_text TEXT NOT NULL DEFAULT 'Explore Drop',
  cta_link TEXT NOT NULL DEFAULT '/shop',
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Nav Items
CREATE TABLE nav_items (
  id TEXT PRIMARY KEY,
  location TEXT NOT NULL DEFAULT 'header',
  label TEXT NOT NULL,
  href TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_visible BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Page Sections
CREATE TABLE page_sections (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  page_id TEXT NOT NULL DEFAULT 'home',
  type TEXT NOT NULL,
  title TEXT,
  data JSONB NOT NULL DEFAULT '{}',
  is_visible BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE hero_slides ENABLE ROW LEVEL SECURITY;
ALTER TABLE nav_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_sections ENABLE ROW LEVEL SECURITY;

-- 5. RLS Public Policies (Anyone can read, service_role has full admin access)
CREATE POLICY "Public read categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Public read products" ON products FOR SELECT USING (true);
CREATE POLICY "Public read reviews" ON reviews FOR SELECT USING (visible = true);
CREATE POLICY "Public read settings" ON settings FOR SELECT USING (true);
CREATE POLICY "Public read hero_slides" ON hero_slides FOR SELECT USING (true);
CREATE POLICY "Public read nav_items" ON nav_items FOR SELECT USING (true);
CREATE POLICY "Public read page_sections" ON page_sections FOR SELECT USING (true);

CREATE POLICY "Public submit enquiry" ON enquiries FOR INSERT WITH CHECK (true);
CREATE POLICY "Public submit review" ON reviews FOR INSERT WITH CHECK (true);

-- 6. Insert Categories (Roots first, then Subcategories)
`;

// Insert root categories
const roots = categories.filter(c => !c.parentId);
roots.forEach((c, idx) => {
  const desc = (c.description || "").replace(/'/g, "''");
  const img = (c.imageUrl || "").replace(/'/g, "''");
  sql += `INSERT INTO categories (id, name, slug, description, image_url, parent_id, item_count, sort_order)
VALUES ('${c.id}', '${c.name.replace(/'/g, "''")}', '${c.slug}', '${desc}', '${img}', NULL, ${c.itemCount || 0}, ${idx + 1})
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, slug = EXCLUDED.slug, item_count = EXCLUDED.item_count;\n`;
});

// Insert subcategories
const subs = categories.filter(c => !!c.parentId);
subs.forEach((c, idx) => {
  const desc = (c.description || "").replace(/'/g, "''");
  const img = (c.imageUrl || "").replace(/'/g, "''");
  sql += `INSERT INTO categories (id, name, slug, description, image_url, parent_id, item_count, sort_order)
VALUES ('${c.id}', '${c.name.replace(/'/g, "''")}', '${c.slug}', '${desc}', '${img}', '${c.parentId}', ${c.itemCount || 0}, ${idx + 1})
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, slug = EXCLUDED.slug, item_count = EXCLUDED.item_count;\n`;
});

sql += `\n-- 7. Insert All Products\n`;
PLACEHOLDER_PRODUCTS.forEach((p, idx) => {
  const name = p.name.replace(/'/g, "''");
  const desc = (p.description || "").replace(/'/g, "''");
  const mat = (p.materialsCare || "").replace(/'/g, "''");
  const ship = (p.shippingInfo || "").replace(/'/g, "''");
  const pImg = p.primaryImage || "";
  const sImg = p.secondaryImage || "";
  const imagesArr = `ARRAY['${pImg}'${sImg ? `, '${sImg}'` : ""}]`;
  const badgesArr = `ARRAY[${(p.badges || []).map(b => `'${b}'`).join(", ")}]`;
  const outfitArr = `ARRAY[${(p.outfitPairings || []).map(o => `'${o.replace(/'/g, "''")}'`).join(", ")}]`;
  const subcat = p.subcategory ? `'${p.subcategory.replace(/'/g, "''")}'` : "NULL";
  const subcatSlug = p.subcategorySlug ? `'${p.subcategorySlug}'` : "NULL";

  sql += `INSERT INTO products (
  id, name, slug, description, price, compare_at_price, stock, sku,
  category, category_slug, subcategory, subcategory_slug,
  primary_image, secondary_image, images, badges, outfit_pairings,
  materials_care, shipping_info, status, is_placeholder, sort_order
) VALUES (
  '${p.id}', '${name}', '${p.slug}', '${desc}', ${p.price}, ${p.compareAtPrice || "NULL"}, ${p.stock || 5}, '${p.sku || ""}',
  '${p.category}', '${p.categorySlug}', ${subcat}, ${subcatSlug},
  '${pImg}', '${sImg}', ${imagesArr}, ${badgesArr}, ${outfitArr},
  '${mat}', '${ship}', 'published', false, ${idx + 1}
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  price = EXCLUDED.price,
  compare_at_price = EXCLUDED.compare_at_price,
  category = EXCLUDED.category,
  category_slug = EXCLUDED.category_slug,
  subcategory = EXCLUDED.subcategory,
  subcategory_slug = EXCLUDED.subcategory_slug,
  primary_image = EXCLUDED.primary_image,
  secondary_image = EXCLUDED.secondary_image,
  images = EXCLUDED.images;\n`;
});

sql += `\n-- 8. Insert Hero Slides\n`;
heroSlides.forEach((s, idx) => {
  const hl = s.headline.replace(/'/g, "''");
  const hindi = (s.hindiTagline || "").replace(/'/g, "''");
  const desc = (s.desktopDesc || "").replace(/'/g, "''");
  const badge = (s.badge || "").replace(/'/g, "''");
  sql += `INSERT INTO hero_slides (id, image, badge, headline, hindi_tagline, desktop_desc, cta_text, cta_link, sort_order)
VALUES ('${s.id}', '${s.image}', '${badge}', '${hl}', '${hindi}', '${desc}', '${s.ctaText}', '${s.ctaLink}', ${idx + 1})
ON CONFLICT (id) DO NOTHING;\n`;
});

sql += `\n-- 9. Insert Default Settings\n`;
const defaultSettings = {
  general: {
    siteName: "Albeli",
    tagline: "Not so ordinary.",
    hindiTagline: "थोड़ा हटके, पूरा देसी।",
    contactEmail: "care@albeli.in",
    contactPhone: "+91 96507 50834",
    whatsappNumber: "+919650750834",
    instagramHandle: "@albelihouse",
    delhiStudioAddress: "Shahpur Jat / Chandni Chowk artisan studio, Delhi, India",
    currency: "INR",
  },
  announcement: {
    enabled: true,
    text: "✨ Free Express Delivery across India on orders above ₹999 | Delhi Same-Day Available",
    secondaryText: "Handcrafted in Delhi • Pure Brass & 22k Antique Gold Plated",
    link: "/shop",
  },
};
sql += `INSERT INTO settings (id, data) VALUES ('default', '${JSON.stringify(defaultSettings).replace(/'/g, "''")}')
ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data;\n`;

sql += `\n-- 10. Verification Queries\nSELECT count(*) AS total_products FROM products;\nSELECT count(*) AS total_categories FROM categories;\n`;

fs.writeFileSync(path.join(__dirname, "../supabase/setup.sql"), sql);
console.log("Successfully generated supabase/setup.sql! Total length:", sql.length);
