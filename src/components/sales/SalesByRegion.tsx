import { formatCurrency, formatNumber } from "@/lib/format";
import type { RegionSales } from "@/types/sales";
import RankedListCard from "./RankedListCard";

export default function SalesByRegion({ regions }: { regions: RegionSales[] }) {
  const highestRevenue = Math.max(...regions.map((region) => region.revenue), 1);

  return (
    <RankedListCard
      title="Sales by State"
      items={regions.map((region) => ({
        key: region.state,
        label: region.state,
        detail: `${formatNumber(region.orders)} orders`,
        value: formatCurrency(region.revenue),
        share: region.revenue / highestRevenue,
      }))}
    />
  );
}