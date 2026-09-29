# Bounty targeting — complete this BEFORE writing feature code

| Sponsor | $ (realistic 1st) | Stated criteria | Required tech | Do I already know it? | Submissions expected | Score |
|---|---|---|---|---|---|---|
| **SendByte** | ₦200,000 | Communications API for Africa: SMS & WhatsApp transactional delivery | SendByte API / Webhooks | Yes | 15 | 9.2 |
| **Sabilytics** | ₦200,000 | Insight-first analytics tracking user views and engagement | Sabilytics Telemetry API | Yes | 12 | 9.0 |
| **Pxxl** | ₦200,000 | Africa-first cloud deployment with automated container build and edge delivery | Pxxl Cloud Config | Yes | 10 | 8.8 |

## Chosen bounties (2–3, composable)
1. **SendByte — Multi-Channel Payment Notifications**: Automated SMS and WhatsApp invoice reminder dispatch with delivery receipts upon overdue invoice detection.
2. **Sabilytics — Invoice Engagement & View Telemetry**: Insight-first analytics logging client invoice viewing events and conversion timing.
3. **Pxxl — Africa-First Cloud Deployment**: Zero-downtime containerized edge deployment configured for African developer infrastructure.

## The one build that satisfies all of them
Architecture sentence: "PayPulse Africa ingests SME invoice commitments in integer kobo, tracks payment states with deterministic due-date gating, dispatches verified reminders via SendByte, captures invoice viewing telemetry via Sabilytics, and deploys as a containerized edge service on Pxxl."

## Criterion-by-criterion mapping
- **SendByte**: Functional integration in `lib/sponsors/sendbyte.ts`, deterministic fixture in `fixtures/sponsors/sendbyte.json`, test assertion in `tests/sponsors.test.mjs`, interactive dispatch on `/dashboard`.
- **Sabilytics**: Telemetry integration in `lib/sponsors/sabilytics.ts`, fixture in `fixtures/sponsors/sabilytics.json`, test assertion in `tests/sponsors.test.mjs`, live metric tile on `/dashboard`.
- **Pxxl**: Cloud deployment configuration in `pxxl.json`, fixture in `fixtures/sponsors/pxxl.json`, test assertion in `tests/sponsors.test.mjs`.
