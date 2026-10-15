import Link from "next/link";
import { Eye, SearchX } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/format";
import { toWholesaleSearchParams } from "@/lib/wholesale-query";
import type { WholesaleList, WholesaleQuery } from "@/types/wholesale";
import Pagination from "../ui/Pagination";
import { AccountStatusBadge, TierBadge } from "./WholesaleBadges";

export default function WholesaleTable({ list, query }: { list: WholesaleList; query: WholesaleQuery }) {
  const hrefForPage = (page: number) => {
    const params = toWholesaleSearchParams({ ...query, page }).toString();
    return params ? `/wholesale?${params}` : "/wholesale";
  };

  if (list.total === 0) {
    return (
      <div className="flex flex-col items-center gap-2 py-12 text-center">
        <SearchX className="text-gray-300" size={32} />
        <p className="text-sm font-semibold text-gray-900">No wholesale accounts match your filters</p>
        <p className="text-xs text-gray-500">Try a different search or clear the filters.</p>
        <Link href="/wholesale" className="mt-2 text-xs font-medium text-orange-600 hover:underline">
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
              <th className="rounded-l-lg px-2.5 py-2 font-medium">Business</th>
              <th className="px-2.5 py-2 font-medium">Contact</th>
              <th className="px-2.5 py-2 font-medium">Location</th>
              <th className="px-2.5 py-2 font-medium">Tier</th>
              <th className="px-2.5 py-2 font-medium">Orders</th>
              <th className="px-2.5 py-2 font-medium">Total Purchased</th>
              <th className="px-2.5 py-2 font-medium">Last Order</th>
              <th className="px-2.5 py-2 font-medium">Status</th>
              <th className="rounded-r-lg px-2.5 py-2 text-center font-medium">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {list.items.map((account) => (
              <tr key={account.id}>
                <td className="px-2.5 py-3">
                  <Link
                    href={`/wholesale/${account.id}`}
                    className="font-semibold text-gray-900 hover:text-orange-600"
                  >
                    {account.businessName}
                  </Link>
                  <p className="text-xs text-gray-400">GSTIN {account.gstin}</p>
                </td>
                <td className="px-2.5 py-3">
                  <p className="whitespace-nowrap font-medium text-gray-900">{account.contactName}</p>
                  <p className="whitespace-nowrap text-xs text-gray-400">{account.phone}</p>
                </td>
                <td className="whitespace-nowrap px-2.5 py-3">
                  <p className="font-medium text-gray-900">{account.city}</p>
                  <p className="text-xs text-gray-400">{account.state}</p>
                </td>
                <td className="px-2.5 py-3">
                  <TierBadge tier={account.tier} />
                </td>
                <td className="whitespace-nowrap px-2.5 py-3 text-gray-900">
                  {account.totalOrders} {account.totalOrders === 1 ? "order" : "orders"}
                </td>
                <td className="whitespace-nowrap px-2.5 py-3 font-medium text-gray-900">
                  {formatCurrency(account.totalPurchased)}
                </td>
                <td className="whitespace-nowrap px-2.5 py-3 text-gray-700">{formatDate(account.lastOrderAt)}</td>
                <td className="px-2.5 py-3">
                  <AccountStatusBadge status={account.status} />
                </td>
                <td className="px-2.5 py-3 text-center">
                  <Link
                    href={`/wholesale/${account.id}`}
                    aria-label={`View ${account.businessName}`}
                    className="inline-flex rounded-lg border border-gray-200 p-2 text-gray-600 hover:bg-gray-50"
                  >
                    <Eye size={16} />
                  </Link>
                </td>
              </tr>
            ))}
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