import type { ReactNode } from "react";
import { Suspense } from "react";
import AsyncSection from "@/components/ui/AsyncSection";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import TopbarSkeleton from "@/components/TopbarSkeleton";
import { getTopbarData } from "@/services/dashboard";

/**
 * Shared shell for every admin page: sidebar, top bar and the content area.
 * Pages only render what goes inside <main>.
 */
export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f5f7fa]">
      <Sidebar />

      <div className="min-h-screen lg:pl-[260px]">
        <Suspense fallback={<TopbarSkeleton />}>
          <AsyncSection load={getTopbarData} title="header">
            {({ user, unreadCount }) => <Topbar user={user} unreadCount={unreadCount} />}
          </AsyncSection>
        </Suspense>

        <main className="space-y-5 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
