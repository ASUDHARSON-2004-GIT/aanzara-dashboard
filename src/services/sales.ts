    import { apiGet } from "@/lib/api";
import { toSalesSearchParams } from "@/lib/sales-query";
import type { SalesOverview } from "@/types/dashboard";
import type {
  CouponPerformance,
  PaymentMethodSales,
  ProductSales,
  RegionSales,
  SaleList,
  SalesQuery,
  SalesSummary,
} from "@/types/sales";

/** The ONLY place that knows the sales endpoint URLs (same rule as services/catalog.ts). */
export const getSalesSummary = () => apiGet<SalesSummary>("/sales/summary");

export const getSalesTrend = () => apiGet<SalesOverview>("/sales/trend");

export const getPaymentMethodSales = () =>
  apiGet<PaymentMethodSales[]>("/sales/payment-methods");

export const getTopSellingProducts = () => apiGet<ProductSales[]>("/sales/top-products");

export const getRegionSales = () => apiGet<RegionSales[]>("/sales/regions");

export const getCouponPerformance = () => apiGet<CouponPerformance[]>("/sales/coupons");

export const getSales = (query: SalesQuery) => {
  const params = toSalesSearchParams(query).toString();
  return apiGet<SaleList>(`/sales/transactions${params ? `?${params}` : ""}`);
};