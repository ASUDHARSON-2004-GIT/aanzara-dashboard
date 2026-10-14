import type { OrderStatus, StockStatus } from "@/types/dashboard";
import type { ProductStatus, ProductStockStatus } from "@/types/catalog";

const styles = {
  delivered: { label: "Delivered", className: "bg-green-50 text-green-600" },
  processing: { label: "Processing", className: "bg-orange-50 text-orange-500" },
  shipped: { label: "Shipped", className: "bg-yellow-50 text-yellow-600" },
  cancelled: { label: "Cancelled", className: "bg-red-50 text-red-500" },
  in_stock: { label: "In Stock", className: "bg-green-50 text-green-600" },
  low_stock: { label: "Low Stock", className: "bg-orange-50 text-orange-500" },
  out_of_stock: { label: "Out of Stock", className: "bg-red-50 text-red-500" },
  active: { label: "Active", className: "bg-green-50 text-green-600" },
  draft: { label: "Draft", className: "bg-blue-50 text-blue-600" },
  archived: { label: "Archived", className: "bg-gray-100 text-gray-500" },
} satisfies Record<
  OrderStatus | StockStatus | ProductStockStatus | ProductStatus,
  { label: string; className: string }
>;

export default function StatusBadge({
  status,
}: {
  status: OrderStatus | StockStatus | ProductStockStatus | ProductStatus;
}) {
  const { label, className } = styles[status];
  return (
    <span
      className={`inline-block whitespace-nowrap rounded-md px-2.5 py-1 text-xs font-medium ${className}`}
    >
      {label}
    </span>
  );
}
