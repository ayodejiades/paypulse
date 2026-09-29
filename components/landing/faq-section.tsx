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
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="relative overflow-hidden border-t border-[var(--line,#232b29)] bg-[var(--surface,#121615)] py-16 sm:py-24">
      <div className="mx-auto w-full max-w-4xl px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center space-y-3 mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-[var(--ink,#e7f3ef)]">
            Frequently asked questions.
          </h2>
          <p className="max-w-xl text-xs sm:text-sm text-[var(--muted,#8aa39a)] leading-relaxed">
            Concrete answers on payment recovery, SendByte delivery gating, integer kobo arithmetic, and bank reconciliation.
          </p>
        </div>

        {/* Accordion List */}
        <div className="divide-y divide-[var(--line,#232b29)] rounded-xl border border-[var(--line,#232b29)] bg-[#0a0d0c] overflow-hidden shadow-sm">
          {FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={faq.q}
                className={`transition-colors ${
                  isOpen ? "bg-[#121615]" : "hover:bg-[#121615]/50"
                }`}
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="flex w-full items-center justify-between gap-4 p-5 sm:p-6 text-left transition-colors cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <div className="flex items-center gap-3.5">
                    <span className="font-mono text-xs text-[#52665f] font-semibold select-none shrink-0">
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                    <span className="text-sm sm:text-[15px] font-semibold tracking-tight text-[var(--ink,#e7f3ef)]">
                      {faq.q}
                    </span>
                  </div>
                  <span
                    className={`flex h-6 w-6 items-center justify-center rounded-full border text-xs font-mono transition-transform duration-200 shrink-0 ${
                      isOpen
                        ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-400 rotate-45"
                        : "border-[var(--line,#232b29)] bg-[#1c2321] text-[#8aa39a]"
                    }`}
                  >
                    +
                  </span>
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 sm:px-6 sm:pb-6 pt-0 text-xs sm:text-sm text-[var(--muted,#8aa39a)] leading-relaxed border-t border-[var(--line,#232b29)]/60">
                    <div className="pt-3.5 pl-7 sm:pl-8">{faq.a}</div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
