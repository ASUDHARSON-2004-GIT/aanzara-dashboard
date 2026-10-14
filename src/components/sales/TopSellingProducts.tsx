import { formatCurrency, formatNumber } from "@/lib/format";
import type { ProductSales } from "@/types/sales";
import RankedListCard from "./RankedListCard";

export default function TopSellingProducts({ products }: { products: ProductSales[] }) {
  const mostUnits = Math.max(...products.map((product) => product.unitsSold), 1);

  return (
    <RankedListCard
      title="Top Selling Products"
      items={products.map((product) => ({
        key: product.productId,
        label: product.name,
        detail: `${formatNumber(product.unitsSold)} units sold`,
        value: formatCurrency(product.revenue),
        share: product.unitsSold / mostUnits,
      }))}
    />
  );
}