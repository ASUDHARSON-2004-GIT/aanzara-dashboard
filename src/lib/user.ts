/** "Sudharson A" -> "Sudharson" */
export const getFirstName = (name: string) => name.trim().split(/\s+/)[0] ?? "";

/** "Sudharson A" -> "SA", "Priya" -> "P". At most two letters. */
export const getInitials = (name: string) =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
