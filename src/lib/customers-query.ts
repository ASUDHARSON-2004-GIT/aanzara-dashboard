import type { CustomerQuery, CustomerSort, CustomerType } from "@/types/customers";

export const CUSTOMER_TYPES: CustomerType[] = ["retail", "wholesale"];
export const CUSTOMER_SORTS: CustomerSort[] = ["newest", "spent", "orders", "name"];

export const customerTypeLabels: Record<CustomerType, string> = {
  retail: "Retail",
  wholesale: "Wholesale",
};

export const customerSortLabels: Record<CustomerSort, string> = {
  newest: "Newest first",
  spent: "Highest spend",
  orders: "Most orders",
  name: "Name (A–Z)",
};

type RawParams = Record<string, string | string[] | undefined>;

const first = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value[0] : value;

/** Turns raw URL params into a safe CustomerQuery. Unknown values are ignored. */
export function parseCustomerQuery(raw: RawParams): CustomerQuery {
  const type = first(raw.type);
  const sort = first(raw.sort);
  const page = Number(first(raw.page));

  return {
    search: first(raw.search)?.trim() || undefined,
    type: CUSTOMER_TYPES.find((value): value is CustomerType => value === type),
    state: first(raw.state)?.trim() || undefined,
    sort: CUSTOMER_SORTS.find((value): value is CustomerSort => value === sort) ?? "newest",
    page: Number.isInteger(page) && page > 0 ? page : 1,
  };
}

/** The reverse: a CustomerQuery back into URL params. Defaults are left out to keep URLs short. */
export function toCustomerSearchParams(query: CustomerQuery): URLSearchParams {
  const params = new URLSearchParams();
  if (query.search) params.set("search", query.search);
  if (query.type) params.set("type", query.type);
  if (query.state) params.set("state", query.state);
  if (query.sort !== "newest") params.set("sort", query.sort);
  if (query.page > 1) params.set("page", String(query.page));
  return params;
}