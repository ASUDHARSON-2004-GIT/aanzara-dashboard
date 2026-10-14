import { NextResponse } from "next/server";
import type {
  CurrentUser,
  DashboardSummary,
  LowStockProduct,
  NotificationSummary,
  OrderStatusBreakdown,
  RecentOrder,
  SalesOverview,
  TopProduct,
} from "@/types/dashboard";
import summary from "@/data/summary.json";
import sales from "@/data/sales.json";
import orderStatus from "@/data/order-status.json";
import recentOrders from "@/data/recent-orders.json";
import topProducts from "@/data/top-products.json";
import lowStock from "@/data/low-stock.json";
import currentUser from "@/data/current-user.json";
import notifications from "@/data/notifications.json";

/**
 * Demo backend: GET /api/dashboard/<resource>
 * Serves the JSON files in src/data so the whole frontend can be built and
 * tested before the real API exists. Each file is cast to the type from
 * src/types/dashboard.ts, which is the contract the real backend must match.
 * Replace by pointing API_BASE_URL (see .env.example) at your real server.
 */
const resources = {
  summary: summary as DashboardSummary,
  sales: sales as SalesOverview,
  "order-status": orderStatus as OrderStatusBreakdown[],
  "recent-orders": recentOrders as RecentOrder[],
  "top-products": topProducts as TopProduct[],
  "low-stock": lowStock as LowStockProduct[],
  "current-user": currentUser as CurrentUser,
  notifications: notifications as NotificationSummary,
} as const;

type Resource = keyof typeof resources;

const isResource = (value: string): value is Resource => value in resources;

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ resource: string }> },
) {
  const { resource } = await params;

  if (!isResource(resource)) {
    return NextResponse.json({ message: "Unknown resource" }, { status: 404 });
  }

  return NextResponse.json(resources[resource]);
}
