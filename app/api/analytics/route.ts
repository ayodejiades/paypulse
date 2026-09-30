import { NextResponse } from "next/server";
import { getInvoiceAnalyticsSummary, logInvoiceAnalytics, recentAnalyticsEvents } from "@/lib/sponsors/sabilytics";

export const dynamic = "force-dynamic";

const ALLOWED = new Set(["invoice_viewed", "reminder_link_clicked"]);

export async function GET() {
  return NextResponse.json({ ok: true, summary: getInvoiceAnalyticsSummary(), recent: recentAnalyticsEvents() });
}

/** Browser-reported events. invoice_created and reminder_dispatched are recorded by the server itself. */
export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const event = String(body.event ?? "");
  const invoiceNumber = String(body.invoiceNumber ?? "").trim();
  if (!ALLOWED.has(event) || !invoiceNumber) {
    return NextResponse.json({ ok: false, error: "event must be invoice_viewed or reminder_link_clicked, with an invoiceNumber" }, { status: 400 });
  }
  const result = await logInvoiceAnalytics({ event, invoiceNumber, source: "dashboard" });
  return NextResponse.json({ ok: true, ...result });
}
