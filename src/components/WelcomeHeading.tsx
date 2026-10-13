import { Hand } from "lucide-react";
import { getFirstName } from "@/lib/user";
import type { CurrentUser } from "@/types/dashboard";

export default function WelcomeHeading({ user }: { user: CurrentUser }) {
  return (
    <div>
      <h2 className="flex items-center gap-2 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
        Welcome Back, {getFirstName(user.name)}!
        <Hand aria-hidden="true" className="size-6 text-amber-400 sm:size-7" />
      </h2>
      <p className="mt-1 text-sm text-gray-500 sm:text-base">
        Here&apos;s what&apos;s happening with your store today.
      </p>
    </div>
  );
}
