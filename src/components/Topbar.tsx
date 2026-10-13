"use client";

import { useState } from "react";
import { Search, Bell, Maximize, ChevronDown } from "lucide-react";

export default function Topbar() {
  const [search, setSearch] = useState("");
  const [showProfile, setShowProfile] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="relative flex min-h-[76px] items-center justify-between gap-4 border-b border-gray-200 bg-white py-4 pl-16 pr-5 lg:px-8">
      <div className="flex min-w-0 flex-1 items-center gap-3 lg:max-w-[550px]">
        <Search size={19} className="shrink-0 text-gray-500" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products, orders, customers..."
          aria-label="Search dashboard"
          className="w-full bg-transparent text-sm outline-none placeholder:text-gray-400"
        />
      </div>

      <div className="flex shrink-0 items-center gap-4">
        <div className="relative">
          <button
            aria-label="Notifications"
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative rounded-lg p-2 hover:bg-gray-100"
          >
            <Bell size={21} />
            <span className="absolute right-1 top-0 rounded-full bg-red-500 px-1 text-[10px] text-white">
              5
            </span>
          </button>
          {showNotifications && (
            <div className="absolute right-0 top-12 z-20 w-60 rounded-xl border bg-white p-4 text-sm shadow-xl">
              <p className="font-semibold">Notifications</p>
              <p className="mt-2 text-gray-500">
                You have 5 unread notifications.
              </p>
            </div>
          )}
        </div>

        <button
          aria-label="Fullscreen (visual placeholder)"
          onClick={() => {
            if (document.fullscreenElement) {
              void document.exitFullscreen();
            } else {
              void document.documentElement.requestFullscreen();
            }
          }}
          className="hidden rounded-lg p-2 hover:bg-gray-100 sm:block"
        >
          <Maximize size={20} />
        </button>

        <div className="relative">
          <button
            onClick={() => setShowProfile(!showProfile)}
            className="flex items-center gap-2"
          >
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold">Sudharson A</p>
              <p className="text-xs text-gray-500">Admin</p>
            </div>
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-100 font-semibold text-orange-700">
              SS
            </span>
            <ChevronDown size={15} />
          </button>
          {showProfile && (
            <div className="absolute right-0 top-12 z-20 w-40 rounded-xl border bg-white p-2 text-sm shadow-xl">
              <button className="w-full rounded-lg p-2 text-left hover:bg-gray-100">
                My Profile
              </button>
              <button className="w-full rounded-lg p-2 text-left hover:bg-gray-100">
                Settings
              </button>
              <button className="w-full rounded-lg p-2 text-left hover:bg-gray-100">
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}