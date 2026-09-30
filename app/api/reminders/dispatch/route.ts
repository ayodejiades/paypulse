import { NextResponse } from "next/server";
import { dispatchPaymentReminder } from "@/lib/sponsors/sendbyte";
import { logInvoiceAnalytics } from "@/lib/sponsors/sabilytics";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const invoiceNumber = String(body.invoiceNumber ?? "").trim();
    const recipient = String(body.recipient ?? "").trim();
    const channel = body.channel === "sms" ? "sms" : "whatsapp";
    const amountDueNaira = Number(body.amountDueNaira) || 0;
    const dueDate = String(body.dueDate ?? new Date().toISOString().slice(0, 10)).trim();
    const merchantName = String(body.merchantName ?? "PayPulse Merchant").trim();

    if (!invoiceNumber) {
      return NextResponse.json({ ok: false, error: "invoiceNumber is required" }, { status: 400 });
    }
    if (!recipient) {
      return NextResponse.json({ ok: false, error: "recipient phone number is required" }, { status: 400 });
    }

    const receipt = await dispatchPaymentReminder({
      invoiceNumber,
      recipient,
      channel,
      amountDueNaira,
      dueDate,
      merchantName,
    });

    await logInvoiceAnalytics({ event: "reminder_dispatched", invoiceNumber, source: `sendbyte_${channel}` });

    return NextResponse.json(
      {
        ok: true,
        message: "SendByte reminder dispatched successfully",
        receipt,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("POST /api/reminders/dispatch failed:", err);
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : "Dispatch failed" },
      { status: 500 }
    );
  }
}
