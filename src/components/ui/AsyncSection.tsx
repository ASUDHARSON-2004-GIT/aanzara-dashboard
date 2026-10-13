import type { ReactNode } from "react";
import { unstable_rethrow } from "next/navigation";
import SectionError from "./SectionError";

interface AsyncSectionProps<T> {
  /** A service function, e.g. getRecentOrders */
  load: () => Promise<T>;
  /** Human name used in the error message */
  title: string;
  /** Receives the loaded data and returns the UI */
  children: (data: T) => ReactNode;
}

/**
 * Server Component that fetches ONE piece of data and isolates its failure.
 * Wrap it in <Suspense fallback={...}> to stream it in independently.
 */
export default async function AsyncSection<T>({ load, title, children }: AsyncSectionProps<T>) {
  let data: T;

  try {
    data = await load();
  } catch (error) {
    // Let Next.js handle its own internal control-flow errors.
    unstable_rethrow(error);
    console.error(`[dashboard] failed to load ${title}`, error);
    return <SectionError title={title} />;
  }

  return <>{children(data)}</>;
}
