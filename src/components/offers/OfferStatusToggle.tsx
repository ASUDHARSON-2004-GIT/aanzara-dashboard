"use client";

import { useState, useTransition } from "react";
import { setOfferEnabledAction } from "@/app/(admin)/offers/action";
import type { OfferStatus } from "@/types/offers";

/** On/off switch for one offer. Expired offers are locked: they can't be brought back. */
export default function OfferStatusToggle({ id, code, status }: { id: string; code: string; status: OfferStatus }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const enabled = status !== "disabled";
  const expired = status === "expired";

  function toggle() {
    setError(null);
    startTransition(async () => {
      const result = await setOfferEnabledAction(id, !enabled);
      if (!result.ok) setError(result.message);
    });
  }

  return (
    <div>
      <button
        type="button"
        role="switch"
        aria-checked={enabled}
        aria-label={`Enable offer ${code}`}
        title={expired ? "Expired offers can't be changed" : undefined}
        disabled={expired || isPending}
        onClick={toggle}
        className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-400 disabled:cursor-not-allowed disabled:opacity-50 ${
          enabled ? "bg-[#ff6b1a]" : "bg-gray-300"
        }`}
      >
        <span
          className={`inline-block size-5 rounded-full bg-white shadow transition-transform ${
            enabled ? "translate-x-5" : "translate-x-0.5"
          }`}
        />
      </button>
      {error && (
        <p role="alert" className="mt-1 max-w-[160px] text-xs text-red-500">
          {error}
        </p>
      )}
    </div>
  );
}