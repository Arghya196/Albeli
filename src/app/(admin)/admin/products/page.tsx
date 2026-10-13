"use client";

import { useState } from "react";
import {
  Plus,
  Trash2,
  Edit2,
  Copy,
  Search,
  SlidersHorizontal,
  X,
  Package,
  Image as ImageIcon,
  Check,
} from "lucide-react";
import { useAdminStore } from "@/lib/store/adminStore";
import { formatPrice, slugify } from "@/lib/utils";
import type { PlaceholderProduct } from "@/lib/placeholder-data";

export default function AdminProductsPage() {
  const { products, addProduct, updateProduct, deleteProduct, deleteAllPlaceholders } = useAdminStore();

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<PlaceholderProduct | null>(null);
  const [formStep, setFormStep] = useState<1 | 2 | 3>(1);

  // Form State for Add / Edit
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    category: "Earrings",
    categorySlug: "earrings",
    price: 1999,
    compareAtPrice: 2499,
    stock: 5,
    sku: "ALB-NEW-01",
    description: "",
    materialsCare: "Brass base with 22k antique gold plating.",
    shippingInfo: "Dispatches within 24-48 hours from Delhi.",
    primaryImage: "/images/product-1-a.jpg",
    secondaryImage: "/images/product-1-b.jpg",
    videoUrl: "",
    badges: ["new_arrival"] as ("best_seller" | "new_arrival" | "sale")[],
    outfitPairings: ["Saree", "Kurta Set"],
  });

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setFormData({
      name: "",
      slug: "",
      category: "Earrings",
      categorySlug: "earrings",
      price: 1999,
      compareAtPrice: 2499,
      stock: 5,
      sku: `ALB-${Date.now().toString().slice(-4)}`,
      description: "Handcrafted in Delhi with royal motifs.",
      materialsCare: "Brass base with 22k antique gold plating. Store in airtight pouch.",
      shippingInfo: "Dispatches within 24-48 hours from Delhi.",
      primaryImage: "/images/product-1-a.jpg",
      secondaryImage: "/images/product-1-b.jpg",
      videoUrl: "",
      badges: ["new_arrival"],
      outfitPairings: ["Festive Kurta", "Saree"],
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (p: PlaceholderProduct) => {
    setEditingProduct(p);
    setFormData({
      name: p.name,
      slug: p.slug,
      category: p.category,
      categorySlug: p.categorySlug,
      price: p.price / 100,
      compareAtPrice: p.compareAtPrice ? p.compareAtPrice / 100 : 0,
      stock: p.stock,
      sku: p.sku,
      description: p.description,
      materialsCare: p.materialsCare,
      shippingInfo: p.shippingInfo,
      primaryImage: p.primaryImage,
      secondaryImage: p.secondaryImage,
      videoUrl: p.videoUrl || "",
      badges: p.badges,
      outfitPairings: p.outfitPairings,
    });
    setModalOpen(true);
  };

  const handleDuplicate = (p: PlaceholderProduct) => {
    addProduct({
      name: `${p.name} (Copy)`,
      slug: `${p.slug}-copy-${Date.now().toString().slice(-3)}`,
      category: p.category,
      categorySlug: p.categorySlug,
      price: p.price,
      compareAtPrice: p.compareAtPrice,
      stock: p.stock,
      sku: `${p.sku}-CP`,
      description: p.description,
      materialsCare: p.materialsCare,
      shippingInfo: p.shippingInfo,
      primaryImage: p.primaryImage,
      secondaryImage: p.secondaryImage,
      videoUrl: p.videoUrl,
      badges: p.badges,
      outfitPairings: p.outfitPairings,
      isPlaceholder: false,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const priceInPaise = Math.round(Number(formData.price) * 100);
    const compareAtInPaise = formData.compareAtPrice ? Math.round(Number(formData.compareAtPrice) * 100) : null;
    const autoSlug = formData.slug ? slugify(formData.slug) : slugify(formData.name);

    if (editingProduct) {
      updateProduct(editingProduct.id, {
        name: formData.name,
        slug: autoSlug,
        category: formData.category,
        categorySlug: slugify(formData.category),
        price: priceInPaise,
        compareAtPrice: compareAtInPaise,
        stock: Number(formData.stock),
        sku: formData.sku,
        description: formData.description,
        materialsCare: formData.materialsCare,
        shippingInfo: formData.shippingInfo,
        primaryImage: formData.primaryImage,
        secondaryImage: formData.secondaryImage,
        videoUrl: formData.videoUrl || undefined,
        badges: formData.badges,
        outfitPairings: formData.outfitPairings,
      });
    } else {
      addProduct({
        name: formData.name,
        slug: autoSlug,
        category: formData.category,
        categorySlug: slugify(formData.category),
        price: priceInPaise,
        compareAtPrice: compareAtInPaise,
        stock: Number(formData.stock),
        sku: formData.sku,
        description: formData.description,
        materialsCare: formData.materialsCare,
        shippingInfo: formData.shippingInfo,
        primaryImage: formData.primaryImage,
        secondaryImage: formData.secondaryImage,
        videoUrl: formData.videoUrl || undefined,
        badges: formData.badges,
        outfitPairings: formData.outfitPairings,
        isPlaceholder: false,
      });
    }

    setModalOpen(false);
  };

  // Filter products by search and category
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || p.categorySlug === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-baseline justify-between gap-4 pb-6 border-b border-[#4A0612]/10">
        <div>
          <h1 className="font-display text-3xl text-[#1E1A1A] font-normal tracking-tight">
            Jewellery Designs ({products.length})
          </h1>
          <p className="font-sans text-xs text-[#1E1A1A]/60 mt-1">
            Add, update prices, manage stock, and organize collections.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#4A0612] hover:bg-[#6B1F2E] text-[#FCEDEA] text-xs font-semibold uppercase tracking-wider rounded-sm transition-colors shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Design</span>
        </button>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-sm border border-[#4A0612]/10">
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title or SKU..."
            className="w-full pl-9 pr-3.5 py-2 bg-[#FBF6EE]/40 border border-[#4A0612]/15 rounded-sm text-xs font-sans focus:outline-none focus:border-[#6B1F2E]"
          />
          <Search className="w-4 h-4 text-[#1E1A1A]/40 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 bg-[#FBF6EE]/40 border border-[#4A0612]/15 rounded-sm text-xs font-sans text-[#1E1A1A] focus:outline-none focus:border-[#6B1F2E]"
          >
            <option value="all">All Categories</option>
            <option value="earrings">Earrings</option>
            <option value="necklaces">Necklaces</option>
            <option value="rings">Rings</option>
          </select>
        </div>
      </div>

      {/* Mobile Cards List (sm:hidden) */}
      <div className="block sm:hidden space-y-3">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((p) => (
            <div
              key={p.id}
              className="bg-white p-3.5 rounded-sm border border-[#4A0612]/10 shadow-xs flex flex-col gap-3"
            >
              <div className="flex items-center gap-3">
                <img
                  src={p.primaryImage}
                  alt=""
                  className="w-14 h-14 object-cover rounded-sm border border-[#4A0612]/10 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-[#1E1A1A]/50 uppercase tracking-wider font-mono">
                      {p.sku}
                    </span>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        p.stock <= 3
                          ? "bg-red-100 text-red-700"
                          : "bg-emerald-100 text-emerald-800"
                      }`}
                    >
                      {p.stock} units
                    </span>
                  </div>
                  <h3 className="font-display text-base text-[#1E1A1A] truncate font-medium mt-0.5">
                    {p.name}
                  </h3>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-xs font-semibold text-[#1E1A1A]">
                      {formatPrice(p.price)}
                    </span>
                    {p.compareAtPrice && (
                      <span className="text-[10px] text-[#1E1A1A]/40 line-through">
                        {formatPrice(p.compareAtPrice)}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-[#4A0612]/5 flex items-center justify-between">
                <span className="text-[11px] text-[#1E1A1A]/60 font-sans">
                  {p.category}
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleOpenEdit(p)}
                    className="touch-target px-3 py-1.5 bg-[#FBF6EE] hover:bg-[#4A0612]/10 text-xs font-medium rounded-xs flex items-center gap-1 text-[#6B1F2E]"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => handleDuplicate(p)}
                    aria-label="Duplicate design"
                    className="touch-target p-2 text-[#1E1A1A]/60 hover:text-[#1E1A1A]"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Delete ${p.name}?`)) deleteProduct(p.id);
                    }}
                    aria-label="Delete design"
                    className="touch-target p-2 text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-10 bg-white rounded-sm border border-[#4A0612]/10 p-4">
            <p className="text-xs text-[#1E1A1A]/60">No designs match your search.</p>
          </div>
        )}
      </div>

      {/* Desktop Products Table (hidden sm:block) */}
      <div className="hidden sm:block bg-white rounded-sm border border-[#4A0612]/10 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs font-sans">
            <thead>
              <tr className="bg-[#FBF6EE] border-b border-[#4A0612]/10 text-[11px] uppercase tracking-wider text-[#1E1A1A]/60">
                <th className="py-3.5 px-4 font-semibold">Design</th>
                <th className="py-3.5 px-4 font-semibold">SKU</th>
                <th className="py-3.5 px-4 font-semibold">Category</th>
                <th className="py-3.5 px-4 font-semibold">Price</th>
                <th className="py-3.5 px-4 font-semibold">Stock</th>
                <th className="py-3.5 px-4 font-semibold">Badges</th>
                <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#4A0612]/5">
              {filteredProducts.map((p) => (
                <tr key={p.id} className="hover:bg-[#FBF6EE]/40 transition-colors">
                  {/* Photo & Name */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={p.primaryImage}
                        alt=""
                        className="w-10 h-10 object-cover rounded-xs border border-[#4A0612]/10 shrink-0"
                      />
                      <div>
                        <span className="font-medium text-[#1E1A1A] block leading-snug">
                          {p.name}
                        </span>
                        {p.isPlaceholder && (
                          <span className="text-[9px] uppercase tracking-widest font-bold text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded-xs">
                            Demo
                          </span>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* SKU */}
                  <td className="py-3 px-4 font-mono text-[11px] text-[#1E1A1A]/60">
                    {p.sku}
                  </td>

                  {/* Category */}
                  <td className="py-3 px-4 text-[#1E1A1A]/80">
                    {p.category}
                  </td>

                  {/* Price */}
                  <td className="py-3 px-4">
                    <span className="font-medium text-[#1E1A1A]">
                      {formatPrice(p.price)}
                    </span>
                    {p.compareAtPrice && (
                      <span className="text-[10px] text-[#1E1A1A]/40 line-through block">
                        {formatPrice(p.compareAtPrice)}
                      </span>
                    )}
                  </td>

                  {/* Stock */}
                  <td className="py-3 px-4">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        p.stock <= 3
                          ? "bg-red-100 text-red-700"
                          : "bg-emerald-100 text-emerald-800"
                      }`}
                    >
                      {p.stock} units
                    </span>
                  </td>

                  {/* Badges */}
                  <td className="py-3 px-4">
                    <div className="flex flex-wrap gap-1">
                      {p.badges.map((b) => (
                        <span
                          key={b}
                          className="px-1.5 py-0.5 bg-[#4A0612]/5 text-[#6B1F2E] text-[9px] font-medium rounded-xs uppercase tracking-wider"
                        >
                          {b.replace("_", " ")}
                        </span>
                      ))}
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-4 text-right">
                    <div className="inline-flex items-center gap-2">
                      <button
                        onClick={() => handleOpenEdit(p)}
                        aria-label="Edit design"
                        className="p-1.5 text-[#1E1A1A]/60 hover:text-[#6B1F2E] hover:bg-[#FBF6EE] rounded-sm transition-colors"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDuplicate(p)}
                        aria-label="Duplicate design"
                        className="p-1.5 text-[#1E1A1A]/60 hover:text-[#1E1A1A] hover:bg-[#FBF6EE] rounded-sm transition-colors"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Delete ${p.name}?`)) deleteProduct(p.id);
                        }}
                        aria-label="Delete design"
                        className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-sm transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal Drawer */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs"
            onClick={() => setModalOpen(false)}
          />
          <div className="relative w-full max-w-2xl bg-white rounded-sm shadow-2xl p-5 sm:p-8 max-h-[90vh] overflow-y-auto z-10 border border-[#4A0612]/10">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#4A0612]/10 mb-4">
              <div>
                <h2 className="font-display text-2xl text-[#1E1A1A]">
                  {editingProduct ? "Edit Jewellery Design" : "Add New Design"}
                </h2>
                <p className="text-[11px] font-sans text-[#1E1A1A]/60">
                  Step {formStep} of 3 • {formStep === 1 ? "Photos & Angles" : formStep === 2 ? "Name, Category & Pricing" : "Stock, Care & Publishing"}
                </p>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="touch-target p-1 text-[#1E1A1A]/60 hover:text-[#1E1A1A]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Step Progress Indicators */}
            <div className="grid grid-cols-3 gap-2 mb-6">
              <button
                type="button"
                onClick={() => setFormStep(1)}
                className={`py-2 text-[10px] sm:text-xs uppercase font-sans font-semibold rounded-xs border transition-colors ${
                  formStep === 1
                    ? "bg-[#4A0612] text-[#FCEDEA] border-[#4A0612]"
                    : "bg-[#FBF6EE] text-[#1E1A1A]/70 border-[#4A0612]/15"
                }`}
              >
                1. Photos
              </button>
              <button
                type="button"
                onClick={() => setFormStep(2)}
                className={`py-2 text-[10px] sm:text-xs uppercase font-sans font-semibold rounded-xs border transition-colors ${
                  formStep === 2
                    ? "bg-[#4A0612] text-[#FCEDEA] border-[#4A0612]"
                    : "bg-[#FBF6EE] text-[#1E1A1A]/70 border-[#4A0612]/15"
                }`}
              >
                2. Essentials & Price
              </button>
              <button
                type="button"
                onClick={() => setFormStep(3)}
                className={`py-2 text-[10px] sm:text-xs uppercase font-sans font-semibold rounded-xs border transition-colors ${
                  formStep === 3
                    ? "bg-[#4A0612] text-[#FCEDEA] border-[#4A0612]"
                    : "bg-[#FBF6EE] text-[#1E1A1A]/70 border-[#4A0612]/15"
                }`}
              >
                3. Stock & Details
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* STEP 1: Photos */}
              {formStep === 1 && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#1E1A1A] mb-1 font-sans">
                        Primary Photo URL *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.primaryImage}
                        onChange={(e) => setFormData({ ...formData, primaryImage: e.target.value })}
                        className="w-full px-3.5 py-3 bg-[#FBF6EE]/40 border border-[#4A0612]/20 rounded-sm text-xs font-sans focus:outline-none focus:border-[#6B1F2E]"
                      />
                      {formData.primaryImage && (
                        <div className="mt-2 aspect-[4/5] max-h-48 rounded-xs overflow-hidden border border-[#4A0612]/10 bg-[#FBF6EE]">
                          <img src={formData.primaryImage} alt="" className="w-full h-full object-cover" />
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#1E1A1A] mb-1 font-sans">
                        Secondary / Hover Photo URL
                      </label>
                      <input
                        type="text"
                        value={formData.secondaryImage}
                        onChange={(e) => setFormData({ ...formData, secondaryImage: e.target.value })}
                        className="w-full px-3.5 py-3 bg-[#FBF6EE]/40 border border-[#4A0612]/20 rounded-sm text-xs font-sans focus:outline-none focus:border-[#6B1F2E]"
                      />
                      {formData.secondaryImage && (
                        <div className="mt-2 aspect-[4/5] max-h-48 rounded-xs overflow-hidden border border-[#4A0612]/10 bg-[#FBF6EE]">
                          <img src={formData.secondaryImage} alt="" className="w-full h-full object-cover" />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Product Video Reel URL */}
                  <div className="pt-2">
                    <label className="block text-xs font-semibold text-[#1E1A1A] mb-1 font-sans flex items-center justify-between">
                      <span>Product Video Reel URL (Optional)</span>
                      <span className="text-[10px] text-[#6B1F2E] font-mono">MP4 Video Link</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. https://.../jewellery-reel.mp4"
                      value={formData.videoUrl || ""}
                      onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                      className="w-full px-3.5 py-3 bg-[#FBF6EE]/40 border border-[#4A0612]/20 rounded-sm text-xs font-sans focus:outline-none focus:border-[#6B1F2E]"
                    />
                    <span className="text-[10px] text-[#1E1A1A]/50 mt-1 block font-sans">
                      Add a 360° reel or artisan video to showcase the piece in motion on the product page.
                    </span>

                    {formData.videoUrl && (
                      <div className="mt-2 aspect-[16/9] max-h-48 rounded-xs overflow-hidden border border-[#4A0612]/15 bg-black flex items-center justify-center">
                        <video src={formData.videoUrl} controls className="w-full h-full object-contain" />
                      </div>
                    )}
                  </div>

                  <div className="pt-4 border-t border-[#4A0612]/10 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setModalOpen(false)}
                      className="px-4 py-3 border border-[#4A0612]/20 text-xs font-sans font-medium rounded-sm text-[#1E1A1A]"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormStep(2)}
                      className="px-6 py-3 bg-[#4A0612] text-[#FCEDEA] text-xs font-semibold uppercase tracking-wider rounded-sm shadow-xs"
                    >
                      Continue to Details →
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: Name, Category & Price */}
              {formStep === 2 && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-[#1E1A1A] mb-1 font-sans">
                        Design Title *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Mayura Peacock Chandbali"
                        className="w-full px-3.5 py-3 bg-[#FBF6EE]/40 border border-[#4A0612]/20 rounded-sm text-xs font-sans focus:outline-none focus:border-[#6B1F2E]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#1E1A1A] mb-1 font-sans">
                        SKU Code *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.sku}
                        onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                        className="w-full px-3.5 py-3 bg-[#FBF6EE]/40 border border-[#4A0612]/20 rounded-sm text-xs font-sans focus:outline-none focus:border-[#6B1F2E]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#1E1A1A] mb-1 font-sans">
                        Category *
                      </label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-3.5 py-3 bg-[#FBF6EE]/40 border border-[#4A0612]/20 rounded-sm text-xs font-sans focus:outline-none focus:border-[#6B1F2E]"
                      >
                        <option value="Earrings">Earrings</option>
                        <option value="Necklaces">Necklaces</option>
                        <option value="Rings">Rings</option>
                        <option value="Chokers">Chokers</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#1E1A1A] mb-1 font-sans">
                        Price (₹ INR) *
                      </label>
                      <input
                        type="number"
                        required
                        min="1"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                        className="w-full px-3.5 py-3 bg-[#FBF6EE]/40 border border-[#4A0612]/20 rounded-sm text-xs font-sans focus:outline-none focus:border-[#6B1F2E]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#1E1A1A] mb-1 font-sans">
                      Compare-at MRP (₹ INR Strikethrough)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.compareAtPrice}
                      onChange={(e) => setFormData({ ...formData, compareAtPrice: Number(e.target.value) })}
                      className="w-full px-3.5 py-3 bg-[#FBF6EE]/40 border border-[#4A0612]/20 rounded-sm text-xs font-sans focus:outline-none focus:border-[#6B1F2E]"
                    />
                  </div>

                  <div className="pt-4 border-t border-[#4A0612]/10 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setFormStep(1)}
                      className="px-4 py-3 border border-[#4A0612]/20 text-xs font-sans font-medium rounded-sm text-[#1E1A1A]"
                    >
                      ← Back to Photos
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormStep(3)}
                      className="px-6 py-3 bg-[#4A0612] text-[#FCEDEA] text-xs font-semibold uppercase tracking-wider rounded-sm shadow-xs"
                    >
                      Continue to Details →
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: Stock, Details & Publish */}
              {formStep === 3 && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div>
                    <label className="block text-xs font-semibold text-[#1E1A1A] mb-1 font-sans">
                      Available Stock (Units)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.stock}
                      onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                      className="w-full px-3.5 py-3 bg-[#FBF6EE]/40 border border-[#4A0612]/20 rounded-sm text-xs font-sans focus:outline-none focus:border-[#6B1F2E]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#1E1A1A] mb-1 font-sans">
                      Description & Craft Details
                    </label>
                    <textarea
                      rows={3}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-[#FBF6EE]/40 border border-[#4A0612]/20 rounded-sm text-xs font-sans focus:outline-none focus:border-[#6B1F2E]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#1E1A1A] mb-1 font-sans">
                      Materials & Care Guide
                    </label>
                    <input
                      type="text"
                      value={formData.materialsCare}
                      onChange={(e) => setFormData({ ...formData, materialsCare: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-[#FBF6EE]/40 border border-[#4A0612]/20 rounded-sm text-xs font-sans focus:outline-none focus:border-[#6B1F2E]"
                    />
                  </div>

                  <div className="pt-4 border-t border-[#4A0612]/10 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setFormStep(2)}
                      className="px-4 py-3 border border-[#4A0612]/20 text-xs font-sans font-medium rounded-sm text-[#1E1A1A]"
                    >
                      ← Back
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-3 bg-[#4A0612] hover:bg-[#6B1F2E] text-[#FCEDEA] text-xs font-semibold uppercase tracking-wider rounded-sm transition-colors shadow-sm"
                    >
                      {editingProduct ? "Publish Changes" : "Publish Design ✨"}
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
