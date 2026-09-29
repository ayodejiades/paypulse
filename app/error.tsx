// app/error.tsx — a thrown error must not be a blank screen.
//
// Without this, any failure inside a server component or a fetch renders Next's default
// error page, which reads as a broken deploy to a judge who lands on it mid-demo.
"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-[var(--bg)] px-6 text-center text-[var(--fg)]">
      <div className="max-w-md space-y-3">
        <h1 className="text-2xl font-semibold tracking-tight">Something went wrong</h1>
        <p className="text-sm text-[var(--fg-muted)]">
          This request could not be completed. The app is still running — retrying often
          works, and nothing was saved.
        </p>
        {error.digest && (
          <p className="font-mono text-xs text-[var(--fg-muted)]">ref: {error.digest}</p>
        )}
      </div>
      <button
        onClick={reset}
        className="rounded-[var(--radius-sm,6px)] bg-[var(--accent)] px-4 py-2 text-sm font-medium text-[var(--accent-contrast)] hover:opacity-90"
      >
        Try again
      </button>
    </main>
  );
}