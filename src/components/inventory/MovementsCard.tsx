import { formatDate, formatNumber } from "@/lib/format";
import type { MovementType, StockMovement } from "@/types/inventory";
import Card from "../ui/Card";

const typeStyles: Record<MovementType, { label: string; className: string }> = {
  in: { label: "Stock In", className: "bg-green-50 text-green-600" },
  out: { label: "Stock Out", className: "bg-red-50 text-red-500" },
  transfer: { label: "Transfer", className: "bg-blue-50 text-blue-600" },
  adjust: { label: "Adjustment", className: "bg-orange-50 text-orange-500" },
};

/** "+40", "-12", or just "5" for a transfer (it moves stock, it doesn't add or remove it). */
function formatQuantity(movement: StockMovement) {
  const amount = formatNumber(Math.abs(movement.quantity));
  if (movement.type === "in") return `+${amount}`;
  if (movement.type === "out") return `-${amount}`;
  if (movement.type === "adjust") return movement.quantity < 0 ? `-${amount}` : `+${amount}`;
  return amount;
}

const quantityTone: Record<MovementType, string> = {
  in: "text-green-600",
  out: "text-red-500",
  transfer: "text-gray-900",
  adjust: "text-orange-500",
};

export default function MovementsCard({ movements }: { movements: StockMovement[] }) {
  return (
    <Card title="Recent Stock Movements">
      {movements.length === 0 ? (
        <p className="py-8 text-center text-sm text-gray-500">No stock movements yet.</p>
      ) : (
        <div className="-mx-5 overflow-x-auto px-5">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead>
              <tr className="bg-gray-50 text-xs text-gray-500">
                <th className="rounded-l-lg px-2.5 py-2 font-medium">Date</th>
                <th className="px-2.5 py-2 font-medium">Product</th>
                <th className="px-2.5 py-2 font-medium">Type</th>
                <th className="px-2.5 py-2 font-medium">Quantity</th>
                <th className="px-2.5 py-2 font-medium">Warehouse</th>
                <th className="px-2.5 py-2 font-medium">Reason</th>
                <th className="rounded-r-lg px-2.5 py-2 font-medium">By</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {movements.map((movement) => {
                const { label, className } = typeStyles[movement.type];
                return (
                  <tr key={movement.id}>
                    <td className="whitespace-nowrap px-2.5 py-3 text-gray-700">{formatDate(movement.date)}</td>
                    <td className="whitespace-nowrap px-2.5 py-3 font-medium text-gray-900">{movement.productName}</td>
                    <td className="px-2.5 py-3">
                      <span
                        className={`inline-block whitespace-nowrap rounded-md px-2.5 py-1 text-xs font-medium ${className}`}
                      >
                        {label}
                      </span>
                    </td>
                    <td className={`whitespace-nowrap px-2.5 py-3 font-semibold ${quantityTone[movement.type]}`}>
                      {formatQuantity(movement)}
                    </td>
                    <td className="whitespace-nowrap px-2.5 py-3 text-gray-700">{movement.warehouseName}</td>
                    <td className="px-2.5 py-3 text-gray-700">{movement.reason}</td>
                    <td className="whitespace-nowrap px-2.5 py-3 text-gray-700">{movement.by}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}