import { formatDate, formatNumber } from "@/lib/format";
import { describeConditions } from "@/lib/offers-labels";
import { describeOffer } from "@/lib/salse-labels";
import type { OfferStatus, OfferType } from "@/types/offers";
import Card from "../ui/Card";
import { CouponStatusBadge } from "../sales/SalesBadges";

interface OfferPreviewProps {
  today: string;
  code: string;
  description: string;
  type: OfferType;
  value: number;
  minOrder: number;
  maxDiscount: number;
  usageLimit: number;
  startsAt: string;
  expiresAt: string;
  enabled: boolean;
}

/** Updates as the form is filled in, so the admin sees what they are creating. */
export default function OfferPreview(props: OfferPreviewProps) {
  const { today, type, value, startsAt, expiresAt, enabled } = props;

  const status: OfferStatus = !enabled ? "disabled" : startsAt && startsAt > today ? "scheduled" : "active";
  const headline = type === "free_shipping" || value > 0 ? describeOffer(type, value) : "Discount not set";

  const validity =
    startsAt && expiresAt
      ? `${formatDate(startsAt)} – ${formatDate(expiresAt)}`
      : startsAt
        ? `From ${formatDate(startsAt)}`
        : "Dates not set";

  return (
    <Card title="Live preview">
      <div className="rounded-xl border-2 border-dashed border-orange-200 bg-orange-50/50 p-4">
        <div className="flex items-start justify-between gap-3">
          <span className="rounded-md bg-white px-2.5 py-1 font-mono text-sm font-bold tracking-wide text-orange-600 shadow-sm">
            {props.code || "YOURCODE"}
          </span>
          <CouponStatusBadge status={status} />
        </div>

        <p className="mt-4 text-2xl font-bold text-gray-900">{headline}</p>
        <p className="mt-1 text-sm text-gray-600">{props.description || "Your description appears here."}</p>

        <dl className="mt-4 space-y-2 border-t border-dashed border-orange-200 pt-4 text-xs">
          <Row label="Conditions" value={describeConditions(props)} />
          <Row
            label="Usage"
            value={props.usageLimit > 0 ? `${formatNumber(props.usageLimit)} uses in total` : "Unlimited uses"}
          />
          <Row label="Valid" value={validity} />
        </dl>
      </div>
    </Card>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-3">
      <dt className="text-gray-500">{label}</dt>
      <dd className="text-right font-medium text-gray-800">{value}</dd>
    </div>
  );
}