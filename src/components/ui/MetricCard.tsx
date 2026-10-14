import type { LucideIcon } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string; // already formatted
  /** Small grey line under the value. */
  hint?: string;
  icon: LucideIcon;
  /** Tailwind classes for the icon tile, e.g. "bg-orange-100 text-orange-600" */
  tone: string;
}

/** Like StatCard but without a trend, for plain counts (catalog, inventory...). */
export default function MetricCard({ title, value, hint, icon: Icon, tone }: MetricCardProps) {
  return (
    <article className="flex min-w-0 items-center gap-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className={`rounded-xl p-4 ${tone}`}>
        <Icon size={25} />
      </div>
      <div className="min-w-0">
        <p className="text-sm text-gray-500">{title}</p>
        <p className="mt-1 text-xl font-bold tracking-tight text-gray-900 sm:text-2xl">{value}</p>
        {hint && <p className="mt-1 text-xs text-gray-400">{hint}</p>}
      </div>
    </article>
  );
}
