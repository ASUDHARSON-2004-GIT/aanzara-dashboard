import type { Metadata } from "next";
import { Suspense } from "react";
import AsyncSection from "@/components/ui/AsyncSection";
import Card from "@/components/ui/Card";
import PageHeader from "@/components/ui/PageHeader";
import Skeleton from "@/components/ui/Skeleton";
import { StatsGridSkeleton } from "@/components/StatsGrid";
import OrderFilters, { OrderFiltersSkeleton } from "@/components/orders/OrderFilters";
import OrderStats from "@/components/orders/OrderStats";
import OrderStatusTabs, { OrderStatusTabsSkeleton } from "@/components/orders/OrderStatusTabs";
import OrdersTable from "@/components/orders/OrdersTable";
import { parseOrderQuery } from "@/lib/orders-query";
import { getOrderSummary, getOrders } from "@/services/orders";

export const metadata: Metadata = {
  title: "AANZARA Admin | Orders",
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

/**
 * Same streaming pattern as Catalog, Sales and Inventory: the page itself is static,
 * and every panel sits in its own <Suspense>. Only <StatusTabsSection> and <OrdersSection>
 * read the URL (searchParams), so only they wait for it.
 */
export default function OrdersPage({ searchParams }: { searchParams: SearchParams }) {
  return (
    <>
      <PageHeader title="Orders" description="Review, track and manage customer orders." />

      <Suspense fallback={<StatsGridSkeleton />}>
        <AsyncSection load={getOrderSummary} title="order summary">
          {(summary) => <OrderStats summary={summary} />}
        </AsyncSection>
      </Suspense>

      <Card title="All Orders">
        <Suspense fallback={<OrderStatusTabsSkeleton />}>
          <StatusTabsSection searchParams={searchParams} />
        </Suspense>

        <Suspense fallback={<OrderFiltersSkeleton />}>
          <OrderFilters />
        </Suspense>

        <Suspense fallback={<TableSkeleton />}>
          <OrdersSection searchParams={searchParams} />
        </Suspense>
      </Card>
    </>
  );
}

async function StatusTabsSection({ searchParams }: { searchParams: SearchParams }) {
  const query = parseOrderQuery(await searchParams);

  return (
    <AsyncSection load={getOrderSummary} title="order tabs">
      {(summary) => <OrderStatusTabs summary={summary} query={query} />}
    </AsyncSection>
  );
}

async function OrdersSection({ searchParams }: { searchParams: SearchParams }) {
  const query = parseOrderQuery(await searchParams);

  return (
    <AsyncSection load={() => getOrders(query)} title="orders">
      {(list) => <OrdersTable list={list} query={query} />}
    </AsyncSection>
  );
}

function TableSkeleton() {
  return (
    <div role="status" aria-label="Loading orders" className="space-y-3">
      {Array.from({ length: 6 }, (_, i) => (
        <Skeleton key={i} className="h-12 w-full" />
      ))}
    </div>
  );
}