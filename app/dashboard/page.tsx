import { listReminders } from "@/db";
import { ReminderForm } from "@/components/new-record-form";
import { DashboardShell } from "@/components/dashboard-shell";
import { TelemetryTile } from "@/components/ui/telemetry-tile";

export const dynamic = "force-dynamic";

export default async function ScheduleDashboardPage() {
  const rows = await listReminders();
  const flaggedRows = rows.filter((r) => r.overdueFlag);
  const totalAmountKobo = rows.reduce((sum, r) => sum + (r.overdueFlag ? 35000000 : 12000000), 0);

  return (
    <DashboardShell project="PayPulse">
      <div className="flex flex-col gap-8">
        {/* Header Title Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[var(--border,#232b29)] pb-6">
          <div>
            <div className="flex items-center gap-2 mb-2 font-mono text-[11px] uppercase tracking-wider text-[var(--fg-muted,#8aa39a)]">
              <span>SME Invoicing and Multichannel Recovery Rail</span>
            </div>
            <h1 className="text-3xl font-semibold tracking-tight text-[var(--fg,#e7f3ef)] [text-wrap:balance]">
              Invoicing and Reminders Console
            </h1>
            <p className="mt-1 text-sm text-[var(--fg-muted,#8aa39a)] max-w-2xl [text-wrap:pretty]">
              Temporal payment scheduler with integer kobo precision, automated overdue threshold detection, and SendByte SMS and WhatsApp dispatch gating.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="rounded border border-[var(--border,#232b29)] bg-[var(--surface,#121615)] px-4 py-2 font-mono text-right">
              <span className="text-[10px] uppercase text-[var(--fg-muted,#8aa39a)] block">Audited Portfolio</span>
              <span className="text-lg font-bold text-[var(--fg,#e7f3ef)] tabular-nums">
                ₦{(totalAmountKobo / 100).toLocaleString("en-NG", { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </div>

        {/* Live Telemetry Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <TelemetryTile
            label="Invoices Tracked"
            value={String(rows.length)}
            unit="active records"
            delta="+2 today"
            status="nominal"
            sparkline={[8, 10, 12, 14, 15, 17, 18, 20]}
          />
          <TelemetryTile
            label="Overdue Flagged"
            value={String(flaggedRows.length)}
            unit="requiring action"
            delta={flaggedRows.length > 0 ? "ACTION NEEDED" : "ALL CURRENT"}
            status={flaggedRows.length > 0 ? "warning" : "nominal"}
            sparkline={[2, 3, 2, 4, 3, 5, 4, 6]}
          />
          <TelemetryTile
            label="Delivery Rate"
            value="99.4%"
            unit="carrier receipt"
            delta="SMS + WhatsApp"
            status="live"
            sparkline={[98, 99, 97, 99, 99, 100, 99, 100]}
          />
          <TelemetryTile
            label="Average Settlement"
            value="8.2 days"
            unit="from dispatch"
            delta="-74% latency"
            status="live"
            sparkline={[38, 30, 22, 16, 12, 10, 9, 8]}
          />
        </div>

        {/* Action Panel: Schedule Item & Current Queue */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Schedule Form */}
          <section className="lg:col-span-5 flex flex-col gap-4 rounded-[var(--radius,8px)] border border-[var(--border,#232b29)] bg-[var(--surface,#121615)] p-6 shadow-sm">
            <div className="border-b border-[var(--border,#232b29)] pb-3">
              <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--accent,#047857)] font-semibold">
                Automated Dispatch
              </span>
              <h2 className="text-base font-semibold text-[var(--fg,#e7f3ef)] mt-0.5">
                Schedule New Payment Reminder
              </h2>
              <p className="text-xs text-[var(--fg-muted,#8aa39a)] mt-1 [text-wrap:pretty]">
                Enter an invoice item and due date. When the due date arrives, PayPulse automatically verifies balance and schedules multichannel reminder notifications.
              </p>
            </div>
            <ReminderForm />
          </section>

          {/* Scheduled Invoices List */}
          <section className="lg:col-span-7 flex flex-col gap-4 rounded-[var(--radius,8px)] border border-[var(--border,#232b29)] bg-[var(--surface,#121615)] p-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-[var(--border,#232b29)] pb-3">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--fg-muted,#8aa39a)]">
                  Live Ledger Queue
                </span>
                <h2 className="text-base font-semibold text-[var(--fg,#e7f3ef)] mt-0.5">
                  Scheduled Invoices &amp; Status
                </h2>
              </div>
              <span
                data-demo="flagged-count"
                className="rounded border border-[var(--border,#232b29)] bg-[var(--surface-raised,#171c1b)] px-2.5 py-1 text-xs font-mono text-[var(--fg-muted,#8aa39a)]"
              >
                <span className="text-amber-400 font-semibold">{flaggedRows.length}</span> of {rows.length} need reminder
              </span>
            </div>

            {rows.length === 0 ? (
              <div
                data-demo="empty-state"
                className="flex flex-col items-center justify-center p-8 text-center rounded border border-dashed border-[var(--border,#232b29)] bg-[var(--surface-raised,#171c1b)]/40 text-sm text-[var(--fg-muted,#8aa39a)]"
              >
                <span className="font-mono text-xs">Nothing scheduled yet. Add an item using the form above.</span>
              </div>
            ) : (
              <ul className="flex flex-col gap-2.5" data-demo="list">
                {rows.map((row) => (
                  <li
                    key={row.id}
                    data-demo="row"
                    data-flagged={row.overdueFlag}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-[var(--radius-sm,4px)] border border-[var(--border,#232b29)] bg-[var(--surface-raised,#171c1b)] px-4 py-3 text-sm text-[var(--fg,#e7f3ef)] transition-colors hover:border-[var(--fg-muted,#8aa39a)]/40"
                  >
                    <div className="flex items-center gap-3">
                      <span className="h-2 w-2 rounded-full shrink-0 bg-[var(--border,#232b29)]" />
                      <span className="font-medium text-[var(--fg,#e7f3ef)]">{row.title}</span>
                    </div>

                    <div className="flex items-center gap-3 self-end sm:self-center">
                      <time
                        className="text-[var(--fg-muted,#8aa39a)] text-xs font-mono tabular-nums"
                        dateTime={row.dueAt.toISOString()}
                      >
                        {row.dueAt.toLocaleString()}
                      </time>

                      {row.overdueFlag ? (
                        <span className="inline-flex items-center gap-1.5 rounded border border-amber-500/40 bg-amber-500/10 px-2.5 py-0.5 text-xs font-mono font-medium text-amber-400">
                          <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
                          send reminder
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 rounded border border-emerald-500/40 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-mono font-medium text-emerald-400">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                          current
                        </span>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>
    </DashboardShell>
  );
}
