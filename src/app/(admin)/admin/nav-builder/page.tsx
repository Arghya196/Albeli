"use client";

import { useState, useCallback } from "react";
import {
  GripVertical,
  Plus,
  Trash2,
  Save,
  CheckCircle2,
  ExternalLink,
  Navigation,
  PanelTop,
  PanelBottom,
} from "lucide-react";
import { useAdminStore, type NavItem } from "@/lib/store/adminStore";
import { cn } from "@/lib/utils";

function NavItemRow({
  item,
  onUpdate,
  onDelete,
  onDragStart,
  onDragOver,
  onDrop,
  isDragging,
}: {
  item: NavItem;
  onUpdate: (id: string, updates: Partial<NavItem>) => void;
  onDelete: (id: string) => void;
  onDragStart: (id: string) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (targetId: string) => void;
  isDragging: boolean;
}) {
  return (
    <div
      draggable
      onDragStart={() => onDragStart(item.id)}
      onDragOver={onDragOver}
      onDrop={() => onDrop(item.id)}
      className={cn(
        "flex items-center gap-3 p-3 bg-white rounded-sm border transition-all",
        isDragging
          ? "border-[#6B1F2E] shadow-md opacity-60"
          : "border-[#4A0612]/10 hover:border-[#4A0612]/20"
      )}
    >
      <GripVertical className="w-4 h-4 text-[#1E1A1A]/30 cursor-grab shrink-0" />

      <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
        <input
          type="text"
          value={item.label}
          onChange={(e) => onUpdate(item.id, { label: e.target.value })}
          placeholder="Link label"
          className="px-2.5 py-1.5 bg-[#FBF6EE]/40 border border-[#4A0612]/15 rounded-xs text-xs font-sans focus:outline-none focus:border-[#6B1F2E]"
        />
        <input
          type="text"
          value={item.href}
          onChange={(e) => onUpdate(item.id, { href: e.target.value })}
          placeholder="/shop or https://..."
          className="px-2.5 py-1.5 bg-[#FBF6EE]/40 border border-[#4A0612]/15 rounded-xs text-xs font-sans font-mono focus:outline-none focus:border-[#6B1F2E]"
        />
      </div>

      <label className="flex items-center gap-1.5 text-[10px] text-[#1E1A1A]/60 font-sans shrink-0">
        <input
          type="checkbox"
          checked={item.visible}
          onChange={(e) => onUpdate(item.id, { visible: e.target.checked })}
          className="accent-[#6B1F2E] w-3.5 h-3.5"
        />
        <span>Show</span>
      </label>

      <button
        onClick={() => onDelete(item.id)}
        className="p-1.5 text-[#1E1A1A]/40 hover:text-red-600 transition-colors shrink-0"
        aria-label="Delete link"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

export default function AdminNavBuilderPage() {
  const { navigation, updateNavigation } = useAdminStore();
  const [headerItems, setHeaderItems] = useState<NavItem[]>(navigation.header);
  const [footerItems, setFooterItems] = useState<NavItem[]>(navigation.footer);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [draggedId, setDraggedId] = useState<string | null>(null);

  const handleSave = () => {
    updateNavigation({
      header: headerItems,
      footer: footerItems,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const addItem = (target: "header" | "footer") => {
    const newItem: NavItem = {
      id: `nav-${Date.now()}`,
      label: "New Link",
      href: "/",
      visible: true,
    };
    if (target === "header") {
      setHeaderItems((prev) => [...prev, newItem]);
    } else {
      setFooterItems((prev) => [...prev, newItem]);
    }
  };

  const updateItem = useCallback(
    (items: NavItem[], setItems: React.Dispatch<React.SetStateAction<NavItem[]>>) =>
      (id: string, updates: Partial<NavItem>) => {
        setItems(items.map((item) => (item.id === id ? { ...item, ...updates } : item)));
      },
    []
  );

  const deleteItem = (
    items: NavItem[],
    setItems: React.Dispatch<React.SetStateAction<NavItem[]>>
  ) => (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (
    items: NavItem[],
    setItems: React.Dispatch<React.SetStateAction<NavItem[]>>
  ) => (targetId: string) => {
    if (!draggedId || draggedId === targetId) return;
    const draggedIdx = items.findIndex((i) => i.id === draggedId);
    const targetIdx = items.findIndex((i) => i.id === targetId);
    if (draggedIdx === -1 || targetIdx === -1) return;

    const updated = [...items];
    const [dragged] = updated.splice(draggedIdx, 1);
    updated.splice(targetIdx, 0, dragged);
    setItems(updated);
    setDraggedId(null);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-baseline justify-between gap-4 pb-6 border-b border-[#4A0612]/10">
        <div>
          <h1 className="font-display text-3xl text-[#1E1A1A] font-normal tracking-tight">
            Navigation Builder
          </h1>
          <p className="font-sans text-xs text-[#1E1A1A]/60 mt-1">
            Customize header and footer navigation links. Drag to reorder, toggle visibility.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#4A0612] hover:bg-[#6B1F2E] text-[#FCEDEA] text-xs font-semibold uppercase tracking-wider rounded-sm transition-colors shadow-xs"
        >
          <Save className="w-3.5 h-3.5" />
          <span>Save Navigation</span>
        </button>
      </div>

      {savedSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-sm text-xs font-sans flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Navigation updated! Refresh the storefront to see changes.</span>
        </div>
      )}

      {/* Header Navigation */}
      <div className="bg-white p-6 rounded-sm border border-[#4A0612]/10 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#4A0612]/10">
          <div className="flex items-center gap-2">
            <PanelTop className="w-4 h-4 text-[#6B1F2E]" />
            <h2 className="font-display text-xl text-[#1E1A1A]">
              Header Navigation Links
            </h2>
          </div>
          <button
            onClick={() => addItem("header")}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 border border-[#4A0612]/20 hover:bg-[#FBF6EE] text-xs font-sans font-medium rounded-xs transition-colors"
          >
            <Plus className="w-3 h-3" />
            <span>Add Link</span>
          </button>
        </div>

        <div className="space-y-2">
          {headerItems.map((item) => (
            <NavItemRow
              key={item.id}
              item={item}
              onUpdate={updateItem(headerItems, setHeaderItems)}
              onDelete={deleteItem(headerItems, setHeaderItems)}
              onDragStart={setDraggedId}
              onDragOver={handleDragOver}
              onDrop={handleDrop(headerItems, setHeaderItems)}
              isDragging={draggedId === item.id}
            />
          ))}
          {headerItems.length === 0 && (
            <p className="text-xs text-[#1E1A1A]/50 font-sans text-center py-6">
              No header links yet. Click &quot;Add Link&quot; to start.
            </p>
          )}
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="bg-white p-6 rounded-sm border border-[#4A0612]/10 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#4A0612]/10">
          <div className="flex items-center gap-2">
            <PanelBottom className="w-4 h-4 text-[#6B1F2E]" />
            <h2 className="font-display text-xl text-[#1E1A1A]">
              Footer Navigation Links
            </h2>
          </div>
          <button
            onClick={() => addItem("footer")}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 border border-[#4A0612]/20 hover:bg-[#FBF6EE] text-xs font-sans font-medium rounded-xs transition-colors"
          >
            <Plus className="w-3 h-3" />
            <span>Add Link</span>
          </button>
        </div>

        <div className="space-y-2">
          {footerItems.map((item) => (
            <NavItemRow
              key={item.id}
              item={item}
              onUpdate={updateItem(footerItems, setFooterItems)}
              onDelete={deleteItem(footerItems, setFooterItems)}
              onDragStart={setDraggedId}
              onDragOver={handleDragOver}
              onDrop={handleDrop(footerItems, setFooterItems)}
              isDragging={draggedId === item.id}
            />
          ))}
          {footerItems.length === 0 && (
            <p className="text-xs text-[#1E1A1A]/50 font-sans text-center py-6">
              No footer links yet. Click &quot;Add Link&quot; to start.
            </p>
          )}
        </div>
      </div>

      {/* Info Tip */}
      <div className="p-4 bg-[#FBF6EE] border border-[#4A0612]/10 rounded-sm text-xs font-sans text-[#1E1A1A]/70 flex items-start gap-3">
        <Navigation className="w-4 h-4 text-[#6B1F2E] shrink-0 mt-0.5" />
        <div>
          <strong className="text-[#1E1A1A] block mb-0.5">Pro Tip</strong>
          <span>Use relative paths like <code className="text-[#6B1F2E]">/shop</code>, <code className="text-[#6B1F2E]">/about</code>, <code className="text-[#6B1F2E]">/lookbook</code> for internal pages. External URLs (e.g. Instagram) should include the full <code className="text-[#6B1F2E]">https://</code> prefix.</span>
        </div>
      </div>
    </div>
  );
}
