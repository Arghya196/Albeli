// ═══════════════════════════════════════════════
// ALBELI — Storefront Layout
// ═══════════════════════════════════════════════
// Customer-facing pages with Brand Shell

import { Suspense } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { SplashScreen } from "@/components/brand/SplashScreen";
import { WhatsAppButton } from "@/components/brand/WhatsAppButton";
import { PwaPrompt } from "@/components/ui/PwaPrompt";
import { InstagramOrderModal } from "@/components/store/InstagramOrderModal";

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-[#FBF6EE] text-[#1E1A1A]">
      {/* Session Splash Screen */}
      <SplashScreen />

      {/* Top Announcement Bar */}
      <Suspense fallback={<div className="h-[36px] bg-[#4A0612]" />}>
        <AnnouncementBar />
      </Suspense>

      {/* Main Centred Header */}
      <Suspense fallback={<div className="h-14 sm:h-18 bg-[#FBF6EE]" />}>
        <Header />
      </Suspense>

      {/* Page Content */}
      <main className="flex-1 w-full">{children}</main>

      {/* Floating Action Button */}
      <Suspense fallback={null}>
        <WhatsAppButton />
      </Suspense>

      {/* Instagram Order Bridge Modal */}
      <InstagramOrderModal />

      {/* PWA Second Visit Home Screen Prompt */}
      <PwaPrompt />

      {/* Deep Maroon Brand Footer */}
      <Footer />
    </div>
  );
}
