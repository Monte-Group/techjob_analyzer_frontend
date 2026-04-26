"use client";

import { useEffect } from "react";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
      <div className="mx-auto max-w-md space-y-4">
        <div className="text-xs font-semibold uppercase tracking-[0.28em] text-[color:var(--text-dim)]">
          Что-то пошло не так
        </div>
        <h2 className="font-display text-2xl text-[color:var(--text)]">
          Ошибка при загрузке дашборда
        </h2>
        <p className="text-sm leading-6 text-[color:var(--text-dim)]">
          {error.message || "Неизвестная ошибка. Попробуй перезагрузить страницу."}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={reset}
            className="rounded-full bg-[color:var(--bg)] px-5 py-2.5 text-sm font-semibold text-[color:var(--text)] transition hover:bg-[color:var(--surface-2)]"
          >
            Перезагрузить
          </button>
          <button
            onClick={() => (window.location.href = "/dashboard")}
            className="rounded-full border border-[color:var(--border)] px-5 py-2.5 text-sm font-semibold text-[color:var(--text)] transition hover:border-[color:var(--border-strong)]"
          >
            На главную
          </button>
        </div>
      </div>
    </div>
  );
}
