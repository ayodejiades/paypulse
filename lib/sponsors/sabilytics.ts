import fs from "node:fs";
import path from "node:path";
import { isDemoMode } from "@/lib/demo-mode";

export interface SabilyticsEvent {
  event: string;
  invoiceNumber: string;
  source?: string;
  conversionStatus?: string;
  viewDurationSeconds?: number;
}

export interface RecordedEvent extends SabilyticsEvent {
  timestamp: string;
}

export interface SabilyticsSummary {
  invoicesCreated: number;
  remindersSent: number;
  totalViews: number;
  reminderConversions: number;
  gracePeriodActive: boolean;
  retentionMonths: number;
  /** "live" when events are forwarded to Sabilytics, "fixture" when they stay on this server. */
  mode: "live" | "fixture";
}

type Fixture = { eventsTracked?: RecordedEvent[]; retentionGracePeriodMonths?: number };

function readFixture(): Fixture {
  const fixturePath = path.join(process.cwd(), "fixtures", "sponsors", "sabilytics.json");
  return fs.existsSync(fixturePath) ? (JSON.parse(fs.readFileSync(fixturePath, "utf-8")) as Fixture) : {};
}

// One log per server process, kept on globalThis so dev reloads do not reset it. It starts from
// the fixture's events, so counts are the fixture plus what happened since this process started.
const store = globalThis as unknown as { __sabilyticsLog?: RecordedEvent[] };
function log(): RecordedEvent[] {
  return (store.__sabilyticsLog ??= [...(readFixture().eventsTracked ?? [])]);
}

const live = () => !isDemoMode() && Boolean(process.env.SABILYTICS_API_KEY);

/** Records the event locally, and forwards it to Sabilytics when a key is configured. */
export async function logInvoiceAnalytics(event: SabilyticsEvent): Promise<{ recorded: boolean; forwarded: boolean }> {
  const recorded: RecordedEvent = { ...event, timestamp: new Date().toISOString() };
  log().push(recorded);
  if (!live()) return { recorded: true, forwarded: false };

  try {
    const res = await fetch("https://api.sabilytics.com/v1/telemetry", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.SABILYTICS_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(recorded),
    });
    return { recorded: true, forwarded: res.ok };
  } catch {
    // Analytics never blocks an invoice or a reminder.
    return { recorded: true, forwarded: false };
  }
}

export function recentAnalyticsEvents(limit = 20): RecordedEvent[] {
  return log().slice(-limit).reverse();
}

export function getInvoiceAnalyticsSummary(): SabilyticsSummary {
  const events = log();
  const count = (name: string) => events.filter((e) => e.event === name).length;
  return {
    invoicesCreated: count("invoice_created"),
    remindersSent: count("reminder_dispatched"),
    totalViews: count("invoice_viewed"),
    reminderConversions: count("reminder_link_clicked"),
    gracePeriodActive: true,
    retentionMonths: readFixture().retentionGracePeriodMonths ?? 2,
    mode: live() ? "live" : "fixture",
  };
}
