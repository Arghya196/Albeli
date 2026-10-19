// ═══════════════════════════════════════════════
// ALBELI — Shared Default Data & Taxonomy
// ═══════════════════════════════════════════════

export interface AdminCategory {
  id: string;
  name: string;
  slug: string;
  itemCount: number;
  parentId?: string | null;
  description?: string;
  imageUrl?: string;
}

export interface HeroSlide {
  id: string;
  image: string;
  badge?: string;
  headline: string;
  hindiTagline?: string;
  desktopDesc?: string;
  ctaText: string;
  ctaLink: string;
}

export interface NavItem {
  id: string;
  label: string;
  href: string;
  visible: boolean;
}

export interface NavigationData {
  header: NavItem[];
  footer: NavItem[];
}

export interface AdminReview {
  id: string;
  customerName: string;
  location: string;
  rating: number;
  comment: string;
  productName: string;
  verified: boolean;
  visible: boolean;
  createdAt: string;
}

export interface SiteSettingsData {
  whatsappNumber: string;
  instagramHandle: string;
  orderChannel: "instagram" | "whatsapp" | "both";
  announcementMessages: string[];
  heroHeadline: string;
  heroTagline: string;
  heroSlides?: HeroSlide[];
  storyPhilosophy: string;
  splashEnabled: boolean;
  reviewsEnabled: boolean;
  wishlistEnabled: boolean;
  cartFeatureFlag: boolean;
}

export const DEFAULT_HERO_SLIDES: HeroSlide[] = [
  {
    id: "slide-1",
    image: "/images/hero-1.jpg",
    badge: "Delhi • Handcrafted • Authentic",
    headline: "Jewellery that refuses to be ordinary.",
    hindiTagline: "अलबेली — थोड़ा हटके, पूरा देसी।",
    desktopDesc: "Bold artisanal polki, meenakari and antique jewellery designed in Delhi for modern celebrations and everyday flair.",
    ctaText: "Explore Drop",
    ctaLink: "/shop",
  },
  {
    id: "slide-2",
    image: "/images/product-5-a.jpg",
    badge: "Limited Artisan Batch • Heritage",
    headline: "Heirloom Haslis & Royal Peacock Motifs.",
    hindiTagline: "शाही नक्काशी, दिल्ली का हुनर।",
    desktopDesc: "Hand-engraved by generational karigars in Delhi with heritage repoussé brass techniques and 22k antique gold plating.",
    ctaText: "Shop Hasli Edit",
    ctaLink: "/shop?category=necklaces",
  },
  {
    id: "slide-3",
    image: "/images/product-2-a.jpg",
    badge: "Festive Edit 2026 • Bridal & Occasion",
    headline: "Noorani Polki Chokers & Lustrous Pearls.",
    hindiTagline: "नूरानी पोलकी, महफ़िल का नूर।",
    desktopDesc: "Exquisite hand-strung emerald bead drops and uncut polki glass stones that capture the candlelit radiance of royal evenings.",
    ctaText: "Discover Festive Edit",
    ctaLink: "/collections/festive-edit",
  },
];

export const DEFAULT_CATEGORIES: AdminCategory[] = [
  // Parent Categories
  {
    id: "cat-1",
    name: "Earrings",
    slug: "earrings",
    itemCount: 14,
    parentId: null,
    description: "Handcrafted chandbalis, jhumkas, polki studs, and royal ear ornaments.",
    imageUrl: "/images/product-1-a.jpg",
  },
  {
    id: "cat-2",
    name: "Necklaces",
    slug: "necklaces",
    itemCount: 4,
    parentId: null,
    description: "Sculpted heritage haslis, polki chokers, and royal bridal neckpieces.",
    imageUrl: "/images/product-2-a.jpg",
  },
  {
    id: "cat-3",
    name: "Rings",
    slug: "rings",
    itemCount: 3,
    parentId: null,
    description: "Solar cocktail rings, polki bands, and adjustable statement pieces.",
    imageUrl: "/images/product-3-a.jpg",
  },
  {
    id: "cat-4",
    name: "Bangles & Bracelets",
    slug: "bangles-bracelets",
    itemCount: 1,
    parentId: null,
    description: "Heritage peacock kadas, meenakari bangles, and delicate hathphool.",
    imageUrl: "/images/product-5-a.jpg",
  },

  // Subcategories of Earrings
  {
    id: "sub-1",
    name: "Chandbalis",
    slug: "chandbalis",
    itemCount: 2,
    parentId: "cat-1",
    description: "Crescent-shaped royal earrings adorned with meenakari and seed pearls.",
    imageUrl: "/images/product-1-a.jpg",
  },
  {
    id: "sub-2",
    name: "Jhumkas",
    slug: "jhumkas",
    itemCount: 6,
    parentId: "cat-1",
    description: "Bell-shaped traditional drops finished with delicate micro-pearl fringe.",
    imageUrl: "/images/product-4-a.jpg",
  },
  {
    id: "sub-3",
    name: "Studs & Tops",
    slug: "studs-tops",
    itemCount: 2,
    parentId: "cat-1",
    description: "Minimal polki and kundan solitaires crafted for all-day comfort.",
    imageUrl: "/images/product-1-a.jpg",
  },
  {
    id: "sub-4",
    name: "Danglers & Drops",
    slug: "danglers-drops",
    itemCount: 2,
    parentId: "cat-1",
    description: "Cascading shoulder dusters with faceted emerald and ruby hydro beads.",
    imageUrl: "/images/product-4-a.jpg",
  },
  {
    id: "sub-5",
    name: "Hoops & Balis",
    slug: "hoops-balis",
    itemCount: 2,
    parentId: "cat-1",
    description: "Intricately filigreed huggies and traditional round balis.",
    imageUrl: "/images/product-1-a.jpg",
  },
  {
    id: "sub-6",
    name: "Ear Cuffs & Deewani",
    slug: "ear-cuffs",
    itemCount: 0,
    parentId: "cat-1",
    description: "Over-the-ear bridal statement wraps and delicate chain climbers.",
    imageUrl: "/images/product-1-b.jpg",
  },

  // Subcategories of Necklaces
  {
    id: "sub-7",
    name: "Chokers",
    slug: "chokers",
    itemCount: 2,
    parentId: "cat-2",
    description: "Heritage neck-hugging polki chokers with adjustable silk zari cords.",
    imageUrl: "/images/product-2-a.jpg",
  },
  {
    id: "sub-8",
    name: "Haslis & Collars",
    slug: "haslis-collars",
    itemCount: 2,
    parentId: "cat-2",
    description: "Rigid sculpted collars engraved with peacock and floral repoussé motifs.",
    imageUrl: "/images/product-5-a.jpg",
  },
  {
    id: "sub-9",
    name: "Long Malas & Haar",
    slug: "long-malas",
    itemCount: 0,
    parentId: "cat-2",
    description: "Layered royal malas featuring uncut glass polki and natural gemstone beads.",
    imageUrl: "/images/product-2-b.jpg",
  },
  {
    id: "sub-10",
    name: "Pendant Sets",
    slug: "pendant-sets",
    itemCount: 0,
    parentId: "cat-2",
    description: "Minimalist everyday chains paired with matching artisan ear studs.",
    imageUrl: "/images/product-2-a.jpg",
  },

  // Subcategories of Rings
  {
    id: "sub-11",
    name: "Cocktail Rings",
    slug: "cocktail-rings",
    itemCount: 2,
    parentId: "cat-3",
    description: "Bold oversized solar and lotus statement pieces with doublet gemstones.",
    imageUrl: "/images/product-3-a.jpg",
  },
  {
    id: "sub-12",
    name: "Bands & Solitaires",
    slug: "band-solitaire",
    itemCount: 0,
    parentId: "cat-3",
    description: "Understated daily wear rings featuring uncut glass stones.",
    imageUrl: "/images/product-3-b.jpg",
  },
  {
    id: "sub-13",
    name: "Adjustable Rings",
    slug: "adjustable-rings",
    itemCount: 0,
    parentId: "cat-3",
    description: "Comfort-fit open band rings designed to fit any finger size.",
    imageUrl: "/images/product-3-a.jpg",
  },

  // Subcategories of Bangles & Bracelets
  {
    id: "sub-14",
    name: "Kadas & Cuffs",
    slug: "kadas",
    itemCount: 1,
    parentId: "cat-4",
    description: "Heavy antique openable cuffs with lion and peacock terminal heads.",
    imageUrl: "/images/product-5-a.jpg",
  },
  {
    id: "sub-15",
    name: "Meenakari Bangles",
    slug: "meenakari-bangles",
    itemCount: 0,
    parentId: "cat-4",
    description: "Vibrant enameled bangles displaying traditional floral motifs.",
    imageUrl: "/images/product-4-a.jpg",
  },
  {
    id: "sub-16",
    name: "Hathphool",
    slug: "hathphool",
    itemCount: 0,
    parentId: "cat-4",
    description: "Delicate bridal hand harness connecting ring to wrist.",
    imageUrl: "/images/product-3-a.jpg",
  },
];

export const DEFAULT_SETTINGS: SiteSettingsData = {
  whatsappNumber: "+91XXXXXXXXXX",
  instagramHandle: "albelihouse",
  orderChannel: "instagram",
  announcementMessages: [
    "Ships all over India & worldwide ✈️ Handcrafted in Delhi",
    "New drop is live ✨ Thoda hatke, poora desi.",
    "Custom design requests open — share your vision on WhatsApp",
  ],
  heroHeadline: "Jewellery that refuses to be ordinary.",
  heroTagline: "अलबेली — थोड़ा हटके, पूरा देसी।",
  heroSlides: DEFAULT_HERO_SLIDES,
  storyPhilosophy:
    "Born in Old Delhi, crafted for the fearless modern desi. No middle-tier markups, no five-figure diamond prices.",
  splashEnabled: true,
  reviewsEnabled: true,
  wishlistEnabled: true,
  cartFeatureFlag: false,
};

export const DEFAULT_NAVIGATION: NavigationData = {
  header: [
    { id: "nav-h1", label: "Shop", href: "/shop", visible: true },
    { id: "nav-h2", label: "Collections", href: "/collections/all", visible: true },
    { id: "nav-h3", label: "Lookbook", href: "/lookbook", visible: true },
    { id: "nav-h4", label: "Journal", href: "/journal", visible: true },
    { id: "nav-h5", label: "About", href: "/about", visible: true },
    { id: "nav-h6", label: "Contact", href: "/contact", visible: true },
  ],
  footer: [
    { id: "nav-f1", label: "Shop All", href: "/shop", visible: true },
    { id: "nav-f2", label: "About", href: "/about", visible: true },
    { id: "nav-f3", label: "Contact", href: "/contact", visible: true },
    { id: "nav-f4", label: "Shipping", href: "/shipping", visible: true },
    { id: "nav-f5", label: "Care Guide", href: "/materials-care", visible: true },
    { id: "nav-f6", label: "Privacy Policy", href: "/privacy", visible: true },
    { id: "nav-f7", label: "Terms", href: "/terms", visible: true },
  ],
};

export const DEFAULT_REVIEWS: AdminReview[] = [
  {
    id: "rev-1",
    customerName: "Ananya Sharma",
    location: "South Delhi",
    rating: 5,
    comment:
      "The Mayura Chandbalis are even more gorgeous in person than on Instagram! The meenakari detailing is so neat and they aren't heavy at all. Wore them for my cousin's sangeet and received non-stop compliments.",
    productName: "Mayura Peacock Chandbali",
    verified: true,
    visible: true,
    createdAt: "2026-10-07T10:00:00.000Z",
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
    visible: true,
    createdAt: "2026-10-01T10:00:00.000Z",
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
    visible: true,
    createdAt: "2026-09-23T10:00:00.000Z",
  },
];
