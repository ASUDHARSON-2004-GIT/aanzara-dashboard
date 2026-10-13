import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function ViewAllLink({ href }: { href: string }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-1 whitespace-nowrap text-xs font-medium text-orange-600 hover:underline"
    >
      View All
      <ArrowRight size={12} />
    </Link>
  );
}
