import { NextResponse } from "next/server";
import { createCoupon } from "@/lib/mock-db/coupons";
import type { OfferRef } from "@/types/offers";
import { validateOfferInput } from "./_lib/validate";

/**
 * POST /api/offers
 * Body: the offer fields sent by the Create Offer form.
 * 201 with { id, code, status } on success.
 * 422 with { message, fieldErrors } when validation fails or the code already exists.
 */
export async function POST(request: Request) {
  const body: unknown = await request.json().catch(() => null);
  const result = validateOfferInput(body);

  if (!result.ok) {
    return NextResponse.json(
      { message: "Please fix the highlighted fields.", fieldErrors: result.errors },
      { status: 422 },
    );
  }

  const created = await createCoupon(result.data);

  if (!created.ok) {
    if (created.reason === "duplicate_code") {
      return NextResponse.json(
        {
          message: "Please fix the highlighted fields.",
          fieldErrors: { code: "This code is already in use. Choose a different one." },
        },
        { status: 422 },
      );
    }
    return NextResponse.json({ message: "Could not create the offer." }, { status: 500 });
  }

  const { id, code, status } = created.coupon;
  return NextResponse.json({ id, code, status } satisfies OfferRef, { status: 201 });
}