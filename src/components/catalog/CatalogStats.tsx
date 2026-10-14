import { CircleCheck, LayoutGrid, Package, TriangleAlert } from "lucide-react";
import { formatNumber } from "@/lib/format";
import type { CatalogSummary } from "@/types/catalog";
import MetricCard from "../ui/MetricCard";

export default function CatalogStats({ summary }: { summary: CatalogSummary }) {
  const cards = [
    {
      title: "Total Products",
      value: summary.totalProducts,
      hint: "All statuses",
      icon: Package,
      tone: "bg-purple-100 text-purple-600",
    },
    {
      title: "Active Products",
      value: summary.activeProducts,
      hint: `${summary.draftProducts} draft · ${summary.archivedProducts} archived`,
      icon: CircleCheck,
      tone: "bg-green-100 text-green-600",
    },
    {
      title: "Low Stock",
      value: summary.lowStockProducts,
      hint: "At or below reorder level",
      icon: TriangleAlert,
      tone: "bg-orange-100 text-orange-600",
    },
    {
      title: "Categories",
      value: summary.totalCategories,
      hint: `${summary.totalBrands} brands`,
      icon: LayoutGrid,
      tone: "bg-rose-100 text-rose-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map(({ title, value, hint, icon, tone }) => (
        <MetricCard key={title} title={title} value={formatNumber(value)} hint={hint} icon={icon} tone={tone} />
      ))}
    </div>
  );
}
