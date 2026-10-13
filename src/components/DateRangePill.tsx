import { CalendarDays } from "lucide-react";
import { formatRangeDate } from "@/lib/format";

export default function DateRangePill({ from, to }: { from: string; to: string }) {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 shadow-sm">
      <CalendarDays size={16} className="text-gray-500" />
      {formatRangeDate(from)} - {formatRangeDate(to)}
    </div>
  );
}
