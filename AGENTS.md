# aib-ship — project brief & agent build rules

## Start here
If `PROGRESS.md` exists, read it before anything else. kit-autopilot rewrites it after every step: what is done (do not redo it), what is left in order, and the exact command for each item. Follow its rules, work on its first item only, and commit when it works.

## The idea
PayPulse Africa: Automated SME Invoicing and SMS/WhatsApp Payment Reminders

## Chosen bounties
- **Primary Hackathon Track** — End-to-end deterministic kernel and `/proof` verification

## The demo path
1. Welcome to the overview
2. Launch the live demo workspace
3. Create a new record
4. Submit and verify real-time state

Only the demo path and `/proof` verification surface are built. Everything else is stubbed, hardcoded, or deleted.

## How the product earns trust
- **Code decides, models suggest.** Anything that must be right (money, dates, matches, pass/fail) is computed by plain functions in `lib/kernel.ts` (`lib/solver.ts` on web3), never by an LLM's say-so. The file name is plumbing; in the UI, call that logic what this product's user would.
- **Show how it was checked.** `app/proof/page.tsx` runs the same logic on the committed cases (`evidence/campaign-report.json`, or `PROOF_RUNS.json` on web3): a normal case, a tricky-but-fine case, and one it must refuse. Title it in the product's terms, not "Proof".
- **Every number is measured.** Run `pnpm claim:verify` after changing code; a number that is not in the evidence files does not go on screen or in the README.
- **Say what it does not do.** `WHAT_IS_REAL.md` marks each part built, partial or not wired.

## Theme and components
Theme: **ledger**. Components available: Button, Card, Input, Select, Table, Stat, Badge, EmptyState, Nav, Sidebar, Toast, Skeleton, Illustration.

## DEMO_MODE
`DEMO_MODE=1` replaces every external dependency with on-disk fixtures under `fixtures/`. The health endpoint reports `demoMode`. The demo path must complete with the Wi-Fi off.

## Anti-AI Slop & Design Standards
Strict design manifesto: 4-sided hairline borders, characterful typography, WCAG AA contrast. Never write gradients, badge clusters, 1-sided border stripes, or fake div screenshots. All copy must be concrete; zero AI superlatives ('supercharge', 'seamless', 'next-gen', 'revolutionary'). Preflight Check 13 enforces this.
Always use the production-grade `<PipelineFlow />`, `<TelemetryTile />`, and `<CodeDiff />` components.
Crucially, utilize the non-slop agent skills located in `/Users/mac/hackops/skills/mblode-agent-skills/skills` (e.g., `ui-verification`, `dx-audit`, `ax-audit`) to validate architecture and UX.

## Sponsor Verification Contract
Every chosen sponsor must satisfy the 4-part verification contract (Preflight Check 9): (1) functional code import/call, (2) deterministic fixture under fixtures/sponsors/<slug>.json, (3) test assertion covering the fixture, (4) interactive step on docs/demo-path.json.

## Evidence & Technical Moat
Maintain docs/EVIDENCE.md (linking rubrics to line-level code and demo timestamps), docs/HARD_THING.md (documenting the technical moat and failure state machine), CLAIM_LEDGER.md, and WHAT_IS_REAL.md. Preflight Check 12 enforces these.

## Working rules
Rules for anyone (human or agent) working in this repo: commit after every working state; never break the demo path; hard feature freeze at 75% of the event window (see `docs/HOURS.md`) — after that, only video, README, submission.
