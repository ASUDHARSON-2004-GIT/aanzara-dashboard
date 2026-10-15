import type { OfferQuery, OfferSort, OfferStatus, OfferType } from "@/types/offers";

export const OFFER_STATUSES: OfferStatus[] = ["active", "scheduled", "expired", "disabled"];
export const OFFER_TYPES: OfferType[] = ["percentage", "flat", "free_shipping"];
export const OFFER_SORTS: OfferSort[] = ["newest", "ending", "redeemed", "discount"];

export const offerTypeLabels: Record<OfferType, string> = {
  percentage: "Percentage off",
  flat: "Flat amount off",
  free_shipping: "Free shipping",
};

export const offerSortLabels: Record<OfferSort, string> = {
  newest: "Newest first",
  ending: "Ending soonest",
  redeemed: "Most redeemed",
  discount: "Most discount given",
};

type RawParams = Record<string, string | string[] | undefined>;

const first = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value[0] : value;

/** Turns raw URL params into a safe OfferQuery. Unknown values are ignored. */
export function parseOfferQuery(raw: RawParams): OfferQuery {
  const status = first(raw.status);
  const type = first(raw.type);
  const sort = first(raw.sort);
  const page = Number(first(raw.page));

  return {
    search: first(raw.search)?.trim() || undefined,
    status: OFFER_STATUSES.find((value): value is OfferStatus => value === status),
    type: OFFER_TYPES.find((value): value is OfferType => value === type),
    sort: OFFER_SORTS.find((value): value is OfferSort => value === sort) ?? "newest",
    page: Number.isInteger(page) && page > 0 ? page : 1,
  };
}

/** The reverse: an OfferQuery back into URL params. Defaults are left out to keep URLs short. */
export function toOfferSearchParams(query: OfferQuery): URLSearchParams {
  const params = new URLSearchParams();
  if (query.search) params.set("search", query.search);
  if (query.status) params.set("status", query.status);
  if (query.type) params.set("type", query.type);
  if (query.sort !== "newest") params.set("sort", query.sort);
  if (query.page > 1) params.set("page", String(query.page));
  return params;
}