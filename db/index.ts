// db/index.ts — reads DATABASE_URL. In DEMO_MODE, reads/writes an in-memory store
// seeded from fixtures/ instead, so the vertical slice works with the Wi-Fi off.
import fs from "node:fs";
import path from "node:path";
import { asc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { isDemoMode } from "@/lib/demo-mode";
import { env } from "@/lib/env";
import { isOverdue } from "@/lib/schedule";
import { reminders, type Reminder } from "./schema";

type Store = { reminders: Reminder[]; nextId: number };

let memoryStore: Store | null = null;

function loadFixtureStore(): Store {
  const fixturePath = path.join(process.cwd(), "fixtures", "reminders.json");
  const seed: Array<{ title: string; dueAt: string }> = JSON.parse(fs.readFileSync(fixturePath, "utf-8"));
  const seeded = seed.map((row, i) => {
    const dueAt = new Date(row.dueAt);
    return { id: i + 1, title: row.title, dueAt, overdueFlag: isOverdue(dueAt), createdAt: new Date() };
  });
  return { reminders: seeded, nextId: seeded.length + 1 };
}

function getMemoryStore(): Store {
  if (!memoryStore) memoryStore = loadFixtureStore();
  return memoryStore;
}

let sqlClient: ReturnType<typeof postgres> | null = null;
function getDrizzle() {
  if (!sqlClient) {
    sqlClient = postgres(env.DATABASE_URL as string, { max: 5 });
  }
  return drizzle(sqlClient);
}

export async function listReminders(): Promise<Reminder[]> {
  if (isDemoMode()) {
    return [...getMemoryStore().reminders].sort((a, b) => +a.dueAt - +b.dueAt);
  }
  const db = getDrizzle();
  return db.select().from(reminders).orderBy(asc(reminders.dueAt));
}

export async function createReminder(title: string, dueAt: Date): Promise<Reminder> {
  const overdueFlag = isOverdue(dueAt);
  if (isDemoMode()) {
    const store = getMemoryStore();
    const row: Reminder = { id: store.nextId++, title, dueAt, overdueFlag, createdAt: new Date() };
    store.reminders.push(row);
    return row;
  }
  const db = getDrizzle();
  const [row] = await db.insert(reminders).values({ title, dueAt, overdueFlag }).returning();
  return row;
}
