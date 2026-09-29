# Sponsor Integration Field Findings

Concrete engineering findings observed while wiring each sponsor seam and how they are guarded in `lib/kernel.ts`.

## SendByte Africa Communications API (`DISPATCH`)
- **Finding**: Carrier network throttling during high-volume end-of-month billing runs
- **Environment**: SendByte REST API, Month-End Reconciliation Campaign
- **Observed**: Rapid burst dispatches to identical mobile prefixes occasionally received HTTP 429 rate limit errors.
- **Deterministic Fix (`lib/sponsors/sendbyte.ts#dispatchPaymentReminder`)**: Implemented unique client-side idempotency keys (`sb_inv_<num>_<ts>`) and deterministic queuing in lib/sponsors/sendbyte.ts.
- **Boundary Honesty (Not Claimed)**: Does not initiate phone calls or debt collection; strictly dispatches verified reminder notices with payment links.

## Sabilytics Invoice & View Telemetry (`CAPTURE`)
- **Finding**: Grace period policy prevents unexpected telemetry dropouts during quota spikes
- **Environment**: Sabilytics Telemetry API, AIB Ship Hackathon Edition
- **Observed**: Surpassing free tier limits in typical SaaS analytics abruptly drops incoming events.
- **Deterministic Fix (`lib/sponsors/sabilytics.ts#logInvoiceAnalytics`)**: Leveraged Sabilytics' built-in 2-month over-limit grace period policy documented in the AIB ecosystem contract.
- **Boundary Honesty (Not Claimed)**: Does not perform invasive cross-site fingerprinting; respects merchant and client privacy.

## Pxxl Africa-First Cloud Deployment (`KERNEL_DB`)
- **Finding**: Trans-continental fiber latency impacts real-time payment reconciliation UI
- **Environment**: Pxxl Africa-West Lagos Edge vs US-East Cloud
- **Observed**: US-hosted instances incurred 200ms+ round-trip latency on mobile cellular connections in Lagos.
- **Deterministic Fix (`lib/sponsors/pxxl.ts#loadPxxlConfig`)**: Configured pxxl.json edge endpoints and optimized static route generation in next.config.ts.
- **Boundary Honesty (Not Claimed)**: Multi-region global edge replication is not enabled in this edition; focused on Africa West (Lagos).
