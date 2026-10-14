import { NextResponse } from "next/server";
import { parseOrderQuery } from "@/lib/orders-query";
import type { OrderStatus } from "@/types/dashboard";
import type { PaymentMethod, PaymentStatus } from "@/types/sales";
import type {
  OrderCustomer,
  OrderDetail,
  OrderList,
  OrderRow,
  OrderSummary,
} from "@/types/orders";
import ordersData from "@/data/orders.json";
import customersData from "@/data/customers.json";

/**
 * Demo backend:
 *   GET /api/orders/summary      headline numbers + count per status
 *   GET /api/orders/list         filtered, paginated rows (?search=&status=&method=&payment=&page=)
 *   GET /api/orders/<order id>   one order with its items, customer and address (404 if unknown)
 * Joins the JSON files in src/data the way a real database query would, so the
 * frontend receives the same shapes as src/types/orders.ts.
 * Delete this folder when the real API exists and point API_BASE_URL at it.
 */
const PAGE_SIZE = 10;

const orders = ordersData;

function getSummary(): OrderSummary {
  const dates = orders.map((order) => order.placedAt).sort();
  const statusCounts: Record<OrderStatus, number> = {
    processing: 0,
    shipped: 0,
    delivered: 0,
    cancelled: 0,
  };
  for (const order of orders) statusCounts[order.status as OrderStatus] += 1;

    return {
    range: { from: dates[0] ?? "", to: dates[dates.length - 1] ?? "" },
    totalOrders: orders.length,
    statusCounts,
    pendingPayments: orders.filter(
      (order) => order.paymentStatus === "pending" && order.status !== "cancelled",
    ).length,
  };
}

function getList(searchParams: URLSearchParams): OrderList {
  const query = parseOrderQuery(Object.fromEntries(searchParams));
  const needle = query.search?.toLowerCase();

  const matches = orders
    .filter((order) => !query.status || order.status === query.status)
    .filter((order) => !query.method || order.paymentMethod === query.method)
    .filter((order) => !query.payment || order.paymentStatus === query.payment)
    .filter((order) => {
      if (!needle) return true;
      const haystack = [
        order.id,
        order.customer,
        order.shippingAddress.city,
        ...order.items.map((item) => item.name),
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(needle);
    })
    // Newest first; the id breaks ties so orders placed the same day keep a stable order.
    .sort((a, b) => b.placedAt.localeCompare(a.placedAt) || b.id.localeCompare(a.id));

  const totalPages = Math.max(1, Math.ceil(matches.length / PAGE_SIZE));
  const page = Math.min(query.page, totalPages);

  const items = matches.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE).map(
    (order): OrderRow => ({
      id: order.id,
      customer: order.customer,
      city: order.shippingAddress.city,
      placedAt: order.placedAt,
      itemCount: order.items.reduce((sum, item) => sum + item.quantity, 0),
      firstItemName: order.items[0]?.name ?? "",
      extraLines: Math.max(0, order.items.length - 1),
      amount: order.amount,
      paymentMethod: order.paymentMethod as PaymentMethod,
      paymentStatus: order.paymentStatus as PaymentStatus,
      status: order.status as OrderStatus,
    }),
  );

  return { items, total: matches.length, page, pageSize: PAGE_SIZE, totalPages };
}

function getDetail(id: string): OrderDetail | null {
  const order = orders.find((candidate) => candidate.id === id);
  if (!order) return null;

  const record = customersData.find((customer) => customer.id === order.customerId);
  const customer: OrderCustomer | null = record
    ? {
        id: record.id,
        name: record.name,
        email: record.email,
        phone: record.phone,
        type: record.type as OrderCustomer["type"],
      }
    : null;

  return {
    id: order.id,
    placedAt: order.placedAt,
    status: order.status as OrderStatus,
    customer,
    items: order.items.map((item) => ({
      productId: item.productId,
      name: item.name,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      lineTotal: item.quantity * item.unitPrice,
    })),
    subtotal: order.subtotal,
    discount: order.discount,
    couponCode: order.couponCode,
    shipping: order.shipping,
    amount: order.amount,
    paymentMethod: order.paymentMethod as PaymentMethod,
    paymentStatus: order.paymentStatus as PaymentStatus,
    shippingAddress: order.shippingAddress,
  };
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ resource: string }> },
) {
  const { resource } = await params;
  const searchParams = new URL(request.url).searchParams;

  const handlers: Record<string, () => unknown> = {
    summary: getSummary,
    list: () => getList(searchParams),
  };

  if (Object.hasOwn(handlers, resource)) return NextResponse.json(handlers[resource]());

  // Anything else is treated as an order id.
  const detail = getDetail(resource);
  if (!detail) return NextResponse.json({ message: "Order not found" }, { status: 404 });

  return NextResponse.json(detail);
}