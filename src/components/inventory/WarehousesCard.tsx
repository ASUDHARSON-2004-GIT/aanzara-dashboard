import { formatNumber } from "@/lib/format";
import type { WarehouseSummary } from "@/types/inventory";
import RankedListCard from "../sales/RankedListCard";

/** How full each warehouse is. Reuses the bar list from the Sales page. */
export default function WarehousesCard({ warehouses }: { warehouses: WarehouseSummary[] }) {
  const items = warehouses.map((warehouse) => {
    const used = warehouse.capacity > 0 ? warehouse.unitsOnHand / warehouse.capacity : 0;
    return {
      key: warehouse.id,
      label: warehouse.name,
      detail: `${warehouse.city}, ${warehouse.state} · ${formatNumber(warehouse.unitsOnHand)} of ${formatNumber(warehouse.capacity)} units`,
      value: `${Math.round(used * 100)}% full`,
      share: Math.min(used, 1),
    };
  });

  return <RankedListCard title="Warehouses" items={items} />;
}