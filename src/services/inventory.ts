import { cache } from "react";
import { apiGet } from "@/lib/api";
import { toInventorySearchParams } from "@/lib/inventory-query";
import type {
  InventoryItem,
  InventoryList,
  InventoryQuery,
  InventorySummary,
  StockMovement,
  Supplier,
  WarehouseSummary,
} from "@/types/inventory";

/** The ONLY place that knows the inventory endpoint URLs (same rule as services/catalog.ts). */
export const getInventorySummary = () => apiGet<InventorySummary>("/inventory/summary");

/** cache() because the filters and the warehouse card both need it on the same render. */
export const getWarehouses = cache(() => apiGet<WarehouseSummary[]>("/inventory/warehouses"));

export const getSuppliers = () => apiGet<Supplier[]>("/inventory/suppliers");

export const getRestockList = () => apiGet<InventoryItem[]>("/inventory/restock");

export const getStockMovements = () => apiGet<StockMovement[]>("/inventory/movements");

export const getInventory = (query: InventoryQuery) => {
  const params = toInventorySearchParams(query).toString();
  return apiGet<InventoryList>(`/inventory/stock${params ? `?${params}` : ""}`);
};