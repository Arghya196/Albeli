"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import {
  Palette,
  Eye,
  Save,
  CheckCircle2,
  Sliders,
  Type,
  Image as ImageIcon,
  MessageCircle,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Upload,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { useAdminStore, DEFAULT_HERO_SLIDES, HeroSlide } from "@/lib/store/adminStore";

export default function AdminPageBuilderPage() {
  const { settings, updateSettings } = useAdminStore();

  const [slides, setSlides] = useState<HeroSlide[]>(
    settings.heroSlides && settings.heroSlides.length > 0
      ? settings.heroSlides
      : DEFAULT_HERO_SLIDES
  );
  const [activePreviewSlide, setActivePreviewSlide] = useState(0);
  const [storyPhilosophy, setStoryPhilosophy] = useState(settings.storyPhilosophy);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [editingSlideId, setEditingSlideId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [uploadTargetSlideId, setUploadTargetSlideId] = useState<string | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      heroSlides: slides,
      heroHeadline: slides[0]?.headline || settings.heroHeadline,
      heroTagline: slides[0]?.hindiTagline || settings.heroTagline,
      storyPhilosophy,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleAddSlide = () => {
    const newSlide: HeroSlide = {
      id: `slide-${Date.now()}`,
      image: "/images/product-3-a.jpg",
      badge: "New Arrival • Limited Drop",
      headline: "Handcrafted Elegance for Every Moment.",
      hindiTagline: "नया अंदाज़, वही ख़ास पहचान।",
      desktopDesc: "Exquisite hand-carved heritage pieces designed in Delhi for everyday luxury and grand festivities.",
      ctaText: "Shop Collection",
      ctaLink: "/shop",
    };
    const nextSlides = [...slides, newSlide];
    setSlides(nextSlides);
    setEditingSlideId(newSlide.id);
    setActivePreviewSlide(nextSlides.length - 1);
  };

  const handleUpdateSlide = (id: string, updates: Partial<HeroSlide>) => {
    setSlides((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updates } : s))
    );
  };

  const handleDeleteSlide = (id: string) => {
    if (slides.length <= 1) {
      alert("At least one hero slide is required.");
      return;
    }
    const nextSlides = slides.filter((s) => s.id !== id);
    setSlides(nextSlides);
    if (activePreviewSlide >= nextSlides.length) {
      setActivePreviewSlide(0);
    }
  };

  const handleMoveSlide = (index: number, direction: "up" | "down") => {
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= slides.length) return;
    const newSlides = [...slides];
    const [moved] = newSlides.splice(index, 1);
    newSlides.splice(targetIdx, 0, moved);
    setSlides(newSlides);
    setActivePreviewSlide(targetIdx);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, slideId?: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (loadEvent) => {
      const dataUrl = loadEvent.target?.result as string;
      if (slideId) {
        handleUpdateSlide(slideId, { image: dataUrl });
      } else if (uploadTargetSlideId) {
        handleUpdateSlide(uploadTargetSlideId, { image: dataUrl });
      }
    };
    reader.readAsDataURL(file);
  };

  const triggerUploadForSlide = (slideId: string) => {
    setUploadTargetSlideId(slideId);
    fileInputRef.current?.click();
  };

  const currentPreviewSlide = slides[activePreviewSlide % slides.length] || slides[0];

  return (
    <div className="space-y-8">
      {/* Hidden file input for uploading custom hero photos */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFileUpload(e)}
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-baseline justify-between gap-4 pb-6 border-b border-[#4A0612]/10">
        <div>
          <h1 className="font-display text-3xl text-[#1E1A1A] font-normal tracking-tight">
            Homepage Section Builder
          </h1>
          <p className="font-sans text-xs text-[#1E1A1A]/60 mt-1">
            Manage auto-sliding hero photos, animated headlines, brand copy, and announcements.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/"
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 border border-[#4A0612]/20 hover:bg-white text-xs font-sans font-medium rounded-sm text-[#1E1A1A] transition-colors shadow-xs"
          >
            <Eye className="w-3.5 h-3.5 text-[#6B1F2E]" />
            <span>Preview Live Store</span>
          </Link>

          <button
            onClick={handleSave}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#4A0612] hover:bg-[#6B1F2E] text-[#FCEDEA] text-xs font-semibold uppercase tracking-wider rounded-sm transition-colors shadow-xs cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save All Edits</span>
          </button>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-sm text-xs font-sans flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Homepage hero slides and copy updated successfully! Changes reflect on the live website.</span>
        </div>
      )}

      {/* 2-Column Layout: Controls on Left, 375px Phone Frame Preview on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form Controls */}
        <div className="lg:col-span-7 space-y-6">
          {/* Section 1: Hero Carousel Slides Manager */}
          <div className="bg-white p-6 rounded-sm border border-[#4A0612]/10 shadow-xs space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#4A0612]/10">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-[#6B1F2E]" />
                <h2 className="font-display text-xl text-[#1E1A1A]">
                  1. Hero Slides & Animated Carousel
                </h2>
              </div>
              <button
                type="button"
                onClick={handleAddSlide}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#4A0612] hover:bg-[#6B1F2E] text-[#FCEDEA] text-xs font-medium rounded-xs transition-colors shadow-xs cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Slide</span>
              </button>
            </div>

            <p className="text-xs text-[#1E1A1A]/70 font-sans">
              Add multiple campaign photos. Slides transition automatically with smooth animations on the homepage. Admins can upload photos, edit English/Hindi typography, and link CTAs.
            </p>

            {/* Slides List */}
            <div className="space-y-4">
              {slides.map((slide, idx) => (
                <div
                  key={slide.id || idx}
                  className={`p-4 rounded-sm border transition-all ${
                    activePreviewSlide === idx
                      ? "border-[#6B1F2E] bg-[#FBF6EE]/30 shadow-xs"
                      : "border-[#4A0612]/15 bg-white hover:border-[#4A0612]/30"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="relative w-16 h-20 rounded-xs overflow-hidden bg-[#4A0612] shrink-0 border border-black/10">
                        <img
                          src={slide.image}
                          alt={slide.headline}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-mono font-bold text-[#6B1F2E] bg-[#6B1F2E]/10 px-2 py-0.5 rounded-full">
                            Slide {idx + 1}
                          </span>
                          {slide.badge && (
                            <span className="text-[10px] uppercase font-sans tracking-wider text-[#1E1A1A]/60 font-semibold truncate max-w-[200px]">
                              {slide.badge}
                            </span>
                          )}
                        </div>
                        <h4 className="font-display text-sm font-semibold text-[#1E1A1A] mt-1 line-clamp-1">
                          {slide.headline}
                        </h4>
                        {slide.hindiTagline && (
                          <p className="font-hindi text-xs text-[#6B1F2E] mt-0.5 line-clamp-1">
                            {slide.hindiTagline}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Actions: Reorder & Delete */}
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleMoveSlide(idx, "up")}
                        disabled={idx === 0}
                        title="Move Up"
                        className="p-1.5 text-[#1E1A1A]/60 hover:text-[#1E1A1A] disabled:opacity-30 rounded hover:bg-[#FBF6EE]"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMoveSlide(idx, "down")}
                        disabled={idx === slides.length - 1}
                        title="Move Down"
                        className="p-1.5 text-[#1E1A1A]/60 hover:text-[#1E1A1A] disabled:opacity-30 rounded hover:bg-[#FBF6EE]"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setActivePreviewSlide(idx);
                          setEditingSlideId(editingSlideId === slide.id ? null : slide.id);
                        }}
                        className="px-2.5 py-1 text-xs font-sans text-[#6B1F2E] hover:bg-[#6B1F2E]/10 rounded font-medium ml-1"
                      >
                        {editingSlideId === slide.id ? "Collapse" : "Edit"}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteSlide(slide.id)}
                        title="Delete Slide"
                        className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded ml-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Expandable Edit Fields */}
                  {editingSlideId === slide.id && (
                    <div className="pt-3 border-t border-[#4A0612]/10 space-y-3 font-sans text-xs">
                      <div>
                        <label className="block font-medium text-[#1E1A1A] mb-1">
                          Slide Photo (Upload from Computer or enter Image URL)
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={slide.image}
                            onChange={(e) => handleUpdateSlide(slide.id, { image: e.target.value })}
                            placeholder="/images/hero-1.jpg or https://..."
                            className="flex-1 px-3 py-2 bg-[#FBF6EE]/40 border border-[#4A0612]/20 rounded-sm text-xs focus:outline-none focus:border-[#6B1F2E]"
                          />
                          <button
                            type="button"
                            onClick={() => triggerUploadForSlide(slide.id)}
                            className="inline-flex items-center gap-1.5 px-3 py-2 bg-[#4A0612]/10 hover:bg-[#4A0612]/20 text-[#4A0612] text-xs font-medium rounded-sm transition-colors cursor-pointer"
                          >
                            <Upload className="w-3.5 h-3.5" />
                            <span>Upload Photo</span>
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block font-medium text-[#1E1A1A] mb-1">
                            Pill Badge Text
                          </label>
                          <input
                            type="text"
                            value={slide.badge || ""}
                            onChange={(e) => handleUpdateSlide(slide.id, { badge: e.target.value })}
                            placeholder="Delhi • Handcrafted • Authentic"
                            className="w-full px-3 py-2 bg-[#FBF6EE]/40 border border-[#4A0612]/20 rounded-sm text-xs focus:outline-none focus:border-[#6B1F2E]"
                          />
                        </div>

                        <div>
                          <label className="block font-medium text-[#1E1A1A] mb-1">
                            Devanagari Tagline (Hindi)
                          </label>
                          <input
                            type="text"
                            value={slide.hindiTagline || ""}
                            onChange={(e) => handleUpdateSlide(slide.id, { hindiTagline: e.target.value })}
                            placeholder="अलबेली — थोड़ा हटके, पूरा देसी।"
                            className="w-full px-3 py-2 bg-[#FBF6EE]/40 border border-[#4A0612]/20 rounded-sm text-xs focus:outline-none focus:border-[#6B1F2E]"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block font-medium text-[#1E1A1A] mb-1">
                          Primary Headline (English)
                        </label>
                        <input
                          type="text"
                          value={slide.headline}
                          onChange={(e) => handleUpdateSlide(slide.id, { headline: e.target.value })}
                          className="w-full px-3 py-2 bg-[#FBF6EE]/40 border border-[#4A0612]/20 rounded-sm text-xs focus:outline-none focus:border-[#6B1F2E]"
                        />
                      </div>

                      <div>
                        <label className="block font-medium text-[#1E1A1A] mb-1">
                          Desktop Subtext Description
                        </label>
                        <textarea
                          rows={2}
                          value={slide.desktopDesc || ""}
                          onChange={(e) => handleUpdateSlide(slide.id, { desktopDesc: e.target.value })}
                          className="w-full px-3 py-2 bg-[#FBF6EE]/40 border border-[#4A0612]/20 rounded-sm text-xs focus:outline-none focus:border-[#6B1F2E]"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block font-medium text-[#1E1A1A] mb-1">
                            CTA Button Text
                          </label>
                          <input
                            type="text"
                            value={slide.ctaText || "Explore Drop"}
                            onChange={(e) => handleUpdateSlide(slide.id, { ctaText: e.target.value })}
                            className="w-full px-3 py-2 bg-[#FBF6EE]/40 border border-[#4A0612]/20 rounded-sm text-xs focus:outline-none focus:border-[#6B1F2E]"
                          />
                        </div>

                        <div>
                          <label className="block font-medium text-[#1E1A1A] mb-1">
                            CTA Link Target
                          </label>
                          <input
                            type="text"
                            value={slide.ctaLink || "/shop"}
                            onChange={(e) => handleUpdateSlide(slide.id, { ctaLink: e.target.value })}
                            placeholder="/shop or /collections/festive-edit"
                            className="w-full px-3 py-2 bg-[#FBF6EE]/40 border border-[#4A0612]/20 rounded-sm text-xs focus:outline-none focus:border-[#6B1F2E]"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Section 2: The Albeli Brand Story Block */}
          <div className="bg-white p-6 rounded-sm border border-[#4A0612]/10 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#4A0612]/10">
              <div className="flex items-center gap-2">
                <Palette className="w-4 h-4 text-[#6B1F2E]" />
                <h2 className="font-display text-xl text-[#1E1A1A]">
                  2. Brand Philosophy & Delhi Heritage Story
                </h2>
              </div>
            </div>

            <div className="font-sans text-xs">
              <label className="block font-medium text-[#1E1A1A] mb-1">
                Short Manifesto Copy (Displayed with Peacock Watermark)
              </label>
              <textarea
                rows={3}
                value={storyPhilosophy}
                onChange={(e) => setStoryPhilosophy(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#FBF6EE]/40 border border-[#4A0612]/20 rounded-sm text-xs focus:outline-none focus:border-[#6B1F2E]"
              />
            </div>
          </div>

          {/* Section 3: Announcement Bar Messages */}
          <div className="bg-white p-6 rounded-sm border border-[#4A0612]/10 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#4A0612]/10">
              <div className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-[#6B1F2E]" />
                <h2 className="font-display text-xl text-[#1E1A1A]">
                  3. Announcement Bar Messages
                </h2>
              </div>
            </div>

            <div className="space-y-2 font-sans text-xs">
              {settings.announcementMessages.map((msg, idx) => (
                <div key={idx} className="p-3 bg-[#FBF6EE]/60 rounded-xs border border-[#4A0612]/10 flex items-center justify-between">
                  <span>{msg}</span>
                  <span className="text-[10px] text-[#1E1A1A]/40 font-mono">Slide {idx + 1}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Live Phone Frame Preview (375px by default) */}
        <div className="lg:col-span-5 flex flex-col items-center sticky top-6">
          <div className="w-full flex items-center justify-between pb-2 mb-2">
            <span className="text-xs uppercase font-sans tracking-widest text-[#1E1A1A]/60 font-semibold flex items-center gap-1.5">
              <span>📱 Live Phone Preview (375px)</span>
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setActivePreviewSlide((prev) => (prev - 1 + slides.length) % slides.length)}
                className="p-1 rounded bg-[#FBF6EE] border border-[#4A0612]/10 text-[#4A0612] hover:bg-white text-xs"
                title="Previous Slide"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <span className="text-[10px] font-mono px-1.5 text-[#6B1F2E]">
                {activePreviewSlide + 1}/{slides.length}
              </span>
              <button
                type="button"
                onClick={() => setActivePreviewSlide((prev) => (prev + 1) % slides.length)}
                className="p-1 rounded bg-[#FBF6EE] border border-[#4A0612]/10 text-[#4A0612] hover:bg-white text-xs"
                title="Next Slide"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* 375px Phone Bezel */}
          <div className="w-full max-w-[375px] bg-[#1E1A1A] p-3 rounded-[36px] shadow-2xl border-4 border-[#1E1A1A]">
            {/* Screen Inner */}
            <div className="bg-[#FBF6EE] rounded-[28px] overflow-hidden flex flex-col border border-black/10 max-h-[640px] overflow-y-auto scrollbar-none">
              {/* Phone Status Bar */}
              <div className="h-6 bg-[#4A0612] text-[#FCEDEA] text-[10px] flex items-center justify-between px-4 font-mono select-none">
                <span>9:41</span>
                <div className="w-16 h-3 bg-black/40 rounded-full mx-auto" />
                <span>5G 100%</span>
              </div>

              {/* Mini Announcement */}
              <div className="bg-[#4A0612] text-[#FCEDEA] text-[9px] text-center py-1 truncate px-2 font-sans border-b border-[#6B1F2E]/30">
                {settings.announcementMessages[0]}
              </div>

              {/* Mini Header with authentic logo */}
              <div className="h-12 bg-[#FBF6EE] border-b border-[#4A0612]/10 flex items-center justify-between px-3">
                <span className="text-xs font-bold">☰</span>
                <img
                  src="/brand/logo-full-dark.png"
                  alt="Albeli"
                  className="h-6 w-auto object-contain"
                />
                <span className="text-xs">♡</span>
              </div>

              {/* Mini Hero with Real-time Editable Headlines & Photos */}
              <div className="p-3">
                <div className="relative aspect-[4/5] rounded-t-2xl overflow-hidden bg-[#4A0612] text-[#FCEDEA] flex flex-col justify-end p-4 transition-all duration-500">
                  <img
                    src={currentPreviewSlide.image}
                    alt={currentPreviewSlide.headline}
                    className="absolute inset-0 w-full h-full object-cover opacity-85 transition-all duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#4A0612] via-[#4A0612]/50 to-transparent" />
                  <div className="relative z-10">
                    {currentPreviewSlide.badge && (
                      <span className="text-[9px] uppercase tracking-wider text-[#B8923A] font-sans font-bold block mb-1">
                        {currentPreviewSlide.badge}
                      </span>
                    )}
                    <h3 className="font-display text-base text-white leading-tight mb-1 font-normal transition-all duration-300">
                      {currentPreviewSlide.headline}
                    </h3>
                    {currentPreviewSlide.hindiTagline && (
                      <p className="font-hindi text-xs text-[#F1DFD8]/90 mb-2">
                        {currentPreviewSlide.hindiTagline}
                      </p>
                    )}
                    <span className="inline-block px-3 py-1 bg-[#FCEDEA] text-[#4A0612] text-[10px] uppercase tracking-wider font-semibold rounded-xs">
                      {currentPreviewSlide.ctaText || "Explore Drop"} →
                    </span>
                  </div>
                </div>

                {/* Mini Dots indicator */}
                <div className="flex items-center justify-center gap-1.5 pt-2">
                  {slides.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setActivePreviewSlide(i)}
                      className={`h-1 rounded-full transition-all ${
                        activePreviewSlide === i
                          ? "w-5 bg-[#4A0612]"
                          : "w-1.5 bg-[#4A0612]/30"
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Mini Story Block */}
              <div className="p-3 pt-0">
                <div className="p-3 bg-white rounded-sm border border-[#4A0612]/10 text-center">
                  <span className="text-[9px] uppercase tracking-wider text-[#6B1F2E] font-bold block mb-1 font-sans">
                    Our Story
                  </span>
                  <p className="text-[10px] text-[#1E1A1A]/70 leading-relaxed font-sans line-clamp-3">
                    {storyPhilosophy}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
