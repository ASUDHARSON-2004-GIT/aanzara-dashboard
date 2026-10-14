import Link from "next/link";
import type { Category } from "@/types/catalog";
import Card from "../ui/Card";

/** Each row filters the product table to that category. */
export default function CategoriesCard({ categories }: { categories: Category[] }) {
  return (
    <Card title="Categories">
      <ul className="divide-y divide-gray-100">
        {categories.map((category) => (
          <li key={category.id}>
            <Link
              href={`/catalog?category=${category.id}`}
              className="flex items-center justify-between gap-2 py-2.5 text-[13px] hover:text-orange-600"
            >
              <span className="font-medium text-gray-900">{category.name}</span>
              <span className="rounded-md bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
                {category.productCount}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </Card>
  );
}
