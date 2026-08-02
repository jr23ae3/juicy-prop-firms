"use client";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col items-center justify-center bg-white px-4 font-sans text-center text-zinc-900">
        <h1 className="text-2xl font-bold">Something went wrong</h1>
        <p className="mt-2 max-w-md text-zinc-600">
          A critical error occurred. Please refresh the page or try again later.
        </p>
        <button
          type="button"
          onClick={reset}
          className="mt-6 rounded-lg bg-orange-600 px-4 py-2 text-sm font-medium text-white"
        >
          Try again
        </button>
      </body>
    </html>
  );
}
