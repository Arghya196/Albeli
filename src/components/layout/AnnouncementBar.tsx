"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useAdminStore } from "@/lib/store/adminStore";

const DEFAULT_ANNOUNCEMENTS = [
  "Ships all over India & worldwide ✈️ Handcrafted in Delhi",
  "New drop is live ✨ Thoda hatke, poora desi.",
  "Custom design requests open — share your vision on WhatsApp",
  "Curated festive edit now available • Limited artisan batches",
];

export function AnnouncementBar() {
  const [mounted, setMounted] = useState(false);
  const storeMessages = useAdminStore((s) => s.settings?.announcementMessages);
  const announcements = mounted && storeMessages && storeMessages.length > 0 ? storeMessages : DEFAULT_ANNOUNCEMENTS;

  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % announcements.length);
    }, 4500);

    return () => clearInterval(timer);
  }, [isPaused, announcements.length]);

  const prev = () => {
    setIndex((prev) => (prev - 1 + announcements.length) % announcements.length);
  };

  const next = () => {
    setIndex((prev) => (prev + 1) % announcements.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (diff > 40) {
      next(); // Swiped left -> next
    } else if (diff < -40) {
      prev(); // Swiped right -> prev
    }
    touchStartX.current = null;
  };

  return (
    <div
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="bg-[#4A0612] text-[#FCEDEA] text-[11px] sm:text-xs tracking-wider uppercase h-[36px] px-3 transition-colors select-none border-b border-[#6B1F2E]/40 flex items-center"
    >
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
        <button
          onClick={prev}
          aria-label="Previous announcement"
          className="touch-target text-[#FCEDEA]/60 hover:text-[#FCEDEA] transition-colors p-1"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
        </button>

        <p className="text-center font-sans font-medium px-2 truncate transition-opacity duration-300 flex-1">
          {announcements[index]}
        </p>

        <button
          onClick={next}
          aria-label="Next announcement"
          className="touch-target text-[#FCEDEA]/60 hover:text-[#FCEDEA] transition-colors p-1"
        >
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
