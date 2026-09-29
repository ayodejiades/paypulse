"use client";

import { useState } from "react";
import Link from "next/link";
import { BENCHMARK_CASES, evaluateSafetyKernel } from "@/lib/kernel";
import { isDemoMode } from "@/lib/demo-mode";
import { DashboardShell } from "@/components/dashboard-shell";

const STAGES = [
  {
    step: 1,
    code: "01_RECORD",
    title: "01 · Record Baseline Commitment",
    seam: "KERNEL_DB (Drizzle / Postgres)",
    summary: "Operator registers a watched vendor surface and pins baseline snapshot SHA 256 hash.",
  },
  {
    step: 2,
    code: "02_WATCH",
    title: "02 · Watch & Capture Live DOM",
    seam: "CAPTURE (Firecrawl / Snapshot)",
    summary: "Headless capture records rendered DOM text and computes canonical byte digest.",
  },
  {
    step: 3,
    code: "03_DETECT",
    title: "03 · Extraction vs. Safety Kernel",
    seam: "EXTRACTION (Structured Schema) -> KERNEL",
    summary: "Agent proposes structured diff; deterministic safety kernel verifies byte substring grounding.",
  },
  {
    step: 4,
    code: "04_RESOLVE",
    title: "04 · Deterministic State Transition",
    seam: "KERNEL_DB + DISPATCH (Signed Webhook)",
    summary: "If all invariants pass, state transitions to MATERIAL_DRIFT_DETECTED and dispatches operator packet.",
  },
  {
    step: 5,
    code: "05_RECEIPT",
    title: "05 · Signed Evidence Packet & Hash",
    seam: "VERIFY (/verify CLI & Browser)",
    summary: "Produces a canonical SHA 256 receipt packet verifiable offline without credentials.",
  },
];

export default function GuidedDemoPage() {
  const [selectedCaseIndex, setSelectedCaseIndex] = useState<number>(0);
  const [stageIndex, setStageIndex] = useState<number>(0);

  const demoCases = [
    {
      label: "Scenario A · Actionable Drift (Approved)",
      badge: "ACTIONABLE",
      caseData: BENCHMARK_CASES[0],
    },
    {
      label: "Scenario B · Benign Rephrasing (Suppressed)",
      badge: "BENIGN CONTROL",
      caseData: BENCHMARK_CASES[2],
    },
    {
      label: "Scenario C · Adversarial Injection (Kernel Refusal)",
      badge: "REFUSED BY INV 01",
      caseData: {
        ...BENCHMARK_CASES[0],
        id: "CASE-ADV-99",
        title: "Injected Hallucinated Clause (Unverified Substring)",
        proposedExcerpt: "Enterprise SLA credits are permanently waived upon 24h notice.",
      },
    },
  ];

  const activeScenario = demoCases[selectedCaseIndex] ?? demoCases[0];
  const evaluation = evaluateSafetyKernel(activeScenario.caseData);
  const currentStage = STAGES[stageIndex] ?? STAGES[0];

  function advanceStage() {
    setStageIndex((prev) => (prev + 1) % STAGES.length);
  }

  return (
    <DashboardShell project="PayPulse">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col justify-between gap-4 border-b border-[var(--border,#232b29)] pb-6 md:flex-row md:items-center">
          <div>
            <div className="mb-1 flex flex-wrap items-center gap-2">
              <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-emerald-400">
                Interactive State Machine Walkthrough
              </p>
              {isDemoMode() && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border,#232b29)] bg-[var(--surface,#121615)] px-2.5 py-0.5 font-mono text-[10px] text-[var(--fg-muted,#8aa39a)]">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" aria-hidden />
                  Deterministic offline fixture mode
                </span>
              )}
            </div>
            <h1 className="text-2xl font-medium tracking-[-0.02em] text-[var(--fg,#e7f3ef)] [text-wrap:balance] md:text-3xl">
              Five Stage Evidence Lifecycle
            </h1>
            <p className="mt-1 text-sm text-[var(--fg-muted,#8aa39a)] [text-wrap:pretty]">
              Step through a complete lifecycle or switch scenarios to watch the deterministic kernel refuse hallucinated excerpts.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              data-demo="advance-stage"
              onClick={advanceStage}
              className="rounded-md bg-[var(--accent,#059669)] px-4 py-2.5 font-mono text-xs font-semibold text-white transition-colors hover:bg-[#047857]"
            >
              Advance Lifecycle Stage ({stageIndex + 1}/5) &rarr;
            </button>
            <Link
              href="/dashboard"
              className="rounded-md border border-[var(--border,#232b29)] bg-[var(--surface,#121615)] px-4 py-2.5 font-mono text-xs text-[var(--fg,#e7f3ef)] hover:border-emerald-500/50"
            >
              Open Full Console &rarr;
            </Link>
          </div>
        </div>

        {/* Scenario Selector */}
        <div className="grid gap-3 md:grid-cols-3">
          {demoCases.map((sc, idx) => (
            <button
              key={sc.label}
              type="button"
              data-demo={`scenario-${idx}`}
              onClick={() => {
                setSelectedCaseIndex(idx);
                setStageIndex(2);
              }}
              className={`rounded-lg border p-4 text-left transition-all ${
                selectedCaseIndex === idx
                  ? "border-emerald-500 bg-[var(--surface,#121615)] ring-1 ring-inset ring-emerald-500"
                  : "border-[var(--border,#232b29)] bg-[var(--surface,#121615)] hover:border-emerald-500/40"
              }`}
            >
              <div className="mb-1 flex items-center justify-between gap-2">
                <span className="font-mono text-xs font-semibold text-emerald-400">{sc.caseData.id}</span>
                <span className="rounded border border-[var(--border,#232b29)] bg-[var(--bg,#0a0d0c)] px-2 py-0.5 font-mono text-[10px] text-[var(--fg-muted,#8aa39a)]">
                  {sc.badge}
                </span>
              </div>
              <div className="text-sm font-medium text-[var(--fg,#e7f3ef)]">{sc.label}</div>
              <p className="mt-1 truncate text-xs text-[var(--fg-muted,#8aa39a)]">{sc.caseData.title}</p>
            </button>
          ))}
        </div>

        {/* 5-Stage Pipeline Stepper */}
        <div className="grid grid-cols-1 gap-px overflow-hidden rounded-lg border border-[var(--border,#232b29)] bg-[var(--border,#232b29)] md:grid-cols-5">
          {STAGES.map((st, idx) => {
            const isCurrent = idx === stageIndex;
            const isPassed = idx < stageIndex;
            return (
              <button
                key={st.code}
                type="button"
                onClick={() => setStageIndex(idx)}
                className={`p-3.5 text-left transition-all ${
                  isCurrent
                    ? "bg-[var(--surface,#121615)] ring-1 ring-inset ring-emerald-500"
                    : "bg-[var(--surface,#121615)] hover:bg-[var(--bg,#0a0d0c)]"
                }`}
              >
                <div className="mb-1 flex items-center justify-between font-mono text-[10px]">
                  <span className="text-[var(--fg-muted,#8aa39a)]">STAGE 0{st.step}</span>
                  <span className={isCurrent ? "font-semibold text-emerald-400" : isPassed ? "text-emerald-400" : "text-[var(--fg-muted,#8aa39a)]"}>
                    {isCurrent ? "ACTIVE" : isPassed ? "DONE" : "PENDING"}
                  </span>
                </div>
                <div className="mb-1 text-xs font-medium text-[var(--fg,#e7f3ef)]">{st.title}</div>
                <div className="font-mono text-[10px] text-[var(--fg-muted,#8aa39a)]">{st.seam}</div>
              </button>
            );
          })}
        </div>

        {/* Main Inspection Grid */}
        <div className="grid gap-6 lg:grid-cols-12">
          {/* Left 7 Cols: Live Stage Payload */}
          <div className="space-y-5 rounded-lg border border-[var(--border,#232b29)] bg-[var(--surface,#121615)] p-6 lg:col-span-7">
            <div className="flex items-center justify-between border-b border-[var(--border,#232b29)] pb-4">
              <div>
                <span className="font-mono text-[11px] uppercase text-emerald-400">{currentStage.seam}</span>
                <h2 className="mt-0.5 text-lg font-medium text-[var(--fg,#e7f3ef)]">{currentStage.title}</h2>
                <p className="mt-0.5 text-xs text-[var(--fg-muted,#8aa39a)]">{currentStage.summary}</p>
              </div>
              <span
                className={`rounded px-3 py-1 font-mono text-xs font-medium ${
                  evaluation.approved
                    ? "border border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                    : "border border-red-500/30 bg-red-500/10 text-red-400"
                }`}
              >
                {evaluation.verdict}
              </span>
            </div>

            <div className="space-y-3">
              <div className="rounded-md border border-[var(--border,#232b29)] bg-[var(--bg,#0a0d0c)] p-3.5">
                <div className="mb-1 font-mono text-[10px] uppercase text-[var(--fg-muted,#8aa39a)]">
                  Baseline Snapshot (before text)
                </div>
                <p className="font-mono text-xs leading-relaxed text-[var(--fg,#e7f3ef)]">
                  {activeScenario.caseData.beforeText}
                </p>
              </div>

              <div className="rounded-md border border-[var(--border,#232b29)] bg-[var(--bg,#0a0d0c)] p-3.5">
                <div className="mb-1 font-mono text-[10px] uppercase text-[var(--fg-muted,#8aa39a)]">
                  Captured Live DOM (after text)
                </div>
                <p className="font-mono text-xs leading-relaxed text-[var(--fg,#e7f3ef)]">
                  {activeScenario.caseData.afterText}
                </p>
              </div>

              <div className="rounded-md border border-[var(--border,#232b29)] bg-[var(--bg,#0a0d0c)] p-3.5">
                <div className="mb-1 flex items-center justify-between font-mono text-[10px] uppercase">
                  <span className="text-emerald-400">Agent Proposed Literal Excerpt</span>
                  <span
                    className={
                      activeScenario.caseData.afterText.includes(activeScenario.caseData.proposedExcerpt)
                        ? "text-emerald-400"
                        : "text-red-400"
                    }
                  >
                    {activeScenario.caseData.afterText.includes(activeScenario.caseData.proposedExcerpt)
                      ? "EXACT BYTE SUBSTRING"
                      : "SUBSTRING MISMATCH"}
                  </span>
                </div>
                <p className="font-mono text-xs text-[var(--fg,#e7f3ef)]">
                  &ldquo;{activeScenario.caseData.proposedExcerpt}&rdquo;
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between rounded-md border border-[var(--border,#232b29)] bg-[var(--bg,#0a0d0c)] p-3.5 font-mono text-xs">
              <span className="text-[var(--fg-muted,#8aa39a)]">Deterministic Receipt SHA 256:</span>
              <span className="max-w-[320px] truncate text-emerald-400">{evaluation.evidenceHash}</span>
            </div>
          </div>

          {/* Right 5 Cols: 5-Invariant Kernel Verdict */}
          <div className="space-y-6 lg:col-span-5">
            <div className="space-y-4 rounded-lg border border-[var(--border,#232b29)] bg-[var(--surface,#121615)] p-6">
              <div className="flex items-center justify-between">
                <h3 className="font-mono text-xs font-semibold uppercase tracking-wider text-[var(--fg,#e7f3ef)]">
                  Five Invariant Safety Kernel Gate
                </h3>
                <span className="font-mono text-xs text-[var(--fg-muted,#8aa39a)]">lib/kernel.ts</span>
              </div>

              <div className="space-y-2">
                {evaluation.invariantResults.map((inv) => (
                  <div
                    key={inv.id}
                    className="flex items-start justify-between gap-3 rounded-md border border-[var(--border,#232b29)] bg-[var(--bg,#0a0d0c)] p-3"
                  >
                    <div>
                      <div className="font-mono text-xs font-semibold text-[var(--fg,#e7f3ef)]">
                        {inv.id} · {inv.name}
                      </div>
                      <div className="mt-0.5 text-[11px] text-[var(--fg-muted,#8aa39a)]">{inv.reason}</div>
                    </div>
                    <span
                      className={`shrink-0 rounded px-2 py-0.5 font-mono text-[10px] ${
                        inv.passed
                          ? "border border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                          : "border border-red-500/30 bg-red-500/10 text-red-400"
                      }`}
                    >
                      {inv.passed ? "PASS" : "REFUSED"}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3 rounded-lg border border-[var(--border,#232b29)] bg-[var(--surface,#121615)] p-5">
              <div className="font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--fg-muted,#8aa39a)]">
                Continue Evaluation Path
              </div>
              <div className="grid grid-cols-2 gap-2.5 font-mono text-xs">
                <Link
                  href="/dashboard/sponsors"
                  className="rounded-md border border-[var(--border,#232b29)] bg-[var(--bg,#0a0d0c)] p-3 text-[var(--fg,#e7f3ef)] hover:border-emerald-500/50"
                >
                  Sponsor Controls &rarr;
                </Link>
                <Link
                  href="/proof"
                  className="rounded-md border border-[var(--border,#232b29)] bg-[var(--bg,#0a0d0c)] p-3 text-[var(--fg,#e7f3ef)] hover:border-emerald-500/50"
                >
                  Ledger Proof (/proof) &rarr;
                </Link>
                <Link
                  href="/verify"
                  className="col-span-2 rounded-md border border-[var(--border,#232b29)] bg-[var(--bg,#0a0d0c)] p-3 text-emerald-400 hover:border-emerald-500"
                >
                  Receipt Verifier (/verify) &rarr;
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
