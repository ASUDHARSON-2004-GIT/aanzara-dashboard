import { formatCurrency } from "@/lib/format";
import { todayIso, type NewCoupon } from "@/lib/mock-db/coupons";
import { OFFER_TYPES } from "@/lib/offers-query";
import type { OfferFieldErrors } from "@/types/offers";

const CODE_PATTERN = /^[A-Z0-9]{4,20}$/;
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
const MAX_FLAT_VALUE = 100_000;

export type ValidationResult = { ok: true; data: NewCoupon } | { ok: false; errors: OfferFieldErrors };

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const text = (value: unknown) => (typeof value === "string" ? value.trim() : "");

function isRealDate(value: string) {
  if (!ISO_DATE.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

/** null/undefined means "left blank"; anything else must be a whole number of 0 or more. */
function wholeNumber(raw: unknown): number | "blank" | "invalid" {
  if (raw === null || raw === undefined) return "blank";
  return typeof raw === "number" && Number.isInteger(raw) && raw >= 0 ? raw : "invalid";
}

/** The API is the authority on what a valid offer is; the form only collects input. */
export function validateOfferInput(body: unknown): ValidationResult {
  const input = isRecord(body) ? body : {};
  const errors: OfferFieldErrors = {};
  const today = todayIso();

  const code = text(input.code).toUpperCase();
  if (!CODE_PATTERN.test(code)) errors.code = "Use 4–20 letters or numbers with no spaces, e.g. WINTER20.";

  const description = text(input.description);
  if (description.length < 3 || description.length > 120) errors.description = "Enter between 3 and 120 characters.";

  const type = OFFER_TYPES.find((candidate) => candidate === input.type);
  if (!type) errors.type = "Choose an offer type.";

  /** Optional amounts: blank means 0, anything else must be a whole number. */
  const optional = (field: "minOrder" | "maxDiscount" | "usageLimit", raw: unknown) => {
    const parsed = wholeNumber(raw);
    if (parsed === "invalid") {
      errors[field] = "Enter a whole number, or leave it blank.";
      return 0;
    }
    return parsed === "blank" ? 0 : parsed;
  };

  let value = 0;
  if (type === "percentage" || type === "flat") {
    const parsed = wholeNumber(input.value);
    const max = type === "percentage" ? 100 : MAX_FLAT_VALUE;
    if (typeof parsed !== "number" || parsed < 1 || parsed > max) {
      errors.value =
        type === "percentage"
          ? "Enter a whole percentage from 1 to 100."
          : `Enter an amount from ₹1 to ${formatCurrency(max)}.`;
    } else {
      value = parsed;
    }
  }

  const minOrder = optional("minOrder", input.minOrder);
  if (type === "flat" && !errors.value && !errors.minOrder && minOrder < value) {
    errors.minOrder = "Minimum order must be at least the discount amount.";
  }

  // The cap is only entered for percentages; for the other types it follows from the type.
  const maxDiscount = type === "percentage" ? optional("maxDiscount", input.maxDiscount) : type === "flat" ? value : 0;
  const usageLimit = optional("usageLimit", input.usageLimit);

  const startsAt = text(input.startsAt);
  if (!isRealDate(startsAt)) errors.startsAt = "Choose a start date.";
  else if (startsAt < today) errors.startsAt = "The start date can't be in the past.";

  const expiresAt = text(input.expiresAt);
  if (!isRealDate(expiresAt)) errors.expiresAt = "Choose an end date.";
  else if (isRealDate(startsAt) && expiresAt < startsAt) errors.expiresAt = "The end date must be on or after the start date.";

  if (Object.keys(errors).length > 0 || !type) return { ok: false, errors };

  return {
    ok: true,
    data: {
      code,
      type,
      value,
      minOrder,
      maxDiscount,
      description,
      usageLimit,
      startsAt,
      expiresAt,
      enabled: typeof input.enabled === "boolean" ? input.enabled : true,
    },
  };
}
