import Link from "next/link";
import { OFFER_STATUSES, toOfferSearchParams } from "@/lib/offers-query";
import { couponStatusLabels } from "@/lib/salse-labels";
import type { OfferQuery, OfferStatus, OfferSummary } from "@/types/offers";

/**
 * One tab per offer status, each with its count. Plain links that set ?status=,
 * so search, type and sort are kept and the page needs no client code.
 */
export default function OfferStatusTabs({ summary, query }: { summary: OfferSummary; query: OfferQuery }) {
  const tabs: { key: string; label: string; count: number; status?: OfferStatus }[] = [
    { key: "all", label: "All", count: summary.totalOffers },
    ...OFFER_STATUSES.map((status) => ({
      key: status,
      label: couponStatusLabels[status],
      count: summary.statusCounts[status],
      status,
    })),
  ];

  return (
    <nav aria-label="Filter by offer status" className="mb-4 flex gap-2 overflow-x-auto pb-1">
      {tabs.map((tab) => {
        const params = toOfferSearchParams({ ...query, status: tab.status, page: 1 }).toString();
        const active = query.status === tab.status;

        return (
          <Link
            key={tab.key}
            href={params ? `/offers?${params}` : "/offers"}
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

export function OfferStatusTabsSkeleton() {
  return <div aria-hidden="true" className="mb-4 h-10 w-full animate-pulse rounded-lg bg-gray-100" />;
}