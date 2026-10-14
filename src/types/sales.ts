import type { OrderStatus } from "@/types/dashboard";

export type PaymentMethod = "upi" | "card" | "netbanking" | "cod";
export type PaymentStatus = "paid" | "pending" | "refunded";

/** Headline numbers at the top of the Sales page. Cancelled orders are not counted as sales. */
export interface SalesSummary {
  range: { from: string; to: string }; // ISO dates
  totalRevenue: number; // INR
  totalOrders: number;
  averageOrderValue: number; // INR
  totalDiscount: number; // INR given away through coupons
  cancelledOrders: number;
  couponOrders: number; // orders that used a coupon
}

export interface PaymentMethodSales {
  method: PaymentMethod;
  orders: number;
  revenue: number;
}

export interface ProductSales {
  productId: string;
  name: string;
  unitsSold: number;
  revenue: number;
}

export interface RegionSales {
  state: string;
  orders: number;
  revenue: number;
}

export type CouponStatus = "active" | "scheduled" | "expired" | "disabled";
export type CouponType = "percentage" | "flat" | "free_shipping";

export interface CouponPerformance {
  id: string;
  code: string;
  description: string;
  type: CouponType;
  value: number;
  status: CouponStatus;
  usedCount: number; // lifetime usage recorded on the coupon
  usageLimit: number; // 0 means unlimited
  orders: number; // orders in the sales data that used this coupon
  discountGiven: number; // INR discounted on those orders
}

/** One row of the transactions table. */
export interface SaleRow {
  id: string; // "AZ1248"
  customer: string;
  placedAt: string; // ISO date
  itemCount: number;
  amount: number; // INR
  discount: number; // INR
  couponCode: string | null;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  status: OrderStatus;
  city: string;
}

export interface SaleList {
  items: SaleRow[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

/** What the transactions table can be filtered by. All of it lives in the page URL. */
export interface SalesQuery {
  search?: string;
  status?: OrderStatus;
  method?: PaymentMethod;
  payment?: PaymentStatus;
  page: number;
}