"use server";

import { revalidatePath } from "next/cache";
import { createReminder } from "@/db";

export async function submitReminder(formData: FormData): Promise<{ ok: boolean; error?: string; overdueFlag?: boolean }> {
  const title = String(formData.get("title") ?? "").trim();
  const dueAtRaw = String(formData.get("dueAt") ?? "").trim();

  if (!title) return { ok: false, error: "title is required" };
  const dueAt = new Date(dueAtRaw);
  if (!dueAtRaw || Number.isNaN(dueAt.getTime())) return { ok: false, error: "a valid due date/time is required" };

  const row = await createReminder(title, dueAt);
  revalidatePath("/");
  return { ok: true, overdueFlag: row.overdueFlag };
}
