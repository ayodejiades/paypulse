# WHAT_IS_REAL.md — Production Maturity & Boundaries

| Component | Verification Level | Evidence |
|---|---|---|
| **Deterministic Safety Kernel (`lib/kernel.ts`)** | **PROVEN_LOCAL_EXECUTION** | 10/10 fixtures verified across `INV-1`..`INV-5` (`pnpm verify:evidence`) |
| **Literal Evidence-Excerpt Binding (`INV-1`)** | **PROVEN_LOCAL_EXECUTION** | Unbound or paraphrased excerpts fail closed to `ABSTAIN_UNBOUND_EXCERPT` |
| **Zero-Signup `/proof`, `/demo`, & `/verify` Surfaces** | **LIVE_IN_BROWSER** | Inspectable in browser with 1-byte tamper detection |
| **Offline `DEMO_MODE` Fixture Store (`db/index.ts`)** | **LIVE_FALLBACK** | Automatic in-memory fixture store when `DATABASE_URL` is unset |
| **Invoices & Ledger Console (`/dashboard/items`)** | **LIVE_IN_BROWSER** | Paystack/Ramp grade kobo ledger with search, filtering, and line-item modal |
| **Invoice Creation & Due Date Scheduler (`/dashboard/create`)** | **LIVE_IN_BROWSER** | Real-time kernel audit preview with direct DB persistence via Server Action |
| **REST API Routes (`/api/invoices`, `/api/reminders/dispatch`)** | **PROVEN_LOCAL_EXECUTION** | Programmatic JSON API with integer kobo validation and carrier acknowledgments |
| **SendByte Communications Integration (`lib/sponsors/sendbyte.ts`)** | **PROVEN_LOCAL_EXECUTION** | Idempotent multi-channel SMS/WhatsApp dispatch with verified carrier receipts |
| **Sabilytics Telemetry (`lib/sponsors/sabilytics.ts`)** | **LIVE_IN_BROWSER** | Real-time link open and delivery event metrics with grace-period resilience |
| **Pxxl Cloud Configuration (`lib/sponsors/pxxl.ts`)** | **PROVEN_LOCAL_EXECUTION** | `africa-west-lagos` edge node routing and health latency probe |
