import type {
  DashboardSummary,
  LowStockProduct,
  OrderStatusBreakdown,
  RecentOrder,
  SalesOverview,
  TopProduct,
} from "@/types/dashboard";

/**
 * Mock data served by the demo API in `src/app/api/dashboard/[resource]/route.ts`.
 * When your real backend is ready you can delete this file and that route.
 */

export const summary: DashboardSummary = {
  range: { from: "2026-10-01", to: "2026-10-15" },
  totalOrders: { value: 1248, changePercent: 12 },
  totalRevenue: { value: 428560, changePercent: 8 },
  totalProducts: { value: 3482, changePercent: 5 },
  totalCustomers: { value: 2156, changePercent: 10 },
};

// Revenue per day in thousands of INR, Oct 1 -> Oct 15.
const dailySales = [30, 42, 55, 70, 88, 92, 84, 78, 102, 125, 118, 96, 128, 150, 200];

const month = dailySales.map((sales, i) => ({
  date: `2026-10-${String(i + 1).padStart(2, "0")}`,
  sales: sales * 1000,
  orders: Math.round(sales * 0.55) + (i % 3) * 4,
}));

export const sales: SalesOverview = {
  month,
  week: month.slice(-7),
};

export const orderStatus: OrderStatusBreakdown[] = [
  { status: "delivered", count: 849 },
  { status: "processing", count: 225 },
  { status: "shipped", count: 100 },
  { status: "cancelled", count: 74 },
];

export const recentOrders: RecentOrder[] = [
  { id: "AZ1248", customer: "Priya Sharma", placedAt: "2026-10-15", amount: 2499, status: "delivered" },
  { id: "AZ1247", customer: "Rahul Kumar", placedAt: "2026-10-15", amount: 1299, status: "processing" },
  { id: "AZ1246", customer: "Sneha R", placedAt: "2026-10-14", amount: 3199, status: "shipped" },
  { id: "AZ1245", customer: "Arjun N", placedAt: "2026-10-14", amount: 799, status: "cancelled" },
  { id: "AZ1244", customer: "Meena K", placedAt: "2026-10-13", amount: 1599, status: "delivered" },
];

export const topProducts: TopProduct[] = [
  { id: "p1", name: "Women's Handbag", unitsSold: 245, stockStatus: "in_stock" },
  { id: "p2", name: "Men's Sports Shoes", unitsSold: 198, stockStatus: "in_stock" },
  { id: "p3", name: "Classic Watch", unitsSold: 176, stockStatus: "low_stock" },
  { id: "p4", name: "Wireless Headphones", unitsSold: 142, stockStatus: "in_stock" },
  { id: "p5", name: "Sunglasses", unitsSold: 128, stockStatus: "low_stock" },
];

export const lowStock: LowStockProduct[] = [
  { id: "p4", name: "Wireless Headphones", unitsLeft: 5 },
  { id: "p2", name: "Men's Sports Shoes", unitsLeft: 8 },
  { id: "p1", name: "Women's Handbag", unitsLeft: 6 },
  { id: "p3", name: "Classic Watch", unitsLeft: 4 },
  { id: "p5", name: "Sunglasses", unitsLeft: 7 },
];
