"use client";

import { useCallback, useRef, useState } from "react";
import Link from "next/link";
import { Bell, ChevronDown, Maximize, Search } from "lucide-react";
import { useDismiss } from "@/hooks/useDismiss";
import { getInitials } from "@/lib/user";
import type { CurrentUser } from "@/types/dashboard";

const SEARCH_SCOPES = ["All", "Products", "Orders", "Customers"];

interface TopbarProps {
  user: CurrentUser;
  unreadCount: number;
}

export default function Topbar({ user, unreadCount }: TopbarProps) {
  const [search, setSearch] = useState("");
  const [scope, setScope] = useState(SEARCH_SCOPES[0]);
  const [showProfile, setShowProfile] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const notificationsRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const closeNotifications = useCallback(() => setShowNotifications(false), []);
  const closeProfile = useCallback(() => setShowProfile(false), []);

  useDismiss(notificationsRef, showNotifications, closeNotifications);
  useDismiss(profileRef, showProfile, closeProfile);

  return (
    <header className="relative flex min-h-[76px] items-center justify-between gap-4 border-b border-gray-200 bg-white py-4 pl-16 pr-5 lg:px-8">
      <div className="flex min-w-0 flex-1 items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 lg:max-w-[550px]">
        <Search size={19} className="shrink-0 text-gray-500" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products, orders, customers..."
          aria-label="Search dashboard"
          className="w-full min-w-0 bg-transparent text-sm outline-none placeholder:text-gray-400"
        />
        <select
          aria-label="Search in"
          value={scope}
          onChange={(e) => setScope(e.target.value)}
          className="shrink-0 bg-transparent text-sm text-gray-700 outline-none"
        >
          {SEARCH_SCOPES.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>

      <div className="flex shrink-0 items-center gap-4">
        <div ref={notificationsRef} className="relative">
          <button
            aria-label={`Notifications, ${unreadCount} unread`}
            aria-expanded={showNotifications}
            aria-haspopup="true"
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfile(false);
            }}
            className="relative rounded-lg p-2 hover:bg-gray-100"
          >
            <Bell size={21} />
            {unreadCount > 0 && (
              <span className="absolute right-1 top-0 rounded-full bg-red-500 px-1 text-[10px] text-white">
                {unreadCount}
              </span>
            )}
          </button>
          {showNotifications && (
            <div className="absolute right-0 top-12 z-20 w-60 rounded-xl border bg-white p-4 text-sm shadow-xl">
              <p className="font-semibold">Notifications</p>
              <p className="mt-2 text-gray-500">
                {unreadCount > 0
                  ? `You have ${unreadCount} unread notifications.`
                  : "You are all caught up."}
              </p>
            </div>
          )}
        </div>

        <button
          aria-label="Toggle fullscreen"
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

        <div ref={profileRef} className="relative">
          <button
            onClick={() => {
              setShowProfile(!showProfile);
              setShowNotifications(false);
            }}
            aria-expanded={showProfile}
            aria-haspopup="true"
            aria-label="Account menu"
            className="flex items-center gap-2"
          >
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold">{user.name}</p>
              <p className="text-xs text-gray-500">{user.role}</p>
            </div>
            {user.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={user.avatarUrl}
                alt=""
                className="size-9 shrink-0 rounded-full object-cover"
              />
            ) : (
              <span
                aria-hidden="true"
                className="flex size-9 items-center justify-center rounded-full bg-orange-100 font-semibold text-orange-700"
              >
                {getInitials(user.name)}
              </span>
            )}
            <ChevronDown size={15} />
          </button>
          {showProfile && (
            <div className="absolute right-0 top-12 z-20 w-40 rounded-xl border bg-white p-2 text-sm shadow-xl">
              <Link
                href="/profile"
                onClick={closeProfile}
                className="block w-full rounded-lg p-2 text-left hover:bg-gray-100"
              >
                My Profile
              </Link>
              <Link
                href="/settings"
                onClick={closeProfile}
                className="block w-full rounded-lg p-2 text-left hover:bg-gray-100"
              >
                Settings
              </Link>
              {/* Wire this to the real sign out call when authentication is added. */}
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
