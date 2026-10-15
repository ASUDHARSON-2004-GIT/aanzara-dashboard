import { Suspense } from "react";
import type { Metadata } from "next";
import { connection } from "next/server";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import OfferForm from "@/components/offers/OfferForm";
import PageHeader from "@/components/ui/PageHeader";

export const metadata: Metadata = {
  title: "AANZARA Admin | Create Offer",
};

/**
 * The form needs today's date on every request. Calling connection() tells Next that this
 * part must be rendered per request instead of at build time, and it has to sit inside
 * Suspense when Cache Components is enabled.
 */
async function OfferFormWithToday() {
  await connection();

  // UTC, the same day the API uses to decide whether a start date is in the past.
  const today = new Date().toISOString().slice(0, 10);

  return <OfferForm today={today} />;
}

export default function CreateOfferPage() {
  return (
    <>
      <PageHeader
        title="Create Offer"
        description="Set up a coupon code and choose when it runs."
        action={
          <Link
            href="/offers"
            className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <ArrowLeft size={16} />
            Back to offers
          </Link>
        }
      />
      <Suspense fallback={<div className="h-96 animate-pulse rounded-xl bg-gray-100" />}>
        <OfferFormWithToday />
      </Suspense>
    </>
  );
}