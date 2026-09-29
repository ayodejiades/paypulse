// app/not-found.tsx — a dead link should still look like the product.
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-[var(--bg)] px-6 text-center text-[var(--fg)]">
      <div className="max-w-md space-y-3">
        <p className="font-mono text-xs uppercase tracking-widest text-[var(--fg-muted)]">
          404
        </p>
        <h1 className="text-2xl font-semibold tracking-tight">No such page</h1>
        <p className="text-sm text-[var(--fg-muted)]">
          The address you followed does not exist on this deployment.
        </p>
      </div>
      <Link
        href="/"
        className="rounded-[var(--radius-sm,6px)] bg-[var(--accent)] px-4 py-2 text-sm font-medium text-[var(--accent-contrast)] hover:opacity-90"
      >
        Go to the overview
      </Link>
    </main>
  );
}