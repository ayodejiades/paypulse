"use client";

// components/landing/sample-desk.tsx — the one-click sample. "Try a sample" loads the
// synthetic fixture cases into the product's core screen; "Reset" puts it back. Each
// archetype picks a view; every value shown comes from the cases passed in.
import { useCallback, useEffect, useMemo, useState, type CSSProperties, type ReactNode } from "react";
import type { DecisionState, DemoStep, LandingData, SampleCase } from "@/lib/landing";
import { FactGrid, FindingCard, Icon, SourceList, StateChip, SyntheticBadge } from "./primitives";

export type DeskView = "pipeline" | "inbox" | "evals" | "console" | "field" | "wizard" | "listings" | "report";

const TRY_EVENT = "landing:try-sample";
// Same order as DECISION_STATES in lib/landing.ts; kept here so the client bundle does not
// pull in lib/landing.ts and the JSON files it imports.
const STATE_ORDER: DecisionState[] = ["flagged", "pending", "refused", "clear"];

export function TryButton({ disabled = false, className = "" }: { disabled?: boolean; className?: string }) {
  return (
    <button
      type="button"
      data-demo="try-sample"
      disabled={disabled}
      onClick={() => {
        window.dispatchEvent(new Event(TRY_EVENT));
        document.getElementById("sample")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }}
      className={`lp-btn lp-btn-primary disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    >
      <Icon name="play" className="h-3.5 w-3.5" />
      Try a sample
    </button>
  );
}

type Data = Pick<LandingData, "cases" | "featured" | "persona" | "steps" | "stateLabels" | "counts" | "fixturePath" | "setupHint">;

export function SampleDesk({ d, view }: { d: Data; view: DeskView }) {
  const initialId = d.featured?.id ?? d.cases[0]?.id ?? "";
  const [started, setStarted] = useState(false);
  const [selectedId, setSelectedId] = useState(initialId);
  const [step, setStep] = useState(0);
  const [filter, setFilter] = useState<DecisionState | "all">("all");

  useEffect(() => {
    const start = () => setStarted(true);
    window.addEventListener(TRY_EVENT, start);
    if (window.location.hash === "#sample") start();
    return () => window.removeEventListener(TRY_EVENT, start);
  }, []);

  const reset = useCallback(() => {
    setStarted(false);
    setSelectedId(initialId);
    setStep(0);
    setFilter("all");
    if (window.location.hash) window.history.replaceState(null, "", window.location.pathname + window.location.search);
  }, [initialId]);

  const selected = d.cases.find((c) => c.id === selectedId) ?? d.cases[0];

  if (!d.cases.length || !selected) {
    return (
      <div className="lp-card p-6 sm:p-8">
        <div className="flex flex-col items-start gap-3">
          <StateChip state="pending" label="No sample case yet" />
          <p className="lp-mono text-sm text-[var(--muted)]">{d.setupHint}</p>
        </div>
      </div>
    );
  }

  const props: ViewProps = { d, selected, select: setSelectedId, step, setStep, filter, setFilter };
  const body = {
    pipeline: <PipelineView {...props} />,
    inbox: <InboxView {...props} />,
    evals: <EvalsView {...props} />,
    console: <ConsoleView {...props} />,
    field: <FieldView {...props} />,
    wizard: <WizardView {...props} />,
    listings: <ListingsView {...props} />,
    report: <ReportView {...props} />,
  }[view];

  return (
    <div className="lp-card overflow-hidden" data-demo="sample-desk" data-started={started ? "true" : "false"}>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b lp-hair px-4 py-3 sm:px-5">
        <div className="flex min-w-0 flex-wrap items-center gap-2">
          <SyntheticBadge />
          {d.persona ? <span className="truncate text-sm text-[var(--muted)]">{d.persona}</span> : null}
        </div>
        {started ? (
          <button type="button" onClick={reset} data-demo="reset-sample" className="lp-btn lp-btn-sm lp-btn-quiet">
            <Icon name="reset" className="h-3.5 w-3.5" />
            Reset
          </button>
        ) : null}
      </div>
      <div className="relative">
        <div className={started ? "" : "lp-veil"} aria-hidden={!started} inert={!started}>
          {body}
        </div>
        {started ? null : (
          <div className="absolute inset-0 grid grid-cols-1 place-items-center p-6">
            <button type="button" onClick={() => setStarted(true)} className="lp-btn lp-btn-quiet">
              <Icon name="play" className="h-3.5 w-3.5" />
              Try a sample
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

interface ViewProps {
  d: Data;
  selected: SampleCase;
  select: (id: string) => void;
  step: number;
  setStep: (n: number) => void;
  filter: DecisionState | "all";
  setFilter: (f: DecisionState | "all") => void;
}

/* ------------------------------------------------------------------ shared bits */

function CaseList({ d, selected, select, cases = d.cases }: Pick<ViewProps, "d" | "selected" | "select"> & { cases?: SampleCase[] }) {
  return (
    <ul className="flex flex-col gap-1" data-demo="sample-list">
      {cases.map((c) => {
        const active = c.id === selected.id;
        return (
          <li key={c.id}>
            <button
              type="button"
              onClick={() => select(c.id)}
              aria-pressed={active}
              data-state={c.state}
              className={`lp-focus flex w-full items-start gap-3 rounded-[var(--radius-sm)] px-3 py-3 text-left transition-colors ${
                active ? "bg-[var(--raised)]" : "hover:bg-[color-mix(in_oklab,var(--raised)_60%,transparent)]"
              }`}
            >
              <span className="lp-dot mt-1.5" />
              <span className="flex min-w-0 flex-col gap-0.5">
                <span className="text-sm font-medium leading-snug text-[var(--ink)]">{c.title}</span>
                <span className="text-sm text-[var(--muted)]">{c.verdict}</span>
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}

function StepPills({ steps, step, setStep }: { steps: DemoStep[]; step: number; setStep: (n: number) => void }) {
  if (!steps.length) return null;
  return (
    <ol className="lp-scroll-x flex gap-2">
      {steps.map((s, i) => {
        const state = i < step ? "done" : i === step ? "now" : "next";
        return (
          <li key={s.say + i} className="flex-none">
            <button
              type="button"
              onClick={() => setStep(i)}
              aria-current={state === "now" ? "step" : undefined}
              className={`lp-focus flex items-center gap-2 rounded-[var(--pill)] border px-3 py-1.5 text-sm transition-colors ${
                state === "now"
                  ? "border-transparent bg-[var(--accent)] text-[var(--accent-ink)]"
                  : state === "done"
                    ? "lp-hair bg-[var(--raised)] text-[var(--ink)]"
                    : "lp-hair text-[var(--muted)]"
              }`}
            >
              <Icon name={state === "done" ? "check" : s.kind === "fill" ? "fill" : s.kind === "click" ? "click" : s.kind === "wait" ? "wait" : "open"} className="h-3.5 w-3.5" />
              <span className="max-w-[16rem] truncate">{s.say}</span>
            </button>
          </li>
        );
      })}
    </ol>
  );
}

function Json({ value, label }: { value: unknown; label: string }) {
  const text = value === undefined ? "—" : JSON.stringify(value, null, 2);
  return (
    <div className="flex min-w-0 flex-col">
      <div className="flex items-center justify-between border-b lp-hair px-4 py-2 text-sm text-[var(--muted)]">
        <span>{label}</span>
        <button
          type="button"
          onClick={() => void navigator.clipboard?.writeText(text)}
          className="lp-focus flex items-center gap-1 rounded px-1.5 py-0.5 hover:text-[var(--ink)]"
        >
          <Icon name="copy" className="h-3.5 w-3.5" />
          Copy
        </button>
      </div>
      <pre className="lp-mono max-h-80 overflow-auto whitespace-pre-wrap break-words p-4 text-sm leading-relaxed text-[var(--ink)]">{text}</pre>
    </div>
  );
}

function Pane({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="flex min-w-0 flex-col items-start gap-3 p-4 sm:p-5">
      <p className="text-sm font-medium text-[var(--muted)]">{title}</p>
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ views */

// workflow-tool: follow one case through the demo path, queue on the left.
function PipelineView({ d, selected, select, step, setStep }: ViewProps) {
  const last = Math.max(0, d.steps.length - 1);
  const done = !d.steps.length || step >= last;
  return (
    <div className="flex flex-col">
      {d.steps.length ? (
        <div className="flex flex-col gap-3 border-b lp-hair p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
          <StepPills steps={d.steps} step={step} setStep={setStep} />
          <button type="button" onClick={() => setStep(Math.min(step + 1, last))} disabled={done} className="lp-btn lp-btn-sm lp-btn-quiet flex-none disabled:opacity-40">
            Next step
            <Icon name="arrow" className="h-3.5 w-3.5" />
          </button>
        </div>
      ) : null}
      <div className="grid grid-cols-1 md:grid-cols-[minmax(0,280px)_1fr]">
        <div className="border-b lp-hair p-2 md:border-b-0 md:border-r">
          <CaseList d={d} selected={selected} select={select} />
        </div>
        <div className="p-5 sm:p-7">
          <FindingCard c={selected} headingLevel="h3" size="md" />
        </div>
      </div>
    </div>
  );
}

// data-investigation: filter by state, then decision | facts | sources side by side.
function InboxView({ d, selected, select, filter, setFilter }: ViewProps) {
  const cases = filter === "all" ? d.cases : d.cases.filter((c) => c.state === filter);
  const states = STATE_ORDER.filter((s) => d.counts[s] > 0);
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,300px)_1fr]">
      <div className="flex flex-col gap-3 border-b lp-hair p-3 lg:border-b-0 lg:border-r">
        <div className="lp-scroll-x flex gap-1.5">
          <FilterPill active={filter === "all"} onClick={() => setFilter("all")} label="All" count={d.cases.length} />
          {states.map((s) => (
            <FilterPill key={s} state={s} active={filter === s} onClick={() => setFilter(s)} label={d.stateLabels[s]} count={d.counts[s]} />
          ))}
        </div>
        <CaseList d={d} selected={selected} select={select} cases={cases} />
      </div>
      <div className="grid grid-cols-1 content-start md:grid-cols-2">
        <div className="border-b lp-hair md:col-span-2">
          <Pane title="Decision">
            <StateChip state={selected.state} label={selected.verdict} />
            <h3 className="lp-display text-2xl tracking-tight text-[var(--ink)]">{selected.title}</h3>
            {selected.reason ? <p className="lp-pretty max-w-[60ch] text-base leading-relaxed text-[var(--muted)]">{selected.reason}</p> : null}
          </Pane>
        </div>
        <div className="border-b lp-hair md:border-r md:border-b-0">
          <Pane title="Facts">
            <FactGrid facts={selected.facts} />
          </Pane>
        </div>
        <Pane title="Sources">
          <SourceList sources={selected.sources} limit={6} />
        </Pane>
      </div>
    </div>
  );
}

function FilterPill({ label, count, active, onClick, state }: { label: string; count: number; active: boolean; onClick: () => void; state?: DecisionState }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      data-state={state}
      className={`lp-focus flex flex-none items-center gap-1.5 rounded-[var(--pill)] border px-3 py-1.5 text-sm ${
        active ? "border-transparent bg-[var(--ink)] text-[var(--bg)]" : "lp-hair text-[var(--muted)] hover:text-[var(--ink)]"
      }`}
    >
      {state ? <span className="lp-dot" /> : null}
      {label}
      <span className="lp-mono opacity-70">{count}</span>
    </button>
  );
}

// ai-eval-lab: the share of each outcome, then one row per case.
function EvalsView({ d, selected, select }: ViewProps) {
  const states = STATE_ORDER.filter((s) => d.counts[s] > 0);
  return (
    <div className="flex flex-col">
      <div className="flex flex-col gap-3 border-b lp-hair p-4 sm:p-5">
        <div className="flex h-2.5 overflow-hidden rounded-[var(--pill)] bg-[var(--raised)]">
          {states.map((s) => (
            <span key={s} data-state={s} className="h-full bg-[var(--tone)]" style={{ width: `${(d.counts[s] / d.cases.length) * 100}%` } as CSSProperties} />
          ))}
        </div>
        <ul className="flex flex-wrap gap-x-5 gap-y-1 text-sm text-[var(--muted)]">
          {states.map((s) => (
            <li key={s} data-state={s} className="flex items-center gap-1.5">
              <span className="lp-dot" />
              {d.stateLabels[s]}
              <span className="lp-mono text-[var(--ink)]">
                {d.counts[s]}/{d.cases.length}
              </span>
            </li>
          ))}
        </ul>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[520px] text-left text-sm">
          <thead className="text-sm text-[var(--muted)]">
            <tr className="border-b lp-hair">
              <th className="px-5 py-3 font-medium">Case</th>
              <th className="px-3 py-3 font-medium">Result</th>
              <th className="px-5 py-3 text-right font-medium">{d.cases[0]?.facts[0]?.label ?? ""}</th>
            </tr>
          </thead>
          <tbody>
            {d.cases.map((c) => (
              <tr
                key={c.id}
                onClick={() => select(c.id)}
                className={`cursor-pointer border-b lp-hair last:border-0 ${c.id === selected.id ? "bg-[var(--raised)]" : "hover:bg-[color-mix(in_oklab,var(--raised)_55%,transparent)]"}`}
              >
                <td className="px-5 py-3">
                  <span className="block font-medium text-[var(--ink)]">{c.title}</span>
                  <span className="lp-mono text-sm text-[var(--muted)]">{c.id}</span>
                </td>
                <td className="px-3 py-3">
                  <StateChip state={c.state} label={c.verdict} />
                </td>
                <td className="lp-mono px-5 py-3 text-right text-[var(--ink)]">{c.facts[0]?.value ?? ""}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="grid grid-cols-1 gap-6 border-t lp-hair p-5 sm:p-6 md:grid-cols-2">
        <FactGrid facts={selected.facts} />
        <div className="flex flex-col gap-3">
          {selected.reason ? <p className="lp-pretty text-sm leading-relaxed text-[var(--muted)]">{selected.reason}</p> : null}
          <SourceList sources={selected.sources} />
        </div>
      </div>
    </div>
  );
}

// developer-console: request and response for each fixture case, as the code sees them.
function ConsoleView({ d, selected, select }: ViewProps) {
  return (
    <div className="flex flex-col">
      <div className="lp-scroll-x flex gap-1 border-b lp-hair px-3 pt-3">
        {d.cases.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => select(c.id)}
            data-state={c.state}
            aria-pressed={c.id === selected.id}
            className={`lp-focus lp-mono flex flex-none items-center gap-2 rounded-t-[var(--radius-sm)] border-x border-t px-3 py-2 text-sm ${
              c.id === selected.id ? "lp-hair bg-[var(--raised)] text-[var(--ink)]" : "border-transparent text-[var(--muted)] hover:text-[var(--ink)]"
            }`}
          >
            <span className="lp-dot" />
            {c.id}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 bg-[var(--raised)] md:grid-cols-2 md:divide-x lp-hair [&>*]:border-[var(--line)]">
        <Json value={selected.request} label="Input" />
        <Json value={selected.response} label="Output" />
      </div>
      <div className="flex flex-col gap-3 border-t lp-hair p-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col items-start gap-2">
          <StateChip state={selected.state} label={selected.verdict} />
          <p className="text-sm font-medium text-[var(--ink)]">{selected.title}</p>
          {selected.reason ? <p className="lp-pretty text-sm text-[var(--muted)]">{selected.reason}</p> : null}
        </div>
        <span className="lp-mono flex-none text-sm text-[var(--muted)]">{d.fixturePath}</span>
      </div>
    </div>
  );
}

// map-field-tool: cases with coordinates on a plotted field; the rest as a place list.
function FieldView({ d, selected, select }: ViewProps) {
  const placed = d.cases.filter((c) => typeof c.location?.lat === "number" && typeof c.location?.lng === "number");
  const bounds = useMemo(() => {
    const lats = placed.map((c) => c.location!.lat!);
    const lngs = placed.map((c) => c.location!.lng!);
    const pad = (a: number, b: number) => (a === b ? 0.01 : (b - a) * 0.15);
    const [minLat, maxLat, minLng, maxLng] = [Math.min(...lats), Math.max(...lats), Math.min(...lngs), Math.max(...lngs)];
    return {
      minLat: minLat - pad(minLat, maxLat),
      maxLat: maxLat + pad(minLat, maxLat),
      minLng: minLng - pad(minLng, maxLng),
      maxLng: maxLng + pad(minLng, maxLng),
    };
  }, [placed]);
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr]">
      <div className="relative min-h-72 border-b lp-hair bg-[var(--raised)] lg:border-b-0 lg:border-r">
        <div aria-hidden="true" className="lp-grid absolute inset-0 [mask-image:none]" />
        {placed.length ? (
          <svg viewBox="0 0 100 70" className="relative h-full w-full" role="img" aria-label="Sample locations">
            {placed.map((c) => {
              const x = 8 + ((c.location!.lng! - bounds.minLng) / (bounds.maxLng - bounds.minLng || 1)) * 84;
              const y = 62 - ((c.location!.lat! - bounds.minLat) / (bounds.maxLat - bounds.minLat || 1)) * 54;
              const active = c.id === selected.id;
              return (
                <g key={c.id} data-state={c.state} onClick={() => select(c.id)} className="cursor-pointer">
                  <circle cx={x} cy={y} r={active ? 4.2 : 2.6} fill="var(--tone)" opacity={0.18} />
                  <circle cx={x} cy={y} r={active ? 1.9 : 1.4} fill="var(--tone)" stroke="var(--surface)" strokeWidth={0.5} />
                </g>
              );
            })}
          </svg>
        ) : (
          <div className="relative p-2">
            <CaseList d={d} selected={selected} select={select} />
          </div>
        )}
      </div>
      <div className="flex flex-col gap-4 p-5 sm:p-6">
        {selected.location?.place || typeof selected.location?.lat === "number" ? (
          <p className="flex items-center gap-2 text-sm text-[var(--muted)]">
            <Icon name="pin" />
            {selected.location?.place ?? ""}
            {typeof selected.location?.lat === "number" ? (
              <span className="lp-mono text-sm">
                {selected.location.lat.toFixed(4)}, {selected.location.lng?.toFixed(4)}
              </span>
            ) : null}
          </p>
        ) : null}
        <FindingCard c={selected} headingLevel="h3" size="md" />
        {placed.length ? (
          <div className="border-t lp-hair pt-3">
            <CaseList d={d} selected={selected} select={select} />
          </div>
        ) : null}
      </div>
    </div>
  );
}

// consumer-flow: one screen at a time, in the person's order, ending on their result.
function WizardView({ d, selected, select, step, setStep }: ViewProps) {
  const total = d.steps.length;
  const atResult = step >= total;
  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6 p-5 sm:p-8">
      <div className="flex items-center gap-1.5" aria-hidden="true">
        {Array.from({ length: total + 1 }).map((_, i) => (
          <span key={i} className={`h-1.5 flex-1 rounded-[var(--pill)] ${i <= step ? "bg-[var(--accent)]" : "bg-[var(--raised)]"}`} />
        ))}
      </div>
      {d.cases.length > 1 ? (
        <div className="lp-scroll-x flex gap-1.5">
          {d.cases.map((c) => (
            <button
              key={c.id}
              type="button"
              data-state={c.state}
              onClick={() => select(c.id)}
              aria-pressed={c.id === selected.id}
              className={`lp-focus flex flex-none items-center gap-1.5 rounded-[var(--pill)] border px-3 py-1.5 text-sm ${
                c.id === selected.id ? "border-transparent bg-[var(--ink)] text-[var(--bg)]" : "lp-hair text-[var(--muted)]"
              }`}
            >
              <span className="lp-dot" />
              <span className="max-w-[12rem] truncate">{c.title}</span>
            </button>
          ))}
        </div>
      ) : null}
      {atResult ? (
        <FindingCard c={selected} headingLevel="h3" />
      ) : (
        <div className="flex min-h-40 flex-col justify-center gap-3">
          <span className="lp-mono text-sm text-[var(--muted)]">
            {step + 1} / {total}
          </span>
          <p className="lp-display text-2xl text-[var(--ink)] sm:text-3xl">{d.steps[step]?.say}</p>
        </div>
      )}
      <div className="flex items-center justify-between gap-3">
        <button type="button" onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0} className="lp-btn lp-btn-sm lp-btn-quiet disabled:opacity-40">
          Back
        </button>
        {atResult ? null : (
          <button type="button" onClick={() => setStep(step + 1)} className="lp-btn lp-btn-sm lp-btn-quiet">
            {step + 1 === total ? "See the result" : "Continue"}
            <Icon name="arrow" className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}

// marketplace: every case as a listing card; the chosen one opens underneath.
function ListingsView({ d, selected, select }: ViewProps) {
  return (
    <div className="flex flex-col">
      <ul className="grid grid-cols-1 gap-3 p-4 sm:grid-cols-2 sm:p-5 lg:grid-cols-3">
        {d.cases.map((c) => {
          const active = c.id === selected.id;
          return (
            <li key={c.id}>
              <button
                type="button"
                onClick={() => select(c.id)}
                aria-pressed={active}
                className={`lp-focus flex h-full w-full flex-col gap-3 rounded-[var(--radius-sm)] border p-4 text-left transition-colors ${
                  active ? "border-[var(--accent)] bg-[color-mix(in_oklab,var(--accent)_5%,var(--surface))]" : "lp-hair hover:border-[color-mix(in_oklab,var(--ink)_20%,var(--line))]"
                }`}
              >
                <StateChip state={c.state} label={c.verdict} />
                <span className="text-base font-medium leading-snug text-[var(--ink)]">{c.title}</span>
                {c.facts.length ? (
                  <span className="mt-auto flex flex-wrap gap-x-4 gap-y-1 text-sm text-[var(--muted)]">
                    {c.facts.slice(0, 2).map((f) => (
                      <span key={f.label}>
                        {f.label} <span className="lp-mono text-[var(--ink)]">{f.value}</span>
                      </span>
                    ))}
                  </span>
                ) : null}
              </button>
            </li>
          );
        })}
      </ul>
      <div className="border-t lp-hair p-5 sm:p-7">
        <FindingCard c={selected} headingLevel="h3" size="md" />
      </div>
    </div>
  );
}

// storytelling-report: the findings as a numbered, readable report with their quotes.
function ReportView({ d }: ViewProps) {
  return (
    <ol className="flex flex-col divide-y lp-hair [&>*]:border-[var(--line)]">
      {d.cases.map((c, i) => (
        <li key={c.id} className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-[64px_1fr] sm:p-8">
          <span className="lp-display text-4xl text-[var(--muted)]">{i + 1}</span>
          <div className="flex min-w-0 flex-col items-start gap-3">
            <StateChip state={c.state} label={c.verdict} />
            <h3 className="lp-display text-2xl tracking-tight text-[var(--ink)]">{c.title}</h3>
            {c.reason ? <p className="lp-pretty max-w-[60ch] text-base leading-relaxed text-[var(--muted)]">{c.reason}</p> : null}
            <div className="w-full max-w-2xl">
              <FactGrid facts={c.facts} />
            </div>
            <SourceList sources={c.sources} />
          </div>
        </li>
      ))}
    </ol>
  );
}
