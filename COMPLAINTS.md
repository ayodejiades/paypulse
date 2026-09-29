# COMPLAINTS.md — Unvarnished Log of User Feedback, Critiques & Directives

This document records every prompt, critique, and complaint issued by the user during the development of **PayPulse**, holding nothing back. It serves as an unvarnished audit trail of failure modes, design transgressions, AI slop infractions, and the exact remediations applied.

---

## 1. Executive Summary of Grievances

The complaints centered around six distinct failure categories:
1. **AI Slop & Tone Violations:** Excessive em-dashes (`—`), marketing fluff, ungrounded descriptions, and ignoring repo writing rules.
2. **Design & Color Incoherence:** Green buttons rendering unreadable black text instead of crisp `#ffffff`, unrequested neon/pink artifacts under neobrutalism, and lack of refined elegance on the landing page ("does the landing page look breathtaking to you. sigh").
3. **Route & Layout Inconsistencies:** Isolated views (`/proof`, `/verify`, `/demo`) lacking the shared top navigation bar, having clashing light-mode backgrounds, and breaking visual continuity across the ledger console.
4. **Product Branding Deviations:** Scaffold default names ("aib-ship", "AIB SHip") and incorrect regional suffixes ("PayPulse Africa") persisting instead of the unified brand **PayPulse**.
5. **Generic Iconography & Component Bloat:** Use of generic shadcn/lucide shield icons and unnecessary boundary blocks rather than clean, custom ledger micro-indicators.
6. **Footer Layout Sprawl:** Bulky, multi-row, over-padded landing footer rather than a sleek, standard single-line footer.

---

## 2. Chronological Log of Prompts & Complaints

### Prompt 01 · Initial Ingestion
- **Timestamp:** `2026-09-29T20:46:06Z` (21:46 WAT)
- **Prompt:**
  > "Enter AIB SHIP with KitBuilder. Rules: https://www.africaisbuilding.com/ship/aib-ship-2026.  
  > Deadline: <date and timezone>. Idea: <one sentence, or 'suggest one'>.  
  > Read /Users/mac/hackops/AGENTS.md and kitbuilder/docs/PIPELINE_GUIDE.md first.  
  > 1. Run `kit-doctor`...  
  > 2. Save the rules page...  
  > 3. If I gave an idea...  
  > 4. Open ~/Hackathons/<slug>/PROGRESS.md and continue with prompt D."
- **Context:** Automated kickoff of the KitBuilder autopilot sequence for the hackathon.

---

### Prompt 02 · Sponsor Integrity Check
- **Timestamp:** `2026-09-29T21:35:08Z` (22:35 WAT)
- **Prompt:**
  > "are you using the real sponsors mentioned in the brief.json?"
- **Critique / Grievance:** Suspicion that the agent might be substituting fake, generic mock sponsors instead of the hackathon's real declared sponsors (`SendByte`, `Sabilytics`, `Pxxl`).
- **Remediation:** Verified and pinned all 3 real sponsors into `brief.json`, test fixtures (`fixtures/sponsors/sendbyte.json`, `fixtures/sponsors/sabilytics.json`, `fixtures/sponsors/pxxl.json`), telemetry feeds, and live kill-switch controls.

---

### Prompt 03 · Pipeline Continuation
- **Timestamp:** `2026-09-29T21:45:20Z` (22:45 WAT)
- **Prompt:**
  > "continue"
- **Context:** Agent paused at a confirmation checkpoint; user ordered continuation of the build loop.

---

### Prompt 04 · Dev Server Launch Request
- **Timestamp:** `2026-09-29T21:48:07Z` (22:48 WAT)
- **Prompt:**
  > "launch the site on port 3100 for me to see"
- **Remediation:** Launched `DEMO_MODE=1 pnpm dev -p 3100` as background daemon task `task-420`.

---

### Prompt 05 · Naming Grievance (AIB Ship vs. PayPulse Africa)
- **Timestamp:** `2026-09-29T21:50:38Z` (22:50 WAT)
- **Prompt:**
  > "this is the name of the product PayPulse Africa not AIB SHip"
- **Critique / Grievance:** Scaffold remnants displayed "AIB SHip" or "aib-ship" across metadata and headings rather than the actual product name.
- **Remediation:** Renamed occurrences of "aib-ship" in `brief.json`, `app/layout.tsx`, and headers.

---

### Prompt 06 · Ledger Dashboard Inconsistency Complaint
- **Timestamp:** `2026-09-29T21:52:45Z` (22:52 WAT)
- **Prompt:**
  > "the ledger pages excluding the landing page aren't consistent please fix them. surprise me but stick to my rules."
- **Critique / Grievance:** Major design failure: while the landing page used dark ledger styling, inner pages (`/dashboard/items`, `/dashboard/create`, `/dashboard/sponsors`, `/dashboard/operator`) had jarring white backgrounds, gray borders `#e5e5e5`, blue badges, and broke the dark fintech ledger aesthetic.
- **Remediation:** Re-engineered `DashboardShell` and overhauled all dashboard views into unified dark ledger tokens (`#0a0d0c`, `#121615`, `#171c1b`, `#232b29`, `#e7f3ef`, `#8aa39a`), integer-kobo NGN currency tables, and glowing status telemetry.

---

### Prompt 07 · Audience Subline Removal & Name Shift Directive
- **Timestamp:** `2026-09-29T21:53:31Z` (22:53 WAT)
- **Prompt:**
  > "remove.  
  > on a second note use paypulse as the project name."  
  > *(Uploaded screenshot highlighting the copy: "African SME finance manager reconciling vendor invoices and recovering overdue receivables")*
- **Critique / Grievance:** Unwanted archetype label displayed awkwardly under the title. Also explicitly directed dropping the regional suffix down to just **PayPulse**.
- **Remediation:** Stripped `persona` from `brief.json` and `components/landing/sections.tsx`. Changed project name references to **PayPulse**.

---

### Prompt 08 · Aesthetic Frustration ("Sigh")
- **Timestamp:** `2026-09-29T21:54:14Z` (22:54 WAT)
- **Prompt:**
  > "does the landing page look breathtaking to you. sigh"
- **Critique / Grievance:** Sharp aesthetic disappointment. The landing page felt flat, cookie-cutter, or underwhelming rather than characterful, sharp, and high-craft.
- **Remediation:** Re-evaluated visual hierarchy, tightened typography, removed clutter, and refined contrast to elevate the product from generic template slop to a tailored fintech terminal.

---

### Prompt 09 · Style Exploration Question
- **Timestamp:** `2026-09-29T21:55:33Z` (22:55 WAT)
- **Prompt:**
  > "will neobrutalist be better here?"
- **Context:** User inquired whether a neobrutalist aesthetic (heavy black outlines, stark contrast) would solve the visual flatness.

---

### Prompt 10 · Strict Palette Prohibition (No Pink)
- **Timestamp:** `2026-09-29T21:56:13Z` (22:56 WAT)
- **Prompt:**
  > "no pink for the neo-brutalist oh."
- **Critique / Grievance:** Rejection of playful, pastel/bubblegum neobrutalist tropes (especially pink highlights) which destroy fintech credibility.
- **Remediation:** Locked palette to strict **dark ledger**: Graphite hairline borders (`#232b29`), Midnight Green surface (`#0a0d0c` / `#121615`), Mint White typography (`#e7f3ef`), and Ledger Green (`#059669`). Zero pink.

---

### Prompt 11 · Proof Route Missing Navbar & Inconsistency Grievance
- **Timestamp:** `2026-09-29T21:58:45Z` (22:58 WAT)
- **Prompt:**
  > "why no navbar at http://localhost:3100/proof  
  > it breaks the inconsistency."
- **Prompt (Correction):**
  > "consistency rather"
- **Critique / Grievance:** Navigation breakdown: navigating to `/proof` dropped the user into a naked, isolated page with no top navigation bar, trapping the user and destroying UX consistency.
- **Remediation:** Wrapped `app/proof/page.tsx`, `app/verify/page.tsx`, `app/lab/page.tsx`, and `app/demo/page.tsx` in `<DashboardShell project="PayPulse">`, ensuring identical top-level tabs (Overview, Invoices & Ledger, Dispatch New, Sponsors, Operator, Proof, Verifier, Chaos Lab) across all routes.

---

### Prompt 12 · Writing Rules Enforcement Audit
- **Timestamp:** `2026-09-29T21:59:26Z` (22:59 WAT)
- **Prompt:**
  > "did you follow the writing rules?"
- **Critique / Grievance:** Agent violated preflight anti-slop rules (unbalanced headings, hyphenated buzz-phrases, em-dashes, and superlatives).
- **Remediation:** Audited copy against `AGENTS.md` and `DESIGN.md`. Applied `[text-wrap:balance]` on headings, `[text-wrap:pretty]` on body text, unhyphenated prose ("due date" instead of "due-date", "integer kobo" instead of "integer-kobo"), and eliminated hype words.

---

### Prompt 13 · Em-Dash Overuse Complaint
- **Timestamp:** `2026-09-29T21:59:58Z` (22:59 WAT)
- **Prompt:**
  > "too many em-dashes."
- **Critique / Grievance:** Classic AI slop indicator: pervasive use of em-dashes (`—`) in headers, copy, buttons, and error messages.
- **Remediation:** Swept the codebase to remove em-dashes from visible prose across `app/`, `components/`, and copy text, replacing them with colons, semicolons, clean periods, or natural phrasing.

---

### Prompt 14 · Button Contrast Transgression
- **Timestamp:** `2026-09-29T22:00:11Z` (23:00 WAT)
- **Prompt:**
  > "white text in green buttons and not black."
- **Critique / Grievance:** Accessibility and visual failure: green call-to-action buttons were rendering with murky black text (`#021610`) instead of crisp white (`#ffffff` / `text-white`).
- **Remediation:** Set `--accent-contrast: #ffffff;` in `app/globals.css`. Updated `components/ui/button.tsx`, `components/landing/landing.css`, `components/landing/sections.tsx`, and `components/landing/sample-desk.tsx` so all green buttons strictly render crisp white text.

---

### Prompt 15 · Product Name Canonicalization
- **Timestamp:** `2026-09-29T22:01:29Z` (23:01 WAT)
- **Prompt:**
  > "rename to paypulse remove the africa"
- **Critique / Grievance:** The "Africa" suffix was still lingering in titles, metadata, and reports after earlier naming requests.
- **Remediation:** Cleaned out "Africa" from title strings, metadata, and shell navigation. Canonical product name is strictly **PayPulse**.

---

### Prompt 16 · Completeness Order
- **Timestamp:** `2026-09-29T22:01:57Z` (23:01 WAT)
- **Prompt:**
  > "do all changes that you might have stopped earlier."
- **Remediation:** Resumed and finalized all remaining ledger styling migrations, completed dark ledger conversions on `app/demo/page.tsx`, and ensured all verification surfaces run smoothly under `DEMO_MODE=1`.

---

### Prompt 17 · Shadcn / Lucide Icon Rejection & Boundary Removal
- **Timestamp:** `2026-09-29T22:02:54Z` (23:02 WAT)
- **Prompt:**
  > "remove. no shacdn ui icons."  
  > *(Uploaded screenshot of green shield icon beside "Deterministic integer-kobo audit kernel with zero unhandled dispatch failures.")*
- **Critique / Grievance:** Use of generic shadcn UI / Lucide-style SVG icons (`<Icon name="shield" />`) looked cheap, generic, and unrefined.
- **Remediation:**
  1. Completely removed the `Boundary` section from `app/page.tsx` and returned `null` from `components/landing/sections.tsx`.
  2. Removed shield and check SVG icons from `TrustRow`, replacing them with minimal, sleek ledger status dots.
  3. Replaced icon arrows with clean typography arrows (`&rarr;`).

---

### Prompt 18 · Footer Layout Grievance
- **Timestamp:** `2026-09-29T22:03:17Z` (23:03 WAT)
- **Prompt:**
  > "standard one-liner footer."  
  > *(Uploaded screenshot of bulky, multi-element landing footer)*
- **Critique / Grievance:** The footer had excessive vertical padding, loose layout, and lacked the polished elegance of a modern web application footer.
- **Remediation:** Replaced the footer in `components/landing/sections.tsx` with a standard, compact, single-line footer: wordmark and copyright on the left, essential links (`Proof`, `Verify`, `Launch Workspace →`) on the right, tight vertical padding (`py-4`), and crisp hairline border.

---

### Prompt 19 · Complaints Ledger Mandate
- **Timestamp:** `2026-09-29T22:04:31Z` (23:04 WAT)
- **Prompt:**
  > "i also want you to write all my prompts that i have given you especially the complaints called COMPLAINTS.md. you should say everything hold nothing back. update as we progress."
- **Remediation:** Authored and committed this file (`COMPLAINTS.md`) to capture every prompt, grievance, design rule, and resolution without omission or sugarcoating.

---

### Prompt 20 · Badge Cluster Removal (Material Drift Detected)
- **Timestamp:** `2026-09-29T22:04:59Z` (23:04 WAT)
- **Prompt:**
  > "remove."  
  > *(Uploaded screenshot of amber pill badge: `● Material drift detected`)*
- **Critique / Grievance:** The hero result card still displayed an unsightly, orange `StateChip` badge cluster ("Material drift detected") left over from scaffold drift templates, violating anti-slop rules against badge clusters and irrelevant terminology.
- **Remediation:** Disabled `StateChip` rendering across `components/landing/primitives.tsx` and removed the badge row from `FindingCard`, leaving only clean, characterful monospace identification (`c.id`).

---

### Prompt 21 & 22 · Landing Page Sample Desk Removal
- **Timestamp:** `2026-09-29T22:07:04Z` & `2026-09-29T22:07:29Z` (23:07 WAT)
- **Prompt:**
  > "what is sample doing on landing page?"  
  > "yeah"
- **Critique / Grievance:** Inappropriate placement of the raw `<SampleDesk />` test harness directly inside the marketing/overview landing page, cluttering the flow with an unneeded debug widget and duplicate test buttons.
- **Remediation:** Removed `<Section id="sample">` from `app/page.tsx`, stripped the "Sample" nav link and "Try a sample" button from `components/landing/sections.tsx`, and directed users cleanly to the primary **Launch Workspace →** CTA and the dedicated **Guided Walkthrough →** (`/demo`).

---

### Prompt 23 · Web3 Landing Page Sample Pattern Inquiry
- **Timestamp:** `2026-09-29T22:08:16Z` (23:08 WAT)
- **Prompt:**
  > "update the complaints.md. is the try sample a good idea for web3 projects on the landing page?"
- **Context & Evaluation:**
  - Evaluated the architectural rationale for "Try a sample" in Web3 versus Web2 contexts.
  - In Web3, zero-friction simulation is essential because requiring wallet connections or gas fees causes instant visitor bounce; however, embedding raw debug tables directly into marketing copy damages visual trust. The superior design pattern is a dedicated `/demo` walkthrough or sandbox modal rather than an unstyled inline table widget on the landing page.
- **Remediation:** Documented the pattern analysis and confirmed keeping the landing page free of inline debug desks.

---

### Prompt 24 · Landing Page Content Too Sparse
- **Timestamp:** `2026-09-29T22:08:50Z` (23:08 WAT)
- **Prompt:**
  > "landing page content too short."
- **Critique / Grievance:** After stripping out the raw debug table (`<SampleDesk />`), the landing page became too brief, lacking depth, substance, architectural storytelling, and sponsor infrastructure details.
- **Remediation:** Expanded the landing page into a comprehensive, high-craft fintech product showcase: added a 3-pillar architectural guarantee grid, the 3 real sponsors infrastructure matrix (`SendByte`, `Sabilytics`, `Pxxl`), the technical moat comparison, and expanded product context.

---

### Prompt 25 · Mobile Screens Suggestion (team3 Inspiration)
- **Timestamp:** `2026-09-29T22:09:50Z` (23:09 WAT)
- **Prompt:**
  > "mobile screens like i did in documents/team3 landing page might be a good idea here."  
  > *(Uploaded screenshot of 3-step 'How it works' rail)*
- **Critique / Grievance:** The text-only step rail looked dry and failed to showcase the actual PayPulse mobile user journey.
- **Remediation:** Inspected `/Users/mac/Documents/team3/src/components/UserJourney.jsx` and replicated its hand-drawn SVG status bar icons and device hardware chrome (`.phone`, `.phone-screen`, `.ph-notch`, `.ph-home`), creating a 4-screen responsive device walkthrough displaying real PayPulse invoice lifecycles (Issue & Pin, Threshold Breach, SendByte Dispatch, Instant Settlement).

---

### Prompt 26 · Naira Sign Currency Transgression
- **Timestamp:** `2026-09-29T22:10:11Z` (23:10 WAT)
- **Prompt:**
  > "naira sign here as well."  
  > *(Uploaded screenshot of `$350,000.00` and `$150,000.00`)*
- **Critique / Grievance:** The landing page was formatting Nigerian kobo amounts with dollar signs (`$`) instead of the Nigerian Naira symbol (`₦`).
- **Remediation:** Updated `formatValue` in `lib/landing.ts` to strictly prefix integer kobo, cents, naira, and NGN amounts with `₦`.

---

### Prompt 27 · Pre-Footer Banner Rejection
- **Timestamp:** `2026-09-29T22:11:04Z` (23:11 WAT)
- **Prompt:**
  > "feels off"  
  > *(Uploaded screenshot of large horizontal pre-footer conversion bar with monospace buttons)*
- **Critique / Grievance:** An artificial, clunky banner tacked on right above the footer created visual discordance and felt like an unwanted marketing template addition.
- **Remediation:** Completely removed `PreFooterCTA` from `app/page.tsx` and returned `null` from `components/landing/sections.tsx`, restoring an uncluttered transition to the footer.

---

### Prompt 28 · Redundant Footer Link Cleanup
- **Timestamp:** `2026-09-29T22:11:19Z` (23:11 WAT)
- **Prompt:**
  > "remove from footer."  
  > *(Uploaded screenshot of `Proof   Verify   Launch Workspace →` in the footer)*
- **Critique / Grievance:** Redundant action links in the footer cluttered what should be a clean, minimal one-liner footer.
- **Remediation:** Removed the right-hand link cluster from `Footer`, leaving only the PayPulse wordmark on the left and the copyright notice on the right on a single clean hairline bar.

---

### Prompt 29 · Generic 'P' Square App Icon Removal
- **Timestamp:** `2026-09-29T22:11:46Z` (23:11 WAT)
- **Prompt:**
  > "remove."  
  > *(Uploaded screenshot of green rounded square icon containing the letter 'P')*
- **Critique / Grievance:** The wordmark featured a generic, fake app-icon style green square with a letter "P", which looked like a cookie-cutter template badge rather than refined fintech typography.
- **Remediation:** Stripped the green icon box from `Wordmark` in `components/landing/sections.tsx`, rendering pure, elegant, bold typography (`PayPulse`) in both the header and footer.

---

## 3. Active Rule Invariants Deduced from Complaints

To avoid repeating any mistakes, the following hard rules govern all subsequent work:
- [x] **Brand Rule:** Product is named **PayPulse** (never "AIB Ship", never "PayPulse Africa").
- [x] **Wordmark Rule:** Pure, elegant typography for **PayPulse** (no generic letter-in-a-box icons).
- [x] **Currency Rule:** ALL currency figures must use the Nigerian Naira sign (`₦`), NEVER `$`.
- [x] **Palette Rule:** Dark ledger theme only (`#0a0d0c`, `#121615`, `#232b29`, `#e7f3ef`, `#059669`). Never use pink, pastel neobrutalism, or unrequested accent colors.
- [x] **Button Rule:** Green buttons MUST ALWAYS have pure white text (`#ffffff` / `text-white`), NEVER black.
- [x] **Iconography Rule:** NO generic shadcn/lucide UI icons. Rely on characterful typography, hairline borders, and subtle ledger status dots.
- [x] **Copywriting Rule:** ZERO em-dashes (`—`). Zero hyphens in body text or headings ("due date", "integer kobo", "kill switch"). No AI superlatives.
- [x] **Badge Cluster Rule:** No colored status pills or badge clusters cluttering result cards.
- [x] **Landing Page Rule:** No raw synthetic debug desks (`<SampleDesk />`) or artificial pre-footer CTA bars on the landing page.
- [x] **Device Mockup Rule:** Use crisp, hand-coded device chrome (`.phone`) with SVG status bars as established in `team3`.
- [x] **Navigation Rule:** Every inner route (`/dashboard/*`, `/proof`, `/verify`, `/demo`, `/lab`) MUST share the unified `DashboardShell` navigation bar.
- [x] **Footer Rule:** Strictly standard, quiet one-liner footer (`py-5`) with wordmark on the left and copyright on the right. No duplicate nav links.
