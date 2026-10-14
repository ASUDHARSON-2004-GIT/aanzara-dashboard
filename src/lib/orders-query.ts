import { ORDER_STATUSES, PAYMENT_METHODS, PAYMENT_STATUSES } from "@/lib/sales-query";
import type { OrderStatus } from "@/types/dashboard";
import type { PaymentMethod, PaymentStatus } from "@/types/sales";
import type { OrderQuery } from "@/types/orders";

type RawParams = Record<string, string | string[] | undefined>;

const first = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value[0] : value;

/** Turns raw URL params into a safe OrderQuery. Unknown values are ignored. */
export function parseOrderQuery(raw: RawParams): OrderQuery {
  const status = first(raw.status);
  const method = first(raw.method);
  const payment = first(raw.payment);
  const page = Number(first(raw.page));

  return {
    search: first(raw.search)?.trim() || undefined,
    status: ORDER_STATUSES.find((value): value is OrderStatus => value === status),
    method: PAYMENT_METHODS.find((value): value is PaymentMethod => value === method),
    payment: PAYMENT_STATUSES.find((value): value is PaymentStatus => value === payment),
    page: Number.isInteger(page) && page > 0 ? page : 1,
  };
}

/** The reverse: an OrderQuery back into URL params. Defaults are left out to keep URLs short. */
export function toOrderSearchParams(query: OrderQuery): URLSearchParams {
  const params = new URLSearchParams();
  if (query.search) params.set("search", query.search);
  if (query.status) params.set("status", query.status);
  if (query.method) params.set("method", query.method);
  if (query.payment) params.set("payment", query.payment);
  if (query.page > 1) params.set("page", String(query.page));
  return params;
}