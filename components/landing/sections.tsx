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
    <span className="flex items-center gap-2.5 font-medium tracking-tight text-[var(--ink)]">
      <span aria-hidden="true" className="grid grid-cols-1 h-7 w-7 place-items-center rounded-[calc(var(--radius-sm)*0.8)] bg-[var(--accent)] text-sm font-medium text-white">
        {name.slice(0, 1).toUpperCase()}
      </span>
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
          <Link href="/dashboard" data-demo="launch-demo" className="lp-btn lp-btn-sm lp-btn-quiet ml-2">
            {d.cta}
          </Link>
        </nav>
      </div>
    </header>
  );
}

/** Statements from brief.json landing.trust, plus the fixture check date when it ran. */
export function TrustRow({ d, className = "" }: { d: LandingData; className?: string }) {
  if (!d.trust.length && !d.checkedAt) return null;
  return (
    <ul className={`flex flex-wrap gap-x-5 gap-y-2 text-sm text-[var(--muted)] ${className}`}>
      {d.trust.map((t) => (
        <li key={t} className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" aria-hidden="true" />
          <span>{t}</span>
        </li>
      ))}
      {d.checkedAt ? (
        <li>
          <Link href="/proof" className="lp-focus flex items-center gap-2 rounded hover:text-[var(--ink)]">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" aria-hidden="true" />
            <span>Checked <span className="lp-mono">{d.checkedAt}</span></span>
          </Link>
        </li>
      ) : null}
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
      {d.idea ? (
        <p className={`lp-rise lp-pretty max-w-[48ch] text-lg leading-relaxed text-[var(--muted)] ${center ? "mx-auto" : ""}`} style={{ "--delay": "120ms" } as CSSProperties}>
          {d.idea}
        </p>
      ) : null}
      <div className={`lp-rise flex flex-wrap gap-3 ${center ? "justify-center" : ""}`} style={{ "--delay": "180ms" } as CSSProperties}>
        <Link href="/dashboard" data-demo="launch-demo" className="lp-btn bg-[var(--accent,#059669)] text-white hover:bg-[#047857] transition-colors">
          {d.cta} &rarr;
        </Link>
        <Link href="/demo" className="lp-btn lp-btn-quiet">
          Guided Walkthrough &rarr;
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
  aside,
  children,
  tone = "plain",
}: {
  id?: string;
  label?: string;
  aside?: ReactNode;
  children: ReactNode;
  tone?: "plain" | "raised";
}) {
  return (
    <section id={id} className={`scroll-mt-20 ${tone === "raised" ? "border-y lp-hair bg-[var(--raised)]" : ""}`}>
      <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
        {label || aside ? (
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4 sm:mb-10">
            {label ? <h2 className="lp-display text-3xl text-[var(--ink)] sm:text-4xl">{label}</h2> : <span />}
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

/** The demo path from docs/demo-path.json, as a step rail. */
export function StepsRail({ d, layout = "row" }: { d: LandingData; layout?: "row" | "column" }) {
  if (!d.steps.length) return null;
  return (
    <Section id="how" label="How it works">
      <ol className={`grid grid-cols-1 gap-3 ${layout === "row" ? "sm:grid-cols-2 lg:grid-cols-none lg:auto-cols-fr lg:grid-flow-col" : "max-w-2xl"}`}>
        {d.steps.map((s, i) => (
          <li key={s.say + i} className="flex items-start gap-3 border-t-2 lp-hair pt-4">
            <span className="grid grid-cols-1 h-9 w-9 flex-none place-items-center rounded-[var(--pill)] bg-[color-mix(in_oklab,var(--accent)_12%,transparent)] text-[var(--accent)]">
              <Icon name={STEP_ICON[s.kind] ?? "arrow"} />
            </span>
            <span className="flex flex-col gap-1">
              <span className="lp-mono text-sm text-[var(--muted)]">{i + 1}</span>
              <span className="text-base font-medium leading-snug text-[var(--ink)]">{s.say}</span>
            </span>
          </li>
        ))}
      </ol>
    </Section>
  );
}

/** The painful moment from the wedge brief, when there is one. */
export function Problem({ d }: { d: LandingData }) {
  if (!d.problem) return null;
  return (
    <Section tone="raised">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[200px_1fr]">
        <p className="text-sm font-medium text-[var(--muted)]">Why it matters</p>
        <p className="lp-display lp-pretty text-2xl text-[var(--ink)] sm:text-4xl">{d.problem}</p>
      </div>
    </Section>
  );
}

/** One sentence on what the product does not do (removed). */
export function Boundary({ d }: { d: LandingData }) {
  return null;
}

export function Footer({ d }: { d: LandingData }) {
  return (
    <footer className="mt-auto border-t border-[var(--line,#232b29)] py-4">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 text-xs text-[var(--muted,#8aa39a)] sm:px-6">
        <div className="flex items-center gap-3">
          <Wordmark name={d.name} />
          <span className="hidden text-[var(--line,#232b29)] sm:inline">|</span>
          <span className="hidden sm:inline">&copy; {new Date().getFullYear()} PayPulse. All rights reserved.</span>
        </div>
        <div className="flex items-center gap-6">
          <Link href="/proof" className="transition-colors hover:text-[var(--ink,#e7f3ef)]">Proof</Link>
          <Link href="/verify" className="transition-colors hover:text-[var(--ink,#e7f3ef)]">Verify</Link>
          <Link href="/dashboard" className="font-medium text-[var(--accent,#059669)] hover:underline">
            {d.cta} &rarr;
          </Link>
        </div>
      </div>
    </footer>
  );
}
