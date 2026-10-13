"use client";

import { useState } from "react";
import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatCompact, formatCurrency, formatShortDate } from "@/lib/format";
import type { SalesOverview, SalesPeriod } from "@/types/dashboard";
import Card from "./ui/Card";

const PERIODS: { value: SalesPeriod; label: string }[] = [
  { value: "month", label: "This Month" },
  { value: "week", label: "This Week" },
];

const ORANGE = "#ff6b1a";

/**
 * Client Component: it needs state (selected period) and the browser (Recharts).
 * The data itself was fetched on the server and arrives as a prop.
 */
export default function SalesChart({ data }: { data: SalesOverview }) {
  const [period, setPeriod] = useState<SalesPeriod>("month");
  const points = data[period];

  return (
    <Card
      title="Sales Overview"
      action={
        <div className="flex items-center gap-4">
          <ul className="hidden items-center gap-4 text-xs text-gray-500 sm:flex">
            <li className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-full" style={{ background: ORANGE }} />
              Sales
            </li>
            <li className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-full bg-orange-200" />
              Orders
            </li>
          </ul>
          <select
            aria-label="Sales period"
            value={period}
            onChange={(e) => setPeriod(e.target.value as SalesPeriod)}
            className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-orange-200"
          >
            {PERIODS.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>
        </div>
      }
    >
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%" initialDimension={{ width: 600, height: 256 }}>
          <ComposedChart data={points} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="salesFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={ORANGE} stopOpacity={0.25} />
                <stop offset="100%" stopColor={ORANGE} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke="#eef0f3" />
            <XAxis
              dataKey="date"
              tickFormatter={formatShortDate}
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 12, fill: "#6b7280" }}
              interval="preserveStartEnd"
              minTickGap={24}
            />
            <YAxis
              yAxisId="sales"
              tickFormatter={formatCompact}
              tickLine={false}
              axisLine={false}
              width={44}
              tick={{ fontSize: 12, fill: "#6b7280" }}
            />
            <YAxis
              yAxisId="orders"
              orientation="right"
              tickLine={false}
              axisLine={false}
              width={36}
              tick={{ fontSize: 12, fill: "#6b7280" }}
            />

            <Tooltip
              labelFormatter={(label) => formatShortDate(String(label))}
              formatter={(value, name) =>
                name === "Sales" ? formatCurrency(Number(value)) : Number(value)
              }
              contentStyle={{ borderRadius: 12, border: "1px solid #f3f4f6", fontSize: 13 }}
            />
            <Area
              yAxisId="sales"
              name="Sales"
              dataKey="sales"
              type="monotone"
              stroke={ORANGE}
              strokeWidth={2.5}
              fill="url(#salesFill)"
              dot={{ r: 3, fill: "#fff", stroke: ORANGE, strokeWidth: 2 }}
              activeDot={{ r: 5 }}
            />
            <Line
              yAxisId="orders"
              name="Orders"
              dataKey="orders"
              type="monotone"
              stroke="#fdba74"
              strokeWidth={1.5}
              strokeDasharray="4 4"
              dot={false}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
