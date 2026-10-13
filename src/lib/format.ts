// Formatters are created once (cheap to reuse) and pinned to en-IN / UTC so
// the server and browser always render identical text (no hydration mismatch).

const currency = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

const number = new Intl.NumberFormat("en-IN");

const fullDate = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

const rangeDate = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "2-digit",
  year: "numeric",
  timeZone: "UTC",
});

const shortDate = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  timeZone: "UTC",
});

export const formatCurrency = (value: number) => currency.format(value);
export const formatNumber = (value: number) => number.format(value);
/** "15 Oct 2026" */
export const formatDate = (iso: string) => fullDate.format(new Date(iso));
/** "Oct 01, 2026" */
export const formatRangeDate = (iso: string) => rangeDate.format(new Date(iso));
/** "Oct 5" */
export const formatShortDate = (iso: string) => shortDate.format(new Date(iso));
/** 200000 -> "200K" */
export const formatCompact = (value: number) =>
  value >= 1000 ? `${value / 1000}K` : String(value);
