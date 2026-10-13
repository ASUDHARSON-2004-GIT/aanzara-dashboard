

export type TrendDirection = "up" | "down";

export interface StatMetric {
  /** Raw number. Formatting (commas, currency) is the UI's job, not the API's. */
  value: number;
  /** Percentage change vs the previous period, e.g. 12 means +12%. */
  changePercent: number;
}

export interface DashboardSummary {
  range: { from: string; to: string }; // ISO dates: "2026-10-01"
  totalOrders: StatMetric;
  totalRevenue: StatMetric;
  totalProducts: StatMetric;
  totalCustomers: StatMetric;
}

export interface SalesPoint {
  date: string; // ISO date
  sales: number; // revenue in INR
  orders: number;
}

export type SalesPeriod = "week" | "month";
export type SalesOverview = Record<SalesPeriod, SalesPoint[]>;

export type OrderStatus = "delivered" | "processing" | "shipped" | "cancelled";

export interface OrderStatusBreakdown {
  status: OrderStatus;
  count: number;
}

export interface RecentOrder {
  id: string; // "AZ1248"
  customer: string;
  placedAt: string; // ISO date
  amount: number; // INR
  status: OrderStatus;
  imageUrl?: string;
}

export type StockStatus = "in_stock" | "low_stock";

export interface TopProduct {
  id: string;
  name: string;
  unitsSold: number;
  stockStatus: StockStatus;
  imageUrl?: string;
}

export interface LowStockProduct {
  id: string;
  name: string;
  unitsLeft: number;
  imageUrl?: string;
}
