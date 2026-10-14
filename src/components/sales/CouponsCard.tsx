import { formatCurrency, formatNumber } from "@/lib/format";
import { describeOffer } from "@/lib/salse-labels";
import type { CouponPerformance } from "@/types/sales";
import Card from "../ui/Card";
import { CouponStatusBadge } from "./SalesBadges";

export default function CouponsCard({ coupons }: { coupons: CouponPerformance[] }) {
  return (
    <Card title="Coupon Performance">
      {/* The wrapper scrolls sideways on small screens instead of breaking the layout */}
      <div className="-mx-5 overflow-x-auto px-5">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className="bg-gray-50 text-xs text-gray-500">
              <th className="rounded-l-lg px-2.5 py-2 font-medium">Coupon</th>
              <th className="px-2.5 py-2 font-medium">Offer</th>
              <th className="px-2.5 py-2 font-medium">Status</th>
              <th className="px-2.5 py-2 font-medium">Total uses</th>
              <th className="px-2.5 py-2 font-medium">Orders in sales</th>
              <th className="rounded-r-lg px-2.5 py-2 font-medium">Discount given</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {coupons.map((coupon) => (
              <tr key={coupon.id}>
                <td className="px-2.5 py-3">
                  <p className="font-semibold text-gray-900">{coupon.code}</p>
                  <p className="text-xs text-gray-400">{coupon.description}</p>
                </td>
                <td className="whitespace-nowrap px-2.5 py-3 text-gray-700">
                  {describeOffer(coupon.type, coupon.value)}
                </td>
                <td className="px-2.5 py-3">
                  <CouponStatusBadge status={coupon.status} />
                </td>
                <td className="whitespace-nowrap px-2.5 py-3 text-gray-700">
                  {formatNumber(coupon.usedCount)}
                  <span className="text-xs text-gray-400">
                    {coupon.usageLimit > 0 ? ` of ${formatNumber(coupon.usageLimit)}` : " (no limit)"}
                  </span>
                </td>
                <td className="whitespace-nowrap px-2.5 py-3 text-gray-700">{formatNumber(coupon.orders)}</td>
                <td className="whitespace-nowrap px-2.5 py-3 font-medium text-gray-900">
                  {formatCurrency(coupon.discountGiven)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}