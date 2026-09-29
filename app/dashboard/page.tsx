import { listReminders } from "@/db";
import { ReminderForm } from "@/components/new-record-form";
import { DashboardShell } from "@/components/dashboard-shell";

export default async function ScheduleDashboardPage() {
  const rows = await listReminders();
  const flaggedRows = rows.filter((r) => r.overdueFlag);

  return (
    <DashboardShell project="PulseOps">
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-[var(--fg)]">
            Schedule & Reminders Console
          </h1>
          <p className="text-sm text-[var(--fg-muted)]">
            Temporal workflow scheduler with automatic overdue threshold detection and notification dispatch.
          </p>
        </div>

        <section className="flex flex-col gap-4 rounded-[var(--radius,8px)] border border-[var(--border,#262626)] bg-[var(--surface,#121212)] p-6 shadow-sm">
          <h2 className="text-base font-medium text-[var(--fg)]">Schedule an Item</h2>
          <ReminderForm />
        </section>

        <section className="flex flex-col gap-4 rounded-[var(--radius,8px)] border border-[var(--border,#262626)] bg-[var(--surface,#121212)] p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-medium text-[var(--fg)]">
              Scheduled Items{" "}
              <span data-demo="flagged-count" className="text-[var(--fg-muted)] text-xs font-mono">
                ({flaggedRows.length} of {rows.length} need a reminder)
              </span>
            </h2>
          </div>
          {rows.length === 0 ? (
            <p data-demo="empty-state" className="text-sm text-[var(--fg-muted)]">
              Nothing scheduled yet — add an item above.
            </p>
          ) : (
            <ul className="flex flex-col gap-2" data-demo="list">
              {rows.map((row) => (
                <li
                  key={row.id}
                  data-demo="row"
                  data-flagged={row.overdueFlag}
                  className="flex items-center justify-between rounded-[var(--radius-sm,4px)] border border-[var(--border,#262626)] bg-[var(--surface-raised,#1f1f1f)] px-4 py-3 text-sm text-[var(--fg)]"
                >
                  <span>{row.title}</span>
                  <div className="flex items-center gap-3">
                    <time className="text-[var(--fg-muted)] text-xs font-mono" dateTime={row.dueAt.toISOString()}>
                      {row.dueAt.toLocaleString()}
                    </time>
                    {row.overdueFlag ? (
                      <span className="rounded-full bg-amber-500/20 border border-amber-500/30 px-2 py-0.5 text-xs font-medium text-amber-400 font-mono">
                        send reminder
                      </span>
                    ) : null}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </DashboardShell>
  );
}
