"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { MessageCircle } from "lucide-react";
import { InstagramIcon } from "@/components/ui/icons";
import { useAdminStore } from "@/lib/store/adminStore";
import { siteConfig } from "@/lib/utils";

export function WhatsAppButton() {
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const settings = useAdminStore((s) => s.settings);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Hide on product detail pages and saved designs page because sticky bottom bars take precedence
  if (pathname.startsWith("/product/") || pathname === "/saved") {
    return null;
  }

  const orderChannel = mounted && settings?.orderChannel ? settings.orderChannel : "instagram";
  const instagramHandle = mounted && settings?.instagramHandle ? settings.instagramHandle : siteConfig.instagramHandle;
  const whatsappNumber = mounted && settings?.whatsappNumber ? settings.whatsappNumber : siteConfig.whatsappNumber;

  const cleanNumber = whatsappNumber.replace(/[^0-9]/g, "");
  const whatsappMsg = encodeURIComponent(
    "Namaste Albeli! ✨ I was exploring your jewellery collection and would love to enquire about designs."
  );
  const whatsappUrl = `https://wa.me/${cleanNumber}?text=${whatsappMsg}`;
  const instagramUrl = `https://ig.me/m/${instagramHandle}`;

  // If set to Instagram DM (the new default requested)
  if (orderChannel === "instagram") {
    return (
      <aside aria-label="Instagram Order Support">
        <a
          href={instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Order on Instagram DM"
          title="Chat with Albeli on Instagram"
          className="fixed bottom-[calc(1rem+env(safe-area-inset-bottom))] right-4 sm:bottom-6 sm:right-6 z-40 w-12 h-12 rounded-full bg-[#4A0612] hover:bg-[#6B1F2E] text-[#FCEDEA] shadow-lg transition-all duration-300 flex items-center justify-center border border-[#FCEDEA]/20 active:scale-95 touch-target hover:scale-105"
        >
          <InstagramIcon className="w-5 h-5 text-[#FCEDEA]" />
        </a>
      </aside>
    );
  }

  // If set to Both channels
  if (orderChannel === "both") {
    return (
      <aside aria-label="Order Support" className="fixed bottom-[calc(1rem+env(safe-area-inset-bottom))] right-4 sm:bottom-6 sm:right-6 z-40 flex flex-col gap-2.5">
        <a
          href={instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Order on Instagram DM"
          title="Chat on Instagram"
          className="w-11 h-11 rounded-full bg-[#4A0612] hover:bg-[#6B1F2E] text-[#FCEDEA] shadow-md transition-all duration-300 flex items-center justify-center border border-[#FCEDEA]/20 active:scale-95 touch-target"
        >
          <InstagramIcon className="w-4 h-4 text-[#FCEDEA]" />
        </a>
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Order on WhatsApp"
          title="Chat on WhatsApp"
          className="w-11 h-11 rounded-full bg-[#1E1A1A] hover:bg-[#25D366] text-[#FBF6EE] shadow-md transition-all duration-300 flex items-center justify-center border border-white/20 active:scale-95 touch-target"
        >
          <MessageCircle className="w-4 h-4 text-[#25D366] group-hover:text-white" />
        </a>
      </aside>
    );
  }

  // Default / WhatsApp fallback
  return (
    <aside aria-label="WhatsApp Support">
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Enquire on WhatsApp"
        className="fixed bottom-[calc(1rem+env(safe-area-inset-bottom))] right-4 sm:bottom-6 sm:right-6 z-40 w-12 h-12 rounded-full bg-[#1E1A1A] hover:bg-[#6B1F2E] text-[#FBF6EE] shadow-md transition-all duration-300 flex items-center justify-center border border-[#4A0612]/20 active:scale-95 touch-target"
      >
        <MessageCircle className="w-5 h-5 text-[#25D366]" />
      </a>
    </aside>
  );
}
