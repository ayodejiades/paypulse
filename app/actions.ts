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
    return { ok: false, error: "could not save — the database is unavailable right now" };
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
