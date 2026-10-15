import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { Plus } from "lucide-react";
import AsyncSection from "@/components/ui/AsyncSection";
import Card from "@/components/ui/Card";
import PageHeader from "@/components/ui/PageHeader";
import Skeleton, { CardSkeleton } from "@/components/ui/Skeleton";
import { StatsGridSkeleton } from "@/components/StatsGrid";
import OfferFilters, { OfferFiltersSkeleton } from "@/components/offers/OfferFilters";
import OfferStats from "@/components/offers/offerStats";
import OfferStatusTabs, { OfferStatusTabsSkeleton } from "@/components/offers/OfferStatusTab";
import OfferTimeline from "@/components/offers/OffersTimeLine";
import OffersTable from "@/components/offers/OffersTable";
import UpcomingEvents from "@/components/offers/UpcommingEvents";
import { parseOfferQuery } from "@/lib/offers-query";
import { getOfferSchedule, getOfferSummary, getOfferTimeline, getOffers } from "@/services/offers";

export const metadata: Metadata = {
  title: "AANZARA Admin | Offers & Promotions",
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

/**
 * Same streaming pattern as Orders and Customers: the page itself is static and every
 * panel sits in its own <Suspense>. Only <StatusTabsSection> and <OffersSection> read
 * the URL (searchParams), so only they wait for it.
 */
export default function OffersPage({ searchParams }: { searchParams: SearchParams }) {
  return (
    <>
      <PageHeader
        title="Offers & Promotions"
        description="Manage coupons and discounts, and see how they perform."
        action={
          <Link
            href="/offers/new"
            className="inline-flex items-center gap-2 rounded-lg bg-[#ff6b1a] px-4 py-2 text-sm font-semibold text-white hover:bg-[#f05f10]"
          >
            <Plus size={16} />
            Create Offer
          </Link>
        }
      />

      <Suspense fallback={<StatsGridSkeleton />}>
        <AsyncSection load={getOfferSummary} title="offer summary">
          {(summary) => <OfferStats summary={summary} />}
        </AsyncSection>
      </Suspense>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        <Suspense fallback={<CardSkeleton rows={5} />}>
          <AsyncSection load={getOfferTimeline} title="offer timeline">
            {(timeline) => <OfferTimeline data={timeline} />}
          </AsyncSection>
        </Suspense>

        <Suspense fallback={<CardSkeleton rows={3} />}>
          <AsyncSection load={getOfferSchedule} title="upcoming offers">
            {(schedule) => <UpcomingEvents schedule={schedule} />}
          </AsyncSection>
        </Suspense>
      </div>

      <Card title="All Offers">
        <Suspense fallback={<OfferStatusTabsSkeleton />}>
          <StatusTabsSection searchParams={searchParams} />
        </Suspense>

        <Suspense fallback={<OfferFiltersSkeleton />}>
          <OfferFilters />
        </Suspense>

        <Suspense fallback={<TableSkeleton />}>
          <OffersSection searchParams={searchParams} />
        </Suspense>
      </Card>
    </>
  );
}

async function StatusTabsSection({ searchParams }: { searchParams: SearchParams }) {
  const query = parseOfferQuery(await searchParams);

  return (
    <AsyncSection load={getOfferSummary} title="offer tabs">
      {(summary) => <OfferStatusTabs summary={summary} query={query} />}
    </AsyncSection>
  );
}

async function OffersSection({ searchParams }: { searchParams: SearchParams }) {
  const query = parseOfferQuery(await searchParams);

  return (
    <AsyncSection load={() => getOffers(query)} title="offers">
      {(list) => <OffersTable list={list} query={query} />}
    </AsyncSection>
  );
}

function TableSkeleton() {
  return (
    <div role="status" aria-label="Loading offers" className="space-y-3">
      {Array.from({ length: 6 }, (_, i) => (
        <Skeleton key={i} className="h-12 w-full" />
      ))}
    </div>
  );
}