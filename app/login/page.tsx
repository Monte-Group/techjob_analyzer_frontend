"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

import { login, register } from "@/lib/api";
import Nav from "@/widgets/nav";
import SiteFooter from "@/widgets/site-footer";
import { Arrow } from "@/shared/ui/Arrow";

const FEATURES = [
  {
    title: "HH ядро",
    text: "Тренды, зарплаты, работодатели и чистая база для графиков.",
  },
  {
    title: "Telegram слой",
    text: "Живые сигналы рынка и быстрые изменения по каналам.",
  },
  {
    title: "AI анализ",
    text: "Ответы и графики в контексте выбранного источника.",
  },
];

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (mode === "login") {
        await login(email, password);
        localStorage.removeItem("token");
        router.push("/dashboard");
      } else {
        await register(email, password);
        await login(email, password);
        localStorage.removeItem("token");
        router.push("/dashboard");
      }
    } catch (requestError) {
      if (axios.isAxiosError(requestError)) {
        const status = requestError.response?.status;
        if (mode === "login") {
          setError(status === 401 ? "Неверный email или пароль" : "Ошибка входа");
        } else {
          setError(status === 409 ? "Email уже зарегистрирован" : "Ошибка регистрации");
        }
      } else {
        setError(mode === "login" ? "Неверный email или пароль" : "Ошибка регистрации");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative text-[color:var(--text)] grain min-h-screen flex flex-col">
      <Nav />

      <section className="relative overflow-hidden flex-1">
        <div className="absolute inset-0 gridlines opacity-[0.5] pointer-events-none" />
        <div
          className="absolute -right-40 -top-40 w-[700px] h-[700px] rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(circle at center, rgba(124,108,255,0.22), rgba(124,108,255,0) 60%)",
          }}
        />

        <div className="mx-auto max-w-[1400px] px-6 md:px-10 pt-16 md:pt-20 pb-16 md:pb-24 relative">
          <div className="grid grid-cols-12 gap-8 items-start">
            <div className="col-span-12 lg:col-span-7 relative">
              <div className="flex items-center gap-3 mb-8 reveal">
                <span className="eyebrow">
                  J<span className="text-[color:var(--accent)]">-</span>AI
                </span>
                <span className="h-[10px] w-px bg-[color:var(--border-strong)]" />
                <span className="eyebrow">
                  {mode === "login" ? "Возврат · в дашборд" : "Создание · сессии"}
                </span>
                <span className="h-[10px] w-px bg-[color:var(--border-strong)]" />
                <span className="flex items-center gap-1.5 eyebrow text-[color:var(--green)]">
                  <span className="live-dot inline-block h-[6px] w-[6px] rounded-full bg-[color:var(--green)]" />
                  LIVE DATA
                </span>
              </div>

              <h1 className="large reveal" style={{ animationDelay: "80ms" }}>
                Аналитика HH, сигналы Telegram
                <br />
                и{" "}
                <em className="not-italic text-[color:var(--accent)] font-display italic font-[500]">
                  AI-интерпретация
                </em>{" "}
                рынка
                <br />
                в одном продукте.
              </h1>

              <p
                className="mt-8 max-w-[560px] text-[16px] md:text-[17px] leading-[1.55] text-[color:var(--text-dim)] reveal"
                style={{ animationDelay: "160ms" }}
              >
                Платформа объединяет структурированную аналитику HH, живой
                Telegram-слой и AI-чат, который понимает выбранный{" "}
                <span className="text-[color:var(--text)]">источник данных</span>,
                а не отвечает абстрактно.
              </p>

              <div
                className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-px bg-[color:var(--border)] hairline reveal"
                style={{ animationDelay: "240ms" }}
              >
                {FEATURES.map((f) => (
                  <div
                    key={f.title}
                    className="bg-[color:var(--bg)] px-5 py-5"
                  >
                    <div className="font-display text-[20px] leading-tight text-[color:var(--text)]">
                      {f.title}
                    </div>
                    <p className="mt-2 text-[13px] leading-relaxed text-[color:var(--text-dim)]">
                      {f.text}
                    </p>
                  </div>
                ))}
              </div>

              <div
                className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 reveal"
                style={{ animationDelay: "320ms" }}
              >
                <span className="eyebrow">Что внутри:</span>
                {[
                  "340+ компаний",
                  "обновление 4ч",
                  "Pro 14 дней",
                ].map((s) => (
                  <span
                    key={s}
                    className="inline-flex items-baseline gap-2 font-mono text-[11px] tracking-[0.08em] uppercase text-[color:var(--text)]"
                  >
                    <span className="text-[color:var(--accent)]">/</span>
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <div
              className="col-span-12 lg:col-span-5 relative reveal"
              style={{ animationDelay: "400ms" }}
            >
              <div className="panel-lift relative">
                <div className="flex items-center justify-between px-4 py-2.5 hairline-b bg-[color:var(--bg)]">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-[color:var(--red)]" />
                    <span className="h-2 w-2 rounded-full bg-[color:var(--accent)]" />
                    <span className="h-2 w-2 rounded-full bg-[color:var(--green)]" />
                  </div>
                  <span className="font-mono text-[10px] tracking-[0.14em] uppercase text-[color:var(--muted)]">
                    j-ai / auth
                  </span>
                  <span className="font-mono text-[10px] text-[color:var(--muted)]">
                    secure · tls
                  </span>
                </div>

                <div className="px-6 py-7 md:px-8 md:py-8">
                  <div className="flex hairline">
                    {(["login", "register"] as const).map((currentMode) => {
                      const active = mode === currentMode;
                      return (
                        <button
                          key={currentMode}
                          type="button"
                          onClick={() => setMode(currentMode)}
                          className={`flex-1 px-4 py-2.5 font-mono text-[11px] tracking-[0.14em] uppercase transition-colors ${
                            active
                              ? "bg-[color:var(--accent)] text-[#fbf4df]"
                              : "bg-transparent text-[color:var(--text-dim)] hover:text-[color:var(--text)]"
                          }`}
                        >
                          {currentMode === "login" ? "Вход" : "Регистрация"}
                        </button>
                      );
                    })}
                  </div>

                  <div className="mt-7">
                    <div className="eyebrow">
                      {mode === "login" ? "Шаг 01 · идентификация" : "Шаг 01 · новый аккаунт"}
                    </div>
                    <h2 className="medium mt-3 text-[1.6rem]">
                      {mode === "login"
                        ? "Войти в дашборд"
                        : "Создать аккаунт"}
                    </h2>
                    <p className="mt-3 text-[14px] leading-relaxed text-[color:var(--text-dim)]">
                      {mode === "login"
                        ? "Продолжай анализировать рынок: HH, Telegram или объединённая выборка."
                        : "После регистрации сразу попадёшь в дашборд и AI-чат."}
                    </p>
                  </div>

                  <form onSubmit={submit} className="mt-7 space-y-5">
                    <label className="block">
                      <span className="eyebrow block mb-2">Email</span>
                      <input
                        type="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        placeholder="user@example.com"
                        required
                        autoComplete="email"
                        className="w-full bg-[color:var(--bg)] hairline px-4 py-3 font-mono text-[13px] text-[color:var(--text)] placeholder:text-[color:var(--muted)] outline-none transition-colors focus:border-[color:var(--accent)]"
                      />
                    </label>

                    <label className="block">
                      <span className="eyebrow block mb-2">Пароль</span>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          value={password}
                          onChange={(event) => setPassword(event.target.value)}
                          placeholder="мин. 8 символов · хотя бы одна цифра"
                          required
                          minLength={8}
                          autoComplete={
                            mode === "login" ? "current-password" : "new-password"
                          }
                          className="w-full bg-[color:var(--bg)] hairline pl-4 pr-12 py-3 font-mono text-[13px] text-[color:var(--text)] placeholder:text-[color:var(--muted)] outline-none transition-colors focus:border-[color:var(--accent)]"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword((v) => !v)}
                          aria-label={showPassword ? "Скрыть пароль" : "Показать пароль"}
                          className="absolute inset-y-0 right-0 flex items-center px-3 text-[color:var(--text-dim)] transition-colors hover:text-[color:var(--text)]"
                        >
                          {showPassword ? (
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                              <line x1="1" y1="1" x2="23" y2="23" />
                            </svg>
                          ) : (
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                              <circle cx="12" cy="12" r="3" />
                            </svg>
                          )}
                        </button>
                      </div>
                    </label>

                    {error && (
                      <p
                        role="alert"
                        className="hairline px-4 py-3 font-mono text-[12px] text-[color:var(--red)]"
                        style={{
                          background: "rgba(255,130,114,0.08)",
                          borderColor: "rgba(255,130,114,0.35)",
                        }}
                      >
                        ! {error}
                      </p>
                    )}

                    <button
                      type="submit"
                      disabled={loading}
                      className="btn-primary w-full justify-center disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {loading
                        ? "Подождите…"
                        : mode === "login"
                          ? "Войти"
                          : "Зарегистрироваться"}
                      <Arrow />
                    </button>

                    <p className="font-mono text-[11px] tracking-[0.06em] text-[color:var(--muted)] leading-relaxed">
                      Продолжая, ты соглашаешься с{" "}
                      <a
                        href="/docs/terms"
                        className="text-[color:var(--accent)] hover:text-[color:var(--accent-bright)]"
                      >
                        офертой
                      </a>{" "}
                      и{" "}
                      <a
                        href="/docs/privacy"
                        className="text-[color:var(--accent)] hover:text-[color:var(--accent-bright)]"
                      >
                        политикой конфиденциальности
                      </a>
                      .
                    </p>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
