import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ArrowLeft } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import Skeleton, { CardSkeleton } from "@/components/ui/Skeleton";
import StatusBadge from "@/components/ui/StatusBadge";
import OrderCustomerCard from "@/components/orders/OrderCustomerCard";
import OrderItemsCard from "@/components/orders/OrderItemsCard";
import OrderSummaryCard from "@/components/orders/OrderSummaryCard";
import OrderTimeline from "@/components/orders/OrderTimeline";
import { ApiError } from "@/lib/api";
import { formatDate } from "@/lib/format";
import { getOrder } from "@/services/orders";

export const metadata: Metadata = {
  title: "AANZARA Admin | Order Details",
};

/**
 * The page itself is static; reading params happens inside <Suspense> in
 * <OrderDetailContent>, the same pattern as the placeholder page and the list pages.
 */
export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <>
      <Link
        href="/orders"
        className="inline-flex w-fit items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-orange-600"
      >
        <ArrowLeft size={15} />
        Back to orders
      </Link>

      <Suspense fallback={<DetailSkeleton />}>
        <OrderDetailContent params={params} />
      </Suspense>
    </>
  );
}

async function OrderDetailContent({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  let order;
  try {
    order = await getOrder(decodeURIComponent(id));
  } catch (error) {
    // An unknown order id is a normal 404 page. Anything else goes to the error page.
    if (error instanceof ApiError && error.status === 404) notFound();
    throw error;
  }

  return (
    <>
      <PageHeader
        title={`Order ${order.id}`}
        description={`Placed on ${formatDate(order.placedAt)}`}
        action={<StatusBadge status={order.status} />}
      />

      <div className="grid grid-cols-1 items-start gap-5 xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <div className="space-y-5">
          <OrderItemsCard items={order.items} />
          <OrderSummaryCard order={order} />
        </div>

        <div className="space-y-5">
          <OrderTimeline order={order} />
          <OrderCustomerCard order={order} />
        </div>
      </div>
    </>
  );
}

function DetailSkeleton() {
  return (
    <div role="status" aria-label="Loading order" className="space-y-5">
      <Skeleton className="h-12 w-72" />
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <div className="space-y-5">
          <CardSkeleton rows={3} />
          <CardSkeleton rows={4} />
        </div>
        <div className="space-y-5">
          <CardSkeleton rows={4} />
          <CardSkeleton rows={4} />
        </div>
      </div>
    </div>
  );
}