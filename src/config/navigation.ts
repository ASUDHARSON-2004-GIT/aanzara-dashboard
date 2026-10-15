import {
  BarChart3,
  Boxes,
  ClipboardList,
  FileText,
  Home,
  Package,
  Settings,
  ShoppingCart,
  Store,
  Tag,
  UserRound,
  Users,
  Warehouse,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  /** Shows the arrow that hints at a sub menu (sub menus come later). */
  expandable?: boolean;
}

/** Sidebar entries, in the order they appear. */
export const navigation: NavItem[] = [
  { label: "Dashboard", href: "/", icon: Home },
  { label: "Catalog", href: "/catalog", icon: Package, expandable: true },
  { label: "Sales", href: "/sales", icon: ShoppingCart, expandable: true },
  { label: "Inventory", href: "/inventory", icon: Boxes, expandable: true },
  { label: "Orders", href: "/orders", icon: ClipboardList, expandable: true },
  { label: "Customers", href: "/customers", icon: Users, expandable: true },
  { label: "Offers & Promotions", href: "/offers", icon: Tag, expandable: true },
  { label: "Wholesale", href: "/wholesale", icon: Store },
  { label: "Warehouse", href: "/warehouse", icon: Warehouse, expandable: true },
  { label: "Reports", href: "/reports", icon: BarChart3, expandable: true },
  { label: "Content", href: "/content", icon: FileText, expandable: true },
  { label: "Users & Roles", href: "/users-roles", icon: UserRound, expandable: true },
  { label: "Settings", href: "/settings", icon: Settings },
];

/**
 * Pages that are linked from the dashboard (quick actions, "View All",
 * profile menu) but not built yet. They show a placeholder page instead of a 404.
 * When you build a real page, create its folder under src/app/(admin)/ and
 * remove its line from here.
 */
const otherPlannedPages = [
  { href: "/catalog/products", title: "Products" },
  { href: "/catalog/products/new", title: "Add Product" },
  { href: "/offers/new", title: "Create Offer" },
  { href: "/customers/new", title: "Add Customer" },
  { href: "/profile", title: "My Profile" },
  { href: "/store", title: "Store" },
];

const orderDetailPath = /^\/orders\/([^/]+)$/;
const productDetailPath = /^\/catalog\/products\/([^/]+)$/;
const customerDetailPath = /^\/customers\/([^/]+)$/;

/** Pages that now have a real folder under src/app/(admin)/, so they skip the placeholder. */
const builtPaths = new Set(["/catalog","sales","inventory","orders","customers"]);

/** Every path that shows a placeholder, used to pre-build those pages. */
export const plannedPaths: string[] = [
  ...navigation
    .filter((item) => item.href !== "/" && !builtPaths.has(item.href))
    .map((item) => item.href),
  ...otherPlannedPages.map((page) => page.href),
];

/** Returns the placeholder title for a path, or null when the path is unknown (404). */
export function getPlannedPage(path: string): { title: string } | null {
  if (builtPaths.has(path)) return null;

  const navMatch = navigation.find((item) => item.href === path);
  if (navMatch) return { title: navMatch.label };

  const otherMatch = otherPlannedPages.find((page) => page.href === path);
  if (otherMatch) return { title: otherMatch.title };

  const orderMatch = orderDetailPath.exec(path);
  if (orderMatch) return { title: `Order ${decodeURIComponent(orderMatch[1])}` };

  const productMatch = productDetailPath.exec(path);
  if (productMatch) return { title: `Product ${decodeURIComponent(productMatch[1])}` };

  const customerMatch = customerDetailPath.exec(path);
  if (customerMatch) return { title: `Customer ${decodeURIComponent(customerMatch[1])}` };

  return null;
}
