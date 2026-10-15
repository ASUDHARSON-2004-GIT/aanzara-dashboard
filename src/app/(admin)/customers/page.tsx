import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { UserPlus } from "lucide-react";
import AsyncSection from "@/components/ui/AsyncSection";
import Card from "@/components/ui/Card";
import PageHeader from "@/components/ui/PageHeader";
import Skeleton from "@/components/ui/Skeleton";
import { StatsGridSkeleton } from "@/components/StatsGrid";
import CustomerFilters, { CustomerFiltersSkeleton } from "@/components/customers/customerFilters";
import CustomerStats from "@/components/customers/customerStatus";
import CustomerTypeTabs, { CustomerTypeTabsSkeleton } from "@/components/customers/customerTypeTab";
import CustomersTable from "@/components/customers/customersTable";
import { parseCustomerQuery } from "@/lib/customers-query";
import { getCustomerSummary, getCustomers } from "@/services/customers";

export const metadata: Metadata = {
  title: "AANZARA Admin | Customers",
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

/**
 * Same streaming pattern as Orders: the page itself is static and every panel sits
 * in its own <Suspense>. Only <TypeTabsSection> and <CustomersSection> read the URL.
 */
export default function CustomersPage({ searchParams }: { searchParams: SearchParams }) {
  return (
    <>
      <PageHeader
        title="Customers"
        description="View and manage your customers and their purchase history."
        action={
          <Link
            href="/customers/new"
            className="inline-flex items-center gap-2 rounded-lg bg-[#ff6b1a] px-4 py-2 text-sm font-semibold text-white hover:bg-[#f05f10]"
          >
            <UserPlus size={16} />
            Add Customer
          </Link>
        }
      />

      <Suspense fallback={<StatsGridSkeleton />}>
        <AsyncSection load={getCustomerSummary} title="customer summary">
          {(summary) => <CustomerStats summary={summary} />}
        </AsyncSection>
      </Suspense>

      <Card title="All Customers">
        <Suspense fallback={<CustomerTypeTabsSkeleton />}>
          <TypeTabsSection searchParams={searchParams} />
        </Suspense>

        <Suspense fallback={<CustomerFiltersSkeleton />}>
          <AsyncSection load={getCustomerSummary} title="customer filters">
            {(summary) => <CustomerFilters states={summary.states} />}
          </AsyncSection>
        </Suspense>

        <Suspense fallback={<TableSkeleton />}>
          <CustomersSection searchParams={searchParams} />
        </Suspense>
      </Card>
    </>
  );
}

async function TypeTabsSection({ searchParams }: { searchParams: SearchParams }) {
  const query = parseCustomerQuery(await searchParams);

  return (
    <AsyncSection load={getCustomerSummary} title="customer tabs">
      {(summary) => <CustomerTypeTabs summary={summary} query={query} />}
    </AsyncSection>
  );
}

async function CustomersSection({ searchParams }: { searchParams: SearchParams }) {
  const query = parseCustomerQuery(await searchParams);

  return (
    <AsyncSection load={() => getCustomers(query)} title="customers">
      {(list) => <CustomersTable list={list} query={query} />}
    </AsyncSection>
  );
}

function TableSkeleton() {
  return (
    <div role="status" aria-label="Loading customers" className="space-y-3">
      {Array.from({ length: 6 }, (_, i) => (
        <Skeleton key={i} className="h-12 w-full" />
      ))}
    </div>
  );
}