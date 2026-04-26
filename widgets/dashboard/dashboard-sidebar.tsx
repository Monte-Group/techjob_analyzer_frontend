"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items: { href: string; label: string }[] = [
  { href: "/dashboard", label: "Обзор" },
  { href: "/dashboard/profile", label: "Мой профиль" },
  { href: "/dashboard/skills", label: "Навыки" },
  { href: "/dashboard/salaries", label: "Зарплаты" },
  { href: "/dashboard/trends", label: "Тренды" },
  { href: "/dashboard/market", label: "Срез рынка" },
  { href: "/dashboard/calculator", label: "Калькулятор" },
];

export function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-30 hidden h-screen w-64 flex-col border-r border-[color:var(--border)] bg-[color:var(--surface)] px-4 py-6 lg:flex">
      <Link href="/dashboard" className="mb-8 px-3 block">
        <div className="text-xs font-semibold uppercase tracking-[0.28em] text-[color:var(--text-dim)]">
          Tech Job
        </div>
        <div className="mt-1 font-display text-lg text-[color:var(--text)]">
          Market Intelligence
        </div>
      </Link>

      <nav className="flex flex-1 flex-col gap-1">
        {items.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-2xl px-4 py-2.5 text-sm font-medium transition ${
                isActive
                  ? "border border-[color:var(--border-strong)] bg-[color:var(--surface)] text-[color:var(--accent)] shadow-[0_12px_28px_-20px_rgba(124,108,255,0.55)]"
                  : "text-[color:var(--text-dim)] hover:bg-[color:var(--bg-2)] hover:text-[color:var(--text)]"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
