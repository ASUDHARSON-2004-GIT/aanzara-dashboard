/**
 * API contract for the Wholesale module (the JSON shapes the backend must return).
 * Same rules as types/customers.ts: raw numbers, ISO dates, money in INR.
 */

export type WholesaleTier = "bronze" | "silver" | "gold";
export type WholesaleStatus = "active" | "on_hold" | "inactive";
export type WholesaleSort = "newest" | "purchased" | "orders" | "name";

/** Headline numbers for the Wholesale page. */
export interface WholesaleSummary {
  totalAccounts: number;
  statusCounts: Record<WholesaleStatus, number>;
  totalPurchased: number; // INR, lifetime purchases of every account
  totalOrders: number;
  averageOrderValue: number; // INR
  states: string[]; // every state that has an account, for the state filter
}

/** One row of the wholesale accounts table. */
export interface WholesaleAccount {
  id: string;
  businessName: string;
  contactName: string;
  email: string;
  phone: string;
  gstin: string;
  city: string;
  state: string;
  tier: WholesaleTier;
  status: WholesaleStatus;
  joinedAt: string; // ISO date
  lastOrderAt: string; // ISO date
  totalOrders: number;
  totalPurchased: number; // INR
}

export interface WholesaleList {
  items: WholesaleAccount[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

/** What the accounts table can be filtered by. All of it lives in the page URL. */
export interface WholesaleQuery {
  search?: string; // matches business, contact, email, phone, city, GSTIN
  status?: WholesaleStatus;
  tier?: WholesaleTier;
  state?: string;
  sort: WholesaleSort;
  page: number; // 1-based
}