"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function SplashScreen() {
  const [showSplash, setShowSplash] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    // Check if user already saw the splash during this session
    const hasSeenSplash = sessionStorage.getItem("albeli_splash_shown");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setPrefersReducedMotion(reducedMotion);

    if (!hasSeenSplash) {
      setShowSplash(true);
      const isMobile = window.innerWidth < 768;
      // Auto-dismiss max 1.8s on mobile, 2.2s on desktop
      const timer = setTimeout(() => {
        dismiss();
      }, isMobile ? 1800 : 2200);

      return () => clearTimeout(timer);
    }
  }, []);

  const dismiss = () => {
    sessionStorage.setItem("albeli_splash_shown", "true");
    setShowSplash(false);
  };

  if (!showSplash) return null;

  return (
    <AnimatePresence>
      {showSplash && (
        <motion.div
          key="albeli-splash"
          initial={{ y: 0, opacity: 1 }}
          exit={
            prefersReducedMotion
              ? { opacity: 0 }
              : { y: "-100%", transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } }
          }
          onClick={dismiss}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#4A0612] text-[#FCEDEA] cursor-pointer select-none overflow-hidden h-[100dvh] w-full"
          role="dialog"
          aria-label="Welcome to Albeli — tap to skip"
        >
          {/* 1. Centred Authentic Brand Logo from reference */}
          <div className="relative z-10 flex flex-col items-center text-center px-6 w-full max-w-sm">
            <motion.div
              initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, scale: 0.94, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="mb-3 flex flex-col items-center"
            >
              <img
                src="/brand/logo-full-light.png"
                alt="ALBELI"
                className="w-[55vw] max-w-[260px] h-auto object-contain drop-shadow-md"
              />
            </motion.div>

            {/* 2. Devanagari Script & Tagline */}
            <motion.div
              initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col items-center gap-1"
            >
              <span className="font-hindi text-base sm:text-xl text-[#F1DFD8]/80 font-normal">
                अलबेली
              </span>
              <p className="font-display italic text-xs sm:text-base text-[#F1DFD8]/90 tracking-wide">
                Not so ordinary.
              </p>
            </motion.div>

            {/* Tap to skip hint */}
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              transition={{ delay: 0.8, duration: 0.4 }}
              className="mt-8 text-[10px] sm:text-[11px] tracking-widest uppercase font-sans text-[#F1DFD8]/60 py-1 px-3 rounded-full border border-[#F1DFD8]/15"
            >
              Tap to skip
            </motion.span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
