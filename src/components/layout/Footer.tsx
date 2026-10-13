"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { MessageCircle, ArrowRight, ChevronDown } from "lucide-react";
import { InstagramIcon } from "@/components/ui/icons";
import { Logo } from "@/components/brand/Logo";
import { useAdminStore } from "@/lib/store/adminStore";
import { siteConfig } from "@/lib/utils";

export function Footer() {
  const [mounted, setMounted] = useState(false);
  const [currentYear, setCurrentYear] = useState(2026);
  const [openMobileAccordion, setOpenMobileAccordion] = useState<string | null>(null);

  const settings = useAdminStore((s) => s.settings);
  const footerNav = useAdminStore((s) => s.navigation?.footer);

  useEffect(() => {
    setMounted(true);
    setCurrentYear(new Date().getFullYear());
  }, []);

  const whatsappNumber = mounted && settings?.whatsappNumber ? settings.whatsappNumber : siteConfig.whatsappNumber;
  const instagramHandle = mounted && settings?.instagramHandle ? settings.instagramHandle : siteConfig.instagramHandle;
  const cleanNumber = whatsappNumber.replace(/[^0-9]/g, "");

  return (
    <footer className="bg-[#4A0612] text-[#FCEDEA] border-t border-[#6B1F2E]/40 select-none">
      {/* Upper Newsletter / Community Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16 border-b border-[#6B1F2E]/30">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <span className="font-hindi text-sm text-[#F1DFD8]/70 block mb-1">
              अलबेली परिवार
            </span>
            <h3 className="font-display text-2xl sm:text-3xl tracking-tight text-[#FCEDEA] mb-2">
              Join the Albeli Inner Circle
            </h3>
            <p className="text-sm text-[#F1DFD8]/80 max-w-md font-sans leading-relaxed">
              Be the first to preview exclusive limited drops, festive curations, and behind-the-scenes artisan stories from our Delhi workshop.
            </p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              alert("Shukriya! You're on the list for our next drop ✨");
            }}
            className="flex flex-col sm:flex-row gap-3 max-w-md md:ml-auto w-full"
          >
            <input
              type="text"
              placeholder="Your email or WhatsApp number"
              className="flex-1 px-4 py-3 bg-[#6B1F2E]/40 border border-[#F1DFD8]/20 text-[#FCEDEA] placeholder-[#F1DFD8]/40 text-sm rounded-sm focus:outline-none focus:border-[#F1DFD8]/60 transition-colors"
              required
            />
            <button
              type="submit"
              className="px-6 py-3 bg-[#FCEDEA] text-[#4A0612] hover:bg-[#F1DFD8] text-xs font-semibold uppercase tracking-widest rounded-sm transition-colors flex items-center justify-center gap-2 group whitespace-nowrap"
            >
              <span>Join</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </button>
          </form>
        </div>
      </div>

      {/* Main Links Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        {/* Mobile Header: Logo centered at top + socials in a row */}
        <div className="sm:hidden flex flex-col items-center text-center pb-8 border-b border-[#6B1F2E]/30 space-y-3">
          <Logo variant="full" theme="light" size="md" />
          <p className="text-xs text-[#F1DFD8]/80 leading-relaxed font-sans max-w-xs">
            Handcrafted fashion jewellery from Delhi. Thoda hatke, poora desi.
          </p>
          <div className="flex items-center space-x-4 pt-1">
            <a
              href={`https://instagram.com/${instagramHandle}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram @albelihouse"
              className="touch-target w-9 h-9 rounded-full border border-[#F1DFD8]/20 flex items-center justify-center text-[#F1DFD8]/80 hover:text-[#FCEDEA]"
            >
              <InstagramIcon className="w-4 h-4" />
            </a>
            <a
              href={`https://wa.me/${cleanNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp Enquiries"
              className="touch-target w-9 h-9 rounded-full border border-[#F1DFD8]/20 flex items-center justify-center text-[#F1DFD8]/80 hover:text-[#FCEDEA]"
            >
              <MessageCircle className="w-4 h-4 text-[#25D366]" />
            </a>
          </div>
        </div>

        {/* Mobile Accordion Groups (sm:hidden) */}
        <div className="sm:hidden divide-y divide-[#6B1F2E]/30 py-4">
          {/* Explore Accordion */}
          <div className="py-3">
            <button
              onClick={() => setOpenMobileAccordion(openMobileAccordion === "explore" ? null : "explore")}
              className="w-full flex items-center justify-between text-xs uppercase tracking-[0.2em] font-sans font-semibold text-[#F1DFD8]"
            >
              <span>Explore Collection</span>
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-200 ${
                  openMobileAccordion === "explore" ? "rotate-180" : ""
                }`}
              />
            </button>
            {openMobileAccordion === "explore" && (
              <ul className="pt-3 space-y-2.5 text-xs text-[#F1DFD8]/80 font-sans pl-2">
                <li><Link href="/shop" className="block py-1 hover:text-[#FCEDEA]">All Jewellery</Link></li>
                <li><Link href="/collections" className="block py-1 hover:text-[#FCEDEA]">Festive Edit</Link></li>
                <li><Link href="/collections" className="block py-1 hover:text-[#FCEDEA]">Everyday Minimal</Link></li>
                <li><Link href="/lookbook" className="block py-1 hover:text-[#FCEDEA]">Lookbook & Styling</Link></li>
                <li><Link href="/saved" className="block py-1 hover:text-[#FCEDEA]">Saved Designs</Link></li>
              </ul>
            )}
          </div>

          {/* Care & Support Accordion */}
          <div className="py-3">
            <button
              onClick={() => setOpenMobileAccordion(openMobileAccordion === "care" ? null : "care")}
              className="w-full flex items-center justify-between text-xs uppercase tracking-[0.2em] font-sans font-semibold text-[#F1DFD8]"
            >
              <span>Care & Support</span>
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-200 ${
                  openMobileAccordion === "care" ? "rotate-180" : ""
                }`}
              />
            </button>
            {openMobileAccordion === "care" && (
              <ul className="pt-3 space-y-2.5 text-xs text-[#F1DFD8]/80 font-sans pl-2">
                <li><Link href="/shipping" className="block py-1 hover:text-[#FCEDEA]">Shipping & Delivery</Link></li>
                <li><Link href="/materials-care" className="block py-1 hover:text-[#FCEDEA]">Materials & Care Guide</Link></li>
                <li><Link href="/custom-design" className="block py-1 hover:text-[#FCEDEA]">Request Custom Design</Link></li>
                <li><Link href="/contact" className="block py-1 hover:text-[#FCEDEA]">WhatsApp Order Support</Link></li>
                <li><Link href="/terms" className="block py-1 hover:text-[#FCEDEA]">Policies & FAQs</Link></li>
              </ul>
            )}
          </div>

          {/* Origin Note */}
          <div className="pt-4 text-center">
            <p className="text-[11px] text-[#FCEDEA] font-medium">🇮🇳 Handcrafted in Delhi • Ships Worldwide</p>
          </div>
        </div>

        {/* Desktop 4-Column Grid (hidden sm:grid) */}
        <div className="hidden sm:grid sm:grid-cols-4 gap-10">
          {/* Col 1: Brand Info & Logo */}
          <div className="flex flex-col items-start space-y-4">
            <Logo variant="full" theme="light" size="md" />
            <p className="text-xs text-[#F1DFD8]/80 leading-relaxed font-sans pt-2">
              Handcrafted fashion jewellery from Delhi. Bold, authentic, and not so ordinary.
            </p>
            <p className="font-hindi text-xs text-[#F1DFD8]/60">
              थोड़ा हटके, पूरा देसी।
            </p>
            <div className="flex items-center space-x-3 pt-2">
              <a
                href={`https://instagram.com/${instagramHandle}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram @albelihouse"
                className="w-8 h-8 rounded-full border border-[#F1DFD8]/20 flex items-center justify-center text-[#F1DFD8]/80 hover:text-[#FCEDEA] hover:border-[#F1DFD8]/60 transition-colors"
              >
                <InstagramIcon className="w-4 h-4" />
              </a>
              <a
                href={`https://wa.me/${cleanNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp Enquiries"
                className="w-8 h-8 rounded-full border border-[#F1DFD8]/20 flex items-center justify-center text-[#F1DFD8]/80 hover:text-[#FCEDEA] hover:border-[#F1DFD8]/60 transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Explore */}
          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] font-sans font-semibold text-[#F1DFD8] mb-4">
              Explore
            </h4>
            <ul className="space-y-2.5 text-xs text-[#F1DFD8]/80 font-sans">
              <li><Link href="/shop" className="hover:text-[#FCEDEA] transition-colors">All Jewellery</Link></li>
              <li><Link href="/collections" className="hover:text-[#FCEDEA] transition-colors">Festive Edit</Link></li>
              <li><Link href="/collections" className="hover:text-[#FCEDEA] transition-colors">Everyday Minimal</Link></li>
              <li><Link href="/lookbook" className="hover:text-[#FCEDEA] transition-colors">Lookbook & Styling</Link></li>
              <li><Link href="/saved" className="hover:text-[#FCEDEA] transition-colors">Saved Designs</Link></li>
            </ul>
          </div>

          {/* Col 3: Customer Care & Policies */}
          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] font-sans font-semibold text-[#F1DFD8] mb-4">
              Care & Support
            </h4>
            <ul className="space-y-2.5 text-xs text-[#F1DFD8]/80 font-sans">
              <li><Link href="/shipping" className="hover:text-[#FCEDEA] transition-colors">Shipping & Worldwide Delivery</Link></li>
              <li><Link href="/materials-care" className="hover:text-[#FCEDEA] transition-colors">Materials & Care Guide</Link></li>
              <li><Link href="/custom-design" className="hover:text-[#FCEDEA] transition-colors">Request Custom Design</Link></li>
              <li><Link href="/contact" className="hover:text-[#FCEDEA] transition-colors">Order Enquiry via WhatsApp</Link></li>
              <li><Link href="/terms" className="hover:text-[#FCEDEA] transition-colors">Policies & FAQs</Link></li>
            </ul>
          </div>

          {/* Col 4: Origin */}
          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] font-sans font-semibold text-[#F1DFD8] mb-4">
              Worldwide Shipping
            </h4>
            <p className="text-xs text-[#F1DFD8]/80 leading-relaxed font-sans mb-3">
              We ship across all 28 states of India and worldwide to USA, UK, UAE, Canada, Australia and beyond.
            </p>
            <div className="p-3 bg-[#6B1F2E]/30 rounded-sm border border-[#F1DFD8]/10">
              <span className="text-[11px] text-[#FCEDEA] font-medium block">
                🇮🇳 Handcrafted in Delhi
              </span>
              <span className="text-[10px] text-[#F1DFD8]/70 block mt-0.5">
                Every piece inspected for quality and non-tarnish brilliance.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar: Copyright & Legal */}
      <div className="border-t border-[#6B1F2E]/30 py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#F1DFD8]/50 space-y-3 sm:space-y-0">
          <p>© {currentYear} ALBELI. All rights reserved.</p>

          <div className="flex items-center space-x-6">
            <Link href="/privacy" className="hover:text-[#F1DFD8] transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-[#F1DFD8] transition-colors">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
