import { formatCurrency } from "@/lib/format";
import type { OfferRow } from "@/types/offers";

/** "today", "tomorrow", "in 10 days", "yesterday", "30 days ago" */
export function describeDays(days: number): string {
  if (days === 0) return "today";
  if (days === 1) return "tomorrow";
  if (days === -1) return "yesterday";
  return days > 0 ? `in ${days} days` : `${Math.abs(days)} days ago`;
}

/** One line about where an offer is in its life, e.g. "Ends in 31 days". */
export function describeTiming(offer: Pick<OfferRow, "status" | "startsInDays" | "endsInDays">): string {
  switch (offer.status) {
    case "scheduled":
      return `Starts ${describeDays(offer.startsInDays)}`;
    case "active":
      return `Ends ${describeDays(offer.endsInDays)}`;
    case "expired":
      return `Ended ${describeDays(offer.endsInDays)}`;
    case "disabled":
      return "Switched off manually";
  }
}

/** The rules of an offer, e.g. "Min order ₹999 · up to ₹300". */
export function describeConditions(offer: Pick<OfferRow, "type" | "minOrder" | "maxDiscount">): string {
  const parts = [offer.minOrder > 0 ? `Min order ${formatCurrency(offer.minOrder)}` : "No minimum order"];
  // For a flat offer the cap equals the value, so it is only worth showing for percentages.
  if (offer.type === "percentage" && offer.maxDiscount > 0) {
    parts.push(`up to ${formatCurrency(offer.maxDiscount)}`);
  }
  return parts.join(" · ");
}