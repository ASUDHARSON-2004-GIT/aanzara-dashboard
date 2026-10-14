import { cache } from "react";
import { apiGet } from "@/lib/api";
import { toSearchParams } from "@/lib/catalog-query";
import type {
  Brand,
  CatalogSummary,
  Category,
  ProductList,
  ProductQuery,
} from "@/types/catalog";

/** The ONLY place that knows the catalog endpoint URLs (same rule as services/dashboard.ts). */
export const getCatalogSummary = () => apiGet<CatalogSummary>("/catalog/summary");

export const getCategories = cache(() => apiGet<Category[]>("/catalog/categories"));

export const getBrands = () => apiGet<Brand[]>("/catalog/brands");

export const getProducts = (query: ProductQuery) => {
  const params = toSearchParams(query).toString();
  return apiGet<ProductList>(`/catalog/products${params ? `?${params}` : ""}`);
};
