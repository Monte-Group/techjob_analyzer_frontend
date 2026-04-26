"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

const items: { id: string; label: string }[] = [
  { id: "overview", label: "Обзор" },
  { id: "skills", label: "Навыки" },
  { id: "salaries", label: "Зарплаты" },
  { id: "trends", label: "Тренды" },
  { id: "market", label: "Срез рынка" },
  { id: "salary-calc", label: "Калькулятор" },
  { id: "skill-gap", label: "Скилл-гэп" },
];

export function DashboardSidebar() {
  const searchParams = useSearchParams();
  const active = searchParams.get("tab") ?? "overview";

  return (
    <aside className="fixed left-0 top-0 z-30 hidden h-screen w-64 flex-col border-r border-[color:var(--border)] bg-[color:var(--surface)] px-4 py-6 lg:flex">
      <div className="mb-8 px-3">
        <div className="text-xs font-semibold uppercase tracking-[0.28em] text-[color:var(--text-dim)]">
          Tech Job
        </div>
        <div className="mt-1 font-display text-lg text-[color:var(--text)]">
          Market Intelligence
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-1">
        {items.map((item) => {
          const isActive = active === item.id;
          return (
            <Link
              key={item.id}
              href={`/dashboard?tab=${item.id}`}
              className={`rounded-2xl px-4 py-2.5 text-sm font-medium transition ${
                isActive
                  ? "bg-[color:var(--bg)] text-white"
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
