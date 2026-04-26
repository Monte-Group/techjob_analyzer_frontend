"use client";

import { useEffect, useRef, useState } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "/api-proxy";

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
  const answerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (answer) {
      answerRef.current?.scrollTo({ top: answerRef.current.scrollHeight, behavior: "smooth" });
    }
  }, [answer]);

  async function ask(event: React.FormEvent) {
    event.preventDefault();
    if (!question.trim() || loading) return;

    setAnswer("");
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE}/ai/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, source }),
        credentials: "include",
      });

      const reader = response.body?.getReader();
      if (!reader) return;

      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          if (line.startsWith("data: ")) {
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
          className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[color:var(--bg)] text-white shadow-lg transition hover:scale-105 hover:bg-[color:var(--surface-2)]"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        </button>
      )}

      {open && (
        <div className="fixed bottom-6 right-6 z-40 flex h-[32rem] w-[22rem] flex-col overflow-hidden rounded-[24px] border border-[color:var(--border)] bg-[color:var(--surface)] shadow-2xl sm:w-[26rem]">
          <div className="flex items-center justify-between border-b border-[color:var(--border)] bg-[color:var(--bg-2)] px-4 py-3">
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.24em] text-[color:var(--text-dim)]">AI чат</div>
              <div className="text-sm font-semibold text-[color:var(--text)]">Спроси про рынок</div>
            </div>
            <button
              onClick={() => setOpen(false)}
              aria-label="Закрыть AI чат"
              className="rounded-full p-1.5 text-[color:var(--text-dim)] transition hover:bg-[color:var(--bg)] hover:text-[color:var(--text)]"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          <div className="flex gap-1 border-b border-[color:var(--border)] bg-[color:var(--surface)] px-3 py-2">
            {(Object.keys(sourceLabels) as Source[]).map((s) => (
              <button
                key={s}
                onClick={() => setSource(s)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                  source === s
                    ? "bg-[color:var(--bg)] text-white"
                    : "text-[color:var(--text-dim)] hover:bg-[color:var(--bg-2)]"
                }`}
              >
                {sourceLabels[s]}
              </button>
            ))}
          </div>

          <div
            ref={answerRef}
            className="flex-1 overflow-y-auto whitespace-pre-wrap bg-[color:var(--bg)] px-4 py-4 text-sm leading-6 text-[color:var(--text)]"
          >
            {answer || (
              <span className="text-[color:var(--text-dim)]">
                Задай вопрос про IT-рынок Казахстана. Например: «какие зарплаты у Python-разработчиков в Алматы?»
              </span>
            )}
            {loading && !answer && (
              <span className="inline-block h-3 w-2 animate-pulse rounded bg-[color:var(--accent-bright)] align-middle" />
            )}
          </div>

          <form onSubmit={ask} className="flex gap-2 border-t border-[color:var(--border)] bg-[color:var(--surface)] px-3 py-3">
            <input
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Спросить..."
              className="flex-1 rounded-full border border-[color:var(--border)] bg-[color:var(--bg-2)] px-4 py-2 text-sm text-[color:var(--text)] outline-none transition focus:border-[color:var(--border-strong)]"
            />
            <button
              type="submit"
              disabled={loading || !question.trim()}
              className="rounded-full bg-[color:var(--bg)] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[color:var(--surface-2)] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "..." : "→"}
            </button>
          </form>
        </div>
      )}
    </>
  );
}
