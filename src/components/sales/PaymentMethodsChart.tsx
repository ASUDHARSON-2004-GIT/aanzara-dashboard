"use client";

import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import { formatCurrency, formatNumber } from "@/lib/format";
import { paymentMethodLabels } from "@/lib/salse-labels";
import type { PaymentMethod, PaymentMethodSales } from "@/types/sales";
import Card from "../ui/Card";

const COLORS: Record<PaymentMethod, string> = {
  upi: "#f97316",
  card: "#8b5cf6",
  netbanking: "#22c55e",
  cod: "#3b82f6",
};

/** Client Component because Recharts needs the browser. The data arrives as a prop from the server. */
export default function PaymentMethodsChart({ data }: { data: PaymentMethodSales[] }) {
  const totalRevenue = data.reduce((sum, item) => sum + item.revenue, 0);
  const totalOrders = data.reduce((sum, item) => sum + item.orders, 0);

  return (
    <Card title="Revenue by Payment Method">
      {data.length === 0 ? (
        <p className="py-8 text-center text-sm text-gray-500">No payments yet.</p>
      ) : (
        <div className="@container flex flex-1 items-center">
          <div className="flex w-full flex-col items-center gap-5 @[320px]:flex-row">
            <div className="relative size-36 shrink-0">
              <ResponsiveContainer width="100%" height="100%" initialDimension={{ width: 144, height: 144 }}>
                <PieChart>
                  <Pie
                    data={data}
                    dataKey="revenue"
                    nameKey="method"
                    innerRadius={46}
                    outerRadius={68}
                    paddingAngle={2}
                    stroke="none"
                    startAngle={90}
                    endAngle={-270}
                  >
                    {data.map((item) => (
                      <Cell key={item.method} fill={COLORS[item.method]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>

              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xl font-bold text-gray-900">{formatNumber(totalOrders)}</span>
                <span className="text-[11px] font-medium text-gray-500">Orders</span>
              </div>
            </div>

            <ul className="w-full min-w-0 flex-1 space-y-3 text-xs">
              {data.map((item) => (
                <li key={item.method} className="flex items-center gap-2">
                  <span className="size-2.5 shrink-0 rounded-full" style={{ background: COLORS[item.method] }} />
                  <div className="min-w-0 flex-1">
                    <p className="text-gray-700">{paymentMethodLabels[item.method]}</p>
                    <p className="text-[11px] text-gray-400">
                      {formatNumber(item.orders)} orders, {formatCurrency(item.revenue)}
                    </p>
                  </div>
                  <span className="font-semibold text-gray-900">
                    {totalRevenue ? Math.round((item.revenue / totalRevenue) * 100) : 0}%
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </Card>
  );
}