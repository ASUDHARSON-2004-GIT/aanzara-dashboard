import Link from "next/link";
import { Eye } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/format";
import { paymentMethodLabels } from "@/lib/salse-labels";
import type { CustomerDetail } from "@/types/customers";
import Card from "../ui/Card";
import StatusBadge from "../ui/StatusBadge";
import { PaymentStatusBadge } from "../sales/SalesBadges";

/** The customer's order history, newest first. Each order links to its detail page. */
export default function CustomerOrdersCard({ customer }: { customer: CustomerDetail }) {
  const { orders } = customer;

  return (
    <Card
      title={`Order History (${orders.length})`}
      action={
        orders.length > 0 ? (
          <Link
            href={`/orders?search=${encodeURIComponent(customer.name)}`}
            className="text-xs font-medium text-orange-600 hover:underline"
          >
            View in Orders
          </Link>
        ) : undefined
      }
    >
      {orders.length === 0 ? (
        <p className="py-8 text-center text-sm text-gray-500">This customer has not placed any orders yet.</p>
      ) : (
        <div className="-mx-5 overflow-x-auto px-5">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="bg-gray-50 text-xs text-gray-500">
                <th className="rounded-l-lg px-2.5 py-2 font-medium">Order</th>
                <th className="px-2.5 py-2 font-medium">Date</th>
                <th className="px-2.5 py-2 font-medium">Items</th>
                <th className="px-2.5 py-2 font-medium">Total</th>
                <th className="px-2.5 py-2 font-medium">Payment</th>
                <th className="px-2.5 py-2 font-medium">Status</th>
                <th className="rounded-r-lg px-2.5 py-2 text-center font-medium">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.map((order) => (
                <tr key={order.id}>
                  <td className="whitespace-nowrap px-2.5 py-3">
                    <Link href={`/orders/${order.id}`} className="font-semibold text-gray-900 hover:text-orange-600">
                      {order.id}
                    </Link>
                  </td>
                  <td className="whitespace-nowrap px-2.5 py-3 text-gray-700">{formatDate(order.placedAt)}</td>
                  <td className="px-2.5 py-3">
                    <p className="max-w-[180px] truncate text-gray-700">{order.firstItemName}</p>
                    <p className="text-xs text-gray-400">
                      {order.extraLines > 0 ? `+${order.extraLines} more · ` : ""}
                      {order.itemCount} {order.itemCount === 1 ? "unit" : "units"}
                    </p>
                  </td>
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
      )}
    </Card>
  );
}