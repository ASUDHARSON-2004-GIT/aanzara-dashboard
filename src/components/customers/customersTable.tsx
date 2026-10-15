import Link from "next/link";
import { Eye, SearchX } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/format";
import { toCustomerSearchParams } from "@/lib/customers-query";
import type { CustomerList, CustomerQuery } from "@/types/customers";
import Pagination from "../ui/Pagination";
import CustomerAvatar from "./customerAvatar";
import CustomerTypeBadge from "./customerTypeBadge";

export default function CustomersTable({ list, query }: { list: CustomerList; query: CustomerQuery }) {
  const hrefForPage = (page: number) => {
    const params = toCustomerSearchParams({ ...query, page }).toString();
    return params ? `/customers?${params}` : "/customers";
  };

  if (list.total === 0) {
    return (
      <div className="flex flex-col items-center gap-2 py-12 text-center">
        <SearchX className="text-gray-300" size={32} />
        <p className="text-sm font-semibold text-gray-900">No customers match your filters</p>
        <p className="text-xs text-gray-500">Try a different search or clear the filters.</p>
        <Link href="/customers" className="mt-2 text-xs font-medium text-orange-600 hover:underline">
          Clear filters
        </Link>
      </div>
    );
  }

  return (
    <>
      {/* The wrapper scrolls sideways on small screens instead of breaking the layout */}
      <div className="-mx-5 overflow-x-auto px-5">
        <table className="w-full min-w-[960px] text-left text-sm">
          <thead>
            <tr className="bg-gray-50 text-xs text-gray-500">
              <th className="rounded-l-lg px-2.5 py-2 font-medium">Customer</th>
              <th className="px-2.5 py-2 font-medium">Phone</th>
              <th className="px-2.5 py-2 font-medium">Location</th>
              <th className="px-2.5 py-2 font-medium">Type</th>
              <th className="px-2.5 py-2 font-medium">Orders</th>
              <th className="px-2.5 py-2 font-medium">Total Spent</th>
              <th className="px-2.5 py-2 font-medium">Joined</th>
              <th className="rounded-r-lg px-2.5 py-2 text-center font-medium">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {list.items.map((customer) => (
              <tr key={customer.id}>
                <td className="px-2.5 py-3">
                  <div className="flex items-center gap-3">
                    <CustomerAvatar name={customer.name} />
                    <div className="min-w-0">
                      <Link
                        href={`/customers/${customer.id}`}
                        className="font-semibold text-gray-900 hover:text-orange-600"
                      >
                        {customer.name}
                      </Link>
                      <p className="max-w-[220px] truncate text-xs text-gray-400">{customer.email}</p>
                    </div>
                  </div>
                </td>
                <td className="whitespace-nowrap px-2.5 py-3 text-gray-700">{customer.phone}</td>
                <td className="whitespace-nowrap px-2.5 py-3">
                  <p className="font-medium text-gray-900">{customer.city}</p>
                  <p className="text-xs text-gray-400">{customer.state}</p>
                </td>
                <td className="px-2.5 py-3">
                  <CustomerTypeBadge type={customer.type} />
                </td>
                <td className="whitespace-nowrap px-2.5 py-3">
                  {/* Jumps to the Orders page with this customer's name in the search box */}
                  <Link
                    href={`/orders?search=${encodeURIComponent(customer.name)}`}
                    className="font-medium text-gray-900 hover:text-orange-600"
                  >
                    {customer.totalOrders} {customer.totalOrders === 1 ? "order" : "orders"}
                  </Link>
                </td>
                <td className="whitespace-nowrap px-2.5 py-3 font-medium text-gray-900">
                  {formatCurrency(customer.totalSpent)}
                </td>
                <td className="whitespace-nowrap px-2.5 py-3 text-gray-700">{formatDate(customer.joinedAt)}</td>
                <td className="px-2.5 py-3 text-center">
                  <Link
                    href={`/customers/${customer.id}`}
                    aria-label={`View ${customer.name}`}
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