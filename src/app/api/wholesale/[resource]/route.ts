import { NextResponse } from "next/server";
import { parseWholesaleQuery } from "@/lib/wholesale-query";
import type {
  WholesaleAccount,
  WholesaleList,
  WholesaleSort,
  WholesaleStatus,
  WholesaleSummary,
  WholesaleTier,
} from "@/types/wholesale";
import accountsData from "@/data/wholesale-accounts.json";

/**
 * Demo backend:
 *   GET /api/wholesale/summary   headline numbers, count per status, list of states
 *   GET /api/wholesale/list      filtered, sorted, paginated accounts
 *                                (?search=&status=&tier=&state=&sort=&page=)
 * Delete this folder when the real API exists and point API_BASE_URL at it.
 */
const PAGE_SIZE = 8;

const accounts: WholesaleAccount[] = accountsData.map((account) => ({
  ...account,
  tier: account.tier as WholesaleTier,
  status: account.status as WholesaleStatus,
}));

const sum = (pick: (account: WholesaleAccount) => number) =>
  accounts.reduce((total, account) => total + pick(account), 0);

function getSummary(): WholesaleSummary {
  const totalPurchased = sum((account) => account.totalPurchased);
  const totalOrders = sum((account) => account.totalOrders);

  const statusCounts: Record<WholesaleStatus, number> = { active: 0, on_hold: 0, inactive: 0 };
  for (const account of accounts) statusCounts[account.status] += 1;

  return {
    totalAccounts: accounts.length,
    statusCounts,
    totalPurchased,
    totalOrders,
    averageOrderValue: totalOrders ? Math.round(totalPurchased / totalOrders) : 0,
    states: [...new Set(accounts.map((account) => account.state))].sort(),
  };
}

const byId = (a: WholesaleAccount, b: WholesaleAccount) =>
  b.id.localeCompare(a.id, undefined, { numeric: true });

const sorters: Record<WholesaleSort, (a: WholesaleAccount, b: WholesaleAccount) => number> = {
  newest: (a, b) => b.joinedAt.localeCompare(a.joinedAt) || byId(a, b),
  purchased: (a, b) => b.totalPurchased - a.totalPurchased || byId(a, b),
  orders: (a, b) => b.totalOrders - a.totalOrders || b.totalPurchased - a.totalPurchased || byId(a, b),
  name: (a, b) => a.businessName.localeCompare(b.businessName),
};

function getList(searchParams: URLSearchParams): WholesaleList {
  const query = parseWholesaleQuery(Object.fromEntries(searchParams));
  const needle = query.search?.toLowerCase();

  const matches = accounts
    .filter((account) => !query.status || account.status === query.status)
    .filter((account) => !query.tier || account.tier === query.tier)
    .filter((account) => !query.state || account.state === query.state)
    .filter(
      (account) =>
        !needle ||
        `${account.businessName} ${account.contactName} ${account.email} ${account.phone} ${account.city} ${account.gstin}`
          .toLowerCase()
          .includes(needle),
    )
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
    list: () => getList(searchParams),
  };

  if (!Object.hasOwn(handlers, resource)) {
    return NextResponse.json({ message: "Unknown wholesale resource" }, { status: 404 });
  }

  return NextResponse.json(handlers[resource]());
}