import { Phone } from "lucide-react";
import type { Supplier } from "@/types/inventory";
import Card from "../ui/Card";

export default function SuppliersCard({ suppliers }: { suppliers: Supplier[] }) {
  return (
    <Card title="Suppliers">
      <ul className="divide-y divide-gray-100">
        {suppliers.map((supplier) => (
          <li key={supplier.id} className="py-3 first:pt-0 last:pb-0">
            <p className="text-[13px] font-semibold text-gray-900">{supplier.name}</p>
            <p className="mt-0.5 flex flex-wrap items-center gap-x-3 text-xs text-gray-400">
              <span>{supplier.city}</span>
              <span className="inline-flex items-center gap-1">
                <Phone size={11} />
                {supplier.contact}
              </span>
            </p>
          </li>
        ))}
      </ul>
    </Card>
  );
}