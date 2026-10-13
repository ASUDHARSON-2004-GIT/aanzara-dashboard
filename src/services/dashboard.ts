import { cache } from "react";
import { apiGet } from "@/lib/api";
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

/**
 * The ONLY place that knows endpoint URLs.
 * Components call these functions and never touch fetch directly.
 *
 * Functions that more than one panel needs are wrapped in React's cache():
 * during one page render they run once and every caller shares the result,
 * so the backend is not asked for the same thing twice.
 */
export const getDashboardSummary = cache(() =>
  apiGet<DashboardSummary>("/dashboard/summary"),
);

export const getCurrentUser = cache(() =>
  apiGet<CurrentUser>("/dashboard/current-user"),
);

export const getNotificationSummary = () =>
  apiGet<NotificationSummary>("/dashboard/notifications");

/** Everything the top bar needs, fetched in parallel. */
export const getTopbarData = async () => {
  const [user, notifications] = await Promise.all([
    getCurrentUser(),
    getNotificationSummary(),
  ]);
  return { user, unreadCount: notifications.unreadCount };
};

export const getSalesOverview = () => apiGet<SalesOverview>("/dashboard/sales");

export const getOrderStatus = () =>
  apiGet<OrderStatusBreakdown[]>("/dashboard/order-status");

export const getRecentOrders = () =>
  apiGet<RecentOrder[]>("/dashboard/recent-orders");

export const getTopProducts = () =>
  apiGet<TopProduct[]>("/dashboard/top-products");

export const getLowStockProducts = () =>
  apiGet<LowStockProduct[]>("/dashboard/low-stock");
