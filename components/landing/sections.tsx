// components/landing/sections.tsx — the landing's building blocks. An archetype page is a
// composition of these; rearrange, drop or replace any of them for the product.
import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { DECISION_STATES, type LandingData } from "@/lib/landing";
import { fontVariables } from "./fonts";
import { EmptyFinding, FindingCard, Icon, type IconName } from "./primitives";

export function Frame({ d, children }: { d: LandingData; children: ReactNode }) {
  return (
    <div className={`lp ${fontVariables} flex min-h-screen w-full flex-col`} style={d.design.style as CSSProperties} data-design={d.design.preset}>
      {children}
    </div>
  );
}

export function Wordmark({ name }: { name: string }) {
  return (
    <span className="font-semibold tracking-tight text-[var(--ink,#e7f3ef)] text-base">
      {name}
    </span>
  );
}

export function Nav({ d }: { d: LandingData }) {
  return (
    <header className="sticky top-0 z-30 border-b lp-hair bg-[color-mix(in_oklab,var(--bg)_78%,transparent)] backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" className="lp-focus rounded-md">
          <Wordmark name={d.name} />
        </Link>
        <nav aria-label="Primary" className="flex items-center gap-1 text-sm text-[var(--muted)]">
          {d.steps.length ? <a href="#how" className="lp-focus hidden rounded-[var(--pill)] px-3 py-2 hover:text-[var(--ink)] sm:inline-flex">How it works</a> : null}
          <Link href="/demo" className="lp-focus hidden rounded-[var(--pill)] px-3 py-2 hover:text-[var(--ink)] sm:inline-flex">Walkthrough</Link>
          <Link href="/proof" className="lp-focus hidden rounded-[var(--pill)] px-3 py-2 hover:text-[var(--ink)] md:inline-flex">Proof</Link>
          <Link
            href="/dashboard"
            data-demo="launch-demo"
            className="group inline-flex items-center gap-2 pl-3.5 pr-1.5 py-1.5 rounded-full bg-[var(--accent,#059669)] hover:bg-[#047857] text-white text-xs font-medium tracking-tight transition-all active:scale-[0.98] shadow-sm ml-2 cursor-pointer"
          >
            <span>{d.cta}</span>
            <span className="w-5 h-5 rounded-full bg-[#033b2a] text-white flex items-center justify-center group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform shrink-0">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-3 h-3"
              >
                <line x1="7" y1="17" x2="17" y2="7" />
                <polyline points="7 7 17 7 17 17" />
              </svg>
            </span>
          </Link>
        </nav>
      </div>
    </header>
  );
}

/** Statements from brief.json landing.trust, plus the fixture check date when it ran. */
export function TrustRow({ d, className = "" }: { d: LandingData; className?: string }) {
  if (!d.trust.length) return null;
  return (
    <ul className={`flex flex-wrap gap-x-5 gap-y-2 text-xs sm:text-sm text-[var(--muted,#8aa39a)] ${className}`}>
      {d.trust.map((t) => (
        <li key={t} className="flex items-center gap-2">
          <span>{t}</span>
        </li>
      ))}
    </ul>
  );
}

function HeroCopy({ d, align = "left" }: { d: LandingData; align?: "left" | "center" }) {
  const center = align === "center";
  return (
    <div className={`flex flex-col gap-6 ${center ? "items-center text-center" : "items-start"}`}>
      <h1
        className={`lp-rise lp-display text-[clamp(3rem,7vw,5.75rem)] text-[var(--ink)] ${center ? "mx-auto" : ""}`}
        style={{ "--delay": "60ms" } as CSSProperties}
      >
        {d.name}
        {d.promise ? (
          <span className={`mt-3 block max-w-[20ch] text-[0.5em] leading-[1.08] text-[var(--muted)] ${center ? "mx-auto" : ""}`}>{d.promise}</span>
        ) : null}
      </h1>
      <div className={`lp-rise flex flex-wrap gap-3 ${center ? "justify-center" : ""}`} style={{ "--delay": "180ms" } as CSSProperties}>
        <Link
          href="/dashboard"
          data-demo="launch-demo"
          className="group inline-flex items-center justify-center gap-3 pl-5 sm:pl-6 pr-2 py-2 rounded-full bg-[var(--accent,#059669)] hover:bg-[#047857] text-white font-medium text-sm tracking-tight transition-all active:scale-[0.98] shadow-sm cursor-pointer"
        >
          <span>{d.cta}</span>
          <span className="w-7 h-7 rounded-full bg-[#033b2a] text-white flex items-center justify-center text-xs group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform shrink-0">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-3.5 h-3.5"
            >
              <line x1="7" y1="17" x2="17" y2="7" />
              <polyline points="7 7 17 7 17 17" />
            </svg>
          </span>
        </Link>
        <Link
          href="/demo"
          className="group inline-flex items-center justify-center gap-3 pl-5 pr-2 py-2 rounded-full bg-[var(--surface,#121615)] hover:bg-[#181f1c] text-[var(--ink,#e7f3ef)] border border-[var(--line,#232b29)] hover:border-[#34423e] font-medium text-sm tracking-tight transition-all active:scale-[0.98] cursor-pointer"
        >
          <span>Guided Walkthrough</span>
          <span className="w-7 h-7 rounded-full bg-[#1c2321] border border-[#2d3733] text-[#8aa39a] group-hover:text-white group-hover:border-[#3d4d47] flex items-center justify-center text-xs group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-3.5 h-3.5"
            >
              <line x1="7" y1="17" x2="17" y2="7" />
              <polyline points="7 7 17 7 17 17" />
            </svg>
          </span>
        </Link>
      </div>
      <TrustRow d={d} className={`lp-rise ${center ? "justify-center" : ""}`} />
    </div>
  );
}

/** The featured fixture case, shown as the product would show it. */
function FeaturedResult({ d, wide = false }: { d: LandingData; wide?: boolean }) {
  return (
    <div className={`lp-rise lp-card w-full ${wide ? "p-6 sm:p-10" : "p-5 sm:p-7"}`} style={{ "--delay": "240ms" } as CSSProperties}>
      {d.featured ? <FindingCard c={d.featured} persona={d.persona} /> : <EmptyFinding hint={d.setupHint} />}
    </div>
  );
}

/** The first screen. Its right-hand (or lower) half is a real result from the fixture. */
export function Hero({ d, layout = "split" }: { d: LandingData; layout?: "split" | "centered" | "editorial" }) {
  return (
    <section className="relative overflow-hidden">
      <div aria-hidden="true" className="lp-bloom pointer-events-none absolute inset-0" />
      <div className={`relative mx-auto w-full max-w-6xl px-4 pb-16 sm:px-6 sm:pb-24 ${layout === "split" ? "pt-14 sm:pt-24" : "pt-10 sm:pt-14"}`}>
        {layout === "split" ? (
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
            <HeroCopy d={d} />
            <FeaturedResult d={d} />
          </div>
        ) : layout === "centered" ? (
          <div className="flex flex-col items-center gap-10">
            <div className="max-w-3xl">
              <HeroCopy d={d} align="center" />
            </div>
            <div className="w-full max-w-3xl">
              <FeaturedResult d={d} />
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-10">
            <div className="max-w-4xl">
              <HeroCopy d={d} />
            </div>
            <FeaturedResult d={d} wide />
          </div>
        )}
      </div>
    </section>
  );
}

export function Section({
  id,
  label,
  eyebrow,
  aside,
  children,
  tone = "plain",
}: {
  id?: string;
  label?: string;
  eyebrow?: string;
  aside?: ReactNode;
  children: ReactNode;
  tone?: "plain" | "raised";
}) {
  return (
    <section
      id={id}
      className={`scroll-mt-20 border-t border-[var(--line,#232b29)] ${
        tone === "raised"
          ? "bg-[var(--surface,#121615)] border-b border-[var(--line,#232b29)]"
          : "bg-[var(--bg,#0a0d0c)]"
      }`}
    >
      <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
        {label || aside ? (
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4 sm:mb-10">
            <div>
              {eyebrow ? (
                <p className="mb-1 font-mono text-[11px] uppercase tracking-[0.14em] text-emerald-400">
                  {eyebrow}
                </p>
              ) : null}
              {label ? (
                <h2 className="lp-display text-2xl text-[var(--ink,#e7f3ef)] [text-wrap:balance] sm:text-3xl font-medium tracking-tight">
                  {label}
                </h2>
              ) : null}
            </div>
            {aside}
          </div>
        ) : null}
        {children}
      </div>
    </section>
  );
}

/** Counts of fixture cases per decision state — the only numbers this band can show. */
export function CountsBand({ d }: { d: LandingData }) {
  if (!d.cases.length) return null;
  const states = DECISION_STATES.filter((s) => d.counts[s] > 0);
  return (
    <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
      <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-[var(--radius)] border lp-hair bg-[var(--line)] sm:grid-cols-none sm:auto-cols-fr sm:grid-flow-col">
        <div className={`bg-[var(--surface)] px-5 py-5 ${states.length % 2 === 0 ? "col-span-2 sm:col-span-1" : ""}`}>
          <dt className="text-sm text-[var(--muted)]">Sample cases</dt>
          <dd className="lp-mono mt-1 text-3xl font-medium text-[var(--ink)]">{d.cases.length}</dd>
        </div>
        {states.map((s) => (
          <div key={s} className="bg-[var(--surface)] px-5 py-5" data-state={s}>
            <dt className="flex items-center gap-2 text-sm text-[var(--muted)]">
              <span className="lp-dot" />
              {d.stateLabels[s]}
            </dt>
            <dd className="lp-mono mt-1 text-3xl font-medium text-[var(--ink)]">{d.counts[s]}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

const STEP_ICON: Record<string, IconName> = { open: "open", click: "click", fill: "fill", wait: "wait" };

/** Hand-drawn SVG signal icons matching team3's crisp implementation */
function MobileStatusIcons() {
  return (
    <span className="ph-status-icons" aria-hidden="true">
      <svg viewBox="0 0 14 10" className="h-2 w-3 fill-current">
        <rect x="0" y="7" width="2.4" height="3" />
        <rect x="3.6" y="5" width="2.4" height="5" />
        <rect x="7.2" y="2.5" width="2.4" height="7.5" />
        <rect x="10.8" y="0" width="2.4" height="10" />
      </svg>
      <svg viewBox="0 0 20 10" className="h-2 w-3.5 fill-current">
        <rect x="0.6" y="0.6" width="15.5" height="8.8" rx="1.6" fill="none" strokeWidth="1.1" stroke="currentColor" />
        <rect x="2.2" y="2.2" width="10.5" height="5.6" rx="0.6" />
        <rect x="17.2" y="3.4" width="1.8" height="3.2" rx="0.6" />
      </svg>
    </span>
  );
}

function PhoneFrame({ children, label }: { children: ReactNode; label: string }) {
  return (
    <div className="phone" aria-label={label}>
      <div className="phone-screen">
        <div className="ph-status">
          <span className="ph-time">09:41</span>
          <MobileStatusIcons />
        </div>
        <span className="ph-notch" aria-hidden="true" />
        <div className="relative flex flex-1 flex-col p-2.5 overflow-hidden text-[10px]">
          {children}
        </div>
        <span className="ph-home" aria-hidden="true" />
      </div>
    </div>
  );
}

const JOURNEY_STEPS = [
  {
    step: "01",
    title: "Issue & Pin Invoice Hash",
    description: "Operator records vendor invoice with exact integer kobo totals and commits a deterministic SHA 256 hash.",
  },
  {
    step: "02",
    title: "Track Due Date Threshold",
    description: "The deterministic clock monitors net 14 payment terms, triggering an audit event the second a due date expires.",
  },
  {
    step: "03",
    title: "SendByte Automated Nudge",
    description: "Authenticated SendByte SMS and WhatsApp messages dispatch to the debtor with cryptographic delivery receipts.",
  },
  {
    step: "04",
    title: "Reconcile Integer Kobo Ledger",
    description: "Inbound bank transfer matches the integer kobo balance, transitioning invoice state to verified and cleared.",
  },
];

export function StepsRail({ d }: { d?: LandingData }) {
  return (
    <Section id="how" label="How it works">
      <div className="space-y-6">
        {/* Row of 4 Phones */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
          {/* Phone 1: Issue & Pin */}
          <PhoneFrame label="Invoice Created and Pinned">
            <div className="flex flex-col justify-between h-full">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between border-b border-[var(--line,#232b29)] pb-1">
                  <span className="font-mono text-[9px] font-bold text-emerald-400">PAYPULSE</span>
                  <span className="font-mono text-[8px] text-[var(--muted,#8aa39a)]">INV #8910</span>
                </div>
                <div className="rounded border border-[var(--line,#232b29)] bg-[var(--surface-raised,#171c1b)] p-1.5">
                  <p className="text-[9px] text-[var(--muted,#8aa39a)]">Debtor</p>
                  <p className="font-medium text-[var(--ink,#e7f3ef)]">Kazi Logistics Ltd</p>
                  <p className="font-mono text-[8px] text-[var(--muted,#8aa39a)]">Net 14 · Sep 15, 2026</p>
                </div>
                <div className="rounded border border-[var(--line,#232b29)] bg-[var(--surface-raised,#171c1b)] p-1.5">
                  <p className="text-[9px] text-[var(--muted,#8aa39a)]">Total Payable</p>
                  <p className="font-mono text-xs font-semibold text-[var(--ink,#e7f3ef)]">₦350,000.00</p>
                </div>
              </div>
              <div className="rounded border border-emerald-500/30 bg-emerald-500/10 p-1 text-center font-mono text-[8px] text-emerald-400">
                SHA 256 PINNED
              </div>
            </div>
          </PhoneFrame>

          {/* Phone 2: Threshold Breach */}
          <PhoneFrame label="Due Date Exceeded and Audit Trigger">
            <div className="flex flex-col justify-between h-full">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between border-b border-[var(--line,#232b29)] pb-1">
                  <span className="font-mono text-[9px] font-bold text-amber-400">CLOCK AUDIT</span>
                  <span className="font-mono text-[8px] text-amber-400">T+15 DAYS</span>
                </div>
                <div className="rounded border border-amber-500/30 bg-amber-500/10 p-1.5">
                  <p className="font-mono text-[8px] text-amber-400">DUE DATE BREACH</p>
                  <p className="text-[9px] text-[var(--ink,#e7f3ef)]">Payment overdue by 24h</p>
                </div>
                <div className="rounded border border-[var(--line,#232b29)] bg-[var(--surface-raised,#171c1b)] p-1.5 space-y-1">
                  <div className="flex justify-between font-mono text-[8px]">
                    <span className="text-[var(--muted,#8aa39a)]">Promised:</span>
                    <span className="text-[var(--ink,#e7f3ef)]">₦350,000.00</span>
                  </div>
                  <div className="flex justify-between font-mono text-[8px]">
                    <span className="text-[var(--muted,#8aa39a)]">Observed:</span>
                    <span className="text-amber-400">₦0.00</span>
                  </div>
                </div>
              </div>
              <div className="rounded border border-amber-500/30 bg-amber-500/10 p-1 text-center font-mono text-[8px] text-amber-400">
                DISPATCH QUEUED
              </div>
            </div>
          </PhoneFrame>

          {/* Phone 3: SendByte SMS & WhatsApp */}
          <PhoneFrame label="SendByte SMS and WhatsApp Reminder">
            <div className="flex flex-col justify-between h-full">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between border-b border-[var(--line,#232b29)] pb-1">
                  <span className="font-mono text-[9px] font-bold text-emerald-400">SENDBYTE</span>
                  <span className="font-mono text-[8px] text-emerald-400">SMS / WHATSAPP</span>
                </div>
                <div className="rounded-lg border border-[var(--line,#232b29)] bg-[var(--surface-raised,#171c1b)] p-2 space-y-1 text-[8px] leading-tight">
                  <p className="font-semibold text-emerald-400">PayPulse Reminder</p>
                  <p className="text-[var(--ink,#e7f3ef)]">
                    Payment of ₦350,000.00 for Inv #8910 is due to Kazi Logistics.
                  </p>
                  <p className="font-mono text-[7px] text-emerald-400">paypulse.ng/8910</p>
                </div>
                <div className="rounded border border-[var(--line,#232b29)] bg-[var(--surface-raised,#171c1b)] p-1 text-[8px] text-[var(--muted,#8aa39a)]">
                  Sabilytics telemetry: Client opened link
                </div>
              </div>
              <div className="rounded border border-emerald-500/30 bg-emerald-500/10 p-1 text-center font-mono text-[8px] text-emerald-400">
                DELIVERED 09:41 · VERIFIED
              </div>
            </div>
          </PhoneFrame>

          {/* Phone 4: Instant Settlement & Reconcile */}
          <PhoneFrame label="Instant Reconciliation">
            <div className="flex flex-col justify-between h-full">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between border-b border-[var(--line,#232b29)] pb-1">
                  <span className="font-mono text-[9px] font-bold text-emerald-400">SETTLED</span>
                  <span className="font-mono text-[8px] text-emerald-400">0 KOBO DRIFT</span>
                </div>
                <div className="rounded border border-emerald-500/30 bg-emerald-500/10 p-1.5 text-center">
                  <p className="font-mono text-[8px] text-emerald-400">FULL SETTLEMENT</p>
                  <p className="font-mono text-xs font-bold text-white">₦350,000.00</p>
                </div>
                <div className="rounded border border-[var(--line,#232b29)] bg-[var(--surface-raised,#171c1b)] p-1.5 font-mono text-[8px] space-y-0.5">
                  <p className="text-[var(--muted,#8aa39a)]">Ref: NIP 2026 8910</p>
                  <p className="text-emerald-400">Balance: ₦0.00</p>
                </div>
              </div>
              <div className="rounded border border-emerald-500/30 bg-emerald-500/10 p-1 text-center font-mono text-[8px] text-emerald-400">
                RECONCILED IN KERNEL
              </div>
            </div>
          </PhoneFrame>
        </div>

        {/* Captions Under the Phones */}
        <div className="grid grid-cols-1 gap-4 pt-4 sm:grid-cols-2 md:grid-cols-4">
          {JOURNEY_STEPS.map((s) => (
            <div key={s.step} className="border-t border-[var(--line,#232b29)] pt-3">
              <span className="font-mono text-xs font-semibold text-emerald-400">{s.step}</span>
              <h3 className="mt-1 text-sm font-medium text-[var(--ink,#e7f3ef)] [text-wrap:balance]">{s.title}</h3>
              <p className="mt-1 text-xs leading-relaxed text-[var(--muted,#8aa39a)] [text-wrap:pretty]">{s.description}</p>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}

/** Architectural Guarantees Grid (3 Pillars) */
export function ArchitecturalPillars() {
  const pillars = [
    {
      tag: "FINANCIAL PRECISION",
      title: "Integer Kobo Arithmetic",
      description: "Deterministic plain functions calculate balances down to the individual Nigerian kobo. Never trust floating point math with money or tax reconciliations.",
      stat: "0 Rounding Drift",
    },
    {
      tag: "DISPATCH RAILS",
      title: "SendByte Automated Reminders",
      description: "Authenticated SMS and WhatsApp payment notifications with cryptographic dispatch logging, automated backoff, and idempotent deduplication.",
      stat: "Dual Channel Delivery",
    },
    {
      tag: "CLIENT AUDIT",
      title: "Sabilytics Read Telemetry",
      description: "Privacy preserving client invoice view telemetry. Know exactly when the debtor opened the payment link before payment term threshold breaches.",
      stat: "Real Time Read Receipts",
    },
  ];

  return (
    <Section label="Deterministic Architecture">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {pillars.map((p) => (
          <div
            key={p.title}
            className="flex flex-col justify-between rounded-lg border border-[var(--line,#232b29)] bg-[var(--surface,#121615)] p-6 transition-colors hover:border-emerald-500/40"
          >
            <div>
              <p className="font-mono text-[10px] uppercase tracking-wider text-emerald-400">{p.tag}</p>
              <h3 className="mt-2 text-lg font-medium text-[var(--ink,#e7f3ef)] [text-wrap:balance]">{p.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--muted,#8aa39a)] [text-wrap:pretty]">{p.description}</p>
            </div>
            <div className="mt-6 border-t border-[var(--line,#232b29)] pt-4">
              <span className="font-mono text-xs text-emerald-400">{p.stat}</span>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}

/** Automated SME Cashflow Recovery Lifecycle */
export function SponsorsSection() {
  const phases = [
    {
      step: "01",
      title: "Invoice Generation & Hash Lock",
      timing: "T-0 Days",
      description: "Generates digital PDF with QR code and SendByte SMS/WhatsApp deep link. Exact integer kobo amounts committed to tamper-proof SQLite database.",
      stat: "0.00ms arithmetic drift",
    },
    {
      step: "02",
      title: "Client Read Telemetry",
      timing: "T+2 Days",
      description: "Sabilytics telemetry logs exact debtor open timestamps when invoice link is viewed on mobile, eliminating 'I never received it' payment excuses.",
      stat: "Verifiable view receipt",
    },
    {
      step: "03",
      title: "Automated Multichannel Escalation",
      timing: "T+5 Days",
      description: "Upon due date breach, the deterministic kernel dispatches scheduled WhatsApp and SMS reminders with live Paystack settlement buttons.",
      stat: "74% faster collection",
    },
    {
      step: "04",
      title: "Cryptographic Settlement & Close",
      timing: "Instant",
      description: "Incoming payment webhook reconciles kobo ledger in real time, generates downloadable SHA-256 settlement receipt, and closes overdue flag.",
      stat: "100% audited integrity",
    },
  ];

  return (
    <Section label="Automated Cashflow Recovery Lifecycle" tone="raised">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {phases.map((p) => (
          <div
            key={p.step}
            className="flex flex-col justify-between rounded-lg border border-[var(--line,#232b29)] bg-[var(--surface,#121615)] p-5 transition-colors hover:border-emerald-500/40"
          >
            <div>
              <div className="flex items-center justify-between font-mono text-[11px]">
                <span className="text-emerald-400 font-bold">{p.step}</span>
                <span className="text-[var(--muted,#8aa39a)]">{p.timing}</span>
              </div>
              <h3 className="mt-3 text-base font-semibold text-[var(--ink,#e7f3ef)] [text-wrap:balance]">{p.title}</h3>
              <p className="mt-2 text-xs leading-relaxed text-[var(--muted,#8aa39a)] [text-wrap:pretty]">{p.description}</p>
            </div>
            <div className="mt-5 border-t border-[var(--line,#232b29)] pt-3">
              <span className="font-mono text-[11px] text-emerald-400">{p.stat}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-lg border border-[var(--line,#232b29)] bg-[var(--surface,#121615)]/60 px-5 py-3 text-xs text-[var(--muted,#8aa39a)] font-mono">
        <span>VERIFIED INFRASTRUCTURE: SendByte SMS/WhatsApp • Sabilytics Telemetry • Pxxl Lagos Edge</span>
        <Link href="/dashboard/sponsors" className="text-emerald-400 hover:text-emerald-300 transition-colors">
          Inspect Sponsor Telemetry &rarr;
        </Link>
      </div>
    </Section>
  );
}

/** Technical Moat: Code Decides, Models Suggest */
export function MoatComparison() {
  return (
    <Section label="Technical Moat: Code Decides, Models Suggest">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-lg border border-[var(--line,#232b29)] bg-[var(--surface,#121615)] p-6">
          <p className="font-mono text-xs uppercase tracking-wider text-red-400">Standard Invoicing Tools</p>
          <ul className="mt-4 space-y-3 text-sm text-[var(--muted,#8aa39a)]">
            <li className="flex items-start gap-2.5">
              <span className="text-red-400 font-mono">✕</span>
              <span>Floating point calculations introduce rounding errors in tax and kobo totals</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="text-red-400 font-mono">✕</span>
              <span>Manual payment chasing across unrecorded WhatsApp chats with zero audit history</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="text-red-400 font-mono">✕</span>
              <span>Opaque reminder deliveries with no proof whether the debtor ever received notice</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="text-red-400 font-mono">✕</span>
              <span>Proprietary cloud locks preventing independent verification of ledger records</span>
            </li>
          </ul>
        </div>

        <div className="rounded-lg border border-emerald-500/40 bg-[var(--surface,#121615)] p-6 ring-1 ring-emerald-500/20">
          <p className="font-mono text-xs uppercase tracking-wider text-emerald-400">PayPulse Deterministic Kernel</p>
          <ul className="mt-4 space-y-3 text-sm text-[var(--ink,#e7f3ef)]">
            <li className="flex items-start gap-2.5">
              <span className="text-emerald-400 font-mono">✓</span>
              <span>Integer kobo precision guarantees zero floating point arithmetic error</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="text-emerald-400 font-mono">✓</span>
              <span>Automated SendByte SMS and WhatsApp escalation upon payment threshold breach</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="text-emerald-400 font-mono">✓</span>
              <span>Sabilytics read telemetry records exact client open timestamps before due dates</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="text-emerald-400 font-mono">✓</span>
              <span>Offline SHA 256 receipts verifiable in terminal or browser without credentials</span>
            </li>
          </ul>
        </div>
      </div>
    </Section>
  );
}

/** Closing Call-to-Action — Oculupi styled closing section */
export function ClosingCTA({ d }: { d: LandingData }) {
  return (
    <section className="relative overflow-hidden border-t border-[var(--line,#232b29)] bg-[var(--surface,#121615)] py-10 md:py-14">
      <div className="relative mx-auto max-w-3xl px-4 sm:px-6 text-center space-y-4">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[var(--ink,#e7f3ef)] leading-tight">
          Deterministic invoice recovery for African SMEs.
        </h2>
        <p className="mx-auto max-w-md text-sm leading-relaxed text-[var(--muted,#8aa39a)]">
          Audit proof invoice ledgers, automated WhatsApp escalation, and independent cryptographic settlement.
        </p>
        <div className="pt-2 flex items-center justify-center">
          <Link
            href="/dashboard"
            data-demo="launch-demo"
            className="group inline-flex items-center justify-center gap-3 pl-6 pr-2 py-2.5 rounded-full bg-[var(--accent,#059669)] hover:bg-[#047857] text-white font-medium text-sm tracking-tight transition-all active:scale-[0.98] shadow-sm cursor-pointer"
          >
            <span>{d.cta}</span>
            <span className="w-7 h-7 rounded-full bg-[#033b2a] text-white flex items-center justify-center text-xs group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform shrink-0">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-3.5 h-3.5"
              >
                <line x1="7" y1="17" x2="17" y2="7" />
                <polyline points="7 7 17 7 17 17" />
              </svg>
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}

export function Problem({ d }: { d: LandingData }) {
  return null;
}

export function PreFooterCTA({ d }: { d: LandingData }) {
  return null;
}

/** One sentence on what the product does not do (removed). */
export function Boundary({ d }: { d: LandingData }) {
  return null;
}

export function Footer({ d }: { d: LandingData }) {
  return (
    <footer className="mt-auto border-t border-[var(--line,#232b29)] py-5 text-xs text-[var(--muted,#8aa39a)]">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 sm:px-6">
        <Wordmark name={d.name} />
        <span>&copy; {new Date().getFullYear()} PayPulse. All rights reserved.</span>
      </div>
    </footer>
  );
}
