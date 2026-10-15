import { Hourglass, Play, type LucideIcon } from "lucide-react";
import { formatDate } from "@/lib/format";
import { describeDays } from "@/lib/offers-labels";
import type { OfferEventKind, OfferSchedule } from "@/types/offers";
import Card from "../ui/Card";

const eventStyles = {
  starts: { icon: Play, tone: "bg-blue-100 text-blue-600", verb: "starts" },
  ends: { icon: Hourglass, tone: "bg-orange-100 text-orange-600", verb: "ends" },
} satisfies Record<OfferEventKind, { icon: LucideIcon; tone: string; verb: string }>;

/** What is about to start or end, so nothing runs out unnoticed. */
export default function UpcomingEvents({ schedule }: { schedule: OfferSchedule }) {
  return (
    <Card
      title="Coming Up"
      action={<span className="text-xs text-gray-400">Next {schedule.windowDays} days</span>}
    >
      {schedule.events.length === 0 ? (
        <p className="py-10 text-center text-sm text-gray-500">
          No offers start or end in the next {schedule.windowDays} days.
        </p>
      ) : (
        <ul className="divide-y divide-gray-100">
          {schedule.events.map((event) => {
            const { icon: Icon, tone, verb } = eventStyles[event.kind];

            return (
              <li key={`${event.offerId}-${event.kind}`} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                <span className={`rounded-xl p-2.5 ${tone}`}>
                  <Icon size={16} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-gray-900">
                    {event.code} <span className="font-normal text-gray-500">{verb}</span>
                  </p>
                  <p className="text-xs text-gray-400">{formatDate(event.date)}</p>
                </div>
                <span className="whitespace-nowrap text-xs font-medium text-gray-600 first-letter:uppercase">
                  {describeDays(event.inDays)}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </Card>
  );
}