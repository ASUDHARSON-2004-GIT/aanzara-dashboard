import type { ReactNode } from "react";

interface CardProps {
  title?: string;
  /** Right-aligned slot in the header (filters, "View All" links...). */
  action?: ReactNode;
  className?: string;
  children: ReactNode;
}

/** Every dashboard panel shares this shell, so spacing/radius stay consistent. */
export default function Card({ title, action, className = "", children }: CardProps) {
  return (
    <section
      className={`min-w-0 flex flex-1 flex-col rounded-2xl border border-gray-100 bg-white p-5 shadow-sm ${className}`}
    >
      {(title || action) && (
        <header className="mb-4 flex items-center justify-between gap-3">
          {title && <h3 className="text-[15px] font-bold text-gray-900">{title}</h3>}
          {action}
        </header>
      )}
      {children}
    </section>
  );
}
