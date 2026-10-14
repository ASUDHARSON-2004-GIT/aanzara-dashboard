import { formatCurrency } from "@/lib/format";
import type { OrderStatus } from "@/types/dashboard";
import type { CouponStatus, CouponType, PaymentMethod, PaymentStatus } from "@/types/sales";

export const orderStatusLabels: Record<OrderStatus, string> = {
  delivered: "Delivered",
  processing: "Processing",
  shipped: "Shipped",
  cancelled: "Cancelled",
};

export const paymentMethodLabels: Record<PaymentMethod, string> = {
  upi: "UPI",
  card: "Card",
  netbanking: "Net Banking",
  cod: "Cash on Delivery",
};

export const paymentStatusLabels: Record<PaymentStatus, string> = {
  paid: "Paid",
  pending: "Pending",
  refunded: "Refunded",
};

export const couponStatusLabels: Record<CouponStatus, string> = {
  active: "Active",
  scheduled: "Scheduled",
  expired: "Expired",
  disabled: "Disabled",
};

/** Plain-language description of what a coupon gives, for example "10% off" or a flat amount off. */
export function describeOffer(type: CouponType, value: number) {
  if (type === "percentage") return `${value}% off`;
  if (type === "flat") return `${formatCurrency(value)} off`;
  return "Free shipping";
}