import { formatCurrency } from "@/lib/format";
import { paymentMethodLabels } from "@/lib/salse-labels";
import type { OrderDetail } from "@/types/orders";
import Card from "../ui/Card";
import { PaymentStatusBadge } from "../sales/SalesBadges";

/** The money side of an order: how the total is made up, and how it was paid. */
export default function OrderSummaryCard({ order }: { order: OrderDetail }) {
  return (
    <Card title="Payment Summary">
      <dl className="space-y-3 text-sm">
        <div className="flex justify-between gap-3">
          <dt className="text-gray-500">Subtotal</dt>
          <dd className="font-medium text-gray-900">{formatCurrency(order.subtotal)}</dd>
        </div>

        {order.discount > 0 && (
          <div className="flex justify-between gap-3">
            <dt className="text-gray-500">Discount{order.couponCode ? ` (${order.couponCode})` : ""}</dt>
            <dd className="font-medium text-green-600">-{formatCurrency(order.discount)}</dd>
          </div>
        )}

        <div className="flex justify-between gap-3">
          <dt className="text-gray-500">Shipping</dt>
          <dd className="font-medium text-gray-900">{order.shipping > 0 ? formatCurrency(order.shipping) : "Free"}</dd>
        </div>

        <div className="flex justify-between gap-3 border-t border-gray-100 pt-3 text-base">
          <dt className="font-bold text-gray-900">Total</dt>
          <dd className="font-bold text-gray-900">{formatCurrency(order.amount)}</dd>
        </div>
      </dl>

      <div className="mt-4 flex items-center justify-between gap-3 border-t border-gray-100 pt-4 text-sm">
        <span className="text-gray-500">{paymentMethodLabels[order.paymentMethod]}</span>
        <PaymentStatusBadge status={order.paymentStatus} />
      </div>
    </Card>
  );
}