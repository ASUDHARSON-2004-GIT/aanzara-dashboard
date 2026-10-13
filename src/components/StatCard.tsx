import type { LucideIcon } from "lucide-react";
import { TrendingDown, TrendingUp } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string; // already formatted
  changePercent: number;
  /** What the change is compared against, e.g. "vs last month". Comes from the API. */
  comparisonLabel: string;
  icon: LucideIcon;
  /** Tailwind classes for the icon tile, e.g. "bg-orange-100 text-orange-600" */
  tone: string;
}

export default function StatCard({
  title,
  value,
  changePercent,
  comparisonLabel,
  icon: Icon,
  tone,
}: StatCardProps) {
  const isUp = changePercent >= 0;
  const TrendIcon = isUp ? TrendingUp : TrendingDown;

  return (
    <article className="flex min-w-0 items-center gap-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className={`rounded-xl p-4 ${tone}`}>
        <Icon size={25} />
      </div>

      <div className="min-w-0">
        <p className="text-sm text-gray-500">{title}</p>
        <div className="mt-1 flex flex-wrap items-baseline gap-x-2">
          <p className="text-xl font-bold tracking-tight text-gray-900 sm:text-2xl">{value}</p>
          <span
            className={`flex items-center gap-0.5 text-xs font-semibold ${isUp ? "text-green-600" : "text-red-500"}`}
          >
            <TrendIcon size={13} />
            {Math.abs(changePercent)}%
          </span>
        </div>
        <p className="mt-1 text-xs text-gray-400">{comparisonLabel}</p>
      </div>
    </article>
  );
}
