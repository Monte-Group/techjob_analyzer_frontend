"use client";

import { useEffect, useRef, useState } from "react";
import { fetchAIChat, readSSELines } from "@/lib/sse";
import { AIChatChart, chartTitle, type ChartPayload } from "@/widgets/dashboard/ai-chat-charts";

type Source = "all" | "hh" | "telegram";

const sourceLabels: Record<Source, string> = {
  all: "Все",
  hh: "HH",
  telegram: "Telegram",
};

export function AiChatFab() {
  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [source, setSource] = useState<Source>("all");
  const [chart, setChart] = useState<ChartPayload | null>(null);
  const answerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (answer || chart) {
      answerRef.current?.scrollTo({ top: answerRef.current.scrollHeight, behavior: "smooth" });
    }
  }, [answer, chart]);

  async function ask(event: React.FormEvent) {
    event.preventDefault();
    if (!question.trim() || loading) return;

    setAnswer("");
    setChart(null);
    setLoading(true);

    try {
      const response = await fetchAIChat({ question, source });
      if (!response.body) return;

      for await (const line of readSSELines(response.body)) {
        if (line.startsWith("chart: ")) {
          try {
            setChart(JSON.parse(line.slice(7)) as ChartPayload);
          } catch {
            // ignore invalid chart payload
          }
        } else if (line.startsWith("data: ")) {
          const raw = line.slice(6);
          let chunk = raw;
          try {
            chunk = JSON.parse(raw) as string;
          } catch {
            chunk = raw;
          }
          if (chunk === "[DONE]") continue;
          setAnswer((prev) => prev + chunk);
        }
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {!open && (
        <button
          onClick={() => setOpen(true)}
          aria-label="Открыть AI чат"
          className="fixed bottom-6 right-6 z-40 flex items-center gap-3 rounded-full border border-[color:var(--border-strong)] bg-[linear-gradient(135deg,rgba(124,108,255,0.14),rgba(124,108,255,0.04)_48%,transparent)] px-4 py-3 text-[color:var(--text)] shadow-[0_20px_50px_rgba(15,23,42,0.18)] transition hover:scale-[1.02] hover:bg-[color:var(--surface-2)]"
        >
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[color:var(--bg-2)]">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </span>
          <span className="hidden text-left sm:block">
            <span className="block text-sm font-semibold text-[color:var(--text)]">AI-анализ рынка</span>
          </span>
          <svg className="hidden sm:block" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </button>
      )}

      {open && (
        <div className="fixed inset-x-3 bottom-3 top-[5.25rem] z-40 flex flex-col overflow-hidden rounded-[28px] border border-[color:var(--border)] bg-[color:var(--surface)] shadow-[0_30px_90px_rgba(15,23,42,0.28)] sm:inset-x-auto sm:bottom-6 sm:right-6 sm:top-auto sm:h-[min(52rem,calc(100vh-7rem))] sm:w-[min(44rem,calc(100vw-5rem))]">
          <div className="relative border-b border-[color:var(--border)] bg-[linear-gradient(135deg,rgba(124,108,255,0.18),rgba(124,108,255,0.06)_46%,var(--surface-2))] px-5 py-4 text-[color:var(--text)]">
            <div className="flex items-start justify-between gap-4">
              <div className="max-w-[32rem]">
                <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[color:var(--text-dim)]">
                  AI Chat
                </div>
                <div className="mt-2 text-xl font-semibold leading-tight sm:text-2xl">
                  Главный AI-интерфейс для анализа IT-рынка
                </div>
                <div className="mt-2 text-sm leading-6 text-[color:var(--text-dim)]">
                  Спроси про навыки, зарплаты, тренды и различия между HH и Telegram. Ответ приходит вместе с графиком на том же срезе данных.
                </div>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              aria-label="Закрыть AI чат"
              className="absolute right-4 top-4 rounded-full border border-[color:var(--border)] p-2 text-[color:var(--text-dim)] transition hover:bg-[color:var(--bg-2)] hover:text-[color:var(--text)]"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          <div className="flex gap-1 border-b border-[color:var(--border)] bg-[color:var(--surface)] px-4 py-3">
            {(Object.keys(sourceLabels) as Source[]).map((s) => (
              <button
                key={s}
                onClick={() => setSource(s)}
                className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] transition ${
                  source === s
                    ? "bg-[color:var(--bg)] text-[color:var(--text)]"
                    : "text-[color:var(--text-dim)] hover:bg-[color:var(--bg-2)] hover:text-[color:var(--text)]"
                }`}
              >
                {sourceLabels[s]}
              </button>
            ))}
          </div>

          <div
            ref={answerRef}
            className="flex-1 overflow-y-auto bg-[color:var(--bg)] px-5 py-5 sm:px-6"
          >
            <div className="space-y-5">
              <div className="rounded-[24px] bg-[color:var(--surface)] px-5 py-4 shadow-sm">
                <div className="mb-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-[color:var(--text-dim)]">
                  Ответ AI
                </div>
                <div className="whitespace-pre-wrap text-[15px] leading-7 text-[color:var(--text)]">
                  {answer || (
                    <span className="text-[color:var(--text-dim)]">
                      Задай вопрос про IT-рынок Казахстана. Например: «какие зарплаты у Python-разработчиков в Алматы?» или «сравни спрос на Go и Java».
                    </span>
                  )}
                  {loading && !answer && (
                    <span className="inline-block h-3 w-2 animate-pulse rounded bg-[color:var(--accent-bright)] align-middle" />
                  )}
                </div>
              </div>

              {chart && (
                <div className="rounded-[24px] border border-[color:var(--border)] bg-[color:var(--surface)] p-4 sm:p-5">
                  <div className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--text-dim)]">
                    {chartTitle(chart.type)}
                  </div>
                  <AIChatChart chart={chart} compact />
                </div>
              )}
            </div>
          </div>

          <form onSubmit={ask} className="border-t border-[color:var(--border)] bg-[color:var(--surface)] px-4 py-4 sm:px-5">
            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Например: сравни зарплаты Python и Go в Алматы"
                className="min-w-0 flex-1 rounded-[18px] border border-[color:var(--border)] bg-[color:var(--bg-2)] px-5 py-3 text-sm text-[color:var(--text)] outline-none transition focus:border-[color:var(--border-strong)]"
              />
              <button
                type="submit"
                disabled={loading || !question.trim()}
                className="rounded-[18px] bg-[color:var(--accent)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[color:var(--accent-bright)] disabled:cursor-not-allowed disabled:opacity-50 sm:min-w-36"
              >
                {loading ? "AI анализирует..." : "Запустить анализ"}
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
