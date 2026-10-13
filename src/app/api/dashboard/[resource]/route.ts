import { NextResponse } from "next/server";
import * as mock from "@/data/dashboard-data";

/**
 * Demo backend: GET /api/dashboard/<resource>
 * Lets you build and test the whole frontend before the real API exists.
 * Replace by pointing API_BASE_URL (see .env.example) at your real server.
 */
const resources = {
  summary: mock.summary,
  sales: mock.sales,
  "order-status": mock.orderStatus,
  "recent-orders": mock.recentOrders,
  "top-products": mock.topProducts,
  "low-stock": mock.lowStock,
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

  // Simulated network latency so you can SEE the loading skeletons.
  // Delete this line when you connect a real API.
  await new Promise((resolve) => setTimeout(resolve, 600));

  return NextResponse.json(resources[resource]);
}
