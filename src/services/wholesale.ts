import { cache } from "react";
import { apiGet } from "@/lib/api";
import { toWholesaleSearchParams } from "@/lib/wholesale-query";
import type { WholesaleList, WholesaleQuery, WholesaleSummary } from "@/types/wholesale";

/** The ONLY place that knows the wholesale endpoint URLs (same rule as services/customers.ts). */

/** cache() because the stat cards, the tabs and the filters all need it on the same render. */
export const getWholesaleSummary = cache(() => apiGet<WholesaleSummary>("/wholesale/summary"));

export const getWholesaleAccounts = (query: WholesaleQuery) => {
  const params = toWholesaleSearchParams(query).toString();
  return apiGet<WholesaleList>(`/wholesale/list${params ? `?${params}` : ""}`);
};