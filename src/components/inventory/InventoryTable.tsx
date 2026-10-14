import Link from "next/link";
import { SearchX } from "lucide-react";
import { toInventorySearchParams } from "@/lib/inventory-query";
import { formatCurrency, formatNumber } from "@/lib/format";
import type { InventoryList, InventoryQuery } from "@/types/inventory";
import Pagination from "../ui/Pagination";
import StatusBadge from "../ui/StatusBadge";
import Thumb from "../ui/Thumb";

interface InventoryTableProps {
  list: InventoryList;
  query: InventoryQuery;
}

export default function InventoryTable({ list, query }: InventoryTableProps) {
  const hrefForPage = (page: number) => {
    const params = toInventorySearchParams({ ...query, page }).toString();
    return params ? `/inventory?${params}` : "/inventory";
  };

  if (list.total === 0) {
    return (
      <div className="flex flex-col items-center gap-2 py-12 text-center">
        <SearchX className="text-gray-300" size={32} />
        <p className="text-sm font-semibold text-gray-900">No stock matches your filters</p>
        <p className="text-xs text-gray-500">Try a different search or clear the filters.</p>
        <Link href="/inventory" className="mt-2 text-xs font-medium text-orange-600 hover:underline">
          Clear filters
        </Link>
      </div>
    );
  }

  return (
    <>
      {/* The wrapper scrolls sideways on small screens instead of breaking the layout */}
      <div className="-mx-5 overflow-x-auto px-5">
        <table className="w-full min-w-[860px] text-left text-sm">
          <thead>
            <tr className="bg-gray-50 text-xs text-gray-500">
              <th className="rounded-l-lg px-2.5 py-2 font-medium">Product</th>
              <th className="px-2.5 py-2 font-medium">On hand</th>
              <th className="px-2.5 py-2 font-medium">Reserved</th>
              <th className="px-2.5 py-2 font-medium">Available</th>
              <th className="px-2.5 py-2 font-medium">Reorder at</th>
              <th className="px-2.5 py-2 font-medium">Value</th>
              <th className="rounded-r-lg px-2.5 py-2 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {list.items.map((item) => (
              <tr key={item.productId}>
                <td className="px-2.5 py-3">
                  <div className="flex items-center gap-3">
                    <Thumb name={item.name} />
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-900">{item.name}</p>
                      <p className="text-xs text-gray-400">
                        {item.sku} · {item.categoryName}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="whitespace-nowrap px-2.5 py-3">
                  <p className="font-medium text-gray-900">{formatNumber(item.onHand)}</p>
                  {/* The split only makes sense when the table covers every warehouse */}
                  {!query.warehouse && item.warehouses.length > 1 && (
                    <p className="text-xs text-gray-400">
                      {item.warehouses.map((w) => `${w.city} ${formatNumber(w.onHand)}`).join(" · ")}
                    </p>
                  )}
                </td>
                <td className="whitespace-nowrap px-2.5 py-3 text-gray-700">{formatNumber(item.reserved)}</td>
                <td className="whitespace-nowrap px-2.5 py-3 font-medium text-gray-900">
                  {formatNumber(item.available)}
                </td>
                <td className="whitespace-nowrap px-2.5 py-3 text-gray-700">{formatNumber(item.reorderLevel)}</td>
                <td className="whitespace-nowrap px-2.5 py-3 text-gray-700">{formatCurrency(item.stockValue)}</td>
                <td className="px-2.5 py-3">
                  <StatusBadge status={item.stockStatus} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination
        page={list.page}
        totalPages={list.totalPages}
        total={list.total}
        pageSize={list.pageSize}
        hrefForPage={hrefForPage}
      />
    </>
  );
}