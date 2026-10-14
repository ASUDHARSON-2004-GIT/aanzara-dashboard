import { Boxes, IndianRupee, PackageX, TriangleAlert } from "lucide-react";
import { formatCurrency, formatNumber } from "@/lib/format";
import type { InventorySummary } from "@/types/inventory";
import MetricCard from "../ui/MetricCard";

export default function InventoryStats({ summary }: { summary: InventorySummary }) {
  const cards = [
    {
      title: "Units on Hand",
      value: formatNumber(summary.totalUnits),
      hint: `${formatNumber(summary.reservedUnits)} reserved for orders`,
      icon: Boxes,
      tone: "bg-purple-100 text-purple-600",
    },
    {
      title: "Stock Value",
      value: formatCurrency(summary.stockValue),
      hint: "At cost price",
      icon: IndianRupee,
      tone: "bg-green-100 text-green-600",
    },
    {
      title: "Low Stock",
      value: formatNumber(summary.lowStockItems),
      hint: "At or below reorder level",
      icon: TriangleAlert,
      tone: "bg-orange-100 text-orange-600",
    },
    {
      title: "Out of Stock",
      value: formatNumber(summary.outOfStockItems),
      hint: `${formatNumber(summary.trackedProducts)} products tracked`,
      icon: PackageX,
      tone: "bg-rose-100 text-rose-600",
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