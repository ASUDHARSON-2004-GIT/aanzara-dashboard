import { apiGet } from "@/lib/api";
import type {
  DashboardSummary,
  LowStockProduct,
  OrderStatusBreakdown,
  RecentOrder,
  SalesOverview,
  TopProduct,
} from "@/types/dashboard";

/**
 * The ONLY place that knows endpoint URLs.
 * Components call these functions and never touch fetch directly.
 */
export const getDashboardSummary = () =>
  apiGet<DashboardSummary>("/dashboard/summary");

export const getSalesOverview = () => apiGet<SalesOverview>("/dashboard/sales");

export const getOrderStatus = () =>
  apiGet<OrderStatusBreakdown[]>("/dashboard/order-status");

export const getRecentOrders = () =>
  apiGet<RecentOrder[]>("/dashboard/recent-orders");

export const getTopProducts = () =>
  apiGet<TopProduct[]>("/dashboard/top-products");

export const getLowStockProducts = () =>
  apiGet<LowStockProduct[]>("/dashboard/low-stock");
