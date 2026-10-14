import { CircleX, ClipboardList, Clock, PackageCheck, Truck, Wallet } from "lucide-react";
import { formatDate, formatNumber } from "@/lib/format";
import type { OrderSummary } from "@/types/orders";
import MetricCard from "../ui/MetricCard";

export default function OrderStats({ summary }: { summary: OrderSummary }) {
  const { statusCounts } = summary;

  const cards = [
    {
      title: "Total Orders",
      value: summary.totalOrders,
      hint: `${formatDate(summary.range.from)} to ${formatDate(summary.range.to)}`,
      icon: ClipboardList,
      tone: "bg-purple-100 text-purple-600",
    },
    {
      title: "Processing",
      value: statusCounts.processing,
      hint: "Waiting to be shipped",
      icon: Clock,
      tone: "bg-orange-100 text-orange-600",
    },
    {
      title: "Shipped",
      value: statusCounts.shipped,
      hint: "On the way to customers",
      icon: Truck,
      tone: "bg-yellow-100 text-yellow-600",
    },
    {
      title: "Delivered",
      value: statusCounts.delivered,
      hint: "Successfully completed",
      icon: PackageCheck,
      tone: "bg-green-100 text-green-600",
    },
    {
      title: "Cancelled",
      value: statusCounts.cancelled,
      hint: "Not counted as sales",
      icon: CircleX,
      tone: "bg-red-100 text-red-600",
    },
    {
      title: "Pending Payment",
      value: summary.pendingPayments ?? 0,
      hint: "Awaiting payment",
      icon: Wallet,
      tone: "bg-blue-100 text-blue-600",
    },
  ];

  // 3 across on wide screens makes two even rows of three.
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {cards.map(({ title, value, hint, icon, tone }) => (
        <MetricCard key={title} title={title} value={formatNumber(value)} hint={hint} icon={icon} tone={tone} />
      ))}
    </div>
  );
}