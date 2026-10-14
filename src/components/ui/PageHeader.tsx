import type { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  description?: string;
  /** Right-aligned slot, e.g. the page's primary button. */
  action?: ReactNode;
}

/** Title row shared by every admin page after the dashboard. */
export default function PageHeader({ title, description, action }: PageHeaderProps) {
  return (
    <section className="flex flex-wrap items-center justify-between gap-4">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">{title}</h2>
        {description && <p className="mt-1 text-sm text-gray-500">{description}</p>}
      </div>
      {action}
    </section>
  );
}
