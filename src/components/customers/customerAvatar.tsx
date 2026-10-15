const sizes = {
  sm: "size-9 text-xs",
  lg: "size-14 text-lg",
};

/** Round badge with the customer's initials (no photos in the data yet). */
export default function CustomerAvatar({ name, size = "sm" }: { name: string; size?: keyof typeof sizes }) {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  return (
    <span
      aria-hidden="true"
      className={`flex shrink-0 items-center justify-center rounded-full bg-orange-50 font-semibold text-orange-600 ${sizes[size]}`}
    >
      {initials}
    </span>
  );
}