import { formatCurrency, formatNumber } from "@/lib/format";
import type { OrderLine } from "@/types/orders";
import Card from "../ui/Card";
import Thumb from "../ui/Thumb";

export default function OrderItemsCard({ items }: { items: OrderLine[] }) {
  return (
    <Card title={`Items (${items.reduce((sum, item) => sum + item.quantity, 0)})`}>
      <div className="-mx-5 overflow-x-auto px-5">
        <table className="w-full min-w-[480px] text-left text-sm">
          <thead>
            <tr className="bg-gray-50 text-xs text-gray-500">
              <th className="rounded-l-lg px-2.5 py-2 font-medium">Product</th>
              <th className="px-2.5 py-2 font-medium">Price</th>
              <th className="px-2.5 py-2 font-medium">Qty</th>
              <th className="rounded-r-lg px-2.5 py-2 text-right font-medium">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {items.map((item) => (
              <tr key={item.productId}>
                <td className="px-2.5 py-3">
                  <div className="flex items-center gap-3">
                    <Thumb name={item.name} />
                    <p className="font-semibold text-gray-900">{item.name}</p>
                  </div>
                </td>
                <td className="whitespace-nowrap px-2.5 py-3 text-gray-700">{formatCurrency(item.unitPrice)}</td>
                <td className="whitespace-nowrap px-2.5 py-3 text-gray-700">{formatNumber(item.quantity)}</td>
                <td className="whitespace-nowrap px-2.5 py-3 text-right font-medium text-gray-900">
                  {formatCurrency(item.lineTotal)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}