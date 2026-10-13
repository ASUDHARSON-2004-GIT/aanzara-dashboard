import Skeleton from "./ui/Skeleton";

/** Loading placeholder with the same height and padding as the real Topbar. */
export default function TopbarSkeleton() {
  return (
    <header
      role="status"
      aria-label="Loading header"
      className="flex min-h-[76px] items-center justify-between gap-4 border-b border-gray-200 bg-white py-4 pl-16 pr-5 lg:px-8"
    >
      <Skeleton className="h-11 w-full rounded-xl lg:max-w-[550px]" />
      <div className="flex shrink-0 items-center gap-4">
        <Skeleton className="size-9" />
        <Skeleton className="h-9 w-36 rounded-full" />
      </div>
    </header>
  );
}
