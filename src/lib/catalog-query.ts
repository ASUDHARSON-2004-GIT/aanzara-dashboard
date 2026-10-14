import type { ProductQuery } from "@/types/catalog";

export const PRODUCT_STATUSES = ["active", "draft", "archived"] as const;
export const STOCK_STATUSES = ["in_stock", "low_stock", "out_of_stock"] as const;

type RawParams = Record<string, string | string[] | undefined>;

const first = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value[0] : value;

/** Turns raw URL params into a safe ProductQuery (unknown values are ignored). */
export function parseProductQuery(raw: RawParams): ProductQuery {
  const status = first(raw.status);
  const stock = first(raw.stock);
  const page = Number(first(raw.page));

  return {
    search: first(raw.search)?.trim() || undefined,
    category: first(raw.category) || undefined,
    status: PRODUCT_STATUSES.find((value) => value === status),
    stock: STOCK_STATUSES.find((value) => value === stock),
    page: Number.isInteger(page) && page > 0 ? page : 1,
  };
}

/** The reverse: ProductQuery -> URL params (defaults are left out to keep URLs short). */
export function toSearchParams(query: ProductQuery): URLSearchParams {
  const params = new URLSearchParams();
  if (query.search) params.set("search", query.search);
  if (query.category) params.set("category", query.category);
  if (query.status) params.set("status", query.status);
  if (query.stock) params.set("stock", query.stock);
  if (query.page > 1) params.set("page", String(query.page));
  return params;
}
