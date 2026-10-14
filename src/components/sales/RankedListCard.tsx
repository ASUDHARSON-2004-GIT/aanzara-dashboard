import Card from "../ui/Card";

export interface RankedItem {
  key: string;
  label: string;
  /** Small grey line under the label, e.g. "7 units sold". */
  detail: string;
  /** Already formatted value shown on the right. */
  value: string;
  /** Bar length from 0 to 1, where 1 is the biggest row. */
  share: number;
}

/** A titled list where every row has a bar, used for top products and sales by state. */
export default function RankedListCard({ title, items }: { title: string; items: RankedItem[] }) {
  return (
    <Card title={title}>
      {items.length === 0 ? (
        <p className="py-8 text-center text-sm text-gray-500">Nothing to show yet.</p>
      ) : (
        <ul className="space-y-4">
          {items.map((item) => (
            <li key={item.key}>
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-[13px] font-semibold text-gray-900">{item.label}</p>
                  <p className="text-xs text-gray-400">{item.detail}</p>
                </div>
                <p className="shrink-0 text-[13px] font-medium text-gray-900">{item.value}</p>
              </div>
              <div className="mt-2 h-1.5 w-full rounded-full bg-gray-100">
                <div
                  className="h-full rounded-full bg-[#ff6b1a]"
                  style={{ width: `${Math.max(item.share * 100, 4)}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}