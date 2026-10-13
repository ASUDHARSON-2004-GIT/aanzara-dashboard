"use client";

export default function GlobalError({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#f5f7fa] p-6 text-center">
      <h2 className="text-xl font-bold text-gray-900">Something went wrong</h2>
      <p className="text-sm text-gray-500">The dashboard hit an unexpected error.</p>
      <button
        onClick={reset}
        className="rounded-lg bg-[#ff6b1a] px-4 py-2 text-sm font-semibold text-white hover:bg-[#f05f10]"
      >
        Try again
      </button>
    </div>
  );
}
