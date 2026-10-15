import { customerTypeLabels } from "@/lib/customers-query";
import type { CustomerType } from "@/types/customers";

const styles: Record<CustomerType, string> = {
  retail: "bg-blue-50 text-blue-600",
  wholesale: "bg-purple-50 text-purple-600",
};

export default function CustomerTypeBadge({ type }: { type: CustomerType }) {
  return (
    <span className={`inline-block whitespace-nowrap rounded-md px-2.5 py-1 text-xs font-medium ${styles[type]}`}>
      {customerTypeLabels[type]}
    </span>
  );
}