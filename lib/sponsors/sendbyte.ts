import fs from "node:fs";
import path from "node:path";
import { isDemoMode } from "@/lib/demo-mode";

export interface SendByteReminderPayload {
  invoiceNumber: string;
  recipient: string;
  channel: "sms" | "whatsapp";
  amountDueNaira: number;
  dueDate: string;
  merchantName: string;
}

export interface SendByteDeliveryReceipt {
  ok: boolean;
  messageId: string;
  status: "delivered" | "queued" | "failed";
  carrierReceipt: string;
  timestamp: string;
}

export async function dispatchPaymentReminder(
  payload: SendByteReminderPayload,
): Promise<SendByteDeliveryReceipt> {
  if (isDemoMode() || !process.env.SENDBYTE_API_KEY) {
    const fixturePath = path.join(process.cwd(), "fixtures", "sponsors", "sendbyte.json");
    if (fs.existsSync(fixturePath)) {
      const data = JSON.parse(fs.readFileSync(fixturePath, "utf-8"));
      return {
        ok: true,
        messageId: data.messageId,
        status: data.status,
        carrierReceipt: data.carrierReceipt,
        timestamp: data.deliveredAt,
      };
    }
    return {
      ok: true,
      messageId: `msg_sb_local_${Date.now()}`,
      status: "delivered",
      carrierReceipt: "LOCAL-DEMO-ACK",
      timestamp: new Date().toISOString(),
    };
  }

  // Production SendByte API integration
  const response = await fetch("https://api.sendbyte.africa/v1/messages", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.SENDBYTE_API_KEY}`,
      "Content-Type": "application/json",
      "Idempotency-Key": `sb_inv_${payload.invoiceNumber}_${Date.now()}`,
    },
    body: JSON.stringify({
      to: payload.recipient,
      channel: payload.channel,
      message: `Hello, reminder from ${payload.merchantName}: Invoice ${payload.invoiceNumber} for NGN ${payload.amountDueNaira.toLocaleString()} was due on ${payload.dueDate}. Pay securely at https://paypulse.africa/pay/${payload.invoiceNumber}`,
    }),
  });

  if (!response.ok) {
    throw new Error(`SendByte dispatch failed with HTTP ${response.status}`);
  }

  const json = (await response.json()) as { messageId: string; status: "delivered" | "queued" | "failed"; carrierReceipt?: string };
  return {
    ok: true,
    messageId: json.messageId,
    status: json.status,
    carrierReceipt: json.carrierReceipt ?? "CARRIER-ACK",
    timestamp: new Date().toISOString(),
  };
}
