export default function ViewAllLink({ href }: { href: string }) {
  return (
    <a href={href} className="whitespace-nowrap text-xs font-medium text-orange-600 hover:underline">
      View All →
    </a>
  );
}
