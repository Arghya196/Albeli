-- ═══════════════════════════════════════════════
-- ALBELI — Seed Data
-- ═══════════════════════════════════════════════
-- 8 placeholder products, sample categories, collections,
-- homepage sections, nav items, and default settings.
-- All placeholder content marked with is_placeholder = true.

-- ── Settings (singleton) ─────────────────────────
INSERT INTO settings (id) VALUES ('default')
ON CONFLICT (id) DO NOTHING;

-- ── Categories ───────────────────────────────────
INSERT INTO categories (id, name, slug, sort_order) VALUES
  ('c1000000-0000-0000-0000-000000000001', 'Necklaces', 'necklaces', 1),
  ('c1000000-0000-0000-0000-000000000002', 'Earrings', 'earrings', 2),
  ('c1000000-0000-0000-0000-000000000003', 'Bangles & Bracelets', 'bangles-bracelets', 3),
  ('c1000000-0000-0000-0000-000000000004', 'Rings', 'rings', 4),
  ('c1000000-0000-0000-0000-000000000005', 'Maang Tikka & Hair', 'maang-tikka-hair', 5),
  ('c1000000-0000-0000-0000-000000000006', 'Anklets', 'anklets', 6);

-- ── Collections ──────────────────────────────────
INSERT INTO collections (id, name, slug, description, sort_order) VALUES
  ('d1000000-0000-0000-0000-000000000001', 'Festive Edit', 'festive-edit', 'Tyohaar ready? ✨ Curated picks for every celebration.', 1),
  ('d1000000-0000-0000-0000-000000000002', 'Everyday Minimal', 'everyday-minimal', 'Light, subtle, goes-with-everything pieces for daily wear.', 2),
  ('d1000000-0000-0000-0000-000000000003', 'Statement Pieces', 'statement-pieces', 'Bold, conversation-starting designs that speak for themselves.', 3),
  ('d1000000-0000-0000-0000-000000000004', 'Gifting', 'gifting', 'Dil se, for the ones you love. Gift-ready favourites.', 4),
  ('d1000000-0000-0000-0000-000000000005', 'New Drops', 'new-drops', 'Fresh off the workbench. Be the first to wear them.', 5);

-- ── Attribute Definitions ────────────────────────
INSERT INTO attribute_definitions (id, name, slug, type, options, is_filterable, sort_order) VALUES
  ('a1000000-0000-0000-0000-000000000001', 'Color', 'color', 'select', '["Gold", "Silver", "Rose Gold", "Oxidised", "Multi"]', true, 1),
  ('a1000000-0000-0000-0000-000000000002', 'Material', 'material', 'select', '["Brass", "Copper", "Alloy", "German Silver", "Kundan", "Meenakari"]', true, 2),
  ('a1000000-0000-0000-0000-000000000003', 'Occasion', 'occasion', 'multi_select', '["Daily Wear", "Festival", "Wedding", "Party", "Office"]', true, 3),
  ('a1000000-0000-0000-0000-000000000004', 'Style', 'style', 'select', '["Traditional", "Fusion", "Minimal", "Boho", "Statement"]', true, 4);

-- ── Placeholder Products ─────────────────────────
INSERT INTO products (id, name, slug, description, price, compare_at_price, stock, category_id, attributes, badges, tags, outfit_pairings, status, is_placeholder, sort_order, materials_care, shipping_info) VALUES
  (
    'p1000000-0000-0000-0000-000000000001',
    'Chameli Chandbali Earrings',
    'chameli-chandbali-earrings',
    'Delicate chandbali earrings inspired by chameli flowers. Handcrafted in brass with gold plating and kundan work. Lightweight enough for all-day wear, stunning enough for a sangeet night.',
    149900, 199900, 12,
    'c1000000-0000-0000-0000-000000000002',
    '{"color": "Gold", "material": "Brass", "occasion": ["Festival", "Wedding"], "style": "Traditional"}',
    ARRAY['best_seller'],
    ARRAY['chandbali', 'kundan', 'wedding', 'festive'],
    ARRAY['saree', 'lehenga', 'kurta set'],
    'published', true, 1,
    'Brass base with gold plating. Kundan stones. Wipe with soft cloth after use. Avoid water and perfume contact.',
    'Ships in 2-3 business days. Free shipping above ₹999.'
  ),
  (
    'p1000000-0000-0000-0000-000000000002',
    'Tara Layered Necklace Set',
    'tara-layered-necklace-set',
    'A versatile 3-layer necklace set that transitions from brunch to baraat. Minimal chains with tiny star pendants in mixed metals.',
    199900, NULL, 8,
    'c1000000-0000-0000-0000-000000000001',
    '{"color": "Gold", "material": "Alloy", "occasion": ["Daily Wear", "Party"], "style": "Fusion"}',
    ARRAY['new_arrival'],
    ARRAY['layered', 'minimal', 'everyday'],
    ARRAY['western top', 'kurta', 'saree'],
    'published', true, 2,
    'Alloy with gold finish. Adjustable length. Store flat to prevent tangling.',
    'Ships in 2-3 business days. Free shipping above ₹999.'
  ),
  (
    'p1000000-0000-0000-0000-000000000003',
    'Meera Oxidised Jhumka',
    'meera-oxidised-jhumka',
    'Classic oxidised silver jhumkas with intricate ghungroo detailing. A staple for every desi jewellery lover. Pairs beautifully with cotton kurtas and indie sarees.',
    79900, 119900, 20,
    'c1000000-0000-0000-0000-000000000002',
    '{"color": "Oxidised", "material": "German Silver", "occasion": ["Daily Wear", "Festival"], "style": "Traditional"}',
    ARRAY['best_seller'],
    ARRAY['jhumka', 'oxidised', 'boho', 'everyday'],
    ARRAY['cotton kurta', 'indie saree', 'jeans'],
    'published', true, 3,
    'German silver (oxidised finish). Clean with lemon juice for shine. Avoid prolonged water exposure.',
    'Ships in 2-3 business days. Free shipping above ₹999.'
  ),
  (
    'p1000000-0000-0000-0000-000000000004',
    'Riya Pearl Choker',
    'riya-pearl-choker',
    'A modern choker combining freshwater pearls with a delicate gold-plated chain. Minimal, elegant, and perfect for both western and Indian outfits.',
    249900, NULL, 5,
    'c1000000-0000-0000-0000-000000000001',
    '{"color": "Gold", "material": "Brass", "occasion": ["Party", "Wedding"], "style": "Minimal"}',
    ARRAY['new_arrival'],
    ARRAY['choker', 'pearl', 'minimal', 'bridal'],
    ARRAY['blouse', 'off-shoulder top', 'saree'],
    'published', true, 4,
    'Brass with gold plating. Freshwater pearls. Handle with care — pearls are delicate.',
    'Ships in 2-3 business days. Free shipping above ₹999.'
  ),
  (
    'p1000000-0000-0000-0000-000000000005',
    'Sitara Maang Tikka',
    'sitara-maang-tikka',
    'A show-stopping kundan maang tikka with a central emerald-green stone and delicate pearl drops. Festive royalty for your forehead.',
    129900, 169900, 7,
    'c1000000-0000-0000-0000-000000000005',
    '{"color": "Gold", "material": "Kundan", "occasion": ["Wedding", "Festival"], "style": "Traditional"}',
    ARRAY[]::TEXT[],
    ARRAY['maang tikka', 'kundan', 'bridal', 'festive'],
    ARRAY['lehenga', 'saree', 'anarkali'],
    'published', true, 5,
    'Kundan work on brass base. Gold plating. Store separately to avoid scratches.',
    'Ships in 2-3 business days. Free shipping above ₹999.'
  ),
  (
    'p1000000-0000-0000-0000-000000000006',
    'Anaya Bangle Stack',
    'anaya-bangle-stack',
    'Set of 5 slim bangles in rose gold with tiny paisley engravings. Stack them up or wear one at a time — your choice, your style.',
    99900, NULL, 15,
    'c1000000-0000-0000-0000-000000000003',
    '{"color": "Rose Gold", "material": "Brass", "occasion": ["Daily Wear", "Office"], "style": "Minimal"}',
    ARRAY[]::TEXT[],
    ARRAY['bangle', 'stack', 'rose gold', 'minimal'],
    ARRAY['western', 'kurta', 'formal wear'],
    'published', true, 6,
    'Brass with rose gold plating. Wipe with soft cloth. Available in sizes 2.4, 2.6, 2.8.',
    'Ships in 2-3 business days. Free shipping above ₹999.'
  ),
  (
    'p1000000-0000-0000-0000-000000000007',
    'Zara Statement Ring',
    'zara-statement-ring',
    'An oversized boho ring with turquoise enamel work on oxidised silver. One size fits most. Makes every hand gesture a conversation.',
    69900, 89900, 10,
    'c1000000-0000-0000-0000-000000000004',
    '{"color": "Oxidised", "material": "German Silver", "occasion": ["Party", "Festival"], "style": "Boho"}',
    ARRAY['sale'],
    ARRAY['ring', 'statement', 'boho', 'oxidised'],
    ARRAY['indo-western', 'kurta', 'dress'],
    'published', true, 7,
    'German silver with enamel work. Adjustable band. Avoid contact with water and chemicals.',
    'Ships in 2-3 business days. Free shipping above ₹999.'
  ),
  (
    'p1000000-0000-0000-0000-000000000008',
    'Kiara Payal Anklet Pair',
    'kiara-payal-anklet-pair',
    'Dainty silver-toned anklets with tiny bell charms. The softest jhankar with every step. Adjustable chain for the perfect fit.',
    59900, NULL, 18,
    'c1000000-0000-0000-0000-000000000006',
    '{"color": "Silver", "material": "Alloy", "occasion": ["Daily Wear", "Festival"], "style": "Traditional"}',
    ARRAY['new_arrival'],
    ARRAY['anklet', 'payal', 'ghungroo', 'silver'],
    ARRAY['saree', 'lehenga', 'kurta'],
    'published', true, 8,
    'Alloy with silver plating. Adjustable. The tiny bells create a soft sound — very traditional, very albeli.',
    'Ships in 2-3 business days. Free shipping above ₹999.'
  );

-- ── Link Products to Collections ─────────────────
INSERT INTO product_collections (product_id, collection_id) VALUES
  ('p1000000-0000-0000-0000-000000000001', 'd1000000-0000-0000-0000-000000000001'),
  ('p1000000-0000-0000-0000-000000000001', 'd1000000-0000-0000-0000-000000000004'),
  ('p1000000-0000-0000-0000-000000000002', 'd1000000-0000-0000-0000-000000000005'),
  ('p1000000-0000-0000-0000-000000000002', 'd1000000-0000-0000-0000-000000000002'),
  ('p1000000-0000-0000-0000-000000000003', 'd1000000-0000-0000-0000-000000000002'),
  ('p1000000-0000-0000-0000-000000000003', 'd1000000-0000-0000-0000-000000000001'),
  ('p1000000-0000-0000-0000-000000000004', 'd1000000-0000-0000-0000-000000000003'),
  ('p1000000-0000-0000-0000-000000000004', 'd1000000-0000-0000-0000-000000000005'),
  ('p1000000-0000-0000-0000-000000000005', 'd1000000-0000-0000-0000-000000000001'),
  ('p1000000-0000-0000-0000-000000000006', 'd1000000-0000-0000-0000-000000000002'),
  ('p1000000-0000-0000-0000-000000000006', 'd1000000-0000-0000-0000-000000000004'),
  ('p1000000-0000-0000-0000-000000000007', 'd1000000-0000-0000-0000-000000000003'),
  ('p1000000-0000-0000-0000-000000000008', 'd1000000-0000-0000-0000-000000000005'),
  ('p1000000-0000-0000-0000-000000000008', 'd1000000-0000-0000-0000-000000000002');

-- ── Homepage Sections ────────────────────────────
INSERT INTO page_sections (id, page_id, type, title, data, is_visible, is_placeholder, sort_order) VALUES
  (
    's1000000-0000-0000-0000-000000000001', 'home', 'announcement', NULL,
    '{"messages": ["Shipping all over India & worldwide ✨", "New drop is live — shop now!", "Free shipping above ₹999"]}',
    true, true, 1
  ),
  (
    's1000000-0000-0000-0000-000000000002', 'home', 'hero_carousel', NULL,
    '{"slides": [{"headline": "Not so ordinary.", "subheadline": "Thoda hatke, poora desi.", "cta_text": "Explore the collection", "cta_url": "/shop", "image_url": null}]}',
    true, true, 2
  ),
  (
    's1000000-0000-0000-0000-000000000003', 'home', 'theme_cards', 'Shop by vibe',
    '{"cards": [{"title": "Festive Edit", "slug": "festive-edit", "image_url": null}, {"title": "Everyday Minimal", "slug": "everyday-minimal", "image_url": null}, {"title": "Statement Pieces", "slug": "statement-pieces", "image_url": null}, {"title": "Gifting", "slug": "gifting", "image_url": null}]}',
    true, true, 3
  ),
  (
    's1000000-0000-0000-0000-000000000004', 'home', 'product_row', 'Best Sellers',
    '{"collection_slug": "festive-edit", "max_items": 4, "show_view_all": true}',
    true, true, 4
  ),
  (
    's1000000-0000-0000-0000-000000000005', 'home', 'story_block', 'Our Story',
    '{"heading": "Crafted in Delhi, worn everywhere.", "body": "Albeli is a love letter to Indian craftsmanship — reimagined for the modern desi girl. Every piece is designed in Delhi, handcrafted by local artisans, and made to make you feel — thoda hatke, poora desi.", "cta_text": "Know more", "cta_url": "/about", "image_url": null}',
    true, true, 5
  ),
  (
    's1000000-0000-0000-0000-000000000006', 'home', 'icon_trio', 'Reasons to love Albeli',
    '{"items": [{"icon": "heart", "title": "Handcrafted with love", "description": "Every piece is made by skilled Delhi artisans"}, {"icon": "truck", "title": "Ships worldwide", "description": "From Delhi to your doorstep, anywhere in the world"}, {"icon": "shield", "title": "Quality guaranteed", "description": "Tarnish-resistant finishes that last"}]}',
    true, true, 6
  ),
  (
    's1000000-0000-0000-0000-000000000007', 'home', 'newsletter', 'Join the Albeli fam ✨',
    '{"heading": "Join the Albeli fam ✨", "description": "Be the first to know about new drops, exclusive offers, and behind-the-scenes magic.", "cta_text": "Sign me up", "type": "email"}',
    true, true, 7
  );

-- ── Navigation Items ─────────────────────────────
INSERT INTO nav_items (id, location, label, url, sort_order) VALUES
  ('n1000000-0000-0000-0000-000000000001', 'header', 'Shop', '/shop', 1),
  ('n1000000-0000-0000-0000-000000000002', 'header', 'Collections', '/collections', 2),
  ('n1000000-0000-0000-0000-000000000003', 'header', 'New Drops', '/collections/new-drops', 3),
  ('n1000000-0000-0000-0000-000000000004', 'header', 'About', '/about', 4),
  ('n1000000-0000-0000-0000-000000000005', 'header', 'Journal', '/journal', 5),
  ('n1000000-0000-0000-0000-000000000006', 'footer', 'Shop All', '/shop', 1),
  ('n1000000-0000-0000-0000-000000000007', 'footer', 'About Us', '/about', 2),
  ('n1000000-0000-0000-0000-000000000008', 'footer', 'Contact', '/contact', 3),
  ('n1000000-0000-0000-0000-000000000009', 'footer', 'Size & Care', '/size-care', 4),
  ('n1000000-0000-0000-0000-000000000010', 'footer', 'Shipping & Returns', '/shipping-returns', 5),
  ('n1000000-0000-0000-0000-000000000011', 'footer', 'Privacy Policy', '/privacy', 6),
  ('n1000000-0000-0000-0000-000000000012', 'footer', 'Terms & Conditions', '/terms', 7);
