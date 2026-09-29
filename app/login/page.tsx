// app/login/page.tsx — the entry point a judge lands on.
//
// This page used to advertise "verified session management" and a "pre-seed
// authenticated session", behind buttons labelled Continue with GitHub / Google that
// were plain <Link href="/dashboard"> elements. Nothing authenticated anything, so the
// page claimed a security property the app does not have. Honesty is the whole point:
// `hack-preflight` check 1 fails on leaked builder copy, and a judge who spots a fake
// OAuth button stops trusting everything else on the page.
//
// There is no authentication in this template. If your project needs it, add it and
// delete this page — do not leave a sign-in screen that does not sign anyone in.
import Link from "next/link";
import { isDemoMode } from "@/lib/demo-mode";

export default function LoginPage() {
  const demo = isDemoMode();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-[var(--bg)] text-[var(--fg)]">
      <div className="w-full max-w-md flex flex-col gap-6">
        <div className="flex flex-col items-center text-center gap-2">
          <Link
            href="/"
            className="text-xl font-bold tracking-tight text-[var(--fg)] hover:opacity-80 transition-opacity"
          >
            &lt;PROJECT&gt;
          </Link>
          <h1 className="text-2xl font-semibold tracking-tight text-[var(--fg)]">
            Open the demo
          </h1>
          <p className="text-sm text-[var(--fg-muted)]">
            No account, no wallet, no sign-up. This build has no authentication.
          </p>
        </div>

        <div className="rounded-[var(--radius,8px)] border border-[var(--border,#262626)] bg-[var(--surface,#121212)] p-6 shadow-lg flex flex-col gap-5">
          <Link
            href="/dashboard"
            data-demo="enter-demo"
            className="flex items-center justify-center rounded-md bg-[var(--accent)] px-4 py-2.5 text-sm font-medium text-[var(--accent-contrast)] hover:opacity-90 transition-opacity"
          >
            Continue to the app
          </Link>

          {demo ? (
            <p className="text-xs text-[var(--fg-muted)]">
              <span className="font-medium text-[var(--fg)]">Demo data.</span>{" "}
              <code className="font-mono">DEMO_MODE=1</code> is on, so every external
              dependency is served from the fixtures in <code className="font-mono">fixtures/</code>.
              The verification kernel still runs for real; the data behind it does not.
            </p>
          ) : (
            <p className="text-xs text-[var(--fg-muted)]">
              Running against the live database. Records you create are persisted.
            </p>
          )}
        </div>

        <p className="text-center text-xs text-[var(--fg-muted)]">
          <Link href="/" className="underline underline-offset-4 hover:opacity-80">
            Back to the overview
          </Link>
        </p>
      </div>
    </main>
  );
}
