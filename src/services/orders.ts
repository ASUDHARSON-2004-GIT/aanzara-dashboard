import { cache } from "react";
import { apiGet } from "@/lib/api";
import { toOrderSearchParams } from "@/lib/orders-query";
import type { OrderDetail, OrderList, OrderQuery, OrderSummary } from "@/types/orders";

/** The ONLY place that knows the orders endpoint URLs (same rule as services/catalog.ts). */

/** cache() because the stat cards and the status tabs both need it on the same render. */
export const getOrderSummary = cache(() => apiGet<OrderSummary>("/orders/summary"));

export const getOrders = (query: OrderQuery) => {
  const params = toOrderSearchParams(query).toString();
  return apiGet<OrderList>(`/orders/list${params ? `?${params}` : ""}`);
};

export const getOrder = (id: string) => apiGet<OrderDetail>(`/orders/${encodeURIComponent(id)}`);