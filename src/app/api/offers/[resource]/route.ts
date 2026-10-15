import { NextResponse } from "next/server";
import { listCoupons, setCouponEnabled, todayIso } from "@/lib/mock-db/coupons";
import { parseOfferQuery } from "@/lib/offers-query";
import type {
  OfferEvent,
  OfferList,
  OfferRef,
  OfferRow,
  OfferSchedule,
  OfferSort,
  OfferStatus,
  OfferSummary,
  OfferTimeline,
} from "@/types/offers";
import ordersData from "@/data/orders.json";

/**
 * Demo backend:
 *   GET   /api/offers/summary    headline numbers + count per status
 *   GET   /api/offers/timeline   every offer's start and end, for the timeline chart
 *   GET   /api/offers/upcoming   offers starting or ending in the next few weeks
 *   GET   /api/offers/list       filtered, sorted, paginated rows
 *                                (?search=&status=&type=&sort=&page=)
 *   PATCH /api/offers/{id}       enable or disable one offer, body { enabled: boolean }
 * (Creating an offer is POST /api/offers, in ../route.ts.)
 * Delete this folder when the real API exists and point API_BASE_URL at it.
 */
const PAGE_SIZE = 8;
const UPCOMING_WINDOW_DAYS = 45;
const MS_PER_DAY = 86_400_000;

const utcDay = (iso: string) => Date.parse(`${iso}T00:00:00Z`);

const sum = <T,>(items: T[], pick: (item: T) => number) =>
  items.reduce((total, item) => total + pick(item), 0);

/** Coupons joined with the orders that used them. Built per request because "days left" changes daily. */
async function buildOffers(): Promise<OfferRow[]> {
  const coupons = await listCoupons();
  const today = utcDay(todayIso());
  const daysFromToday = (iso: string) => Math.round((utcDay(iso) - today) / MS_PER_DAY);

  return coupons.map((coupon): OfferRow => {
    const redeemed = ordersData.filter(
      (order) => order.couponCode === coupon.code && order.status !== "cancelled",
    );

    return {
      ...coupon,
      orders: redeemed.length,
      discountGiven: sum(redeemed, (order) => order.discount),
      revenue: sum(redeemed, (order) => order.amount),
      startsInDays: daysFromToday(coupon.startsAt),
      endsInDays: daysFromToday(coupon.expiresAt),
    };
  });
}

async function getSummary(): Promise<OfferSummary> {
  const offers = await buildOffers();
  const statusCounts: Record<OfferStatus, number> = {
    active: 0,
    scheduled: 0,
    expired: 0,
    disabled: 0,
  };
  for (const offer of offers) statusCounts[offer.status] += 1;

  return {
    totalOffers: offers.length,
    statusCounts,
    totalRedemptions: sum(offers, (offer) => offer.usedCount),
    ordersWithOffer: sum(offers, (offer) => offer.orders),
    discountGiven: sum(offers, (offer) => offer.discountGiven),
    revenue: sum(offers, (offer) => offer.revenue),
  };
}

async function getTimeline(): Promise<OfferTimeline> {
  const items = (await buildOffers())
    .map(({ id, code, description, type, value, status, startsAt, expiresAt }) => ({
      id,
      code,
      description,
      type,
      value,
      status,
      startsAt,
      expiresAt,
    }))
    .sort((a, b) => a.startsAt.localeCompare(b.startsAt) || a.code.localeCompare(b.code));

  return { today: todayIso(), items };
}

async function getUpcoming(): Promise<OfferSchedule> {
  const events = (await buildOffers())
    // Expired offers are over and disabled ones will never start or end on their own.
    .filter((offer) => offer.status === "active" || offer.status === "scheduled")
    .flatMap((offer): OfferEvent[] => [
      { offerId: offer.id, code: offer.code, kind: "starts", date: offer.startsAt, inDays: offer.startsInDays },
      { offerId: offer.id, code: offer.code, kind: "ends", date: offer.expiresAt, inDays: offer.endsInDays },
    ])
    .filter((event) => event.inDays >= 0 && event.inDays <= UPCOMING_WINDOW_DAYS)
    .sort((a, b) => a.inDays - b.inDays || a.code.localeCompare(b.code));

  return { windowDays: UPCOMING_WINDOW_DAYS, events };
}

const byCode = (a: OfferRow, b: OfferRow) => a.code.localeCompare(b.code);

const sorters: Record<OfferSort, (a: OfferRow, b: OfferRow) => number> = {
  newest: (a, b) => b.startsAt.localeCompare(a.startsAt) || byCode(a, b),
  // Offers that already ended go last, the rest by closest end date.
  ending: (a, b) =>
    Number(a.endsInDays < 0) - Number(b.endsInDays < 0) ||
    a.expiresAt.localeCompare(b.expiresAt) ||
    byCode(a, b),
  redeemed: (a, b) => b.usedCount - a.usedCount || byCode(a, b),
  discount: (a, b) => b.discountGiven - a.discountGiven || byCode(a, b),
};

async function getList(searchParams: URLSearchParams): Promise<OfferList> {
  const query = parseOfferQuery(Object.fromEntries(searchParams));
  const needle = query.search?.toLowerCase();

  const matches = (await buildOffers())
    .filter((offer) => !query.status || offer.status === query.status)
    .filter((offer) => !query.type || offer.type === query.type)
    .filter((offer) => !needle || `${offer.code} ${offer.description}`.toLowerCase().includes(needle))
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

export async function GET(
  request: Request,
  { params }: { params: Promise<{ resource: string }> },
) {
  const { resource } = await params;
  const searchParams = new URL(request.url).searchParams;

  const handlers: Record<string, () => unknown> = {
    summary: getSummary,
    timeline: getTimeline,
    upcoming: getUpcoming,
    list: () => getList(searchParams),
  };

  if (!Object.hasOwn(handlers, resource)) {
    return NextResponse.json({ message: "Unknown offers resource" }, { status: 404 });
  }

  return NextResponse.json(await handlers[resource]());
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ resource: string }> },
) {
  // Same route as the GETs above: for a PATCH the segment is the offer id.
  const { resource: id } = await params;

  const body: unknown = await request.json().catch(() => null);
  const enabled = typeof body === "object" && body !== null ? (body as { enabled?: unknown }).enabled : undefined;

  if (typeof enabled !== "boolean") {
    return NextResponse.json({ message: 'Send { "enabled": true } or { "enabled": false }.' }, { status: 400 });
  }

  const result = await setCouponEnabled(id, enabled);
  if (!result.ok) {
    return result.reason === "not_found"
      ? NextResponse.json({ message: "Offer not found." }, { status: 404 })
      : NextResponse.json({ message: "An expired offer can't be enabled or disabled." }, { status: 409 });
  }

  const { code, status } = result.coupon;
  return NextResponse.json({ id, code, status } satisfies OfferRef);
}