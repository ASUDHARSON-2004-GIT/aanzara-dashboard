"use client";

import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import { formatNumber } from "@/lib/format";
import type { OrderStatus, OrderStatusBreakdown } from "@/types/dashboard";
import Card from "./ui/Card";

const COLORS: Record<OrderStatus, string> = {
  delivered: "#22c55e",
  processing: "#f97316",
  shipped: "#facc15",
  cancelled: "#ef4444",
};

const LABELS: Record<OrderStatus, string> = {
  delivered: "Delivered",
  processing: "Processing",
  shipped: "Shipped",
  cancelled: "Cancelled",
};

export default function OrderStatusChart({ data }: { data: OrderStatusBreakdown[] }) {
  const total = data.reduce((sum, item) => sum + item.count, 0);

  return (
    <Card title="Order Status">
      <div className="@container flex flex-1 items-center">
        <div className="flex w-full flex-col items-center gap-4 @[240px]:flex-row @[240px]:gap-3">
          {/* Donut + centre label */}
          <div className="relative size-28 shrink-0">
            <ResponsiveContainer
              width="100%"
              height="100%"
              initialDimension={{ width: 112, height: 112 }}
            >
              <PieChart>
                <Pie
                  data={data}
                  dataKey="count"
                  nameKey="status"
                  innerRadius={36}
                  outerRadius={53}
                  paddingAngle={2}
                  stroke="none"
                  startAngle={90}
                  endAngle={-270}
                >
                  {data.map((item) => (
                    <Cell key={item.status} fill={COLORS[item.status]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>

            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-lg font-bold text-gray-900">{formatNumber(total)}</span>
              <span className="text-[10px] font-medium text-gray-500">Orders</span>
            </div>
          </div>

          {/* Legend */}
          <ul className="w-full min-w-0 flex-1 space-y-3 text-xs">
            {data.map((item) => (
              <li key={item.status} className="flex items-center gap-2">
                <span
                  className="size-2.5 shrink-0 rounded-full"
                  style={{ background: COLORS[item.status] }}
                />
                <span className="flex-1 whitespace-nowrap text-gray-600">
                  {LABELS[item.status]}
                </span>
                <span className="font-semibold text-gray-900">
                  {total ? Math.round((item.count / total) * 100) : 0}%
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Card>
  );
}