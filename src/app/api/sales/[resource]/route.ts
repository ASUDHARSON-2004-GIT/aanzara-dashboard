
import { NextResponse } from "next/server";

import ordersData from "@/data/orders.json";
import couponsData from "@/data/coupons.json";
import salesData from "@/data/sales.json";

import { parseSalesQuery } from "@/lib/sales-query";

import type { OrderStatus, SalesOverview } from "@/types/dashboard";
import type {
  CouponPerformance,
  PaymentMethodSales,
  ProductSales,
  RegionSales,
  SaleRow,
  SaleList,
  SalesSummary,
} from "@/types/sales";

type DemoOrder = (typeof ordersData)[number];

const orders = ordersData as DemoOrder[];
const PAGE_SIZE = 8;

// 1. Sales summary
function getSalesSummary(): SalesSummary {
  const activeOrders = orders.filter(
    (order) => order.status !== "cancelled"
  );

  const totalRevenue = activeOrders.reduce(
    (sum, order) => sum + order.amount,
    0
  );

  const dates = orders.map((order) => order.placedAt).sort();

  return {
    range: {
      from: dates[0] ?? "",
      to: dates[dates.length - 1] ?? "",
    },
    totalRevenue,
    totalOrders: activeOrders.length,
    averageOrderValue: activeOrders.length
      ? Math.round(totalRevenue / activeOrders.length)
      : 0,
    totalDiscount: activeOrders.reduce(
      (sum, order) => sum + order.discount,
      0
    ),
    cancelledOrders: orders.filter(
      (order) => order.status === "cancelled"
    ).length,
    couponOrders: activeOrders.filter(
      (order) => Boolean(order.couponCode)
    ).length,
  };
}

// 2. Payment methods
function getPaymentMethods(): PaymentMethodSales[] {
  const methods: PaymentMethodSales["method"][] = [
    "upi",
    "card",
    "netbanking",
    "cod",
  ];

  return methods.map((method) => {
    const matching = orders.filter(
      (order) =>
        order.paymentMethod === method &&
        order.status !== "cancelled"
    );

    return {
      method,
      orders: matching.length,
      revenue: matching.reduce(
        (sum, order) => sum + order.amount,
        0
      ),
    };
  });
}

// 3. Top-selling products
function getTopProducts(): ProductSales[] {
  const products = new Map<string, ProductSales>();

  for (const order of orders) {
    if (order.status === "cancelled") continue;

    for (const item of order.items) {
      const product = products.get(item.productId) ?? {
        productId: item.productId,
        name: item.name,
        unitsSold: 0,
        revenue: 0,
      };

      product.unitsSold += item.quantity;
      product.revenue += item.quantity * item.unitPrice;

      products.set(item.productId, product);
    }
  }

  return [...products.values()]
    .sort((a, b) => b.unitsSold - a.unitsSold)
    .slice(0, 5);
}

// 4. Sales by state
function getRegions(): RegionSales[] {
  const regions = new Map<string, RegionSales>();

  for (const order of orders) {
    if (order.status === "cancelled") continue;

    const state = order.shippingAddress.state || "Unknown";

    const region = regions.get(state) ?? {
      state,
      orders: 0,
      revenue: 0,
    };

    region.orders += 1;
    region.revenue += order.amount;

    regions.set(state, region);
  }

  return [...regions.values()].sort(
    (a, b) => b.revenue - a.revenue
  );
}

// 5. Coupon performance
function getCouponPerformance(): CouponPerformance[] {
  return couponsData.map((coupon) => {
    const matching = orders.filter(
      (order) =>
        order.couponCode === coupon.code &&
        order.status !== "cancelled"
    );

    return {
      id: coupon.id,
      code: coupon.code,
      description: coupon.description,
      type: coupon.type as CouponPerformance["type"],
      value: coupon.value,
      status: coupon.status as CouponPerformance["status"],
      usedCount: coupon.usedCount,
      usageLimit: coupon.usageLimit,
      orders: matching.length,
      discountGiven: matching.reduce(
        (sum, order) => sum + order.discount,
        0
      ),
    };
  });
}

// 6. Transactions, with filters and pagination
function getTransactions(
  searchParams: URLSearchParams
): SaleList {
  const query = parseSalesQuery(
    Object.fromEntries(searchParams)
  );

  const needle = query.search?.toLowerCase();

  const matching = orders
    .map((order): SaleRow => ({
      id: order.id,
      customer: order.customer,
      placedAt: order.placedAt,
      itemCount: order.items.reduce(
        (sum, item) => sum + item.quantity,
        0
      ),
      amount: order.amount,
      discount: order.discount,
      couponCode: order.couponCode,
      paymentMethod:
        order.paymentMethod as SaleRow["paymentMethod"],
      paymentStatus:
        order.paymentStatus as SaleRow["paymentStatus"],
      status: order.status as OrderStatus,
      city: order.shippingAddress.city,
    }))
    .filter((row) => !query.status || row.status === query.status)
    .filter((row) => !query.method || row.paymentMethod === query.method)
    .filter((row) => !query.payment || row.paymentStatus === query.payment)
    .filter(
      (row) =>
        !needle ||
        `${row.id} ${row.customer} ${row.city} ${row.couponCode ?? ""}`
          .toLowerCase()
          .includes(needle)
    )
    .sort((a, b) => b.placedAt.localeCompare(a.placedAt));

  const totalPages = Math.max(
    1,
    Math.ceil(matching.length / PAGE_SIZE)
  );

  const page = Math.min(query.page, totalPages);

  return {
    items: matching.slice(
      (page - 1) * PAGE_SIZE,
      page * PAGE_SIZE
    ),
    total: matching.length,
    page,
    pageSize: PAGE_SIZE,
    totalPages,
  };
}

// 7. The actual Next.js API handler
export async function GET(
  request: Request,
  { params }: { params: Promise<{ resource: string }> }
) {
  const { resource } = await params;
  const searchParams = new URL(request.url).searchParams;

  const handlers: Record<string, () => unknown> = {
    summary: getSalesSummary,
    trend: () => salesData as SalesOverview,
    "payment-methods": getPaymentMethods,
    "top-products": getTopProducts,
    regions: getRegions,
    coupons: getCouponPerformance,
    transactions: () => getTransactions(searchParams),
  };

  const handler = handlers[resource];

  if (!handler) {
    return NextResponse.json(
      { message: "Unknown sales resource" },
      { status: 404 }
    );
  }

  return NextResponse.json(handler());
}
