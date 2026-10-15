import Link from "next/link";
import Card from "@/components/ui/Card";

export default function AddCustomerPage() {
  return (
    <Card className="items-center justify-center py-16 text-center">
      <h2 className="text-xl font-bold text-gray-900">Add Customer</h2>
      <p className="mt-2 text-sm text-gray-500">This form is coming next.</p>
      <Link
        href="/customers"
        className="mt-6 rounded-lg bg-[#ff6b1a] px-4 py-2 text-sm font-semibold text-white hover:bg-[#f05f10]"
      >
        Back to customers
      </Link>
    </Card>
  );
}