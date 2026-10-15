/**
 * API contract for the Offers & Promotions module.
 * Same rules as types/orders.ts: raw numbers, ISO dates, money in INR.
 * An "offer" is a coupon, so status and type are shared with types/sales.ts.
 */
import type { CouponStatus, CouponType } from "@/types/sales";

export type OfferStatus = CouponStatus;
export type OfferType = CouponType;
export type OfferSort = "newest" | "ending" | "redeemed" | "discount";

/** Headline numbers for the Offers page. */
export interface OfferSummary {
  totalOffers: number;
  statusCounts: Record<OfferStatus, number>;
  totalRedemptions: number; // lifetime uses recorded on the coupons
  ordersWithOffer: number; // orders in the data that used an offer (cancelled excluded)
  discountGiven: number; // INR, on those orders
  revenue: number; // INR, value of those orders
}

/** One row of the offers table. */
export interface OfferRow {
  id: string;
  code: string;
  description: string;
  type: OfferType;
  value: number; // percent for "percentage", INR for "flat", 0 for "free_shipping"
  minOrder: number; // INR, 0 means no minimum
  maxDiscount: number; // INR cap, 0 means no cap
  usageLimit: number; // 0 means unlimited
  usedCount: number;
  startsAt: string; // ISO date
  expiresAt: string; // ISO date
  status: OfferStatus;
  orders: number; // orders in the data that used this offer
  discountGiven: number; // INR
  revenue: number; // INR
  startsInDays: number; // negative once started
  endsInDays: number; // negative once ended
}

export interface OfferList {
  items: OfferRow[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

/** What the offers table can be filtered by. All of it lives in the page URL. */
export interface OfferQuery {
  search?: string; // matches code and description
  status?: OfferStatus;
  type?: OfferType;
  sort: OfferSort;
  page: number; // 1-based
}

export interface OfferTimelineItem {
  id: string;
  code: string;
  description: string;
  type: OfferType;
  value: number;
  status: OfferStatus;
  startsAt: string;
  expiresAt: string;
}

export interface OfferTimeline {
  today: string; // ISO date, so the chart can draw the "today" marker
  items: OfferTimelineItem[]; // earliest start first
}

export type OfferEventKind = "starts" | "ends";

export interface OfferEvent {
  offerId: string;
  code: string;
  kind: OfferEventKind;
  date: string; // ISO date
  inDays: number; // 0 means today
}

export interface OfferSchedule {
  windowDays: number;
  events: OfferEvent[]; // soonest first
}

/** What the Create Offer form sends. null means the box was left blank or was not a number. */
export interface OfferInput {
  code: string;
  description: string;
  type: OfferType;
  value: number | null;
  minOrder: number | null;
  maxDiscount: number | null;
  usageLimit: number | null;
  startsAt: string; // ISO date
  expiresAt: string; // ISO date
  enabled: boolean;
}

export type OfferField =
  | "code"
  | "description"
  | "type"
  | "value"
  | "minOrder"
  | "maxDiscount"
  | "usageLimit"
  | "startsAt"
  | "expiresAt";

export type OfferFieldErrors = Partial<Record<OfferField, string>>;

/** What the API returns after it creates or changes an offer. */
export interface OfferRef {
  id: string;
  code: string;
  status: OfferStatus;
}

export type CreateOfferState =
  | { status: "idle" }
  | { status: "success"; offer: OfferRef }
  | { status: "error"; message: string; fieldErrors: OfferFieldErrors };

export type ToggleOfferResult = { ok: true } | { ok: false; message: string };