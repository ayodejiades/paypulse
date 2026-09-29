"use client";

// app/proof/page.tsx — the zero-signup evidence inspector.
//
// `evidence/campaign-report.json` ships with `cases: []` and a `summary.status` of
// NOT_GENERATED, because the cases are project-specific and cannot be written until the
// product exists. This page used to read `cases[0].caseId` and the summary counters
// unconditionally, so on a freshly scaffolded project TypeScript inferred `cases` as
// `never[]` and the build failed with 18 errors — meaning no scaffolded project has ever
// built. It now renders the not-yet-generated state honestly, and the real inspector once
// the project fills the file in.
import { useState } from "react";
import Link from "next/link";
import campaignData from "../../evidence/campaign-report.json";
import { evaluateDeterministicKernel, type ReconciliationInput } from "@/lib/kernel";

type ProofCase = ReconciliationInput & {
  title: string;
  category: string;
  expectedState: string;
};

const cases = campaignData.cases as ProofCase[];
const summary = campaignData.summary as Record<string, string> & { status?: string };
const generated = cases.length > 0;

export default function Web2ProofPage() {
  const [selectedCaseId, setSelectedCaseId] = useState(cases[0]?.caseId ?? "");
  const activeCase = cases.find((c) => c.caseId === selectedCaseId) ?? cases[0];
  const decision = activeCase ? evaluateDeterministicKernel(activeCase) : null;

  if (!generated || !decision) {
    return (
      <div className="min-h-screen bg-[var(--bg,#0a0a0a)] text-[var(--fg,#ededed)]">
        <main className="mx-auto flex max-w-3xl flex-col gap-6 px-6 py-16">
          <div className="flex flex-col gap-2">
            <span className="font-mono text-xs uppercase tracking-wider text-[var(--fg-muted,#888)]">
              /proof · EVIDENCE &amp; SAFETY KERNEL
            </span>
            <h1 className="text-2xl font-semibold tracking-tight">
              No evidence cases generated yet
            </h1>
            <p className="text-sm text-[var(--fg-muted,#888)]">
              This page inspects the verification cases committed to{" "}
              <code className="font-mono">evidence/campaign-report.json</code>. The file
              ships empty because the cases are specific to this product and can only be
              written once the domain logic exists.
            </p>
          </div>

          <div className="flex flex-col gap-2 rounded-lg border border-[var(--border,#262626)] bg-[var(--surface,#121212)] p-5 font-mono text-xs text-[var(--fg-muted,#888)]">
            <span>
              status: <span className="text-[var(--fg)]">{summary.status ?? "NOT_GENERATED"}</span>
            </span>
            <span>{summary.note}</span>
          </div>

          <div className="flex gap-3">
            <Link
              href="/demo"
              className="rounded bg-[var(--accent)] px-4 py-2 text-sm font-medium text-[var(--accent-contrast)]"
            >
              See the guided demo
            </Link>
            <Link
              href="/"
              className="rounded border border-[var(--border,#262626)] px-4 py-2 text-sm"
            >
              Back to the overview
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg,#0a0a0a)] text-[var(--fg,#ededed)]">
      <header className="flex h-16 items-center justify-between border-b border-[var(--border,#262626)] px-6 max-w-6xl mx-auto w-full">
        <div className="flex items-center gap-3">
          <Link href="/" className="text-lg font-bold tracking-tight text-[var(--fg)]">
            PayPulse Africa
          </Link>
          <span className="rounded border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-xs text-emerald-400 font-mono">
            /proof · EVIDENCE & SAFETY KERNEL
          </span>
        </div>
        <nav className="flex items-center gap-4 text-sm">
          <Link href="/" className="text-[var(--fg-muted,#888)] hover:text-[var(--fg)]">
            Overview
          </Link>
          <Link href="/dashboard" className="text-[var(--fg-muted,#888)] hover:text-[var(--fg)]">
            Live Workspace
          </Link>
        </nav>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12 flex flex-col gap-12">
        {/* Headline Measured Proof Banner */}
        <section className="flex flex-col gap-4 border border-[var(--border,#262626)] bg-[var(--surface,#121212)] p-6 rounded-lg">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-emerald-400">
                Inspectable Production & Campaign Proof (No Signup Required)
              </span>
              <h1 className="text-2xl font-semibold tracking-tight mt-1">
                AI Extracts; Deterministic Code Decides.
              </h1>
              <p className="text-sm text-[var(--fg-muted,#888)] mt-1 max-w-3xl">
                Every extracted commitment requires a verbatim substring in the immutable T0 source capture. Unbound claims fail closed, benign rewrites are ignored, and provider claims are held in <code className="text-amber-300">WAITING_TO_VERIFY</code> until a later observation reconciles.
              </p>
            </div>
            <div className="flex flex-col items-end font-mono text-xs gap-1">
              <span className="rounded bg-emerald-500/15 text-emerald-400 px-2.5 py-1 border border-emerald-500/30">
                verify:evidence {summary.invariantsPassed} PASS
              </span>
              <span className="text-[var(--fg-muted,#888)]">
                Mechanism: {campaignData.mechanismVersion}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 pt-4 border-t border-[var(--border,#262626)] font-mono text-xs">
            <div className="flex flex-col gap-1">
              <span className="text-[var(--fg-muted,#888)]">EXCERPT-BOUND</span>
              <span className="text-base font-semibold text-emerald-400">{summary.evidenceBoundDecisions}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[var(--fg-muted,#888)]">MATERIAL DRIFT</span>
              <span className="text-base font-semibold text-[var(--fg)]">{summary.materialDriftDetected}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[var(--fg-muted,#888)]">BENIGN CONTROL</span>
              <span className="text-base font-semibold text-[var(--fg)]">{summary.benignChangesIgnored}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[var(--fg-muted,#888)]">AMBIGUITY ABSTAIN</span>
              <span className="text-base font-semibold text-[var(--fg)]">{summary.ambiguityAbstention}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[var(--fg-muted,#888)]">FALSE VERIFIED</span>
              <span className="text-base font-semibold text-emerald-400">{summary.falseVerifiedClaims}</span>
            </div>
          </div>
          <p className="text-xs font-mono text-[var(--fg-muted,#888)] border-t border-[var(--border,#262626)] pt-3">
            Disclosed calibration note: {summary.benignChangesFirstRunNote}
          </p>
        </section>

        {/* Interactive Case & Refusal Tester */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 flex flex-col gap-3">
            <h2 className="text-sm font-mono uppercase tracking-wider text-[var(--fg-muted,#888)]">
              1. Select Verification Fixture (Happy, Control, Refusal)
            </h2>
            {cases.map((c) => {
              const isSelected = c.caseId === activeCase.caseId;
              return (
                <button
                  key={c.caseId}
                  type="button"
                  onClick={() => setSelectedCaseId(c.caseId)}
                  data-demo={`proof-case-${c.caseId}`}
                  className={`text-left p-4 rounded-lg border transition-colors flex flex-col gap-1.5 ${
                    isSelected
                      ? "border-emerald-500 bg-[var(--surface-raised,#1a1a1a)]"
                      : "border-[var(--border,#262626)] bg-[var(--surface,#121212)] hover:border-neutral-600"
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-emerald-400">{c.category}</span>
                    <span className="text-[var(--fg-muted,#888)]">{c.expectedState}</span>
                  </div>
                  <p className="text-sm font-medium text-[var(--fg)]">{c.title}</p>
                </button>
              );
            })}
          </div>

          <div className="lg:col-span-7 flex flex-col gap-4 border border-[var(--border,#262626)] bg-[var(--surface,#121212)] p-6 rounded-lg">
            <div className="flex items-center justify-between border-b border-[var(--border,#262626)] pb-4">
              <div>
                <span className="text-xs font-mono text-emerald-400">DETERMINISTIC KERNEL VERDICT</span>
                <h3 className="text-lg font-semibold mt-0.5">{decision.state}</h3>
              </div>
              <span
                className={`px-2.5 py-1 rounded text-xs font-mono border ${
                  decision.excerptBound
                    ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                    : "bg-amber-500/15 text-amber-300 border-amber-500/30"
                }`}
              >
                {decision.excerptBound ? "EXCERPT BOUND (INV-1 PASS)" : "UNBOUND EXCERPT -> FAIL CLOSED"}
              </span>
            </div>

            <p className="text-sm text-[var(--fg-muted,#888)]">{decision.summary}</p>

            <div className="grid grid-cols-1 gap-3 text-xs font-mono">
              <div className="rounded border border-[var(--border,#262626)] bg-[var(--bg,#0a0a0a)] p-3">
                <div className="text-[var(--fg-muted,#888)] mb-1">IMMUTABLE T0 SOURCE CAPTURE</div>
                <div className="text-[var(--fg)]">{activeCase.sourceCaptureT0}</div>
              </div>
              <div className="rounded border border-[var(--border,#262626)] bg-[var(--bg,#0a0a0a)] p-3">
                <div className="text-[var(--fg-muted,#888)] mb-1">MODEL-EXTRACTED EXCERPT CANDIDATE</div>
                <div className={decision.excerptBound ? "text-emerald-400" : "text-rose-400"}>
                  &ldquo;{activeCase.extractedExcerpt}&rdquo;
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2 pt-2">
              <span className="text-xs font-mono uppercase text-[var(--fg-muted,#888)]">
                Invariant Checks (lib/kernel.ts)
              </span>
              {decision.invariants.map((inv) => (
                <div
                  key={inv.id}
                  className="flex items-center justify-between gap-4 rounded border border-[var(--border,#262626)] bg-[var(--bg,#0a0a0a)] px-3 py-2 text-xs font-mono"
                >
                  <span>
                    <strong className="text-emerald-400">{inv.id}</strong> · {inv.name}
                  </span>
                  <span className="text-[var(--fg-muted,#888)] truncate max-w-[320px]">{inv.detail}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
