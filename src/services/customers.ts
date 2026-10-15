import { cache } from "react";
import { apiGet } from "@/lib/api";
import { toCustomerSearchParams } from "@/lib/customers-query";
import type { CustomerDetail, CustomerList, CustomerQuery, CustomerSummary } from "@/types/customers";

/** The ONLY place that knows the customers endpoint URLs (same rule as services/orders.ts). */

/** cache() because the stat cards, the tabs and the filters all need it on the same render. */
export const getCustomerSummary = cache(() => apiGet<CustomerSummary>("/customers/summary"));

export const getCustomer = (id: string) =>
  apiGet<CustomerDetail>(`/customers/${encodeURIComponent(id)}`);

export const getCustomers = (query: CustomerQuery) => {
  const params = toCustomerSearchParams(query).toString();
  return apiGet<CustomerList>(`/customers/list${params ? `?${params}` : ""}`);
};