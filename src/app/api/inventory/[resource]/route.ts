import { NextResponse } from "next/server";
import { parseInventoryQuery } from "@/lib/inventory-query";
import type { ProductStatus, ProductStockStatus } from "@/types/catalog";
import type {
  InventoryItem,
  InventoryList,
  InventorySummary,
  MovementType,
  StockMovement,
  Supplier,
  WarehouseSummary,
} from "@/types/inventory";
import productsData from "@/data/products.json";
import categoriesData from "@/data/categories.json";
import inventoryData from "@/data/inventory.json";
import warehousesData from "@/data/warehouses.json";
import movementsData from "@/data/stock-movements.json";
import suppliersData from "@/data/suppliers.json";

/**
 * Demo backend: GET /api/inventory/<summary | stock | warehouses | restock | movements | suppliers>
 * Joins the JSON files in src/data the way a real database query would, so the
 * frontend receives the same shapes as src/types/inventory.ts.
 * Delete this folder when the real API exists and point API_BASE_URL at it.
 */
const PAGE_SIZE = 11;
const RESTOCK_LIMIT = 5;

/** Same rule as the Catalog API, so both pages always agree on what "low stock" means. */
function stockStatusFor(onHand: number, reorderLevel: number): ProductStockStatus {
  if (onHand === 0) return "out_of_stock";
  return onHand <= reorderLevel ? "low_stock" : "in_stock";
}

const severity: Record<ProductStockStatus, number> = {
  out_of_stock: 0,
  low_stock: 1,
  in_stock: 2,
};

const sum = (values: number[]) => values.reduce((total, value) => total + value, 0);

/**
 * One row per product. With a warehouseId only that warehouse is counted
 * (products not stored there are left out); without it, all warehouses are added up.
 */
function buildItems(warehouseId?: string): InventoryItem[] {
  const categoryName = new Map(categoriesData.map((c) => [c.id, c.name]));
  const city = new Map(warehousesData.map((w) => [w.id, w.city]));

  const items: InventoryItem[] = [];

  for (const product of productsData) {
    const warehouses = inventoryData
      .filter((row) => row.productId === product.id)
      .map((row) => ({
        warehouseId: row.warehouseId,
        city: city.get(row.warehouseId) ?? row.warehouseId,
        onHand: row.onHand,
        reserved: row.reserved,
        reorderLevel: row.reorderLevel,
      }));

    const counted = warehouseId ? warehouses.filter((w) => w.warehouseId === warehouseId) : warehouses;
    if (counted.length === 0) continue;

    const onHand = sum(counted.map((w) => w.onHand));
    const reserved = sum(counted.map((w) => w.reserved));
    const reorderLevel = Math.max(...counted.map((w) => w.reorderLevel));

    items.push({
      productId: product.id,
      name: product.name,
      sku: product.sku,
      categoryId: product.categoryId,
      categoryName: categoryName.get(product.categoryId) ?? "Uncategorised",
      productStatus: product.status as ProductStatus,
      onHand,
      reserved,
      available: Math.max(0, onHand - reserved),
      reorderLevel,
      stockStatus: stockStatusFor(onHand, reorderLevel),
      stockValue: onHand * product.cost,
      warehouses,
    });
  }

  return items;
}

/** Most urgent first, then A-Z, so the table always opens on what needs attention. */
const byUrgency = (a: InventoryItem, b: InventoryItem) =>
  severity[a.stockStatus] - severity[b.stockStatus] || a.name.localeCompare(b.name);

function getSummary(): InventorySummary {
  const items = buildItems();
  const sellable = items.filter((item) => item.productStatus !== "archived");

  return {
    totalUnits: sum(items.map((item) => item.onHand)),
    reservedUnits: sum(items.map((item) => item.reserved)),
    stockValue: sum(items.map((item) => item.stockValue)),
    trackedProducts: items.length,
    lowStockItems: sellable.filter((item) => item.stockStatus === "low_stock").length,
    outOfStockItems: sellable.filter((item) => item.stockStatus === "out_of_stock").length,
  };
}

function getStock(searchParams: URLSearchParams): InventoryList {
  const query = parseInventoryQuery(Object.fromEntries(searchParams));
  const needle = query.search?.toLowerCase();

  const matches = buildItems(query.warehouse)
    .filter((item) => {
      if (query.category && item.categoryId !== query.category) return false;
      if (query.stock && item.stockStatus !== query.stock) return false;
      if (needle && !`${item.name} ${item.sku} ${item.categoryName}`.toLowerCase().includes(needle)) {
        return false;
      }
      return true;
    })
    .sort(byUrgency);

  const totalPages = Math.max(1, Math.ceil(matches.length / PAGE_SIZE));
  const page = Math.min(query.page, totalPages);

  return {
    items: matches.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    total: matches.length,
    page,
    pageSize: PAGE_SIZE,
    totalPages,
  };
}

function getWarehouses(): WarehouseSummary[] {
  return warehousesData.map((warehouse) => {
    const rows = inventoryData.filter((row) => row.warehouseId === warehouse.id);
    return {
      ...warehouse,
      unitsOnHand: sum(rows.map((row) => row.onHand)),
      skuCount: rows.filter((row) => row.onHand > 0).length,
    };
  });
}

/** Sellable products at or below their reorder level, emptiest first. */
function getRestock(): InventoryItem[] {
  return buildItems()
    .filter((item) => item.productStatus !== "archived" && item.stockStatus !== "in_stock")
    .sort((a, b) => a.onHand - b.onHand || a.name.localeCompare(b.name))
    .slice(0, RESTOCK_LIMIT);
}

function getMovements(): StockMovement[] {
  const productName = new Map(productsData.map((p) => [p.id, p.name]));
  const warehouseName = new Map(warehousesData.map((w) => [w.id, w.name]));

  return movementsData
    .map((movement) => ({
      id: movement.id,
      productId: movement.productId,
      productName: productName.get(movement.productId) ?? "Unknown product",
      warehouseId: movement.warehouseId,
      warehouseName: warehouseName.get(movement.warehouseId) ?? movement.warehouseId,
      type: movement.type as MovementType,
      quantity: movement.quantity,
      reason: movement.reason,
      date: movement.date,
      by: movement.by,
    }))
    .sort((a, b) => b.date.localeCompare(a.date));
}

function getSuppliers(): Supplier[] {
  return suppliersData;
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ resource: string }> },
) {
  const { resource } = await params;
  const searchParams = new URL(request.url).searchParams;

  const handlers: Record<string, () => unknown> = {
    summary: getSummary,
    stock: () => getStock(searchParams),
    warehouses: getWarehouses,
    restock: getRestock,
    movements: getMovements,
    suppliers: getSuppliers,
  };

  const handler = handlers[resource];
  if (!handler) return NextResponse.json({ message: "Unknown resource" }, { status: 404 });

  return NextResponse.json(handler());
}