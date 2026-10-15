import { formatDate } from "@/lib/format";
import { OFFER_STATUSES } from "@/lib/offers-query";
import { couponStatusLabels, describeOffer } from "@/lib/salse-labels";
import type { OfferStatus, OfferTimeline as OfferTimelineData, OfferTimelineItem } from "@/types/offers";
import Card from "../ui/Card";

const MS_PER_DAY = 86_400_000;

const barStyles: Record<OfferStatus, string> = {
  active: "bg-green-500",
  scheduled: "bg-blue-500",
  expired: "bg-gray-300",
  disabled: "bg-red-300",
};

const monthFormat = new Intl.DateTimeFormat("en-US", { month: "short", timeZone: "UTC" });
const utc = (iso: string) => Date.parse(`${iso}T00:00:00Z`);

/** Whole months that cover every offer, plus a helper that turns a date into a % position. */
function buildAxis(items: OfferTimelineItem[]) {
  const first = new Date(Math.min(...items.map((item) => utc(item.startsAt))));
  const last = new Date(Math.max(...items.map((item) => utc(item.expiresAt))));

  const from = Date.UTC(first.getUTCFullYear(), first.getUTCMonth(), 1);
  const to = Date.UTC(last.getUTCFullYear(), last.getUTCMonth() + 1, 1);
  const percent = (time: number) => ((time - from) / (to - from)) * 100;

  const months: { label: string; left: number }[] = [];
  for (let time = from; time < to; ) {
    const month = new Date(time);
    months.push({ label: monthFormat.format(month), left: percent(time) });
    time = Date.UTC(month.getUTCFullYear(), month.getUTCMonth() + 1, 1);
  }

  return { months, percent };
}

/**
 * One bar per offer on a shared month axis, so overlaps and gaps between campaigns
 * are visible at a glance. Pure CSS (no chart library); the bars are decorative, so the
 * code column carries the dates for screen readers.
 */
export default function OfferTimeline({ data }: { data: OfferTimelineData }) {
  const legend = (
    <ul className="hidden items-center gap-3 text-xs text-gray-500 sm:flex">
      {OFFER_STATUSES.map((status) => (
        <li key={status} className="flex items-center gap-1.5">
          <span aria-hidden="true" className={`size-2 rounded-full ${barStyles[status]}`} />
          {couponStatusLabels[status]}
        </li>
      ))}
    </ul>
  );

  if (data.items.length === 0) {
    return (
      <Card title="Offer Timeline">
        <p className="py-10 text-center text-sm text-gray-500">No offers to show yet.</p>
      </Card>
    );
  }

  const { months, percent } = buildAxis(data.items);
  const todayLeft = percent(utc(data.today));
  const showToday = todayLeft >= 0 && todayLeft <= 100;

  return (
    <Card title="Offer Timeline" action={legend}>
      <div className="-mx-5 overflow-x-auto px-5">
        <div className="flex min-w-[560px] gap-3">
          {/* Labels */}
          <div className="w-[104px] shrink-0">
            <div className="h-6" />
            <ul className="flex flex-col gap-2">
              {data.items.map((item) => (
                <li key={item.id} className="flex h-8 items-center">
                  <span className="truncate text-xs font-semibold text-gray-900">{item.code}</span>
                  <span className="sr-only">
                    , {describeOffer(item.type, item.value)}, {formatDate(item.startsAt)} to{" "}
                    {formatDate(item.expiresAt)}, {couponStatusLabels[item.status]}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Bars */}
          <div aria-hidden="true" className="min-w-0 flex-1">
            <div className="relative h-6 text-[11px] text-gray-400">
              {months.map((month) => (
                <span key={month.left} className="absolute top-0" style={{ left: `${month.left}%` }}>
                  {month.label}
                </span>
              ))}
            </div>

            <div className="relative flex flex-col gap-2 pb-6">
              {months.map((month) => (
                <span
                  key={month.left}
                  className="absolute inset-y-0 w-px bg-gray-100"
                  style={{ left: `${month.left}%` }}
                />
              ))}

              {data.items.map((item) => {
                const left = percent(utc(item.startsAt));
                // +1 day so the last day of the offer is included in the bar.
                const width = percent(utc(item.expiresAt) + MS_PER_DAY) - left;

                return (
                  <div key={item.id} className="relative h-8">
                    <div
                      title={`${item.description} · ${formatDate(item.startsAt)} – ${formatDate(item.expiresAt)}`}
                      className={`absolute inset-y-1.5 min-w-[6px] rounded-md ${barStyles[item.status]}`}
                      style={{ left: `${left}%`, width: `${width}%` }}
                    />
                  </div>
                );
              })}

              {showToday && (
                <>
                  <span
                    className="absolute inset-y-0 w-px bg-[#ff6b1a]"
                    style={{ left: `${todayLeft}%` }}
                  />
                  <span
                    className="absolute bottom-0 -translate-x-1/2 rounded bg-[#ff6b1a] px-1.5 py-0.5 text-[10px] font-medium text-white"
                    style={{ left: `${todayLeft}%` }}
                  >
                    Today
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}