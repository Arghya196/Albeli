"use client";

import { useState } from "react";
import { Plus, Trash2, Layers, Tag, CheckCircle2 } from "lucide-react";
import { useAdminStore } from "@/lib/store/adminStore";
import { slugify } from "@/lib/utils";

export default function AdminCategoriesPage() {
  const { categories, addCategory, deleteCategory } = useAdminStore();

  const [newCatName, setNewCatName] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    addCategory(newCatName.trim(), slugify(newCatName.trim()));
    setSuccessMsg(`Added "${newCatName.trim()}" category`);
    setNewCatName("");
    setTimeout(() => setSuccessMsg(""), 2500);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="pb-6 border-b border-[#4A0612]/10">
        <h1 className="font-display text-3xl text-[#1E1A1A] font-normal tracking-tight">
          Categories & Attribute Sets
        </h1>
        <p className="font-sans text-xs text-[#1E1A1A]/60 mt-1">
          Categories are completely dynamic data. Add necklaces, bangles, or rings at any time without touching code.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Left: Categories List & Add */}
        <div className="md:col-span-7 space-y-6">
          {/* Add Category Card */}
          <div className="bg-white p-5 rounded-sm border border-[#4A0612]/10 shadow-xs">
            <h2 className="text-xs uppercase tracking-wider font-semibold text-[#1E1A1A] mb-3 font-sans">
              Add New Category
            </h2>
            <form onSubmit={handleAdd} className="flex gap-3">
              <input
                type="text"
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                placeholder="e.g. Bangles & Kadas, Maangtikka..."
                className="flex-1 px-3.5 py-2.5 bg-[#FBF6EE]/40 border border-[#4A0612]/20 rounded-sm text-xs font-sans focus:outline-none focus:border-[#6B1F2E]"
              />
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-[#4A0612] hover:bg-[#6B1F2E] text-[#FCEDEA] text-xs font-semibold uppercase tracking-wider rounded-sm transition-colors shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </form>
            {successMsg && (
              <span className="inline-flex items-center gap-1 text-[11px] text-[#25D366] mt-2 font-sans font-medium">
                <CheckCircle2 className="w-3 h-3" />
                {successMsg}
              </span>
            )}
          </div>

          {/* Existing Categories Table */}
          <div className="bg-white rounded-sm border border-[#4A0612]/10 overflow-hidden shadow-xs">
            <div className="p-4 bg-[#FBF6EE] border-b border-[#4A0612]/10 flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#1E1A1A]/80 font-sans">
                Active Categories ({categories.length})
              </span>
            </div>

            <div className="divide-y divide-[#4A0612]/5 font-sans text-xs">
              {categories.map((cat) => (
                <div
                  key={cat.id}
                  className="p-4 flex items-center justify-between hover:bg-[#FBF6EE]/30 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Layers className="w-4 h-4 text-[#6B1F2E]" />
                    <div>
                      <span className="font-medium text-[#1E1A1A] block">
                        {cat.name}
                      </span>
                      <span className="text-[11px] font-mono text-[#1E1A1A]/40">
                        slug: /{cat.slug}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => {
                        if (confirm(`Delete category "${cat.name}"?`)) {
                          deleteCategory(cat.id);
                        }
                      }}
                      className="text-red-500 hover:text-red-700 p-1"
                      aria-label={`Delete ${cat.name}`}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Attribute Definitions Guide */}
        <div className="md:col-span-5 space-y-4">
          <div className="bg-white p-6 rounded-sm border border-[#4A0612]/10 shadow-xs space-y-3 font-sans">
            <div className="flex items-center gap-2 text-[#6B1F2E]">
              <Tag className="w-4 h-4" />
              <h3 className="font-display text-lg text-[#1E1A1A]">
                Global Attribute Filters
              </h3>
            </div>
            <p className="text-xs text-[#1E1A1A]/70 leading-relaxed">
              Attributes define the filtering facets on the storefront shop page. Each design can be tagged with:
            </p>

            <div className="space-y-2 pt-2 text-xs">
              <div className="p-2.5 bg-[#FBF6EE]/60 rounded-xs border border-[#4A0612]/5">
                <span className="font-semibold text-[#1E1A1A] block">Plating Finish</span>
                <span className="text-[#1E1A1A]/60 text-[11px]">22k Antique Gold, Matte Gold, Silver Dual Tone</span>
              </div>

              <div className="p-2.5 bg-[#FBF6EE]/60 rounded-xs border border-[#4A0612]/5">
                <span className="font-semibold text-[#1E1A1A] block">Stone Types</span>
                <span className="text-[#1E1A1A]/60 text-[11px]">Glass Polki, Kundan, Meenakari Enamel, Cultured Pearls</span>
              </div>

              <div className="p-2.5 bg-[#FBF6EE]/60 rounded-xs border border-[#4A0612]/5">
                <span className="font-semibold text-[#1E1A1A] block">Occasion</span>
                <span className="text-[#1E1A1A]/60 text-[11px]">Bridal, Sangeet, Everyday Minimal, Festive Gifting</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
