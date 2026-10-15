import { CalendarDays, ClipboardList, IndianRupee, Wallet } from "lucide-react";
import { formatCurrency, formatDate, formatNumber } from "@/lib/format";
import type { CustomerDetail } from "@/types/customers";
import MetricCard from "../ui/MetricCard";

export default function CustomerDetailStats({ customer }: { customer: CustomerDetail }) {
  const cards = [
    {
      title: "Total Orders",
      value: formatNumber(customer.totalOrders),
      hint: customer.cancelledOrders > 0 ? `${customer.cancelledOrders} cancelled` : "None cancelled",
      icon: ClipboardList,
      tone: "bg-purple-100 text-purple-600",
    },
    {
      title: "Total Spent",
      value: formatCurrency(customer.totalSpent),
      hint: "Cancelled orders not counted",
      icon: IndianRupee,
      tone: "bg-rose-100 text-rose-600",
    },
    {
      title: "Avg. Order Value",
      value: formatCurrency(customer.averageOrderValue),
      hint: "Per completed order",
      icon: Wallet,
      tone: "bg-yellow-100 text-yellow-600",
    },
    {
      title: "Last Order",
      value: customer.lastOrderAt ? formatDate(customer.lastOrderAt) : "No orders",
      hint: customer.lastOrderAt ? "Most recent purchase" : "Has not ordered yet",
      icon: CalendarDays,
      tone: "bg-green-100 text-green-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {cards.map((card) => (
        <MetricCard key={card.title} {...card} />
      ))}
    </div>
  );
}