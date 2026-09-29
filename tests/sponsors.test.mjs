import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { test } from "node:test";

test("SendByte sponsor fixture exists and satisfies 4-part verification contract", async () => {
  const fixturePath = path.join(process.cwd(), "fixtures", "sponsors", "sendbyte.json");
  assert.ok(fs.existsSync(fixturePath), "fixtures/sponsors/sendbyte.json must exist");

  const data = JSON.parse(fs.readFileSync(fixturePath, "utf-8"));
  assert.equal(data.sponsor, "SendByte");
  assert.ok(data.recipient.startsWith("+234"), "Must target African phone format");
  assert.equal(data.status, "delivered");
  assert.ok(data.carrierReceipt.length > 0);

  const { dispatchPaymentReminder } = await import("../lib/sponsors/sendbyte.ts");
  const res = await dispatchPaymentReminder({
    invoiceNumber: "INV-2026-TEST",
    recipient: "+2348012345678",
    channel: "sms",
    amountDueNaira: 50000,
    dueDate: "2026-09-30",
    merchantName: "Test Merchant",
  });
  assert.equal(res.ok, true);
  assert.equal(res.status, "delivered");
});

test("Sabilytics sponsor fixture exists and satisfies 4-part verification contract", async () => {
  const fixturePath = path.join(process.cwd(), "fixtures", "sponsors", "sabilytics.json");
  assert.ok(fs.existsSync(fixturePath), "fixtures/sponsors/sabilytics.json must exist");

  const data = JSON.parse(fs.readFileSync(fixturePath, "utf-8"));
  assert.equal(data.sponsor, "Sabilytics");
  assert.equal(data.retentionGracePeriodMonths, 2);

  const { getInvoiceAnalyticsSummary } = await import("../lib/sponsors/sabilytics.ts");
  const summary = getInvoiceAnalyticsSummary();
  assert.ok(summary.totalViews > 0);
  assert.equal(summary.gracePeriodActive, true);
});

test("Pxxl sponsor fixture exists and satisfies 4-part verification contract", async () => {
  const fixturePath = path.join(process.cwd(), "fixtures", "sponsors", "pxxl.json");
  assert.ok(fs.existsSync(fixturePath), "fixtures/sponsors/pxxl.json must exist");

  const data = JSON.parse(fs.readFileSync(fixturePath, "utf-8"));
  assert.equal(data.sponsor, "Pxxl");
  assert.equal(data.region, "africa-west-lagos");

  const { loadPxxlConfig } = await import("../lib/sponsors/pxxl.ts");
  const config = loadPxxlConfig();
  assert.equal(config.region, "africa-west-lagos");
  assert.equal(config.sslEnabled, true);
});
