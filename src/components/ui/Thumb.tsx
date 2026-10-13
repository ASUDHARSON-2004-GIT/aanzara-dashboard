import { Package } from "lucide-react";

/**
 * Small square image slot. Falls back to an icon until your API sends imageUrl.
 * When real images exist, swap <img> for next/image and add the host to
 * `images.remotePatterns` in next.config.ts.
 */
export default function Thumb({ name, imageUrl }: { name: string; imageUrl?: string }) {
  if (imageUrl) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={imageUrl} alt={name} className="size-9 shrink-0 rounded-lg object-cover" />;
  }
  return (
    <span
      aria-hidden="true"
      className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-orange-50 text-orange-500"
    >
      <Package size={18} />
    </span>
  );
}
