"use client";

// Wraps every /dashboard page. By default it is a slim top bar and the page content.
// The workspace sidebar and the ⌘K jump menu are opt-in: pass `workspaceNav` once the
// product really has several screens a user moves between, and edit NAV_GROUPS to name
// them in the user's words.
import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_GROUPS: { label: string; items: { href: string; label: string }[] }[] = [
  {
    label: "Work",
    items: [
      { href: "/dashboard", label: "Overview" },
      { href: "/dashboard/create", label: "New" },
      { href: "/dashboard/items", label: "Records" },
    ],
  },
  {
    label: "Evidence",
    items: [
      { href: "/proof", label: "Proof" },
      { href: "/verify", label: "Verify" },
    ],
  },
];

export function DashboardShell({
  project,
  workspaceNav = false,
  children,
}: {
  project?: string;
  workspaceNav?: boolean;
  children: ReactNode;
}) {
  const pathname = usePathname() || "/dashboard";
  const [cmdOpen, setCmdOpen] = useState(false);

  useEffect(() => {
    if (!workspaceNav) return;
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setCmdOpen((v) => !v);
      } else if (e.key === "Escape") {
        setCmdOpen(false);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [workspaceNav]);

  return (
    <div className="min-h-screen bg-[var(--bg,#f5f5f5)] text-[var(--fg,#171717)] antialiased">
      <header className="border-b border-[var(--border,#e5e5e5)] bg-[var(--surface,#ffffff)] px-4 py-2.5">
        <div className="mx-auto flex max-w-[1480px] items-center justify-between gap-3">
          <Link href="/" className="inline-flex items-center gap-2 text-[14px] font-semibold tracking-[-0.01em]">
            <span className="h-2 w-2 rounded-full bg-[var(--accent,#2563eb)]" aria-hidden />
            {project || "Home"}
          </Link>
          <nav aria-label="Dashboard" className="flex items-center gap-1 text-[13px]">
            {workspaceNav ? (
              <button
                type="button"
                onClick={() => setCmdOpen(true)}
                className="hidden items-center gap-2 rounded-[8px] border border-[var(--border,#e5e5e5)] px-2.5 py-1 text-[var(--fg-muted,#525252)] hover:text-[var(--fg,#171717)] sm:inline-flex"
              >
                Jump
                <kbd className="rounded border border-[var(--border,#d4d4d4)] px-1.5 py-0.5 font-mono text-[10px]">⌘K</kbd>
              </button>
            ) : (
              <>
                <Link href="/dashboard" className="rounded-[8px] px-2.5 py-1 text-[var(--fg-muted,#525252)] hover:text-[var(--fg,#171717)]">
                  Overview
                </Link>
                <Link href="/proof" className="rounded-[8px] px-2.5 py-1 text-[var(--fg-muted,#525252)] hover:text-[var(--fg,#171717)]">
                  Proof
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      <div className={`mx-auto flex gap-4 p-3 lg:gap-5 lg:p-5 ${workspaceNav ? "max-w-[1480px]" : "max-w-6xl"}`}>
        {workspaceNav ? (
          <aside className="sticky top-5 hidden h-[calc(100vh-4.5rem)] w-[232px] shrink-0 flex-col gap-5 overflow-y-auto rounded-2xl border border-[var(--border,#e5e5e5)] bg-[var(--surface,#ffffff)] px-4 py-5 lg:flex">
            {NAV_GROUPS.map((group) => (
              <div key={group.label}>
                <p className="px-2 pb-1.5 text-[11px] font-medium text-[var(--fg-muted,#737373)]">{group.label}</p>
                <div className="flex flex-col gap-0.5">
                  {group.items.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      aria-current={pathname === item.href ? "page" : undefined}
                      className={`rounded-[8px] px-2.5 py-1.5 text-[13px] font-medium transition-colors ${
                        pathname === item.href
                          ? "bg-[color-mix(in_oklab,var(--accent,#2563eb)_12%,transparent)] text-[var(--fg,#171717)]"
                          : "text-[var(--fg-muted,#404040)] hover:bg-[var(--surface-raised,#f5f5f5)] hover:text-[var(--fg,#171717)]"
                      }`}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </aside>
        ) : null}

        <main className="min-w-0 flex-1">{children}</main>
      </div>

      {workspaceNav && cmdOpen ? (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/30 px-4 pt-20" onClick={() => setCmdOpen(false)}>
          <div
            className="w-full max-w-lg rounded-2xl border border-[var(--border,#d4d4d4)] bg-[var(--surface,#ffffff)] p-3 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="grid max-h-80 gap-1 overflow-y-auto">
              {NAV_GROUPS.flatMap((g) => g.items).map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setCmdOpen(false)}
                  className="flex items-center justify-between rounded-[8px] px-3 py-2 text-[13px] hover:bg-[var(--surface-raised,#f5f5f5)]"
                >
                  <span>{item.label}</span>
                  <span className="font-mono text-[11px] text-[var(--fg-muted,#737373)]">{item.href}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
