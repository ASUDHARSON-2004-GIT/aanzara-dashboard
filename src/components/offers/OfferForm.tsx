"use client";

import Link from "next/link";
import { useActionState, useEffect, useState, type InputHTMLAttributes, type ReactNode } from "react";
import { CircleCheck, IndianRupee, Loader2, Percent, Truck, type LucideIcon } from "lucide-react";
import { createOfferAction } from "@/app/(admin)/offers/action";
import { OFFER_TYPES, offerTypeLabels } from "@/lib/offers-query";
import type { CreateOfferState, OfferField, OfferFieldErrors, OfferStatus, OfferType } from "@/types/offers";
import Card from "../ui/Card";
import OfferPreview from "./OffersPreview";

const INITIAL_STATE: CreateOfferState = { status: "idle" };

/** Used to move focus to the first field with an error. */
const FIELD_ORDER: OfferField[] = [
  "code",
  "description",
  "type",
  "value",
  "minOrder",
  "maxDiscount",
  "usageLimit",
  "startsAt",
  "expiresAt",
];

const typeOptions: Record<OfferType, { icon: LucideIcon; hint: string }> = {
  percentage: { icon: Percent, hint: "For example 10% off, with an optional cap" },
  flat: { icon: IndianRupee, hint: "For example ₹200 off the order" },
  free_shipping: { icon: Truck, hint: "The delivery charge is waived" },
};

const createdMessages: Record<OfferStatus, string> = {
  active: "It is live now and customers can use the code.",
  scheduled: "It will go live automatically on its start date.",
  disabled: "It is saved as disabled. Turn it on from the offers list when you are ready.",
  expired: "It has already ended.", // cannot happen when creating; keeps the record complete
};

interface FormValues {
  code: string;
  description: string;
  type: OfferType;
  value: string;
  maxDiscount: string;
  minOrder: string;
  usageLimit: string;
  startsAt: string;
  expiresAt: string;
  enabled: boolean;
}

const emptyValues = (today: string): FormValues => ({
  code: "",
  description: "",
  type: "percentage",
  value: "",
  maxDiscount: "",
  minOrder: "",
  usageLimit: "",
  startsAt: today,
  expiresAt: "",
  enabled: true,
});

/** Blank or invalid text counts as 0, so the preview never shows NaN. */
const toAmount = (value: string) => {
  const parsed = Number(value);
  return value.trim() !== "" && Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
};

const inputClass = (error?: string) =>
  `h-10 w-full rounded-lg border bg-white px-3 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:ring-2 ${
    error
      ? "border-red-300 focus:border-red-400 focus:ring-red-100"
      : "border-gray-200 focus:border-orange-400 focus:ring-orange-100"
  }`;

/**
 * Create Offer form. Every field is controlled so the preview can update live and the
 * typed values survive a failed submit. Validation lives in the API: the form just shows
 * the errors it sends back.
 */
export default function OfferForm({ today }: { today: string }) {
  const [state, formAction, isPending] = useActionState(createOfferAction, INITIAL_STATE);
  const [values, setValues] = useState<FormValues>(() => emptyValues(today));
  const [dismissed, setDismissed] = useState<CreateOfferState | null>(null);

  const errors: OfferFieldErrors = state.status === "error" ? state.fieldErrors : {};

  useEffect(() => {
    if (state.status !== "error") return;
    const first = FIELD_ORDER.find((field) => state.fieldErrors[field]);
    if (first) document.getElementById(first)?.focus();
  }, [state]);

  function set<K extends keyof FormValues>(key: K, value: FormValues[K]) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  function createAnother() {
    setValues(emptyValues(today));
    setDismissed(state);
  }

  const controlProps = (field: OfferField) => ({
    id: field,
    name: field,
    "aria-invalid": errors[field] ? true : undefined,
    "aria-describedby": errors[field] ? `${field}-error` : undefined,
  });

  if (state.status === "success" && state !== dismissed) {
    return (
      <Card className="items-center justify-center py-14 text-center">
        <CircleCheck size={40} className="text-green-500" />
        <h3 className="mt-4 text-lg font-bold text-gray-900">Offer {state.offer.code} created</h3>
        <p className="mt-1 max-w-sm text-sm text-gray-500">{createdMessages[state.offer.status]}</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link
            href="/offers"
            className="rounded-lg bg-[#ff6b1a] px-4 py-2 text-sm font-semibold text-white hover:bg-[#f05f10]"
          >
            Back to offers
          </Link>
          <button
            type="button"
            onClick={createAnother}
            className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Create another
          </button>
        </div>
      </Card>
    );
  }

  return (
    <form action={formAction} noValidate className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
      <div className="space-y-5">
        {state.status === "error" && (
          <div role="alert" className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
            {state.message}
          </div>
        )}

        <Card title="Offer details">
          <div className="space-y-4">
            <Field
              label="Coupon code"
              htmlFor="code"
              error={errors.code}
              hint="Customers type this at checkout. Letters and numbers only."
              required
            >
              <input
                {...controlProps("code")}
                value={values.code}
                onChange={(event) => set("code", event.target.value.toUpperCase().replace(/\s/g, ""))}
                maxLength={20}
                placeholder="WINTER20"
                autoComplete="off"
                spellCheck={false}
                className={`${inputClass(errors.code)} font-mono`}
              />
            </Field>

            <Field label="Description" htmlFor="description" error={errors.description} required>
              <input
                {...controlProps("description")}
                value={values.description}
                onChange={(event) => set("description", event.target.value)}
                maxLength={120}
                placeholder="Winter sale: 20% off all jackets"
                className={inputClass(errors.description)}
              />
            </Field>
          </div>
        </Card>

        <Card title="Discount">
          <div className="space-y-4">
            <fieldset>
              <legend className="mb-1.5 text-sm font-medium text-gray-700">Offer type</legend>
              <div className="grid gap-3 sm:grid-cols-3">
                {OFFER_TYPES.map((type) => {
                  const { icon: Icon, hint } = typeOptions[type];

                  return (
                    <div key={type}>
                      <input
                        id={`type-${type}`}
                        type="radio"
                        name="type"
                        value={type}
                        checked={values.type === type}
                        // The amount means something different for each type, so start it fresh.
                        onChange={() => setValues((current) => ({ ...current, type, value: "", maxDiscount: "" }))}
                        className="peer sr-only"
                      />
                      <label
                        htmlFor={`type-${type}`}
                        className="flex h-full cursor-pointer flex-col gap-1 rounded-xl border border-gray-200 p-3.5 transition hover:bg-gray-50 peer-checked:border-[#ff6b1a] peer-checked:bg-orange-50 peer-focus-visible:ring-2 peer-focus-visible:ring-orange-200"
                      >
                        <span className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                          <Icon size={16} className="text-[#ff6b1a]" />
                          {offerTypeLabels[type]}
                        </span>
                        <span className="text-xs text-gray-500">{hint}</span>
                      </label>
                    </div>
                  );
                })}
              </div>
              {errors.type && (
                <p role="alert" className="mt-1 text-xs text-red-500">
                  {errors.type}
                </p>
              )}
            </fieldset>

            <div className="grid gap-4 sm:grid-cols-2">
              {values.type !== "free_shipping" && (
                <Field
                  label={values.type === "percentage" ? "Discount percentage" : "Discount amount"}
                  htmlFor="value"
                  error={errors.value}
                  required
                >
                  <AmountInput
                    {...controlProps("value")}
                    value={values.value}
                    onChange={(event) => set("value", event.target.value)}
                    placeholder={values.type === "percentage" ? "10" : "200"}
                    min={1}
                    max={values.type === "percentage" ? 100 : undefined}
                    leading={values.type === "flat" ? "₹" : undefined}
                    trailing={values.type === "percentage" ? "%" : undefined}
                    className={inputClass(errors.value)}
                  />
                </Field>
              )}

              {values.type === "percentage" && (
                <Field
                  label="Maximum discount"
                  htmlFor="maxDiscount"
                  error={errors.maxDiscount}
                  hint="The most one order can save. Leave blank for no cap."
                >
                  <AmountInput
                    {...controlProps("maxDiscount")}
                    value={values.maxDiscount}
                    onChange={(event) => set("maxDiscount", event.target.value)}
                    placeholder="300"
                    leading="₹"
                    className={inputClass(errors.maxDiscount)}
                  />
                </Field>
              )}

              <Field
                label="Minimum order"
                htmlFor="minOrder"
                error={errors.minOrder}
                hint={
                  values.type === "flat"
                    ? "Must be at least the discount amount."
                    : "Leave blank for no minimum."
                }
              >
                <AmountInput
                  {...controlProps("minOrder")}
                  value={values.minOrder}
                  onChange={(event) => set("minOrder", event.target.value)}
                  placeholder="999"
                  leading="₹"
                  className={inputClass(errors.minOrder)}
                />
              </Field>
            </div>
          </div>
        </Card>

        <Card title="Limits & schedule">
          <div className="grid gap-4 sm:grid-cols-3">
            <Field
              label="Total uses allowed"
              htmlFor="usageLimit"
              error={errors.usageLimit}
              hint="Leave blank or 0 for unlimited."
            >
              <AmountInput
                {...controlProps("usageLimit")}
                value={values.usageLimit}
                onChange={(event) => set("usageLimit", event.target.value)}
                placeholder="500"
                className={inputClass(errors.usageLimit)}
              />
            </Field>

            <Field label="Starts on" htmlFor="startsAt" error={errors.startsAt} required>
              <input
                {...controlProps("startsAt")}
                type="date"
                min={today}
                value={values.startsAt}
                onChange={(event) => set("startsAt", event.target.value)}
                className={inputClass(errors.startsAt)}
              />
            </Field>

            <Field label="Ends on" htmlFor="expiresAt" error={errors.expiresAt} required>
              <input
                {...controlProps("expiresAt")}
                type="date"
                min={values.startsAt || today}
                value={values.expiresAt}
                onChange={(event) => set("expiresAt", event.target.value)}
                className={inputClass(errors.expiresAt)}
              />
            </Field>
          </div>

          <label className="mt-5 flex cursor-pointer items-start gap-3 border-t border-gray-100 pt-4">
            <input
              type="checkbox"
              name="enabled"
              checked={values.enabled}
              onChange={(event) => set("enabled", event.target.checked)}
              className="mt-0.5 size-4 accent-[#ff6b1a]"
            />
            <span>
              <span className="block text-sm font-medium text-gray-900">Enable this offer</span>
              <span className="block text-xs text-gray-500">
                Turn off to save it as disabled. You can enable it later from the offers list.
              </span>
            </span>
          </label>
        </Card>

        <div className="flex flex-wrap items-center justify-end gap-3">
          <Link
            href="/offers"
            className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isPending}
            className="inline-flex items-center gap-2 rounded-lg bg-[#ff6b1a] px-4 py-2 text-sm font-semibold text-white hover:bg-[#f05f10] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isPending && <Loader2 size={16} className="animate-spin" />}
            {isPending ? "Creating…" : "Create Offer"}
          </button>
        </div>
      </div>

      <aside className="xl:sticky xl:top-24 xl:self-start">
        <OfferPreview
          today={today}
          code={values.code}
          description={values.description}
          type={values.type}
          value={toAmount(values.value)}
          minOrder={toAmount(values.minOrder)}
          maxDiscount={toAmount(values.maxDiscount)}
          usageLimit={toAmount(values.usageLimit)}
          startsAt={values.startsAt}
          expiresAt={values.expiresAt}
          enabled={values.enabled}
        />
      </aside>
    </form>
  );
}

interface FieldProps {
  label: string;
  htmlFor: string;
  error?: string;
  hint?: string;
  required?: boolean;
  children: ReactNode;
}

/** Label + control + error (or hint). The error id matches aria-describedby on the control. */
function Field({ label, htmlFor, error, hint, required, children }: FieldProps) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="ml-0.5 text-red-500">*</span>}
      </label>
      {children}
      {error ? (
        <p id={`${htmlFor}-error`} role="alert" className="mt-1 text-xs text-red-500">
          {error}
        </p>
      ) : hint ? (
        <p className="mt-1 text-xs text-gray-400">{hint}</p>
      ) : null}
    </div>
  );
}

type AmountInputProps = InputHTMLAttributes<HTMLInputElement> & { leading?: string; trailing?: string };

/** Number box with an optional ₹ in front or % behind. */
function AmountInput({ leading, trailing, className = "", ...props }: AmountInputProps) {
  return (
    <div className="relative">
      {leading && (
        <span aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">
          {leading}
        </span>
      )}
      <input
        type="number"
        inputMode="numeric"
        min={0}
        step={1}
        {...props}
        className={`${className} ${leading ? "pl-7" : ""} ${trailing ? "pr-8" : ""}`}
      />
      {trailing && (
        <span aria-hidden="true" className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">
          {trailing}
        </span>
      )}
    </div>
  );
}