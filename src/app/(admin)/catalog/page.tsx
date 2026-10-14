import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { Plus } from "lucide-react";
import AsyncSection from "@/components/ui/AsyncSection";
import Card from "@/components/ui/Card";
import PageHeader from "@/components/ui/PageHeader";
import Skeleton, { CardSkeleton } from "@/components/ui/Skeleton";
import { StatsGridSkeleton } from "@/components/StatsGrid";
import BrandsCard from "@/components/catalog/BrandsCard";
import CatalogStats from "@/components/catalog/CatalogStats";
import CategoriesCard from "@/components/catalog/CategoriesCard";
import ProductFilters, { ProductFiltersSkeleton } from "@/components/catalog/ProductFilters";
import ProductsTable from "@/components/catalog/ProductsTable";
import { parseProductQuery } from "@/lib/catalog-query";
import { getBrands, getCatalogSummary, getCategories, getProducts } from "@/services/catalog";

export const metadata: Metadata = {
  title: "AANZARA Admin | Catalog",
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

/**
 * Same streaming pattern as the dashboard: the page itself is static, and every
 * panel sits in its own <Suspense>. Only <ProductsSection> reads the URL
 * (searchParams), so only the table waits for it.
 */
export default function CatalogPage({ searchParams }: { searchParams: SearchParams }) {
  return (
    <>
      <PageHeader
        title="Catalog"
        description="Manage your products, categories and brands."
        action={
          <Link
            href="/catalog/products/new"
            className="inline-flex items-center gap-2 rounded-lg bg-[#ff6b1a] px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#f05f10]"
          >
            <Plus size={16} />
            Add Product
          </Link>
        }
      />

      <Suspense fallback={<StatsGridSkeleton />}>
        <AsyncSection load={getCatalogSummary} title="catalog summary">
          {(summary) => <CatalogStats summary={summary} />}
        </AsyncSection>
      </Suspense>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,3fr)_minmax(0,1fr)]">
        <Card title="All Products">
          <Suspense fallback={<ProductFiltersSkeleton />}>
            <AsyncSection load={getCategories} title="filters">
              {(categories) => <ProductFilters categories={categories} />}
            </AsyncSection>
          </Suspense>

          <Suspense fallback={<TableSkeleton />}>
            <ProductsSection searchParams={searchParams} />
          </Suspense>
        </Card>

        <div className="space-y-5">
          <Suspense fallback={<CardSkeleton rows={6} />}>
            <AsyncSection load={getCategories} title="categories">
              {(categories) => <CategoriesCard categories={categories} />}
            </AsyncSection>
          </Suspense>

          <Suspense fallback={<CardSkeleton rows={2} />}>
            <AsyncSection load={getBrands} title="brands">
              {(brands) => <BrandsCard brands={brands} />}
            </AsyncSection>
          </Suspense>
        </div>
      </div>
    </>
  );
}

async function ProductsSection({ searchParams }: { searchParams: SearchParams }) {
  const query = parseProductQuery(await searchParams);

  return (
    <AsyncSection load={() => getProducts(query)} title="products">
      {(list) => <ProductsTable list={list} query={query} />}
    </AsyncSection>
  );
}

function TableSkeleton() {
  return (
    <div role="status" aria-label="Loading products" className="space-y-3">
      {Array.from({ length: 6 }, (_, i) => (
        <Skeleton key={i} className="h-12 w-full" />
      ))}
    </div>
  );
}
