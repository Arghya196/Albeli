"use client";

import Link from "next/link";
import {
  Package,
  Heart,
  MessageSquare,
  Sparkles,
  ArrowRight,
  Trash2,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import { useAdminStore, type AdminReview, type SiteSettingsData } from "@/lib/store/adminStore";
import { PlaceholderProduct } from "@/lib/placeholder-data";
import { formatPrice } from "@/lib/utils";

/* ── Dynamic Onboarding Checklist ── */
function OnboardingChecklist({
  products,
  enquiries,
  settings,
  reviews,
}: {
  products: PlaceholderProduct[];
  enquiries: { id: string }[];
  settings: SiteSettingsData;
  reviews: AdminReview[];
}) {
  const hasRealProducts = products.some((p) => !p.isPlaceholder);
  const hasWhatsApp = settings.whatsappNumber !== "+91XXXXXXXXXX" && settings.whatsappNumber.length > 5;
  const hasInstagram = settings.instagramHandle !== "albelihouse" || true; // already set
  const hasReviews = reviews.filter((r) => r.visible).length >= 1;
  const hasRealImages = products.some((p) => !p.isPlaceholder && p.primaryImage);
  const hasHeroCopy = settings.heroHeadline.length > 5;
  const hasAnnouncements = settings.announcementMessages.length >= 1;

  const items = [
    {
      done: true,
      title: "Brand Identity & Design System",
      desc: "Logo, colour tokens, splash screen, and typography configured.",
    },
    {
      done: true,
      title: "Storefront & Admin Console Live",
      desc: "Homepage, shop, product pages, and full admin panel operational.",
    },
    {
      done: hasWhatsApp,
      title: "Set Your WhatsApp Number",
      desc: hasWhatsApp
        ? `Connected: ${settings.whatsappNumber}`
        : "Update in Settings → WhatsApp Number.",
      link: "/admin/settings",
    },
    {
      done: hasRealProducts,
      title: "Add Your First Real Product",
      desc: hasRealProducts
        ? `${products.filter((p) => !p.isPlaceholder).length} real designs added.`
        : "Replace placeholders with your actual jewellery photos.",
      link: "/admin/products",
    },
    {
      done: hasHeroCopy,
      title: "Customize Homepage Headlines",
      desc: "Edit hero banner text and brand story from Page Builder.",
      link: "/admin/page-builder",
    },
    {
      done: hasReviews,
      title: "Add Customer Testimonials",
      desc: hasReviews
        ? `${reviews.filter((r) => r.visible).length} reviews visible on storefront.`
        : "Add at least one customer review for social proof.",
      link: "/admin/reviews",
    },
    {
      done: hasAnnouncements,
      title: "Configure Announcement Bar",
      desc: "Shipping messages and promotional text for the top bar.",
      link: "/admin/settings",
    },
  ];

  const doneCount = items.filter((i) => i.done).length;
  const allDone = doneCount === items.length;

  return (
    <div className="bg-white p-6 sm:p-8 rounded-sm border border-[#4A0612]/10 shadow-xs space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-[#4A0612]/10">
        <div>
          <h2 className="font-display text-2xl text-[#1E1A1A]">
            Brand Launch Checklist
          </h2>
          <p className="text-xs text-[#1E1A1A]/60 font-sans mt-0.5">
            {allDone
              ? "All set! Your store is ready for launch. 🎉"
              : "Complete these steps before your public launch."}
          </p>
        </div>
        <span
          className={`text-xs font-sans font-medium px-2.5 py-1 rounded-full ${
            allDone
              ? "text-emerald-700 bg-emerald-50"
              : "text-[#6B1F2E] bg-[#6B1F2E]/10"
          }`}
        >
          {doneCount} of {items.length}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="h-1.5 bg-[#FBF6EE] rounded-full overflow-hidden">
        <div
          className="h-full bg-[#6B1F2E] rounded-full transition-all duration-500"
          style={{ width: `${(doneCount / items.length) * 100}%` }}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-2">
        {items.map((item, idx) => (
          <div
            key={idx}
            className={`flex items-start gap-3 p-3 rounded-sm border ${
              item.done
                ? "bg-[#FBF6EE]/60 border-[#4A0612]/5"
                : "bg-white border-[#4A0612]/15"
            }`}
          >
            {item.done ? (
              <CheckCircle2 className="w-4 h-4 text-[#25D366] shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-4 h-4 text-[#B8923A] shrink-0 mt-0.5" />
            )}
            <div>
              <span className="text-xs font-sans font-medium text-[#1E1A1A] block">
                {idx + 1}. {item.title}
              </span>
              <p className="text-[11px] text-[#1E1A1A]/50 font-sans">
                {item.desc}{" "}
                {item.link && !item.done && (
                  <Link href={item.link} className="text-[#6B1F2E] underline">
                    Go →
                  </Link>
                )}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AdminDashboardPage() {
  const { products, enquiries, deleteAllPlaceholders } = useAdminStore();

  const placeholderCount = products.filter((p) => p.isPlaceholder).length;
  const newEnquiriesCount = enquiries.filter((e) => e.status === "new").length;

  const handleDeletePlaceholders = () => {
    if (confirm("Are you sure you want to delete all 6 demo placeholder designs? This action will remove demo items.")) {
      deleteAllPlaceholders();
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Banner / Welcome */}
      <div className="flex flex-col sm:flex-row items-baseline justify-between gap-4 pb-6 border-b border-[#4A0612]/10">
        <div>
          <span className="font-hindi text-xs sm:text-sm text-[#6B1F2E] block mb-1">
            नमस्ते, स्वागत है
          </span>
          <h1 className="font-display text-3xl sm:text-4xl text-[#1E1A1A] font-normal tracking-tight">
            Store Overview
          </h1>
          <p className="font-sans text-xs text-[#1E1A1A]/60 mt-1">
            Real-time activity, customer enquiries, and catalogue health.
          </p>
        </div>

        {placeholderCount > 0 && (
          <div className="flex items-center gap-3">
            <span className="text-xs text-[#1E1A1A]/60 font-sans hidden sm:inline-block">
              {placeholderCount} demo designs active
            </span>
            <button
              onClick={handleDeletePlaceholders}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-red-50 text-red-700 border border-red-200 text-xs font-sans font-medium rounded-sm transition-colors shadow-xs"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete All Placeholders</span>
            </button>
          </div>
        )}
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Card 1: Active Designs */}
        <div className="bg-white p-5 rounded-sm border border-[#4A0612]/10 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#1E1A1A]/60 mb-3">
            <span className="text-xs font-sans uppercase tracking-wider font-semibold">
              Catalogue Designs
            </span>
            <Package className="w-4 h-4 text-[#6B1F2E]" />
          </div>
          <div>
            <span className="font-display text-3xl text-[#1E1A1A] block">
              {products.length}
            </span>
            <span className="text-[11px] text-[#1E1A1A]/50 font-sans">
              {placeholderCount > 0 ? `${placeholderCount} placeholders` : "All original designs"}
            </span>
          </div>
        </div>

        {/* Card 2: Wishlist Saves */}
        <div className="bg-white p-5 rounded-sm border border-[#4A0612]/10 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#1E1A1A]/60 mb-3">
            <span className="text-xs font-sans uppercase tracking-wider font-semibold">
              Customer Saves
            </span>
            <Heart className="w-4 h-4 text-[#6B1F2E]" />
          </div>
          <div>
            <span className="font-display text-3xl text-[#1E1A1A] block">
              28
            </span>
            <span className="text-[11px] text-[#25D366] font-sans font-medium">
              ↑ 14 new saves this week
            </span>
          </div>
        </div>

        {/* Card 3: Enquiries */}
        <div className="bg-white p-5 rounded-sm border border-[#4A0612]/10 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#1E1A1A]/60 mb-3">
            <span className="text-xs font-sans uppercase tracking-wider font-semibold">
              WhatsApp & DM Leads
            </span>
            <MessageSquare className="w-4 h-4 text-[#6B1F2E]" />
          </div>
          <div>
            <span className="font-display text-3xl text-[#1E1A1A] block">
              {enquiries.length}
            </span>
            <span className="text-[11px] text-[#6B1F2E] font-sans font-medium">
              {newEnquiriesCount} awaiting reply
            </span>
          </div>
        </div>

        {/* Card 4: Storefront Mode */}
        <div className="bg-white p-5 rounded-sm border border-[#4A0612]/10 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#1E1A1A]/60 mb-3">
            <span className="text-xs font-sans uppercase tracking-wider font-semibold">
              Store Status
            </span>
            <Sparkles className="w-4 h-4 text-[#B8923A]" />
          </div>
          <div>
            <span className="font-display text-3xl text-[#1E1A1A] block">
              Live
            </span>
            <span className="text-[11px] text-[#1E1A1A]/50 font-sans">
              No-cart direct enquiry flow
            </span>
          </div>
        </div>
      </div>

      {/* Onboarding Checklist for Brand Owner */}
      <OnboardingChecklist products={products} enquiries={enquiries} settings={useAdminStore.getState().settings} reviews={useAdminStore.getState().reviews} />

      {/* Recent Enquiries & Top Designs Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Recent Enquiries */}
        <div className="lg:col-span-7 bg-white p-6 rounded-sm border border-[#4A0612]/10 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#4A0612]/10">
            <h2 className="font-display text-xl text-[#1E1A1A]">
              Recent Customer Enquiries
            </h2>
            <Link
              href="/admin/enquiries"
              className="text-xs text-[#6B1F2E] hover:underline font-sans font-medium"
            >
              View Inbox ({enquiries.length}) →
            </Link>
          </div>

          <div className="divide-y divide-[#4A0612]/5">
            {enquiries.slice(0, 3).map((enq) => (
              <div key={enq.id} className="py-3 flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-semibold text-[#1E1A1A] font-sans">
                      {enq.customerName || "Website Guest"}
                    </span>
                    <span className="text-[10px] font-sans uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#4A0612]/5 text-[#6B1F2E]">
                      {enq.channel}
                    </span>
                  </div>
                  <p className="text-xs text-[#1E1A1A]/80 font-sans font-medium">
                    {enq.productName}
                  </p>
                  {enq.notes && (
                    <p className="text-[11px] text-[#1E1A1A]/50 font-sans mt-0.5">
                      {enq.notes}
                    </p>
                  )}
                </div>

                <div className="text-right shrink-0">
                  <span
                    className={`inline-block text-[10px] font-sans uppercase tracking-wider px-2 py-0.5 rounded-full font-semibold ${
                      enq.status === "new"
                        ? "bg-amber-100 text-amber-800"
                        : enq.status === "contacted"
                        ? "bg-blue-100 text-blue-800"
                        : enq.status === "converted"
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {enq.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Quick Links & Top Catalogue Items */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-6 rounded-sm border border-[#4A0612]/10 shadow-xs space-y-4">
            <h2 className="font-display text-xl text-[#1E1A1A]">
              Quick Actions
            </h2>
            <div className="space-y-2.5">
              <Link
                href="/admin/products"
                className="flex items-center justify-between p-3 bg-[#FBF6EE] hover:bg-[#F1DFD8] rounded-sm text-xs font-sans text-[#1E1A1A] font-medium transition-colors"
              >
                <span>Add / Manage Jewellery Designs</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#6B1F2E]" />
              </Link>
              <Link
                href="/admin/page-builder"
                className="flex items-center justify-between p-3 bg-[#FBF6EE] hover:bg-[#F1DFD8] rounded-sm text-xs font-sans text-[#1E1A1A] font-medium transition-colors"
              >
                <span>Edit Homepage Headings & Banners</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#6B1F2E]" />
              </Link>
              <Link
                href="/admin/settings"
                className="flex items-center justify-between p-3 bg-[#FBF6EE] hover:bg-[#F1DFD8] rounded-sm text-xs font-sans text-[#1E1A1A] font-medium transition-colors"
              >
                <span>Configure WhatsApp & Socials</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#6B1F2E]" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
