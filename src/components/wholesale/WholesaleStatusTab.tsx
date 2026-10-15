import Link from "next/link";
import { toWholesaleSearchParams, wholesaleStatusLabels } from "@/lib/wholesale-query";
import type { WholesaleQuery, WholesaleStatus, WholesaleSummary } from "@/types/wholesale";

/**
 * All / Active / On hold / Inactive tabs with their counts. Plain links that set ?status=,
 * so search, tier, state and sort are kept and the page needs no client code.
 */
export default function WholesaleStatusTabs({
  summary,
  query,
}: {
  summary: WholesaleSummary;
  query: WholesaleQuery;
}) {
  const tabs: { key: string; label: string; count: number; status?: WholesaleStatus }[] = [
    { key: "all", label: "All", count: summary.totalAccounts },
    { key: "active", label: wholesaleStatusLabels.active, count: summary.statusCounts.active, status: "active" },
    { key: "on_hold", label: wholesaleStatusLabels.on_hold, count: summary.statusCounts.on_hold, status: "on_hold" },
    { key: "inactive", label: wholesaleStatusLabels.inactive, count: summary.statusCounts.inactive, status: "inactive" },
  ];

  return (
    <nav aria-label="Filter by account status" className="mb-4 flex gap-2 overflow-x-auto pb-1">
      {tabs.map((tab) => {
        const params = toWholesaleSearchParams({ ...query, status: tab.status, page: 1 }).toString();
        const active = query.status === tab.status;

        return (
          <Link
            key={tab.key}
            href={params ? `/wholesale?${params}` : "/wholesale"}
            scroll={false}
            aria-current={active ? "page" : undefined}
            className={`inline-flex shrink-0 items-center gap-2 rounded-lg border px-3.5 py-2 text-sm font-medium transition ${
              active
                ? "border-[#ff6b1a] bg-orange-50 text-[#ff6b1a]"
                : "border-gray-200 text-gray-600 hover:bg-gray-50"
            }`}
          >
            {tab.label}
            <span
              className={`rounded-md px-1.5 py-0.5 text-xs ${
                active ? "bg-[#ff6b1a] text-white" : "bg-gray-100 text-gray-600"
              }`}
            >
              {tab.count}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}

export function WholesaleStatusTabsSkeleton() {
  return <div aria-hidden="true" className="mb-4 h-10 w-full animate-pulse rounded-lg bg-gray-100" />;
}