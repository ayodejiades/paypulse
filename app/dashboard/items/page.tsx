import { listRecords } from "@/db";
import { DashboardShell } from "@/components/dashboard-shell";
import { BENCHMARK_CASES, evaluateSafetyKernel } from "@/lib/kernel";

export const dynamic = "force-dynamic";

export default async function Web2ItemsLedgerPage() {
  const rows = await listRecords();
  const evaluatedCases = BENCHMARK_CASES.map((c) => ({
    ...c,
    audit: evaluateSafetyKernel(c),
  }));

  return (
    <DashboardShell project="PayPulse">
      <div className="flex flex-col gap-6">
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[var(--border,#232b29)] pb-5">
          <div>
            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--accent,#059669)] font-semibold">
              Reconciliation &amp; Evidence Ledger
            </span>
            <h1 className="mt-1 text-2xl font-semibold tracking-[-0.02em] text-[var(--fg,#e7f3ef)] [text-wrap:balance]">
              Invoice Commitment and Drift Ledger
            </h1>
            <p className="mt-1 max-w-3xl text-sm text-[var(--fg-muted,#8aa39a)] [text-wrap:pretty]">
              Every invoice commitment and T0 vs Tn payment pair is audited by <code className="font-mono text-xs text-[var(--fg,#e7f3ef)]">lib/kernel.ts</code> with integer kobo arithmetic and literal excerpt binding.
            </p>
          </div>
          <div className="rounded border border-[var(--border,#232b29)] bg-[var(--surface,#121615)] px-3.5 py-2 font-mono text-xs">
            <div className="text-[10px] uppercase tracking-[0.12em] text-[var(--fg-muted,#8aa39a)]">
              Total Audited Entries
            </div>
            <div className="mt-0.5 font-semibold text-[var(--fg,#e7f3ef)] tabular-nums">
              {evaluatedCases.length + rows.length} RECORDS
            </div>
          </div>
        </div>

        {/* Evaluated Kernel Cases */}
        <section className="overflow-hidden rounded-lg border border-[var(--border,#232b29)] bg-[var(--surface,#121615)]">
          <div className="border-b border-[var(--border,#232b29)] bg-[var(--surface-raised,#171c1b)] px-5 py-3 flex items-center justify-between">
            <h2 className="font-mono text-[11px] uppercase tracking-[0.12em] text-[var(--fg,#e7f3ef)] font-medium">
              1. Kernel Audited Benchmark Invoices (lib/kernel.ts)
            </h2>
            <span className="font-mono text-[10px] text-[var(--fg-muted,#8aa39a)]">
              INTEGER KOBO PRECISION
            </span>
          </div>
          <div className="divide-y divide-[var(--border,#232b29)]">
            {evaluatedCases.map((item) => (
              <div key={item.id} className="flex flex-col gap-2 p-5 hover:bg-[var(--surface-raised,#171c1b)]/40 transition-colors">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono text-xs font-semibold text-emerald-400">{item.id}</span>
                    <span className="text-sm font-medium text-[var(--fg,#e7f3ef)]">{item.title}</span>
                  </div>
                  <span
                    className={`rounded px-2.5 py-0.5 font-mono text-[11px] font-medium ${
                      item.audit.verdict === "MATERIAL_DRIFT_DETECTED"
                        ? "border border-red-500/30 bg-red-500/10 text-red-400"
                        : item.audit.verdict === "WAITING_TO_VERIFY"
                        ? "border border-amber-500/30 bg-amber-500/10 text-amber-400"
                        : "border border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                    }`}
                  >
                    {item.audit.verdict}
                  </span>
                </div>
                <p className="text-xs text-[var(--fg-muted,#8aa39a)]">{item.audit.summary}</p>
                <div className="flex flex-wrap items-center gap-4 pt-1 font-mono text-[11px] text-[var(--fg-muted,#8aa39a)] tabular-nums">
                  <span>Promised: ₦{(item.promisedCents / 100).toLocaleString("en-NG", { minimumFractionDigits: 2 })}</span>
                  <span>Observed: ₦{(item.observedCents / 100).toLocaleString("en-NG", { minimumFractionDigits: 2 })}</span>
                  <span className="text-[var(--fg-muted,#8aa39a)]/70">Evidence Digest: {item.audit.evidenceHash.slice(0, 22)}…</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Persisted Workspace Records */}
        <section className="overflow-hidden rounded-lg border border-[var(--border,#232b29)] bg-[var(--surface,#121615)]">
          <div className="border-b border-[var(--border,#232b29)] bg-[var(--surface-raised,#171c1b)] px-5 py-3">
            <h2 className="font-mono text-[11px] uppercase tracking-[0.12em] text-[var(--fg,#e7f3ef)] font-medium">
              2. Persisted Ledger Records ({rows.length})
            </h2>
          </div>
          <ul className="divide-y divide-[var(--border,#232b29)]" data-demo="list">
            {rows.map((row) => (
              <li
                key={row.id}
                data-demo="row"
                className="flex items-center justify-between px-5 py-3.5 text-sm text-[var(--fg,#e7f3ef)] hover:bg-[var(--surface-raised,#171c1b)]/40 transition-colors"
              >
                <span className="font-medium">{row.title}</span>
                <time className="font-mono text-xs text-[var(--fg-muted,#8aa39a)] tabular-nums" dateTime={row.createdAt.toISOString()}>
                  {row.createdAt.toISOString().slice(0, 10)}
                </time>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </DashboardShell>
  );
}
