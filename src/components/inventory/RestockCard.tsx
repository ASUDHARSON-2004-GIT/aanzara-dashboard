import Link from "next/link";
import type { InventoryItem } from "@/types/inventory";
import Card from "../ui/Card";
import StatusBadge from "../ui/StatusBadge";
import Thumb from "../ui/Thumb";

/** The emptiest sellable products. "View all" opens the stock table already filtered. */
export default function RestockCard({ items }: { items: InventoryItem[] }) {
  return (
    <Card
      title="Needs Restock"
      action={
        <Link href="/inventory?stock=low_stock" className="text-xs font-medium text-orange-600 hover:underline">
          View all
        </Link>
      }
    >
      {items.length === 0 ? (
        <p className="py-8 text-center text-sm text-gray-500">Everything is above its reorder level.</p>
      ) : (
        <ul className="divide-y divide-gray-100">
          {items.map((item) => (
            <li key={item.productId} className="flex items-center gap-2.5 py-3 first:pt-0 last:pb-0">
              <Thumb name={item.name} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13px] font-medium leading-tight text-gray-900">{item.name}</p>
                <p className="text-xs text-gray-400">
                  {item.onHand} on hand · reorder at {item.reorderLevel}
                </p>
              </div>
              <StatusBadge status={item.stockStatus} />
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}