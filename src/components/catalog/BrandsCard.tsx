import type { Brand } from "@/types/catalog";
import Card from "../ui/Card";

export default function BrandsCard({ brands }: { brands: Brand[] }) {
  return (
    <Card title="Brands">
      <ul className="flex flex-wrap gap-2">
        {brands.map((brand) => (
          <li
            key={brand.id}
            className="flex items-center gap-1.5 rounded-full border border-gray-200 px-3 py-1 text-xs font-medium text-gray-700"
          >
            {brand.name}
            <span className="text-gray-400">{brand.productCount}</span>
          </li>
        ))}
      </ul>
    </Card>
  );
}
