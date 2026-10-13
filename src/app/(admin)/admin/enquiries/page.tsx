"use client";

import { useState } from "react";
import {
  MessageSquare,
  Download,
  Filter,
  CheckCircle2,
  Clock,
  ExternalLink,
} from "lucide-react";
import { useAdminStore } from "@/lib/store/adminStore";

export default function AdminEnquiriesPage() {
  const { enquiries, updateEnquiryStatus } = useAdminStore();
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const filteredEnquiries = enquiries.filter((e) => {
    if (filterStatus === "all") return true;
    return e.status === filterStatus;
  });

  const exportCSV = () => {
    const headers = ["ID", "Customer Name", "Contact", "Channel", "Product", "Status", "Notes", "Timestamp"];
    const rows = enquiries.map((e) => [
      e.id,
      e.customerName || "Guest",
      e.customerContact || "",
      e.channel,
      `"${e.productName}"`,
      e.status,
      `"${e.notes || ""}"`,
      e.timestamp,
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `albeli_enquiries_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-baseline justify-between gap-4 pb-6 border-b border-[#4A0612]/10">
        <div>
          <h1 className="font-display text-3xl text-[#1E1A1A] font-normal tracking-tight">
            Customer Enquiries Inbox ({enquiries.length})
          </h1>
          <p className="font-sans text-xs text-[#1E1A1A]/60 mt-1">
            Incoming WhatsApp orders, Instagram DMs, and bespoke custom design requests.
          </p>
        </div>

        <button
          onClick={exportCSV}
          className="inline-flex items-center gap-2 px-3.5 py-2 bg-white hover:bg-[#FBF6EE] border border-[#4A0612]/20 text-[#1E1A1A] text-xs font-sans font-medium rounded-sm transition-colors shadow-xs"
        >
          <Download className="w-3.5 h-3.5 text-[#6B1F2E]" />
          <span>Export CSV</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 font-sans text-xs">
        {["all", "new", "contacted", "converted", "lost"].map((st) => (
          <button
            key={st}
            onClick={() => setFilterStatus(st)}
            className={`px-3 py-1.5 rounded-full capitalize transition-all ${
              filterStatus === st
                ? "bg-[#4A0612] text-[#FCEDEA] font-semibold"
                : "bg-white text-[#1E1A1A]/70 hover:bg-[#F1DFD8]/40 border border-[#4A0612]/10"
            }`}
          >
            {st}
          </button>
        ))}
      </div>

      {/* Enquiries Table */}
      <div className="bg-white rounded-sm border border-[#4A0612]/10 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs font-sans">
            <thead>
              <tr className="bg-[#FBF6EE] border-b border-[#4A0612]/10 text-[11px] uppercase tracking-wider text-[#1E1A1A]/60">
                <th className="py-3.5 px-4 font-semibold">Customer</th>
                <th className="py-3.5 px-4 font-semibold">Channel</th>
                <th className="py-3.5 px-4 font-semibold">Product Requested</th>
                <th className="py-3.5 px-4 font-semibold">Notes / Request Details</th>
                <th className="py-3.5 px-4 font-semibold">Status</th>
                <th className="py-3.5 px-4 font-semibold text-right">Update Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#4A0612]/5">
              {filteredEnquiries.map((e) => (
                <tr key={e.id} className="hover:bg-[#FBF6EE]/30 transition-colors">
                  <td className="py-3.5 px-4">
                    <span className="font-medium text-[#1E1A1A] block">
                      {e.customerName || "Website Guest"}
                    </span>
                    <span className="text-[11px] text-[#1E1A1A]/50">
                      {e.customerContact || "Direct Click"}
                    </span>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="inline-block px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wider font-semibold bg-[#4A0612]/5 text-[#6B1F2E]">
                      {e.channel}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 font-medium text-[#1E1A1A]">
                    {e.productName}
                  </td>

                  <td className="py-3.5 px-4 text-[#1E1A1A]/70 max-w-xs truncate">
                    {e.notes || "Standard order message initiated"}
                  </td>

                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
                        e.status === "new"
                          ? "bg-amber-100 text-amber-800"
                          : e.status === "contacted"
                          ? "bg-blue-100 text-blue-800"
                          : e.status === "converted"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {e.status}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <select
                      value={e.status}
                      onChange={(ev) =>
                        updateEnquiryStatus(
                          e.id,
                          ev.target.value as "new" | "contacted" | "converted" | "lost"
                        )
                      }
                      className="px-2 py-1 bg-white border border-[#4A0612]/20 rounded-xs text-[11px] font-sans focus:outline-none focus:border-[#6B1F2E] cursor-pointer"
                    >
                      <option value="new">New</option>
                      <option value="contacted">Contacted</option>
                      <option value="converted">Converted</option>
                      <option value="lost">Lost</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
