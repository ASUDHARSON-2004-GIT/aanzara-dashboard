import type { Metadata } from "next";
import { Suspense } from "react";
import AsyncSection from "@/components/ui/AsyncSection";
import Card from "@/components/ui/Card";
import PageHeader from "@/components/ui/PageHeader";
import Skeleton, { CardSkeleton } from "@/components/ui/Skeleton";
import SalesChart from "@/components/SalesChart";
import { StatsGridSkeleton } from "@/components/StatsGrid";
import CouponsCard from "@/components/sales/CouponsCard";
import PaymentMethodsChart from "@/components/sales/PaymentMethodsChart";
import SalesByRegion from "@/components/sales/SalesByRegion";
import SalesFilters, { SalesFiltersSkeleton } from "@/components/sales/SalesFilters";
import SalesStats from "@/components/sales/SalesStats";
import SalesTable from "@/components/sales/SalesTable";
import TopSellingProducts from "@/components/sales/TopSellingProducts";
import { parseSalesQuery } from "@/lib/sales-query";
import {
  getCouponPerformance,
  getPaymentMethodSales,
  getRegionSales,
  getSales,
  getSalesSummary,
  getSalesTrend,
  getTopSellingProducts,
} from "@/services/sales";

export const metadata: Metadata = {
  title: "AANZARA Admin | Sales",
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

/**
 * Same streaming pattern as the Catalog page: the page itself is static, and every
 * panel sits in its own <Suspense>. Only <SalesTableSection> reads the URL
 * (searchParams), so only the table waits for it.
 */
export default function SalesPage({ searchParams }: { searchParams: SearchParams }) {
  return (
    <>
      <PageHeader title="Sales" description="Track revenue, payments and coupon performance." />

      <Suspense fallback={<StatsGridSkeleton />}>
        <AsyncSection load={getSalesSummary} title="sales summary">
          {(summary) => <SalesStats summary={summary} />}
        </AsyncSection>
      </Suspense>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        <Suspense fallback={<CardSkeleton rows={5} />}>
          <AsyncSection load={getSalesTrend} title="sales trend">
            {(trend) => <SalesChart data={trend} />}
          </AsyncSection>
        </Suspense>

        <Suspense fallback={<CardSkeleton rows={4} />}>
          <AsyncSection load={getPaymentMethodSales} title="payment methods">
            {(methods) => <PaymentMethodsChart data={methods} />}
          </AsyncSection>
        </Suspense>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <Suspense fallback={<CardSkeleton rows={5} />}>
          <AsyncSection load={getTopSellingProducts} title="top selling products">
            {(products) => <TopSellingProducts products={products} />}
          </AsyncSection>
        </Suspense>

        <Suspense fallback={<CardSkeleton rows={5} />}>
          <AsyncSection load={getRegionSales} title="sales by state">
            {(regions) => <SalesByRegion regions={regions} />}
          </AsyncSection>
        </Suspense>
      </div>

      <Suspense fallback={<CardSkeleton rows={4} />}>
        <AsyncSection load={getCouponPerformance} title="coupon performance">
          {(coupons) => <CouponsCard coupons={coupons} />}
        </AsyncSection>
      </Suspense>

      <Card title="Sales Transactions">
        <Suspense fallback={<SalesFiltersSkeleton />}>
          <SalesFilters />
        </Suspense>

        <Suspense fallback={<TableSkeleton />}>
          <SalesTableSection searchParams={searchParams} />
        </Suspense>
      </Card>
    </>
  );
}

async function SalesTableSection({ searchParams }: { searchParams: SearchParams }) {
  const query = parseSalesQuery(await searchParams);

  return (
    <AsyncSection load={() => getSales(query)} title="sales transactions">
      {(list) => <SalesTable list={list} query={query} />}
    </AsyncSection>
  );
}

function TableSkeleton() {
  return (
    <div role="status" aria-label="Loading sales" className="space-y-3">
      {Array.from({ length: 6 }, (_, i) => (
        <Skeleton key={i} className="h-12 w-full" />
      ))}
    </div>
  );
}