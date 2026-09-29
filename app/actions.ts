"use server";

import { revalidatePath } from "next/cache";
import { createRecord, createReminder } from "@/db";

const MAX_TITLE = 200;

export async function submitRecord(formData: FormData): Promise<{ ok: boolean; error?: string }> {
  const title = String(formData.get("title") ?? "").trim();
  if (!title) return { ok: false, error: "title is required" };
  if (title.length > MAX_TITLE) {
    return { ok: false, error: `title must be ${MAX_TITLE} characters or fewer` };
  }
  try {
    await createRecord(title);
  } catch (err) {
    console.error("submitRecord failed:", err);
    return { ok: false, error: "could not save; the database is unavailable right now" };
  }
  revalidatePath("/");
  revalidatePath("/dashboard");
  return { ok: true };
}

export async function submitReminder(formData: FormData): Promise<{ ok: boolean; error?: string; overdueFlag?: boolean }> {
  const title = String(formData.get("title") ?? "").trim();
  const dueAtRaw = String(formData.get("dueAt") ?? "").trim();

  if (!title) return { ok: false, error: "title is required" };
  const dueAt = dueAtRaw ? new Date(dueAtRaw) : new Date(Date.now() + 86400000 * 7);
  if (Number.isNaN(dueAt.getTime())) return { ok: false, error: "a valid due date/time is required" };

  const row = await createReminder(title, dueAt);
  revalidatePath("/");
  revalidatePath("/dashboard");
  return { ok: true, overdueFlag: row.overdueFlag };
}

export async function createCustomerInvoiceAction(formData: FormData): Promise<{
  ok: boolean;
  error?: string;
  invoiceId?: number;
}> {
  const customerName = String(formData.get("customerName") ?? "").trim();
  const phone = String(formData.get("customerPhone") ?? "").trim() || "+234 800 000 0000";
  const location = String(formData.get("customerLocation") ?? "").trim() || "Lagos Commercial District";
  const commodity = String(formData.get("commodity") ?? "").trim() || "Merchandise Batch";
  const amountKobo = Number(formData.get("amountKobo")) || 0;
  const dueDateRaw = String(formData.get("dueDate") ?? "").trim();
  const channel = formData.get("channel") === "SMS" ? "SMS" : "WhatsApp";

  if (!customerName) return { ok: false, error: "Customer name is required" };
  if (amountKobo <= 0) return { ok: false, error: "Amount must be greater than zero kobo" };

  const dueAt = dueDateRaw ? new Date(dueDateRaw) : new Date(Date.now() + 86400000 * 14);
  if (Number.isNaN(dueAt.getTime())) return { ok: false, error: "Valid due date is required" };

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

  try {
    const record = await createRecord(invoicePayload);
    await createReminder(customerName, dueAt);

    revalidatePath("/");
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/items");
    return { ok: true, invoiceId: record.id };
  } catch (err) {
    console.error("createCustomerInvoiceAction error:", err);
    return { ok: false, error: "Could not persist invoice to database" };
  }
}

