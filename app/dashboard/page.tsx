"use client";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, Legend,
} from "recharts";
import {
  getCompanies,
  getEmployment,
  getExperience,
  getRegions,
  getSkillBreakdown,
  getSkills,
  getSalaries,
  getSummary,
  getTrends,
} from "@/lib/api";
import api from "@/lib/api";

interface Skill { skill: string; count: number }
interface SkillGroup { category: string; label: string; items: Skill[] }
interface Salary { skill: string; avg_salary_kzt: number; vacancy_count: number }
interface Trend { month: string; count: number }
interface RegionStat {
  region: string;
  vacancy_count: number;
  with_salary: number;
  without_salary: number;
  avg_salary_kzt: number;
}
interface CompanyStat {
  company: string;
  vacancy_count: number;
  with_salary: number;
  without_salary: number;
  avg_salary_kzt: number;
}
interface LabeledCount { label: string; count: number }
interface Summary { total_vacancies: number; with_salary: number }
interface ChartPayload {
  type: "skills" | "salaries" | "trends" | "regions" | "experience" | "employment" | "companies";
  data: Skill[] | Salary[] | Trend[] | RegionStat[] | CompanyStat[] | LabeledCount[];
}

const fmtSalary = (v: number) =>
  new Intl.NumberFormat("ru-KZ", { maximumFractionDigits: 0 }).format(v);

export default function Dashboard() {
  const router = useRouter();
  const [skills, setSkills] = useState<Skill[]>([]);
  const [skillGroups, setSkillGroups] = useState<SkillGroup[]>([]);
  const [salaries, setSalaries] = useState<Salary[]>([]);
  const [trends, setTrends] = useState<Trend[]>([]);
  const [regions, setRegions] = useState<RegionStat[]>([]);
  const [experience, setExperience] = useState<LabeledCount[]>([]);
  const [employment, setEmployment] = useState<LabeledCount[]>([]);
  const [companies, setCompanies] = useState<CompanyStat[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [chatChart, setChatChart] = useState<ChartPayload | null>(null);
  const [chatLoading, setChatLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"skills" | "salaries" | "trends" | "regions" | "segments" | "companies" | "ai">("skills");
  const [salaryCategory, setSalaryCategory] = useState<string>("all");
  const [parserLoading, setParserLoading] = useState(false);
  const [parserMsg, setParserMsg] = useState("");
  const answerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      router.replace("/login");
      return;
    }
    Promise.all([
      getSkills(20),
      getSkillBreakdown(6),
      getSalaries(),
      getTrends(),
      getRegions(),
      getExperience(),
      getEmployment(),
      getCompanies(),
      getSummary(),
    ]).then(
      ([s, groups, sal, tr, reg, exp, emp, comp, sum]) => {
        setSkills(s);
        setSkillGroups(groups);
        setSalaries(sal.slice(0, 15));
        setTrends(tr);
        setRegions(reg);
        setExperience(exp);
        setEmployment(emp);
        setCompanies(comp);
        setSummary(sum);
      }
    );
  }, [router]);

  useEffect(() => {
    if (!localStorage.getItem("token")) return;
    getSalaries(salaryCategory === "all" ? undefined : salaryCategory).then((data) => {
      setSalaries(data.slice(0, 15));
    });
  }, [salaryCategory]);

  async function askAI(e: React.FormEvent) {
    e.preventDefault();
    if (!question.trim()) return;
    setAnswer("");
    setChatChart(null);
    setChatLoading(true);
    const token = localStorage.getItem("token");
    try {
      const resp = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL ?? "/api-proxy"}/ai/chat`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ question }),
        }
      );
      const reader = resp.body!.getReader();
      const decoder = new TextDecoder();
      let buf = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += decoder.decode(value, { stream: true });
        const lines = buf.split("\n");
        buf = lines.pop() ?? "";
        for (const line of lines) {
          if (line.startsWith("chart: ")) {
            try {
              setChatChart(JSON.parse(line.slice(7)));
            } catch { /* ignore */ }
          } else if (line.startsWith("data: ")) {
            const chunk = line.slice(6);
            if (chunk === "[DONE]") continue;
            setAnswer((prev) => prev + chunk);
            setTimeout(() => answerRef.current?.scrollIntoView({ behavior: "smooth" }), 10);
          }
        }
      }
    } finally {
      setChatLoading(false);
    }
  }

  async function triggerParser() {
    setParserLoading(true);
    setParserMsg("");
    try {
      const { data } = await api.post("/parser/run");
      setParserMsg(`Задача запущена: ${data.task_id}`);
    } catch {
      setParserMsg("Ошибка запуска парсера");
    } finally {
      setParserLoading(false);
    }
  }

  function logout() {
    localStorage.removeItem("token");
    router.replace("/login");
  }

  const tabs = [
    { id: "skills", label: "Топ навыки" },
    { id: "salaries", label: "Зарплаты" },
    { id: "trends", label: "Тренды" },
    { id: "regions", label: "Регионы" },
    { id: "segments", label: "Сегменты" },
    { id: "companies", label: "Компании" },
    { id: "ai", label: "AI-анализ" },
  ] as const;

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">IT-рынок Казахстана</h1>
          <p className="text-sm text-gray-500">Анализ вакансий hh.kz</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={triggerParser}
            disabled={parserLoading}
            className="px-3 py-1.5 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            {parserLoading ? "Запуск..." : "Обновить данные"}
          </button>
          <button
            onClick={logout}
            className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700"
          >
            Выйти
          </button>
        </div>
      </header>

      {parserMsg && (
        <div className="bg-green-50 border-b border-green-200 px-6 py-2 text-sm text-green-700">
          {parserMsg}
        </div>
      )}

      {summary && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 px-6 py-4 bg-white border-b border-gray-100">
          <Stat label="Всего вакансий" value={summary.total_vacancies.toLocaleString("ru")} />
          <Stat label="С зарплатой" value={summary.with_salary.toLocaleString("ru")} />
          <Stat
            label="% с зарплатой"
            value={`${Math.round((summary.with_salary / summary.total_vacancies) * 100)}%`}
          />
          <Stat label="Топ навык" value={skills[0]?.skill ?? "—"} />
        </div>
      )}

      <div className="flex border-b border-gray-200 bg-white px-6">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === t.id
                ? "border-indigo-600 text-indigo-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <main className="flex-1 p-6">
        {activeTab === "skills" && (
          <div className="space-y-6">
            <ChartCard title="Топ-20 востребованных навыков">
              <SkillsChart data={skills} />
            </ChartCard>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {skillGroups.map((group) => (
                <div key={group.category} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">{group.label}</h3>
                  <div className="space-y-2">
                    {group.items.map((item) => (
                      <div key={`${group.category}-${item.skill}`} className="flex items-center justify-between gap-3 text-sm">
                        <span className="text-gray-700">{item.skill}</span>
                        <span className="text-indigo-600 font-medium">{item.count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "salaries" && (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {[
                { id: "all", label: "Все" },
                ...skillGroups.map((group) => ({ id: group.category, label: group.label })),
              ].map((option) => (
                <button
                  key={option.id}
                  onClick={() => setSalaryCategory(option.id)}
                  className={`px-3 py-1.5 text-sm rounded-full border ${
                    salaryCategory === option.id
                      ? "bg-indigo-600 text-white border-indigo-600"
                      : "bg-white text-gray-700 border-gray-300"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
            <ChartCard title="Средняя зарплата по навыкам (₸/мес)">
              <SalariesChart data={salaries} />
            </ChartCard>
          </div>
        )}

        {activeTab === "trends" && (
          <ChartCard title="Количество вакансий по месяцам">
            <TrendsChart data={trends} />
          </ChartCard>
        )}

        {activeTab === "regions" && (
          <div className="space-y-6">
            <ChartCard title="Топ регионов по числу вакансий">
              <RegionsChart data={regions} />
            </ChartCard>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {regions.slice(0, 6).map((region) => (
                <div key={region.region} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5">
                  <h3 className="text-sm font-semibold text-gray-900">{region.region}</h3>
                  <div className="mt-3 space-y-1 text-sm text-gray-600">
                    <p>Вакансий: <span className="font-medium text-gray-900">{region.vacancy_count}</span></p>
                    <p>С зарплатой: <span className="font-medium text-gray-900">{region.with_salary}</span></p>
                    <p>Без зарплаты: <span className="font-medium text-gray-900">{region.without_salary}</span></p>
                    <p>Средняя зарплата: <span className="font-medium text-gray-900">{region.avg_salary_kzt ? `${fmtSalary(region.avg_salary_kzt)} ₸` : "—"}</span></p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "segments" && (
          <div className="grid gap-6 xl:grid-cols-2">
            <ChartCard title="Распределение по опыту">
              <DistributionChart data={experience} valueLabel="Вакансий" />
            </ChartCard>
            <ChartCard title="Распределение по занятости">
              <DistributionChart data={employment} valueLabel="Вакансий" />
            </ChartCard>
          </div>
        )}

        {activeTab === "companies" && (
          <div className="space-y-6">
            <ChartCard title="Топ работодателей по числу вакансий">
              <CompaniesChart data={companies} />
            </ChartCard>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {companies.slice(0, 6).map((company) => (
                <div key={company.company} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5">
                  <h3 className="text-sm font-semibold text-gray-900">{company.company}</h3>
                  <div className="mt-3 space-y-1 text-sm text-gray-600">
                    <p>Вакансий: <span className="font-medium text-gray-900">{company.vacancy_count}</span></p>
                    <p>С зарплатой: <span className="font-medium text-gray-900">{company.with_salary}</span></p>
                    <p>Без зарплаты: <span className="font-medium text-gray-900">{company.without_salary}</span></p>
                    <p>Средняя зарплата: <span className="font-medium text-gray-900">{company.avg_salary_kzt ? `${fmtSalary(company.avg_salary_kzt)} ₸` : "—"}</span></p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "ai" && (
          <div className="max-w-3xl mx-auto space-y-4">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-1">AI-ассистент</h2>
              <p className="text-sm text-gray-500 mb-4">
                Задайте вопрос — получите ответ и автоматический график
              </p>
              <form onSubmit={askAI} className="flex gap-2 mb-4">
                <input
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="Например: Какие навыки самые высокооплачиваемые?"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  type="submit"
                  disabled={chatLoading || !question.trim()}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 whitespace-nowrap"
                >
                  {chatLoading ? "..." : "Спросить"}
                </button>
              </form>

              {!answer && !chatLoading && (
                <div className="space-y-2">
                  <p className="text-xs text-gray-400 font-medium">Примеры вопросов:</p>
                  {[
                    "Какие навыки сейчас наиболее востребованы?",
                    "Какие фреймворки сейчас востребованы отдельно от языков?",
                    "Что выше оплачивается: React или Next.js?",
                    "В каких регионах больше всего Python-вакансий?",
                    "Что по Алматы: какие навыки и зарплаты лидируют?",
                    "Какой опыт чаще всего требуют по QA?",
                    "Какие работодатели активнее всего нанимают DevOps?",
                    "Какая средняя зарплата по фреймворкам?",
                    "Как изменился рынок IT за последние месяцы?",
                  ].map((q) => (
                    <button
                      key={q}
                      onClick={() => setQuestion(q)}
                      className="block w-full text-left px-3 py-2 text-sm text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              )}

              {(answer || chatLoading) && (
                <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-800 leading-relaxed whitespace-pre-wrap min-h-[60px]">
                  {answer}
                  {chatLoading && !answer && (
                    <span className="inline-block w-2 h-4 bg-indigo-400 animate-pulse rounded" />
                  )}
                  <div ref={answerRef} />
                </div>
              )}
            </div>

            {chatChart && (
              <ChartCard title={chartTitle(chatChart.type)}>
                {chatChart.type === "skills" && <SkillsChart data={chatChart.data as Skill[]} />}
                {chatChart.type === "salaries" && <SalariesChart data={chatChart.data as Salary[]} />}
                {chatChart.type === "trends" && <TrendsChart data={chatChart.data as Trend[]} />}
                {chatChart.type === "regions" && <RegionsChart data={chatChart.data as RegionStat[]} />}
                {chatChart.type === "experience" && <DistributionChart data={chatChart.data as LabeledCount[]} valueLabel="Вакансий" />}
                {chatChart.type === "employment" && <DistributionChart data={chatChart.data as LabeledCount[]} valueLabel="Вакансий" />}
                {chatChart.type === "companies" && <CompaniesChart data={chatChart.data as CompanyStat[]} />}
              </ChartCard>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

function chartTitle(type: string) {
  if (type === "salaries") return "Средняя зарплата по навыкам (₸/мес)";
  if (type === "trends") return "Динамика вакансий по месяцам";
  if (type === "regions") return "Регионы";
  if (type === "experience") return "Распределение по опыту";
  if (type === "employment") return "Распределение по занятости";
  if (type === "companies") return "Работодатели";
  return "Топ востребованных навыков";
}

const TICK = { fontSize: 12, fill: "#111827" };

function SkillsChart({ data }: { data: Skill[] }) {
  return (
    <ResponsiveContainer width="100%" height={420}>
      <BarChart data={data} layout="vertical" margin={{ left: 80, right: 20 }}>
        <CartesianGrid strokeDasharray="3 3" horizontal={false} />
        <XAxis type="number" tick={TICK} />
        <YAxis dataKey="skill" type="category" tick={TICK} width={100} interval={0} />
        <Tooltip formatter={(v) => [v, "Вакансий"]} />
        <Bar dataKey="count" fill="#6366f1" radius={[0, 4, 4, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

function SalariesChart({ data }: { data: Salary[] }) {
  return (
    <ResponsiveContainer width="100%" height={420}>
      <BarChart data={data} layout="vertical" margin={{ left: 100, right: 30 }}>
        <CartesianGrid strokeDasharray="3 3" horizontal={false} />
        <XAxis
          type="number"
          tick={TICK}
          tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
        />
        <YAxis dataKey="skill" type="category" tick={TICK} width={100} />
        <Tooltip formatter={(v) => [`${fmtSalary(Number(v))} ₸`, "Средняя зарплата"]} />
        <Bar dataKey="avg_salary_kzt" fill="#10b981" radius={[0, 4, 4, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

function TrendsChart({ data }: { data: Trend[] }) {
  return (
    <ResponsiveContainer width="100%" height={380}>
      <LineChart data={data} margin={{ left: 10, right: 20 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" tick={TICK} />
        <YAxis tick={TICK} />
        <Tooltip formatter={(v) => [v, "Вакансий"]} />
        <Legend />
        <Line
          type="monotone"
          dataKey="count"
          stroke="#6366f1"
          strokeWidth={2}
          dot={{ r: 4 }}
          name="Вакансий"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

function RegionsChart({ data }: { data: RegionStat[] }) {
  return (
    <ResponsiveContainer width="100%" height={420}>
      <BarChart data={data} layout="vertical" margin={{ left: 120, right: 20 }}>
        <CartesianGrid strokeDasharray="3 3" horizontal={false} />
        <XAxis type="number" tick={TICK} />
        <YAxis dataKey="region" type="category" tick={TICK} width={140} interval={0} />
        <Tooltip formatter={(v, name) => [v, name === "with_salary" ? "С зарплатой" : "Без зарплаты"]} />
        <Legend />
        <Bar dataKey="with_salary" fill="#0f766e" radius={[0, 4, 4, 0]} name="С зарплатой" />
        <Bar dataKey="without_salary" fill="#99f6e4" radius={[0, 4, 4, 0]} name="Без зарплаты" />
      </BarChart>
    </ResponsiveContainer>
  );
}

function DistributionChart({ data, valueLabel }: { data: LabeledCount[]; valueLabel: string }) {
  return (
    <ResponsiveContainer width="100%" height={360}>
      <BarChart data={data} margin={{ left: 10, right: 20 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="label" tick={TICK} interval={0} angle={-15} textAnchor="end" height={70} />
        <YAxis tick={TICK} />
        <Tooltip formatter={(v) => [v, valueLabel]} />
        <Bar dataKey="count" fill="#f59e0b" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

function CompaniesChart({ data }: { data: CompanyStat[] }) {
  return (
    <ResponsiveContainer width="100%" height={420}>
      <BarChart data={data} layout="vertical" margin={{ left: 140, right: 20 }}>
        <CartesianGrid strokeDasharray="3 3" horizontal={false} />
        <XAxis type="number" tick={TICK} />
        <YAxis dataKey="company" type="category" tick={TICK} width={160} interval={0} />
        <Tooltip formatter={(v, name) => [v, name === "with_salary" ? "С зарплатой" : "Без зарплаты"]} />
        <Legend />
        <Bar dataKey="with_salary" fill="#7c3aed" radius={[0, 4, 4, 0]} name="С зарплатой" />
        <Bar dataKey="without_salary" fill="#c4b5fd" radius={[0, 4, 4, 0]} name="Без зарплаты" />
      </BarChart>
    </ResponsiveContainer>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-center">
      <p className="text-2xl font-bold text-indigo-700">{value}</p>
      <p className="text-xs text-gray-500 mt-0.5">{label}</p>
    </div>
  );
}

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-base font-semibold text-gray-800 mb-4">{title}</h2>
      {children}
    </div>
  );
}
