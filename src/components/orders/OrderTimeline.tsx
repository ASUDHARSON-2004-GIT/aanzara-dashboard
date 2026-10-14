import { Check, X } from "lucide-react";
import { formatDate } from "@/lib/format";
import type { OrderDetail } from "@/types/orders";
import Card from "../ui/Card";

type StepState = "done" | "active" | "todo" | "cancelled";

interface Step {
  label: string;
  note?: string;
  state: StepState;
}

const flow = [
  { status: "processing", label: "Processing" },
  { status: "shipped", label: "Shipped" },
  { status: "delivered", label: "Delivered" },
] as const;

/**
 * Works out the steps from the order's status. The data only holds the placed date,
 * so no other step shows a date (we don't invent them).
 */
function buildSteps(order: OrderDetail): Step[] {
  const placed: Step = { label: "Order placed", note: formatDate(order.placedAt), state: "done" };

  if (order.status === "cancelled") {
    return [
      placed,
      {
        label: "Cancelled",
        note: order.paymentStatus === "refunded" ? "Payment refunded" : undefined,
        state: "cancelled",
      },
    ];
  }

  const reached = flow.findIndex((step) => step.status === order.status); // 0 processing, 1 shipped, 2 delivered

  return [
    placed,
    ...flow.map(({ label }, index): Step => {
      if (order.status === "delivered" || index < reached) return { label, state: "done" };
      return { label, state: index === reached ? "active" : "todo" };
    }),
  ];
}

const dotStyles: Record<StepState, string> = {
  done: "border-[#ff6b1a] bg-[#ff6b1a] text-white",
  active: "border-[#ff6b1a] bg-white",
  todo: "border-gray-200 bg-white",
  cancelled: "border-red-500 bg-red-500 text-white",
};

export default function OrderTimeline({ order }: { order: OrderDetail }) {
  const steps = buildSteps(order);

  return (
    <Card title="Order Progress">
      <ol>
        {steps.map((step, index) => {
          const next = steps[index + 1];
          const lineActive = next?.state === "done" || next?.state === "active";

          return (
            <li key={step.label} className="relative flex gap-3 pb-6 last:pb-0">
              {next && (
                <span
                  aria-hidden="true"
                  className={`absolute left-[11px] top-6 h-[calc(100%-1.5rem)] w-0.5 ${
                    lineActive ? "bg-[#ff6b1a]" : "bg-gray-200"
                  }`}
                />
              )}
              <span className={`z-10 flex size-6 shrink-0 items-center justify-center rounded-full border-2 ${dotStyles[step.state]}`}>
                {step.state === "done" && <Check size={13} strokeWidth={3} />}
                {step.state === "cancelled" && <X size={13} strokeWidth={3} />}
                {step.state === "active" && <span className="size-2 rounded-full bg-[#ff6b1a]" />}
              </span>
              <div className="-mt-0.5">
                <p className={`text-sm font-medium ${step.state === "todo" ? "text-gray-400" : "text-gray-900"}`}>
                  {step.label}
                </p>
                {step.note && <p className="text-xs text-gray-400">{step.note}</p>}
              </div>
            </li>
          );
        })}
      </ol>
    </Card>
  );
}