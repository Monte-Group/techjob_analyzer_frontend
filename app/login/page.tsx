"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

import { login, register } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(15,118,110,0.18),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(245,158,11,0.18),_transparent_24%),linear-gradient(180deg,_#f4efe3_0%,_#f8f7f2_55%,_#edf4f1_100%)] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl items-center gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <section className="rounded-[34px] border border-white/70 bg-white/68 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur md:p-10">
          <div className="inline-flex rounded-full border border-stone-200 bg-stone-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-stone-500">
            Kazakhstan IT Market
          </div>
          <h1 className="mt-5 font-serif text-4xl leading-tight text-stone-950 md:text-6xl">
            Аналитика HH, сигналы Telegram и AI-интерпретация рынка в одном продукте.
          </h1>
          <p className="mt-5 max-w-xl text-sm leading-7 text-stone-600 md:text-base">
            Платформа объединяет структурированную аналитику HH, живой Telegram-слой и AI-чат, который понимает выбранный
            источник данных, а не отвечает абстрактно.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <FeatureCard title="HH ядро" text="Тренды, зарплаты, работодатели и более чистая база для графиков." />
            <FeatureCard title="Telegram слой" text="Вариативность, живые сигналы рынка и быстрые изменения в каналах." />
            <FeatureCard title="AI анализ" text="Ответы и графики в контексте выбранного источника, а не в вакууме." />
          </div>
        </section>

        <section className="rounded-[34px] bg-stone-950 p-6 text-stone-50 shadow-[0_30px_90px_rgba(28,25,23,0.2)] md:p-8">
          <div className="mb-8 flex rounded-full bg-white/8 p-1">
            {(["login", "register"] as const).map((currentMode) => (
              <button
                key={currentMode}
                onClick={() => setMode(currentMode)}
                className={`flex-1 rounded-full px-4 py-2.5 text-sm font-semibold transition ${
                  mode === currentMode ? "bg-white text-stone-950" : "text-stone-300 hover:text-white"
                }`}
              >
                {currentMode === "login" ? "Вход" : "Регистрация"}
              </button>
            ))}
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-stone-400">
              {mode === "login" ? "Возврат в рабочую панель" : "Создание новой сессии"}
            </p>
            <h2 className="mt-3 text-3xl font-semibold">
              {mode === "login" ? "Войти в dashboard" : "Создать аккаунт"}
            </h2>
            <p className="mt-3 text-sm leading-6 text-stone-300">
              {mode === "login"
                ? "Продолжай анализировать рынок в выбранном источнике: HH, Telegram или объединённая выборка."
                : "После регистрации ты сразу попадёшь в аналитический dashboard и AI-чат."}
            </p>
          </div>

          <form onSubmit={submit} className="mt-8 space-y-5">
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-stone-200">Email</span>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="user@example.com"
                required
                className="w-full rounded-[22px] border border-white/12 bg-white/8 px-4 py-3 text-sm text-white outline-none transition placeholder:text-stone-400 focus:border-amber-400"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-stone-200">Пароль</span>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Минимум 8 символов и хотя бы одна цифра"
                required
                minLength={8}
                className="w-full rounded-[22px] border border-white/12 bg-white/8 px-4 py-3 text-sm text-white outline-none transition placeholder:text-stone-400 focus:border-amber-400"
              />
            </label>

            {error && <p className="rounded-2xl border border-rose-400/30 bg-rose-400/10 px-4 py-3 text-sm text-rose-200">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-amber-400 px-5 py-3 text-sm font-semibold text-stone-950 transition hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Подождите..." : mode === "login" ? "Войти" : "Зарегистрироваться"}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}

function FeatureCard({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-[24px] border border-stone-200/80 bg-stone-50/80 p-4">
      <h3 className="text-lg font-semibold text-stone-950">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-stone-600">{text}</p>
    </div>
  );
}
