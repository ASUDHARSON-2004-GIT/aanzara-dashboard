import Link from "next/link";
import { Eye, SearchX } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/format";
import { paymentMethodLabels } from "@/lib/salse-labels";
import { toSalesSearchParams } from "@/lib/sales-query";
import type { SaleList, SalesQuery } from "@/types/sales";
import Pagination from "../ui/Pagination";
import StatusBadge from "../ui/StatusBadge";
import { PaymentStatusBadge } from "./SalesBadges";

interface SalesTableProps {
  list: SaleList;
  query: SalesQuery;
}

export default function SalesTable({ list, query }: SalesTableProps) {
  const hrefForPage = (page: number) => {
    const params = toSalesSearchParams({ ...query, page }).toString();
    return params ? `/sales?${params}` : "/sales";
  };

  if (list.total === 0) {
    return (
      <div className="flex flex-col items-center gap-2 py-12 text-center">
        <SearchX className="text-gray-300" size={32} />
        <p className="text-sm font-semibold text-gray-900">No sales match your filters</p>
        <p className="text-xs text-gray-500">Try a different search or clear the filters.</p>
        <Link href="/sales" className="mt-2 text-xs font-medium text-orange-600 hover:underline">
          Clear filters
        </Link>
      </div>
    );
  }

  return (
    <>
      {/* The wrapper scrolls sideways on small screens instead of breaking the layout */}
      <div className="-mx-5 overflow-x-auto px-5">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead>
            <tr className="bg-gray-50 text-xs text-gray-500">
              <th className="rounded-l-lg px-2.5 py-2 font-medium">Order</th>
              <th className="px-2.5 py-2 font-medium">Customer</th>
              <th className="px-2.5 py-2 font-medium">Date</th>
              <th className="px-2.5 py-2 font-medium">Amount</th>
              <th className="px-2.5 py-2 font-medium">Payment</th>
              <th className="px-2.5 py-2 font-medium">Order status</th>
              <th className="rounded-r-lg px-2.5 py-2 text-center font-medium">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {list.items.map((sale) => (
              <tr key={sale.id}>
                <td className="whitespace-nowrap px-2.5 py-3">
                  <p className="font-semibold text-gray-900">{sale.id}</p>
                  <p className="text-xs text-gray-400">
                    {sale.itemCount} {sale.itemCount === 1 ? "item" : "items"}
                  </p>
                </td>
                <td className="whitespace-nowrap px-2.5 py-3">
                  <p className="font-medium text-gray-900">{sale.customer}</p>
                  <p className="text-xs text-gray-400">{sale.city}</p>
                </td>
                <td className="whitespace-nowrap px-2.5 py-3 text-gray-700">{formatDate(sale.placedAt)}</td>
                <td className="whitespace-nowrap px-2.5 py-3">
                  <p className="font-medium text-gray-900">{formatCurrency(sale.amount)}</p>
                  {sale.discount > 0 && (
                    <p className="text-xs text-green-600">
                      Saved {formatCurrency(sale.discount)}
                      {sale.couponCode ? ` with ${sale.couponCode}` : ""}
                    </p>
                  )}
                </td>
                <td className="whitespace-nowrap px-2.5 py-3">
                  <p className="mb-1 text-xs text-gray-500">{paymentMethodLabels[sale.paymentMethod]}</p>
                  <PaymentStatusBadge status={sale.paymentStatus} />
                </td>
                <td className="px-2.5 py-3">
                  <StatusBadge status={sale.status} />
                </td>
                <td className="px-2.5 py-3 text-center">
                  <Link
                    href={`/orders/${sale.id}`}
                    aria-label={`View order ${sale.id}`}
                    className="inline-flex rounded-lg border border-gray-200 p-2 text-gray-600 hover:bg-gray-50"
                  >
                    <Eye size={16} />
                  </Link>
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