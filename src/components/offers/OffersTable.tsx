import Link from "next/link";
import { SearchX } from "lucide-react";
import { formatCurrency, formatDate, formatNumber } from "@/lib/format";
import { describeConditions, describeTiming } from "@/lib/offers-labels";
import { toOfferSearchParams } from "@/lib/offers-query";
import { describeOffer } from "@/lib/salse-labels";
import type { OfferList, OfferQuery } from "@/types/offers";
import Pagination from "../ui/Pagination";
import { CouponStatusBadge } from "../sales/SalesBadges";
import CopyCodeButton from "./CopyCodeButton";
import UsageBar from "./UsageBar";
import OfferStatusToggle from "./OfferStatusToggle";

/** An active offer ending within this many days is highlighted. */
const ENDING_SOON_DAYS = 7;

export default function OffersTable({ list, query }: { list: OfferList; query: OfferQuery }) {
  const hrefForPage = (page: number) => {
    const params = toOfferSearchParams({ ...query, page }).toString();
    return params ? `/offers?${params}` : "/offers";
  };

  if (list.total === 0) {
    return (
      <div className="flex flex-col items-center gap-2 py-12 text-center">
        <SearchX className="text-gray-300" size={32} />
        <p className="text-sm font-semibold text-gray-900">No offers match your filters</p>
        <p className="text-xs text-gray-500">Try a different search or clear the filters.</p>
        <Link href="/offers" className="mt-2 text-xs font-medium text-orange-600 hover:underline">
          Clear filters
        </Link>
      </div>
    );
  }

  return (
    <>
      {/* The wrapper scrolls sideways on small screens instead of breaking the layout */}
      <div className="-mx-5 overflow-x-auto px-5">
        <table className="w-full min-w-[1040px] text-left text-sm">
          <thead>
            <tr className="bg-gray-50 text-xs text-gray-500">
              <th className="rounded-l-lg px-2.5 py-2 font-medium">Offer</th>
              <th className="px-2.5 py-2 font-medium">Discount</th>
              <th className="px-2.5 py-2 font-medium">Usage</th>
              <th className="px-2.5 py-2 font-medium">Validity</th>
              <th className="px-2.5 py-2 font-medium">Status</th>
              <th className="px-2.5 py-2 font-medium">Performance</th>
              <th className="rounded-r-lg px-2.5 py-2 font-medium">Enabled</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {list.items.map((offer) => {
              const endingSoon = offer.status === "active" && offer.endsInDays <= ENDING_SOON_DAYS;

              return (
                <tr key={offer.id}>
                  <td className="px-2.5 py-3">
                    <div className="flex items-center gap-1">
                      <span className="rounded-md bg-orange-50 px-2 py-1 font-mono text-xs font-semibold text-orange-600">
                        {offer.code}
                      </span>
                      <CopyCodeButton code={offer.code} />
                    </div>
                    <p className="mt-1 max-w-[240px] truncate text-xs text-gray-400">{offer.description}</p>
                  </td>
                  <td className="px-2.5 py-3">
                    <p className="whitespace-nowrap font-medium text-gray-900">
                      {describeOffer(offer.type, offer.value)}
                    </p>
                    <p className="whitespace-nowrap text-xs text-gray-400">{describeConditions(offer)}</p>
                  </td>
                  <td className="px-2.5 py-3">
                    <UsageBar used={offer.usedCount} limit={offer.usageLimit} />
                  </td>
                  <td className="px-2.5 py-3">
                    <p className="whitespace-nowrap text-gray-700">
                      {formatDate(offer.startsAt)} – {formatDate(offer.expiresAt)}
                    </p>
                    <p
                      className={`text-xs ${endingSoon ? "font-medium text-orange-500" : "text-gray-400"}`}
                    >
                      {describeTiming(offer)}
                    </p>
                  </td>
                  <td className="px-2.5 py-3">
                    <CouponStatusBadge status={offer.status} />
                  </td>
                  <td className="px-2.5 py-3">
                    {offer.orders > 0 ? (
                      <>
                        {/* The Sales search also matches coupon codes, so this lists the orders that used it */}
                        <Link
                          href={`/sales?search=${encodeURIComponent(offer.code)}`}
                          className="whitespace-nowrap font-medium text-gray-900 hover:text-orange-600"
                        >
                          {formatNumber(offer.orders)} {offer.orders === 1 ? "order" : "orders"}
                        </Link>
                        <p className="whitespace-nowrap text-xs text-gray-400">
                          {formatCurrency(offer.discountGiven)} discount
                        </p>
                      </>
                    ) : (
                      <p className="whitespace-nowrap text-xs text-gray-400">No orders yet</p>
                    )}
                  </td>
                  <td className="px-2.5 py-3">
                    <OfferStatusToggle id={offer.id} code={offer.code} status={offer.status} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <Pagination
        page={list.page}
        totalPages={list.totalPages}
        total={list.total}
        pageSize={list.pageSize}
        hrefForPage={hrefForPage}
      />
    </>
  );
}