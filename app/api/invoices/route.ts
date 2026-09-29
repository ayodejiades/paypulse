import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { listRecords, createRecord, createReminder } from "@/db";
import { evaluateDeterministicKernel } from "@/lib/kernel";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const records = await listRecords();
    return NextResponse.json({
      ok: true,
      count: records.length,
      records,
    });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : "Failed to fetch invoices" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const customerName = String(body.customerName ?? "").trim();
    const amountKobo = Number(body.amountKobo) || 0;
    const dueDateStr = String(body.dueDate ?? "").trim();
    const channel = body.channel === "SMS" ? "SMS" : "WhatsApp";
    const phone = String(body.customerPhone ?? "+234 800 000 0000").trim();
    const location = String(body.customerLocation ?? "Lagos Commercial District").trim();
    const commodity = String(body.commodity ?? "General Merchandise Wholesale").trim();

    if (!customerName) {
      return NextResponse.json({ ok: false, error: "customerName is required" }, { status: 400 });
    }
    if (amountKobo <= 0) {
      return NextResponse.json({ ok: false, error: "amountKobo must be greater than 0" }, { status: 400 });
    }

    const dueAt = dueDateStr ? new Date(dueDateStr) : new Date(Date.now() + 86400000 * 14);
    if (Number.isNaN(dueAt.getTime())) {
      return NextResponse.json({ ok: false, error: "Invalid dueDate format" }, { status: 400 });
    }

    // Build structured payload for persistence
    const invoicePayload = JSON.stringify({
      customerName,
      customerPhone: phone,
      customerLocation: location,
      commodity,
      amountKobo,
      totalKobo: amountKobo,
      dueDate: dueAt.toISOString().slice(0, 10),
      channel,
    });

    const record = await createRecord(invoicePayload);
    const reminder = await createReminder(customerName, dueAt);

    // Evaluate kernel invariants for state verification
    const kernelDecision = evaluateDeterministicKernel({
      caseId: `inv-${record.id}`,
      sourceCaptureT0: `Invoice #${record.id}: ${customerName} owes NGN ${(amountKobo / 100).toLocaleString("en-NG", { minimumFractionDigits: 2 })} due on ${dueAt.toISOString().slice(0, 10)}.`,
      extractedExcerpt: `${customerName} owes NGN ${(amountKobo / 100).toLocaleString("en-NG", { minimumFractionDigits: 2 })} due on ${dueAt.toISOString().slice(0, 10)}`,
      promisedCents: amountKobo,
      observedCents: 0,
    });

    revalidatePath("/");
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/items");

    return NextResponse.json(
      {
        ok: true,
        message: "Invoice successfully created and scheduled",
        invoice: {
          id: record.id,
          customerName,
          amountKobo,
          dueDate: dueAt.toISOString().slice(0, 10),
          channel,
          reconciliationState: "AWAITING_DUE_DATE",
          kernelDecision,
        },
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("POST /api/invoices failed:", err);
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : "Failed to create invoice" },
      { status: 500 }
    );
  }
}
