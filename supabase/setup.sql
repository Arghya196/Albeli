-- ═════════════════════════════════════════════════════════════
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
INSERT INTO categories (id, name, slug, description, image_url, parent_id, item_count, sort_order)
VALUES ('cat-1', 'Earrings', 'earrings', 'Handcrafted chandbalis, jhumkas, polki studs, and royal ear ornaments.', '/images/product-1-a.jpg', NULL, 14, 1)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, slug = EXCLUDED.slug, item_count = EXCLUDED.item_count;
INSERT INTO categories (id, name, slug, description, image_url, parent_id, item_count, sort_order)
VALUES ('cat-2', 'Necklaces', 'necklaces', 'Sculpted heritage haslis, polki chokers, and royal bridal neckpieces.', '/images/product-2-a.jpg', NULL, 4, 2)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, slug = EXCLUDED.slug, item_count = EXCLUDED.item_count;
INSERT INTO categories (id, name, slug, description, image_url, parent_id, item_count, sort_order)
VALUES ('cat-3', 'Rings', 'rings', 'Solar cocktail rings, polki bands, and adjustable statement pieces.', '/images/product-3-a.jpg', NULL, 3, 3)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, slug = EXCLUDED.slug, item_count = EXCLUDED.item_count;
INSERT INTO categories (id, name, slug, description, image_url, parent_id, item_count, sort_order)
VALUES ('cat-4', 'Bangles & Bracelets', 'bangles-bracelets', 'Heritage peacock kadas, meenakari bangles, and delicate hathphool.', '/images/product-5-a.jpg', NULL, 1, 4)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, slug = EXCLUDED.slug, item_count = EXCLUDED.item_count;
INSERT INTO categories (id, name, slug, description, image_url, parent_id, item_count, sort_order)
VALUES ('sub-1', 'Chandbalis', 'chandbalis', 'Crescent-shaped royal earrings adorned with meenakari and seed pearls.', '/images/product-1-a.jpg', 'cat-1', 2, 1)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, slug = EXCLUDED.slug, item_count = EXCLUDED.item_count;
INSERT INTO categories (id, name, slug, description, image_url, parent_id, item_count, sort_order)
VALUES ('sub-2', 'Jhumkas', 'jhumkas', 'Bell-shaped traditional drops finished with delicate micro-pearl fringe.', '/images/product-4-a.jpg', 'cat-1', 6, 2)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, slug = EXCLUDED.slug, item_count = EXCLUDED.item_count;
INSERT INTO categories (id, name, slug, description, image_url, parent_id, item_count, sort_order)
VALUES ('sub-3', 'Studs & Tops', 'studs-tops', 'Minimal polki and kundan solitaires crafted for all-day comfort.', '/images/product-1-a.jpg', 'cat-1', 2, 3)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, slug = EXCLUDED.slug, item_count = EXCLUDED.item_count;
INSERT INTO categories (id, name, slug, description, image_url, parent_id, item_count, sort_order)
VALUES ('sub-4', 'Danglers & Drops', 'danglers-drops', 'Cascading shoulder dusters with faceted emerald and ruby hydro beads.', '/images/product-4-a.jpg', 'cat-1', 2, 4)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, slug = EXCLUDED.slug, item_count = EXCLUDED.item_count;
INSERT INTO categories (id, name, slug, description, image_url, parent_id, item_count, sort_order)
VALUES ('sub-5', 'Hoops & Balis', 'hoops-balis', 'Intricately filigreed huggies and traditional round balis.', '/images/product-1-a.jpg', 'cat-1', 2, 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, slug = EXCLUDED.slug, item_count = EXCLUDED.item_count;
INSERT INTO categories (id, name, slug, description, image_url, parent_id, item_count, sort_order)
VALUES ('sub-6', 'Ear Cuffs & Deewani', 'ear-cuffs', 'Over-the-ear bridal statement wraps and delicate chain climbers.', '/images/product-1-b.jpg', 'cat-1', 0, 6)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, slug = EXCLUDED.slug, item_count = EXCLUDED.item_count;
INSERT INTO categories (id, name, slug, description, image_url, parent_id, item_count, sort_order)
VALUES ('sub-7', 'Chokers', 'chokers', 'Heritage neck-hugging polki chokers with adjustable silk zari cords.', '/images/product-2-a.jpg', 'cat-2', 2, 7)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, slug = EXCLUDED.slug, item_count = EXCLUDED.item_count;
INSERT INTO categories (id, name, slug, description, image_url, parent_id, item_count, sort_order)
VALUES ('sub-8', 'Haslis & Collars', 'haslis-collars', 'Rigid sculpted collars engraved with peacock and floral repoussé motifs.', '/images/product-5-a.jpg', 'cat-2', 2, 8)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, slug = EXCLUDED.slug, item_count = EXCLUDED.item_count;
INSERT INTO categories (id, name, slug, description, image_url, parent_id, item_count, sort_order)
VALUES ('sub-9', 'Long Malas & Haar', 'long-malas', 'Layered royal malas featuring uncut glass polki and natural gemstone beads.', '/images/product-2-b.jpg', 'cat-2', 0, 9)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, slug = EXCLUDED.slug, item_count = EXCLUDED.item_count;
INSERT INTO categories (id, name, slug, description, image_url, parent_id, item_count, sort_order)
VALUES ('sub-10', 'Pendant Sets', 'pendant-sets', 'Minimalist everyday chains paired with matching artisan ear studs.', '/images/product-2-a.jpg', 'cat-2', 0, 10)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, slug = EXCLUDED.slug, item_count = EXCLUDED.item_count;
INSERT INTO categories (id, name, slug, description, image_url, parent_id, item_count, sort_order)
VALUES ('sub-11', 'Cocktail Rings', 'cocktail-rings', 'Bold oversized solar and lotus statement pieces with doublet gemstones.', '/images/product-3-a.jpg', 'cat-3', 2, 11)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, slug = EXCLUDED.slug, item_count = EXCLUDED.item_count;
INSERT INTO categories (id, name, slug, description, image_url, parent_id, item_count, sort_order)
VALUES ('sub-12', 'Bands & Solitaires', 'band-solitaire', 'Understated daily wear rings featuring uncut glass stones.', '/images/product-3-b.jpg', 'cat-3', 0, 12)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, slug = EXCLUDED.slug, item_count = EXCLUDED.item_count;
INSERT INTO categories (id, name, slug, description, image_url, parent_id, item_count, sort_order)
VALUES ('sub-13', 'Adjustable Rings', 'adjustable-rings', 'Comfort-fit open band rings designed to fit any finger size.', '/images/product-3-a.jpg', 'cat-3', 0, 13)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, slug = EXCLUDED.slug, item_count = EXCLUDED.item_count;
INSERT INTO categories (id, name, slug, description, image_url, parent_id, item_count, sort_order)
VALUES ('sub-14', 'Kadas & Cuffs', 'kadas', 'Heavy antique openable cuffs with lion and peacock terminal heads.', '/images/product-5-a.jpg', 'cat-4', 1, 14)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, slug = EXCLUDED.slug, item_count = EXCLUDED.item_count;
INSERT INTO categories (id, name, slug, description, image_url, parent_id, item_count, sort_order)
VALUES ('sub-15', 'Meenakari Bangles', 'meenakari-bangles', 'Vibrant enameled bangles displaying traditional floral motifs.', '/images/product-4-a.jpg', 'cat-4', 0, 15)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, slug = EXCLUDED.slug, item_count = EXCLUDED.item_count;
INSERT INTO categories (id, name, slug, description, image_url, parent_id, item_count, sort_order)
VALUES ('sub-16', 'Hathphool', 'hathphool', 'Delicate bridal hand harness connecting ring to wrist.', '/images/product-3-a.jpg', 'cat-4', 0, 16)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, slug = EXCLUDED.slug, item_count = EXCLUDED.item_count;

-- 7. Insert All Products
INSERT INTO products (
  id, name, slug, description, price, compare_at_price, stock, sku,
  category, category_slug, subcategory, subcategory_slug,
  primary_image, secondary_image, images, badges, outfit_pairings,
  materials_care, shipping_info, status, is_placeholder, sort_order
) VALUES (
  'prod-001', 'Mayura Peacock Chandbali Earrings', 'mayura-peacock-chandbali-earrings', 'Handcrafted with intricate royal peacock motifs, vivid meenakari enamel work, and cascading freshwater pearls. Cast in brass and triple-dipped in 22k antique gold finish.', 249900, 329900, 7, 'ALB-ER-001',
  'Earrings', 'earrings', 'Chandbalis', 'chandbalis',
  '/images/product-1-a.jpg', '/images/product-1-b.jpg', ARRAY['/images/product-1-a.jpg', '/images/product-1-b.jpg'], ARRAY['best_seller'], ARRAY['Chanderi Saree', 'Banarasi Anarkali', 'Festive Kurta'],
  'Brass base with 22k antique gold plating, meenakari enamel, glass polki, and faux pearls. Keep away from perfumes, moisture, and alcohol sprays. Store in the provided airtight Albeli pouch.', 'Dispatches within 24-48 hours from Delhi. Delivery across India in 3-5 business days. Express worldwide shipping available.', 'published', false, 1
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
  images = EXCLUDED.images;
INSERT INTO products (
  id, name, slug, description, price, compare_at_price, stock, sku,
  category, category_slug, subcategory, subcategory_slug,
  primary_image, secondary_image, images, badges, outfit_pairings,
  materials_care, shipping_info, status, is_placeholder, sort_order
) VALUES (
  'prod-002', 'Noorani Polki Emerald Choker', 'noorani-polki-emerald-choker', 'A heritage choker featuring bezel-set uncut glass polki stones, deep emerald green hydro-beads, and seed pearl clusters. Includes an adjustable zari dori for a customized neckline fit.', 389900, 499900, 4, 'ALB-NK-002',
  'Necklaces', 'necklaces', 'Chokers', 'chokers',
  '/images/product-2-a.jpg', '/images/product-2-b.jpg', ARRAY['/images/product-2-a.jpg', '/images/product-2-b.jpg'], ARRAY['best_seller', 'new_arrival'], ARRAY['Raw Silk Saree', 'Bridal Velvet Blouse', 'Ivory Lehenga'],
  'Gold-plated alloy with uncut glass polki and emerald green crystal drops. Adjustable gold thread cord. Wipe gently with a dry microfiber cloth after each wear.', 'Dispatches within 24-48 hours. Gift box packaging included with every choker.', 'published', false, 2
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
  images = EXCLUDED.images;
INSERT INTO products (
  id, name, slug, description, price, compare_at_price, stock, sku,
  category, category_slug, subcategory, subcategory_slug,
  primary_image, secondary_image, images, badges, outfit_pairings,
  materials_care, shipping_info, status, is_placeholder, sort_order
) VALUES (
  'prod-003', 'Aftab Royal Kundan Cocktail Ring', 'aftab-royal-kundan-cocktail-ring', 'An oversized solar statement ring inspired by Mughal court jewellery. Features a faceted ruby doublet centre framed by concentric rings of polki stones and granulations. Adjustable band fits all finger sizes comfortably.', 149900, 189900, 12, 'ALB-RG-003',
  'Rings', 'rings', 'Cocktail Rings', 'cocktail-rings',
  '/images/product-3-a.jpg', '/images/product-3-b.jpg', ARRAY['/images/product-3-a.jpg', '/images/product-3-b.jpg'], ARRAY['new_arrival'], ARRAY['Cocktail Saree', 'Western Fusion Blazer', 'Mehendi Suit'],
  'High grade copper-brass alloy with matte antique gold plating. Adjustable open band. Nickel and lead free.', 'Ships worldwide. Free standard shipping across India on all prepaid orders.', 'published', false, 3
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
  images = EXCLUDED.images;
INSERT INTO products (
  id, name, slug, description, price, compare_at_price, stock, sku,
  category, category_slug, subcategory, subcategory_slug,
  primary_image, secondary_image, images, badges, outfit_pairings,
  materials_care, shipping_info, status, is_placeholder, sort_order
) VALUES (
  'prod-004', 'Gulabi Lotus Meenakari Jhumkas', 'gulabi-lotus-meenakari-jhumkas', 'Delicate hand-painted lotus meenakari in powdery Delhi rose and sage green. Bell-shaped jhumkas adorned with micro pearl fringe that sway gracefully with every movement.', 189900, 240000, 9, 'ALB-ER-004',
  'Earrings', 'earrings', 'Jhumkas', 'jhumkas',
  '/images/product-4-a.jpg', '/images/product-4-b.jpg', ARRAY['/images/product-4-a.jpg', '/images/product-4-b.jpg'], ARRAY['best_seller'], ARRAY['Cotton Mulmul Kurta', 'Pastel Sharara', 'Bandhani Saree'],
  'Artisan hand-enameled brass. Lightweight and hypoallergenic. Clean with a soft dry brush.', 'Dispatches within 24 hours. Includes replacement back-stoppers.', 'published', false, 4
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
  images = EXCLUDED.images;
INSERT INTO products (
  id, name, slug, description, price, compare_at_price, stock, sku,
  category, category_slug, subcategory, subcategory_slug,
  primary_image, secondary_image, images, badges, outfit_pairings,
  materials_care, shipping_info, status, is_placeholder, sort_order
) VALUES (
  'prod-009', 'Kashmiri Polki Pearl Tassel Jhumkas', 'kashmiri-polki-pearl-tassel-jhumkas', 'Handcrafted Kashmiri-inspired dome jhumkas featuring tiered freshwater pearl tassels, uncut glass polki floral crowns, and 22k matte gold plating.', 229900, 289900, 8, 'ALB-ER-009',
  'Earrings', 'earrings', 'Jhumkas', 'jhumkas',
  '/images/jhumka-pearl-tassel.jpg', '/images/product-1-b.jpg', ARRAY['/images/jhumka-pearl-tassel.jpg', '/images/product-1-b.jpg'], ARRAY['best_seller', 'new_arrival'], ARRAY['Chanderi Saree', 'Silk Anarkali', 'Pastel Sharara'],
  'Brass base with 22k antique gold plating and real freshwater cultured pearls. Store in airtight pouch.', 'Dispatches within 24-48 hours from Delhi.', 'published', false, 5
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
  images = EXCLUDED.images;
INSERT INTO products (
  id, name, slug, description, price, compare_at_price, stock, sku,
  category, category_slug, subcategory, subcategory_slug,
  primary_image, secondary_image, images, badges, outfit_pairings,
  materials_care, shipping_info, status, is_placeholder, sort_order
) VALUES (
  'prod-010', 'Mughal Shahi Double-Bell Jhumkas', 'mughal-shahi-double-bell-jhumkas', 'An architectural two-tier jhumka with antique Mughal jaali filigree, ruby doublet cabochons, and micro-pearl seed clusters that sway with every step.', 279900, 349900, 5, 'ALB-ER-010',
  'Earrings', 'earrings', 'Jhumkas', 'jhumkas',
  '/images/jhumka-mughal-bell.jpg', '/images/product-4-b.jpg', ARRAY['/images/jhumka-mughal-bell.jpg', '/images/product-4-b.jpg'], ARRAY['new_arrival'], ARRAY['Banarasi Silk Saree', 'Bridal Velvet Lehenga', 'Royal Kurta Set'],
  'High grade copper-brass alloy with 22k antique gold finish and bezel-set doublet ruby stones.', 'Complimentary Albeli luxury gift packaging included.', 'published', false, 6
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
  images = EXCLUDED.images;
INSERT INTO products (
  id, name, slug, description, price, compare_at_price, stock, sku,
  category, category_slug, subcategory, subcategory_slug,
  primary_image, secondary_image, images, badges, outfit_pairings,
  materials_care, shipping_info, status, is_placeholder, sort_order
) VALUES (
  'prod-011', 'Mayur Pankhi Turquoise Meenakari Jhumkas', 'mayur-pankhi-turquoise-meenakari-jhumkas', 'Vibrant royal peacock tops hand-enameled in turquoise blue and emerald green meenakari, suspending ornate bell domes with cultured faux pearls.', 199900, 249900, 10, 'ALB-ER-011',
  'Earrings', 'earrings', 'Jhumkas', 'jhumkas',
  '/images/jhumka-turquoise-meena.jpg', '/images/product-1-b.jpg', ARRAY['/images/jhumka-turquoise-meena.jpg', '/images/product-1-b.jpg'], ARRAY['best_seller'], ARRAY['Turquoise Kurti', 'Ivory Silk Saree', 'Festive Bandhani'],
  'Artisan hand-enameled brass with micro-pearl drops. Wipe with a dry microfiber cloth.', 'Ships within 24 hours.', 'published', false, 7
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
  images = EXCLUDED.images;
INSERT INTO products (
  id, name, slug, description, price, compare_at_price, stock, sku,
  category, category_slug, subcategory, subcategory_slug,
  primary_image, secondary_image, images, badges, outfit_pairings,
  materials_care, shipping_info, status, is_placeholder, sort_order
) VALUES (
  'prod-012', 'Rani Baag Temple Ghungroo Jhumkas', 'rani-baag-temple-ghungroo-jhumkas', 'Traditional temple-motif antique gold jhumkas engraved with floral deities and ringed with delicate acoustic ghungroos that produce a gentle chime.', 169900, 219900, 12, 'ALB-ER-012',
  'Earrings', 'earrings', 'Jhumkas', 'jhumkas',
  '/images/jhumka-temple-ghungroo.jpg', '/images/product-5-b.jpg', ARRAY['/images/jhumka-temple-ghungroo.jpg', '/images/product-5-b.jpg'], ARRAY['sale'], ARRAY['Kanjeevaram Saree', 'Kasavu Handloom', 'Chikankari Kurta'],
  'Antique matte finish brass. Keep dry and avoid water contact.', 'Dispatches within 24 hours from Delhi.', 'published', false, 8
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
  images = EXCLUDED.images;
INSERT INTO products (
  id, name, slug, description, price, compare_at_price, stock, sku,
  category, category_slug, subcategory, subcategory_slug,
  primary_image, secondary_image, images, badges, outfit_pairings,
  materials_care, shipping_info, status, is_placeholder, sort_order
) VALUES (
  'prod-013', 'Chand-Jhumka Jadau Fusion Drops', 'chand-jhumka-jadau-fusion-drops', 'The best of both worlds: a crescent moon chandbali floral top descending into a flared bell jhumka drop adorned with polki stones and seed pearls.', 259900, 329900, 7, 'ALB-ER-013',
  'Earrings', 'earrings', 'Jhumkas', 'jhumkas',
  '/images/jhumka-chand-fusion.jpg', '/images/product-1-a.jpg', ARRAY['/images/jhumka-chand-fusion.jpg', '/images/product-1-a.jpg'], ARRAY['new_arrival'], ARRAY['Cocktail Saree', 'Mehendi Sharara', 'Contemporary Fusion Anarkali'],
  'Cast in brass and triple-dipped in 22k antique gold finish.', 'Ships worldwide. Express shipping available.', 'published', false, 9
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
  images = EXCLUDED.images;
INSERT INTO products (
  id, name, slug, description, price, compare_at_price, stock, sku,
  category, category_slug, subcategory, subcategory_slug,
  primary_image, secondary_image, images, badges, outfit_pairings,
  materials_care, shipping_info, status, is_placeholder, sort_order
) VALUES (
  'prod-005', 'Hansak Peacock Carved Hasli Collar', 'hansak-peacock-carved-hasli-collar', 'The quintessential Albeli signature piece. A rigid sculpted hasli collar engraved with twin dancing peacocks and blooming floral jaali. Finished with subtle ruby and emerald stone accents.', 299900, 380000, 3, 'ALB-NK-005',
  'Necklaces', 'necklaces', 'Haslis & Collars', 'haslis-collars',
  '/images/product-5-a.jpg', '/images/product-5-b.jpg', ARRAY['/images/product-5-a.jpg', '/images/product-5-b.jpg'], ARRAY['new_arrival'], ARRAY['Deep V-neck Kurta', 'Minimal Linen Shirt', 'Solid Black Tussar Saree'],
  'Engraved brass collar with high-micron antique matte gold plating. Spring-hinged opening for effortless wear. Wipe with dry cotton cloth.', 'Complimentary luxury Albeli presentation box with silk pouch included.', 'published', false, 10
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
  images = EXCLUDED.images;
INSERT INTO products (
  id, name, slug, description, price, compare_at_price, stock, sku,
  category, category_slug, subcategory, subcategory_slug,
  primary_image, secondary_image, images, badges, outfit_pairings,
  materials_care, shipping_info, status, is_placeholder, sort_order
) VALUES (
  'prod-006', 'Chandrika Minimalist Polki Studs', 'chandrika-minimalist-polki-studs', 'Clean, modern everyday studs featuring bezel-set polki crystals surrounded by delicate gold beadwork. Sits flat on the ear lobe for day-to-night comfort.', 89900, 119900, 15, 'ALB-ER-006',
  'Earrings', 'earrings', 'Studs & Tops', 'studs-tops',
  '/images/product-1-a.jpg', '/images/product-1-b.jpg', ARRAY['/images/product-1-a.jpg', '/images/product-1-b.jpg'], ARRAY['sale'], ARRAY['Daily Office Wear', 'White Linen Shirt', 'Casual Denim & Kurti'],
  'Surgical steel posts with gold-plated brass setting. Water-resistant and tarnish-resistant.', 'Ships within 24 hours. Free shipping over ₹999.', 'published', false, 11
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
  images = EXCLUDED.images;
INSERT INTO products (
  id, name, slug, description, price, compare_at_price, stock, sku,
  category, category_slug, subcategory, subcategory_slug,
  primary_image, secondary_image, images, badges, outfit_pairings,
  materials_care, shipping_info, status, is_placeholder, sort_order
) VALUES (
  'prod-007', 'Noor Cascading Emerald Dangler Earrings', 'noor-cascading-emerald-dangler-earrings', 'Dramatic shoulder-grazing danglers showcasing faceted emerald hydro-beads framed by vintage polki floral crowns. Unbelievably lightweight with sterling silver ear posts.', 219900, 289900, 6, 'ALB-ER-007',
  'Earrings', 'earrings', 'Danglers & Drops', 'danglers-drops',
  '/images/product-4-a.jpg', '/images/product-4-b.jpg', ARRAY['/images/product-4-a.jpg', '/images/product-4-b.jpg'], ARRAY['new_arrival'], ARRAY['Cocktail Gown', 'Raw Silk Kurta', 'Organza Saree'],
  'Brass with 22k antique gold plating and hydro beads. Avoid alcohol sprays.', 'Dispatches within 24 hours from Delhi.', 'published', false, 12
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
  images = EXCLUDED.images;
INSERT INTO products (
  id, name, slug, description, price, compare_at_price, stock, sku,
  category, category_slug, subcategory, subcategory_slug,
  primary_image, secondary_image, images, badges, outfit_pairings,
  materials_care, shipping_info, status, is_placeholder, sort_order
) VALUES (
  'prod-008', 'Sitara Filigree Polki Bali Hoops', 'sitara-filigree-polki-bali-hoops', 'Classic Indian balis re-imagined with delicate wire filigree, uncut glass polki bezels, and dangling pearl drops. Effortless latch closure for secure all-day wear.', 139900, 179900, 11, 'ALB-ER-008',
  'Earrings', 'earrings', 'Hoops & Balis', 'hoops-balis',
  '/images/product-1-a.jpg', '/images/product-1-b.jpg', ARRAY['/images/product-1-a.jpg', '/images/product-1-b.jpg'], ARRAY['best_seller'], ARRAY['Linen Saree', 'Boho Kurti', 'Everyday Chikankari'],
  'Hypoallergenic brass with micro-gold polish.', 'Ships within 24 hours.', 'published', false, 13
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
  images = EXCLUDED.images;
INSERT INTO products (
  id, name, slug, description, price, compare_at_price, stock, sku,
  category, category_slug, subcategory, subcategory_slug,
  primary_image, secondary_image, images, badges, outfit_pairings,
  materials_care, shipping_info, status, is_placeholder, sort_order
) VALUES (
  'prod-014', 'Begum Filigree Pearl Chandbalis', 'begum-filigree-pearl-chandbalis', 'Regal circular openwork chandbalis adorned with fine filigree jali, uncut glass kundan, and a cascading fringe of natural seed pearls.', 219900, 279900, 8, 'ALB-ER-014',
  'Earrings', 'earrings', 'Chandbalis', 'chandbalis',
  '/images/product-1-a.jpg', '/images/product-1-b.jpg', ARRAY['/images/product-1-a.jpg', '/images/product-1-b.jpg'], ARRAY['new_arrival'], ARRAY['Anarkali Suit', 'Silk Saree', 'Chanderi Dupatta'],
  'Brass base with 22k gold micron plating. Keep in airtight box.', 'Dispatches within 24-48 hours.', 'published', false, 14
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
  images = EXCLUDED.images;
INSERT INTO products (
  id, name, slug, description, price, compare_at_price, stock, sku,
  category, category_slug, subcategory, subcategory_slug,
  primary_image, secondary_image, images, badges, outfit_pairings,
  materials_care, shipping_info, status, is_placeholder, sort_order
) VALUES (
  'prod-015', 'Surya Kundan Floral Solitaire Studs', 'surya-kundan-floral-solitaire-studs', 'Lustrous floral tops featuring a prominent faceted glass polki center framed by petal prongs. Ideal for everyday elegance and subtle royal charm.', 99900, 129900, 14, 'ALB-ER-015',
  'Earrings', 'earrings', 'Studs & Tops', 'studs-tops',
  '/images/product-3-a.jpg', '/images/product-3-b.jpg', ARRAY['/images/product-3-a.jpg', '/images/product-3-b.jpg'], ARRAY['best_seller'], ARRAY['Office Formals', 'White Kurti', 'Casual Linen'],
  'Hypoallergenic copper brass with antique matte gold plating.', 'Ships within 24 hours.', 'published', false, 15
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
  images = EXCLUDED.images;
INSERT INTO products (
  id, name, slug, description, price, compare_at_price, stock, sku,
  category, category_slug, subcategory, subcategory_slug,
  primary_image, secondary_image, images, badges, outfit_pairings,
  materials_care, shipping_info, status, is_placeholder, sort_order
) VALUES (
  'prod-016', 'Zariyah Ruby Teardrop Danglers', 'zariyah-ruby-teardrop-danglers', 'Artisan-cut ruby doublet teardrops suspended from intricate polki florets. Moves fluidly with high brilliance under evening lights.', 189900, 239900, 6, 'ALB-ER-016',
  'Earrings', 'earrings', 'Danglers & Drops', 'danglers-drops',
  '/images/product-4-a.jpg', '/images/product-4-b.jpg', ARRAY['/images/product-4-a.jpg', '/images/product-4-b.jpg'], ARRAY['new_arrival'], ARRAY['Evening Gown', 'Raw Silk Saree', 'Cocktail Lehenga'],
  'Brass with doublet stones and 22k gold polish.', 'Ships in Albeli presentation box.', 'published', false, 16
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
  images = EXCLUDED.images;
INSERT INTO products (
  id, name, slug, description, price, compare_at_price, stock, sku,
  category, category_slug, subcategory, subcategory_slug,
  primary_image, secondary_image, images, badges, outfit_pairings,
  materials_care, shipping_info, status, is_placeholder, sort_order
) VALUES (
  'prod-017', 'Padmavati Multi-Strand Pearl Choker', 'padmavati-multi-strand-pearl-choker', 'Five luscious layers of small seed pearls gathered into an ornate gold kundan medallion clasp. Sits comfortably high on the collarbone.', 349900, 420000, 4, 'ALB-NK-017',
  'Necklaces', 'necklaces', 'Chokers', 'chokers',
  '/images/product-2-a.jpg', '/images/product-2-b.jpg', ARRAY['/images/product-2-a.jpg', '/images/product-2-b.jpg'], ARRAY['best_seller'], ARRAY['Bridal Lehenga', 'Banarasi Saree', 'Velvet Blouse'],
  'Cultured faux rice pearls and kundan polki medallion.', 'Dispatches within 24-48 hours.', 'published', false, 17
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
  images = EXCLUDED.images;
INSERT INTO products (
  id, name, slug, description, price, compare_at_price, stock, sku,
  category, category_slug, subcategory, subcategory_slug,
  primary_image, secondary_image, images, badges, outfit_pairings,
  materials_care, shipping_info, status, is_placeholder, sort_order
) VALUES (
  'prod-018', 'Mughal Jaali Floral Torc Collar', 'mughal-jaali-floral-torc-collar', 'Hand-chased torc neck collar inspired by royal Delhi architecture. Features a hidden spring latch and floral trellis engraving.', 329900, 399900, 3, 'ALB-NK-018',
  'Necklaces', 'necklaces', 'Haslis & Collars', 'haslis-collars',
  '/images/product-5-a.jpg', '/images/product-5-b.jpg', ARRAY['/images/product-5-a.jpg', '/images/product-5-b.jpg'], ARRAY['new_arrival'], ARRAY['Solid Black Kurta', 'Linen Shirt', 'Silk Dupatta'],
  'High gauge brass with antique gold finish.', 'Complimentary Albeli luxury gift box included.', 'published', false, 18
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
  images = EXCLUDED.images;
INSERT INTO products (
  id, name, slug, description, price, compare_at_price, stock, sku,
  category, category_slug, subcategory, subcategory_slug,
  primary_image, secondary_image, images, badges, outfit_pairings,
  materials_care, shipping_info, status, is_placeholder, sort_order
) VALUES (
  'prod-019', 'Pankhuri Meenakari Lotus Ring', 'pankhuri-meenakari-lotus-ring', 'A three-dimensional blooming lotus cocktail ring hand-painted in shades of Delhi Gulabi pink. Adjustable shank fits any finger size comfortably.', 129900, 169900, 10, 'ALB-RG-019',
  'Rings', 'rings', 'Cocktail Rings', 'cocktail-rings',
  '/images/product-3-a.jpg', '/images/product-3-b.jpg', ARRAY['/images/product-3-a.jpg', '/images/product-3-b.jpg'], ARRAY['sale'], ARRAY['Chiffon Saree', 'Pastel Suit', 'Casual Chic'],
  'Adjustable copper alloy with meenakari enamel.', 'Ships within 24 hours.', 'published', false, 19
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
  images = EXCLUDED.images;
INSERT INTO products (
  id, name, slug, description, price, compare_at_price, stock, sku,
  category, category_slug, subcategory, subcategory_slug,
  primary_image, secondary_image, images, badges, outfit_pairings,
  materials_care, shipping_info, status, is_placeholder, sort_order
) VALUES (
  'prod-020', 'Mayur Royal Openable Kada Bangle', 'mayur-royal-openable-kada-bangle', 'Heirloom heavy openable cuff with twin sculpted peacock terminals, ruby crystal eyes, and fine repoussé body engraving.', 279900, 349900, 5, 'ALB-BG-020',
  'Bangles & Bracelets', 'bangles-bracelets', 'Kadas & Cuffs', 'kadas',
  '/images/product-5-a.jpg', '/images/product-5-b.jpg', ARRAY['/images/product-5-a.jpg', '/images/product-5-b.jpg'], ARRAY['new_arrival'], ARRAY['Silk Saree', 'Brocade Kurta', 'Occasion Wear'],
  'Cast in heavy brass with screw-pin closure.', 'Dispatches within 24-48 hours.', 'published', false, 20
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
  images = EXCLUDED.images;

-- 8. Insert Hero Slides
INSERT INTO hero_slides (id, image, badge, headline, hindi_tagline, desktop_desc, cta_text, cta_link, sort_order)
VALUES ('slide-1', '/images/hero-1.jpg', 'Delhi • Handcrafted • Authentic', 'Jewellery that refuses to be ordinary.', 'अलबेली — थोड़ा हटके, पूरा देसी।', 'Bold artisanal polki, meenakari and antique jewellery designed in Delhi for modern celebrations and everyday flair.', 'Explore Drop', '/shop', 1)
ON CONFLICT (id) DO NOTHING;
INSERT INTO hero_slides (id, image, badge, headline, hindi_tagline, desktop_desc, cta_text, cta_link, sort_order)
VALUES ('slide-2', '/images/product-5-a.jpg', 'Limited Artisan Batch • Heritage', 'Heirloom Haslis & Royal Peacock Motifs.', 'शाही नक्काशी, दिल्ली का हुनर।', 'Hand-engraved by generational karigars in Delhi with heritage repoussé brass techniques and 22k antique gold plating.', 'Shop Hasli Edit', '/shop?category=necklaces', 2)
ON CONFLICT (id) DO NOTHING;
INSERT INTO hero_slides (id, image, badge, headline, hindi_tagline, desktop_desc, cta_text, cta_link, sort_order)
VALUES ('slide-3', '/images/product-2-a.jpg', 'Festive Edit 2026 • Bridal & Occasion', 'Noorani Polki Chokers & Lustrous Pearls.', 'नूरानी पोलकी, महफ़िल का नूर।', 'Exquisite hand-strung emerald bead drops and uncut polki glass stones that capture the candlelit radiance of royal evenings.', 'Discover Festive Edit', '/collections/festive-edit', 3)
ON CONFLICT (id) DO NOTHING;

-- 9. Insert Default Settings
INSERT INTO settings (id, data) VALUES ('default', '{"general":{"siteName":"Albeli","tagline":"Not so ordinary.","hindiTagline":"थोड़ा हटके, पूरा देसी।","contactEmail":"care@albeli.in","contactPhone":"+91 96507 50834","whatsappNumber":"+919650750834","instagramHandle":"@albelihouse","delhiStudioAddress":"Shahpur Jat / Chandni Chowk artisan studio, Delhi, India","currency":"INR"},"announcement":{"enabled":true,"text":"✨ Free Express Delivery across India on orders above ₹999 | Delhi Same-Day Available","secondaryText":"Handcrafted in Delhi • Pure Brass & 22k Antique Gold Plated","link":"/shop"}}')
ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data;

-- 10. Verification Queries
SELECT count(*) AS total_products FROM products;
SELECT count(*) AS total_categories FROM categories;
