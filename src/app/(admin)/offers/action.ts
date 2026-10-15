"use server";

import { revalidatePath } from "next/cache";
import { ApiError } from "@/lib/api";
import { createOffer, setOfferEnabled } from "@/services/offers";
import type { CreateOfferState, OfferFieldErrors, OfferInput, OfferType, ToggleOfferResult } from "@/types/offers";

/**
 * Server Actions are public POST endpoints: when login arrives, check the user's
 * permission at the top of each action, not only in the UI.
 */

const text = (formData: FormData, name: string) => String(formData.get(name) ?? "");

/** Blank or not-a-number becomes null; the API decides what that means for each field. */
function amount(formData: FormData, name: string): number | null {
  const raw = text(formData, name).trim();
  if (raw === "") return null;
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : null;
}

function toOfferInput(formData: FormData): OfferInput {
  return {
    code: text(formData, "code"),
    description: text(formData, "description"),
    type: text(formData, "type") as OfferType, // the API rejects anything that is not a real type
    value: amount(formData, "value"),
    minOrder: amount(formData, "minOrder"),
    maxDiscount: amount(formData, "maxDiscount"),
    usageLimit: amount(formData, "usageLimit"),
    startsAt: text(formData, "startsAt"),
    expiresAt: text(formData, "expiresAt"),
    enabled: formData.get("enabled") === "on",
  };
}

/** Reads the error body our own API sends back with a 422. */
function readValidationBody(body: unknown): { message: string; fieldErrors: OfferFieldErrors } {
  const fallback = "Please fix the highlighted fields.";
  if (typeof body !== "object" || body === null) return { message: fallback, fieldErrors: {} };

  const { message, fieldErrors } = body as { message?: unknown; fieldErrors?: unknown };
  return {
    message: typeof message === "string" ? message : fallback,
    fieldErrors: typeof fieldErrors === "object" && fieldErrors !== null ? (fieldErrors as OfferFieldErrors) : {},
  };
}

function readMessage(body: unknown, fallback: string): string {
  const message = typeof body === "object" && body !== null ? (body as { message?: unknown }).message : undefined;
  return typeof message === "string" ? message : fallback;
}

function refreshOfferPages() {
  revalidatePath("/offers");
  revalidatePath("/sales"); // its coupon performance table lists the same offers
}

export async function createOfferAction(
  _previous: CreateOfferState,
  formData: FormData,
): Promise<CreateOfferState> {
  try {
    const offer = await createOffer(toOfferInput(formData));
    refreshOfferPages();
    return { status: "success", offer };
  } catch (error) {
    if (error instanceof ApiError && error.status === 422) {
      return { status: "error", ...readValidationBody(error.body) };
    }
    console.error("[offers] failed to create offer", error);
    return { status: "error", message: "Could not create the offer. Please try again.", fieldErrors: {} };
  }
}

export async function setOfferEnabledAction(id: string, enabled: boolean): Promise<ToggleOfferResult> {
  try {
    await setOfferEnabled(id, enabled);
  } catch (error) {
    if (error instanceof ApiError && (error.status === 404 || error.status === 409)) {
      return { ok: false, message: readMessage(error.body, "This offer can't be changed.") };
    }
    console.error("[offers] failed to change offer status", error);
    return { ok: false, message: "Could not update the offer. Please try again." };
  }

  refreshOfferPages();
  return { ok: true };
}