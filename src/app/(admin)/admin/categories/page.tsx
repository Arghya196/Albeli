"use client";

import { useState, useMemo } from "react";
import {
  Plus,
  Trash2,
  Edit3,
  Layers,
  Tag,
  CheckCircle2,
  ChevronRight,
  FolderTree,
  Sparkles,
  Search,
  ExternalLink,
  Package,
  X,
  HelpCircle,
  RotateCcw,
  ChevronDown,
} from "lucide-react";
import Link from "next/link";
import { useAdminStore, type AdminCategory } from "@/lib/store/adminStore";
import { slugify, formatPrice } from "@/lib/utils";

export default function AdminCategoriesPage() {
  const { categories, products, addCategory, updateCategory, deleteCategory, restoreDefaultVariety } = useAdminStore();

  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<AdminCategory | null>(null);
  const [expandedSubId, setExpandedSubId] = useState<string | null>("sub-2");

  // Form State
  const [formLevel, setFormLevel] = useState<"root" | "sub">("sub");
  const [selectedParentId, setSelectedParentId] = useState<string>("");
  const [formName, setFormName] = useState("");
  const [formSlug, setFormSlug] = useState("");
  const [formDesc, setFormDesc] = useState("");
  const [formImage, setFormImage] = useState("");
  const [toastMsg, setToastMsg] = useState("");

  // Separate root categories and subcategories
  const rootCategories = useMemo(() => {
    return categories.filter((c) => !c.parentId);
  }, [categories]);

  const subcategoriesMap = useMemo(() => {
    const map = new Map<string, AdminCategory[]>();
    categories.forEach((cat) => {
      if (cat.parentId) {
        const existing = map.get(cat.parentId) || [];
        existing.push(cat);
        map.set(cat.parentId, existing);
      }
    });
    return map;
  }, [categories]);

  // Product counts per category & subcategory
  const counts = useMemo(() => {
    const catCount: Record<string, number> = {};
    const subCount: Record<string, number> = {};

    products.forEach((p) => {
      const cSlug = p.categorySlug?.toLowerCase() || slugify(p.category || "");
      catCount[cSlug] = (catCount[cSlug] || 0) + 1;

      if (p.subcategorySlug || p.subcategory) {
        const sSlug = p.subcategorySlug?.toLowerCase() || slugify(p.subcategory || "");
        subCount[`${cSlug}::${sSlug}`] = (subCount[`${cSlug}::${sSlug}`] || 0) + 1;
      }
    });

    return { catCount, subCount };
  }, [products]);

  // Stats
  const totalSubcategories = useMemo(() => {
    return categories.filter((c) => c.parentId).length;
  }, [categories]);

  const earringSubcategories = useMemo(() => {
    const earringCat = rootCategories.find((c) => c.slug === "earrings");
    if (!earringCat) return [];
    return subcategoriesMap.get(earringCat.id) || [];
  }, [rootCategories, subcategoriesMap]);

  // Open modal for Adding a new Category or Subcategory
  const handleOpenAdd = (defaultParentId?: string) => {
    setEditingCategory(null);
    if (defaultParentId) {
      setFormLevel("sub");
      setSelectedParentId(defaultParentId);
    } else {
      setFormLevel("sub");
      setSelectedParentId(rootCategories[0]?.id || "");
    }
    setFormName("");
    setFormSlug("");
    setFormDesc("");
    setFormImage("");
    setModalOpen(true);
  };

  // Open modal for Editing
  const handleOpenEdit = (cat: AdminCategory) => {
    setEditingCategory(cat);
    if (cat.parentId) {
      setFormLevel("sub");
      setSelectedParentId(cat.parentId);
    } else {
      setFormLevel("root");
      setSelectedParentId("");
    }
    setFormName(cat.name);
    setFormSlug(cat.slug);
    setFormDesc(cat.description || "");
    setFormImage(cat.imageUrl || "");
    setModalOpen(true);
  };

  const handleNameChange = (val: string) => {
    setFormName(val);
    if (!editingCategory) {
      setFormSlug(slugify(val));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    const finalSlug = formSlug.trim() ? slugify(formSlug.trim()) : slugify(formName.trim());
    const finalParentId = formLevel === "sub" ? selectedParentId || null : null;

    if (editingCategory) {
      updateCategory(editingCategory.id, {
        name: formName.trim(),
        slug: finalSlug,
        parentId: finalParentId,
        description: formDesc.trim() || undefined,
        imageUrl: formImage.trim() || undefined,
      });
      setToastMsg(`Updated "${formName.trim()}"`);
    } else {
      addCategory(
        formName.trim(),
        finalSlug,
        finalParentId,
        formDesc.trim() || undefined,
        formImage.trim() || undefined
      );
      setToastMsg(
        formLevel === "sub"
          ? `Added subcategory "${formName.trim()}"`
          : `Added category "${formName.trim()}"`
      );
    }

    setModalOpen(false);
    setTimeout(() => setToastMsg(""), 3000);
  };

  // Filter root categories & subcategories by search
  const filteredRootCategories = useMemo(() => {
    if (!search.trim()) return rootCategories;
    const q = search.trim().toLowerCase();

    return rootCategories.filter((cat) => {
      const matchCat =
        cat.name.toLowerCase().includes(q) ||
        cat.slug.toLowerCase().includes(q) ||
        cat.description?.toLowerCase().includes(q);

      const subs = subcategoriesMap.get(cat.id) || [];
      const matchSub = subs.some(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.slug.toLowerCase().includes(q) ||
          s.description?.toLowerCase().includes(q)
      );

      return matchCat || matchSub;
    });
  }, [rootCategories, subcategoriesMap, search]);

  return (
    <div className="space-y-8">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-6 right-6 z-50 bg-[#4A0612] text-[#FCEDEA] px-4 py-2.5 rounded-sm shadow-xl flex items-center gap-2 text-xs font-sans animate-in slide-in-from-top duration-200">
          <CheckCircle2 className="w-4 h-4 text-[#25D366]" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#4A0612]/10">
        <div>
          <div className="flex items-center gap-2 text-[#6B1F2E] text-xs font-sans font-medium uppercase tracking-widest mb-1">
            <FolderTree className="w-4 h-4" />
            <span>Catalogue Taxonomy</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl text-[#1E1A1A] font-normal tracking-tight">
            Categories & Subcategories
          </h1>
          <p className="font-sans text-xs text-[#1E1A1A]/60 mt-1 max-w-2xl">
            Organize your jewellery into primary families (Earrings, Necklaces, Rings) and refined subcategories (e.g. Chandbalis, Jhumkas, Studs, Danglers). Changes reflect dynamically in the admin editor and the storefront shop.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              restoreDefaultVariety();
              setToastMsg("Catalogue refreshed! 20 designs loaded with full multi-item Jhumka varieties.");
              setTimeout(() => setToastMsg(""), 3500);
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 bg-[#FBF6EE] hover:bg-[#6B1F2E] hover:text-[#FCEDEA] text-[#6B1F2E] border border-[#6B1F2E]/30 text-xs font-semibold uppercase tracking-wider rounded-sm transition-colors shadow-2xs"
            title="Restore rich multi-item variety for all subcategories"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Sync Variety Catalogue</span>
          </button>

          <button
            onClick={() => handleOpenAdd()}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#4A0612] hover:bg-[#6B1F2E] text-[#FCEDEA] text-xs font-semibold uppercase tracking-wider rounded-sm transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Add Category / Subcategory</span>
          </button>
        </div>
      </div>

      {/* High-Level Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 font-sans">
        <div className="bg-white p-4 rounded-sm border border-[#4A0612]/10 shadow-xs">
          <span className="text-[10px] uppercase tracking-wider text-[#1E1A1A]/50 block font-medium">
            Main Categories
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-display text-[#1E1A1A]">
              {rootCategories.length}
            </span>
            <span className="text-[11px] text-[#6B1F2E]">Primary families</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-sm border border-[#4A0612]/10 shadow-xs">
          <span className="text-[10px] uppercase tracking-wider text-[#1E1A1A]/50 block font-medium">
            Total Subcategories
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-display text-[#1E1A1A]">
              {totalSubcategories}
            </span>
            <span className="text-[11px] text-[#6B1F2E]">Refined styles</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-sm border border-[#4A0612]/10 shadow-xs">
          <span className="text-[10px] uppercase tracking-wider text-[#1E1A1A]/50 block font-medium">
            Earring Subcategories
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-display text-[#6B1F2E]">
              {earringSubcategories.length}
            </span>
            <span className="text-[11px] text-[#1E1A1A]/60">Chandbalis, Jhumkas...</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-sm border border-[#4A0612]/10 shadow-xs">
          <span className="text-[10px] uppercase tracking-wider text-[#1E1A1A]/50 block font-medium">
            Live Designs Tagged
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-display text-[#1E1A1A]">
              {products.length}
            </span>
            <span className="text-[11px] text-emerald-700">In Catalogue</span>
          </div>
        </div>
      </div>

      {/* Search Toolbar */}
      <div className="flex items-center justify-between gap-4 bg-white p-3.5 rounded-sm border border-[#4A0612]/10">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search categories (e.g. Earrings, Chandbalis, Jhumkas)..."
            className="w-full pl-9 pr-3.5 py-2 bg-[#FBF6EE]/40 border border-[#4A0612]/15 rounded-sm text-xs font-sans focus:outline-none focus:border-[#6B1F2E]"
          />
          <Search className="w-4 h-4 text-[#1E1A1A]/40 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#1E1A1A]/40 hover:text-[#1E1A1A]"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs font-sans text-[#1E1A1A]/60">
          <span>Viewing {filteredRootCategories.length} categories</span>
        </div>
      </div>

      {/* Main Hierarchy Listing */}
      <div className="space-y-6">
        {filteredRootCategories.map((parentCat) => {
          const subs = subcategoriesMap.get(parentCat.id) || [];
          const parentProductCount = counts.catCount[parentCat.slug.toLowerCase()] || 0;

          return (
            <div
              key={parentCat.id}
              className="bg-white rounded-sm border border-[#4A0612]/15 shadow-xs overflow-hidden transition-all duration-200"
            >
              {/* Category Header Card */}
              <div className="p-4 sm:p-5 bg-gradient-to-r from-[#FBF6EE] to-white border-b border-[#4A0612]/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start sm:items-center gap-3.5">
                  <div className="w-10 h-10 rounded-sm bg-[#4A0612]/10 border border-[#4A0612]/15 flex items-center justify-center text-[#6B1F2E] shrink-0 font-display text-lg font-medium">
                    {parentCat.name.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="font-display text-xl text-[#1E1A1A]">
                        {parentCat.name}
                      </h2>
                      <span className="text-[10px] font-mono px-2 py-0.5 bg-[#4A0612]/5 text-[#6B1F2E] rounded-xs font-medium">
                        /shop?category={parentCat.slug}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 bg-[#4A0612] text-[#FCEDEA] rounded-full font-semibold">
                        {parentProductCount} {parentProductCount === 1 ? "design" : "designs"}
                      </span>
                    </div>
                    {parentCat.description && (
                      <p className="text-xs font-sans text-[#1E1A1A]/60 mt-0.5">
                        {parentCat.description}
                      </p>
                    )}
                  </div>
                </div>

                {/* Parent Action Buttons */}
                <div className="flex items-center gap-2 self-end sm:self-center">
                  <Link
                    href={`/shop?category=${parentCat.slug}`}
                    target="_blank"
                    className="touch-target px-2.5 py-1.5 text-xs text-[#1E1A1A]/70 hover:text-[#6B1F2E] flex items-center gap-1 font-sans"
                    title="View on store"
                  >
                    <span>View Store</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>

                  <button
                    onClick={() => handleOpenAdd(parentCat.id)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#FBF6EE] hover:bg-[#6B1F2E] hover:text-[#FCEDEA] text-[#6B1F2E] border border-[#6B1F2E]/30 text-xs font-sans font-medium rounded-xs transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Subcategory</span>
                  </button>

                  <button
                    onClick={() => handleOpenEdit(parentCat)}
                    className="p-1.5 text-[#1E1A1A]/60 hover:text-[#6B1F2E] rounded-xs"
                    aria-label={`Edit ${parentCat.name}`}
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => {
                      if (
                        confirm(
                          `Delete "${parentCat.name}" and all of its ${subs.length} subcategories?`
                        )
                      ) {
                        deleteCategory(parentCat.id);
                        setToastMsg(`Deleted category "${parentCat.name}"`);
                        setTimeout(() => setToastMsg(""), 2500);
                      }
                    }}
                    className="p-1.5 text-red-500 hover:text-red-700 rounded-xs"
                    aria-label={`Delete ${parentCat.name}`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Nested Subcategories Grid */}
              <div className="p-4 sm:p-5">
                <div className="flex items-center justify-between mb-3 font-sans text-xs">
                  <span className="font-semibold uppercase tracking-wider text-[#1E1A1A]/60 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#6B1F2E]" />
                    <span>Subcategories ({subs.length})</span>
                  </span>
                  <span className="text-[11px] text-[#1E1A1A]/40">
                    Customers filter designs by these subcategories in the catalogue
                  </span>
                </div>

                {subs.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {subs.map((sub) => {
                      const subProducts = products.filter((p) => {
                        const cSlug = p.categorySlug?.toLowerCase() || slugify(p.category || "");
                        const sSlug = p.subcategorySlug?.toLowerCase() || slugify(p.subcategory || "");
                        return cSlug === parentCat.slug.toLowerCase() && sSlug === sub.slug.toLowerCase();
                      });
                      const subProductCount = subProducts.length;
                      const isExpanded = expandedSubId === sub.id;

                      return (
                        <div
                          key={sub.id}
                          className="group relative bg-[#FBF6EE]/30 hover:bg-[#FBF6EE]/70 p-4 rounded-sm border border-[#4A0612]/15 hover:border-[#6B1F2E]/35 transition-all flex flex-col justify-between shadow-2xs"
                        >
                          <div>
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <h3 className="font-sans text-sm font-semibold text-[#1E1A1A] group-hover:text-[#6B1F2E] transition-colors flex items-center gap-1.5">
                                  <span>{sub.name}</span>
                                </h3>
                                <span className="font-mono text-[10px] text-[#1E1A1A]/40 block mt-0.5">
                                  slug: {sub.slug}
                                </span>
                              </div>
                              <span
                                className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                                  subProductCount > 0
                                    ? "bg-emerald-100 text-emerald-800"
                                    : "bg-gray-100 text-gray-500"
                                }`}
                              >
                                {subProductCount} {subProductCount === 1 ? "variety" : "varieties"}
                              </span>
                            </div>

                            {sub.description && (
                              <p className="text-[11px] text-[#1E1A1A]/65 font-sans mt-2 line-clamp-2 leading-relaxed">
                                {sub.description}
                              </p>
                            )}

                            {/* Multi-Item Variety Thumbnails Strip */}
                            {subProducts.length > 0 && (
                              <div className="mt-3 pt-2.5 border-t border-[#4A0612]/10">
                                <div className="flex items-center justify-between mb-1.5 text-[10px] font-sans text-[#1E1A1A]/60">
                                  <span className="font-medium">Live designs in this subcategory:</span>
                                  <button
                                    type="button"
                                    onClick={() => setExpandedSubId(isExpanded ? null : sub.id)}
                                    className="text-[#6B1F2E] hover:underline flex items-center gap-0.5 font-medium"
                                  >
                                    <span>{isExpanded ? "Hide" : "View"} ({subProducts.length})</span>
                                    <ChevronDown
                                      className={`w-3 h-3 transition-transform ${
                                        isExpanded ? "rotate-180" : ""
                                      }`}
                                    />
                                  </button>
                                </div>

                                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                                  {subProducts.slice(0, 5).map((item) => (
                                    <div
                                      key={item.id}
                                      title={`${item.name} • ${formatPrice(item.price)}`}
                                      className="relative w-8 h-8 rounded-xs overflow-hidden border border-[#4A0612]/20 shrink-0 bg-white shadow-2xs"
                                    >
                                      <img
                                        src={item.primaryImage}
                                        alt=""
                                        className="w-full h-full object-cover"
                                      />
                                    </div>
                                  ))}
                                  {subProducts.length > 5 && (
                                    <button
                                      type="button"
                                      onClick={() => setExpandedSubId(sub.id)}
                                      className="w-8 h-8 rounded-xs bg-[#4A0612]/5 hover:bg-[#4A0612]/10 border border-[#4A0612]/15 flex items-center justify-center text-[10px] font-semibold text-[#6B1F2E] shrink-0"
                                      title="View more designs in this subcategory"
                                    >
                                      +{subProducts.length - 5}
                                    </button>
                                  )}
                                </div>
                              </div>
                            )}

                            {/* Expanded items list drawer */}
                            {isExpanded && subProducts.length > 0 && (
                              <div className="mt-3 space-y-1.5 max-h-44 overflow-y-auto pr-1 animate-in fade-in duration-150">
                                {subProducts.map((p) => (
                                  <div
                                    key={p.id}
                                    className="flex items-center justify-between p-1.5 bg-white rounded-xs border border-[#4A0612]/10 text-[11px] font-sans"
                                  >
                                    <div className="flex items-center gap-2 truncate">
                                      <img
                                        src={p.primaryImage}
                                        alt=""
                                        className="w-6 h-6 object-cover rounded-xs border border-[#4A0612]/10 shrink-0"
                                      />
                                      <span className="truncate text-[#1E1A1A] font-medium">
                                        {p.name}
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-2 shrink-0">
                                      <span className="font-mono text-[#6B1F2E] font-semibold text-[10px]">
                                        {formatPrice(p.price)}
                                      </span>
                                      <Link
                                        href={`/admin/products?category=${parentCat.slug}&subcategory=${sub.slug}`}
                                        className="text-[10px] text-[#1E1A1A]/50 hover:text-[#6B1F2E]"
                                      >
                                        Edit
                                      </Link>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* Action Buttons Row */}
                          <div className="mt-3.5 pt-2.5 border-t border-[#4A0612]/10 flex flex-wrap items-center justify-between gap-2 font-sans text-xs">
                            <div className="flex items-center gap-1.5">
                              <Link
                                href={`/admin/products?category=${parentCat.slug}&subcategory=${sub.slug}&new=true`}
                                className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#4A0612] text-[#FCEDEA] hover:bg-[#6B1F2E] rounded-xs text-[11px] font-semibold uppercase tracking-wider transition-colors shadow-2xs"
                                title={`Add a new design specifically inside ${sub.name}`}
                              >
                                <Plus className="w-3 h-3" />
                                <span>Add {sub.name} Variety</span>
                              </Link>

                              <Link
                                href={`/admin/products?category=${parentCat.slug}&subcategory=${sub.slug}`}
                                className="px-2 py-1 bg-white hover:bg-[#FBF6EE] text-[#1E1A1A]/80 border border-[#4A0612]/15 rounded-xs text-[11px] font-medium"
                                title={`Manage all ${sub.name} designs in Products table`}
                              >
                                Manage ({subProductCount})
                              </Link>
                            </div>

                            <div className="flex items-center gap-1">
                              <Link
                                href={`/shop?category=${parentCat.slug}&subcategory=${sub.slug}`}
                                target="_blank"
                                className="p-1 text-[#6B1F2E] hover:text-[#4A0612]"
                                title="View storefront filter"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                              </Link>
                              <button
                                onClick={() => handleOpenEdit(sub)}
                                className="p-1 text-[#1E1A1A]/60 hover:text-[#6B1F2E]"
                                title="Edit subcategory name or slug"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => {
                                  if (confirm(`Delete subcategory "${sub.name}"?`)) {
                                    deleteCategory(sub.id);
                                    setToastMsg(`Deleted subcategory "${sub.name}"`);
                                    setTimeout(() => setToastMsg(""), 2500);
                                  }
                                }}
                                className="p-1 text-red-500 hover:text-red-700"
                                title="Delete subcategory"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-6 border border-dashed border-[#4A0612]/15 rounded-sm p-4">
                    <p className="text-xs text-[#1E1A1A]/60 font-sans">
                      No subcategories added to {parentCat.name} yet.
                    </p>
                    <button
                      onClick={() => handleOpenAdd(parentCat.id)}
                      className="mt-2 text-xs text-[#6B1F2E] font-semibold uppercase tracking-wider hover:underline"
                    >
                      + Add first subcategory
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Category & Subcategory Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/45 backdrop-blur-xs"
            onClick={() => setModalOpen(false)}
          />

          <div className="relative w-full max-w-lg bg-white rounded-sm shadow-2xl p-6 z-10 border border-[#4A0612]/10 animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#4A0612]/10 mb-5">
              <div>
                <h2 className="font-display text-2xl text-[#1E1A1A]">
                  {editingCategory
                    ? `Edit ${editingCategory.name}`
                    : formLevel === "sub"
                    ? "Add Subcategory"
                    : "Add New Category"}
                </h2>
                <p className="text-[11px] font-sans text-[#1E1A1A]/60">
                  Subcategories help customers easily discover specific styles like Chandbalis, Jhumkas, or Chokers.
                </p>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 text-[#1E1A1A]/60 hover:text-[#1E1A1A]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4 font-sans text-xs">
              {/* Category Level Selector (Only when adding new) */}
              {!editingCategory && (
                <div>
                  <label className="block text-xs font-semibold text-[#1E1A1A] mb-1.5">
                    Category Hierarchy Level
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setFormLevel("sub")}
                      className={`py-2 px-3 text-xs font-semibold rounded-xs border text-center transition-all ${
                        formLevel === "sub"
                          ? "bg-[#4A0612] text-[#FCEDEA] border-[#4A0612]"
                          : "bg-[#FBF6EE]/40 text-[#1E1A1A]/70 border-[#4A0612]/20 hover:bg-[#FBF6EE]"
                      }`}
                    >
                      Subcategory (e.g. Chandbalis)
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormLevel("root")}
                      className={`py-2 px-3 text-xs font-semibold rounded-xs border text-center transition-all ${
                        formLevel === "root"
                          ? "bg-[#4A0612] text-[#FCEDEA] border-[#4A0612]"
                          : "bg-[#FBF6EE]/40 text-[#1E1A1A]/70 border-[#4A0612]/20 hover:bg-[#FBF6EE]"
                      }`}
                    >
                      Main Category (e.g. Earrings)
                    </button>
                  </div>
                </div>
              )}

              {/* Parent Category Dropdown (if Subcategory) */}
              {formLevel === "sub" && (
                <div>
                  <label className="block text-xs font-semibold text-[#1E1A1A] mb-1">
                    Parent Category *
                  </label>
                  <select
                    value={selectedParentId}
                    onChange={(e) => setSelectedParentId(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 bg-[#FBF6EE]/40 border border-[#4A0612]/20 rounded-sm text-xs font-sans focus:outline-none focus:border-[#6B1F2E]"
                  >
                    <option value="" disabled>
                      Select Parent Category
                    </option>
                    {rootCategories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} (/{c.slug})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Name */}
              <div>
                <label className="block text-xs font-semibold text-[#1E1A1A] mb-1">
                  {formLevel === "sub" ? "Subcategory Name *" : "Category Name *"}
                </label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder={
                    formLevel === "sub"
                      ? "e.g. Chandbalis, Jhumkas, Studs, Danglers..."
                      : "e.g. Earrings, Necklaces, Rings, Bangles..."
                  }
                  className="w-full px-3.5 py-2.5 bg-[#FBF6EE]/40 border border-[#4A0612]/20 rounded-sm text-xs font-sans focus:outline-none focus:border-[#6B1F2E]"
                />
              </div>

              {/* Slug */}
              <div>
                <label className="block text-xs font-semibold text-[#1E1A1A] mb-1">
                  URL Slug *
                </label>
                <div className="flex items-center">
                  <span className="px-3 py-2.5 bg-[#FBF6EE] border border-r-0 border-[#4A0612]/20 rounded-l-sm text-[11px] text-[#1E1A1A]/50 font-mono">
                    {formLevel === "sub" ? "?subcategory=" : "/"}
                  </span>
                  <input
                    type="text"
                    required
                    value={formSlug}
                    onChange={(e) => setFormSlug(slugify(e.target.value))}
                    className="flex-1 px-3 py-2.5 bg-[#FBF6EE]/40 border border-[#4A0612]/20 rounded-r-sm text-xs font-mono focus:outline-none focus:border-[#6B1F2E]"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-[#1E1A1A] mb-1">
                  Description (Optional)
                </label>
                <textarea
                  rows={2}
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  placeholder="e.g. Crescent-shaped royal earrings adorned with meenakari and pearls."
                  className="w-full px-3.5 py-2.5 bg-[#FBF6EE]/40 border border-[#4A0612]/20 rounded-sm text-xs font-sans focus:outline-none focus:border-[#6B1F2E]"
                />
              </div>

              {/* Image URL */}
              <div>
                <label className="block text-xs font-semibold text-[#1E1A1A] mb-1">
                  Representative Photo URL (Optional)
                </label>
                <input
                  type="text"
                  value={formImage}
                  onChange={(e) => setFormImage(e.target.value)}
                  placeholder="/images/product-1-a.jpg"
                  className="w-full px-3.5 py-2.5 bg-[#FBF6EE]/40 border border-[#4A0612]/20 rounded-sm text-xs font-sans focus:outline-none focus:border-[#6B1F2E]"
                />
              </div>

              {/* Modal Actions */}
              <div className="pt-4 border-t border-[#4A0612]/10 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2.5 border border-[#4A0612]/20 rounded-sm text-xs font-medium text-[#1E1A1A]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#4A0612] hover:bg-[#6B1F2E] text-[#FCEDEA] text-xs font-semibold uppercase tracking-wider rounded-sm transition-colors shadow-xs"
                >
                  {editingCategory ? "Save Changes" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
