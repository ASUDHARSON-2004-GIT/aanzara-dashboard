import Link from "next/link";
import { customerTypeLabels, toCustomerSearchParams } from "@/lib/customers-query";
import type { CustomerQuery, CustomerSummary, CustomerType } from "@/types/customers";

/**
 * All / Retail / Wholesale tabs with their counts. Plain links that set ?type=,
 * so search, state and sort are kept and the page needs no client code.
 */
export default function CustomerTypeTabs({
  summary,
  query,
}: {
  summary: CustomerSummary;
  query: CustomerQuery;
}) {
  const tabs: { key: string; label: string; count: number; type?: CustomerType }[] = [
    { key: "all", label: "All", count: summary.totalCustomers },
    { key: "retail", label: customerTypeLabels.retail, count: summary.retailCount, type: "retail" },
    { key: "wholesale", label: customerTypeLabels.wholesale, count: summary.wholesaleCount, type: "wholesale" },
  ];

  return (
    <nav aria-label="Filter by customer type" className="mb-4 flex gap-2 overflow-x-auto pb-1">
      {tabs.map((tab) => {
        const params = toCustomerSearchParams({ ...query, type: tab.type, page: 1 }).toString();
        const active = query.type === tab.type;

        return (
          <Link
            key={tab.key}
            href={params ? `/customers?${params}` : "/customers"}
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

export function CustomerTypeTabsSkeleton() {
  return <div aria-hidden="true" className="mb-4 h-10 w-full animate-pulse rounded-lg bg-gray-100" />;
}