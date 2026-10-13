"use client";

import { useState } from "react";
import { MessageCircle, Mail, MapPin, CheckCircle2, Clock } from "lucide-react";
import { InstagramIcon } from "@/components/ui/icons";
import { siteConfig } from "@/lib/utils";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    designType: "Choker / Necklace",
    budget: "₹1,500 – ₹3,000",
    notes: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const requests = JSON.parse(localStorage.getItem("albeli_custom_requests") || "[]");
      requests.unshift({ ...formData, timestamp: new Date().toISOString() });
      localStorage.setItem("albeli_custom_requests", JSON.stringify(requests));
    } catch {}
    setSubmitted(true);
  };

  const cleanNumber = siteConfig.whatsappNumber.replace(/[^0-9]/g, "");
  const whatsappUrl = `https://wa.me/${cleanNumber}?text=${encodeURIComponent("Namaste Albeli! I'd like to get in touch regarding jewellery ordering.")}`;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      <div className="text-center max-w-xl mx-auto mb-12">
        <span className="font-hindi text-sm text-[#6B1F2E] block mb-1">
          संपर्क करें
        </span>
        <h1 className="font-display text-4xl sm:text-5xl text-[#1E1A1A] font-normal tracking-tight mb-3">
          Get in Touch with Albeli
        </h1>
        <p className="font-sans text-xs sm:text-sm text-[#1E1A1A]/60">
          Whether you want to place an order, enquire about an out-of-stock piece, or discuss a bespoke bridal curation.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
        {/* Left Column: Quick Contact Info */}
        <div className="md:col-span-5 space-y-6">
          <div className="p-6 bg-white rounded-sm border border-[#4A0612]/10 space-y-4">
            <h3 className="font-display text-2xl text-[#1E1A1A]">
              Direct Styling & Support
            </h3>
            <p className="text-xs text-[#1E1A1A]/70 leading-relaxed font-sans">
              Our styling team is available 7 days a week on WhatsApp and Instagram for order assistance and styling advice.
            </p>

            <div className="pt-2 space-y-3">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 bg-[#FBF6EE] hover:bg-[#F1DFD8] rounded-sm transition-colors text-xs font-sans font-medium text-[#1E1A1A]"
              >
                <MessageCircle className="w-4 h-4 text-[#25D366]" />
                <span>WhatsApp: {siteConfig.whatsappNumber}</span>
              </a>

              <a
                href={`https://instagram.com/${siteConfig.instagramHandle}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 bg-[#FBF6EE] hover:bg-[#F1DFD8] rounded-sm transition-colors text-xs font-sans font-medium text-[#1E1A1A]"
              >
                <InstagramIcon className="w-4 h-4 text-[#6B1F2E]" />
                <span>Instagram: @{siteConfig.instagramHandle}</span>
              </a>
            </div>
          </div>

          <div className="p-6 bg-white rounded-sm border border-[#4A0612]/10 space-y-3">
            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-[#6B1F2E] shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-semibold text-[#1E1A1A] uppercase tracking-wider font-sans">
                  Delhi Studio
                </h4>
                <p className="text-xs text-[#1E1A1A]/60 font-sans mt-0.5">
                  South Delhi, New Delhi — 110049, India
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 pt-2">
              <Clock className="w-4 h-4 text-[#6B1F2E] shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-semibold text-[#1E1A1A] uppercase tracking-wider font-sans">
                  Timings
                </h4>
                <p className="text-xs text-[#1E1A1A]/60 font-sans mt-0.5">
                  Mon – Sat: 10:00 AM – 7:30 PM IST
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Request a Custom Design Form */}
        <div className="md:col-span-7 bg-white p-6 sm:p-8 rounded-sm border border-[#4A0612]/10">
          <div className="mb-6">
            <span className="text-[11px] font-semibold text-[#6B1F2E] uppercase tracking-widest block mb-1">
              Bespoke Service
            </span>
            <h2 className="font-display text-2xl text-[#1E1A1A]">
              Request a Custom Design
            </h2>
            <p className="text-xs text-[#1E1A1A]/60 font-sans mt-1">
              Have a specific bridal reference or outfit colour in mind? Our karigars can customize designs for you.
            </p>
          </div>

          {submitted ? (
            <div className="text-center py-12 space-y-3">
              <CheckCircle2 className="w-10 h-10 text-[#25D366] mx-auto" />
              <h3 className="font-display text-2xl text-[#1E1A1A]">
                Request Received!
              </h3>
              <p className="text-xs text-[#1E1A1A]/60 max-w-sm mx-auto font-sans">
                Our designer will review your notes and reach out via WhatsApp with sketches and material options.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-4 text-xs text-[#6B1F2E] font-medium hover:underline"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-sans font-medium text-[#1E1A1A] mb-1">
                  Your Full Name
                </label>
                <input
                  type="text"
                  required
                  autoComplete="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Aditi Mehra"
                  className="w-full px-3.5 py-2.5 bg-[#FBF6EE]/50 border border-[#4A0612]/20 rounded-sm text-xs font-sans focus:outline-none focus:border-[#6B1F2E]"
                />
              </div>

              <div>
                <label className="block text-xs font-sans font-medium text-[#1E1A1A] mb-1">
                  WhatsApp Number or Email
                </label>
                <input
                  type="tel"
                  required
                  autoComplete="tel"
                  inputMode="tel"
                  value={formData.contact}
                  onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                  placeholder="+91 98765 43210"
                  className="w-full px-3.5 py-2.5 bg-[#FBF6EE]/50 border border-[#4A0612]/20 rounded-sm text-xs font-sans focus:outline-none focus:border-[#6B1F2E]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-sans font-medium text-[#1E1A1A] mb-1">
                    Jewellery Type
                  </label>
                  <select
                    value={formData.designType}
                    onChange={(e) => setFormData({ ...formData, designType: e.target.value })}
                    className="w-full px-3 py-2.5 bg-[#FBF6EE]/50 border border-[#4A0612]/20 rounded-sm text-xs font-sans focus:outline-none focus:border-[#6B1F2E]"
                  >
                    <option>Choker / Necklace</option>
                    <option>Chandbali / Jhumka</option>
                    <option>Cocktail Ring</option>
                    <option>Haathphool / Bangles</option>
                    <option>Full Bridal Set</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-sans font-medium text-[#1E1A1A] mb-1">
                    Budget Preference
                  </label>
                  <select
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                    className="w-full px-3 py-2.5 bg-[#FBF6EE]/50 border border-[#4A0612]/20 rounded-sm text-xs font-sans focus:outline-none focus:border-[#6B1F2E]"
                  >
                    <option>Under ₹1,500</option>
                    <option>₹1,500 – ₹3,000</option>
                    <option>₹3,000 – ₹6,000</option>
                    <option>₹6,000+</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-sans font-medium text-[#1E1A1A] mb-1">
                  Design Notes / Outfit Details
                </label>
                <textarea
                  rows={3}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Describe your outfit, preferred colours (e.g. ruby, emerald, mint), or required delivery date..."
                  className="w-full px-3.5 py-2.5 bg-[#FBF6EE]/50 border border-[#4A0612]/20 rounded-sm text-xs font-sans focus:outline-none focus:border-[#6B1F2E]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-[#4A0612] hover:bg-[#6B1F2E] text-[#FCEDEA] text-xs font-semibold uppercase tracking-wider rounded-sm transition-colors shadow-sm"
              >
                Submit Design Request
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
