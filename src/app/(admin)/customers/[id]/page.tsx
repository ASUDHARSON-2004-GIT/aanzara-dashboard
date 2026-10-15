import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ArrowLeft } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import Skeleton, { CardSkeleton } from "@/components/ui/Skeleton";
import CustomerDetailStats from "@/components/customers/customerDetailStats";
import CustomerOrdersCard from "@/components/customers/customerOrdersCard";
import CustomerProfileCard from "@/components/customers/customerProfileCard";
import CustomerTypeBadge from "@/components/customers/customerTypeBadge";
import { ApiError } from "@/lib/api";
import { formatDate } from "@/lib/format";
import { getCustomer } from "@/services/customers";

export const metadata: Metadata = {
  title: "AANZARA Admin | Customer Details",
};

/** Same pattern as the order detail page: static shell, params are read inside <Suspense>. */
export default function CustomerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <>
      <Link
        href="/customers"
        className="inline-flex w-fit items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-orange-600"
      >
        <ArrowLeft size={15} />
        Back to customers
      </Link>

      <Suspense fallback={<DetailSkeleton />}>
        <CustomerDetailContent params={params} />
      </Suspense>
    </>
  );
}

async function CustomerDetailContent({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  let customer;
  try {
    customer = await getCustomer(decodeURIComponent(id));
  } catch (error) {
    // An unknown customer id is a normal 404 page. Anything else goes to the error page.
    if (error instanceof ApiError && error.status === 404) notFound();
    throw error;
  }

  return (
    <>
      <PageHeader
        title={customer.name}
        description={`Customer since ${formatDate(customer.joinedAt)}`}
        action={<CustomerTypeBadge type={customer.type} />}
      />

      <div className="grid grid-cols-1 items-start gap-5 xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <div className="space-y-5">
          <CustomerDetailStats customer={customer} />
          <CustomerOrdersCard customer={customer} />
        </div>

        <CustomerProfileCard customer={customer} />
      </div>
    </>
  );
}

function DetailSkeleton() {
  return (
    <div role="status" aria-label="Loading customer" className="space-y-5">
      <Skeleton className="h-12 w-72" />
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <div className="space-y-5">
          <CardSkeleton rows={2} />
          <CardSkeleton rows={4} />
        </div>
        <CardSkeleton rows={5} />
      </div>
    </div>
  );
}