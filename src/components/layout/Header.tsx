"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Heart,
  Search,
  Menu,
  X,
  User,
  ChevronDown,
  MessageCircle,
  ArrowRight,
} from "lucide-react";
import { InstagramIcon } from "@/components/ui/icons";
import { Logo } from "@/components/brand/Logo";
import { useSavedDesignsStore } from "@/lib/store/savedDesigns";
import { useAdminStore, type NavItem } from "@/lib/store/adminStore";
import { siteConfig, cn } from "@/lib/utils";

const POPULAR_SEARCHES = ["Chandbali", "Polki", "Choker", "Jhumka", "Hasli", "Ring"];

const DEFAULT_LEFT_NAV = [
  { id: "nav-h1", label: "Shop", href: "/shop", visible: true },
  { id: "nav-h2", label: "Collections", href: "/collections", visible: true },
  { id: "nav-h5", label: "Our Story", href: "/about", visible: true },
];

const DEFAULT_RIGHT_NAV = [
  { id: "nav-h3", label: "Lookbook", href: "/lookbook", visible: true },
  { id: "nav-h4", label: "Journal", href: "/journal", visible: true },
  { id: "nav-h6", label: "Contact", href: "/contact", visible: true },
];

export function Header() {
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOverlayOpen, setSearchOverlayOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [shopAccordionOpen, setShopAccordionOpen] = useState(false);
  const [language, setLanguage] = useState<"en" | "hi">("en");

  // Scroll direction for hide/show on mobile
  const [showHeader, setShowHeader] = useState(true);
  const lastScrollY = useRef(0);

  const pathname = usePathname();
  const router = useRouter();
  const savedCount = useSavedDesignsStore((state) => state.savedIds.length);
  const headerNav = useAdminStore((state) => state.navigation?.header);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // On mobile, hide header when scrolling down past 70px, show when scrolling up
      if (currentScrollY > 70 && currentScrollY > lastScrollY.current + 5) {
        setShowHeader(false);
      } else if (currentScrollY < lastScrollY.current - 5 || currentScrollY <= 20) {
        setShowHeader(true);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close drawers on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setSearchOverlayOpen(false);
  }, [pathname]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchOverlayOpen(false);
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const visibleNav = (mounted && headerNav ? headerNav : [...DEFAULT_LEFT_NAV, ...DEFAULT_RIGHT_NAV]).filter(
    (item) => item.visible !== false
  );
  const midPoint = Math.ceil(visibleNav.length / 2);
  const leftNav = visibleNav.slice(0, midPoint);
  const rightNav = visibleNav.slice(midPoint);

  return (
    <>
      {/* Main Header with Hide on Scroll Down / Reveal on Scroll Up */}
      <header
        className={cn(
          "sticky top-0 z-40 w-full bg-[#FBF6EE]/95 backdrop-blur-md transition-transform duration-300 border-b border-[#4A0612]/10",
          showHeader ? "translate-y-0" : "-translate-y-full",
          "h-14 sm:h-18 flex items-center"
        )}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 w-full">
          <div className="flex items-center justify-between h-full">
            {/* Mobile: Hamburger Button (Min 44x44px touch target) */}
            <div className="flex lg:hidden items-center">
              <button
                onClick={() => setMobileMenuOpen(true)}
                aria-label="Open navigation menu"
                className="touch-target p-2 text-[#1E1A1A] hover:text-[#6B1F2E] transition-colors"
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>

            {/* Desktop Left Nav */}
            <nav className="hidden lg:flex items-center space-x-8 flex-1 justify-start">
              {leftNav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "relative font-sans text-xs tracking-[0.18em] uppercase transition-colors py-1 group",
                    pathname === item.href
                      ? "text-[#6B1F2E] font-medium"
                      : "text-[#1E1A1A]/80 hover:text-[#6B1F2E]"
                  )}
                >
                  <span>{item.label}</span>
                  <span
                    className={cn(
                      "absolute bottom-0 left-0 w-0 h-[1.5px] bg-[#6B1F2E] transition-all duration-300 group-hover:w-full",
                      pathname === item.href && "w-full"
                    )}
                  />
                </Link>
              ))}
            </nav>

            {/* Centred Brand Logo */}
            <div className="flex-shrink-0 flex items-center justify-center px-2">
              <Logo
                variant="full"
                theme="dark"
                size="sm"
                className="scale-90 sm:scale-100"
                withTagline={false}
              />
            </div>

            {/* Desktop Right Nav & Icons */}
            <div className="flex items-center justify-end flex-1 space-x-2 sm:space-x-8">
              <nav className="hidden lg:flex items-center space-x-8">
                {rightNav.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "relative font-sans text-xs tracking-[0.18em] uppercase transition-colors py-1 group",
                      pathname === item.href
                        ? "text-[#6B1F2E] font-medium"
                        : "text-[#1E1A1A]/80 hover:text-[#6B1F2E]"
                    )}
                  >
                    <span>{item.label}</span>
                    <span
                      className={cn(
                        "absolute bottom-0 left-0 w-0 h-[1.5px] bg-[#6B1F2E] transition-all duration-300 group-hover:w-full",
                        pathname === item.href && "w-full"
                      )}
                    />
                  </Link>
                ))}
              </nav>

              {/* Icons (44px touch targets on mobile) */}
              <div className="flex items-center space-x-1 sm:space-x-3">
                {/* Saved Designs / Wishlist (Heart with live badge, positioned to left of search) */}
                <Link
                  href="/saved"
                  aria-label={`Saved designs (${savedCount})`}
                  className="touch-target relative p-2 text-[#1E1A1A]/80 hover:text-[#6B1F2E] transition-colors group flex items-center justify-center"
                >
                  <div className="relative flex items-center justify-center">
                    <Heart
                      className={cn(
                        "w-5 h-5 transition-transform group-hover:scale-110",
                        savedCount > 0 ? "text-[#6B1F2E] fill-[#6B1F2E]/20 stroke-[1.8]" : "text-[#1E1A1A]/80 stroke-[1.6]"
                      )}
                    />
                    {savedCount > 0 && (
                      <span className="absolute -top-1.5 -right-2 bg-[#6B1F2E] text-[#FCEDEA] text-[10px] font-sans font-bold min-w-[17px] h-[17px] px-1 rounded-full flex items-center justify-center leading-none border-2 border-[#FBF6EE] shadow-xs pointer-events-none">
                        {savedCount}
                      </span>
                    )}
                  </div>
                </Link>

                {/* Search Overlay Trigger */}
                <button
                  onClick={() => setSearchOverlayOpen(true)}
                  aria-label="Search catalogue"
                  className="touch-target p-2 text-[#1E1A1A]/80 hover:text-[#6B1F2E] transition-colors"
                >
                  <Search className="w-4 h-4" />
                </button>

                {/* Account / Login on Desktop */}
                <Link
                  href="/auth/login"
                  aria-label="Account / Sign in"
                  className="p-1.5 text-[#1E1A1A]/80 hover:text-[#6B1F2E] transition-colors hidden sm:inline-block"
                >
                  <User className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Full-Height Mobile Slide-In Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-[#1E1A1A]/50 backdrop-blur-xs"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer content (100dvh, left slide) */}
          <div className="relative w-[85%] max-w-[340px] bg-[#FBF6EE] h-[100dvh] shadow-2xl flex flex-col justify-between z-10 border-r border-[#4A0612]/10 overflow-y-auto">
            {/* Drawer Top */}
            <div className="p-6">
              <div className="flex items-center justify-between pb-5 border-b border-[#4A0612]/10">
                <Logo variant="mark" theme="dark" size="sm" asLink={false} />
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  aria-label="Close navigation"
                  className="touch-target p-2 text-[#1E1A1A]/70 hover:text-[#6B1F2E]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Tappable Nav List (44px min height rows) */}
              <nav className="flex flex-col pt-4 divide-y divide-[#4A0612]/5 font-sans">
                {/* Shop with Accordion */}
                <div className="py-1">
                  <div className="flex items-center justify-between">
                    <Link
                      href="/shop"
                      className="font-display text-xl text-[#1E1A1A] py-3 block flex-1"
                    >
                      Shop All Jewellery
                    </Link>
                    <button
                      onClick={() => setShopAccordionOpen(!shopAccordionOpen)}
                      className="touch-target p-2 text-[#1E1A1A]/60"
                      aria-label="Toggle categories"
                    >
                      <ChevronDown
                        className={cn(
                          "w-4 h-4 transition-transform duration-200",
                          shopAccordionOpen && "rotate-180"
                        )}
                      />
                    </button>
                  </div>

                  {shopAccordionOpen && (
                    <div className="pl-4 pb-2 space-y-2 text-sm text-[#1E1A1A]/70">
                      <Link
                        href="/shop?category=earrings"
                        className="block py-1.5 hover:text-[#6B1F2E]"
                      >
                        • Earrings & Chandbalis
                      </Link>
                      <Link
                        href="/shop?category=necklaces"
                        className="block py-1.5 hover:text-[#6B1F2E]"
                      >
                        • Necklaces & Haslis
                      </Link>
                      <Link
                        href="/shop?category=rings"
                        className="block py-1.5 hover:text-[#6B1F2E]"
                      >
                        • Statement Rings
                      </Link>
                    </div>
                  )}
                </div>

                {visibleNav
                  .filter((item) => item.href !== "/shop")
                  .map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="font-display text-xl text-[#1E1A1A] py-3.5 block hover:text-[#6B1F2E] transition-colors"
                    >
                      {item.label}
                    </Link>
                  ))}

                <Link
                  href="/saved"
                  className="font-display text-xl text-[#6B1F2E] py-3.5 flex items-center justify-between"
                >
                  <span>Saved Designs</span>
                  {savedCount > 0 && (
                    <span className="text-xs bg-[#6B1F2E] text-[#FBF6EE] px-2.5 py-0.5 rounded-full font-sans font-bold">
                      {savedCount}
                    </span>
                  )}
                </Link>
              </nav>
            </div>

            {/* Drawer Bottom: Language, Socials, Watermark & Admin Access */}
            <div className="p-6 pt-4 border-t border-[#4A0612]/10 bg-white/40 space-y-4">
              {/* Language Toggle & Socials */}
              <div className="flex items-center justify-between text-xs py-1.5 border-b border-[#4A0612]/10 font-sans">
                <span className="text-[#1E1A1A]/70">Language / भाषा</span>
                <div className="flex items-center bg-[#FBF6EE] rounded-sm p-0.5 border border-[#4A0612]/15">
                  <button
                    onClick={() => setLanguage("en")}
                    className={cn(
                      "px-2.5 py-1 text-[11px] rounded-xs font-sans transition-colors cursor-pointer",
                      language === "en" ? "bg-[#4A0612] text-[#FCEDEA] font-semibold" : "text-[#1E1A1A]/70"
                    )}
                  >
                    EN
                  </button>
                  <button
                    onClick={() => setLanguage("hi")}
                    className={cn(
                      "px-2.5 py-1 text-[11px] rounded-xs font-hindi transition-colors cursor-pointer",
                      language === "hi" ? "bg-[#4A0612] text-[#FCEDEA] font-semibold" : "text-[#1E1A1A]/70"
                    )}
                  >
                    हिंदी
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs font-sans text-[#1E1A1A]/70 pt-1">
                <a
                  href={`https://wa.me/${siteConfig.whatsappNumber.replace(/[^0-9]/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 hover:text-[#6B1F2E]"
                >
                  <MessageCircle className="w-4 h-4 text-[#25D366]" />
                  <span>WhatsApp</span>
                </a>
                <span>•</span>
                <a
                  href={`https://instagram.com/${siteConfig.instagramHandle}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 hover:text-[#6B1F2E]"
                >
                  <InstagramIcon className="w-4 h-4 text-[#6B1F2E]" />
                  <span>Instagram</span>
                </a>
              </div>

              <Link
                href="/auth/login"
                className="w-full py-2.5 text-center text-xs tracking-wider uppercase font-semibold bg-[#4A0612] text-[#FCEDEA] rounded-sm block"
              >
                Sign In / Admin
              </Link>

              {/* Faint Peacock Mark Watermark */}
              <div className="flex justify-center opacity-10 pt-2 select-none pointer-events-none">
                <img
                  src="/brand/logo-peacock-dark.svg"
                  alt=""
                  className="h-10 w-auto object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Full-Screen Search Overlay for Mobile & Desktop */}
      {searchOverlayOpen && (
        <div className="fixed inset-0 z-50 bg-[#FBF6EE] h-[100dvh] flex flex-col p-6 animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-4 border-b border-[#4A0612]/10 max-w-2xl mx-auto w-full">
            <span className="font-display text-xl text-[#1E1A1A]">Search Catalogue</span>
            <button
              onClick={() => setSearchOverlayOpen(false)}
              className="touch-target p-2 text-[#1E1A1A]/60 hover:text-[#1E1A1A]"
              aria-label="Close search"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="max-w-2xl mx-auto w-full pt-8 flex-1 flex flex-col">
            <form onSubmit={handleSearchSubmit} className="relative mb-8">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search chandbalis, chokers, rings..."
                className="w-full pl-12 pr-4 py-4 bg-white border border-[#4A0612]/20 rounded-sm text-base text-[#1E1A1A] placeholder-[#1E1A1A]/40 focus:outline-none focus:border-[#6B1F2E] shadow-xs"
                autoFocus
              />
              <Search className="w-5 h-5 text-[#1E1A1A]/40 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            </form>

            <div>
              <span className="text-xs uppercase tracking-wider font-semibold text-[#1E1A1A]/60 block mb-3 font-sans">
                Trending Searches
              </span>
              <div className="flex flex-wrap gap-2">
                {POPULAR_SEARCHES.map((term) => (
                  <button
                    key={term}
                    onClick={() => {
                      setSearchOverlayOpen(false);
                      router.push(`/search?q=${encodeURIComponent(term)}`);
                    }}
                    className="px-3.5 py-2 bg-white border border-[#4A0612]/10 rounded-full text-xs text-[#1E1A1A] hover:bg-[#F1DFD8]/40 transition-colors font-sans"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
