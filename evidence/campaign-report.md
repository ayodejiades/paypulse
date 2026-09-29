# Campaign Report

Computed from `evidence/campaign-report.json` and `lib/kernel.ts` by `tools/verify-evidence.ts`.

- Generated: 2026-09-29T21:45:45.983Z
- Mechanism: deterministic-kernel-v2 · mode: EVALUATE
- sha256: `8573c704e9a496b244e5c7e977c1a6748ec13e16a06976a3bf89b036ec9c0e7a`

## Executed Fixture Matrix

| Case ID | Category | Expected State | Kernel Verdict | Delta (c) | Case Digest | Status |
|---|---|---|---|---|---|---|
| `SME-CASE-01` | PARTIAL_PAYMENT_REMITTANCE | `MATERIAL_DRIFT_DETECTED` | `MATERIAL_DRIFT_DETECTED` | 20000000c | `0x2b64b74566f5f49c813031655b41e81e` | PASS |
| `SME-CASE-02` | BENIGN_INVOICE_FORMAT_REVISE | `BENIGN_CONTROL_NO_DRIFT` | `BENIGN_CONTROL_NO_DRIFT` | 0c | `0x975dee508a6083b42c016579093c7970` | PASS |
| `SME-CASE-03` | MERCHANT_CLAIM_AWAITING_CLEARING | `WAITING_TO_VERIFY` | `WAITING_TO_VERIFY` | 12000000c | `0x18ec2634140ffe2a0975402fdba39385` | PASS |
| `SME-CASE-04` | VERIFIED_FULL_SETTLEMENT | `VERIFIED_FIXED` | `VERIFIED_FIXED` | 12000000c | `0xa73030ffc1170ca43c205d384f359565` | PASS |
| `SME-CASE-05` | UNBOUND_HALLUCINATED_CLAIM | `ABSTAIN_UNBOUND_EXCERPT` | `ABSTAIN_UNBOUND_EXCERPT` | 50000000c | `0x34aba79c049c3a5f7eed81c2b56a1c23` | PASS |
| `SME-CASE-06` | AMBIGUOUS_POLICY_TERMS | `ABSTAIN_AMBIGUOUS_SOURCE` | `ABSTAIN_AMBIGUOUS_SOURCE` | 0c | `0x96220457f5bc4ced6ec0a6a019144dd8` | PASS |

## Adversarial Defense & Negative Invariant Proof

- **Synthetic Negative Probe**: Rejected (`ABSTAIN_UNBOUND_EXCERPT`)
- **Negative Invariant**: Kernel/solver strictly rejects tampered, forged, or unbound inputs (verdict !== "ON_TRACK")
- **Defense Mechanism**: Chronological Scheduling & Conflict Detection: Claim excerpt lacks verbatim binding to source input.
- **Proof Status**: PASS (Deterministic fail-closed rejection verified)
