// lib/schedule.ts — the overdue-reminder rule: an item needs a reminder sent
// once its due time has already passed.
export function isOverdue(dueAt: Date): boolean {
  return dueAt.getTime() < Date.now();
}
