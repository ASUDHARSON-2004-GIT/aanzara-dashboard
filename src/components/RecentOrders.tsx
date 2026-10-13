import { Eye } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/format";
import type { RecentOrder } from "@/types/dashboard";
import Card from "./ui/Card";
import StatusBadge from "./ui/StatusBadge";
import ViewAllLink from "./ui/ViewAllLink";
import Thumb from "./ui/Thumb";

export default function RecentOrders({ orders }: { orders: RecentOrder[] }) {
  return (
    <Card title="Recent Orders" action={<ViewAllLink href="/orders" />}>
      {/* The wrapper scrolls sideways on small screens instead of breaking the layout */}
      <div className="-mx-5 overflow-x-auto px-5">
        <table className="w-full min-w-[540px] text-left text-sm">
          <thead>
            <tr className="bg-gray-50 text-xs text-gray-500">
              <th className="rounded-l-lg px-2.5 py-2 font-medium">#</th>
              <th className="px-2.5 py-2 font-medium">Order</th>
              <th className="px-2.5 py-2 font-medium">Customer</th>
              <th className="px-2.5 py-2 font-medium">Date</th>
              <th className="px-2.5 py-2 font-medium">Amount</th>
              <th className="px-2.5 py-2 font-medium">Status</th>
              <th className="rounded-r-lg px-2.5 py-2 text-center font-medium">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {orders.map((order) => (
              <tr key={order.id}>
                <td className="px-2.5 py-3">
                  <Thumb name={order.customer} imageUrl={order.imageUrl} />
                </td>
                <td className="whitespace-nowrap px-2.5 py-3 font-semibold text-gray-900">#{order.id}</td>
                <td className="whitespace-nowrap px-2.5 py-3 text-gray-700">{order.customer}</td>
                <td className="whitespace-nowrap px-2.5 py-3 text-gray-500">{formatDate(order.placedAt)}</td>
                <td className="whitespace-nowrap px-2.5 py-3 font-medium text-gray-900">
                  {formatCurrency(order.amount)}
                </td>
                <td className="px-2.5 py-3">
                  <StatusBadge status={order.status} />
                </td>
                <td className="px-2.5 py-3 text-center">
                  <a
                    href={`/orders/${order.id}`}
                    aria-label={`View order ${order.id}`}
                    className="inline-flex rounded-lg border border-gray-200 p-2 text-gray-600 hover:bg-gray-50"
                  >
                    <Eye size={16} />
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
