-- ═══════════════════════════════════════════════
-- ALBELI — Row Level Security Policies
-- ═══════════════════════════════════════════════
-- Public: read published content only
-- Admin: full CRUD for owner/admin, limited for staff
-- Private: user's own data only

-- ── Helper Function: Check Admin Role ────────────
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
    AND role IN ('owner', 'admin')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION is_staff_or_above()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
    AND role IN ('owner', 'admin', 'staff')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION is_owner()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
    AND role = 'owner'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ── Enable RLS on ALL tables ─────────────────────
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE attribute_definitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_designs ENABLE ROW LEVEL SECURITY;
ALTER TABLE enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE waitlist_signups ENABLE ROW LEVEL SECURITY;
ALTER TABLE custom_design_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE ugc_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE nav_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE manual_orders ENABLE ROW LEVEL SECURITY;

-- ══════════════════════════════════════════════════
-- PROFILES
-- ══════════════════════════════════════════════════
CREATE POLICY "Users can read own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Admins can read all profiles"
  ON profiles FOR SELECT
  USING (is_admin());

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can update any profile"
  ON profiles FOR UPDATE
  USING (is_admin());

-- ══════════════════════════════════════════════════
-- CATEGORIES (public read, admin write)
-- ══════════════════════════════════════════════════
CREATE POLICY "Anyone can read visible categories"
  ON categories FOR SELECT
  USING (is_visible = true);

CREATE POLICY "Admins can read all categories"
  ON categories FOR SELECT
  USING (is_admin());

CREATE POLICY "Admins can manage categories"
  ON categories FOR ALL
  USING (is_admin());

-- ══════════════════════════════════════════════════
-- COLLECTIONS (public read, admin write)
-- ══════════════════════════════════════════════════
CREATE POLICY "Anyone can read visible collections"
  ON collections FOR SELECT
  USING (is_visible = true);

CREATE POLICY "Admins can manage collections"
  ON collections FOR ALL
  USING (is_admin());

-- ══════════════════════════════════════════════════
-- ATTRIBUTE DEFINITIONS (public read, admin write)
-- ══════════════════════════════════════════════════
CREATE POLICY "Anyone can read attribute definitions"
  ON attribute_definitions FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage attribute definitions"
  ON attribute_definitions FOR ALL
  USING (is_admin());

-- ══════════════════════════════════════════════════
-- PRODUCTS (public read published, staff+ write)
-- ══════════════════════════════════════════════════
CREATE POLICY "Anyone can read published products"
  ON products FOR SELECT
  USING (status = 'published' AND deleted_at IS NULL);

CREATE POLICY "Staff can read all products"
  ON products FOR SELECT
  USING (is_staff_or_above());

CREATE POLICY "Staff can manage products"
  ON products FOR ALL
  USING (is_staff_or_above());

-- ══════════════════════════════════════════════════
-- PRODUCT IMAGES (follows product visibility)
-- ══════════════════════════════════════════════════
CREATE POLICY "Anyone can read product images"
  ON product_images FOR SELECT
  USING (true);

CREATE POLICY "Staff can manage product images"
  ON product_images FOR ALL
  USING (is_staff_or_above());

-- ══════════════════════════════════════════════════
-- PRODUCT COLLECTIONS (public read, admin write)
-- ══════════════════════════════════════════════════
CREATE POLICY "Anyone can read product collections"
  ON product_collections FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage product collections"
  ON product_collections FOR ALL
  USING (is_admin());

-- ══════════════════════════════════════════════════
-- PRODUCT VARIANTS
-- ══════════════════════════════════════════════════
CREATE POLICY "Anyone can read product variants"
  ON product_variants FOR SELECT
  USING (true);

CREATE POLICY "Staff can manage product variants"
  ON product_variants FOR ALL
  USING (is_staff_or_above());

-- ══════════════════════════════════════════════════
-- SAVED DESIGNS (user's own data)
-- ══════════════════════════════════════════════════
CREATE POLICY "Users can read own saved designs"
  ON saved_designs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own saved designs"
  ON saved_designs FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can read all saved designs"
  ON saved_designs FOR SELECT
  USING (is_admin());

-- ══════════════════════════════════════════════════
-- ENQUIRIES (public insert, staff+ read)
-- ══════════════════════════════════════════════════
CREATE POLICY "Anyone can create enquiries"
  ON enquiries FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Staff can read and manage enquiries"
  ON enquiries FOR ALL
  USING (is_staff_or_above());

-- ══════════════════════════════════════════════════
-- WAITLIST SIGNUPS (public insert, admin read)
-- ══════════════════════════════════════════════════
CREATE POLICY "Anyone can sign up for waitlist"
  ON waitlist_signups FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can read waitlist"
  ON waitlist_signups FOR SELECT
  USING (is_admin());

-- ══════════════════════════════════════════════════
-- CUSTOM DESIGN REQUESTS (public insert, staff+ read)
-- ══════════════════════════════════════════════════
CREATE POLICY "Anyone can submit custom design requests"
  ON custom_design_requests FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Staff can manage custom design requests"
  ON custom_design_requests FOR ALL
  USING (is_staff_or_above());

-- ══════════════════════════════════════════════════
-- REVIEWS (public read approved, admin manage)
-- ══════════════════════════════════════════════════
CREATE POLICY "Anyone can read approved reviews"
  ON reviews FOR SELECT
  USING (is_approved = true);

CREATE POLICY "Anyone can submit reviews"
  ON reviews FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can manage reviews"
  ON reviews FOR ALL
  USING (is_admin());

-- ══════════════════════════════════════════════════
-- UGC ITEMS (public read visible, admin write)
-- ══════════════════════════════════════════════════
CREATE POLICY "Anyone can read visible UGC"
  ON ugc_items FOR SELECT
  USING (is_visible = true);

CREATE POLICY "Admins can manage UGC"
  ON ugc_items FOR ALL
  USING (is_admin());

-- ══════════════════════════════════════════════════
-- PAGE SECTIONS (public read visible, admin write)
-- ══════════════════════════════════════════════════
CREATE POLICY "Anyone can read visible page sections"
  ON page_sections FOR SELECT
  USING (is_visible = true);

CREATE POLICY "Admins can read all page sections"
  ON page_sections FOR SELECT
  USING (is_admin());

CREATE POLICY "Admins can manage page sections"
  ON page_sections FOR ALL
  USING (is_admin());

-- ══════════════════════════════════════════════════
-- PAGE VERSIONS (admin only)
-- ══════════════════════════════════════════════════
CREATE POLICY "Admins can manage page versions"
  ON page_versions FOR ALL
  USING (is_admin());

-- ══════════════════════════════════════════════════
-- PAGES (public read visible, admin write)
-- ══════════════════════════════════════════════════
CREATE POLICY "Anyone can read visible pages"
  ON pages FOR SELECT
  USING (is_visible = true);

CREATE POLICY "Admins can manage pages"
  ON pages FOR ALL
  USING (is_admin());

-- ══════════════════════════════════════════════════
-- NAV ITEMS (public read visible, admin write)
-- ══════════════════════════════════════════════════
CREATE POLICY "Anyone can read visible nav items"
  ON nav_items FOR SELECT
  USING (is_visible = true);

CREATE POLICY "Admins can manage nav items"
  ON nav_items FOR ALL
  USING (is_admin());

-- ══════════════════════════════════════════════════
-- MEDIA ASSETS (admin only)
-- ══════════════════════════════════════════════════
CREATE POLICY "Staff can read media assets"
  ON media_assets FOR SELECT
  USING (is_staff_or_above());

CREATE POLICY "Staff can manage media assets"
  ON media_assets FOR ALL
  USING (is_staff_or_above());

-- ══════════════════════════════════════════════════
-- BLOG POSTS (public read published, admin write)
-- ══════════════════════════════════════════════════
CREATE POLICY "Anyone can read published blog posts"
  ON blog_posts FOR SELECT
  USING (is_published = true);

CREATE POLICY "Admins can manage blog posts"
  ON blog_posts FOR ALL
  USING (is_admin());

-- ══════════════════════════════════════════════════
-- SETTINGS (public read, admin write)
-- ══════════════════════════════════════════════════
CREATE POLICY "Anyone can read settings"
  ON settings FOR SELECT
  USING (true);

CREATE POLICY "Admins can update settings"
  ON settings FOR UPDATE
  USING (is_admin());

-- ══════════════════════════════════════════════════
-- AUDIT LOGS (admin read, auto-insert)
-- ══════════════════════════════════════════════════
CREATE POLICY "Admins can read audit logs"
  ON audit_logs FOR SELECT
  USING (is_owner());

CREATE POLICY "Staff can insert audit logs"
  ON audit_logs FOR INSERT
  WITH CHECK (is_staff_or_above());

-- ══════════════════════════════════════════════════
-- MANUAL ORDERS (staff+ only)
-- ══════════════════════════════════════════════════
CREATE POLICY "Staff can manage manual orders"
  ON manual_orders FOR ALL
  USING (is_staff_or_above());

-- ══════════════════════════════════════════════════
-- STORAGE BUCKETS
-- ══════════════════════════════════════════════════
-- Run these in the Supabase dashboard or via supabase CLI:
-- INSERT INTO storage.buckets (id, name, public) VALUES ('products', 'products', true);
-- INSERT INTO storage.buckets (id, name, public) VALUES ('media', 'media', true);
-- INSERT INTO storage.buckets (id, name, public) VALUES ('uploads', 'uploads', false);
