"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, ChevronRight, Menu, X } from "lucide-react";
import { navigation } from "@/config/navigation";

export default function Sidebar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // The dashboard link only matches the exact home path, every other link also
  // matches its child pages (for example /orders/AZ1248 keeps Orders highlighted).
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        aria-label="Toggle navigation"
        aria-expanded={open}
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
          <Image
            src="/aanzara-logo.png"
            alt=""
            width={48}
            height={48}
            priority
            className="size-12 shrink-0 rounded-lg"
          />
          <div>
            <h1 className="text-2xl font-extrabold tracking-wide">
              AAN<span className="text-[#ff6b1a]">ZARA</span>
            </h1>
            <p className="text-[10px] tracking-[0.25em] text-gray-400">STYLE YOUR WORLD</p>
          </div>
        </div>

        <nav aria-label="Main navigation" className="flex-1 space-y-1 overflow-y-auto px-4 py-5">
          {navigation.map(({ label, href, icon: Icon, expandable }) => {
            const active = isActive(href);
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                aria-current={active ? "page" : undefined}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-3
                  text-left text-sm transition-colors
                  ${
                    active
                      ? "bg-[#ff6b1a] text-white shadow-md"
                      : "text-gray-300 hover:bg-white/10 hover:text-white"
                  }`}
              >
                <Icon size={19} />
                <span className="flex-1">{label}</span>
                {expandable && <ChevronRight size={15} />}
              </Link>
            );
          })}
        </nav>

        <div className="relative m-4 overflow-hidden rounded-xl border border-white/10 bg-gradient-to-br from-[#302219] to-[#161b20] p-4">
          <Image
            src="/grow-business.webp"
            alt=""
            width={400}
            height={375}
            className="pointer-events-none absolute -bottom-2 -right-3 w-28 mix-blend-screen"
          />
          <div className="relative">
            <p className="max-w-[120px] text-sm font-semibold leading-snug">Grow Your Business with AANZARA</p>
            <Link
              href="/store"
              onClick={() => setOpen(false)}
              className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-[#ff6b1a] px-4 py-2 text-xs font-semibold"
            >
              View Store
              <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}
