import Link from "next/link";
import { Eye, SearchX } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/format";
import { toOrderSearchParams } from "@/lib/orders-query";
import { paymentMethodLabels } from "@/lib/salse-labels";
import type { OrderList, OrderQuery } from "@/types/orders";
import Pagination from "../ui/Pagination";
import StatusBadge from "../ui/StatusBadge";
import { PaymentStatusBadge } from "../sales/SalesBadges";

interface OrdersTableProps {
  list: OrderList;
  query: OrderQuery;
}

export default function OrdersTable({ list, query }: OrdersTableProps) {
  const hrefForPage = (page: number) => {
    const params = toOrderSearchParams({ ...query, page }).toString();
    return params ? `/orders?${params}` : "/orders";
  };

  if (list.total === 0) {
    return (
      <div className="flex flex-col items-center gap-2 py-12 text-center">
        <SearchX className="text-gray-300" size={32} />
        <p className="text-sm font-semibold text-gray-900">No orders match your filters</p>
        <p className="text-xs text-gray-500">Try a different search or clear the filters.</p>
        <Link href="/orders" className="mt-2 text-xs font-medium text-orange-600 hover:underline">
          Clear filters
        </Link>
      </div>
    );
  }

  return (
    <>
      {/* The wrapper scrolls sideways on small screens instead of breaking the layout */}
      <div className="-mx-5 overflow-x-auto px-5">
        <table className="w-full min-w-[960px] text-left text-sm">
          <thead>
            <tr className="bg-gray-50 text-xs text-gray-500">
              <th className="rounded-l-lg px-2.5 py-2 font-medium">Order</th>
              <th className="px-2.5 py-2 font-medium">Customer</th>
              <th className="px-2.5 py-2 font-medium">Items</th>
              <th className="px-2.5 py-2 font-medium">Date</th>
              <th className="px-2.5 py-2 font-medium">Total</th>
              <th className="px-2.5 py-2 font-medium">Payment</th>
              <th className="px-2.5 py-2 font-medium">Status</th>
              <th className="rounded-r-lg px-2.5 py-2 text-center font-medium">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {list.items.map((order) => (
              <tr key={order.id}>
                <td className="whitespace-nowrap px-2.5 py-3">
                  <Link href={`/orders/${order.id}`} className="font-semibold text-gray-900 hover:text-orange-600">
                    {order.id}
                  </Link>
                </td>
                <td className="whitespace-nowrap px-2.5 py-3">
                  <p className="font-medium text-gray-900">{order.customer}</p>
                  <p className="text-xs text-gray-400">{order.city}</p>
                </td>
                <td className="px-2.5 py-3">
                  <p className="max-w-[200px] truncate text-gray-700">{order.firstItemName}</p>
                  <p className="text-xs text-gray-400">
                    {order.extraLines > 0 ? `+${order.extraLines} more · ` : ""}
                    {order.itemCount} {order.itemCount === 1 ? "unit" : "units"}
                  </p>
                </td>
                <td className="whitespace-nowrap px-2.5 py-3 text-gray-700">{formatDate(order.placedAt)}</td>
                <td className="whitespace-nowrap px-2.5 py-3 font-medium text-gray-900">
                  {formatCurrency(order.amount)}
                </td>
                <td className="whitespace-nowrap px-2.5 py-3">
                  <p className="mb-1 text-xs text-gray-500">{paymentMethodLabels[order.paymentMethod]}</p>
                  <PaymentStatusBadge status={order.paymentStatus} />
                </td>
                <td className="px-2.5 py-3">
                  <StatusBadge status={order.status} />
                </td>
                <td className="px-2.5 py-3 text-center">
                  <Link
                    href={`/orders/${order.id}`}
                    aria-label={`View order ${order.id}`}
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