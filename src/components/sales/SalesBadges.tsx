import { couponStatusLabels, paymentStatusLabels } from "@/lib/salse-labels";
import type { CouponStatus, PaymentStatus } from "@/types/sales";

const badgeBase = "inline-block whitespace-nowrap rounded-md px-2.5 py-1 text-xs font-medium";

const paymentStyles: Record<PaymentStatus, string> = {
  paid: "bg-green-50 text-green-600",
  pending: "bg-orange-50 text-orange-500",
  refunded: "bg-blue-50 text-blue-600",
};

const couponStyles: Record<CouponStatus, string> = {
  active: "bg-green-50 text-green-600",
  scheduled: "bg-blue-50 text-blue-600",
  expired: "bg-gray-100 text-gray-500",
  disabled: "bg-red-50 text-red-500",
};

/** Order status already has StatusBadge; these two cover the sales-only statuses. */
export function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
  return <span className={`${badgeBase} ${paymentStyles[status]}`}>{paymentStatusLabels[status]}</span>;
}

export function CouponStatusBadge({ status }: { status: CouponStatus }) {
  return <span className={`${badgeBase} ${couponStyles[status]}`}>{couponStatusLabels[status]}</span>;
}