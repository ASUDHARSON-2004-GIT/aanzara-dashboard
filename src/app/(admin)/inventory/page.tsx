import type { Metadata } from "next";
import { Suspense } from "react";
import AsyncSection from "@/components/ui/AsyncSection";
import Card from "@/components/ui/Card";
import PageHeader from "@/components/ui/PageHeader";
import Skeleton, { CardSkeleton } from "@/components/ui/Skeleton";
import { StatsGridSkeleton } from "@/components/StatsGrid";
import InventoryFilters, { InventoryFiltersSkeleton } from "@/components/inventory/InventoryFilters";
import InventoryStats from "@/components/inventory/InventoryStats";
import InventoryTable from "@/components/inventory/InventoryTable";
import MovementsCard from "@/components/inventory/MovementsCard";
import RestockCard from "@/components/inventory/RestockCard";
import SuppliersCard from "@/components/inventory/SuppliersCard";
import WarehousesCard from "@/components/inventory/WarehousesCard";
import { parseInventoryQuery } from "@/lib/inventory-query";
import { getCategories } from "@/services/catalog";
import {
  getInventory,
  getInventorySummary,
  getRestockList,
  getStockMovements,
  getSuppliers,
  getWarehouses,
} from "@/services/inventory";

export const metadata: Metadata = {
  title: "AANZARA Admin | Inventory",
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

/**
 * Same streaming pattern as Catalog and Sales: the page itself is static, and every
 * panel sits in its own <Suspense>. Only <StockSection> reads the URL
 * (searchParams), so only the stock table waits for it.
 */
export default function InventoryPage({ searchParams }: { searchParams: SearchParams }) {
  return (
    <>
      <PageHeader title="Inventory" description="Track stock levels, warehouses and stock movements." />

      <Suspense fallback={<StatsGridSkeleton />}>
        <AsyncSection load={getInventorySummary} title="inventory summary">
          {(summary) => <InventoryStats summary={summary} />}
        </AsyncSection>
      </Suspense>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,3fr)_minmax(0,1fr)]">
        <Card title="Stock Levels">
          <Suspense fallback={<InventoryFiltersSkeleton />}>
            <FiltersSection />
          </Suspense>

          <Suspense fallback={<TableSkeleton />}>
            <StockSection searchParams={searchParams} />
          </Suspense>
        </Card>

        <div className="space-y-5">
          <Suspense fallback={<CardSkeleton rows={5} />}>
            <AsyncSection load={getRestockList} title="restock list">
              {(items) => <RestockCard items={items} />}
            </AsyncSection>
          </Suspense>

          <Suspense fallback={<CardSkeleton rows={2} />}>
            <AsyncSection load={getWarehouses} title="warehouses">
              {(warehouses) => <WarehousesCard warehouses={warehouses} />}
            </AsyncSection>
          </Suspense>

          <Suspense fallback={<CardSkeleton rows={3} />}>
            <AsyncSection load={getSuppliers} title="suppliers">
              {(suppliers) => <SuppliersCard suppliers={suppliers} />}
            </AsyncSection>
          </Suspense>
        </div>
      </div>

      <Suspense fallback={<CardSkeleton rows={6} />}>
        <AsyncSection load={getStockMovements} title="stock movements">
          {(movements) => <MovementsCard movements={movements} />}
        </AsyncSection>
      </Suspense>
    </>
  );
}

/** The filters need categories and warehouses, so they load both before rendering. */
function FiltersSection() {
  return (
    <AsyncSection
      load={() => Promise.all([getCategories(), getWarehouses()])}
      title="filters"
    >
      {([categories, warehouses]) => <InventoryFilters categories={categories} warehouses={warehouses} />}
    </AsyncSection>
  );
}

async function StockSection({ searchParams }: { searchParams: SearchParams }) {
  const query = parseInventoryQuery(await searchParams);

  return (
    <AsyncSection load={() => getInventory(query)} title="stock levels">
      {(list) => <InventoryTable list={list} query={query} />}
    </AsyncSection>
  );
}

function TableSkeleton() {
  return (
    <div role="status" aria-label="Loading stock levels" className="space-y-3">
      {Array.from({ length: 6 }, (_, i) => (
        <Skeleton key={i} className="h-12 w-full" />
      ))}
    </div>
  );
}