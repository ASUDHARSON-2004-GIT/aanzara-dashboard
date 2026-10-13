/** Grey pulsing block used inside loading fallbacks. */
export default function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`animate-pulse rounded-lg bg-gray-100 ${className}`}
    />
  );
}

/** Ready-made fallback for a titled card, e.g. the table / list panels. */
export function CardSkeleton({ rows = 5, className = "" }: { rows?: number; className?: string }) {
  return (
    <div
      role="status"
      aria-label="Loading"
      className={`rounded-2xl border border-gray-100 bg-white p-5 shadow-sm ${className}`}
    >
      <Skeleton className="mb-5 h-5 w-40" />
      <div className="space-y-3">
        {Array.from({ length: rows }, (_, i) => (
          <Skeleton key={i} className="h-10 w-full" />
        ))}
      </div>
    </div>
  );
}
