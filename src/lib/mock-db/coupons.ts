/**
 * DEMO ONLY: a tiny "database" that keeps offers in src/data/coupons.json so created offers
 * survive a refresh. Delete this file when the real backend exists.
 * It writes to disk, so it only works where the server can write to the project folder
 * (local dev or a plain Node server), not on read-only serverless hosting.
 */
import { promises as fs } from "node:fs";
import path from "node:path";
import type { OfferStatus, OfferType } from "@/types/offers";

const FILE = path.join(process.cwd(), "src", "data", "coupons.json");

export interface Coupon {
  id: string;
  code: string;
  type: OfferType;
  value: number;
  minOrder: number;
  maxDiscount: number;
  description: string;
  usageLimit: number;
  usedCount: number;
  startsAt: string;
  expiresAt: string;
  status: OfferStatus;
}

export type NewCoupon = Omit<Coupon, "id" | "usedCount" | "status"> & { enabled: boolean };

export type StoreFailure = "not_found" | "expired" | "duplicate_code";
export type StoreResult = { ok: true; coupon: Coupon } | { ok: false; reason: StoreFailure };

export const todayIso = () => new Date().toISOString().slice(0, 10);

/**
 * The status everyone sees. "disabled" is the only status an admin sets by hand;
 * the others follow the dates. (ISO dates compare correctly as plain strings.)
 */
function resolveStatus(coupon: Pick<Coupon, "status" | "startsAt" | "expiresAt">, today: string): OfferStatus {
  if (coupon.status === "disabled") return "disabled";
  if (today < coupon.startsAt) return "scheduled";
  if (today > coupon.expiresAt) return "expired";
  return "active";
}

/** Runs read-modify-write cycles one at a time so two requests can't overwrite each other. */
let queue: Promise<unknown> = Promise.resolve();
function exclusive<T>(task: () => Promise<T>): Promise<T> {
  const run = queue.then(task);
  queue = run.catch(() => undefined);
  return run;
}

async function load(): Promise<{ coupons: Coupon[]; eol: string }> {
  const raw = await fs.readFile(FILE, "utf8");
  return { coupons: JSON.parse(raw) as Coupon[], eol: raw.includes("\r\n") ? "\r\n" : "\n" };
}

async function save(coupons: Coupon[], eol: string) {
  const text = JSON.stringify(coupons, null, 2).replace(/\n/g, eol) + eol;
  const temp = `${FILE}.tmp`;
  await fs.writeFile(temp, text, "utf8");
  await fs.rename(temp, FILE); // swapped in one step, so a crash never leaves a half-written file
}

export async function listCoupons(): Promise<Coupon[]> {
  const { coupons } = await load();
  const today = todayIso();
  return coupons.map((coupon) => ({ ...coupon, status: resolveStatus(coupon, today) }));
}

export function createCoupon(input: NewCoupon): Promise<StoreResult> {
  return exclusive(async () => {
    const { coupons, eol } = await load();

    if (coupons.some((existing) => existing.code.toLowerCase() === input.code.toLowerCase())) {
      return { ok: false, reason: "duplicate_code" };
    }

    const nextNumber = Math.max(0, ...coupons.map((existing) => Number(existing.id.replace(/\D/g, "")) || 0)) + 1;

    // Stored as "active" when enabled; the dates decide whether it is really scheduled or live.
    const coupon: Coupon = {
      id: `cp${nextNumber}`,
      code: input.code,
      type: input.type,
      value: input.value,
      minOrder: input.minOrder,
      maxDiscount: input.maxDiscount,
      description: input.description,
      usageLimit: input.usageLimit,
      usedCount: 0,
      startsAt: input.startsAt,
      expiresAt: input.expiresAt,
      status: input.enabled ? "active" : "disabled",
    };

    await save([...coupons, coupon], eol);
    return { ok: true, coupon: { ...coupon, status: resolveStatus(coupon, todayIso()) } };
  });
}

export function setCouponEnabled(id: string, enabled: boolean): Promise<StoreResult> {
  return exclusive(async () => {
    const { coupons, eol } = await load();
    const index = coupons.findIndex((coupon) => coupon.id === id);
    if (index === -1) return { ok: false, reason: "not_found" };

    const today = todayIso();
    if (today > coupons[index].expiresAt) return { ok: false, reason: "expired" };

    const updated: Coupon = { ...coupons[index], status: enabled ? "active" : "disabled" };
    await save(coupons.map((coupon, i) => (i === index ? updated : coupon)), eol);
    return { ok: true, coupon: { ...updated, status: resolveStatus(updated, today) } };
  });
}