"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Layers,
  Palette,
  MessageSquare,
  Settings,
  ExternalLink,
  Menu,
  X,
  LogOut,
  ShieldCheck,
  Navigation,
  Star,
} from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Products", href: "/admin/products", icon: Package },
  { label: "Categories", href: "/admin/categories", icon: Layers },
  { label: "Page Builder", href: "/admin/page-builder", icon: Palette },
  { label: "Nav Builder", href: "/admin/nav-builder", icon: Navigation },
  { label: "Reviews", href: "/admin/reviews", icon: Star },
  { label: "Enquiries", href: "/admin/enquiries", icon: MessageSquare },
  { label: "Site Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const [moreSheetOpen, setMoreSheetOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#FBF6EE] flex text-[#1E1A1A] select-none">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-[#4A0612]/10 shrink-0">
        {/* Sidebar Brand Header */}
        <div className="p-6 border-b border-[#4A0612]/10 flex flex-col items-start gap-2">
          <Logo variant="full" theme="dark" size="sm" asLink={false} />
          <div className="flex items-center gap-1.5 px-2 py-0.5 bg-[#4A0612]/5 text-[#6B1F2E] rounded-xs text-[10px] font-sans font-semibold uppercase tracking-wider">
            <ShieldCheck className="w-3 h-3 text-[#6B1F2E]" />
            <span>Admin Console</span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="p-4 space-y-1.5 flex-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href ||
              (item.href !== "/admin" && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3.5 py-2.5 rounded-sm text-xs font-sans tracking-wide transition-colors",
                  isActive
                    ? "bg-[#4A0612] text-[#FCEDEA] font-medium"
                    : "text-[#1E1A1A]/70 hover:bg-[#FBF6EE] hover:text-[#1E1A1A]"
                )}
              >
                <Icon className={cn("w-4 h-4", isActive ? "text-[#FCEDEA]" : "text-[#1E1A1A]/60")} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-[#4A0612]/10 space-y-2">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3 py-2 text-xs font-sans text-[#1E1A1A]/70 hover:text-[#6B1F2E] hover:bg-[#FBF6EE] rounded-sm transition-colors"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5" />
              <span>View Storefront</span>
            </span>
            <span className="text-[10px] font-mono text-[#1E1A1A]/40">↗</span>
          </Link>

          <div className="pt-2 flex items-center justify-between text-[11px] text-[#1E1A1A]/50 px-3">
            <span>Role: Owner (Dev)</span>
            <Link href="/" className="hover:text-[#6B1F2E]">
              Exit
            </Link>
          </div>
        </div>
      </aside>

      {/* Mobile Drawer */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs"
            onClick={() => setMobileSidebarOpen(false)}
          />
          <div className="relative w-4/5 max-w-xs bg-white h-full shadow-2xl p-6 flex flex-col justify-between z-10">
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-[#4A0612]/10 mb-6">
                <Logo variant="mark" theme="dark" size="sm" asLink={false} />
                <button
                  onClick={() => setMobileSidebarOpen(false)}
                  className="p-1 text-[#1E1A1A]/70 hover:text-[#6B1F2E]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="space-y-2">
                {NAV_ITEMS.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileSidebarOpen(false)}
                      className={cn(
                        "flex items-center gap-3 px-3.5 py-2.5 rounded-sm text-sm font-sans transition-colors",
                        isActive
                          ? "bg-[#4A0612] text-[#FCEDEA] font-medium"
                          : "text-[#1E1A1A]/70 hover:bg-[#FBF6EE]"
                      )}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>

            <div className="pt-6 border-t border-[#4A0612]/10">
              <Link
                href="/"
                className="block text-center py-2.5 bg-[#4A0612] text-[#FCEDEA] text-xs font-semibold uppercase tracking-wider rounded-sm"
              >
                View Storefront
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Mobile Top Header */}
        <header className="lg:hidden bg-white border-b border-[#4A0612]/10 px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => setMobileSidebarOpen(true)}
            className="p-1.5 text-[#1E1A1A] hover:text-[#6B1F2E]"
            aria-label="Open Admin Menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          <span className="font-display text-lg text-[#1E1A1A]">Albeli Admin</span>
          <Link
            href="/"
            className="text-xs uppercase tracking-wider text-[#6B1F2E] font-medium"
          >
            Store
          </Link>
        </header>

        {/* Child Pages */}
        <main className="flex-1 p-3 sm:p-8 lg:p-10 max-w-7xl w-full mx-auto pb-24 lg:pb-10">
          {children}
        </main>

        {/* Mobile Fixed Bottom Navigation Tab Bar (Dashboard | Products | Enquiries | Pages | More) */}
        <nav aria-label="Mobile Admin Navigation" className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white border-t border-[#4A0612]/15 safe-bottom-bar shadow-lg">
          <div className="grid grid-cols-5 h-14">
            {/* 1. Dashboard */}
            <Link
              href="/admin"
              className={cn(
                "flex flex-col items-center justify-center gap-1 text-[10px] font-sans font-medium transition-colors touch-target",
                pathname === "/admin" ? "text-[#6B1F2E]" : "text-[#1E1A1A]/60"
              )}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard</span>
            </Link>

            {/* 2. Products */}
            <Link
              href="/admin/products"
              className={cn(
                "flex flex-col items-center justify-center gap-1 text-[10px] font-sans font-medium transition-colors touch-target",
                pathname.startsWith("/admin/products") ? "text-[#6B1F2E]" : "text-[#1E1A1A]/60"
              )}
            >
              <Package className="w-4 h-4" />
              <span>Products</span>
            </Link>

            {/* 3. Enquiries */}
            <Link
              href="/admin/enquiries"
              className={cn(
                "flex flex-col items-center justify-center gap-1 text-[10px] font-sans font-medium transition-colors touch-target",
                pathname.startsWith("/admin/enquiries") ? "text-[#6B1F2E]" : "text-[#1E1A1A]/60"
              )}
            >
              <MessageSquare className="w-4 h-4" />
              <span>Enquiries</span>
            </Link>

            {/* 4. Pages */}
            <Link
              href="/admin/page-builder"
              className={cn(
                "flex flex-col items-center justify-center gap-1 text-[10px] font-sans font-medium transition-colors touch-target",
                pathname.startsWith("/admin/page-builder") ? "text-[#6B1F2E]" : "text-[#1E1A1A]/60"
              )}
            >
              <Palette className="w-4 h-4" />
              <span>Pages</span>
            </Link>

            {/* 5. More */}
            <button
              onClick={() => setMoreSheetOpen(true)}
              className="flex flex-col items-center justify-center gap-1 text-[10px] font-sans font-medium text-[#1E1A1A]/60 hover:text-[#6B1F2E] touch-target"
            >
              <Settings className="w-4 h-4" />
              <span>More</span>
            </button>
          </div>
        </nav>

        {/* "More" Bottom Sheet for Mobile */}
        {moreSheetOpen && (
          <div className="fixed inset-0 z-50 flex flex-col justify-end lg:hidden">
            <div
              className="fixed inset-0 bg-black/40 backdrop-blur-xs"
              onClick={() => setMoreSheetOpen(false)}
            />
            <div className="relative bg-[#FBF6EE] rounded-t-xl shadow-2xl p-6 z-10 animate-in slide-in-from-bottom duration-200 safe-bottom-bar space-y-4">
              <div className="w-12 h-1.5 bg-[#1E1A1A]/20 rounded-full mx-auto mb-2" />
              <div className="flex items-center justify-between pb-3 border-b border-[#4A0612]/10">
                <span className="font-display text-xl text-[#1E1A1A]">Admin Navigation</span>
                <button
                  onClick={() => setMoreSheetOpen(false)}
                  className="touch-target p-1 text-[#1E1A1A]/60"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-2 font-sans text-xs">
                <Link
                  href="/admin/categories"
                  onClick={() => setMoreSheetOpen(false)}
                  className="flex items-center gap-3 p-3 bg-white rounded-sm border border-[#4A0612]/10 hover:border-[#6B1F2E]"
                >
                  <Layers className="w-4 h-4 text-[#6B1F2E]" />
                  <span className="font-medium text-sm">Categories Manager</span>
                </Link>

                <Link
                  href="/admin/settings"
                  onClick={() => setMoreSheetOpen(false)}
                  className="flex items-center gap-3 p-3 bg-white rounded-sm border border-[#4A0612]/10 hover:border-[#6B1F2E]"
                >
                  <Settings className="w-4 h-4 text-[#6B1F2E]" />
                  <span className="font-medium text-sm">Site Settings & WhatsApp Phone</span>
                </Link>

                <Link
                  href="/"
                  target="_blank"
                  onClick={() => setMoreSheetOpen(false)}
                  className="flex items-center justify-between p-3 bg-white rounded-sm border border-[#4A0612]/10 hover:border-[#6B1F2E]"
                >
                  <span className="flex items-center gap-3">
                    <ExternalLink className="w-4 h-4 text-[#6B1F2E]" />
                    <span className="font-medium text-sm">View Live Storefront</span>
                  </span>
                  <span className="text-[10px] font-mono text-[#1E1A1A]/40">↗</span>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
