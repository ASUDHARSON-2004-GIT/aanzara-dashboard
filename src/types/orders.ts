/**
 * API contract for the Orders module (the JSON shapes the backend must return).
 * Same rules as types/catalog.ts: raw numbers, ISO dates, money in INR.
 */

import type { OrderStatus } from "@/types/dashboard";
import type { PaymentMethod, PaymentStatus } from "@/types/sales";

/** Headline numbers for the Orders page. Every order counts here, cancelled ones included. */
export interface OrderSummary {
  range: { from: string; to: string }; // ISO dates
  totalOrders: number;
  statusCounts: Record<OrderStatus, number>;
  pendingPayments: number;
}

/** One row of the orders table. */
export interface OrderRow {
  id: string; // "AZ1248"
  customer: string;
  city: string;
  placedAt: string; // ISO date
  itemCount: number; // total units across all lines
  firstItemName: string;
  extraLines: number; // other products in the order besides the first
  amount: number; // INR, what the customer paid
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  status: OrderStatus;
}

export interface OrderList {
  items: OrderRow[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

/** What the orders table can be filtered by. All of it lives in the page URL. */
export interface OrderQuery {
  search?: string; // matches order id, customer, city, product name
  status?: OrderStatus;
  method?: PaymentMethod;
  payment?: PaymentStatus;
  page: number; // 1-based
}

export interface OrderLine {
  productId: string;
  name: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number; // quantity x unitPrice
}

export interface OrderCustomer {
  id: string;
  name: string;
  email: string;
  phone: string;
  type: "retail" | "wholesale";
}

export interface ShippingAddress {
  name: string;
  city: string;
  state: string;
  pincode: string;
}

/** Everything the order detail page shows. */
export interface OrderDetail {
  id: string;
  placedAt: string; // ISO date
  status: OrderStatus;
  customer: OrderCustomer | null; // null if the customer record no longer exists
  items: OrderLine[];
  subtotal: number;
  discount: number;
  couponCode: string | null;
  shipping: number; // 0 = free shipping
  amount: number; // subtotal - discount + shipping
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  shippingAddress: ShippingAddress;
}   