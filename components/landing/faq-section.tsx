"use client";

import { useState } from "react";

interface FaqItem {
  q: string;
  a: string;
}

const FAQS: FaqItem[] = [
  {
    q: "How does PayPulse prevent duplicate reminder spam to customers?",
    a: "SendByte delivery deduplication gates reminders behind an automated cooldown window. Once an SMS or WhatsApp alert is dispatched, subsequent notifications are held until verified read telemetry or 48 hours elapse, preventing customer harassment.",
  },
  {
    q: "Why integer kobo arithmetic instead of standard decimal numbers?",
    a: "Floating point math introduces rounding errors over millions of transactions. PayPulse stores and computes every invoice and payment in exact integer kobo (1 Naira = 100 kobo), guaranteeing zero discrepancy down to the last kobo.",
  },
  {
    q: "What happens when a customer pays via direct bank transfer?",
    a: "PayPulse reconciles incoming NIBSS bank credits against open invoice reference IDs. The invoice is automatically flagged as Reconciled, and scheduled payment reminders are terminated immediately.",
  },
  {
    q: "Does PayPulse work offline if connectivity drops?",
    a: "Yes. Offline evaluation mode enables merchants and auditors to review committed invoice records, verify calculation invariants, and inspect payment receipts locally without requiring an active internet connection.",
  },
  {
    q: "What delivery channels are supported for payment reminders?",
    a: "PayPulse dispatches official payment notices via SendByte WhatsApp and SMS across major African mobile networks (MTN, Airtel, Glo, 9mobile, Safaricom) with verified delivery receipts and read timestamps.",
  },
  {
    q: "Can I export audited records for company tax filing or accounting?",
    a: "Yes. Every invoice and settlement generates an official audit record with exact timestamps, line item references, and bank settlement verification details exportable directly to CSV or PDF.",
  },
];

export function FaqSection() {
  const [openIndices, setOpenIndices] = useState<number[]>([0]);

  const toggleIndex = (idx: number) => {
    setOpenIndices((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };

  const col1 = FAQS.slice(0, 3);
  const col2 = FAQS.slice(3, 6);

  const renderFaqItem = (faq: FaqItem, globalIdx: number) => {
    const isOpen = openIndices.includes(globalIdx);
    return (
      <div
        key={faq.q}
        className={`transition-colors ${
          isOpen ? "bg-[#121615]" : "hover:bg-[#121615]/50"
        }`}
      >
        <button
          type="button"
          onClick={() => toggleIndex(globalIdx)}
          className="flex w-full items-start justify-between gap-3 p-4 sm:p-5 text-left transition-colors cursor-pointer"
          aria-expanded={isOpen}
        >
          <div className="flex items-start gap-3">
            <span className="font-mono text-xs text-[#52665f] font-semibold select-none shrink-0 pt-0.5">
              {String(globalIdx + 1).padStart(2, "0")}
            </span>
            <span className="text-xs sm:text-sm font-semibold tracking-tight text-[var(--ink,#e7f3ef)] [text-wrap:pretty]">
              {faq.q}
            </span>
          </div>
          <span
            className={`flex h-5 w-5 items-center justify-center rounded-full border text-xs font-mono transition-transform duration-200 shrink-0 mt-0.5 ${
              isOpen
                ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-400 rotate-45"
                : "border-[var(--line,#232b29)] bg-[#1c2321] text-[#8aa39a]"
            }`}
          >
            +
          </span>
        </button>
        {isOpen && (
          <div className="px-4 pb-4 sm:px-5 sm:pb-5 pt-0 text-xs text-[var(--muted,#8aa39a)] leading-relaxed border-t border-[var(--line,#232b29)]/60">
            <div className="pt-2.5 pl-6 sm:pl-7">{faq.a}</div>
          </div>
        )}
      </div>
    );
  };

  return (
    <section className="relative overflow-hidden border-t border-[var(--line,#232b29)] bg-[var(--surface,#121615)] py-16 sm:py-24">
      <div className="mx-auto w-full max-w-5xl px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center space-y-3 mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-[var(--ink,#e7f3ef)]">
            Frequently asked questions.
          </h2>
          <p className="max-w-xl text-xs sm:text-sm text-[var(--muted,#8aa39a)] leading-relaxed">
            Concrete answers on payment recovery, SendByte delivery gating, integer kobo arithmetic, and bank reconciliation.
          </p>
        </div>

        {/* Two Column Group */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 items-start">
          {/* Column 1 Group (01 - 03) */}
          <div className="divide-y divide-[var(--line,#232b29)] rounded-xl border border-[var(--line,#232b29)] bg-[#0a0d0c] overflow-hidden shadow-sm">
            {col1.map((faq, i) => renderFaqItem(faq, i))}
          </div>

          {/* Column 2 Group (04 - 06) */}
          <div className="divide-y divide-[var(--line,#232b29)] rounded-xl border border-[var(--line,#232b29)] bg-[#0a0d0c] overflow-hidden shadow-sm">
            {col2.map((faq, i) => renderFaqItem(faq, i + 3))}
          </div>
        </div>
      </div>
    </section>
  );
}
