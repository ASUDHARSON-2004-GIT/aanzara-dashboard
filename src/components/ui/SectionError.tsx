import { TriangleAlert } from "lucide-react";

/** Shown inside a panel when ITS api call fails; the rest of the page keeps working. */
export default function SectionError({ title }: { title: string }) {
  return (
    <section
      role="alert"
      className="flex min-h-40 flex-col items-center justify-center gap-2 rounded-2xl border border-red-100 bg-white p-5 text-center shadow-sm"
    >
      <TriangleAlert className="text-red-500" size={24} />
      <p className="text-sm font-semibold text-gray-900">Couldn&apos;t load {title}</p>
      <p className="text-xs text-gray-500">Refresh the page to try again.</p>
    </section>
  );
}
