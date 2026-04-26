"use client";

import { usePathname, useRouter } from "next/navigation";

import { logout as logoutRequest } from "@/lib/api";
import { ThemeToggle } from "@/shared/ui/theme-toggle";

const titles: Record<string, string> = {
  "/dashboard": "Обзор",
  "/dashboard/profile": "Мой профиль",
  "/dashboard/skills": "Навыки",
  "/dashboard/salaries": "Зарплаты",
  "/dashboard/trends": "Тренды",
  "/dashboard/market": "Срез рынка",
  "/dashboard/calculator": "Калькулятор зарплаты",
  "/dashboard/skill-gap": "Мой профиль",
};

export function DashboardHeader() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    try {
      await logoutRequest();
    } catch {
      // ignore
    }
    localStorage.removeItem("token");
    router.replace("/login");
  }

  return (
    <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-[color:var(--border)] bg-[color:var(--surface)] px-6 backdrop-blur-sm">
      <div>
        <div className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[color:var(--accent)]">
          Tech Job Market Intelligence
        </div>
        <div className="text-sm font-semibold text-[color:var(--text)]">
          {titles[pathname] ?? "Dashboard"}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <ThemeToggle />
        <button
          onClick={() => void handleLogout()}
          aria-label="Выйти"
          title="Выйти"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-[color:var(--border)] bg-[color:var(--bg-2)] text-[color:var(--text-dim)] transition hover:border-[color:var(--border-strong)] hover:text-[color:var(--text)]"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
        </button>
      </div>
    </header>
  );
}
