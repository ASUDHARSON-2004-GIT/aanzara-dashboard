import Link from "next/link";
import { notFound } from "next/navigation";
import Card from "@/components/ui/Card";
import { getPlannedPage, plannedPaths } from "@/config/navigation";

/**
 * One placeholder for every page that is linked from the dashboard but not
 * built yet (see src/config/navigation.ts). Unknown addresses still return 404.
 */
export function generateStaticParams() {
  return plannedPaths.map((path) => ({ slug: path.split("/").filter(Boolean) }));
}

export default async function PlaceholderPage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const page = getPlannedPage(`/${slug.join("/")}`);

  if (!page) notFound();

  return (
    <Card className="items-center justify-center py-16 text-center">
      <h2 className="text-xl font-bold text-gray-900">{page.title}</h2>
      <p className="mt-2 text-sm text-gray-500">This page is not built yet.</p>
      <Link
        href="/"
        className="mt-6 rounded-lg bg-[#ff6b1a] px-4 py-2 text-sm font-semibold text-white hover:bg-[#f05f10]"
      >
        Back to dashboard
      </Link>
    </Card>
  );
}
