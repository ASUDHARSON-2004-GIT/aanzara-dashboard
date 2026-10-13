import { IndianRupee, Package, ShoppingCart, Users } from "lucide-react";
import { formatCurrency, formatNumber } from "@/lib/format";
import type { DashboardSummary } from "@/types/dashboard";
import StatCard from "./StatCard";
import Skeleton from "./ui/Skeleton";

export default function StatsGrid({ summary }: { summary: DashboardSummary }) {
  // Config lives next to the data it maps: adding a 5th card = one new line here.
  const cards = [
    { title: "Total Orders", metric: summary.totalOrders, format: formatNumber, icon: ShoppingCart, tone: "bg-orange-100 text-orange-600" },
    { title: "Total Revenue", metric: summary.totalRevenue, format: formatCurrency, icon: IndianRupee, tone: "bg-rose-100 text-rose-600" },
    { title: "Total Products", metric: summary.totalProducts, format: formatNumber, icon: Package, tone: "bg-purple-100 text-purple-600" },
    { title: "Total Customers", metric: summary.totalCustomers, format: formatNumber, icon: Users, tone: "bg-green-100 text-green-600" },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map(({ title, metric, format, icon, tone }) => (
        <StatCard
          key={title}
          title={title}
          value={format(metric.value)}
          changePercent={metric.changePercent}
          comparisonLabel={summary.comparisonLabel}
          icon={icon}
          tone={tone}
        />
      ))}
    </div>
  );
}

export function StatsGridSkeleton() {
  return (
    <div role="status" aria-label="Loading stats" className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: 4 }, (_, i) => (
        <Skeleton key={i} className="h-[116px] rounded-2xl" />
      ))}
    </div>
  );
}
