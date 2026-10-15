import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { Plus } from "lucide-react";
import AsyncSection from "@/components/ui/AsyncSection";
import Card from "@/components/ui/Card";
import PageHeader from "@/components/ui/PageHeader";
import Skeleton from "@/components/ui/Skeleton";
import { StatsGridSkeleton } from "@/components/StatsGrid";
import WholesaleFilters, { WholesaleFiltersSkeleton } from "@/components/wholesale/WholesaleFilters";
import WholesaleStats from "@/components/wholesale/WholesaleStats";
import WholesaleStatusTabs, { WholesaleStatusTabsSkeleton } from "@/components/wholesale/WholesaleStatusTab";
import WholesaleTable from "@/components/wholesale/WholesaleTable";
import { parseWholesaleQuery } from "@/lib/wholesale-query";
import { getWholesaleAccounts, getWholesaleSummary } from "@/services/wholesale";

export const metadata: Metadata = {
  title: "AANZARA Admin | Wholesale",
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

/**
 * Same streaming pattern as Customers: the page itself is static and every panel sits
 * in its own <Suspense>. Only <StatusTabsSection> and <AccountsSection> read the URL.
 */
export default function WholesalePage({ searchParams }: { searchParams: SearchParams }) {
  return (
    <>
      <PageHeader
        title="Wholesale"
        description="Manage business buyers, their credit and their bulk purchases."
        action={
          <Link
            href="/wholesale/new"
            className="inline-flex items-center gap-2 rounded-lg bg-[#ff6b1a] px-4 py-2 text-sm font-semibold text-white hover:bg-[#f05f10]"
          >
            <Plus size={16} />
            Add Wholesale Account
          </Link>
        }
      />

      <Suspense fallback={<StatsGridSkeleton />}>
        <AsyncSection load={getWholesaleSummary} title="wholesale summary">
          {(summary) => <WholesaleStats summary={summary} />}
        </AsyncSection>
      </Suspense>

      <Card title="Wholesale Accounts">
        <Suspense fallback={<WholesaleStatusTabsSkeleton />}>
          <StatusTabsSection searchParams={searchParams} />
        </Suspense>

        <Suspense fallback={<WholesaleFiltersSkeleton />}>
          <AsyncSection load={getWholesaleSummary} title="wholesale filters">
            {(summary) => <WholesaleFilters states={summary.states} />}
          </AsyncSection>
        </Suspense>

        <Suspense fallback={<TableSkeleton />}>
          <AccountsSection searchParams={searchParams} />
        </Suspense>
      </Card>
    </>
  );
}

async function StatusTabsSection({ searchParams }: { searchParams: SearchParams }) {
  const query = parseWholesaleQuery(await searchParams);

  return (
    <AsyncSection load={getWholesaleSummary} title="wholesale tabs">
      {(summary) => <WholesaleStatusTabs summary={summary} query={query} />}
    </AsyncSection>
  );
}

async function AccountsSection({ searchParams }: { searchParams: SearchParams }) {
  const query = parseWholesaleQuery(await searchParams);

  return (
    <AsyncSection load={() => getWholesaleAccounts(query)} title="wholesale accounts">
      {(list) => <WholesaleTable list={list} query={query} />}
    </AsyncSection>
  );
}

function TableSkeleton() {
  return (
    <div role="status" aria-label="Loading wholesale accounts" className="space-y-3">
      {Array.from({ length: 6 }, (_, i) => (
        <Skeleton key={i} className="h-12 w-full" />
      ))}
    </div>
  );
}