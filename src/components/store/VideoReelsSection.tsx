"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { Play, Pause, Volume2, VolumeX, ArrowRight, Sparkles } from "lucide-react";
import { InstagramIcon } from "@/components/ui/icons";
import { PRODUCT_REELS, PLACEHOLDER_PRODUCTS, type ProductVideoReel } from "@/lib/placeholder-data";
import { useAdminStore } from "@/lib/store/adminStore";
import { useInstagramOrderStore } from "@/lib/store/instagramOrderStore";
import { formatPrice, siteConfig, cn } from "@/lib/utils";

export function VideoReelsSection() {
  const [playingId, setPlayingId] = useState<string | null>("reel-1");
  const [isMuted, setIsMuted] = useState(true);
  const videoRefs = useRef<{ [key: string]: HTMLVideoElement | null }>({});

  const settings = useAdminStore((s) => s.settings);
  const openInstagramOrder = useInstagramOrderStore((s) => s.openForProduct);
  const instagramHandle = settings?.instagramHandle || siteConfig.instagramHandle;

  const togglePlay = (id: string) => {
    const video = videoRefs.current[id];
    if (!video) return;

    if (playingId === id) {
      video.pause();
      setPlayingId(null);
    } else {
      // Pause currently playing
      if (playingId && videoRefs.current[playingId]) {
        videoRefs.current[playingId]?.pause();
      }
      video.play().catch(() => {});
      setPlayingId(id);
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    Object.values(videoRefs.current).forEach((v) => {
      if (v) v.muted = newMuted;
    });
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-4 sm:mb-8 pb-3 border-b border-[#4A0612]/10 gap-2">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-[#4A0612]/5 text-[#6B1F2E] rounded-full text-[10px] sm:text-[11px] font-sans font-semibold uppercase tracking-[0.2em] mb-1">
            <Sparkles className="w-3 h-3 text-[#B8923A]" />
            <span>अलबेली इन मोशन • Video Showcase</span>
          </div>
          <h2 className="font-display text-2xl sm:text-4xl text-[#1E1A1A] font-normal tracking-tight">
            See Our Designs in Motion
          </h2>
          <p className="text-xs text-[#1E1A1A]/60 font-sans mt-0.5 max-w-lg">
            Real artisan videos showing intricate meenakari, cut-polki brilliance, and how pieces drape on the neck.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          {/* Mute Toggle */}
          <button
            onClick={toggleMute}
            aria-label={isMuted ? "Unmute audio" : "Mute audio"}
            className="touch-target px-3 py-1.5 bg-white border border-[#4A0612]/15 text-[#1E1A1A] text-xs font-sans rounded-sm flex items-center gap-1.5 shadow-2xs hover:bg-[#FBF6EE] transition-colors cursor-pointer"
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5 text-[#1E1A1A]/70" /> : <Volume2 className="w-3.5 h-3.5 text-[#6B1F2E]" />}
            <span className="text-[11px]">{isMuted ? "Sound Off" : "Sound On"}</span>
          </button>

          <a
            href={`https://instagram.com/${instagramHandle}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs uppercase tracking-wider font-sans font-semibold text-[#6B1F2E] hover:text-[#4A0612] flex items-center gap-1 hidden sm:inline-flex"
          >
            <InstagramIcon className="w-3.5 h-3.5" />
            <span>More Reels @{instagramHandle}</span>
          </a>
        </div>
      </div>

      {/* 4-Card Reel Carousel (Snap swipe on phone, 4-col on desktop) */}
      <div className="flex sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-none pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
        {PRODUCT_REELS.map((reel) => {
          const isCurrentPlaying = playingId === reel.id;

          const orderMsg = encodeURIComponent(
            `Namaste Albeli! ✨ I watched your video reel for *${reel.productName}* and would love to order this design. Please share details!`
          );
          const instagramOrderUrl = `https://ig.me/m/${instagramHandle}?text=${orderMsg}`;

          return (
            <div
              key={reel.id}
              className="w-[78vw] sm:w-auto shrink-0 snap-start group relative rounded-sm overflow-hidden bg-[#1E1A1A] border border-[#4A0612]/15 shadow-sm flex flex-col aspect-[9/16] select-none"
            >
              {/* Video Element */}
              <div
                onClick={() => togglePlay(reel.id)}
                className="relative w-full h-full cursor-pointer overflow-hidden bg-black flex items-center justify-center"
              >
                {reel.videoUrl ? (
                  <video
                    ref={(el) => {
                      videoRefs.current[reel.id] = el;
                    }}
                    src={reel.videoUrl}
                    poster={reel.posterImage}
                    loop
                    muted={isMuted}
                    playsInline
                    autoPlay={reel.id === "reel-1"}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-102"
                  />
                ) : (
                  <img
                    src={reel.posterImage}
                    alt={reel.title}
                    className="w-full h-full object-cover"
                  />
                )}

                {/* Top Overlay Badges */}
                <div className="absolute top-3 inset-x-3 flex items-center justify-between z-10">
                  <span className="px-2 py-0.5 bg-black/60 backdrop-blur-xs text-[#FCEDEA] text-[10px] font-mono rounded-full border border-white/10">
                    {reel.duration} • {reel.views}
                  </span>

                  <span className="px-2 py-0.5 bg-[#4A0612]/80 backdrop-blur-xs text-[#FCEDEA] text-[9px] font-sans uppercase tracking-widest rounded-xs border border-white/10 flex items-center gap-1">
                    <Sparkles className="w-2.5 h-2.5 text-[#B8923A]" />
                    <span>Reel</span>
                  </span>
                </div>

                {/* Play / Pause Overlay Icon */}
                <div
                  className={cn(
                    "absolute inset-0 flex items-center justify-center transition-opacity duration-300 pointer-events-none",
                    isCurrentPlaying ? "opacity-0 group-hover:opacity-100" : "opacity-90"
                  )}
                >
                  <div className="w-12 h-12 rounded-full bg-black/60 backdrop-blur-xs flex items-center justify-center text-white border border-white/20 shadow-md transform transition-transform group-hover:scale-110">
                    {isCurrentPlaying ? (
                      <Pause className="w-5 h-5 fill-white text-white" />
                    ) : (
                      <Play className="w-5 h-5 fill-white text-white ml-0.5" />
                    )}
                  </div>
                </div>

                {/* Gradient shading at bottom for readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-transparent pointer-events-none" />

                {/* Bottom Overlaid Product Card */}
                <div className="absolute bottom-0 inset-x-0 p-3.5 z-10 text-white space-y-2">
                  <div>
                    <span className="font-hindi text-[11px] text-[#FCEDEA]/80 block">
                      {reel.hindiTitle}
                    </span>
                    <h3 className="font-display text-lg text-white font-normal leading-snug line-clamp-1">
                      {reel.title}
                    </h3>
                  </div>

                  {/* Product Mini Tag Pill */}
                  <div className="p-2 bg-white/10 backdrop-blur-md rounded-xs border border-white/15 flex items-center justify-between">
                    <div className="min-w-0 pr-2">
                      <span className="text-[11px] font-sans font-medium text-white truncate block">
                        {reel.productName}
                      </span>
                      <span className="text-xs font-sans font-bold text-[#FCEDEA] block">
                        {formatPrice(reel.productPrice)}
                      </span>
                    </div>

                    <Link
                      href={`/product/${reel.productSlug}`}
                      onClick={(e) => e.stopPropagation()}
                      className="px-2 py-1 bg-white/20 hover:bg-white text-white hover:text-[#4A0612] text-[10px] uppercase font-sans font-semibold rounded-xs transition-colors shrink-0"
                    >
                      Details
                    </Link>
                  </div>

                  {/* Direct Action Button: Order on Instagram */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      const matched = PLACEHOLDER_PRODUCTS.find((p) => p.slug === reel.productSlug);
                      if (matched) {
                        openInstagramOrder(matched);
                      } else {
                        window.open(`https://ig.me/m/${instagramHandle}`, "_blank");
                      }
                    }}
                    className="w-full py-2.5 bg-[#FCEDEA] hover:bg-[#F1DFD8] text-[#4A0612] text-xs font-semibold uppercase tracking-wider rounded-sm transition-all flex items-center justify-center gap-1.5 shadow-sm active:scale-98 cursor-pointer"
                  >
                    <InstagramIcon className="w-3.5 h-3.5" />
                    <span>Order on Instagram</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Mobile Instagram Profile Link */}
      <div className="text-center pt-4 sm:hidden">
        <a
          href={`https://instagram.com/${instagramHandle}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider text-[#6B1F2E] font-semibold"
        >
          <InstagramIcon className="w-3.5 h-3.5" />
          <span>Watch More Reels on @{instagramHandle}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </a>
      </div>
    </section>
  );
}
