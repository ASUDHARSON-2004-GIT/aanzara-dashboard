/**
 * API contract for the Inventory module (the JSON shapes the backend must return).
 * Same rules as types/catalog.ts: raw numbers, ISO dates, money in INR.
 */

import type { ProductStatus, ProductStockStatus } from "@/types/catalog";

export type MovementType = "in" | "out" | "transfer" | "adjust";

/** One product's stock in one warehouse. */
export interface WarehouseStock {
  warehouseId: string;
  city: string;
  onHand: number;
  reserved: number;
  reorderLevel: number;
}

/** One row of the stock table. When a warehouse filter is set, the numbers cover only that warehouse. */
export interface InventoryItem {
  productId: string;
  name: string;
  sku: string;
  categoryId: string;
  categoryName: string;
  productStatus: ProductStatus;
  onHand: number;
  reserved: number; // already promised to open orders
  available: number; // onHand - reserved, never below 0
  reorderLevel: number;
  stockStatus: ProductStockStatus;
  stockValue: number; // onHand x cost price, INR
  /** Per-warehouse split (always every warehouse that holds the product). */
  warehouses: WarehouseStock[];
}

export interface InventorySummary {
  totalUnits: number; // on hand, all warehouses
  reservedUnits: number;
  stockValue: number; // INR, at cost price
  trackedProducts: number;
  /** Sellable (not archived) products at or below their reorder level. */
  lowStockItems: number;
  outOfStockItems: number;
}

export interface WarehouseSummary {
  id: string;
  name: string;
  city: string;
  state: string;
  capacity: number; // units the warehouse can hold
  unitsOnHand: number;
  skuCount: number; // products with stock here
}

export interface Supplier {
  id: string;
  name: string;
  city: string;
  contact: string;
}

export interface StockMovement {
  id: string;
  productId: string;
  productName: string;
  warehouseId: string;
  warehouseName: string;
  type: MovementType;
  /** Units moved. For "adjust" it keeps its sign (negative = stock removed). */
  quantity: number;
  reason: string;
  date: string; // ISO date
  by: string;
}

/** Query accepted by GET /inventory/stock. Every field is optional. */
export interface InventoryQuery {
  search?: string; // matches name, SKU and category
  warehouse?: string; // warehouse id
  category?: string; // category id
  stock?: ProductStockStatus;
  page: number; // 1-based
}

export interface InventoryList {
  items: InventoryItem[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}