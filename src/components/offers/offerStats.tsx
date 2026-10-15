import { BadgePercent, CalendarClock, IndianRupee, Tag, Ticket, Zap } from "lucide-react";
import { formatCurrency, formatNumber } from "@/lib/format";
import type { OfferSummary } from "@/types/offers";
import MetricCard from "../ui/MetricCard";

export default function OfferStats({ summary }: { summary: OfferSummary }) {
  const { statusCounts } = summary;

  const cards = [
    {
      title: "Total Offers",
      value: formatNumber(summary.totalOffers),
      hint: `${statusCounts.expired} expired · ${statusCounts.disabled} disabled`,
      icon: Tag,
      tone: "bg-purple-100 text-purple-600",
    },
    {
      title: "Active Offers",
      value: formatNumber(statusCounts.active),
      hint: "Live for customers right now",
      icon: Zap,
      tone: "bg-green-100 text-green-600",
    },
    {
      title: "Scheduled",
      value: formatNumber(statusCounts.scheduled),
      hint: "Starting soon",
      icon: CalendarClock,
      tone: "bg-blue-100 text-blue-600",
    },
    {
      title: "Redemptions",
      value: formatNumber(summary.totalRedemptions),
      hint: "Lifetime coupon uses",
      icon: Ticket,
      tone: "bg-orange-100 text-orange-600",
    },
    {
      title: "Discount Given",
      value: formatCurrency(summary.discountGiven),
      hint: `Across ${formatNumber(summary.ordersWithOffer)} orders`,
      icon: BadgePercent,
      tone: "bg-red-100 text-red-600",
    },
    {
      title: "Offer Revenue",
      value: formatCurrency(summary.revenue),
      hint: "From orders that used an offer",
      icon: IndianRupee,
      tone: "bg-yellow-100 text-yellow-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {cards.map(({ title, value, hint, icon, tone }) => (
        <MetricCard key={title} title={title} value={value} hint={hint} icon={icon} tone={tone} />
      ))}
    </div>
  );
}