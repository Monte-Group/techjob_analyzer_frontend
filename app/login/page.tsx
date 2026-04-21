"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { login, register } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (mode === "login") {
        const token = await login(email, password);
        localStorage.setItem("token", token);
        router.push("/dashboard");
      } else {
        await register(email, password);
        const token = await login(email, password);
        localStorage.setItem("token", token);
        router.push("/dashboard");
      }
    } catch {
      setError(mode === "login" ? "Неверный email или пароль" : "Ошибка регистрации");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">
          IT-рынок Казахстана
        </h1>
        <p className="text-center text-gray-500 text-sm mb-6">Анализ вакансий и AI-инсайты</p>

        <div className="flex rounded-lg overflow-hidden border border-gray-200 mb-6">
          {(["login", "register"] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`flex-1 py-2 text-sm font-medium transition-colors ${
                mode === m ? "bg-indigo-600 text-white" : "bg-white text-gray-600 hover:bg-gray-50"
              }`}
            >
              {m === "login" ? "Войти" : "Регистрация"}
            </button>
          ))}
        </div>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm text-gray-900 placeholder-gray-400 bg-white"
              placeholder="user@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Пароль</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm text-gray-900 placeholder-gray-400 bg-white"
              placeholder="••••••••"
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 transition-colors"
          >
            {loading ? "Загрузка..." : mode === "login" ? "Войти" : "Зарегистрироваться"}
          </button>
        </form>
      </div>
    </div>
  );
}
