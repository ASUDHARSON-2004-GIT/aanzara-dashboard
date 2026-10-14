import { NextResponse } from "next/server";
import { parseProductQuery } from "@/lib/catalog-query";
import type {
  Brand,
  CatalogProduct,
  CatalogSummary,
  Category,
  ProductList,
  ProductStockStatus,
} from "@/types/catalog";
import productsData from "@/data/products.json";
import categoriesData from "@/data/categories.json";
import brandsData from "@/data/brands.json";
import inventoryData from "@/data/inventory.json";

/**
 * Demo backend: GET /api/catalog/<summary | products | categories | brands>
 * Joins the JSON files in src/data the way a real database query would, so the
 * frontend receives the same shapes as src/types/catalog.ts.
 * Delete this folder when the real API exists and point API_BASE_URL at it.
 */
const PAGE_SIZE = 8;

function buildProducts(): CatalogProduct[] {
  const categoryName = new Map(categoriesData.map((c) => [c.id, c.name]));
  const brandName = new Map(brandsData.map((b) => [b.id, b.name]));

  // Stock = units on hand across warehouses; reorder level = highest per-warehouse level.
  const stockByProduct = new Map<string, { onHand: number; reorderLevel: number }>();
  for (const row of inventoryData) {
    const current = stockByProduct.get(row.productId) ?? { onHand: 0, reorderLevel: 0 };
    stockByProduct.set(row.productId, {
      onHand: current.onHand + row.onHand,
      reorderLevel: Math.max(current.reorderLevel, row.reorderLevel),
    });
  }

  return productsData.map((product) => {
    const { onHand, reorderLevel } = stockByProduct.get(product.id) ?? { onHand: 0, reorderLevel: 0 };
    const stockStatus: ProductStockStatus =
      onHand === 0 ? "out_of_stock" : onHand <= reorderLevel ? "low_stock" : "in_stock";

    return {
      id: product.id,
      name: product.name,
      sku: product.sku,
      categoryId: product.categoryId,
      categoryName: categoryName.get(product.categoryId) ?? "Uncategorised",
      brandId: product.brandId,
      brandName: brandName.get(product.brandId) ?? "Unknown",
      price: product.price,
      mrp: product.mrp,
      status: product.status as CatalogProduct["status"],
      rating: product.rating,
      stock: onHand,
      stockStatus,
      createdAt: product.createdAt,
    };
  });
}

function getSummary(): CatalogSummary {
  const products = buildProducts();
  const count = (test: (p: CatalogProduct) => boolean) => products.filter(test).length;
  return {
    totalProducts: products.length,
    activeProducts: count((p) => p.status === "active"),
    draftProducts: count((p) => p.status === "draft"),
    archivedProducts: count((p) => p.status === "archived"),
    lowStockProducts: count((p) => p.status !== "archived" && p.stockStatus === "low_stock"),
    outOfStockProducts: count((p) => p.status !== "archived" && p.stockStatus === "out_of_stock"),
    totalCategories: categoriesData.length,
    totalBrands: brandsData.length,
  };
}

function getCategories(): Category[] {
  const products = buildProducts();
  return categoriesData.map((category) => ({
    ...category,
    productCount: products.filter((p) => p.categoryId === category.id).length,
  }));
}

function getBrands(): Brand[] {
  const products = buildProducts();
  return brandsData.map((brand) => ({
    ...brand,
    productCount: products.filter((p) => p.brandId === brand.id).length,
  }));
}

function getProductList(searchParams: URLSearchParams): ProductList {
  const query = parseProductQuery(Object.fromEntries(searchParams));
  const needle = query.search?.toLowerCase();

  const matches = buildProducts().filter((p) => {
    if (query.category && p.categoryId !== query.category) return false;
    if (query.status && p.status !== query.status) return false;
    if (query.stock && p.stockStatus !== query.stock) return false;
    if (needle) {
      const haystack = `${p.name} ${p.sku} ${p.brandName} ${p.categoryName}`.toLowerCase();
      if (!haystack.includes(needle)) return false;
    }
    return true;
  });

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

export async function GET(
  request: Request,
  { params }: { params: Promise<{ resource: string }> },
) {
  const { resource } = await params;
  const searchParams = new URL(request.url).searchParams;

  const handlers: Record<string, () => unknown> = {
    summary: getSummary,
    products: () => getProductList(searchParams),
    categories: getCategories,
    brands: getBrands,
  };

  const handler = handlers[resource];
  if (!handler) return NextResponse.json({ message: "Unknown resource" }, { status: 404 });

  return NextResponse.json(handler());
}
