// ═══════════════════════════════════════════════
// ALBELI — Tasteful Starter Catalogue & Sections
// ═══════════════════════════════════════════════
// Used for local static development and database fallback.

export interface PlaceholderProduct {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number; // in paise (e.g. 249900 = ₹2,499)
  compareAtPrice?: number | null;
  stock: number;
  sku: string;
  category: string;
  categorySlug: string;
  subcategory?: string;
  subcategorySlug?: string;
  badges: ("best_seller" | "new_arrival" | "sale")[];
  outfitPairings: string[];
  materialsCare: string;
  shippingInfo: string;
  primaryImage: string;
  secondaryImage: string;
  videoUrl?: string;
  isPlaceholder: boolean;
}

export interface ProductVideoReel {
  id: string;
  title: string;
  hindiTitle: string;
  productName: string;
  productPrice: number;
  productSlug: string;
  posterImage: string;
  videoUrl?: string;
  duration: string;
  views: string;
}

export const PRODUCT_REELS: ProductVideoReel[] = [
  {
    id: "reel-1",
    title: "Mayura Chandbali in Natural Light",
    hindiTitle: "मयूर झुमका • धूप में चमक",
    productName: "Mayura Peacock Chandbali",
    productPrice: 249900,
    productSlug: "mayura-peacock-chandbali-earrings",
    posterImage: "/images/product-1-a.jpg",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-gold-earrings-with-gems-close-up-42416-large.mp4",
    duration: "0:14",
    views: "18.4K",
  },
  {
    id: "reel-2",
    title: "Hand-engraving the Hansak Hasli",
    hindiTitle: "हंसक हसली • कारीगरी की झलक",
    productName: "Hansak Peacock Hasli Collar",
    productPrice: 449900,
    productSlug: "hansak-peacock-hasli-collar",
    posterImage: "/images/product-5-a.jpg",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-hands-of-a-jeweler-holding-a-gold-ring-42417-large.mp4",
    duration: "0:21",
    views: "34.2K",
  },
  {
    id: "reel-3",
    title: "Noorani Polki Emerald Shimmer",
    hindiTitle: "नूरानी चोकर • महफ़िल का नूर",
    productName: "Noorani Polki Emerald Choker",
    productPrice: 389900,
    productSlug: "noorani-polki-emerald-choker",
    posterImage: "/images/product-2-a.jpg",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-woman-wearing-a-gold-necklace-close-up-42418-large.mp4",
    duration: "0:18",
    views: "22.9K",
  },
  {
    id: "reel-4",
    title: "Lotus Meenakari Cocktail Ring",
    hindiTitle: "गुलाबी मीनाकारी अंगूठी",
    productName: "Gulabi Meenakari Cocktail Ring",
    productPrice: 169900,
    productSlug: "gulabi-meenakari-lotus-cocktail-ring",
    posterImage: "/images/product-3-a.jpg",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-hands-of-a-woman-trying-on-a-gold-ring-42419-large.mp4",
    duration: "0:12",
    views: "15.1K",
  },
];

export const PLACEHOLDER_PRODUCTS: PlaceholderProduct[] = [
  {
    id: "prod-001",
    name: "Mayura Peacock Chandbali Earrings",
    slug: "mayura-peacock-chandbali-earrings",
    description:
      "Handcrafted with intricate royal peacock motifs, vivid meenakari enamel work, and cascading freshwater pearls. Cast in brass and triple-dipped in 22k antique gold finish.",
    price: 249900,
    compareAtPrice: 329900,
    stock: 7,
    sku: "ALB-ER-001",
    category: "Earrings",
    categorySlug: "earrings",
    subcategory: "Chandbalis",
    subcategorySlug: "chandbalis",
    badges: ["best_seller"],
    outfitPairings: ["Chanderi Saree", "Banarasi Anarkali", "Festive Kurta"],
    materialsCare:
      "Brass base with 22k antique gold plating, meenakari enamel, glass polki, and faux pearls. Keep away from perfumes, moisture, and alcohol sprays. Store in the provided airtight Albeli pouch.",
    shippingInfo:
      "Dispatches within 24-48 hours from Delhi. Delivery across India in 3-5 business days. Express worldwide shipping available.",
    primaryImage: "/images/product-1-a.jpg",
    secondaryImage: "/images/product-1-b.jpg",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-gold-earrings-with-gems-close-up-42416-large.mp4",
    isPlaceholder: true,
  },
  {
    id: "prod-002",
    name: "Noorani Polki Emerald Choker",
    slug: "noorani-polki-emerald-choker",
    description:
      "A heritage choker featuring bezel-set uncut glass polki stones, deep emerald green hydro-beads, and seed pearl clusters. Includes an adjustable zari dori for a customized neckline fit.",
    price: 389900,
    compareAtPrice: 499900,
    stock: 4,
    sku: "ALB-NK-002",
    category: "Necklaces",
    categorySlug: "necklaces",
    subcategory: "Chokers",
    subcategorySlug: "chokers",
    badges: ["best_seller", "new_arrival"],
    outfitPairings: ["Raw Silk Saree", "Bridal Velvet Blouse", "Ivory Lehenga"],
    materialsCare:
      "Gold-plated alloy with uncut glass polki and emerald green crystal drops. Adjustable gold thread cord. Wipe gently with a dry microfiber cloth after each wear.",
    shippingInfo:
      "Dispatches within 24-48 hours. Gift box packaging included with every choker.",
    primaryImage: "/images/product-2-a.jpg",
    secondaryImage: "/images/product-2-b.jpg",
    isPlaceholder: true,
  },
  {
    id: "prod-003",
    name: "Aftab Royal Kundan Cocktail Ring",
    slug: "aftab-royal-kundan-cocktail-ring",
    description:
      "An oversized solar statement ring inspired by Mughal court jewellery. Features a faceted ruby doublet centre framed by concentric rings of polki stones and granulations. Adjustable band fits all finger sizes comfortably.",
    price: 149900,
    compareAtPrice: 189900,
    stock: 12,
    sku: "ALB-RG-003",
    category: "Rings",
    categorySlug: "rings",
    subcategory: "Cocktail Rings",
    subcategorySlug: "cocktail-rings",
    badges: ["new_arrival"],
    outfitPairings: ["Cocktail Saree", "Western Fusion Blazer", "Mehendi Suit"],
    materialsCare:
      "High grade copper-brass alloy with matte antique gold plating. Adjustable open band. Nickel and lead free.",
    shippingInfo: "Ships worldwide. Free standard shipping across India on all prepaid orders.",
    primaryImage: "/images/product-3-a.jpg",
    secondaryImage: "/images/product-3-b.jpg",
    isPlaceholder: true,
  },
  {
    id: "prod-004",
    name: "Gulabi Lotus Meenakari Jhumkas",
    slug: "gulabi-lotus-meenakari-jhumkas",
    description:
      "Delicate hand-painted lotus meenakari in powdery Delhi rose and sage green. Bell-shaped jhumkas adorned with micro pearl fringe that sway gracefully with every movement.",
    price: 189900,
    compareAtPrice: 240000,
    stock: 9,
    sku: "ALB-ER-004",
    category: "Earrings",
    categorySlug: "earrings",
    subcategory: "Jhumkas",
    subcategorySlug: "jhumkas",
    badges: ["best_seller"],
    outfitPairings: ["Cotton Mulmul Kurta", "Pastel Sharara", "Bandhani Saree"],
    materialsCare:
      "Artisan hand-enameled brass. Lightweight and hypoallergenic. Clean with a soft dry brush.",
    shippingInfo: "Dispatches within 24 hours. Includes replacement back-stoppers.",
    primaryImage: "/images/product-4-a.jpg",
    secondaryImage: "/images/product-4-b.jpg",
    isPlaceholder: true,
  },
  {
    id: "prod-005",
    name: "Hansak Peacock Carved Hasli Collar",
    slug: "hansak-peacock-carved-hasli-collar",
    description:
      "The quintessential Albeli signature piece. A rigid sculpted hasli collar engraved with twin dancing peacocks and blooming floral jaali. Finished with subtle ruby and emerald stone accents.",
    price: 299900,
    compareAtPrice: 380000,
    stock: 3,
    sku: "ALB-NK-005",
    category: "Necklaces",
    categorySlug: "necklaces",
    subcategory: "Haslis & Collars",
    subcategorySlug: "haslis-collars",
    badges: ["new_arrival"],
    outfitPairings: ["Deep V-neck Kurta", "Minimal Linen Shirt", "Solid Black Tussar Saree"],
    materialsCare:
      "Engraved brass collar with high-micron antique matte gold plating. Spring-hinged opening for effortless wear. Wipe with dry cotton cloth.",
    shippingInfo: "Complimentary luxury Albeli presentation box with silk pouch included.",
    primaryImage: "/images/product-5-a.jpg",
    secondaryImage: "/images/product-5-b.jpg",
    isPlaceholder: true,
  },
  {
    id: "prod-006",
    name: "Chandrika Minimalist Polki Studs",
    slug: "chandrika-minimalist-polki-studs",
    description:
      "Clean, modern everyday studs featuring bezel-set polki crystals surrounded by delicate gold beadwork. Sits flat on the ear lobe for day-to-night comfort.",
    price: 89900,
    compareAtPrice: 119900,
    stock: 15,
    sku: "ALB-ER-006",
    category: "Earrings",
    categorySlug: "earrings",
    subcategory: "Studs & Tops",
    subcategorySlug: "studs-tops",
    badges: ["sale"],
    outfitPairings: ["Daily Office Wear", "White Linen Shirt", "Casual Denim & Kurti"],
    materialsCare: "Surgical steel posts with gold-plated brass setting. Water-resistant and tarnish-resistant.",
    shippingInfo: "Ships within 24 hours. Free shipping over ₹999.",
    primaryImage: "/images/product-1-a.jpg",
    secondaryImage: "/images/product-1-b.jpg",
    isPlaceholder: true,
  },
  {
    id: "prod-007",
    name: "Noor Cascading Emerald Dangler Earrings",
    slug: "noor-cascading-emerald-dangler-earrings",
    description:
      "Dramatic shoulder-grazing danglers showcasing faceted emerald hydro-beads framed by vintage polki floral crowns. Unbelievably lightweight with sterling silver ear posts.",
    price: 219900,
    compareAtPrice: 289900,
    stock: 6,
    sku: "ALB-ER-007",
    category: "Earrings",
    categorySlug: "earrings",
    subcategory: "Danglers & Drops",
    subcategorySlug: "danglers-drops",
    badges: ["new_arrival"],
    outfitPairings: ["Cocktail Gown", "Raw Silk Kurta", "Organza Saree"],
    materialsCare: "Brass with 22k antique gold plating and hydro beads. Avoid alcohol sprays.",
    shippingInfo: "Dispatches within 24 hours from Delhi.",
    primaryImage: "/images/product-4-a.jpg",
    secondaryImage: "/images/product-4-b.jpg",
    isPlaceholder: true,
  },
  {
    id: "prod-008",
    name: "Sitara Filigree Polki Bali Hoops",
    slug: "sitara-filigree-polki-bali-hoops",
    description:
      "Classic Indian balis re-imagined with delicate wire filigree, uncut glass polki bezels, and dangling pearl drops. Effortless latch closure for secure all-day wear.",
    price: 139900,
    compareAtPrice: 179900,
    stock: 11,
    sku: "ALB-ER-008",
    category: "Earrings",
    categorySlug: "earrings",
    subcategory: "Hoops & Balis",
    subcategorySlug: "hoops-balis",
    badges: ["best_seller"],
    outfitPairings: ["Linen Saree", "Boho Kurti", "Everyday Chikankari"],
    materialsCare: "Hypoallergenic brass with micro-gold polish.",
    shippingInfo: "Ships within 24 hours.",
    primaryImage: "/images/product-1-a.jpg",
    secondaryImage: "/images/product-1-b.jpg",
    isPlaceholder: true,
  },
];

export const THEME_COLLECTIONS = [
  {
    id: "festive-edit",
    title: "Festive Edit",
    hindiTitle: "त्योहार स्पेशल",
    tagline: "Regal chokers and statement chandbalis for weddings and celebrations.",
    image: "/images/product-2-a.jpg",
    link: "/shop?collection=festive-edit",
    itemCount: "4 Designs",
  },
  {
    id: "everyday-minimal",
    title: "Everyday Minimal",
    hindiTitle: "रोज़मर्रा",
    tagline: "Featherlight polki studs and delicate rings that pair with white shirts and kurtas alike.",
    image: "/images/product-3-a.jpg",
    link: "/shop?collection=everyday-minimal",
    itemCount: "3 Designs",
  },
  {
    id: "statement-jewels",
    title: "Statement Jewels",
    hindiTitle: "थोड़ा हटके",
    tagline: "Architectural haslis and Mughal-inspired cocktail rings that start conversations.",
    image: "/images/product-5-a.jpg",
    link: "/shop?collection=statement-jewels",
    itemCount: "3 Designs",
  },
  {
    id: "gifting-under-1999",
    title: "Gift Guide",
    hindiTitle: "उपहार",
    tagline: "Thoughtfully boxed jewellery curations under ₹1,999 with handwritten notes.",
    image: "/images/product-4-a.jpg",
    link: "/shop?collection=gifting",
    itemCount: "Under ₹1,999",
  },
];

export const REVIEWS = [
  {
    id: "rev-1",
    customerName: "Ananya Sharma",
    location: "South Delhi",
    rating: 5,
    comment:
      "The Mayura Chandbalis are even more gorgeous in person than on Instagram! The meenakari detailing is so neat and they aren't heavy at all. Wore them for my cousin's sangeet and received non-stop compliments.",
    productName: "Mayura Peacock Chandbali",
    verified: true,
  },
  {
    id: "rev-2",
    customerName: "Rhea Sen",
    location: "London, UK",
    rating: 5,
    comment:
      "Ordered the Hansak hasli collar from the UK via WhatsApp. Arrived in 6 days in a beautiful maroon box! Incredible quality, feels like an heirloom antique piece.",
    productName: "Hansak Peacock Hasli Collar",
    verified: true,
  },
  {
    id: "rev-3",
    customerName: "Meher Gill",
    location: "Chandigarh",
    rating: 5,
    comment:
      "The ordering experience on WhatsApp was so seamless and polite. The finish of the Noorani choker looks like real jadau polki without the five-figure price tag. Will definitely order again!",
    productName: "Noorani Polki Choker",
    verified: true,
  },
];
