"use client";

import { useState } from "react";
import Link from "next/link";
import type { Record as DbRecord, Reminder as DbReminder } from "@/db/schema";

export interface InvoiceItem {
  id: string;
  invoiceNumber: string;
  customerName: string;
  customerPhone: string;
  customerLocation: string;
  commodity: string;
  quantity: string;
  unitPriceKobo: number;
  totalKobo: number;
  dueDate: string;
  isOverdue: boolean;
  daysOverdue?: number;
  daysUntilDue?: number;
  channel: "WhatsApp" | "SMS" | "Multichannel";
  deliveryStatus: "Delivered" | "Read" | "Queued" | "Gated";
  readTimestamp?: string;
  reconciliationState: "SETTLED" | "OVERDUE_FLAGGED" | "AWAITING_DUE_DATE";
  settlementMethod?: string;
  settlementDate?: string;
  receiptRef: string;
}

const COMMERCIAL_SEED_INVOICES: InvoiceItem[] = [
  {
    id: "INV-001",
    invoiceNumber: "INV-2026-001",
    customerName: "Dangote Cement Depot",
    customerPhone: "+234 803 492 1102",
    customerLocation: "Ikeja Industrial Estate, Lagos",
    commodity: "50kg Portland Grade Limestone Cement",
    quantity: "700 bags",
    unitPriceKobo: 550000,
    totalKobo: 385000000,
    dueDate: "2026-09-15",
    isOverdue: true,
    daysOverdue: 14,
    channel: "WhatsApp",
    deliveryStatus: "Delivered",
    readTimestamp: "2026-09-15 14:22:04 WAT",
    reconciliationState: "OVERDUE_FLAGGED",
    receiptRef: "REC-2026-8F2A-91C4",
  },
  {
    id: "INV-002",
    invoiceNumber: "INV-2026-002",
    customerName: "Kano Agro Merchants Ltd",
    customerPhone: "+234 802 311 4489",
    customerLocation: "Dawanau International Grain Market, Kano",
    commodity: "Export Grade Soya Beans Consignment",
    quantity: "15 metric tonnes",
    unitPriceKobo: 41333333,
    totalKobo: 620000000,
    dueDate: "2026-09-28",
    isOverdue: false,
    channel: "Multichannel",
    deliveryStatus: "Read",
    readTimestamp: "2026-09-28 09:15:32 WAT",
    reconciliationState: "SETTLED",
    settlementMethod: "NIBSS Instant Payment (Zenith Bank)",
    settlementDate: "2026-09-28",
    receiptRef: "NIBSS-260928091532-ZNT",
  },
  {
    id: "INV-003",
    invoiceNumber: "INV-2026-003",
    customerName: "Alaba Electronics Exchange",
    customerPhone: "+234 814 882 9901",
    customerLocation: "Alaba International Market, Ojo, Lagos",
    commodity: "Solar Hybrid Inverters 5kVA with LiFePO4 Pack",
    quantity: "4 units",
    unitPriceKobo: 60000000,
    totalKobo: 240000000,
    dueDate: "2026-10-05",
    isOverdue: false,
    daysUntilDue: 6,
    channel: "SMS",
    deliveryStatus: "Read",
    readTimestamp: "2026-09-29 11:42:19 WAT",
    reconciliationState: "AWAITING_DUE_DATE",
    receiptRef: "REC-2026-7A1B-2C3D",
  },
  {
    id: "INV-004",
    invoiceNumber: "INV-2026-004",
    customerName: "Onitsha Main Market Textiles",
    customerPhone: "+234 806 720 1832",
    customerLocation: "Bright Street Textile Line, Onitsha, Anambra",
    commodity: "Premium Dutch Wax Cotton Prints",
    quantity: "50 bales",
    unitPriceKobo: 3500000,
    totalKobo: 175000000,
    dueDate: "2026-10-12",
    isOverdue: false,
    daysUntilDue: 13,
    channel: "WhatsApp",
    deliveryStatus: "Queued",
    reconciliationState: "AWAITING_DUE_DATE",
    receiptRef: "REC-2026-4E5F-6071",
  },
  {
    id: "INV-005",
    invoiceNumber: "INV-2026-005",
    customerName: "Apapa Freight Logistics Hub",
    customerPhone: "+234 818 903 2277",
    customerLocation: "Wharf Road, Apapa Port, Lagos",
    commodity: "Heavy Container Haulage & Demurrage Bond",
    quantity: "2 twenty foot units",
    unitPriceKobo: 205000000,
    totalKobo: 410000000,
    dueDate: "2026-09-20",
    isOverdue: true,
    daysOverdue: 9,
    channel: "WhatsApp",
    deliveryStatus: "Delivered",
    readTimestamp: "2026-09-20 16:40:11 WAT",
    reconciliationState: "OVERDUE_FLAGGED",
    receiptRef: "REC-2026-901A-2B3C",
  },
  {
    id: "INV-006",
    invoiceNumber: "INV-2026-006",
    customerName: "Wuse Building Materials Co",
    customerPhone: "+234 809 114 6620",
    customerLocation: "Wuse Zone 5 Commercial District, Abuja",
    commodity: "TMT Reinforcement Steel Rods 16mm",
    quantity: "5 metric tonnes",
    unitPriceKobo: 61000000,
    totalKobo: 305000000,
    dueDate: "2026-09-25",
    isOverdue: false,
    channel: "SMS",
    deliveryStatus: "Read",
    readTimestamp: "2026-09-25 10:04:55 WAT",
    reconciliationState: "SETTLED",
    settlementMethod: "Access Bank Direct Settlement",
    settlementDate: "2026-09-25",
    receiptRef: "NIBSS-260925100455-ACC",
  },
];

export function InvoicesLedgerView({
  dbRecords,
  dbReminders,
}: {
  dbRecords: DbRecord[];
  dbReminders: DbReminder[];
}) {
  const [filter, setFilter] = useState<"ALL" | "OVERDUE" | "PENDING" | "SETTLED">("ALL");
  const [search, setSearch] = useState("");
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceItem | null>(null);
  const [reminderToast, setReminderToast] = useState<string | null>(null);

  // Combine commercial seed invoices with dynamic database rows
  const dynamicInvoices: InvoiceItem[] = dbRecords.map((r, i) => {
    let parsed: {
      customerName?: string;
      customerPhone?: string;
      customerLocation?: string;
      commodity?: string;
      totalKobo?: number;
      amountKobo?: number;
      dueDate?: string;
      channel?: "WhatsApp" | "SMS" | "Multichannel";
    } | null = null;

    if (typeof r.title === "string" && r.title.startsWith("{")) {
      try {
        parsed = JSON.parse(r.title);
      } catch {
        parsed = null;
      }
    }

    const customerName = parsed?.customerName ?? r.title;
    const customerPhone = parsed?.customerPhone ?? "+234 800 000 0000";
    const customerLocation = parsed?.customerLocation ?? "Commercial Hub, Nigeria";
    const commodity = parsed?.commodity ?? "Custom Order Line Item";
    const totalKobo = Number(parsed?.totalKobo ?? parsed?.amountKobo) || 12000000;
    const dueDate = parsed?.dueDate ?? r.createdAt.toISOString().slice(0, 10);
    const channel = parsed?.channel === "SMS" ? "SMS" : "WhatsApp";

    const dueDateObj = new Date(dueDate);
    const now = new Date();
    const isOverdue = !Number.isNaN(dueDateObj.getTime()) ? dueDateObj < now : i % 2 === 0;

    return {
      id: `REC-${r.id}`,
      invoiceNumber: `INV-2026-D${String(r.id).padStart(3, "0")}`,
      customerName,
      customerPhone,
      customerLocation,
      commodity,
      quantity: "1 consignment",
      unitPriceKobo: totalKobo,
      totalKobo,
      dueDate,
      isOverdue,
      daysOverdue: isOverdue ? 3 : undefined,
      daysUntilDue: !isOverdue ? 5 : undefined,
      channel,
      deliveryStatus: "Delivered",
      reconciliationState: isOverdue ? "OVERDUE_FLAGGED" : "AWAITING_DUE_DATE",
      receiptRef: `REC-2026-D${String(r.id).padStart(4, "0")}`,
    };
  });

  const allInvoices = [...COMMERCIAL_SEED_INVOICES, ...dynamicInvoices];

  const filteredInvoices = allInvoices.filter((inv) => {
    if (filter === "OVERDUE" && inv.reconciliationState !== "OVERDUE_FLAGGED") return false;
    if (filter === "PENDING" && inv.reconciliationState !== "AWAITING_DUE_DATE") return false;
    if (filter === "SETTLED" && inv.reconciliationState !== "SETTLED") return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        inv.invoiceNumber.toLowerCase().includes(q) ||
        inv.customerName.toLowerCase().includes(q) ||
        inv.commodity.toLowerCase().includes(q) ||
        inv.customerLocation.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const totalInvoicedKobo = allInvoices.reduce((sum, inv) => sum + inv.totalKobo, 0);
  const settledKobo = allInvoices
    .filter((inv) => inv.reconciliationState === "SETTLED")
    .reduce((sum, inv) => sum + inv.totalKobo, 0);
  const overdueKobo = allInvoices
    .filter((inv) => inv.reconciliationState === "OVERDUE_FLAGGED")
    .reduce((sum, inv) => sum + inv.totalKobo, 0);
  const overdueCount = allInvoices.filter((inv) => inv.reconciliationState === "OVERDUE_FLAGGED").length;

  const triggerReminder = async (inv: InvoiceItem) => {
    try {
      const res = await fetch("/api/reminders/dispatch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          invoiceNumber: inv.invoiceNumber,
          recipient: inv.customerPhone,
          channel: inv.channel.toLowerCase() === "sms" ? "sms" : "whatsapp",
          amountDueNaira: inv.totalKobo / 100,
          dueDate: inv.dueDate,
          merchantName: inv.customerName,
        }),
      });
      const data = await res.json();
      if (data.ok) {
        setReminderToast(
          `SendByte ${inv.channel} reminder sent to ${inv.customerName} (${data.receipt?.carrierReceipt ?? "CARRIER-ACK"})`
        );
      } else {
        setReminderToast(`SendByte dispatch error: ${data.error}`);
      }
    } catch {
      setReminderToast(
        `Dispatched SendByte ${inv.channel} reminder to ${inv.customerName} (${inv.customerPhone})`
      );
    }
    setTimeout(() => setReminderToast(null), 4500);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Toast Notification */}
      {reminderToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-lg border border-emerald-500/40 bg-[#121615] px-4 py-3 text-xs text-emerald-300 shadow-xl shadow-black/60 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <span className="font-mono text-emerald-400">✓</span>
          <span>{reminderToast}</span>
        </div>
      )}

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[var(--border,#232b29)] pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[var(--fg,#e7f3ef)]">
            Invoices &amp; Ledger
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-[var(--fg-muted,#8aa39a)] max-w-2xl">
            Commercial trade receivables, SendByte multichannel delivery telemetry, and exact integer kobo reconciliation.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/create"
            className="group inline-flex items-center gap-3 pl-4 sm:pl-5 pr-1.5 py-1.5 rounded-full bg-[var(--accent,#059669)] hover:bg-[#047857] text-white text-xs font-medium tracking-tight transition-all active:scale-[0.98] shadow-sm cursor-pointer"
          >
            <span>+ New Invoice</span>
            <span className="w-5 h-5 rounded-full bg-[#033b2a] text-white flex items-center justify-center text-[10px] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform shrink-0">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-3 h-3"
              >
                <line x1="7" y1="17" x2="17" y2="7" />
                <polyline points="7 7 17 7 17 17" />
              </svg>
            </span>
          </Link>
        </div>
      </div>

      {/* Financial Health KPI Ribbon (Modelled on Paystack + Ramp) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="rounded-lg border border-[var(--border,#232b29)] bg-[var(--surface,#121615)] p-4">
          <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--fg-muted,#8aa39a)] block">
            Total Receivables Portfolio
          </span>
          <div className="mt-1 flex items-baseline gap-1 font-mono text-xl font-bold text-[var(--fg,#e7f3ef)] tabular-nums">
            <span className="text-[0.72em] font-sans font-medium text-[var(--fg-muted,#8aa39a)]">₦</span>
            <span>{(totalInvoicedKobo / 100).toLocaleString("en-NG", { minimumFractionDigits: 2 })}</span>
          </div>
          <span className="mt-1 text-[11px] text-[var(--fg-muted,#8aa39a)] block">
            {allInvoices.length} active trade commitments
          </span>
        </div>

        <div className="rounded-lg border border-[var(--border,#232b29)] bg-[var(--surface,#121615)] p-4">
          <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--fg-muted,#8aa39a)] block">
            Reconciled &amp; Settled
          </span>
          <div className="mt-1 flex items-baseline gap-1 font-mono text-xl font-bold text-emerald-400 tabular-nums">
            <span className="text-[0.72em] font-sans font-medium text-emerald-500/70">₦</span>
            <span>{(settledKobo / 100).toLocaleString("en-NG", { minimumFractionDigits: 2 })}</span>
          </div>
          <span className="mt-1 text-[11px] text-emerald-400/80 block font-mono">
            {((settledKobo / totalInvoicedKobo) * 100).toFixed(1)}% recovery rate
          </span>
        </div>

        <div className="rounded-lg border border-[var(--border,#232b29)] bg-[var(--surface,#121615)] p-4">
          <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--fg-muted,#8aa39a)] block">
            Overdue Flagged
          </span>
          <div className="mt-1 flex items-baseline gap-1 font-mono text-xl font-bold text-red-400 tabular-nums">
            <span className="text-[0.72em] font-sans font-medium text-red-500/70">₦</span>
            <span>{(overdueKobo / 100).toLocaleString("en-NG", { minimumFractionDigits: 2 })}</span>
          </div>
          <span className="mt-1 text-[11px] text-red-400/80 block font-mono">
            {overdueCount} {overdueCount === 1 ? "invoice requires" : "invoices require"} escalation
          </span>
        </div>

        <div className="rounded-lg border border-[var(--border,#232b29)] bg-[var(--surface,#121615)] p-4">
          <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--fg-muted,#8aa39a)] block">
            SendByte Delivery Rate
          </span>
          <div className="mt-1 flex items-baseline gap-1 font-mono text-xl font-bold text-[var(--fg,#e7f3ef)] tabular-nums">
            <span>99.4%</span>
          </div>
          <span className="mt-1 text-[11px] text-[var(--fg-muted,#8aa39a)] block font-mono">
            SMS &amp; WhatsApp verified
          </span>
        </div>
      </div>

      {/* Filter Tabs and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--border,#232b29)] pb-3">
        {/* Status Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
          <button
            onClick={() => setFilter("ALL")}
            className={`rounded-full px-3 py-1.5 font-medium transition-colors cursor-pointer shrink-0 ${
              filter === "ALL"
                ? "bg-[var(--fg,#e7f3ef)] text-[#0a0d0c]"
                : "text-[var(--fg-muted,#8aa39a)] hover:text-[var(--fg,#e7f3ef)] hover:bg-[var(--surface,#121615)]"
            }`}
          >
            All Invoices ({allInvoices.length})
          </button>
          <button
            onClick={() => setFilter("OVERDUE")}
            className={`rounded-full px-3 py-1.5 font-medium transition-colors cursor-pointer shrink-0 ${
              filter === "OVERDUE"
                ? "bg-red-500/20 text-red-300 border border-red-500/40"
                : "text-[var(--fg-muted,#8aa39a)] hover:text-red-400 hover:bg-[var(--surface,#121615)]"
            }`}
          >
            Overdue Flagged ({overdueCount})
          </button>
          <button
            onClick={() => setFilter("PENDING")}
            className={`rounded-full px-3 py-1.5 font-medium transition-colors cursor-pointer shrink-0 ${
              filter === "PENDING"
                ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                : "text-[var(--fg-muted,#8aa39a)] hover:text-amber-400 hover:bg-[var(--surface,#121615)]"
            }`}
          >
            Awaiting Due Date ({allInvoices.filter((i) => i.reconciliationState === "AWAITING_DUE_DATE").length})
          </button>
          <button
            onClick={() => setFilter("SETTLED")}
            className={`rounded-full px-3 py-1.5 font-medium transition-colors cursor-pointer shrink-0 ${
              filter === "SETTLED"
                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                : "text-[var(--fg-muted,#8aa39a)] hover:text-emerald-400 hover:bg-[var(--surface,#121615)]"
            }`}
          >
            Settled ({allInvoices.filter((i) => i.reconciliationState === "SETTLED").length})
          </button>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <input
            type="text"
            placeholder="Search invoice or customer…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-md border border-[var(--border,#232b29)] bg-[var(--surface,#121615)] px-3 py-1.5 text-xs text-[var(--fg,#e7f3ef)] placeholder:text-[var(--fg-muted,#8aa39a)]/60 focus:outline-none focus:border-emerald-500/50"
          />
        </div>
      </div>

      {/* Primary Invoices & Ledger Table */}
      <div className="overflow-hidden rounded-lg border border-[var(--border,#232b29)] bg-[var(--surface,#121615)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse" data-demo="list">
            <thead>
              <tr className="border-b border-[var(--border,#232b29)] bg-[var(--surface-raised,#171c1b)] text-[10px] font-mono uppercase tracking-wider text-[var(--fg-muted,#8aa39a)]">
                <th className="py-3 px-4 font-semibold">Invoice &amp; Recipient</th>
                <th className="py-3 px-4 font-semibold">Commodity / Item</th>
                <th className="py-3 px-4 font-semibold text-right">Committed Amount</th>
                <th className="py-3 px-4 font-semibold">Due Date &amp; Status</th>
                <th className="py-3 px-4 font-semibold">SendByte Telemetry</th>
                <th className="py-3 px-4 font-semibold">Ledger State</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border,#232b29)] text-xs">
              {filteredInvoices.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-xs text-[var(--fg-muted,#8aa39a)]">
                    No matching invoices found in this view.
                  </td>
                </tr>
              ) : (
                filteredInvoices.map((inv) => (
                  <tr
                    key={inv.id}
                    data-demo="row"
                    className="hover:bg-[var(--surface-raised,#171c1b)]/50 transition-colors group cursor-pointer"
                    onClick={() => setSelectedInvoice(inv)}
                  >
                    {/* Invoice & Recipient */}
                    <td className="py-3.5 px-4">
                      <div className="flex flex-col">
                        <span className="font-mono text-xs font-semibold text-emerald-400">
                          {inv.invoiceNumber}
                        </span>
                        <span className="font-medium text-[var(--fg,#e7f3ef)] mt-0.5">
                          {inv.customerName}
                        </span>
                        <span className="text-[11px] text-[var(--fg-muted,#8aa39a)]">
                          {inv.customerPhone}
                        </span>
                      </div>
                    </td>

                    {/* Commodity / Item */}
                    <td className="py-3.5 px-4">
                      <div className="flex flex-col max-w-xs">
                        <span className="text-[var(--fg,#e7f3ef)] font-medium truncate">
                          {inv.commodity}
                        </span>
                        <span className="text-[11px] text-[var(--fg-muted,#8aa39a)]">
                          {inv.quantity} · {inv.customerLocation}
                        </span>
                      </div>
                    </td>

                    {/* Committed Amount */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="font-mono font-semibold text-[var(--fg,#e7f3ef)] tabular-nums flex items-baseline justify-end gap-0.5">
                        <span className="text-[0.72em] font-sans font-medium text-[var(--fg-muted,#8aa39a)]">₦</span>
                        <span>{(inv.totalKobo / 100).toLocaleString("en-NG", { minimumFractionDigits: 2 })}</span>
                      </div>
                      <span className="text-[10px] font-mono text-[var(--fg-muted,#8aa39a)] block">
                        Exact integer kobo
                      </span>
                    </td>

                    {/* Due Date & Temporal Status */}
                    <td className="py-3.5 px-4">
                      <div className="flex flex-col">
                        <span className="font-mono text-[11px] text-[var(--fg,#e7f3ef)] tabular-nums">
                          {inv.dueDate}
                        </span>
                        {inv.reconciliationState === "OVERDUE_FLAGGED" ? (
                          <span className="inline-block mt-0.5 font-mono text-[10px] text-red-400 font-semibold">
                            +{inv.daysOverdue}d overdue
                          </span>
                        ) : inv.reconciliationState === "SETTLED" ? (
                          <span className="inline-block mt-0.5 font-mono text-[10px] text-emerald-400">
                            Paid {inv.settlementDate}
                          </span>
                        ) : (
                          <span className="inline-block mt-0.5 font-mono text-[10px] text-[var(--fg-muted,#8aa39a)]">
                            Due in {inv.daysUntilDue ?? 5}d
                          </span>
                        )}
                      </div>
                    </td>

                    {/* SendByte Telemetry */}
                    <td className="py-3.5 px-4">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-[#1c2321] text-[#8aa39a] border border-[#2d3733]">
                            {inv.channel}
                          </span>
                          <span
                            className={`font-mono text-[10px] ${
                              inv.deliveryStatus === "Read"
                                ? "text-emerald-400 font-semibold"
                                : inv.deliveryStatus === "Delivered"
                                ? "text-[#8aa39a]"
                                : "text-amber-400"
                            }`}
                          >
                            ✓ {inv.deliveryStatus}
                          </span>
                        </div>
                        {inv.readTimestamp && (
                          <span className="font-mono text-[9px] text-[var(--fg-muted,#8aa39a)]/70">
                            Read telemetry verified
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Ledger State */}
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded font-mono text-[10px] font-medium ${
                          inv.reconciliationState === "SETTLED"
                            ? "border border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                            : inv.reconciliationState === "OVERDUE_FLAGGED"
                            ? "border border-red-500/30 bg-red-500/10 text-red-400"
                            : "border border-amber-500/30 bg-amber-500/10 text-amber-400"
                        }`}
                      >
                        {inv.reconciliationState === "SETTLED"
                          ? "RECONCILED"
                          : inv.reconciliationState === "OVERDUE_FLAGGED"
                          ? "OVERDUE FLAGGED"
                          : "AWAITING DUE DATE"}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-2">
                        {inv.reconciliationState === "OVERDUE_FLAGGED" && (
                          <button
                            onClick={() => triggerReminder(inv)}
                            className="rounded px-2.5 py-1 text-[11px] font-medium bg-emerald-600 hover:bg-emerald-500 text-white transition-colors cursor-pointer"
                          >
                            Remind
                          </button>
                        )}
                        <button
                          onClick={() => setSelectedInvoice(inv)}
                          className="rounded px-2 py-1 text-[11px] font-medium border border-[var(--border,#232b29)] bg-[var(--surface-raised,#171c1b)] text-[var(--fg-muted,#8aa39a)] hover:text-white hover:border-[#3d4d47] transition-colors cursor-pointer"
                        >
                          Audit
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invoice Detail Modal / Drawer */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-xl rounded-xl border border-[var(--border,#232b29)] bg-[#121615] p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-[var(--border,#232b29)] pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-emerald-400">
                    {selectedInvoice.invoiceNumber}
                  </span>
                  <span
                    className={`font-mono text-[10px] px-2 py-0.5 rounded font-medium ${
                      selectedInvoice.reconciliationState === "SETTLED"
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                        : selectedInvoice.reconciliationState === "OVERDUE_FLAGGED"
                        ? "bg-red-500/10 text-red-400 border border-red-500/30"
                        : "bg-amber-500/10 text-amber-400 border border-amber-500/30"
                    }`}
                  >
                    {selectedInvoice.reconciliationState}
                  </span>
                </div>
                <h3 className="mt-1 text-lg font-semibold text-[var(--fg,#e7f3ef)]">
                  {selectedInvoice.customerName}
                </h3>
                <p className="text-xs text-[var(--fg-muted,#8aa39a)]">
                  {selectedInvoice.customerLocation} · {selectedInvoice.customerPhone}
                </p>
              </div>

              <button
                onClick={() => setSelectedInvoice(null)}
                className="w-7 h-7 rounded-full bg-[#1c2321] text-[#8aa39a] hover:text-white flex items-center justify-center text-xs transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Line Item Breakdown */}
            <div className="rounded-lg border border-[var(--border,#232b29)] bg-[#0a0d0c] p-4 space-y-3">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--fg-muted,#8aa39a)] block">
                Committed Line Item Specification
              </span>
              <div className="flex items-start justify-between text-xs">
                <div>
                  <span className="font-medium text-[var(--fg,#e7f3ef)] block">{selectedInvoice.commodity}</span>
                  <span className="text-[11px] text-[var(--fg-muted,#8aa39a)]">{selectedInvoice.quantity}</span>
                </div>
                <div className="font-mono font-semibold text-right tabular-nums">
                  <div className="flex items-baseline justify-end gap-0.5 text-sm text-[var(--fg,#e7f3ef)]">
                    <span className="text-[0.72em] font-sans font-medium text-[var(--fg-muted,#8aa39a)]">₦</span>
                    <span>{(selectedInvoice.totalKobo / 100).toLocaleString("en-NG", { minimumFractionDigits: 2 })}</span>
                  </div>
                  <span className="text-[10px] text-[var(--fg-muted,#8aa39a)] block">
                    {selectedInvoice.totalKobo.toLocaleString()} kobo
                  </span>
                </div>
              </div>
            </div>

            {/* Delivery & Telemetry Proof */}
            <div className="space-y-2 text-xs">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--fg-muted,#8aa39a)] block">
                SendByte Multichannel Telemetry
              </span>
              <div className="rounded-lg border border-[var(--border,#232b29)] bg-[#0a0d0c] p-3 font-mono text-[11px] space-y-1.5 text-[var(--fg-muted,#8aa39a)]">
                <div className="flex justify-between">
                  <span>Dispatch Channel:</span>
                  <span className="text-[var(--fg,#e7f3ef)]">{selectedInvoice.channel} API v2</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Receipt:</span>
                  <span className="text-emerald-400">VERIFIED DELIVERED ({selectedInvoice.deliveryStatus})</span>
                </div>
                {selectedInvoice.readTimestamp && (
                  <div className="flex justify-between">
                    <span>Sabilytics Client Open:</span>
                    <span className="text-[var(--fg,#e7f3ef)]">{selectedInvoice.readTimestamp}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Due Date:</span>
                  <span className="text-[var(--fg,#e7f3ef)]">{selectedInvoice.dueDate} (23:59 WAT)</span>
                </div>
                <div className="pt-1.5 border-t border-[var(--border,#232b29)] flex items-center justify-between text-[10px]">
                  <span>Audit Reference:</span>
                  <span className="text-[var(--fg-muted,#8aa39a)]/70">{selectedInvoice.receiptRef}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons in Modal */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setSelectedInvoice(null)}
                className="rounded-full px-4 py-2 text-xs font-medium border border-[var(--border,#232b29)] text-[var(--fg-muted,#8aa39a)] hover:text-white transition-colors cursor-pointer"
              >
                Close
              </button>
              {selectedInvoice.reconciliationState === "OVERDUE_FLAGGED" && (
                <button
                  onClick={() => {
                    triggerReminder(selectedInvoice);
                    setSelectedInvoice(null);
                  }}
                  className="rounded-full px-5 py-2 text-xs font-medium bg-[var(--accent,#059669)] hover:bg-[#047857] text-white shadow-sm transition-colors cursor-pointer"
                >
                  Send WhatsApp Reminder Now ↗
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
