import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  page: number;
  totalPages: number;
  total: number;
  pageSize: number;
  /** Builds the link for a page number, so the caller keeps its own filters in the URL. */
  hrefForPage: (page: number) => string;
}

const buttonBase =
  "flex size-8 items-center justify-center rounded-lg border text-xs font-medium transition";

export default function Pagination({ page, totalPages, total, pageSize, hrefForPage }: PaginationProps) {
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);

  // Show at most 5 page numbers, centred on the current page.
  const start = Math.max(1, Math.min(page - 2, totalPages - 4));
  const pages = Array.from({ length: Math.min(5, totalPages) }, (_, i) => start + i);

  return (
    <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 pt-4">
      <p className="text-xs text-gray-500">
        Showing {from}–{to} of {total}
      </p>

      {totalPages > 1 && (
        <nav aria-label="Pagination" className="flex items-center gap-1.5">
          {page > 1 ? (
            <Link
              href={hrefForPage(page - 1)}
              aria-label="Previous page"
              className={`${buttonBase} border-gray-200 text-gray-600 hover:bg-gray-50`}
            >
              <ChevronLeft size={15} />
            </Link>
          ) : (
            <span aria-hidden="true" className={`${buttonBase} border-gray-100 text-gray-300`}>
              <ChevronLeft size={15} />
            </span>
          )}

          {pages.map((value) => (
            <Link
              key={value}
              href={hrefForPage(value)}
              aria-current={value === page ? "page" : undefined}
              className={`${buttonBase} ${
                value === page
                  ? "border-[#ff6b1a] bg-[#ff6b1a] text-white"
                  : "border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              {value}
            </Link>
          ))}

          {page < totalPages ? (
            <Link
              href={hrefForPage(page + 1)}
              aria-label="Next page"
              className={`${buttonBase} border-gray-200 text-gray-600 hover:bg-gray-50`}
            >
              <ChevronRight size={15} />
            </Link>
          ) : (
            <span aria-hidden="true" className={`${buttonBase} border-gray-100 text-gray-300`}>
              <ChevronRight size={15} />
            </span>
          )}
        </nav>
      )}
    </div>
  );
}
