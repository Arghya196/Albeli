"use client";

import { useState, useEffect } from "react";
import { Plus, X } from "lucide-react";

export function PwaPrompt() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    // Check if dismissed
    const dismissed = localStorage.getItem("albeli_pwa_dismissed");
    if (dismissed) return;

    // Track visit count
    const visits = parseInt(localStorage.getItem("albeli_visit_count") || "0", 10) + 1;
    localStorage.setItem("albeli_visit_count", visits.toString());

    // Show prompt only on 2nd visit or beyond
    if (visits >= 2) {
      // Listen for browser install prompt
      const handleBeforeInstall = (e: Event) => {
        e.preventDefault();
        setDeferredPrompt(e);
        setShowPrompt(true);
      };

      window.addEventListener("beforeinstallprompt", handleBeforeInstall);

      // On iOS Safari (no beforeinstallprompt event), show banner if not in standalone
      const isIos = /iphone|ipad|ipod/.test(window.navigator.userAgent.toLowerCase());
      const isStandalone = ("standalone" in window.navigator) && (window.navigator as any).standalone;
      if (isIos && !isStandalone) {
        setShowPrompt(true);
      }

      return () => {
        window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
      };
    }
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === "accepted") {
        setShowPrompt(false);
      }
      setDeferredPrompt(null);
    } else {
      // iOS hint
      alert("To install Albeli: Tap the Share button in Safari, then select 'Add to Home Screen' ✨");
      dismiss();
    }
  };

  const dismiss = () => {
    localStorage.setItem("albeli_pwa_dismissed", "true");
    setShowPrompt(false);
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-sm z-50 bg-[#4A0612] text-[#FCEDEA] p-3.5 rounded-sm shadow-2xl border border-[#FCEDEA]/20 animate-in slide-in-from-bottom duration-300">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-sm bg-[#6B1F2E] flex items-center justify-center shrink-0 border border-[#FCEDEA]/20">
          <img
            src="/brand/logo-peacock.svg"
            alt="Albeli"
            className="w-6 h-6 object-contain"
          />
        </div>

        <div className="flex-1 min-w-0 pr-1">
          <div className="flex items-center justify-between">
            <h4 className="font-display text-sm font-semibold tracking-wide text-[#FCEDEA]">
              Add Albeli to Home Screen
            </h4>
            <button
              onClick={dismiss}
              className="text-[#FCEDEA]/60 hover:text-[#FCEDEA] p-0.5 -mt-1 -mr-1"
              aria-label="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className="text-[11px] text-[#F1DFD8]/80 font-sans mt-0.5 leading-snug">
            Quick access to Delhi drops, festive curations & saved designs.
          </p>

          <div className="flex items-center gap-2 mt-2.5">
            <button
              onClick={handleInstall}
              className="px-3 py-1.5 bg-[#FCEDEA] text-[#4A0612] text-[10px] uppercase tracking-wider font-bold rounded-xs flex items-center gap-1 active:scale-95 shadow-xs"
            >
              <Plus className="w-3 h-3" />
              <span>Add to Phone</span>
            </button>
            <button
              onClick={dismiss}
              className="px-2.5 py-1 text-[10px] text-[#F1DFD8]/70 hover:text-[#FCEDEA] uppercase tracking-wider font-sans"
            >
              Maybe Later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
