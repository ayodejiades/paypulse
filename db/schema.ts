// db/schema.ts — one example table, migrated with drizzle-kit (see drizzle.config.ts).
import { pgTable, serial, text, timestamp, boolean } from "drizzle-orm/pg-core";

export const reminders = pgTable("reminders", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  dueAt: timestamp("due_at", { withTimezone: true }).notNull(),
  overdueFlag: boolean("overdue_flag").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type Reminder = typeof reminders.$inferSelect;
