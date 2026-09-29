"use client";

// Wraps every ledger dashboard and verification page in the PayPulse design system.
import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const PRIMARY_LINKS = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/dashboard/items", label: "Invoices & Ledger" },
  { href: "/dashboard/create", label: "New Invoice" },
];

export function DashboardShell({
  project = "PayPulse",
  workspaceNav = false,
  children,
}: {
  project?: string;
  workspaceNav?: boolean;
  children: ReactNode;
}) {
  const pathname = usePathname() || "/dashboard";

  return (
    <div className="min-h-screen bg-[var(--bg,#0a0d0c)] text-[var(--fg,#e7f3ef)] antialiased font-sans selection:bg-[var(--accent,#059669)]/20 selection:text-white">
      {/* Top Header */}
      <header className="sticky top-0 z-40 border-b border-[var(--border,#232b29)] bg-[var(--surface,#121615)]/95 backdrop-blur-md px-4 py-2.5">
        <div className="mx-auto flex max-w-[1480px] items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <Link href="/" className="inline-flex items-center text-[15px] font-bold tracking-tight text-[var(--fg,#e7f3ef)] hover:opacity-90 transition-opacity">
              <span>PayPulse</span>
            </Link>

            {/* Main Navigation Links */}
            <nav aria-label="Dashboard Navigation" className="hidden md:flex items-center gap-1 text-[13px]">
              {PRIMARY_LINKS.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`rounded-[var(--radius-sm,4px)] px-2.5 py-1 transition-colors font-medium ${
                      isActive
                        ? "bg-[var(--surface-raised,#171c1b)] text-[var(--fg,#e7f3ef)] border border-[var(--border,#232b29)]"
                        : "text-[var(--fg-muted,#8aa39a)] hover:text-[var(--fg,#e7f3ef)] hover:bg-[var(--surface-raised,#171c1b)]/50"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right Action */}
          <div className="flex items-center gap-2.5">
            <Link
              href="/"
              className="rounded-[var(--radius-sm,4px)] border border-[var(--border,#232b29)] bg-[var(--surface,#121615)] px-3 py-1 text-[12px] font-medium text-[var(--fg-muted,#8aa39a)] hover:text-[var(--fg,#e7f3ef)] hover:bg-[var(--surface-raised,#171c1b)] transition-colors"
            >
              Exit to Landing &rarr;
            </Link>
          </div>
        </div>

        {/* Mobile Navigation Scrollbar */}
        <div className="flex md:hidden items-center gap-1 overflow-x-auto pt-2 pb-0.5 text-[12px] scrollbar-none">
          {PRIMARY_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`shrink-0 rounded-[var(--radius-sm,4px)] px-2 py-0.5 font-medium transition-colors ${
                  isActive
                    ? "bg-[var(--surface-raised,#171c1b)] text-[var(--fg,#e7f3ef)] border border-[var(--border,#232b29)]"
                    : "text-[var(--fg-muted,#8aa39a)] hover:text-[var(--fg,#e7f3ef)]"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      </header>

      {/* Main Content Area */}
      <div className="mx-auto max-w-[1480px] p-4 sm:p-6 lg:p-8">
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
