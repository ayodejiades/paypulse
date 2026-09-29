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
import { DashboardShell } from "@/components/dashboard-shell";
import { PipelineFlow } from "@/components/ui/pipeline-flow";

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
      <DashboardShell project="PayPulse">
        <div className="mx-auto flex max-w-3xl flex-col gap-6 py-12">
          <div className="flex flex-col gap-2">
            <span className="font-mono text-xs uppercase tracking-wider text-[var(--fg-muted,#8aa39a)]">
              /proof · EVIDENCE &amp; SAFETY KERNEL
            </span>
            <h1 className="text-2xl font-semibold tracking-tight text-[var(--fg,#e7f3ef)]">
              No evidence cases generated yet
            </h1>
            <p className="text-sm text-[var(--fg-muted,#8aa39a)]">
              This page inspects the verification cases committed to{" "}
              <code className="font-mono">evidence/campaign-report.json</code>.
            </p>
          </div>

          <div className="flex flex-col gap-2 rounded-lg border border-[var(--border,#232b29)] bg-[var(--surface,#121615)] p-5 font-mono text-xs text-[var(--fg-muted,#8aa39a)]">
            <span>
              status: <span className="text-[var(--fg,#e7f3ef)]">{summary.status ?? "NOT_GENERATED"}</span>
            </span>
            <span>{summary.note}</span>
          </div>
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell project="PayPulse">
      <div className="flex flex-col gap-8">
        {/* Headline Measured Proof Banner */}
        <section className="flex flex-col gap-6 border border-[var(--border,#232b29)] bg-[var(--surface,#121615)] p-6 rounded-lg shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-semibold">
                Inspectable Production &amp; Campaign Proof (No Signup Required)
              </span>
              <h1 className="text-2xl font-semibold tracking-tight text-[var(--fg,#e7f3ef)] mt-1">
                Deterministic Due-Date &amp; Integer-Kobo Safety Kernel
              </h1>
              <p className="text-sm text-[var(--fg-muted,#8aa39a)] mt-1 max-w-3xl">
                Every extracted commitment requires a verbatim substring in the original invoice document. Unbound claims fail closed, benign rewrites are ignored, and provider claims are held in <code className="text-amber-300">WAITING_TO_VERIFY</code> until a later observation reconciles.
              </p>
            </div>
            <div className="flex flex-col items-end font-mono text-xs gap-1.5">
              <span className="rounded bg-emerald-500/15 text-emerald-400 px-3 py-1 border border-emerald-500/30 font-semibold">
                verify:evidence {summary.invariantsPassed} PASS
              </span>
              <span className="text-[var(--fg-muted,#8aa39a)]">
                Mechanism: {campaignData.mechanismVersion}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 pt-4 border-t border-[var(--border,#232b29)] font-mono text-xs">
            <div className="flex flex-col gap-1">
              <span className="text-[var(--fg-muted,#8aa39a)]">EXCERPT-BOUND</span>
              <span className="text-base font-semibold text-emerald-400 tabular-nums">{summary.evidenceBoundDecisions}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[var(--fg-muted,#8aa39a)]">MATERIAL DRIFT</span>
              <span className="text-base font-semibold text-[var(--fg,#e7f3ef)] tabular-nums">{summary.materialDriftDetected}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[var(--fg-muted,#8aa39a)]">BENIGN CONTROL</span>
              <span className="text-base font-semibold text-[var(--fg,#e7f3ef)] tabular-nums">{summary.benignChangesIgnored}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[var(--fg-muted,#8aa39a)]">AMBIGUITY ABSTAIN</span>
              <span className="text-base font-semibold text-[var(--fg,#e7f3ef)] tabular-nums">{summary.ambiguityAbstention}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[var(--fg-muted,#8aa39a)]">FALSE VERIFIED</span>
              <span className="text-base font-semibold text-emerald-400 tabular-nums">{summary.falseVerifiedClaims}</span>
            </div>
          </div>
          <p className="text-xs font-mono text-[var(--fg-muted,#8aa39a)] border-t border-[var(--border,#232b29)] pt-3">
            Disclosed calibration note: {summary.benignChangesFirstRunNote}
          </p>
        </section>

        {/* Interactive Case & Refusal Tester */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 flex flex-col gap-3">
            <h2 className="text-sm font-mono uppercase tracking-wider text-[var(--fg-muted,#8aa39a)] font-semibold">
              1. Select Verification Fixture
            </h2>
            {cases.map((c) => {
              const isSelected = c.caseId === activeCase.caseId;
              return (
                <button
                  key={c.caseId}
                  type="button"
                  onClick={() => setSelectedCaseId(c.caseId)}
                  data-demo={`proof-case-${c.caseId}`}
                  className={`text-left p-4 rounded-lg border transition-colors flex flex-col gap-1.5 cursor-pointer ${
                    isSelected
                      ? "border-[var(--accent,#059669)] bg-[var(--surface-raised,#171c1b)]"
                      : "border-[var(--border,#232b29)] bg-[var(--surface,#121615)] hover:border-[var(--fg-muted,#8aa39a)]/40"
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-emerald-400 font-semibold">{c.category}</span>
                    <span className="text-[var(--fg-muted,#8aa39a)]">{c.expectedState}</span>
                  </div>
                  <p className="text-sm font-medium text-[var(--fg,#e7f3ef)]">{c.title || c.caseId}</p>
                </button>
              );
            })}
          </div>

          <div className="lg:col-span-7 flex flex-col gap-4 border border-[var(--border,#232b29)] bg-[var(--surface,#121615)] p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between border-b border-[var(--border,#232b29)] pb-4">
              <div>
                <span className="text-xs font-mono text-emerald-400 font-semibold">DETERMINISTIC KERNEL VERDICT</span>
                <h3 className="text-lg font-semibold mt-0.5 text-[var(--fg,#e7f3ef)]">{decision.state}</h3>
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

            <p className="text-sm text-[var(--fg-muted,#8aa39a)]">{decision.summary}</p>

            <div className="grid grid-cols-1 gap-3 text-xs font-mono">
              <div className="rounded border border-[var(--border,#232b29)] bg-[var(--surface-raised,#171c1b)] p-3">
                <div className="text-[var(--fg-muted,#8aa39a)] mb-1 uppercase font-semibold">Original Invoice Record</div>
                <div className="text-[var(--fg,#e7f3ef)]">{activeCase.sourceCaptureT0}</div>
              </div>
              <div className="rounded border border-[var(--border,#232b29)] bg-[var(--surface-raised,#171c1b)] p-3">
                <div className="text-[var(--fg-muted,#8aa39a)] mb-1 uppercase font-semibold">Extracted Line Item Commitment</div>
                <div className={decision.excerptBound ? "text-emerald-400" : "text-red-400"}>
                  &ldquo;{activeCase.extractedExcerpt}&rdquo;
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2 pt-2">
              <span className="text-xs font-mono uppercase text-[var(--fg-muted,#8aa39a)] font-semibold">
                Deterministic Invariant Checks
              </span>
              {decision.invariants.map((inv) => (
                <div
                  key={inv.id}
                  className="flex items-center justify-between gap-4 rounded border border-[var(--border,#232b29)] bg-[var(--surface-raised,#171c1b)] px-3 py-2 text-xs font-mono"
                >
                  <span>
                    <strong className="text-emerald-400">{inv.id}</strong> · {inv.name}
                  </span>
                  <span className="text-[var(--fg-muted,#8aa39a)] truncate max-w-[320px]">{inv.detail}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </DashboardShell>
  );
}
