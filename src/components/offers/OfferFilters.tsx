"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";
import { OFFER_SORTS, OFFER_TYPES, offerSortLabels, offerTypeLabels } from "@/lib/offers-query";

const selectClass =
  "h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-700 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100";

/** The filters this component owns. The status tabs own ?status=, so "Clear" leaves it alone. */
const OWN_KEYS = ["search", "type", "sort"];

/**
 * Search box + type and sort dropdowns. They only write to the URL
 * (?search=&type=&sort=); the server re-renders the table from those params.
 * Same pattern as CustomerFilters.
 */
export default function OfferFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [search, setSearch] = useState(params.get("search") ?? "");
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);

  const hasFilters = OWN_KEYS.some((key) => params.has(key));

  function apply(next: URLSearchParams) {
    next.delete("page"); // a new filter always starts from page 1
    const query = next.toString();
    startTransition(() => router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false }));
  }

  function update(changes: Record<string, string | undefined>) {
    // Read the live URL so a debounced search never overwrites a dropdown change.
    const next = new URLSearchParams(window.location.search);
    for (const [key, value] of Object.entries(changes)) {
      if (value) next.set(key, value);
      else next.delete(key);
    }
    apply(next);
  }

  function onSearchChange(value: string) {
    setSearch(value);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => update({ search: value.trim() || undefined }), 350);
  }

  function clearAll() {
    clearTimeout(timer.current);
    setSearch("");
    const next = new URLSearchParams(window.location.search);
    OWN_KEYS.forEach((key) => next.delete(key));
    apply(next);
  }

  return (
    <div className={`mb-4 flex flex-wrap items-center gap-3 transition-opacity ${isPending ? "opacity-60" : ""}`}>
      <div className="relative min-w-[220px] flex-1">
        <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="search"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search coupon code or description"
          aria-label="Search offers"
          className="h-10 w-full rounded-lg border border-gray-200 pl-9 pr-3 text-sm outline-none placeholder:text-gray-400 focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
        />
      </div>

      <select
        aria-label="Filter by offer type"
        value={params.get("type") ?? ""}
        onChange={(event) => update({ type: event.target.value || undefined })}
        className={selectClass}
      >
        <option value="">All offer types</option>
        {OFFER_TYPES.map((type) => (
          <option key={type} value={type}>
            {offerTypeLabels[type]}
          </option>
        ))}
      </select>

      <select
        aria-label="Sort offers"
        value={params.get("sort") ?? "newest"}
        onChange={(event) => update({ sort: event.target.value === "newest" ? undefined : event.target.value })}
        className={selectClass}
      >
        {OFFER_SORTS.map((sort) => (
          <option key={sort} value={sort}>
            {offerSortLabels[sort]}
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

export function OfferFiltersSkeleton() {
  return <div aria-hidden="true" className="mb-4 h-10 w-full animate-pulse rounded-lg bg-gray-100" />;
}