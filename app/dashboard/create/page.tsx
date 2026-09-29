"use client";

import { useState } from "react";
import { DashboardShell } from "@/components/dashboard-shell";
import { NewRecordForm } from "@/components/new-record-form";
import { evaluateDeterministicKernel } from "@/lib/kernel";

export default function CreateInvoicePage() {
  const [sourceCaptureT0, setSourceCaptureT0] = useState(
    "Invoice #NG-2026-9042: Dangote Retail Depot owes NGN 4,850,000.00 due on 2026-09-20 via PayPulse payment rail."
  );
  const [extractedExcerpt, setExtractedExcerpt] = useState(
    "Dangote Retail Depot owes NGN 4,850,000.00 due on 2026-09-20"
  );
  const [promisedCents, setPromisedCents] = useState(485000000);
  const [observedCents, setObservedCents] = useState(150000000);

  const liveDecision = evaluateDeterministicKernel({
    caseId: "live-draft",
    sourceCaptureT0,
    extractedExcerpt,
    promisedCents,
    observedCents,
  });

  const getStatusLabel = (state: string) => {
    switch (state) {
      case "MATERIAL_DRIFT_DETECTED":
        return "Overdue Balance Pending";
      case "BENIGN_CONTROL_NO_DRIFT":
        return "Fully Settled & Reconciled";
      case "WAITING_TO_VERIFY":
        return "Awaiting Customer Payment";
      case "ABSTAIN_UNBOUND_EXCERPT":
        return "Line Item Text Mismatch";
      case "ABSTAIN_AMBIGUOUS_SOURCE":
        return "Unverified Order Reference";
      default:
        return "Reconciled";
    }
  };

  return (
    <DashboardShell project="PayPulse">
      <div className="flex flex-col gap-6">
        <div className="border-b border-[var(--border,#232b29)] pb-5">
          <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--accent,#059669)] font-semibold">
            Invoices &amp; Billing
          </span>
          <h1 className="mt-1 text-2xl font-semibold tracking-[-0.02em] text-[var(--fg,#e7f3ef)]">
            Create &amp; Schedule Invoice
          </h1>
          <p className="mt-1 max-w-3xl text-sm text-[var(--fg-muted,#8aa39a)]">
            Issue an official invoice to your customer, verify line items with exact kobo precision, and schedule automated WhatsApp and SMS payment reminders.
          </p>
        </div>

        <section className="rounded-lg border border-[var(--border,#232b29)] bg-[var(--surface,#121615)] p-6 shadow-sm">
          <div className="mb-3 font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--accent,#059669)] font-semibold">
            1. Issue New Customer Invoice
          </div>
          <NewRecordForm />
        </section>

        <section className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="flex flex-col gap-4 rounded-lg border border-[var(--border,#232b29)] bg-[var(--surface,#121615)] p-6 lg:col-span-7 shadow-sm">
            <div className="font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--fg-muted,#8aa39a)]">
              2. Line Item Verification &amp; Amount Calculation
            </div>

            <label className="flex flex-col gap-1.5 text-xs">
              <span className="font-medium text-[var(--fg,#e7f3ef)]">Invoice Description &amp; Customer Order Record</span>
              <textarea
                rows={3}
                value={sourceCaptureT0}
                onChange={(e) => setSourceCaptureT0(e.target.value)}
                className="rounded border border-[var(--border,#232b29)] bg-[var(--surface-raised,#171c1b)] p-2.5 font-mono text-xs text-[var(--fg,#e7f3ef)] focus:outline-none focus:border-[var(--accent,#059669)]"
              />
            </label>

            <label className="flex flex-col gap-1.5 text-xs">
              <span className="font-medium text-[var(--fg,#e7f3ef)]">Verified Line Item Text (Verbatim match from invoice)</span>
              <input
                type="text"
                value={extractedExcerpt}
                onChange={(e) => setExtractedExcerpt(e.target.value)}
                className="rounded border border-[var(--border,#232b29)] bg-[var(--surface-raised,#171c1b)] p-2.5 font-mono text-xs text-[var(--fg,#e7f3ef)] focus:outline-none focus:border-[var(--accent,#059669)]"
              />
            </label>

            <div className="grid grid-cols-2 gap-4">
              <label className="flex flex-col gap-1.5 text-xs">
                <span className="font-medium text-[var(--fg,#e7f3ef)]">Invoice Total (Integer Kobo)</span>
                <input
                  type="number"
                  value={promisedCents}
                  onChange={(e) => setPromisedCents(Number(e.target.value) || 0)}
                  className="rounded border border-[var(--border,#232b29)] bg-[var(--surface-raised,#171c1b)] p-2.5 font-mono text-xs text-[var(--fg,#e7f3ef)] tabular-nums focus:outline-none focus:border-[var(--accent,#059669)]"
                />
              </label>
              <label className="flex flex-col gap-1.5 text-xs">
                <span className="font-medium text-[var(--fg,#e7f3ef)]">Amount Received (Integer Kobo)</span>
                <input
                  type="number"
                  value={observedCents}
                  onChange={(e) => setObservedCents(Number(e.target.value) || 0)}
                  className="rounded border border-[var(--border,#232b29)] bg-[var(--surface-raised,#171c1b)] p-2.5 font-mono text-xs text-[var(--fg,#e7f3ef)] tabular-nums focus:outline-none focus:border-[var(--accent,#059669)]"
                />
              </label>
            </div>
          </div>

          <div className="flex flex-col justify-between gap-4 rounded-lg border border-[var(--border,#232b29)] bg-[var(--surface,#121615)] p-6 lg:col-span-5 shadow-sm">
            <div>
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--accent,#059669)] font-semibold">
                  Payment Status
                </span>
                <span
                  className={`rounded px-2 py-0.5 font-mono text-[11px] font-medium ${
                    liveDecision.excerptBound
                      ? "border border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                      : "border border-red-500/30 bg-red-500/10 text-red-400"
                  }`}
                >
                  {liveDecision.excerptBound ? "VERIFIED MATCH" : "TEXT MISMATCH"}
                </span>
              </div>
              <div className="mt-2 font-mono text-lg font-semibold text-[var(--fg,#e7f3ef)]">
                {getStatusLabel(liveDecision.state)}
              </div>
              <p className="mt-1 text-xs text-[var(--fg-muted,#8aa39a)]">{liveDecision.summary}</p>

              <div className="mt-4 divide-y divide-[var(--border,#232b29)] rounded border border-[var(--border,#232b29)] bg-[var(--surface-raised,#171c1b)]">
                {liveDecision.invariants.map((inv) => (
                  <div key={inv.id} className="flex items-center justify-between px-3 py-2 font-mono text-[11px]">
                    <span className="text-[var(--fg,#e7f3ef)]">
                      <strong>{inv.id}</strong> · {inv.name}
                    </span>
                    <span className={inv.passed ? "text-emerald-400 font-semibold" : "text-red-400 font-semibold"}>
                      {inv.passed ? "PASS" : "BLOCK"}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded border border-[var(--border,#232b29)] bg-[var(--surface-raised,#171c1b)] px-3 py-2 font-mono text-[11px] text-[var(--fg-muted,#8aa39a)]">
              <span>Outstanding Balance: ₦{((promisedCents - observedCents) / 100).toLocaleString("en-NG", { minimumFractionDigits: 2 })}</span>
            </div>
          </div>
        </section>
      </div>
    </DashboardShell>
  );
}
