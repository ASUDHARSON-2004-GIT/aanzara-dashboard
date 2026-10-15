import { IndianRupee, ShoppingCart, Store, Wallet } from "lucide-react";
import { formatCurrency, formatNumber } from "@/lib/format";
import type { WholesaleSummary } from "@/types/wholesale";
import MetricCard from "../ui/MetricCard";

export default function WholesaleStats({ summary }: { summary: WholesaleSummary }) {
  const { statusCounts } = summary;

  const cards = [
    {
      title: "Wholesale Accounts",
      value: formatNumber(summary.totalAccounts),
      hint: `${statusCounts.active} active, ${statusCounts.on_hold} on hold, ${statusCounts.inactive} inactive`,
      icon: Store,
      tone: "bg-orange-100 text-orange-600",
    },
    {
      title: "Wholesale Revenue",
      value: formatCurrency(summary.totalPurchased),
      hint: "Lifetime purchases of all accounts",
      icon: IndianRupee,
      tone: "bg-rose-100 text-rose-600",
    },
    {
      title: "Wholesale Orders",
      value: formatNumber(summary.totalOrders),
      hint: "Placed by wholesale accounts",
      icon: ShoppingCart,
      tone: "bg-purple-100 text-purple-600",
    },
    {
      title: "Avg. Order Value",
      value: formatCurrency(summary.averageOrderValue),
      hint: "Per wholesale order",
      icon: Wallet,
      tone: "bg-green-100 text-green-600",
    },
  ];

  // 4 across on wide screens, same as the dashboard stats.
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <MetricCard key={card.title} {...card} />
      ))}
    </div>
  );
}