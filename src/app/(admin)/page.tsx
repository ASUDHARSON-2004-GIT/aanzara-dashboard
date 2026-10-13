import { Suspense } from "react";
import AsyncSection from "@/components/ui/AsyncSection";
import { CardSkeleton } from "@/components/ui/Skeleton";
import Skeleton from "@/components/ui/Skeleton";
import StatsGrid, { StatsGridSkeleton } from "@/components/StatsGrid";
import WelcomeHeading from "@/components/WelcomeHeading";
import DateRangePill from "@/components/DateRangePill";
import SalesChart from "@/components/SalesChart";
import OrderStatusChart from "@/components/OrderStatusChart";
import QuickActions from "@/components/QuickActions";
import RecentOrders from "@/components/RecentOrders";
import TopProducts from "@/components/TopProducts";
import LowStock from "@/components/LowStock";
import {
  getCurrentUser,
  getDashboardSummary,
  getLowStockProducts,
  getOrderStatus,
  getRecentOrders,
  getSalesOverview,
  getTopProducts,
} from "@/services/dashboard";

/**
 * Server Component. It fetches nothing itself: each panel is wrapped in its own
 * <Suspense>, so the page shell appears instantly and panels stream in as their
 * API calls finish. (Required by `cacheComponents: true` in next.config.ts.)
 * The sidebar and top bar come from the shared layout in this folder.
 */
export default function DashboardPage() {
  return (
    <>
      <section className="flex flex-wrap items-center justify-between gap-4">
        <Suspense fallback={<Skeleton className="h-16 w-72" />}>
          <AsyncSection load={getCurrentUser} title="welcome message">
            {(user) => <WelcomeHeading user={user} />}
          </AsyncSection>
        </Suspense>

        <Suspense fallback={<Skeleton className="h-12 w-64 rounded-xl" />}>
          <AsyncSection load={getDashboardSummary} title="date range">
            {(summary) => <DateRangePill {...summary.range} />}
          </AsyncSection>
        </Suspense>
      </section>

      <Suspense fallback={<StatsGridSkeleton />}>
        <AsyncSection load={getDashboardSummary} title="summary stats">
          {(summary) => <StatsGrid summary={summary} />}
        </AsyncSection>
      </Suspense>

      {/* Row 2: charts + quick actions */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 xl:grid-cols-[minmax(0,2.3fr)_minmax(0,1.2fr)_minmax(0,1fr)]">
        <div className="lg:col-span-2 xl:col-span-1">
          <Suspense fallback={<CardSkeleton rows={4} className="h-full" />}>
            <AsyncSection load={getSalesOverview} title="sales overview">
              {(data) => <SalesChart data={data} />}
            </AsyncSection>
          </Suspense>
        </div>

        <Suspense fallback={<CardSkeleton rows={4} />}>
          <AsyncSection load={getOrderStatus} title="order status">
            {(data) => <OrderStatusChart data={data} />}
          </AsyncSection>
        </Suspense>

        <QuickActions />
      </div>

      {/* Row 3: tables */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 xl:grid-cols-[minmax(0,2.4fr)_minmax(0,1.44fr)_minmax(0,1fr)]">
        <div className="lg:col-span-2 xl:col-span-1">
          <Suspense fallback={<CardSkeleton />}>
            <AsyncSection load={getRecentOrders} title="recent orders">
              {(orders) => <RecentOrders orders={orders} />}
            </AsyncSection>
          </Suspense>
        </div>

        <Suspense fallback={<CardSkeleton />}>
          <AsyncSection load={getTopProducts} title="top products">
            {(products) => <TopProducts products={products} />}
          </AsyncSection>
        </Suspense>

        <Suspense fallback={<CardSkeleton />}>
          <AsyncSection load={getLowStockProducts} title="low stock products">
            {(products) => <LowStock products={products} />}
          </AsyncSection>
        </Suspense>
      </div>
    </>
  );
}
