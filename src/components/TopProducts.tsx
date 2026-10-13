import { formatNumber } from "@/lib/format";
import type { TopProduct } from "@/types/dashboard";
import Card from "./ui/Card";
import StatusBadge from "./ui/StatusBadge";
import Thumb from "./ui/Thumb";
import ViewAllLink from "./ui/ViewAllLink";

export default function TopProducts({ products }: { products: TopProduct[] }) {
  return (
    <Card title="Top Selling Products" action={<ViewAllLink href="/catalog/products" />}>
      <div className="-mx-5 overflow-x-auto px-5">
        <table className="w-full min-w-[320px] text-left text-[13px]">
          <thead>
            <tr className="bg-gray-50 text-xs text-gray-500">
              <th className="rounded-l-lg px-2.5 py-2 font-medium">Product</th>
              <th className="px-2.5 py-2 font-medium">Sales</th>
              <th className="rounded-r-lg px-2.5 py-2 font-medium">Stock</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {products.map((product) => (
              <tr key={product.id}>
                <td className="px-2.5 py-3">
                  <div className="flex items-center gap-3">
                    <Thumb name={product.name} imageUrl={product.imageUrl} />
                    <span className="font-medium text-gray-900">{product.name}</span>
                  </div>
                </td>
                <td className="px-2.5 py-3 text-gray-700">{formatNumber(product.unitsSold)}</td>
                <td className="px-2.5 py-3">
                  <StatusBadge status={product.stockStatus} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
