import { BarChart3, Plus, Tag, UserPlus } from "lucide-react";
import Card from "./ui/Card";

// Static UI config: no API needed. `href` points at routes you'll build next.
const actions = [
  { label: "Add Product", icon: Plus, href: "/catalog/products/new", primary: true },
  { label: "Create Offer", icon: Tag, href: "/offers/new" },
  { label: "Add Customer", icon: UserPlus, href: "/customers/new" },
  { label: "View Reports", icon: BarChart3, href: "/reports" },
];

export default function QuickActions() {
  return (
    <Card title="Quick Actions">
      <div className="grid flex-1 grid-cols-2 grid-rows-2 gap-3">
        {actions.map(({ label, icon: Icon, href, primary }) => (
          <a
            key={label}
            href={href}
            className={`flex min-h-24 flex-col items-center justify-center gap-2 rounded-xl p-1 text-center text-[11px] font-semibold leading-tight transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500 ${
              primary
              ? "bg-[#ff6b1a] text-white shadow-md hover:bg-[#f05f10]"
              : "bg-orange-50 text-orange-600 hover:bg-orange-100"
            }`}
          >
            <Icon size={20} />
            {label}
          </a>
        ))}
      </div>
    </Card>
  );
}
