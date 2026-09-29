# PROGRESS — aib-ship

Written by kit-autopilot after every step; last updated 2026-09-29T21:45:46.127Z. Do not edit by hand:
it is rewritten on the next run. Regenerate it any time with `kit-autopilot --progress --dir /Users/mac/Hackathons/aib-ship`.

- **Idea:** PayPulse Africa: Automated SME Invoicing and SMS/WhatsApp Payment Reminders
- **Track:** web2 · **Readiness:** scaffolded
- **Deadline:** 2026-09-30T23:59:59Z (Africa/Lagos)
- **Status:** 4 of 12 steps green, 0 need work, 8 not run yet

## Rules for any agent helping here

0. Read `AGENTS.md` in this folder before changing any code.
1. Work on the **first item under "Do next"** only. Finish it, then stop and re-run the command it names.
2. Never delete, regenerate or reformat files a "Done" step owns. Edit them only as far as your item needs.
3. Change the app through `docs/demo-path.json` and the code it points at. Do not stub, hardcode or fake a result to make a check pass.
4. Commit after each change that works (`git add -A && git commit -m "<what changed>"`). Never commit `.env`.
5. Never edit `.kit/`, `PROGRESS.md`, or anything under `~/.kitbuilder/`; the pipeline owns them.
6. If an item needs more than it describes, stop and say what is unclear instead of guessing.

## Do next

1. **implement** — not run yet. Run `kit-autopilot --resume --dir /Users/mac/Hackathons/aib-ship` (it starts at the first step that is not green).

## Done — do not redo

- **intake** — brief written to /Users/mac/.kitbuilder/staging/aib-ship/brief.json; search Q='PayPulse Africa: Automated SME Invoicing and SMS/WhatsApp Payment Reminders': 1 …. Owns: brief.json, docs/BOUNTIES.md, docs/HOURS.md, .kit/limits.json.
- **scaffold** — scaffolded web2 app with ledger theme, 3-stage demo path, and deterministic kernel. Owns: the app itself, README.md, AGENTS.md, docs/demo-path.json.
- **designAudit** — 3 skills, 0 blocking, 1 advisory -> .kit/design-audit.json. Owns: .kit/design-audit.json.
- **campaign** — executed kernel against 6 fixtures (10 / 10 (100%) decisions bound); adversarial negative invariant verified (rejected probe with ABSTAIN_UNBOUND_EXCERPT). Owns: evidence/campaign-report.json.
