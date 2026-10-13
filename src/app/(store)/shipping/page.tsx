import Link from "next/link";
import { Globe, Truck, Package, ShieldCheck } from "lucide-react";

export default function ShippingPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
      <div className="text-center mb-12">
        <span className="font-hindi text-sm text-[#6B1F2E] block mb-1">
          डिलीवरी और शिपिंग
        </span>
        <h1 className="font-display text-4xl sm:text-5xl text-[#1E1A1A] font-normal tracking-tight mb-3">
          Shipping & Worldwide Delivery
        </h1>
        <p className="font-sans text-xs sm:text-sm text-[#1E1A1A]/60">
          Handcrafted in Delhi, packed with utmost care, and delivered across India and overseas.
        </p>
      </div>

      <div className="space-y-8 font-sans text-xs sm:text-sm text-[#1E1A1A]/80 leading-relaxed">
        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-5 bg-white rounded-sm border border-[#4A0612]/10 space-y-2">
            <Truck className="w-5 h-5 text-[#6B1F2E]" />
            <h3 className="font-display text-lg text-[#1E1A1A]">India Delivery</h3>
            <p className="text-xs text-[#1E1A1A]/60">
              3 to 5 business days across all Indian states and metro cities. Fast dispatch within 24 hours.
            </p>
          </div>

          <div className="p-5 bg-white rounded-sm border border-[#4A0612]/10 space-y-2">
            <Globe className="w-5 h-5 text-[#6B1F2E]" />
            <h3 className="font-display text-lg text-[#1E1A1A]">Worldwide Courier</h3>
            <p className="text-xs text-[#1E1A1A]/60">
              6 to 9 business days to USA, UK, UAE, Canada, Australia, Singapore, and Europe.
            </p>
          </div>

          <div className="p-5 bg-white rounded-sm border border-[#4A0612]/10 space-y-2">
            <Package className="w-5 h-5 text-[#6B1F2E]" />
            <h3 className="font-display text-lg text-[#1E1A1A]">Luxury Gift Box</h3>
            <p className="text-xs text-[#1E1A1A]/60">
              Every design is placed in an airtight protective pouch inside our signature rigid gift box.
            </p>
          </div>
        </div>

        {/* Detailed Sections */}
        <div className="p-6 bg-white rounded-sm border border-[#4A0612]/10 space-y-4">
          <h2 className="font-display text-2xl text-[#1E1A1A]">
            Domestic Shipping (India)
          </h2>
          <p>
            We partner with premium express couriers (Bluedart, Delhivery, DTDC) to ensure your parcel reaches you securely.
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs text-[#1E1A1A]/70">
            <li><strong>Dispatch Time:</strong> Orders are dispatched within 24–48 hours from our Delhi workshop.</li>
            <li><strong>Tracking:</strong> You receive an instant WhatsApp update with live tracking code the moment your parcel is scanned.</li>
            <li><strong>Free Shipping:</strong> Complimentary standard shipping on all orders above ₹999.</li>
          </ul>
        </div>

        <div className="p-6 bg-white rounded-sm border border-[#4A0612]/10 space-y-4">
          <h2 className="font-display text-2xl text-[#1E1A1A]">
            International Shipping (Worldwide)
          </h2>
          <p>
            We regularly ship to NRI and international jewellery lovers in over 25 countries via DHL Express and Aramex.
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs text-[#1E1A1A]/70">
            <li><strong>Transit Duration:</strong> Usually delivered in 6–9 business days depending on customs clearance.</li>
            <li><strong>Packaging:</strong> Multi-layer shockproof bubble cushioning to guarantee safe arrival.</li>
            <li><strong>Customs:</strong> Any import customs duties levied by the destination country are payable by the customer as per local regulations.</li>
          </ul>
        </div>

        <div className="p-6 bg-white rounded-sm border border-[#4A0612]/10 space-y-3">
          <h2 className="font-display text-2xl text-[#1E1A1A]">
            Need Urgent Delivery for a Wedding?
          </h2>
          <p>
            If you need a design delivered on a tight deadline for a sangeet, mehendi or reception, message us on WhatsApp before ordering. We offer same-day dispatch from Delhi whenever possible.
          </p>
          <Link
            href="/contact"
            className="inline-block text-xs font-semibold uppercase tracking-wider text-[#6B1F2E] hover:underline pt-2"
          >
            Contact our dispatch desk →
          </Link>
        </div>
      </div>
    </div>
  );
}
