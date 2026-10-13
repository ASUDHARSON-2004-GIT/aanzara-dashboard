import type { LowStockProduct } from "@/types/dashboard";
import Card from "./ui/Card";
import Thumb from "./ui/Thumb";
import ViewAllLink from "./ui/ViewAllLink";

export default function LowStock({ products }: { products: LowStockProduct[] }) {
  return (
    <Card title="Low Stock Products" action={<ViewAllLink href="/inventory" />}>
      <ul className="divide-y divide-gray-100">
        {products.map((product) => (
          <li key={product.id} className="flex items-center gap-2.5 py-3 first:pt-0 last:pb-0">
            <Thumb name={product.name} imageUrl={product.imageUrl} />
            <span className="flex-1 text-[13px] font-medium leading-tight text-gray-900">{product.name}</span>
            <span className="shrink-0 rounded-md bg-red-50 px-2.5 py-1 text-xs font-medium text-red-500">
              {product.unitsLeft} left
            </span>
          </li>
        ))}
      </ul>
    </Card>
  );
}
