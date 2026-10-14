"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";
import type { Category } from "@/types/catalog";

const statusOptions = [
  { value: "active", label: "Active" },
  { value: "draft", label: "Draft" },
  { value: "archived", label: "Archived" },
];

const stockOptions = [
  { value: "in_stock", label: "In Stock" },
  { value: "low_stock", label: "Low Stock" },
  { value: "out_of_stock", label: "Out of Stock" },
];

const selectClass =
  "h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-700 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100";

/**
 * Search box + dropdowns. They only write to the URL (?search=&category=&status=&stock=);
 * the server re-renders the table from those params, so a filtered view can be
 * bookmarked, shared and survives a refresh.
 */
export default function ProductFilters({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [search, setSearch] = useState(params.get("search") ?? "");
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);

  const hasFilters = ["search", "category", "status", "stock"].some((key) => params.has(key));

  function update(changes: Record<string, string | undefined>) {
    // Read the live URL so a debounced search never overwrites a dropdown change.
    const next = new URLSearchParams(window.location.search);
    for (const [key, value] of Object.entries(changes)) {
      if (value) next.set(key, value);
      else next.delete(key);
    }
    next.delete("page"); // a new filter always starts from page 1
    const query = next.toString();
    startTransition(() => router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false }));
  }

  function onSearchChange(value: string) {
    setSearch(value);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => update({ search: value.trim() || undefined }), 350);
  }

  function clearAll() {
    clearTimeout(timer.current);
    setSearch("");
    startTransition(() => router.replace(pathname, { scroll: false }));
  }

  return (
    <div className={`mb-4 flex flex-wrap items-center gap-3 transition-opacity ${isPending ? "opacity-60" : ""}`}>
      <div className="relative min-w-[220px] flex-1">
        <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="search"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search name, SKU or brand"
          aria-label="Search products"
          className="h-10 w-full rounded-lg border border-gray-200 pl-9 pr-3 text-sm outline-none placeholder:text-gray-400 focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
        />
      </div>

      <select
        aria-label="Filter by category"
        value={params.get("category") ?? ""}
        onChange={(event) => update({ category: event.target.value || undefined })}
        className={selectClass}
      >
        <option value="">All categories</option>
        {categories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </select>

      <select
        aria-label="Filter by status"
        value={params.get("status") ?? ""}
        onChange={(event) => update({ status: event.target.value || undefined })}
        className={selectClass}
      >
        <option value="">All statuses</option>
        {statusOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      <select
        aria-label="Filter by stock"
        value={params.get("stock") ?? ""}
        onChange={(event) => update({ stock: event.target.value || undefined })}
        className={selectClass}
      >
        <option value="">All stock levels</option>
        {stockOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {hasFilters && (
        <button
          type="button"
          onClick={clearAll}
          className="inline-flex h-10 items-center gap-1 rounded-lg px-2 text-sm font-medium text-orange-600 hover:underline"
        >
          <X size={14} />
          Clear
        </button>
      )}
    </div>
  );
}

export function ProductFiltersSkeleton() {
  return <div aria-hidden="true" className="mb-4 h-10 w-full animate-pulse rounded-lg bg-gray-100" />;
}
