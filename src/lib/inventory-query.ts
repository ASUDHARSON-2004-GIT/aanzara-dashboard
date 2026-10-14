import { STOCK_STATUSES } from "@/lib/catalog-query";
import type { InventoryQuery } from "@/types/inventory";

type RawParams = Record<string, string | string[] | undefined>;

const first = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value[0] : value;

/** Turns raw URL params into a safe InventoryQuery (unknown values are ignored). */
export function parseInventoryQuery(raw: RawParams): InventoryQuery {
  const stock = first(raw.stock);
  const page = Number(first(raw.page));

  return {
    search: first(raw.search)?.trim() || undefined,
    warehouse: first(raw.warehouse) || undefined,
    category: first(raw.category) || undefined,
    stock: STOCK_STATUSES.find((value) => value === stock),
    page: Number.isInteger(page) && page > 0 ? page : 1,
  };
}

/** The reverse: InventoryQuery -> URL params (defaults are left out to keep URLs short). */
export function toInventorySearchParams(query: InventoryQuery): URLSearchParams {
  const params = new URLSearchParams();
  if (query.search) params.set("search", query.search);
  if (query.warehouse) params.set("warehouse", query.warehouse);
  if (query.category) params.set("category", query.category);
  if (query.stock) params.set("stock", query.stock);
  if (query.page > 1) params.set("page", String(query.page));
  return params;
}