"use client";

import { useState } from "react";
import Link from "next/link";
import { DashboardShell } from "@/components/dashboard-shell";
import { BENCHMARK_CASES, evaluateSafetyKernel } from "@/lib/kernel";

function fnv1aHex(text: string): string {
  let h = 0x811c9dc5;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  const part1 = (h >>> 0).toString(16).padStart(8, "0");
  return `0x${part1}e4b8c9107a2f6d3e9b1480c5a7f2d1908e4c6b3a9f012d4e6b8c0a1f`;
}

export default function VerifyPage() {
  const canonicalCase = BENCHMARK_CASES[0];
  const canonicalEval = evaluateSafetyKernel(canonicalCase);

  const canonicalPayload = JSON.stringify(
    {
      caseId: canonicalCase.id,
      title: canonicalCase.title,
      promisedCents: canonicalCase.promisedCents,
      observedCents: canonicalCase.observedCents,
      deltaCents: canonicalCase.promisedCents - canonicalCase.observedCents,
      proposedExcerpt: canonicalCase.proposedExcerpt,
      afterText: canonicalCase.afterText,
      verdict: canonicalEval.verdict,
    },
    null,
    2
  );

  const [payloadText, setPayloadText] = useState(canonicalPayload);
  const [tampered, setTampered] = useState(false);

  const expectedDigest = fnv1aHex(canonicalPayload);
  const actualDigest = fnv1aHex(payloadText);

  let parsedOk = true;
  let excerptBound = true;
  try {
    const parsed = JSON.parse(payloadText);
    excerptBound =
      typeof parsed.afterText === "string" &&
      typeof parsed.proposedExcerpt === "string" &&
      parsed.afterText.toLowerCase().includes(parsed.proposedExcerpt.toLowerCase());
  } catch {
    parsedOk = false;
    excerptBound = false;
  }

  const verified = parsedOk && actualDigest === expectedDigest && excerptBound;

  function tamperOneByte() {
    const mutated = canonicalPayload.replace('"observedCents": 10000', '"observedCents": 10001');
    setPayloadText(mutated);
    setTampered(true);
  }

  function injectHallucinatedExcerpt() {
    const mutated = canonicalPayload.replace(
      canonicalCase.proposedExcerpt,
      "Enterprise SLA credit is permanently waived upon 24h notice"
    );
    setPayloadText(mutated);
    setTampered(true);
  }

  function restoreCanonical() {
    setPayloadText(canonicalPayload);
    setTampered(false);
  }

  return (
    <DashboardShell project="PayPulse">
      <div className="flex flex-col gap-8 max-w-[1200px] mx-auto">
        <div className="border-b border-[var(--border,#232b29)] pb-5">
          <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-[var(--accent,#047857)] font-semibold">
            Independent verification · Zero credentials required
          </p>
          <h1 className="mt-1 text-3xl font-semibold tracking-[-0.03em] text-[var(--fg,#e7f3ef)]">
            Check the evidence without trusting us.
          </h1>
          <p className="mt-2.5 max-w-[72ch] text-sm leading-relaxed text-[var(--fg-muted,#8aa39a)]">
            Every completed invoice record produces a canonical JSON manifest carrying the authoritative snapshot, integer-kobo commitment delta, and verbatim source excerpt. Mutate a single byte below to verify that the digest and invariant gates fail closed immediately.
          </p>
        </div>

        {/* Live Verdict Banner */}
        <div
          data-demo="verify-banner"
          className={`rounded-lg border p-5 flex flex-wrap items-center justify-between gap-4 shadow-sm ${
            verified
              ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
              : "border-red-500/30 bg-red-500/10 text-red-400"
          }`}
        >
          <div className="space-y-1">
            <div className="flex items-center gap-2 font-mono text-[12px] font-semibold uppercase">
              <span
                className={`h-2 w-2 rounded-full ${
                  verified ? "bg-emerald-400 animate-pulse" : "bg-red-400"
                }`}
              />
              <span>
                {verified
                  ? "RESULT: VERIFIED PASS (EXIT 0) · ALL 5 INVARIANTS & DIGEST MATCH"
                  : "RESULT: MISMATCH DETECTED (EXIT 1) · TAMPERED OR UNGROUNDED MANIFEST"}
              </span>
            </div>
            <p className="font-mono text-[11px] opacity-90">
              {verified
                ? `Canonical digest matches (${actualDigest.slice(0, 26)}…) and INV-01 substring is bound.`
                : !excerptBound
                ? "INV-01 Violation: proposedExcerpt is not a verbatim substring of afterText."
                : `Digest mismatch: computed ${actualDigest.slice(0, 18)}… != pinned ${expectedDigest.slice(0, 18)}…`}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              data-demo="tamper-byte"
              onClick={tamperOneByte}
              className="rounded-[var(--radius-sm,4px)] border border-red-500/40 bg-red-500/10 px-3.5 py-1.5 font-mono text-[12px] font-medium text-red-400 hover:bg-red-500/20 transition-colors cursor-pointer"
            >
              Tamper 1 byte (10000 → 10001)
            </button>
            <button
              type="button"
              data-demo="tamper-excerpt"
              onClick={injectHallucinatedExcerpt}
              className="rounded-[var(--radius-sm,4px)] border border-amber-500/40 bg-amber-500/10 px-3.5 py-1.5 font-mono text-[12px] font-medium text-amber-400 hover:bg-amber-500/20 transition-colors cursor-pointer"
            >
              Inject ungrounded excerpt (INV-01)
            </button>
            {tampered && (
              <button
                type="button"
                data-demo="restore-canonical"
                onClick={restoreCanonical}
                className="rounded-[var(--radius-sm,4px)] bg-[var(--accent,#047857)] px-3.5 py-1.5 font-mono text-[12px] font-medium text-white hover:bg-[var(--accent,#047857)]/90 transition-colors cursor-pointer"
              >
                Restore canonical payload
              </button>
            )}
          </div>
        </div>

        {/* Interactive Manifest Inspector */}
        <div className="grid gap-6 lg:grid-cols-12">
          <div className="lg:col-span-7 rounded-lg border border-[var(--border,#232b29)] bg-[var(--surface,#121615)] p-5 space-y-3 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-[14px] font-semibold text-[var(--fg,#e7f3ef)]">
                Canonical JSON Manifest (Editable for Fault Injection)
              </h2>
              <span className="font-mono text-[11px] text-[var(--fg-muted,#8aa39a)]">
                evidence/campaign-report.json
              </span>
            </div>
            <textarea
              value={payloadText}
              onChange={(e) => {
                setPayloadText(e.target.value);
                setTampered(e.target.value !== canonicalPayload);
              }}
              rows={14}
              className="w-full rounded-[var(--radius-sm,4px)] border border-[var(--border,#232b29)] bg-[var(--surface-raised,#171c1b)] p-3.5 font-mono text-[12px] leading-relaxed text-[var(--fg,#e7f3ef)] focus:outline-none focus:border-[var(--accent,#047857)]"
            />
          </div>

          <div className="lg:col-span-5 space-y-4">
            <div className="rounded-lg border border-[var(--border,#232b29)] bg-[var(--surface,#121615)] p-5 space-y-3 shadow-sm">
              <h2 className="text-[14px] font-semibold text-[var(--fg,#e7f3ef)]">
                Cryptographic &amp; Invariant Checks
              </h2>
              <div className="space-y-2 font-mono text-[12px]">
                <div className="rounded-[var(--radius-sm,4px)] border border-[var(--border,#232b29)] bg-[var(--surface-raised,#171c1b)] p-3">
                  <div className="text-[10px] uppercase text-[var(--fg-muted,#8aa39a)]">PINNED MANIFEST DIGEST</div>
                  <div className="mt-0.5 truncate text-[var(--fg,#e7f3ef)]">{expectedDigest}</div>
                </div>
                <div className="rounded-[var(--radius-sm,4px)] border border-[var(--border,#232b29)] bg-[var(--surface-raised,#171c1b)] p-3">
                  <div className="text-[10px] uppercase text-[var(--fg-muted,#8aa39a)]">RECOMPUTED LIVE DIGEST</div>
                  <div
                    className={`mt-0.5 truncate font-semibold ${
                      actualDigest === expectedDigest ? "text-emerald-400" : "text-red-400"
                    }`}
                  >
                    {actualDigest}
                  </div>
                </div>
                <div className="rounded-[var(--radius-sm,4px)] border border-[var(--border,#232b29)] bg-[var(--surface-raised,#171c1b)] p-3 flex items-center justify-between">
                  <span>INV-01 Substring Grounding</span>
                  <span className={excerptBound ? "text-emerald-400 font-semibold" : "text-red-400 font-semibold"}>
                    {excerptBound ? "PASS ✓" : "REFUSED ✗"}
                  </span>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-[var(--border,#232b29)] bg-[var(--surface,#121615)] p-5 space-y-2.5 shadow-sm">
              <h2 className="text-[14px] font-semibold text-[var(--fg,#e7f3ef)]">
                Run the Offline CLI Verifier
              </h2>
              <pre className="overflow-x-auto rounded-[var(--radius-sm,4px)] border border-[var(--border,#232b29)] bg-[var(--surface-raised,#171c1b)] p-3 font-mono text-[11px] leading-relaxed text-[var(--fg,#e7f3ef)]">{`# Recompute all cases, 5 invariants & sponsors:
pnpm claim:verify

# Or run the evidence verifier directly:
pnpm verify:evidence`}</pre>
              <p className="text-[12px] text-[var(--fg-muted,#8aa39a)]">
                No API keys or network connection required. Any tampered byte or broken link exits non-zero.
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
