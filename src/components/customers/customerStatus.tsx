import { IndianRupee, Repeat, Store, UserRound, Users, Wallet } from "lucide-react";
import { formatCurrency, formatDate, formatNumber } from "@/lib/format";
import type { CustomerSummary } from "@/types/customers";
import MetricCard from "../ui/MetricCard";

export default function CustomerStats({ summary }: { summary: CustomerSummary }) {
  const cards = [
    {
      title: "Total Customers",
      value: formatNumber(summary.totalCustomers),
      hint: `Joined ${formatDate(summary.range.from)} to ${formatDate(summary.range.to)}`,
      icon: Users,
      tone: "bg-purple-100 text-purple-600",
    },
    {
      title: "Retail",
      value: formatNumber(summary.retailCount),
      hint: "Individual shoppers",
      icon: UserRound,
      tone: "bg-blue-100 text-blue-600",
    },
    {
      title: "Wholesale",
      value: formatNumber(summary.wholesaleCount),
      hint: "Bulk buyers",
      icon: Store,
      tone: "bg-orange-100 text-orange-600",
    },
    {
      title: "Repeat Customers",
      value: formatNumber(summary.repeatCustomers),
      hint: "Placed 2 or more orders",
      icon: Repeat,
      tone: "bg-green-100 text-green-600",
    },
    {
      title: "Total Spent",
      value: formatCurrency(summary.totalSpent),
      hint: "Cancelled orders not counted",
      icon: IndianRupee,
      tone: "bg-rose-100 text-rose-600",
    },
    {
      title: "Avg. Spend",
      value: formatCurrency(summary.averageSpent),
      hint: "Per customer",
      icon: Wallet,
      tone: "bg-yellow-100 text-yellow-600",
    },
  ];

  // 3 across on wide screens makes two even rows of three (same as Orders).
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {cards.map((card) => (
        <MetricCard key={card.title} {...card} />
      ))}
    </div>
  );
}