import { Suspense } from "react";
import AsyncSection from "@/components/ui/AsyncSection";
import { CardSkeleton } from "@/components/ui/Skeleton";
import Skeleton from "@/components/ui/Skeleton";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import StatsGrid, { StatsGridSkeleton } from "@/components/StatsGrid";
import DateRangePill from "@/components/DateRangePill";
import SalesChart from "@/components/SalesChart";
import OrderStatusChart from "@/components/OrderStatusChart";
import QuickActions from "@/components/QuickActions";
import RecentOrders from "@/components/RecentOrders";
import TopProducts from "@/components/TopProducts";
import LowStock from "@/components/LowStock";
import {
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
 */
export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-[#f5f7fa]">
      <Sidebar />

      <div className="min-h-screen lg:pl-[260px]">
        <Topbar />

        <main className="space-y-5 p-4 sm:p-6 lg:p-8">
          <section className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                Welcome Back, Sujith! 👋
              </h2>
              <p className="mt-1 text-sm text-gray-500 sm:text-base">
                Here&apos;s what&apos;s happening with your store today.
              </p>
            </div>

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
        </main>
      </div>
    </div>
  );
}
