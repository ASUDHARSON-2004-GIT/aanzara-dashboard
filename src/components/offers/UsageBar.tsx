import { formatNumber } from "@/lib/format";

const NEARLY_USED_UP = 90; // percent

/** "187 of 300" with a progress bar. Unlimited offers just show the count. */
export default function UsageBar({ used, limit }: { used: number; limit: number }) {
  if (limit === 0) {
    return (
      <p className="whitespace-nowrap text-gray-700">
        {formatNumber(used)} <span className="text-xs text-gray-400">used · no limit</span>
      </p>
    );
  }

  const percent = Math.min(100, Math.round((used / limit) * 100));

  return (
    <div className="w-32">
      <p className="whitespace-nowrap text-gray-700">
        {formatNumber(used)} <span className="text-xs text-gray-400">of {formatNumber(limit)}</span>
      </p>
      <div
        role="progressbar"
        aria-label="Usage"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
        className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-gray-100"
      >
        <div
          className={`h-full rounded-full ${percent >= NEARLY_USED_UP ? "bg-red-500" : "bg-[#ff6b1a]"}`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}