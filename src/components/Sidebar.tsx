"use client";

import { useState } from "react";
import {
  Home, Package, ShoppingCart, Boxes, ClipboardList,
  Users, Tag, Warehouse, BarChart3, FileText, Settings,
  UserRound, ChevronRight, Menu, X
} from "lucide-react";

import logo from "public/aanzara-logo.png";
import Image from "next/image";

const navigation = [
  { label: "Dashboard", icon: Home },
  { label: "Catalog", icon: Package, expandable: true },
  { label: "Sales", icon: ShoppingCart, expandable: true },
  { label: "Inventory", icon: Boxes, expandable: true },
  { label: "Orders", icon: ClipboardList, expandable: true },
  { label: "Customers", icon: Users, expandable: true },
  { label: "Offers & Promotions", icon: Tag, expandable: true },
  { label: "Wholesale", icon: Warehouse },
  { label: "Warehouse", icon: Warehouse, expandable: true },
  { label: "Reports", icon: BarChart3, expandable: true },
  { label: "Content", icon: FileText, expandable: true },
  { label: "Users & Roles", icon: UserRound, expandable: true },
  { label: "Settings", icon: Settings },
];

export default function Sidebar() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("Dashboard");

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        aria-label="Toggle navigation"
        className="fixed left-4 top-4 z-50 rounded-lg bg-[#111820] p-2 text-white lg:hidden"
      >
        {open ? <X /> : <Menu />}
      </button>

      {open && (
        <button
          aria-label="Close navigation overlay"
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-[260px] flex-col
          bg-[#111820] text-white transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0`}
      >
        <div className="flex items-center gap-3 border-b border-white/10 px-6 py-6">
          <Image src="/aanzara-logo.png" alt="" width={48} height={48} priority className="size-12 shrink-0" />
          <div>
          <h1 className="text-2xl font-extrabold tracking-wide">
            AAN<span className="text-[#ff6b1a]">ZARA</span>
          </h1>
          <p className="text-[10px] tracking-[0.25em] text-gray-400">STYLE YOUR WORLD</p>
        </div>
      </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-4 py-5">
          {navigation.map(({ label, icon: Icon, expandable }) => (
            <button
              key={label}
              onClick={() => {
                setActive(label);
                setOpen(false);
              }}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-3
                text-left text-sm transition-colors
                ${active === label
                  ? "bg-[#ff6b1a] text-white shadow-md"
                  : "text-gray-300 hover:bg-white/10 hover:text-white"}`}
            >
              <Icon size={19} />
              <span className="flex-1">{label}</span>
              {expandable && <ChevronRight size={15} />}
            </button>
          ))}
        </nav>

        <div className="m-4 rounded-xl border border-white/10 bg-gradient-to-br from-[#302219] to-[#161b20] p-4">
          <p className="text-sm font-semibold">Grow Your Business</p>
          <p className="mt-1 text-xs text-gray-400">with AANZARA</p>
          <button className="mt-4 rounded-full bg-[#ff6b1a] px-4 py-2 text-xs font-semibold">
            View Store →
          </button>
        </div>
      </aside>
    </>
  );
}