/**
 * API contract for the Customers module (the JSON shapes the backend must return).
 * Same rules as types/orders.ts: raw numbers, ISO dates, money in INR.
 */
import type { OrderStatus } from "@/types/dashboard";
import type { PaymentMethod, PaymentStatus } from "@/types/sales";

export type CustomerType = "retail" | "wholesale";
export type CustomerSort = "newest" | "spent" | "orders" | "name";

/** Headline numbers for the Customers page. */
export interface CustomerSummary {
  range: { from: string; to: string }; // first and last join date (ISO)
  totalCustomers: number;
  retailCount: number;
  wholesaleCount: number;
  repeatCustomers: number; // customers with 2 or more orders
  totalSpent: number; // INR, cancelled orders excluded
  averageSpent: number; // INR per customer
  states: string[]; // every state that has a customer, for the state filter
}

/** One row of the customers table. */
export interface CustomerRow {
  id: string;
  name: string;
  email: string;
  phone: string;
  type: CustomerType;
  city: string;
  state: string;
  joinedAt: string; // ISO date
  totalOrders: number;
  totalSpent: number; // INR
}

export interface CustomerList {
  items: CustomerRow[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

/** What the customers table can be filtered by. All of it lives in the page URL. */
export interface CustomerQuery {
  search?: string; // matches name, email, phone, city
  type?: CustomerType;
  state?: string;
  sort: CustomerSort;
  page: number; // 1-based
}

export interface CustomerOrder {
  id: string; // "AZ1248"
  placedAt: string; // ISO date
  itemCount: number; // total units
  firstItemName: string;
  extraLines: number; // other products besides the first
  amount: number; // INR
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  status: OrderStatus;
}

export interface CustomerDetail extends CustomerRow {
  orders: CustomerOrder[]; // newest first
  cancelledOrders: number;
  lastOrderAt: string | null; // null if the customer never ordered
  averageOrderValue: number; // INR, cancelled orders not counted
}