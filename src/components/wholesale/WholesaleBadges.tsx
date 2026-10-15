import { wholesaleStatusLabels, wholesaleTierLabels } from "@/lib/wholesale-query";
import type { WholesaleStatus, WholesaleTier } from "@/types/wholesale";

const badgeBase = "inline-block whitespace-nowrap rounded-md px-2.5 py-1 text-xs font-medium";

const tierStyles: Record<WholesaleTier, string> = {
  gold: "bg-yellow-50 text-yellow-700",
  silver: "bg-gray-100 text-gray-600",
  bronze: "bg-orange-50 text-orange-700",
};

const statusStyles: Record<WholesaleStatus, string> = {
  active: "bg-green-50 text-green-600",
  on_hold: "bg-orange-50 text-orange-500",
  inactive: "bg-gray-100 text-gray-500",
};

export function TierBadge({ tier }: { tier: WholesaleTier }) {
  return <span className={`${badgeBase} ${tierStyles[tier]}`}>{wholesaleTierLabels[tier]}</span>;
}

export function AccountStatusBadge({ status }: { status: WholesaleStatus }) {
  return <span className={`${badgeBase} ${statusStyles[status]}`}>{wholesaleStatusLabels[status]}</span>;
}