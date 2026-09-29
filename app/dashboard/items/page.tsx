import { listRecords, listReminders } from "@/db";
import { DashboardShell } from "@/components/dashboard-shell";
import { InvoicesLedgerView } from "@/components/invoices-ledger-view";

export const dynamic = "force-dynamic";

export default async function InvoicesLedgerPage() {
  const records = await listRecords();
  const reminders = await listReminders();

  return (
    <DashboardShell project="PayPulse">
      <InvoicesLedgerView dbRecords={records} dbReminders={reminders} />
    </DashboardShell>
  );
}
