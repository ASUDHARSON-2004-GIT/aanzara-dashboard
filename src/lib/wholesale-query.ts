import type {
  WholesaleQuery,
  WholesaleSort,
  WholesaleStatus,
  WholesaleTier,
} from "@/types/wholesale";

export const WHOLESALE_STATUSES: WholesaleStatus[] = ["active", "on_hold", "inactive"];
export const WHOLESALE_TIERS: WholesaleTier[] = ["gold", "silver", "bronze"];
export const WHOLESALE_SORTS: WholesaleSort[] = ["newest", "purchased", "orders", "name"];

export const wholesaleStatusLabels: Record<WholesaleStatus, string> = {
  active: "Active",
  on_hold: "On hold",
  inactive: "Inactive",
};

export const wholesaleTierLabels: Record<WholesaleTier, string> = {
  gold: "Gold",
  silver: "Silver",
  bronze: "Bronze",
};


export const wholesaleSortLabels: Record<WholesaleSort, string> = {
  newest: "Newest first",
  purchased: "Highest purchases",
  orders: "Most orders",
  name: "Business name (A to Z)",
};

type RawParams = Record<string, string | string[] | undefined>;

const first = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value[0] : value;

/** Turns raw URL params into a safe WholesaleQuery. Unknown values are ignored. */
export function parseWholesaleQuery(raw: RawParams): WholesaleQuery {
  const status = first(raw.status);
  const tier = first(raw.tier);
  const sort = first(raw.sort);
  const page = Number(first(raw.page));

  return {
    search: first(raw.search)?.trim() || undefined,
    status: WHOLESALE_STATUSES.find((value): value is WholesaleStatus => value === status),
    tier: WHOLESALE_TIERS.find((value): value is WholesaleTier => value === tier),
    state: first(raw.state)?.trim() || undefined,
    sort: WHOLESALE_SORTS.find((value): value is WholesaleSort => value === sort) ?? "newest",
    page: Number.isInteger(page) && page > 0 ? page : 1,
  };
}

/** The reverse: a WholesaleQuery back into URL params. Defaults are left out to keep URLs short. */
export function toWholesaleSearchParams(query: WholesaleQuery): URLSearchParams {
  const params = new URLSearchParams();
  if (query.search) params.set("search", query.search);
  if (query.status) params.set("status", query.status);
  if (query.tier) params.set("tier", query.tier);
  if (query.state) params.set("state", query.state);
  if (query.sort !== "newest") params.set("sort", query.sort);
  if (query.page > 1) params.set("page", String(query.page));
  return params;
}