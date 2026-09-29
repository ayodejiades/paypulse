// db/index.ts — reads DATABASE_URL. In DEMO_MODE, reads/writes an in-memory store
// seeded from fixtures/ instead, so the vertical slice works with the Wi-Fi off.
import fs from "node:fs";
import path from "node:path";
import { asc, desc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { isDemoMode } from "@/lib/demo-mode";
import { env, requireDatabaseUrl } from "@/lib/env";
import { isOverdue } from "@/lib/schedule";
import { records, reminders, type Record, type Reminder } from "./schema";

type Store = {
  records: Record[];
  reminders: Reminder[];
  nextRecordId: number;
  nextReminderId: number;
};

let memoryStore: Store | null = null;

function loadFixtureStore(): Store {
  const recordsFixture = path.join(process.cwd(), "fixtures", "records.json");
  const remindersFixture = path.join(process.cwd(), "fixtures", "reminders.json");

  let seededRecords: Record[] = [];
  if (fs.existsSync(recordsFixture)) {
    try {
      const seed: Array<{ title: string; createdAt?: string }> = JSON.parse(
        fs.readFileSync(recordsFixture, "utf-8"),
      );
      seededRecords = seed.map((row, i) => ({
        id: i + 1,
        title: row.title,
        createdAt: row.createdAt ? new Date(row.createdAt) : new Date(),
      }));
    } catch {
      seededRecords = [];
    }
  }

  let seededReminders: Reminder[] = [];
  if (fs.existsSync(remindersFixture)) {
    try {
      const seed: Array<{ title: string; dueAt: string }> = JSON.parse(
        fs.readFileSync(remindersFixture, "utf-8"),
      );
      seededReminders = seed.map((row, i) => {
        const dueAt = new Date(row.dueAt);
        return {
          id: i + 1,
          title: row.title,
          dueAt,
          overdueFlag: isOverdue(dueAt),
          createdAt: new Date(),
        };
      });
    } catch {
      seededReminders = [];
    }
  }

  if (seededRecords.length === 0 && seededReminders.length > 0) {
    seededRecords = seededReminders.map((r) => ({
      id: r.id,
      title: r.title,
      createdAt: r.createdAt,
    }));
  }

  return {
    records: seededRecords,
    reminders: seededReminders,
    nextRecordId: seededRecords.length + 1,
    nextReminderId: seededReminders.length + 1,
  };
}

function getMemoryStore(): Store {
  if (!memoryStore) memoryStore = loadFixtureStore();
  return memoryStore;
}

let sqlClient: ReturnType<typeof postgres> | null = null;
function getDrizzle() {
  if (!sqlClient) {
    sqlClient = postgres(requireDatabaseUrl(), { max: 5 });
  }
  return drizzle(sqlClient);
}

export async function listReminders(): Promise<Reminder[]> {
  if (isDemoMode() || !env.DATABASE_URL) {
    return [...getMemoryStore().reminders].sort((a, b) => +a.dueAt - +b.dueAt);
  }
  const db = getDrizzle();
  return db.select().from(reminders).orderBy(asc(reminders.dueAt));
}

export async function createReminder(title: string, dueAt: Date): Promise<Reminder> {
  const overdueFlag = isOverdue(dueAt);
  if (isDemoMode() || !env.DATABASE_URL) {
    const store = getMemoryStore();
    const row: Reminder = { id: store.nextReminderId++, title, dueAt, overdueFlag, createdAt: new Date() };
    store.reminders.push(row);
    store.records.push({ id: store.nextRecordId++, title, createdAt: row.createdAt });
    return row;
  }
  const db = getDrizzle();
  const [row] = await db.insert(reminders).values({ title, dueAt, overdueFlag }).returning();
  return row;
}

export async function listRecords(): Promise<Record[]> {
  if (isDemoMode() || !env.DATABASE_URL) {
    return [...getMemoryStore().records].sort((a, b) => +b.createdAt - +a.createdAt);
  }
  const db = getDrizzle();
  return db.select().from(records).orderBy(desc(records.createdAt));
}

export async function createRecord(title: string): Promise<Record> {
  if (isDemoMode() || !env.DATABASE_URL) {
    const store = getMemoryStore();
    const row: Record = { id: store.nextRecordId++, title, createdAt: new Date() };
    store.records.push(row);
    const dueAt = new Date(Date.now() + 86400000 * 7);
    store.reminders.push({ id: store.nextReminderId++, title, dueAt, overdueFlag: false, createdAt: row.createdAt });
    return row;
  }
  const db = getDrizzle();
  const [row] = await db.insert(records).values({ title }).returning();
  return row;
}

export async function probeDatabase(): Promise<{
  reachable: boolean;
  tablesPresent: boolean;
  detail: string;
  latencyMs: number;
}> {
  if (isDemoMode()) {
    const store = getMemoryStore();
    return {
      reachable: true,
      tablesPresent: true,
      detail: `demo mode — ${store.records.length} fixture rows, no database contacted`,
      latencyMs: 0,
    };
  }

  const start = performance.now();
  try {
    const client = postgres(requireDatabaseUrl(), { max: 1, timeout: 3 });
    const result = await client`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public' AND table_name IN ('records', 'reminders')
    `;
    await client.end();
    const latencyMs = Math.round(performance.now() - start);
    const tables = result.map((r: { [key: string]: unknown }) => String(r.table_name));
    const tablesPresent = tables.includes("records") || tables.includes("reminders");

    return {
      reachable: true,
      tablesPresent,
      detail: tablesPresent
        ? `tables: ${tables.join(", ")} (${latencyMs}ms)`
        : `reachable (${latencyMs}ms) but tables missing`,
      latencyMs,
    };
  } catch (err) {
    const latencyMs = Math.round(performance.now() - start);
    return {
      reachable: false,
      tablesPresent: false,
      detail: err instanceof Error ? err.message : String(err),
      latencyMs,
    };
  }
}
