import Link from "next/link";
import { toOrderSearchParams } from "@/lib/orders-query";
import { orderStatusLabels } from "@/lib/salse-labels";
import type { OrderStatus } from "@/types/dashboard";
import type { OrderQuery, OrderSummary } from "@/types/orders";

const statuses: OrderStatus[] = ["processing", "shipped", "delivered", "cancelled"];

/**
 * One tab per order status, each with its count. They are plain links that set ?status=,
 * so the other filters (search, payment) are kept and the page needs no client code.
 */
export default function OrderStatusTabs({ summary, query }: { summary: OrderSummary; query: OrderQuery }) {
  const tabs: { key: string; label: string; count: number; status?: OrderStatus }[] = [
    { key: "all", label: "All", count: summary.totalOrders },
    ...statuses.map((status) => ({
      key: status,
      label: orderStatusLabels[status],
      count: summary.statusCounts[status],
      status,
    })),
  ];

  return (
    <nav aria-label="Filter by order status" className="mb-4 flex gap-2 overflow-x-auto pb-1">
      {tabs.map((tab) => {
        const params = toOrderSearchParams({ ...query, status: tab.status, page: 1 }).toString();
        const active = query.status === tab.status;

        return (
          <Link
            key={tab.key}
            href={params ? `/orders?${params}` : "/orders"}
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

export function OrderStatusTabsSkeleton() {
  return <div aria-hidden="true" className="mb-4 h-10 w-full animate-pulse rounded-lg bg-gray-100" />;
}