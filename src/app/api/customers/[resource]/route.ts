import { NextResponse } from "next/server";
import { parseCustomerQuery } from "@/lib/customers-query";
import type { OrderStatus } from "@/types/dashboard";
import type { PaymentMethod, PaymentStatus } from "@/types/sales";
import type {
  CustomerDetail,
  CustomerList,
  CustomerOrder,
  CustomerRow,
  CustomerSummary,
  CustomerType,
} from "@/types/customers";
import customersData from "@/data/customers.json";
import ordersData from "@/data/orders.json";

/**
 * Demo backend:
 *   GET /api/customers/summary   headline numbers + list of states
 *   GET /api/customers/list      filtered, sorted, paginated rows
 *                                (?search=&type=&state=&sort=&page=)
 * Delete this folder when the real API exists and point API_BASE_URL at it.
 */
const PAGE_SIZE = 10;

const customers: CustomerRow[] = customersData.map((customer) => ({
  ...customer,
  type: customer.type as CustomerType,
}));

function getSummary(): CustomerSummary {
  const dates = customers.map((customer) => customer.joinedAt).sort();
  const totalSpent = customers.reduce((sum, customer) => sum + customer.totalSpent, 0);

  return {
    range: { from: dates[0] ?? "", to: dates[dates.length - 1] ?? "" },
    totalCustomers: customers.length,
    retailCount: customers.filter((customer) => customer.type === "retail").length,
    wholesaleCount: customers.filter((customer) => customer.type === "wholesale").length,
    repeatCustomers: customers.filter((customer) => customer.totalOrders >= 2).length,
    totalSpent,
    averageSpent: customers.length ? Math.round(totalSpent / customers.length) : 0,
    states: [...new Set(customers.map((customer) => customer.state))].sort(),
  };
}

const byId = (a: CustomerRow, b: CustomerRow) =>
  b.id.localeCompare(a.id, undefined, { numeric: true });

function getList(searchParams: URLSearchParams): CustomerList {
  const query = parseCustomerQuery(Object.fromEntries(searchParams));
  const needle = query.search?.toLowerCase();

  const sorters: Record<typeof query.sort, (a: CustomerRow, b: CustomerRow) => number> = {
    newest: (a, b) => b.joinedAt.localeCompare(a.joinedAt) || byId(a, b),
    spent: (a, b) => b.totalSpent - a.totalSpent || byId(a, b),
    orders: (a, b) => b.totalOrders - a.totalOrders || b.totalSpent - a.totalSpent || byId(a, b),
    name: (a, b) => a.name.localeCompare(b.name),
  };

  const matches = customers
    .filter((customer) => !query.type || customer.type === query.type)
    .filter((customer) => !query.state || customer.state === query.state)
    .filter((customer) => {
      if (!needle) return true;
      const haystack = [customer.name, customer.email, customer.phone, customer.city]
        .join(" ")
        .toLowerCase();
      return haystack.includes(needle);
    })
    .sort(sorters[query.sort]);

  const totalPages = Math.max(1, Math.ceil(matches.length / PAGE_SIZE));
  const page = Math.min(query.page, totalPages);

  return {
    items: matches.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    total: matches.length,
    page,
    pageSize: PAGE_SIZE,
    totalPages,
  };
}

function getDetail(id: string): CustomerDetail | null {
  const customer = customers.find((candidate) => candidate.id === id);
  if (!customer) return null;

  // Join this customer's orders, newest first (the id breaks ties).
  const orders = ordersData
    .filter((order) => order.customerId === id)
    .sort((a, b) => b.placedAt.localeCompare(a.placedAt) || b.id.localeCompare(a.id))
    .map(
      (order): CustomerOrder => ({
        id: order.id,
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

  const countedOrders = orders.filter((order) => order.status !== "cancelled").length;

  return {
    ...customer,
    orders,
    cancelledOrders: orders.length - countedOrders,
    lastOrderAt: orders[0]?.placedAt ?? null,
    averageOrderValue: countedOrders ? Math.round(customer.totalSpent / countedOrders) : 0,
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

  const detail = getDetail(resource);
  if (!detail) return NextResponse.json({ message: "Customer not found" }, { status: 404 });

  return NextResponse.json(detail);
}