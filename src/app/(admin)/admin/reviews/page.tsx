"use client";

import { useState } from "react";
import {
  Star,
  Trash2,
  Eye,
  EyeOff,
  Plus,
  CheckCircle2,
  MapPin,
  MessageSquare,
} from "lucide-react";
import { useAdminStore, type AdminReview } from "@/lib/store/adminStore";

export default function AdminReviewsPage() {
  const { reviews, addReview, deleteReview, toggleReviewVisibility, settings } = useAdminStore();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    customerName: "",
    location: "",
    rating: 5,
    comment: "",
    productName: "",
    verified: true,
  });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    addReview({ ...form, visible: true });
    setForm({
      customerName: "",
      location: "",
      rating: 5,
      comment: "",
      productName: "",
      verified: true,
    });
    setShowForm(false);
  };

  const visibleCount = reviews.filter((r) => r.visible).length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-baseline justify-between gap-4 pb-6 border-b border-[#4A0612]/10">
        <div>
          <h1 className="font-display text-3xl text-[#1E1A1A] font-normal tracking-tight">
            Customer Reviews
          </h1>
          <p className="font-sans text-xs text-[#1E1A1A]/60 mt-1">
            {visibleCount} visible of {reviews.length} total reviews on the storefront.
            {!settings.reviewsEnabled && (
              <span className="ml-1 text-amber-600 font-medium">
                (Reviews section disabled in Settings)
              </span>
            )}
          </p>
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#4A0612] hover:bg-[#6B1F2E] text-[#FCEDEA] text-xs font-semibold uppercase tracking-wider rounded-sm transition-colors shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{showForm ? "Cancel" : "Add Review"}</span>
        </button>
      </div>

      {/* Add Review Form */}
      {showForm && (
        <form
          onSubmit={handleAdd}
          className="bg-white p-6 rounded-sm border border-[#4A0612]/10 shadow-xs space-y-4"
        >
          <h2 className="font-display text-xl text-[#1E1A1A] pb-3 border-b border-[#4A0612]/10">
            Add New Testimonial
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-sans text-xs">
            <div>
              <label className="block font-medium text-[#1E1A1A] mb-1">Customer Name</label>
              <input
                type="text"
                required
                value={form.customerName}
                onChange={(e) => setForm({ ...form, customerName: e.target.value })}
                placeholder="e.g. Priya Kapoor"
                className="w-full px-3.5 py-2.5 bg-[#FBF6EE]/40 border border-[#4A0612]/20 rounded-sm text-xs focus:outline-none focus:border-[#6B1F2E]"
              />
            </div>

            <div>
              <label className="block font-medium text-[#1E1A1A] mb-1">Location</label>
              <input
                type="text"
                required
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                placeholder="e.g. Mumbai, India"
                className="w-full px-3.5 py-2.5 bg-[#FBF6EE]/40 border border-[#4A0612]/20 rounded-sm text-xs focus:outline-none focus:border-[#6B1F2E]"
              />
            </div>

            <div>
              <label className="block font-medium text-[#1E1A1A] mb-1">Product Name</label>
              <input
                type="text"
                required
                value={form.productName}
                onChange={(e) => setForm({ ...form, productName: e.target.value })}
                placeholder="e.g. Mayura Peacock Chandbali"
                className="w-full px-3.5 py-2.5 bg-[#FBF6EE]/40 border border-[#4A0612]/20 rounded-sm text-xs focus:outline-none focus:border-[#6B1F2E]"
              />
            </div>

            <div>
              <label className="block font-medium text-[#1E1A1A] mb-1">Rating</label>
              <div className="flex items-center gap-1 py-2">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setForm({ ...form, rating: n })}
                    className="p-0.5"
                  >
                    <Star
                      className={`w-5 h-5 transition-colors ${
                        n <= form.rating
                          ? "text-[#B8923A] fill-[#B8923A]"
                          : "text-[#1E1A1A]/20"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="font-sans text-xs">
            <label className="block font-medium text-[#1E1A1A] mb-1">Review Comment</label>
            <textarea
              rows={3}
              required
              value={form.comment}
              onChange={(e) => setForm({ ...form, comment: e.target.value })}
              placeholder="What they said about the jewellery..."
              className="w-full px-3.5 py-2.5 bg-[#FBF6EE]/40 border border-[#4A0612]/20 rounded-sm text-xs focus:outline-none focus:border-[#6B1F2E]"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <label className="flex items-center gap-2 text-xs font-sans text-[#1E1A1A]/70">
              <input
                type="checkbox"
                checked={form.verified}
                onChange={(e) => setForm({ ...form, verified: e.target.checked })}
                className="accent-[#6B1F2E] w-3.5 h-3.5"
              />
              <span>Mark as verified purchase</span>
            </label>

            <button
              type="submit"
              className="px-5 py-2 bg-[#4A0612] hover:bg-[#6B1F2E] text-[#FCEDEA] text-xs font-semibold uppercase tracking-wider rounded-sm transition-colors"
            >
              Save Review
            </button>
          </div>
        </form>
      )}

      {/* Reviews List */}
      <div className="space-y-3">
        {reviews.map((review) => (
          <div
            key={review.id}
            className={`bg-white p-5 rounded-sm border transition-all ${
              review.visible
                ? "border-[#4A0612]/10"
                : "border-amber-200 bg-amber-50/30 opacity-60"
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1.5">
                  <span className="text-xs font-semibold text-[#1E1A1A] font-sans">
                    {review.customerName}
                  </span>
                  <span className="flex items-center gap-0.5 text-[#1E1A1A]/40">
                    <MapPin className="w-3 h-3" />
                    <span className="text-[10px] font-sans">{review.location}</span>
                  </span>
                  {review.verified && (
                    <span className="flex items-center gap-0.5 text-[10px] font-sans text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-full">
                      <CheckCircle2 className="w-3 h-3" />
                      Verified
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-0.5 mb-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${
                        i < review.rating
                          ? "text-[#B8923A] fill-[#B8923A]"
                          : "text-[#1E1A1A]/15"
                      }`}
                    />
                  ))}
                </div>

                <p className="text-xs text-[#1E1A1A]/80 font-sans leading-relaxed mb-2">
                  &quot;{review.comment}&quot;
                </p>

                <span className="text-[10px] text-[#1E1A1A]/50 font-sans flex items-center gap-1">
                  <MessageSquare className="w-3 h-3" />
                  Re: {review.productName}
                </span>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => toggleReviewVisibility(review.id)}
                  className={`p-2 rounded-xs transition-colors ${
                    review.visible
                      ? "text-[#1E1A1A]/50 hover:text-[#6B1F2E]"
                      : "text-amber-500 hover:text-amber-700"
                  }`}
                  title={review.visible ? "Hide from storefront" : "Show on storefront"}
                >
                  {review.visible ? (
                    <Eye className="w-4 h-4" />
                  ) : (
                    <EyeOff className="w-4 h-4" />
                  )}
                </button>

                <button
                  onClick={() => {
                    if (confirm("Delete this review permanently?")) {
                      deleteReview(review.id);
                    }
                  }}
                  className="p-2 text-[#1E1A1A]/40 hover:text-red-600 rounded-xs transition-colors"
                  title="Delete review"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {reviews.length === 0 && (
          <div className="text-center py-16 space-y-2">
            <Star className="w-8 h-8 text-[#1E1A1A]/20 mx-auto" />
            <p className="text-xs text-[#1E1A1A]/50 font-sans">
              No reviews yet. Add your first customer testimonial above.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
