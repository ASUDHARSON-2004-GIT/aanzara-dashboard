import Link from "next/link";
import { Eye, SearchX } from "lucide-react";
import { toSearchParams } from "@/lib/catalog-query";
import { formatCurrency, formatNumber } from "@/lib/format";
import type { ProductList, ProductQuery } from "@/types/catalog";
import Pagination from "../ui/Pagination";
import StatusBadge from "../ui/StatusBadge";
import Thumb from "../ui/Thumb";

interface ProductsTableProps {
  list: ProductList;
  query: ProductQuery;
}

export default function ProductsTable({ list, query }: ProductsTableProps) {
  const hrefForPage = (page: number) => {
    const params = toSearchParams({ ...query, page }).toString();
    return params ? `/catalog?${params}` : "/catalog";
  };

  if (list.total === 0) {
    return (
      <div className="flex flex-col items-center gap-2 py-12 text-center">
        <SearchX className="text-gray-300" size={32} />
        <p className="text-sm font-semibold text-gray-900">No products match your filters</p>
        <p className="text-xs text-gray-500">Try a different search or clear the filters.</p>
        <Link href="/catalog" className="mt-2 text-xs font-medium text-orange-600 hover:underline">
          Clear filters
        </Link>
      </div>
    );
  }

  return (
    <>
      {/* The wrapper scrolls sideways on small screens instead of breaking the layout */}
      <div className="-mx-5 overflow-x-auto px-5">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className="bg-gray-50 text-xs text-gray-500">
              <th className="rounded-l-lg px-2.5 py-2 font-medium">Product</th>
              <th className="px-2.5 py-2 font-medium">Category</th>
              <th className="px-2.5 py-2 font-medium">Price</th>
              <th className="px-2.5 py-2 font-medium">Stock</th>
              <th className="px-2.5 py-2 font-medium">Status</th>
              <th className="rounded-r-lg px-2.5 py-2 text-center font-medium">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {list.items.map((product) => (
              <tr key={product.id}>
                <td className="px-2.5 py-3">
                  <div className="flex items-center gap-3">
                    <Thumb name={product.name} imageUrl={product.imageUrl} />
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-900">{product.name}</p>
                      <p className="text-xs text-gray-400">
                        {product.sku} · {product.brandName}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="whitespace-nowrap px-2.5 py-3 text-gray-700">{product.categoryName}</td>
                <td className="whitespace-nowrap px-2.5 py-3">
                  <span className="font-medium text-gray-900">{formatCurrency(product.price)}</span>
                  {product.mrp > product.price && (
                    <span className="ml-1.5 text-xs text-gray-400 line-through">{formatCurrency(product.mrp)}</span>
                  )}
                </td>
                <td className="whitespace-nowrap px-2.5 py-3">
                  <div className="flex items-center gap-2">
                    <span className="w-8 text-gray-700">{formatNumber(product.stock)}</span>
                    <StatusBadge status={product.stockStatus} />
                  </div>
                </td>
                <td className="px-2.5 py-3">
                  <StatusBadge status={product.status} />
                </td>
                <td className="px-2.5 py-3 text-center">
                  <Link
                    href={`/catalog/products/${product.id}`}
                    aria-label={`View ${product.name}`}
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
