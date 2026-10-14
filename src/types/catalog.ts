/**
 * API contract for the Catalog module (the JSON shapes the backend must return).
 * Same rules as types/dashboard.ts: raw numbers, ISO dates, prices in INR.
 */

export type ProductStatus = "active" | "draft" | "archived";
export type ProductStockStatus = "in_stock" | "low_stock" | "out_of_stock";

export interface CatalogProduct {
  id: string; // "p1"
  name: string;
  sku: string;
  categoryId: string;
  categoryName: string;
  brandId: string;
  brandName: string;
  price: number; // selling price, INR
  mrp: number; // printed price, INR
  status: ProductStatus;
  rating: number; // 0 - 5
  /** Units on hand across all warehouses. */
  stock: number;
  stockStatus: ProductStockStatus;
  createdAt: string; // ISO date
  imageUrl?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  productCount: number;
}

export interface Brand {
  id: string;
  name: string;
  productCount: number;
}

export interface CatalogSummary {
  totalProducts: number;
  activeProducts: number;
  draftProducts: number;
  archivedProducts: number;
  /** Sellable products at or below their reorder level. */
  lowStockProducts: number;
  outOfStockProducts: number;
  totalCategories: number;
  totalBrands: number;
}

/** Query accepted by GET /catalog/products. Every field is optional. */
export interface ProductQuery {
  search?: string; // matches name, SKU, brand and category
  category?: string; // category id
  status?: ProductStatus;
  stock?: ProductStockStatus;
  page: number; // 1-based
}

export interface ProductList {
  items: CatalogProduct[];
  total: number; // matching products across all pages
  page: number;
  pageSize: number;
  totalPages: number;
}
