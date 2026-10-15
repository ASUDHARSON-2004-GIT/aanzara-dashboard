import { cache } from "react";
import { apiGet, apiSend } from "@/lib/api";
import { toOfferSearchParams } from "@/lib/offers-query";
import type {
  OfferInput,
  OfferList,
  OfferQuery,
  OfferRef,
  OfferSchedule,
  OfferSummary,
  OfferTimeline,
} from "@/types/offers";

/** The ONLY place that knows the offers endpoint URLs (same rule as services/customers.ts). */

/** cache() because the stat cards and the status tabs both need it on the same render. */
export const getOfferSummary = cache(() => apiGet<OfferSummary>("/offers/summary"));

export const getOfferTimeline = () => apiGet<OfferTimeline>("/offers/timeline");

export const getOfferSchedule = () => apiGet<OfferSchedule>("/offers/upcoming");

export const getOffers = (query: OfferQuery) => {
  const params = toOfferSearchParams(query).toString();
  return apiGet<OfferList>(`/offers/list${params ? `?${params}` : ""}`);
};

export const createOffer = (input: OfferInput) => apiSend<OfferRef>("POST", "/offers", input);

export const setOfferEnabled = (id: string, enabled: boolean) =>
  apiSend<OfferRef>("PATCH", `/offers/${encodeURIComponent(id)}`, { enabled });