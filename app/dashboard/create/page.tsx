"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { DashboardShell } from "@/components/dashboard-shell";
import { createCustomerInvoiceAction } from "@/app/actions";
import { evaluateDeterministicKernel } from "@/lib/kernel";

export default function CreateInvoicePage() {
  const [customerName, setCustomerName] = useState("Dangote Retail Depot");
  const [customerPhone, setCustomerPhone] = useState("+234 803 492 1102");
  const [customerLocation, setCustomerLocation] = useState("Ikeja Industrial Estate, Lagos");
  const [commodity, setCommodity] = useState("50kg Portland Grade Limestone Cement");
  const [totalNaira, setTotalNaira] = useState("4,850,000.00");
  const [amountReceivedNaira, setAmountReceivedNaira] = useState("1,500,000.00");
  const [dueDate, setDueDate] = useState("2026-10-14");
  const [channel, setChannel] = useState<"WhatsApp" | "SMS">("WhatsApp");

  const [isPending, startTransition] = useTransition();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Parse kobo integers
  const parseNairaToKobo = (val: string) => {
    const clean = val.replace(/,/g, "").trim();
    const num = parseFloat(clean);
    return isNaN(num) ? 0 : Math.round(num * 100);
  };

  const promisedCents = parseNairaToKobo(totalNaira);
  const observedCents = parseNairaToKobo(amountReceivedNaira);

  const sourceCaptureT0 = `Invoice #${customerName.slice(0, 3).toUpperCase()}-2026: ${customerName} owes NGN ${totalNaira} due on ${dueDate} for ${commodity}.`;
  const extractedExcerpt = `${customerName} owes NGN ${totalNaira} due on ${dueDate}`;

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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const formData = new FormData();
    formData.set("customerName", customerName);
    formData.set("customerPhone", customerPhone);
    formData.set("customerLocation", customerLocation);
    formData.set("commodity", commodity);
    formData.set("amountKobo", String(promisedCents));
    formData.set("dueDate", dueDate);
    formData.set("channel", channel);

    startTransition(async () => {
      const res = await createCustomerInvoiceAction(formData);
      if (res.ok) {
        setSuccessMessage(`Invoice for ${customerName} (₦${totalNaira}) created and committed to database!`);
      } else {
        setErrorMessage(res.error ?? "Failed to save invoice");
      }
    });
  };

  return (
    <DashboardShell project="PayPulse">
      <div className="flex flex-col gap-6">
        {/* Header */}
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

        {/* Notifications */}
        {successMessage ? (
          <div className="flex items-center justify-between rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-400">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-emerald-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              <span>{successMessage}</span>
            </div>
            <Link
              href="/dashboard/items"
              className="inline-flex items-center gap-1 font-mono text-xs font-semibold text-white underline hover:text-emerald-300"
            >
              View in Invoices &amp; Ledger →
            </Link>
          </div>
        ) : null}

        {errorMessage ? (
          <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400">
            {errorMessage}
          </div>
        ) : null}

        {/* Main Grid: Form on Left, Kernel Verification on Right */}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Left Column: Form Fields */}
          <div className="flex flex-col gap-4 rounded-lg border border-[var(--border,#232b29)] bg-[var(--surface,#121615)] p-6 lg:col-span-7 shadow-sm">
            <div className="font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--fg-muted,#8aa39a)]">
              1. Customer &amp; Order Details
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="flex flex-col gap-1.5 text-xs">
                <span className="font-medium text-[var(--fg,#e7f3ef)]">Customer / Merchant Name</span>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="rounded border border-[var(--border,#232b29)] bg-[var(--surface-raised,#171c1b)] p-2.5 font-medium text-xs text-[var(--fg,#e7f3ef)] focus:outline-none focus:border-[var(--accent,#059669)]"
                  placeholder="e.g. Dangote Retail Depot"
                />
              </label>

              <label className="flex flex-col gap-1.5 text-xs">
                <span className="font-medium text-[var(--fg,#e7f3ef)]">Recipient Mobile Number</span>
                <input
                  type="text"
                  required
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="rounded border border-[var(--border,#232b29)] bg-[var(--surface-raised,#171c1b)] p-2.5 font-mono text-xs text-[var(--fg,#e7f3ef)] focus:outline-none focus:border-[var(--accent,#059669)]"
                  placeholder="+234 803 000 0000"
                />
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="flex flex-col gap-1.5 text-xs">
                <span className="font-medium text-[var(--fg,#e7f3ef)]">Trading Market / Location</span>
                <input
                  type="text"
                  value={customerLocation}
                  onChange={(e) => setCustomerLocation(e.target.value)}
                  className="rounded border border-[var(--border,#232b29)] bg-[var(--surface-raised,#171c1b)] p-2.5 text-xs text-[var(--fg,#e7f3ef)] focus:outline-none focus:border-[var(--accent,#059669)]"
                  placeholder="e.g. Ikeja Industrial Estate, Lagos"
                />
              </label>

              <label className="flex flex-col gap-1.5 text-xs">
                <span className="font-medium text-[var(--fg,#e7f3ef)]">Reminder Channel</span>
                <select
                  value={channel}
                  onChange={(e) => setChannel(e.target.value as "WhatsApp" | "SMS")}
                  className="rounded border border-[var(--border,#232b29)] bg-[var(--surface-raised,#171c1b)] p-2.5 text-xs text-[var(--fg,#e7f3ef)] focus:outline-none focus:border-[var(--accent,#059669)]"
                >
                  <option value="WhatsApp">SendByte WhatsApp</option>
                  <option value="SMS">SendByte SMS</option>
                </select>
              </label>
            </div>

            <label className="flex flex-col gap-1.5 text-xs">
              <span className="font-medium text-[var(--fg,#e7f3ef)]">Commodity / Consignment Line Item</span>
              <input
                type="text"
                required
                value={commodity}
                onChange={(e) => setCommodity(e.target.value)}
                className="rounded border border-[var(--border,#232b29)] bg-[var(--surface-raised,#171c1b)] p-2.5 text-xs text-[var(--fg,#e7f3ef)] focus:outline-none focus:border-[var(--accent,#059669)]"
                placeholder="e.g. 50kg Portland Grade Limestone Cement"
              />
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
              <label className="flex flex-col gap-1.5 text-xs">
                <span className="font-medium text-[var(--fg,#e7f3ef)]">Total Amount (₦)</span>
                <input
                  type="text"
                  required
                  value={totalNaira}
                  onChange={(e) => setTotalNaira(e.target.value)}
                  className="rounded border border-[var(--border,#232b29)] bg-[var(--surface-raised,#171c1b)] p-2.5 font-mono text-xs text-[var(--fg,#e7f3ef)] tabular-nums focus:outline-none focus:border-[var(--accent,#059669)]"
                  placeholder="4,850,000.00"
                />
              </label>

              <label className="flex flex-col gap-1.5 text-xs">
                <span className="font-medium text-[var(--fg,#e7f3ef)]">Initial Payment Received (₦)</span>
                <input
                  type="text"
                  value={amountReceivedNaira}
                  onChange={(e) => setAmountReceivedNaira(e.target.value)}
                  className="rounded border border-[var(--border,#232b29)] bg-[var(--surface-raised,#171c1b)] p-2.5 font-mono text-xs text-[var(--fg,#e7f3ef)] tabular-nums focus:outline-none focus:border-[var(--accent,#059669)]"
                  placeholder="0.00"
                />
              </label>

              <label className="flex flex-col gap-1.5 text-xs">
                <span className="font-medium text-[var(--fg,#e7f3ef)]">Payment Due Date</span>
                <input
                  type="date"
                  required
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="rounded border border-[var(--border,#232b29)] bg-[var(--surface-raised,#171c1b)] p-2.5 font-mono text-xs text-[var(--fg,#e7f3ef)] focus:outline-none focus:border-[var(--accent,#059669)]"
                />
              </label>
            </div>

            <div className="pt-3 border-t border-[var(--border,#232b29)]">
              <button
                type="submit"
                disabled={isPending}
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-6 rounded-lg bg-[var(--accent,#059669)] hover:bg-[#047857] text-white font-medium text-sm transition-all duration-150 active:scale-[0.98] disabled:opacity-50 cursor-pointer shadow-sm"
              >
                {isPending ? "Persisting to Database..." : "Save & Issue Invoice"}
              </button>
            </div>
          </div>

          {/* Right Column: Deterministic Kernel Audit Preview */}
          <div className="flex flex-col justify-between gap-4 rounded-lg border border-[var(--border,#232b29)] bg-[var(--surface,#121615)] p-6 lg:col-span-5 shadow-sm">
            <div>
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--accent,#059669)] font-semibold">
                  Payment Status Preview
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

            <div className="space-y-2 pt-4 border-t border-[var(--border,#232b29)]">
              <div className="flex justify-between font-mono text-xs">
                <span className="text-[var(--fg-muted,#8aa39a)]">Total Invoice Kobo:</span>
                <span className="text-[var(--fg,#e7f3ef)] tabular-nums">{promisedCents.toLocaleString()} kobo</span>
              </div>
              <div className="flex justify-between font-mono text-xs">
                <span className="text-[var(--fg-muted,#8aa39a)]">Received Kobo:</span>
                <span className="text-emerald-400 tabular-nums">{observedCents.toLocaleString()} kobo</span>
              </div>
              <div className="flex justify-between font-mono text-xs font-semibold pt-1 border-t border-[var(--border,#232b29)]">
                <span className="text-[var(--fg,#e7f3ef)]">Outstanding Balance:</span>
                <span className="text-amber-400 tabular-nums">
                  ₦{((promisedCents - observedCents) / 100).toLocaleString("en-NG", { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>
        </form>
      </div>
    </DashboardShell>
  );
}
