import { IndianRupee, Receipt, ShoppingCart, Tag } from "lucide-react";
import { formatCurrency, formatDate, formatNumber } from "@/lib/format";
import type { SalesSummary } from "@/types/sales";
import MetricCard from "../ui/MetricCard";

export default function SalesStats({ summary }: { summary: SalesSummary }) {
  const cards = [
    {
      title: "Total Revenue",
      value: formatCurrency(summary.totalRevenue),
      hint: `${formatDate(summary.range.from)} to ${formatDate(summary.range.to)}`,
      icon: IndianRupee,
      tone: "bg-rose-100 text-rose-600",
    },
    {
      title: "Total Orders",
      value: formatNumber(summary.totalOrders),
      hint: `${summary.cancelledOrders} cancelled, not counted`,
      icon: ShoppingCart,
      tone: "bg-orange-100 text-orange-600",
    },
    {
      title: "Average Order Value",
      value: formatCurrency(summary.averageOrderValue),
      hint: "Per completed order",
      icon: Receipt,
      tone: "bg-purple-100 text-purple-600",
    },
    {
      title: "Discounts Given",
      value: formatCurrency(summary.totalDiscount),
      hint: `${summary.couponOrders} orders used a coupon`,
      icon: Tag,
      tone: "bg-green-100 text-green-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map(({ title, value, hint, icon, tone }) => (
        <MetricCard key={title} title={title} value={value} hint={hint} icon={icon} tone={tone} />
      ))}
    </div>
  );
}