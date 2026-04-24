"use client";

import { startTransition, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  exportAnalyticsCsv,
  getCompanies,
  getEmployment,
  getExperience,
  getMe,
  getRegions,
  getSalaryCalc,
  getSalaryHistogram,
  getSkillCard,
  getSkillBreakdown,
  getSkillGap,
  getSkillsCompare,
  getSkills,
  getSalaries,
  getSummary,
  getTrends,
  getTrendingSkills,
  listParseRuns,
  listVacancies,
  triggerParse,
  type CompanyStat,
  type CurrentUser,
  type LabeledCount,
  type MissingSkill,
  type MonthlyTrend as Trend,
  type Page as ApiPage,
  type ParseRun,
  type RegionStat,
  type SalaryBucket,
  type SalaryCalcResult,
  type SalaryRow as Salary,
  type SkillCard as ApiSkillCard,
  type SkillCompareItem,
  type SkillCount as Skill,
  type SkillGapResult,
  type SkillGroup,
  type Summary,
  type TrendingSkill,
  type Vacancy as ApiVacancy,
  type VacancySource,
} from "@/lib/api";

interface ChartPayload {
  type: "skills" | "salaries" | "trends" | "regions" | "experience" | "employment" | "companies" | "salary_histogram" | "skill_compare" | "generic_bar";
  data: Skill[] | Salary[] | Trend[] | RegionStat[] | CompanyStat[] | LabeledCount[] | SalaryBucket[] | SkillCompareItem[] | { label: string; value: number }[];
}

type TabId = "overview" | "skills" | "salaries" | "trends" | "market" | "ai" | "salary-calc" | "skill-gap";

const tabs: { id: TabId; label: string }[] = [
  { id: "overview", label: "Обзор" },
  { id: "skills", label: "Навыки" },
  { id: "salaries", label: "Зарплаты" },
  { id: "trends", label: "Тренды" },
  { id: "market", label: "Срез рынка" },
  { id: "salary-calc", label: "Калькулятор" },
  { id: "skill-gap", label: "Скилл-гэп" },
  { id: "ai", label: "AI чат" },
];

const sourceOptions: { id: VacancySource; label: string; note: string }[] = [
  { id: "hh", label: "HH", note: "Основная аналитическая база" },
  { id: "telegram", label: "Telegram", note: "Живой неформальный слой рынка" },
  { id: "all", label: "Все", note: "Общая картина по двум источникам" },
];

const sourceTitles: Record<VacancySource, string> = {
  hh: "HH как аналитическое ядро",
  telegram: "Telegram как живой слой рынка",
  all: "Сводная картина по двум источникам",
};

const sourceDescriptions: Record<VacancySource, string> = {
  hh: "Используй этот режим для устойчивой аналитики, зарплатных сравнений и структурированных ответов AI.",
  telegram: "Используй этот режим, чтобы смотреть сигналы из каналов, живые роли и менее формальные требования.",
  all: "Используй этот режим для общей картины, но помни: HH и Telegram имеют разную структуру и качество данных.",
};

const chatExamples: Record<VacancySource, string[]> = {
  hh: [
    "Какие навыки сейчас самые востребованные на HH?",
    "Какие навыки на HH дают самую высокую зарплату?",
    "Как менялся спрос на backend-вакансии по месяцам?",
  ],
  telegram: [
    "Что чаще всего публикуют в Telegram-каналах за последние дни?",
    "Какие роли и навыки чаще встречаются в Telegram?",
    "Есть ли зарплатные сигналы по Telegram-вакансиям?",
  ],
  all: [
    "Чем Telegram рынок отличается от HH по навыкам?",
    "Какие технологии лидируют в общей выборке?",
    "Что сильнее влияет на рынок: HH или Telegram-сигналы?",
  ],
};

const chartColors = ["#0f766e", "#f59e0b", "#1d4ed8", "#dc2626", "#7c3aed", "#0891b2"];

const fmtInt = (value: number) => new Intl.NumberFormat("ru-RU").format(value);
const fmtSalary = (value: number) => `${new Intl.NumberFormat("ru-KZ", { maximumFractionDigits: 0 }).format(value)} ₸`;
const clientBackendBase =
  process.env.NEXT_PUBLIC_API_URL ??
  (typeof window !== "undefined" ? "http://localhost:8000" : "/api-proxy");

export default function Dashboard() {
  const router = useRouter();
  const answerRef = useRef<HTMLDivElement>(null);

  const [source, setSource] = useState<VacancySource>("hh");
  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const [salaryCategory, setSalaryCategory] = useState("all");

  const [skills, setSkills] = useState<Skill[]>([]);
  const [skillGroups, setSkillGroups] = useState<SkillGroup[]>([]);
  const [salaries, setSalaries] = useState<Salary[]>([]);
  const [salaryHistogram, setSalaryHistogram] = useState<SalaryBucket[]>([]);
  const [trends, setTrends] = useState<Trend[]>([]);
  const [regions, setRegions] = useState<RegionStat[]>([]);
  const [experience, setExperience] = useState<LabeledCount[]>([]);
  const [employment, setEmployment] = useState<LabeledCount[]>([]);
  const [companies, setCompanies] = useState<CompanyStat[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [trendingSkills, setTrendingSkills] = useState<TrendingSkill[]>([]);
  const [compareRows, setCompareRows] = useState<SkillCompareItem[]>([]);
  const [selectedSkill, setSelectedSkill] = useState("");
  const [skillCard, setSkillCard] = useState<ApiSkillCard | null>(null);
  const [skillCardLoading, setSkillCardLoading] = useState(false);
  const [skillCardError, setSkillCardError] = useState("");
  const [vacancyQuery, setVacancyQuery] = useState("");
  const [vacancySearch, setVacancySearch] = useState("");
  const [vacancySkill, setVacancySkill] = useState("");
  const [vacancyWithSalary, setVacancyWithSalary] = useState(false);
  const [vacancySource, setVacancySource] = useState<"all" | "hh" | "telegram">("all");
  const [vacanciesPageNumber, setVacanciesPageNumber] = useState(1);
  const [vacancies, setVacancies] = useState<ApiPage<ApiVacancy> | null>(null);
  const [selectedVacancy, setSelectedVacancy] = useState<ApiVacancy | null>(null);
  const [vacanciesLoading, setVacanciesLoading] = useState(false);
  const [csvLoading, setCsvLoading] = useState(false);

  const [salaryCalcSkill, setSalaryCalcSkill] = useState("");
  const [salaryCalcExp, setSalaryCalcExp] = useState("");
  const [salaryCalcRegion, setSalaryCalcRegion] = useState("");
  const [salaryCalcResult, setSalaryCalcResult] = useState<SalaryCalcResult | null>(null);
  const [salaryCalcTrend, setSalaryCalcTrend] = useState<{ delta: number; pct: number } | null>(null);
  const [salaryCalcLoading, setSalaryCalcLoading] = useState(false);
  const [salaryCalcError, setSalaryCalcError] = useState("");

  const [skillGapInput, setSkillGapInput] = useState("");
  const [skillGapSelected, setSkillGapSelected] = useState<string[]>([]);
  const [skillGapResult, setSkillGapResult] = useState<SkillGapResult | null>(null);
  const [skillGapLoading, setSkillGapLoading] = useState(false);
  const [skillGapError, setSkillGapError] = useState("");

  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [chatChart, setChatChart] = useState<ChartPayload | null>(null);
  const [chatLoading, setChatLoading] = useState(false);

  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [parseRuns, setParseRuns] = useState<ParseRun[]>([]);
  const [parseRunsLoading, setParseRunsLoading] = useState(false);
  const [parseTriggerLoading, setParseTriggerLoading] = useState<"hh" | "telegram" | null>(null);
  const [parseTriggerError, setParseTriggerError] = useState("");
  const [activeParseRunId, setActiveParseRunId] = useState<string | null>(null);
  const [parseStreamStatus, setParseStreamStatus] = useState("");
  const parseStreamRef = useRef<AbortController | null>(null);
  const [showAdminPanel, setShowAdminPanel] = useState(false);

  const [dashboardLoading, setDashboardLoading] = useState(true);

  async function loadMe() {
    try {
      const user = await getMe();
      setCurrentUser(user);
    } catch {
      // not critical — keep null
    }
  }

  async function loadParseRuns() {
    setParseRunsLoading(true);
    try {
      const runs = await listParseRuns();
      setParseRuns(runs);
    } finally {
      setParseRunsLoading(false);
    }
  }

  function streamParseStatus(runId: string) {
    const controller = new AbortController();
    parseStreamRef.current?.abort();
    parseStreamRef.current = controller;
    setParseStreamStatus("Запущен...");

    const token = localStorage.getItem("token");
    const base = process.env.NEXT_PUBLIC_API_URL ?? "/api-proxy";

    void (async () => {
      try {
        const response = await fetch(`${base}/parser/runs/${runId}/stream`, {
          headers: { Authorization: `Bearer ${token ?? ""}` },
          signal: controller.signal,
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
            if (!line.startsWith("data: ")) continue;
            try {
              const payload = JSON.parse(line.slice(6)) as { status: string; vacancies_fetched?: number; error?: string };
              if (payload.status === "done") {
                setParseStreamStatus(`Готово — загружено ${payload.vacancies_fetched ?? 0} вакансий`);
                setActiveParseRunId(null);
                void loadParseRuns();
                return;
              } else if (payload.status === "failed") {
                setParseStreamStatus(`Ошибка: ${payload.error ?? "неизвестная"}`);
                setActiveParseRunId(null);
                void loadParseRuns();
                return;
              } else {
                setParseStreamStatus("Идёт парсинг...");
              }
            } catch {
              // ignore
            }
          }
        }
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          setParseStreamStatus("Соединение прервано");
          setActiveParseRunId(null);
        }
      }
    })();
  }

  async function handleTriggerParse(parseType: "hh" | "telegram") {
    setParseTriggerError("");
    setParseTriggerLoading(parseType);
    try {
      const result = await triggerParse(parseType);
      setActiveParseRunId(result.run_id);
      setParseStreamStatus("Запускаю...");
      streamParseStatus(result.run_id);
      await loadParseRuns();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Ошибка запуска";
      setParseTriggerError(msg);
    } finally {
      setParseTriggerLoading(null);
    }
  }

  async function loadDashboard(nextSource: VacancySource) {
    setDashboardLoading(true);
    try {
      const [
        topSkills,
        grouped,
        salaryRows,
        histogramRows,
        trendRows,
        regionRows,
        expRows,
        empRows,
        companyRows,
        summaryRow,
        trendingRows,
      ] =
        await Promise.all([
          getSkills(12, nextSource),
          getSkillBreakdown(6, nextSource),
          getSalaries(undefined, nextSource),
          getSalaryHistogram(nextSource),
          getTrends(nextSource),
          getRegions(nextSource),
          getExperience(undefined, nextSource),
          getEmployment(undefined, nextSource),
          getCompanies(nextSource),
          getSummary(nextSource),
          getTrendingSkills(8, nextSource),
        ]);

      setSkills(topSkills);
      setSkillGroups(grouped);
      setSalaries(salaryRows.slice(0, 12));
      setSalaryHistogram(histogramRows);
      setTrends(trendRows);
      setRegions(regionRows);
      setExperience(expRows);
      setEmployment(empRows);
      setCompanies(companyRows);
      setSummary(summaryRow);
      setTrendingSkills(trendingRows);

      const compareSkillNames = topSkills.slice(0, 3).map((item) => item.skill);
      if (compareSkillNames.length >= 2) {
        const compareData = await getSkillsCompare(compareSkillNames, nextSource);
        setCompareRows(compareData);
      } else {
        setCompareRows([]);
      }

      const fallbackSkill = topSkills[0]?.skill ?? trendingRows[0]?.skill ?? "";
      if (fallbackSkill && !selectedSkill) {
        setSelectedSkill(fallbackSkill);
      }
    } finally {
      setDashboardLoading(false);
    }
  }

  async function loadSalaries(nextSource: VacancySource, category: string) {
    const rows = await getSalaries(category === "all" ? undefined : category, nextSource);
    setSalaries(rows.slice(0, 12));
  }

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      router.replace("/login");
      return;
    }
    void loadMe();
    startTransition(() => {
      void loadDashboard(source);
    });
  }, [source]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    return () => {
      parseStreamRef.current?.abort();
    };
  }, []);

  useEffect(() => {
    if (!localStorage.getItem("token")) return;
    startTransition(() => {
      void loadSalaries(source, salaryCategory);
    });
  }, [salaryCategory, source]);

  useEffect(() => {
    if (!localStorage.getItem("token") || !selectedSkill) return;

    let active = true;

    startTransition(() => {
      setSkillCardLoading(true);
      setSkillCardError("");
      void getSkillCard(selectedSkill, source)
        .then((data) => {
          if (!active) return;
          setSkillCard(data);
        })
        .catch(() => {
          if (!active) return;
          setSkillCard(null);
          setSkillCardError("Карточку навыка пока не удалось загрузить.");
        })
        .finally(() => {
          if (active) setSkillCardLoading(false);
        });
    });

    return () => {
      active = false;
    };
  }, [selectedSkill, source]);

  useEffect(() => {
    if (!localStorage.getItem("token")) return;

    let active = true;

    startTransition(() => {
      setVacanciesLoading(true);
      void listVacancies({
        page: vacanciesPageNumber,
        size: 8,
        source: vacancySource,
        search: vacancySearch || undefined,
        skill: vacancySkill || undefined,
        with_salary: vacancyWithSalary || undefined,
      })
        .then((page) => {
          if (!active) return;
          setVacancies(page);
          setSelectedVacancy((current) =>
            current && page.items.some((item) => item.id === current.id) ? current : (page.items[0] ?? null)
          );
        })
        .finally(() => {
          if (active) setVacanciesLoading(false);
        });
    });

    return () => {
      active = false;
    };
  }, [vacancySource, vacanciesPageNumber, vacancySearch, vacancySkill, vacancyWithSalary]);

  async function runSalaryCalc(event: React.FormEvent) {
    event.preventDefault();
    if (!salaryCalcSkill.trim()) return;
    setSalaryCalcLoading(true);
    setSalaryCalcError("");
    setSalaryCalcResult(null);
    setSalaryCalcTrend(null);
    try {
      const [result, trendData] = await Promise.all([
        getSalaryCalc({ skill: salaryCalcSkill.trim(), experience: salaryCalcExp || undefined, region: salaryCalcRegion || undefined, source }),
        getTrends(source, salaryCalcSkill.trim()),
      ]);
      if (!result) {
        setSalaryCalcError("Нет данных по выбранным параметрам. Попробуй другой навык или убери фильтры.");
      } else {
        setSalaryCalcResult(result);
        if (trendData.length >= 2) {
          const last = trendData[trendData.length - 1]!;
          const prev = trendData[trendData.length - 2]!;
          const delta = last.count - prev.count;
          const pct = prev.count > 0 ? Math.round((delta / prev.count) * 100) : 0;
          setSalaryCalcTrend({ delta, pct });
        }
      }
    } catch {
      setSalaryCalcError("Ошибка при получении данных.");
    } finally {
      setSalaryCalcLoading(false);
    }
  }

  function addSkillGapSkill() {
    const skill = skillGapInput.trim();
    if (!skill || skillGapSelected.includes(skill)) return;
    setSkillGapSelected((prev) => [...prev, skill]);
    setSkillGapInput("");
  }

  function removeSkillGapSkill(skill: string) {
    setSkillGapSelected((prev) => prev.filter((s) => s !== skill));
  }

  async function runSkillGap(event: React.FormEvent) {
    event.preventDefault();
    if (!skillGapSelected.length) return;
    setSkillGapLoading(true);
    setSkillGapError("");
    setSkillGapResult(null);
    try {
      const result = await getSkillGap(skillGapSelected, source);
      setSkillGapResult(result);
    } catch {
      setSkillGapError("Ошибка при анализе навыков.");
    } finally {
      setSkillGapLoading(false);
    }
  }

  async function askAI(event: React.FormEvent) {
    event.preventDefault();
    if (!question.trim()) return;

    setAnswer("");
    setChatChart(null);
    setChatLoading(true);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${clientBackendBase}/ai/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ question, source }),
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
          if (line.startsWith("chart: ")) {
            try {
              setChatChart(JSON.parse(line.slice(7)));
            } catch {
              // ignore invalid chart payload
            }
          } else if (line.startsWith("data: ")) {
            const rawChunk = line.slice(6);
            let chunk = rawChunk;
            try {
              chunk = JSON.parse(rawChunk) as string;
            } catch {
              chunk = rawChunk;
            }
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

  function logout() {
    localStorage.removeItem("token");
    router.replace("/login");
  }

  async function downloadCsv() {
    setCsvLoading(true);
    try {
      const blob = await exportAnalyticsCsv({
        source,
        category: salaryCategory === "all" ? undefined : salaryCategory,
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `it-market-${source}.csv`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } finally {
      setCsvLoading(false);
    }
  }

  function submitVacancySearch(event: React.FormEvent) {
    event.preventDefault();
    setVacanciesPageNumber(1);
    setVacancySearch(vacancyQuery.trim());
  }

  const coverage = summary?.total_vacancies
    ? Math.round((summary.with_salary / summary.total_vacancies) * 100)
    : 0;

  const sourceMix = summary
    ? [
        { name: "HH", value: summary.hh_vacancies, fill: "#0f766e" },
        { name: "Telegram", value: summary.telegram_vacancies, fill: "#f59e0b" },
      ].filter((item) => item.value > 0)
    : [];

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(15,118,110,0.18),_transparent_28%),radial-gradient(circle_at_top_right,_rgba(245,158,11,0.16),_transparent_24%),linear-gradient(180deg,_#f4efe3_0%,_#f8f7f2_42%,_#eef5f2_100%)] text-stone-950">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 pb-10 pt-6 sm:px-6 lg:px-8">
        <header className="rounded-[28px] border border-white/60 bg-white/75 p-5 shadow-[0_20px_80px_rgba(28,25,23,0.08)] backdrop-blur md:p-7">
          <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
            <div className="max-w-3xl">
              <div className="mb-4 inline-flex items-center rounded-full border border-stone-200 bg-stone-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-stone-500">
                Tech Job Market Intelligence
              </div>
              <h1 className="font-serif text-3xl leading-tight text-stone-950 md:text-5xl">
                Одна платформа для аналитики HH, Telegram-сигналов и AI-исследования рынка.
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-stone-600 md:text-base">
                HH остаётся основным аналитическим ядром. Telegram добавляет живой слой вакансий и сигналов из каналов.
                Переключай источник и смотри, как меняется рынок.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:w-[26rem]">
              <ActionButton
                title="AI-режим"
                subtitle={`Сейчас анализирует: ${sourceTitles[source]}`}
                onClick={() => setActiveTab("ai")}
                tone="navy"
              />
              {currentUser?.is_admin ? (
                <ActionButton
                  title={showAdminPanel ? "Скрыть панель" : "Панель админа"}
                  subtitle={activeParseRunId ? parseStreamStatus : "Управление парсингом"}
                  onClick={() => {
                    setShowAdminPanel((v) => !v);
                    if (!showAdminPanel) void loadParseRuns();
                  }}
                  tone="amber"
                />
              ) : (
                <ActionButton
                  title="Выйти"
                  subtitle="Завершить текущую сессию"
                  onClick={logout}
                  tone="stone"
                />
              )}
              {currentUser?.is_admin && (
                <ActionButton
                  title="Выйти"
                  subtitle="Завершить текущую сессию"
                  onClick={logout}
                  tone="stone"
                />
              )}
            </div>
          </div>

          <div className="mt-7 grid gap-4 lg:grid-cols-[1.45fr_0.85fr]">
            <div className="rounded-[26px] bg-stone-950 px-5 py-5 text-stone-50 shadow-[0_18px_50px_rgba(28,25,23,0.18)] md:px-6">
              <div className="flex flex-wrap items-center gap-2">
                {sourceOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => setSource(option.id)}
                    className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                      source === option.id
                        ? "bg-white text-stone-950"
                        : "bg-white/8 text-stone-300 hover:bg-white/14 hover:text-white"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
              <div className="mt-5">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-stone-400">Активный режим</p>
                <h2 className="mt-2 text-2xl font-semibold">{sourceTitles[source]}</h2>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-stone-300">{sourceDescriptions[source]}</p>
              </div>
            </div>

            <div className="rounded-[26px] border border-stone-200/80 bg-stone-50/85 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-stone-500">Продуктовая логика</p>
              <ul className="mt-4 space-y-3 text-sm leading-6 text-stone-700">
                <li>HH даёт устойчивую структуру для зарплат, компаний, трендов и AI-ответов.</li>
                <li>Telegram расширяет картину рынка и ловит живые сигналы из каналов.</li>
                <li>Фильтр источника не смешивает смыслы: ты сам управляешь контекстом анализа.</li>
              </ul>
            </div>
          </div>
          {currentUser?.is_admin && showAdminPanel && (
            <div className="mt-6 rounded-[26px] border border-amber-200/80 bg-amber-50/85 p-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-700">Панель администратора</p>
                  <h3 className="mt-1 text-lg font-semibold text-stone-950">Управление парсингом</h3>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => void handleTriggerParse("hh")}
                    disabled={!!parseTriggerLoading || !!activeParseRunId}
                    className="rounded-full bg-stone-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {parseTriggerLoading === "hh" ? "Запускаю HH..." : "Запустить HH"}
                  </button>
                  <button
                    onClick={() => void handleTriggerParse("telegram")}
                    disabled={!!parseTriggerLoading || !!activeParseRunId}
                    className="rounded-full bg-amber-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-amber-500 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {parseTriggerLoading === "telegram" ? "Запускаю TG..." : "Запустить Telegram"}
                  </button>
                  <button
                    onClick={() => void loadParseRuns()}
                    disabled={parseRunsLoading}
                    className="rounded-full border border-stone-300 bg-white px-4 py-2.5 text-sm font-semibold text-stone-700 transition hover:border-stone-400 disabled:opacity-50"
                  >
                    Обновить
                  </button>
                </div>
              </div>

              {parseTriggerError && (
                <div className="mt-3 rounded-[22px] bg-rose-50 px-4 py-3 text-sm text-rose-700">{parseTriggerError}</div>
              )}

              {activeParseRunId && (
                <div className="mt-3 flex items-center gap-3 rounded-[22px] bg-teal-50 px-4 py-3 text-sm text-teal-800">
                  <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-teal-500" />
                  {parseStreamStatus}
                </div>
              )}

              <div className="mt-5">
                {parseRunsLoading && <div className="text-sm text-stone-500">Загружаю историю запусков...</div>}
                {!parseRunsLoading && parseRuns.length === 0 && (
                  <div className="text-sm text-stone-500">История запусков пуста.</div>
                )}
                {!parseRunsLoading && parseRuns.length > 0 && (
                  <div className="space-y-2">
                    {parseRuns.slice(0, 8).map((run) => (
                      <div
                        key={run.id}
                        className={`flex flex-wrap items-center justify-between gap-3 rounded-[22px] px-4 py-3 text-sm ${
                          run.status === "done"
                            ? "bg-teal-50 text-teal-900"
                            : run.status === "failed"
                              ? "bg-rose-50 text-rose-900"
                              : "bg-amber-50 text-amber-900"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className={`rounded-full px-2 py-0.5 text-xs font-semibold uppercase ${
                            run.status === "done" ? "bg-teal-200" : run.status === "failed" ? "bg-rose-200" : "bg-amber-200"
                          }`}>
                            {run.status}
                          </span>
                          <span className="font-medium">{run.parse_type.toUpperCase()}</span>
                          {run.vacancies_fetched != null && <span>· {fmtInt(run.vacancies_fetched)} вакансий</span>}
                          {run.error && <span className="text-xs opacity-75">· {run.error}</span>}
                        </div>
                        <span className="text-xs opacity-60">
                          {run.started_at ? new Date(run.started_at).toLocaleString("ru-RU") : "—"}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </header>

        <div className="mt-6 flex flex-wrap gap-2 rounded-[24px] border border-white/70 bg-white/70 p-2 shadow-[0_12px_40px_rgba(15,23,42,0.05)] backdrop-blur">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`rounded-2xl px-4 py-2.5 text-sm font-medium transition ${
                activeTab === tab.id
                  ? "bg-stone-950 text-white shadow-[0_10px_30px_rgba(28,25,23,0.18)]"
                  : "text-stone-600 hover:bg-stone-100 hover:text-stone-950"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {dashboardLoading ? (
          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="h-36 animate-pulse rounded-[24px] bg-white/70" />
            ))}
          </div>
        ) : (
          <main className="mt-8 flex-1">
            {activeTab === "overview" && summary && (
              <div className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                  <MetricCard
                    label="Всего вакансий"
                    value={fmtInt(summary.total_vacancies)}
                    accent="teal"
                    detail={source === "all" ? "По двум источникам" : sourceTitles[source]}
                  />
                  <MetricCard
                    label="С указанной зарплатой"
                    value={fmtInt(summary.with_salary)}
                    accent="amber"
                    detail={`Покрытие: ${coverage}%`}
                  />
                  <MetricCard
                    label="HH в базе"
                    value={fmtInt(summary.hh_vacancies)}
                    accent="navy"
                    detail="Структурированная база рынка"
                  />
                  <MetricCard
                    label="Telegram в базе"
                    value={fmtInt(summary.telegram_vacancies)}
                    accent="rose"
                    detail="Живые сигналы из каналов"
                  />
                </div>

                <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
                  <Panel
                    eyebrow="Рынок по времени"
                    title={`Динамика вакансий: ${sourceTitles[source]}`}
                    description="Смотри тренд отдельно по активному источнику, чтобы не путать структурированный HH и более шумный Telegram."
                  >
                    <TrendsChart data={trends} />
                  </Panel>

                  <Panel
                    eyebrow="Source mix"
                    title="Как распределены источники"
                    description="Эта карточка всегда показывает общий баланс данных в базе, даже если ты анализируешь конкретный источник."
                  >
                    <SourceMixCard
                      data={sourceMix}
                      hh={summary.hh_vacancies}
                      telegram={summary.telegram_vacancies}
                    />
                  </Panel>
                </div>

                <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
                  <Panel
                    eyebrow="Лидирующие навыки"
                    title={`Что тянет рынок в режиме ${source.toUpperCase()}`}
                    description="Здесь ты видишь наиболее частые технологические сигналы по выбранному источнику."
                  >
                    <SkillsChart data={skills} />
                  </Panel>

                  <Panel
                    eyebrow="Сегменты"
                    title="Как распределяются опыт и занятость"
                    description="Эти два графика помогают быстро понять, что требует рынок: младших, middle/senior или конкретный формат работы."
                  >
                    <div className="space-y-6">
                      <MiniDistributionChart data={experience} tone="#0f766e" />
                      <MiniDistributionChart data={employment} tone="#b45309" />
                    </div>
                  </Panel>
                </div>
              </div>
            )}

            {activeTab === "skills" && (
              <div className="space-y-6">
                <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
                  <Panel
                    eyebrow="Навыки"
                    title={`Топ навыков в режиме ${source.toUpperCase()}`}
                    description="HH даёт более чистую структуру, Telegram показывает живой спрос и новые сигналы из каналов."
                  >
                    <SkillsChart data={skills} />
                  </Panel>

                  <Panel
                    eyebrow="Новые backend-фичи"
                    title="Трендовые навыки и быстрый compare"
                    description="Этот блок уже использует новые endpoints `skills/trending` и `skills/compare`."
                  >
                    <div className="space-y-6">
                      <TrendingSkillsList
                        data={trendingSkills}
                        selectedSkill={selectedSkill}
                        onSelect={(skill) => setSelectedSkill(skill)}
                      />
                      <SkillCompareGrid data={compareRows} />
                    </div>
                  </Panel>
                </div>

                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {skillGroups.map((group) => (
                    <div key={group.category} className="rounded-[24px] border border-white/80 bg-white/75 p-5 shadow-[0_12px_35px_rgba(15,23,42,0.06)] backdrop-blur">
                      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-stone-400">{group.category}</p>
                      <h3 className="mt-2 text-lg font-semibold text-stone-950">{group.label}</h3>
                      <div className="mt-4 space-y-3">
                        {group.items.map((item) => (
                          <div key={`${group.category}-${item.skill}`} className="flex items-center justify-between gap-4 rounded-2xl bg-stone-50 px-3 py-2">
                            <span className="text-sm text-stone-700">{item.skill}</span>
                            <span className="text-sm font-semibold text-stone-950">{item.count}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <Panel
                  eyebrow="Skill card"
                  title={selectedSkill ? `Карточка навыка: ${selectedSkill}` : "Карточка навыка"}
                  description="Карточка собирается новым backend-эндпоинтом и даёт быстрый срез по зарплатам, регионам, компаниям и связанным технологиям."
                >
                  <div className="mb-5 flex flex-wrap gap-2">
                    {[...skills.slice(0, 6), ...trendingSkills.slice(0, 6).map((item) => ({ skill: item.skill, count: item.current_count }))].map((item) => (
                      <button
                        key={`skill-chip-${item.skill}`}
                        onClick={() => setSelectedSkill(item.skill)}
                        className={`rounded-full px-4 py-2 text-sm transition ${
                          selectedSkill === item.skill
                            ? "bg-stone-950 text-white"
                            : "border border-stone-300 bg-white text-stone-700 hover:border-stone-400"
                        }`}
                      >
                        {item.skill}
                      </button>
                    ))}
                  </div>

                  {skillCardLoading && <div className="rounded-[24px] bg-stone-100 p-6 text-sm text-stone-500">Загружаю карточку навыка...</div>}
                  {!skillCardLoading && skillCardError && <div className="rounded-[24px] bg-rose-50 p-6 text-sm text-rose-700">{skillCardError}</div>}
                  {!skillCardLoading && !skillCardError && skillCard && <SkillCardPanel card={skillCard} />}
                </Panel>
              </div>
            )}

            {activeTab === "salaries" && (
              <div className="space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap gap-2">
                    {[
                      { id: "all", label: "Все" },
                      ...skillGroups.map((group) => ({ id: group.category, label: group.label })),
                    ].map((option) => (
                      <button
                        key={option.id}
                        onClick={() => setSalaryCategory(option.id)}
                        className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                          salaryCategory === option.id
                            ? "bg-stone-950 text-white"
                            : "border border-stone-300 bg-white/75 text-stone-700 hover:border-stone-400"
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={downloadCsv}
                    disabled={csvLoading}
                    className="rounded-full bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {csvLoading ? "Готовлю CSV..." : "Экспорт CSV"}
                  </button>
                </div>

                <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
                  <Panel
                    eyebrow="Компенсация"
                    title={`Средние зарплаты по навыкам: ${sourceTitles[source]}`}
                    description="Зарплатные графики наиболее полезны в HH-режиме, но Telegram тоже может дать сигналы там, где в постах указывают вилки."
                  >
                    <SalariesChart data={salaries} />
                  </Panel>

                  <Panel
                    eyebrow="Распределение"
                    title="Гистограмма зарплат"
                    description="Новый backend endpoint показывает, в каких зарплатных диапазонах сейчас сосредоточен рынок."
                  >
                    <SalaryHistogramChart data={salaryHistogram} />
                  </Panel>
                </div>
              </div>
            )}

            {activeTab === "trends" && (
              <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
                <Panel
                  eyebrow="Тренды"
                  title={`Динамика вакансий в режиме ${source.toUpperCase()}`}
                  description="Проверяй рост или спад без смешивания разных типов данных."
                >
                  <TrendsChart data={trends} />
                </Panel>

                <Panel
                  eyebrow="География"
                  title="Куда смещается активность"
                  description="Если в Telegram много записей без региона, это сразу будет заметно по доле 'Не указано'."
                >
                  <RegionsChart data={regions} />
                </Panel>
              </div>
            )}

            {activeTab === "market" && summary && (
              <div className="space-y-6">
                <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
                  <Panel
                    eyebrow="Работодатели"
                    title={`Кто активнее нанимает в режиме ${source.toUpperCase()}`}
                    description="В HH здесь будет реальная структура работодателей. В Telegram это чаще агрегаторы, каналы и агентства."
                  >
                    <CompaniesChart data={companies} />
                  </Panel>

                  <Panel
                    eyebrow="Срез рынка"
                    title="Опыт и занятость"
                    description="Этот блок помогает быстро почувствовать форму рынка: вакансии для middle/senior, full-time или более гибкие форматы."
                  >
                    <div className="grid gap-6 lg:grid-cols-2">
                      <DistributionChart title="По опыту" data={experience} tone="#1d4ed8" />
                      <DistributionChart title="По занятости" data={employment} tone="#dc2626" />
                    </div>
                  </Panel>
                </div>

                <Panel
                  eyebrow="Каталог вакансий"
                  title="Новые backend-фильтры и пагинация"
                  description="Этот блок уже использует новый `/vacancies` endpoint: поиск, фильтр по навыку, фильтр по наличию зарплаты и постраничную навигацию."
                >
                  <form onSubmit={submitVacancySearch} className="mb-5 flex flex-col gap-3 lg:flex-row">
                    <input
                      value={vacancyQuery}
                      onChange={(event) => setVacancyQuery(event.target.value)}
                      placeholder="Поиск по названию или компании"
                      className="min-w-0 flex-1 rounded-2xl border border-stone-300 bg-stone-50 px-4 py-3 text-sm text-stone-900 outline-none transition focus:border-stone-950"
                    />
                    <select
                      value={vacancySource}
                      onChange={(event) => {
                        setVacancySource(event.target.value as "all" | "hh" | "telegram");
                        setVacanciesPageNumber(1);
                      }}
                      className="rounded-2xl border border-stone-300 bg-white px-4 py-3 text-sm text-stone-900 outline-none"
                    >
                      <option value="all">Все источники</option>
                      <option value="hh">hh.kz</option>
                      <option value="telegram">Telegram</option>
                    </select>
                    <select
                      value={vacancySkill}
                      onChange={(event) => {
                        setVacancySkill(event.target.value);
                        setVacanciesPageNumber(1);
                      }}
                      className="rounded-2xl border border-stone-300 bg-white px-4 py-3 text-sm text-stone-900 outline-none"
                    >
                      <option value="">Все навыки</option>
                      {skills.slice(0, 10).map((item) => (
                        <option key={item.skill} value={item.skill}>
                          {item.skill}
                        </option>
                      ))}
                    </select>
                    <label className="flex items-center gap-2 rounded-2xl border border-stone-300 bg-white px-4 py-3 text-sm text-stone-700">
                      <input
                        type="checkbox"
                        checked={vacancyWithSalary}
                        onChange={(event) => {
                          setVacancyWithSalary(event.target.checked);
                          setVacanciesPageNumber(1);
                        }}
                        className="h-4 w-4 rounded border-stone-300"
                      />
                      Только с зарплатой
                    </label>
                    <button
                      type="submit"
                      className="rounded-2xl bg-stone-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-stone-800"
                    >
                      Найти
                    </button>
                  </form>

                  <div className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
                    <div className="space-y-3">
                      {vacanciesLoading && (
                        <div className="rounded-[24px] bg-stone-100 p-6 text-sm text-stone-500">Загружаю вакансии...</div>
                      )}
                      {!vacanciesLoading &&
                        vacancies?.items.map((vacancy) => (
                          <button
                            key={vacancy.id}
                            onClick={() => setSelectedVacancy(vacancy)}
                            className={`w-full rounded-[24px] border p-4 text-left transition ${
                              selectedVacancy?.id === vacancy.id
                                ? "border-stone-950 bg-stone-950 text-white"
                                : "border-stone-200 bg-stone-50 hover:border-stone-400"
                            }`}
                          >
                            <div className="flex items-start justify-between gap-4">
                              <div>
                                <div className="text-lg font-semibold">{vacancy.title}</div>
                                <div className={`mt-1 text-sm ${selectedVacancy?.id === vacancy.id ? "text-stone-300" : "text-stone-500"}`}>
                                  {vacancy.company ?? "Компания не указана"} · {vacancy.area_name ?? "Регион не указан"}
                                </div>
                              </div>
                              <span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase ${selectedVacancy?.id === vacancy.id ? "bg-white/10 text-white" : "bg-stone-200 text-stone-700"}`}>
                                {vacancy.source}
                              </span>
                            </div>
                            <div className={`mt-3 text-sm ${selectedVacancy?.id === vacancy.id ? "text-stone-200" : "text-stone-600"}`}>
                              {formatVacancySalary(vacancy)}
                            </div>
                          </button>
                        ))}

                      {!vacanciesLoading && vacancies?.items.length === 0 && (
                        <div className="rounded-[24px] bg-stone-100 p-6 text-sm text-stone-500">По этим фильтрам вакансий не найдено.</div>
                      )}

                      {vacancies && vacancies.pages > 1 && (
                        <div className="flex items-center justify-between gap-3 rounded-[24px] bg-stone-100 px-4 py-3 text-sm text-stone-600">
                          <button
                            onClick={() => setVacanciesPageNumber((page) => Math.max(1, page - 1))}
                            disabled={vacancies.page === 1}
                            className="rounded-full border border-stone-300 px-3 py-1.5 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            Назад
                          </button>
                          <span>
                            Страница {vacancies.page} из {vacancies.pages} · {fmtInt(vacancies.total)} вакансий
                          </span>
                          <button
                            onClick={() => setVacanciesPageNumber((page) => Math.min(vacancies.pages, page + 1))}
                            disabled={vacancies.page === vacancies.pages}
                            className="rounded-full border border-stone-300 px-3 py-1.5 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            Дальше
                          </button>
                        </div>
                      )}
                    </div>

                    <VacancyDetailPanel vacancy={selectedVacancy} />
                  </div>
                </Panel>

                <Panel
                  eyebrow="Позиционирование источников"
                  title="Как читать этот продукт"
                  description="Не надо пытаться воспринимать HH и Telegram как одинаковые источники. Их сила в разных сценариях."
                >
                  <div className="grid gap-4 md:grid-cols-3">
                    <SourceNarrativeCard
                      title="HH"
                      accent="teal"
                      text="Основной аналитический слой: зарплаты, тренды, работодатели и более устойчивые ответы AI."
                    />
                    <SourceNarrativeCard
                      title="Telegram"
                      accent="amber"
                      text="Живой слой рынка: сигналы из каналов, быстрые публикации, вариативность ролей и менее формальные формулировки."
                    />
                    <SourceNarrativeCard
                      title="Все"
                      accent="navy"
                      text="Сводный режим для общей картины. Удобен для сравнения и high-level обзора, но не должен скрывать различие источников."
                    />
                  </div>
                </Panel>
              </div>
            )}

            {activeTab === "salary-calc" && (
              <div className="grid gap-6 xl:grid-cols-[1fr_1.4fr]">
                <Panel
                  eyebrow="Калькулятор зарплаты"
                  title="Сколько платят за навык?"
                  description="Выбери технологию, опыт и город — получишь реальный зарплатный срез по данным рынка."
                >
                  <form onSubmit={runSalaryCalc} className="space-y-4">
                    <div>
                      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">Навык *</label>
                      <input
                        value={salaryCalcSkill}
                        onChange={(e) => setSalaryCalcSkill(e.target.value)}
                        list="salary-calc-skills-list"
                        placeholder="Начни вводить: Python, Go, React..."
                        autoComplete="off"
                        className="w-full rounded-[20px] border border-stone-300 bg-stone-50 px-4 py-3 text-sm outline-none transition focus:border-stone-950"
                      />
                      <datalist id="salary-calc-skills-list">
                        {skillGroups.flatMap((g) => g.items).map((s) => (
                          <option key={s.skill} value={s.skill} />
                        ))}
                      </datalist>
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">Опыт</label>
                      <select
                        value={salaryCalcExp}
                        onChange={(e) => setSalaryCalcExp(e.target.value)}
                        className="w-full rounded-[20px] border border-stone-300 bg-stone-50 px-4 py-3 text-sm outline-none transition focus:border-stone-950"
                      >
                        <option value="">Любой</option>
                        <option value="noExperience">Без опыта</option>
                        <option value="between1And3">1–3 года</option>
                        <option value="between3And6">3–6 лет</option>
                        <option value="moreThan6">6+ лет</option>
                      </select>
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">Город</label>
                      <select
                        value={salaryCalcRegion}
                        onChange={(e) => setSalaryCalcRegion(e.target.value)}
                        className="w-full rounded-[20px] border border-stone-300 bg-stone-50 px-4 py-3 text-sm outline-none transition focus:border-stone-950"
                      >
                        <option value="">Любой город</option>
                        {regions.map((r) => (
                          <option key={r.region} value={r.region}>{r.region}</option>
                        ))}
                      </select>
                    </div>
                    <button
                      type="submit"
                      disabled={salaryCalcLoading || !salaryCalcSkill.trim()}
                      className="rounded-full bg-stone-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {salaryCalcLoading ? "Считаю..." : "Рассчитать"}
                    </button>
                  </form>
                  {salaryCalcError && (
                    <div className="mt-4 rounded-[20px] bg-rose-50 px-4 py-3 text-sm text-rose-700">{salaryCalcError}</div>
                  )}
                </Panel>

                <div className="space-y-6">
                  {salaryCalcResult && (
                    <>
                      <Panel
                        eyebrow={salaryCalcResult.skill}
                        title="Зарплатный срез"
                        description={`По ${fmtInt(salaryCalcResult.sample_count)} вакансиям с указанной зарплатой`}
                      >
                        {salaryCalcTrend && (
                          <div className={`mb-4 flex items-center gap-2 rounded-[16px] px-4 py-3 text-sm font-medium ${
                            salaryCalcTrend.delta > 0
                              ? "bg-teal-50 text-teal-800"
                              : salaryCalcTrend.delta < 0
                                ? "bg-rose-50 text-rose-800"
                                : "bg-stone-100 text-stone-600"
                          }`}>
                            <span className="text-base">
                              {salaryCalcTrend.delta > 0 ? "↑" : salaryCalcTrend.delta < 0 ? "↓" : "→"}
                            </span>
                            <span>
                              Спрос за последний месяц:{" "}
                              <strong>{salaryCalcTrend.delta > 0 ? "+" : ""}{salaryCalcTrend.pct}%</strong>
                              {" "}({salaryCalcTrend.delta > 0 ? "+" : ""}{salaryCalcTrend.delta} вакансий)
                            </span>
                          </div>
                        )}
                        <div className="space-y-3">
                          <div className="grid grid-cols-2 gap-3">
                            <div className="rounded-[20px] bg-stone-950 p-4 text-stone-50">
                              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-400">Медиана</p>
                              <p className="mt-1.5 text-lg font-bold">{fmtSalary(salaryCalcResult.median_salary_kzt)}</p>
                            </div>
                            <div className="rounded-[20px] bg-stone-100 p-4 text-stone-900">
                              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">Средняя</p>
                              <p className="mt-1.5 text-lg font-bold">{fmtSalary(salaryCalcResult.avg_salary_kzt)}</p>
                            </div>
                          </div>

                          <div className="rounded-[20px] bg-teal-50 p-4">
                            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-600">Типичный диапазон</p>
                            <p className="mt-1 text-sm text-teal-800">
                              {fmtSalary(salaryCalcResult.p25_salary_kzt)}
                              <span className="mx-2 text-teal-400">—</span>
                              {fmtSalary(salaryCalcResult.p75_salary_kzt)}
                            </p>
                            <p className="mt-1 text-xs text-teal-600">половина вакансий платит в этом диапазоне</p>
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div className="rounded-[20px] bg-stone-100 p-4 text-stone-900">
                              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">Минимум</p>
                              <p className="mt-1.5 text-base font-bold">{fmtSalary(salaryCalcResult.min_salary_kzt)}</p>
                            </div>
                            <div className="rounded-[20px] bg-stone-100 p-4 text-stone-900">
                              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">Максимум</p>
                              <p className="mt-1.5 text-base font-bold">{fmtSalary(salaryCalcResult.max_salary_kzt)}</p>
                            </div>
                          </div>
                        </div>
                      </Panel>

                      {salaryCalcResult.top_companies.length > 0 && (
                        <Panel
                          eyebrow="Компании"
                          title="Кто платит выше медианы"
                          description="Компании с минимум 2 вакансиями и зарплатой ≥ медианы"
                        >
                          <div className="space-y-2">
                            {salaryCalcResult.top_companies.map((company) => (
                              <div key={company.company} className="flex items-center justify-between rounded-[16px] bg-stone-100 px-4 py-3">
                                <div>
                                  <p className="text-sm font-semibold text-stone-900">{company.company}</p>
                                  <p className="text-xs text-stone-500">{fmtInt(company.vacancy_count)} вакансий</p>
                                </div>
                                <p className="text-sm font-bold text-teal-700">{fmtSalary(company.avg_salary_kzt)}</p>
                              </div>
                            ))}
                          </div>
                        </Panel>
                      )}
                    </>
                  )}
                  {!salaryCalcResult && !salaryCalcLoading && !salaryCalcError && (
                    <div className="flex h-48 items-center justify-center rounded-[26px] border border-dashed border-stone-300 text-sm text-stone-400">
                      Введи навык и нажми «Рассчитать»
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === "skill-gap" && (
              <div className="grid gap-6 xl:grid-cols-[1fr_1.4fr]">
                <Panel
                  eyebrow="Анализ скилл-гэпа"
                  title="Сколько вакансий тебе доступно?"
                  description="Введи свои навыки — узнаешь, какой процент рынка ты покрываешь и что стоит изучить дальше."
                >
                  <form onSubmit={runSkillGap} className="space-y-4">
                    <div>
                      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">Добавить навык</label>
                      <div className="flex gap-2">
                        <input
                          value={skillGapInput}
                          onChange={(e) => setSkillGapInput(e.target.value)}
                          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addSkillGapSkill(); } }}
                          list="skill-gap-skills-list"
                          placeholder="Начни вводить: Python, Go..."
                          autoComplete="off"
                          className="min-w-0 flex-1 rounded-[20px] border border-stone-300 bg-stone-50 px-4 py-3 text-sm outline-none transition focus:border-stone-950"
                        />
                        <datalist id="skill-gap-skills-list">
                          {skillGroups.flatMap((g) => g.items)
                            .filter((s) => !skillGapSelected.includes(s.skill))
                            .map((s) => <option key={s.skill} value={s.skill} />)}
                        </datalist>
                        <button
                          type="button"
                          onClick={addSkillGapSkill}
                          disabled={!skillGapInput.trim()}
                          className="flex-shrink-0 rounded-full border border-stone-300 bg-white px-4 py-3 text-sm font-semibold text-stone-700 transition hover:border-stone-950 hover:text-stone-950 disabled:opacity-40"
                        >
                          + Добавить
                        </button>
                      </div>
                    </div>

                    {skillGapSelected.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {skillGapSelected.map((skill) => (
                          <span
                            key={skill}
                            className="inline-flex items-center gap-1.5 rounded-full bg-stone-950 px-3 py-1.5 text-sm font-medium text-white"
                          >
                            {skill}
                            <button
                              type="button"
                              onClick={() => removeSkillGapSkill(skill)}
                              className="text-stone-400 hover:text-white"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={skillGapLoading || skillGapSelected.length === 0}
                      className="rounded-full bg-stone-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {skillGapLoading ? "Анализирую..." : `Проанализировать${skillGapSelected.length > 0 ? ` (${skillGapSelected.length})` : ""}`}
                    </button>
                  </form>
                  {skillGapError && (
                    <div className="mt-4 rounded-[20px] bg-rose-50 px-4 py-3 text-sm text-rose-700">{skillGapError}</div>
                  )}
                </Panel>

                <div className="space-y-6">
                  {skillGapResult && (
                    <>
                      <Panel
                        eyebrow="Покрытие рынка"
                        title={`${skillGapResult.match_pct}% вакансий доступно`}
                        description={`${fmtInt(skillGapResult.matched_vacancies)} из ${fmtInt(skillGapResult.total_vacancies)} вакансий содержат хотя бы один твой навык`}
                      >
                        <div className="h-4 overflow-hidden rounded-full bg-stone-200">
                          <div
                            className="h-full rounded-full bg-teal-600 transition-all duration-700"
                            style={{ width: `${Math.min(skillGapResult.match_pct, 100)}%` }}
                          />
                        </div>
                        <p className="mt-2 text-right text-sm font-semibold text-teal-700">{skillGapResult.match_pct}%</p>
                      </Panel>

                      {skillGapResult.missing_skills.length > 0 && (
                        <Panel
                          eyebrow="Приоритет обучения"
                          title="Что изучить дальше"
                          description="Отсортировано по ROI: количество новых вакансий × средняя зарплата"
                        >
                          <div className="space-y-2">
                            {skillGapResult.missing_skills.map((item: MissingSkill, index: number) => (
                              <div key={item.skill} className="flex items-center gap-3 rounded-[16px] bg-stone-100 px-4 py-3">
                                <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-stone-300 text-xs font-bold text-stone-700">
                                  {index + 1}
                                </span>
                                <div className="min-w-0 flex-1">
                                  <p className="text-sm font-semibold text-stone-900">{item.skill}</p>
                                  <p className="text-xs text-stone-500">
                                    {item.avg_salary_kzt
                                      ? `ср. зарплата ${fmtSalary(item.avg_salary_kzt)}`
                                      : "зарплата не указана"}
                                  </p>
                                </div>
                                {item.extra_vacancies > 0 && (
                                  <span className="flex-shrink-0 rounded-full bg-teal-100 px-2.5 py-1 text-xs font-semibold text-teal-700">
                                    +{fmtInt(item.extra_vacancies)} вакансий
                                  </span>
                                )}
                              </div>
                            ))}
                          </div>
                        </Panel>
                      )}
                    </>
                  )}
                  {!skillGapResult && !skillGapLoading && !skillGapError && (
                    <div className="flex h-48 items-center justify-center rounded-[26px] border border-dashed border-stone-300 text-sm text-stone-400">
                      Добавь навыки и нажми «Проанализировать»
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === "ai" && (
              <div className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
                <Panel
                  eyebrow="AI чат"
                  title={`AI сейчас работает в режиме ${source.toUpperCase()}`}
                  description="Это важно: модель теперь отвечает в контексте выбранного источника, а не всегда как будто это только HH."
                >
                  <form onSubmit={askAI} className="space-y-4">
                    <textarea
                      value={question}
                      onChange={(event) => setQuestion(event.target.value)}
                      placeholder="Например: чем Telegram рынок отличается от HH по Python-вакансиям?"
                      className="min-h-36 w-full rounded-[24px] border border-stone-300 bg-stone-50 px-4 py-4 text-sm text-stone-900 outline-none transition focus:border-stone-950"
                    />
                    <button
                      type="submit"
                      disabled={chatLoading || !question.trim()}
                      className="rounded-full bg-stone-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {chatLoading ? "AI анализирует..." : "Спросить AI"}
                    </button>
                  </form>

                  <div className="mt-6">
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-stone-400">Подсказки для старта</p>
                    <div className="mt-3 space-y-2">
                      {chatExamples[source].map((example) => (
                        <button
                          key={example}
                          onClick={() => setQuestion(example)}
                          className="block w-full rounded-2xl bg-stone-100 px-4 py-3 text-left text-sm text-stone-700 transition hover:bg-stone-200"
                        >
                          {example}
                        </button>
                      ))}
                    </div>
                  </div>
                </Panel>

                <div className="space-y-6">
                  <Panel
                    eyebrow="Ответ"
                    title="Результат AI-анализа"
                    description="Ответ и график теперь синхронизированы с выбранным источником."
                  >
                    <div className="min-h-56 whitespace-pre-wrap rounded-[24px] bg-stone-950 px-5 py-5 text-sm leading-7 text-stone-100">
                      {answer || (!chatLoading && "Здесь появится ответ после запроса.")}
                      {chatLoading && !answer && (
                        <span className="inline-block h-4 w-2 animate-pulse rounded bg-amber-300 align-middle" />
                      )}
                      <div ref={answerRef} />
                    </div>
                  </Panel>

                  {chatChart && (
                    <Panel
                      eyebrow="Автографик"
                      title={chartTitle(chatChart.type)}
                      description="График строится на основе того же среза, что и ответ AI."
                    >
                      {chatChart.type === "skills" && <SkillsChart data={chatChart.data as Skill[]} />}
                      {chatChart.type === "salaries" && <SalariesChart data={chatChart.data as Salary[]} />}
                      {chatChart.type === "trends" && <TrendsChart data={chatChart.data as Trend[]} />}
                      {chatChart.type === "regions" && <RegionsChart data={chatChart.data as RegionStat[]} />}
                      {chatChart.type === "experience" && <MiniDistributionChart data={chatChart.data as LabeledCount[]} tone="#1d4ed8" />}
                      {chatChart.type === "employment" && <MiniDistributionChart data={chatChart.data as LabeledCount[]} tone="#dc2626" />}
                      {chatChart.type === "companies" && <CompaniesChart data={chatChart.data as CompanyStat[]} />}
                      {chatChart.type === "salary_histogram" && <SalaryHistogramChart data={chatChart.data as SalaryBucket[]} />}
                      {chatChart.type === "skill_compare" && <SkillCompareChart data={chatChart.data as SkillCompareItem[]} />}
                      {chatChart.type === "generic_bar" && <GenericBarChart data={chatChart.data as { label: string; value: number }[]} />}
                    </Panel>
                  )}
                </div>
              </div>
            )}
          </main>
        )}
      </div>
    </div>
  );
}

function chartTitle(type: ChartPayload["type"]) {
  if (type === "salaries") return "Зарплатный график";
  if (type === "salary_histogram") return "Распределение зарплат";
  if (type === "skill_compare") return "Сравнение навыков";
  if (type === "generic_bar") return "Сравнительный график";
  if (type === "trends") return "Динамика по времени";
  if (type === "regions") return "Региональный срез";
  if (type === "experience") return "Распределение по опыту";
  if (type === "employment") return "Распределение по занятости";
  if (type === "companies") return "Срез по компаниям";
  return "Навыки";
}

function ActionButton({
  title,
  subtitle,
  onClick,
  disabled = false,
  loading = false,
  tone,
}: {
  title: string;
  subtitle: string;
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
  tone: "teal" | "amber" | "navy" | "stone";
}) {
  const toneClass = {
    teal: "bg-teal-900 text-teal-50 hover:bg-teal-800",
    amber: "bg-amber-600 text-amber-50 hover:bg-amber-500",
    navy: "bg-blue-900 text-blue-50 hover:bg-blue-800",
    stone: "bg-stone-200 text-stone-900 hover:bg-stone-300",
  }[tone];

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`rounded-[22px] px-4 py-4 text-left transition ${toneClass} disabled:cursor-not-allowed disabled:opacity-60`}
    >
      <div className="text-sm font-semibold">{loading ? "Запуск..." : title}</div>
      <div className="mt-1 text-xs opacity-85">{subtitle}</div>
    </button>
  );
}

function MetricCard({
  label,
  value,
  detail,
  accent,
}: {
  label: string;
  value: string;
  detail: string;
  accent: "teal" | "amber" | "navy" | "rose";
}) {
  const accentClass = {
    teal: "from-teal-700/90 to-teal-500/85 text-white",
    amber: "from-amber-500/95 to-orange-500/85 text-stone-950",
    navy: "from-blue-900/95 to-blue-700/85 text-white",
    rose: "from-rose-700/90 to-orange-600/85 text-white",
  }[accent];

  return (
    <div className={`rounded-[24px] bg-gradient-to-br ${accentClass} p-5 shadow-[0_18px_45px_rgba(15,23,42,0.12)]`}>
      <p className="text-xs font-semibold uppercase tracking-[0.22em] opacity-80">{label}</p>
      <p className="mt-4 text-3xl font-semibold">{value}</p>
      <p className="mt-2 text-sm opacity-85">{detail}</p>
    </div>
  );
}

function Panel({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-[30px] border border-white/75 bg-white/78 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.07)] backdrop-blur">
      <p className="text-xs font-semibold uppercase tracking-[0.26em] text-stone-400">{eyebrow}</p>
      <h2 className="mt-3 text-2xl font-semibold text-stone-950">{title}</h2>
      <p className="mt-2 max-w-3xl text-sm leading-6 text-stone-600">{description}</p>
      <div className="mt-6">{children}</div>
    </section>
  );
}

function SourceMixCard({
  data,
  hh,
  telegram,
}: {
  data: { name: string; value: number; fill: string }[];
  hh: number;
  telegram: number;
}) {
  return (
    <div className="grid gap-5 md:grid-cols-[0.95fr_1.05fr]">
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" innerRadius={62} outerRadius={92} paddingAngle={3}>
              {data.map((entry) => (
                <Cell key={entry.name} fill={entry.fill} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => fmtInt(Number(value ?? 0))} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="space-y-3">
        <SourceSplitRow label="HH" value={hh} tone="teal" />
        <SourceSplitRow label="Telegram" value={telegram} tone="amber" />
        <div className="rounded-[22px] bg-stone-100 p-4 text-sm leading-6 text-stone-600">
          Общий split помогает быстро понять, насколько продукт всё ещё HH-centric и какой вес уже набрал Telegram-слой.
        </div>
      </div>
    </div>
  );
}

function SourceSplitRow({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: "teal" | "amber";
}) {
  const classes = tone === "teal" ? "bg-teal-50 text-teal-900" : "bg-amber-50 text-amber-900";
  return (
    <div className={`rounded-[22px] ${classes} px-4 py-4`}>
      <div className="text-xs font-semibold uppercase tracking-[0.22em]">{label}</div>
      <div className="mt-2 text-2xl font-semibold">{fmtInt(value)}</div>
    </div>
  );
}

function SourceNarrativeCard({
  title,
  text,
  accent,
}: {
  title: string;
  text: string;
  accent: "teal" | "amber" | "navy";
}) {
  const borderClass = {
    teal: "border-teal-200 bg-teal-50/70",
    amber: "border-amber-200 bg-amber-50/70",
    navy: "border-blue-200 bg-blue-50/70",
  }[accent];

  return (
    <div className={`rounded-[24px] border ${borderClass} p-5`}>
      <h3 className="text-lg font-semibold text-stone-950">{title}</h3>
      <p className="mt-3 text-sm leading-6 text-stone-700">{text}</p>
    </div>
  );
}

function SkillsChart({ data }: { data: Skill[] }) {
  return (
    <ResponsiveContainer width="100%" height={420}>
      <BarChart data={data} layout="vertical" margin={{ left: 60, right: 10 }}>
        <CartesianGrid stroke="#e7e5e4" horizontal={false} />
        <XAxis type="number" tick={tickStyle} axisLine={false} tickLine={false} />
        <YAxis dataKey="skill" type="category" width={100} tick={tickStyle} axisLine={false} tickLine={false} interval={0} />
        <Tooltip formatter={(value) => [fmtInt(Number(value ?? 0)), "Вакансий"]} />
        <Bar dataKey="count" radius={[0, 10, 10, 0]} fill="#0f766e" />
      </BarChart>
    </ResponsiveContainer>
  );
}

function SalariesChart({ data }: { data: Salary[] }) {
  return (
    <ResponsiveContainer width="100%" height={Math.max(360, data.length * 52)}>
      <BarChart data={data} layout="vertical" margin={{ left: 80, right: 16 }}>
        <CartesianGrid stroke="#e7e5e4" horizontal={false} />
        <XAxis
          type="number"
          tick={tickStyle}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => `${Math.round(v / 1000)}k`}
        />
        <YAxis
          dataKey="skill"
          type="category"
          width={110}
          tick={tickStyle}
          axisLine={false}
          tickLine={false}
          interval={0}
        />
        <Tooltip
          formatter={(value, name) => [
            fmtSalary(Number(value ?? 0)),
            name === "avg_salary_kzt" ? "Средняя" : "Медиана",
          ]}
          content={({ active, payload }) => {
            if (!active || !payload?.length) return null;
            const d = payload[0]?.payload as Salary;
            return (
              <div className="rounded-2xl border border-stone-200 bg-white px-4 py-3 text-xs shadow-lg">
                <p className="mb-2 font-semibold text-stone-900">{d.skill}</p>
                <p className="text-amber-700">Средняя: {fmtSalary(d.avg_salary_kzt)}</p>
                <p className="text-teal-700">Медиана: {fmtSalary(d.median_salary_kzt)}</p>
                <p className="mt-1 text-stone-400">Мин: {fmtSalary(d.min_salary_kzt)} · Макс: {fmtSalary(d.max_salary_kzt)}</p>
                <p className="text-stone-400">Вакансий с зарплатой: {d.vacancy_count}</p>
              </div>
            );
          }}
        />
        <Legend
          formatter={(value) => (value === "avg_salary_kzt" ? "Средняя" : "Медиана")}
          wrapperStyle={{ fontSize: 12, color: "#78716c" }}
        />
        <Bar dataKey="avg_salary_kzt" name="avg_salary_kzt" radius={[0, 6, 6, 0]} fill="#b45309" barSize={10} />
        <Bar dataKey="median_salary_kzt" name="median_salary_kzt" radius={[0, 6, 6, 0]} fill="#0f766e" barSize={10} />
      </BarChart>
    </ResponsiveContainer>
  );
}

function SalaryHistogramChart({ data }: { data: SalaryBucket[] }) {
  return (
    <ResponsiveContainer width="100%" height={360}>
      <BarChart data={data}>
        <CartesianGrid stroke="#e7e5e4" strokeDasharray="3 3" />
        <XAxis dataKey="bucket" tick={tickStyle} axisLine={false} tickLine={false} interval={0} angle={-12} textAnchor="end" height={64} />
        <YAxis tick={tickStyle} axisLine={false} tickLine={false} />
        <Tooltip formatter={(value) => [fmtInt(Number(value ?? 0)), "Вакансий"]} />
        <Bar dataKey="count" fill="#0f766e" radius={[8, 8, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

function SkillCompareChart({ data }: { data: SkillCompareItem[] }) {
  const trendRows = buildSkillCompareTrendRows(data);

  return (
    <div className="space-y-6">
      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={data}>
          <CartesianGrid stroke="#e7e5e4" strokeDasharray="3 3" />
          <XAxis dataKey="skill" tick={tickStyle} axisLine={false} tickLine={false} />
          <YAxis tick={tickStyle} axisLine={false} tickLine={false} />
          <Tooltip formatter={(value) => [fmtInt(Number(value ?? 0)), "Вакансий"]} />
          <Bar dataKey="vacancy_count" fill="#0f766e" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>

      <div className="grid gap-3 md:grid-cols-3">
        {data.map((item) => (
          <div key={item.skill} className="rounded-[22px] bg-stone-50 p-4">
            <div className="text-sm font-semibold text-stone-950">{item.skill}</div>
            <div className="mt-2 space-y-1 text-xs text-stone-600">
              <div>Спрос: {fmtInt(item.vacancy_count)}</div>
              <div>Средняя: {item.avg_salary_kzt ? fmtSalary(item.avg_salary_kzt) : "нет данных"}</div>
              <div>Медиана: {item.median_salary_kzt ? fmtSalary(item.median_salary_kzt) : "нет данных"}</div>
            </div>
          </div>
        ))}
      </div>

      {trendRows.length > 0 && (
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={trendRows}>
            <CartesianGrid stroke="#e7e5e4" strokeDasharray="3 3" />
            <XAxis dataKey="month" tick={tickStyle} axisLine={false} tickLine={false} />
            <YAxis tick={tickStyle} axisLine={false} tickLine={false} />
            <Tooltip formatter={(value) => [fmtInt(Number(value ?? 0)), "Вакансий"]} />
            <Legend />
            {data.map((item, index) => (
              <Line
                key={item.skill}
                type="monotone"
                dataKey={item.skill}
                stroke={chartColors[index % chartColors.length] ?? "#0f766e"}
                strokeWidth={3}
                dot={{ r: 3 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

function GenericBarChart({ data }: { data: { label: string; value: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={Math.max(280, data.length * 44)}>
      <BarChart data={data} layout="vertical" margin={{ left: 80, right: 16 }}>
        <CartesianGrid stroke="#e7e5e4" horizontal={false} />
        <XAxis type="number" tick={tickStyle} axisLine={false} tickLine={false} />
        <YAxis dataKey="label" type="category" width={120} tick={tickStyle} axisLine={false} tickLine={false} interval={0} />
        <Tooltip formatter={(value) => [fmtInt(Number(value ?? 0)), "Значение"]} />
        <Bar dataKey="value" fill="#0f766e" radius={[0, 8, 8, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

function buildSkillCompareTrendRows(data: SkillCompareItem[]) {
  const byMonth = new Map<string, Record<string, string | number>>();

  for (const item of data) {
    for (const point of item.monthly_trend) {
      const row = byMonth.get(point.month) ?? { month: point.month };
      row[item.skill] = point.count;
      byMonth.set(point.month, row);
    }
  }

  return [...byMonth.values()].sort((a, b) => String(a.month).localeCompare(String(b.month)));
}

function TrendsChart({ data }: { data: Trend[] }) {
  return (
    <ResponsiveContainer width="100%" height={360}>
      <LineChart data={data} margin={{ left: 8, right: 16 }}>
        <CartesianGrid stroke="#e7e5e4" strokeDasharray="3 3" />
        <XAxis dataKey="month" tick={tickStyle} axisLine={false} tickLine={false} />
        <YAxis tick={tickStyle} axisLine={false} tickLine={false} />
        <Tooltip formatter={(value) => [fmtInt(Number(value ?? 0)), "Вакансий"]} />
        <Line type="monotone" dataKey="count" stroke="#1d4ed8" strokeWidth={3} dot={{ r: 4, fill: "#1d4ed8" }} />
      </LineChart>
    </ResponsiveContainer>
  );
}

function TrendingSkillsList({
  data,
  selectedSkill,
  onSelect,
}: {
  data: TrendingSkill[];
  selectedSkill: string;
  onSelect: (skill: string) => void;
}) {
  return (
    <div className="space-y-3">
      {data.map((item) => (
        <button
          key={item.skill}
          onClick={() => onSelect(item.skill)}
          className={`flex w-full items-center justify-between gap-4 rounded-[22px] border px-4 py-3 text-left transition ${
            selectedSkill === item.skill
              ? "border-stone-950 bg-stone-950 text-white"
              : "border-stone-200 bg-stone-50 hover:border-stone-400"
          }`}
        >
          <div>
            <div className="text-sm font-semibold">{item.skill}</div>
            <div className={`mt-1 text-xs ${selectedSkill === item.skill ? "text-stone-300" : "text-stone-500"}`}>
              {item.category ?? "Без категории"} · сейчас {fmtInt(item.current_count)} · раньше {fmtInt(item.previous_count)}
            </div>
          </div>
          <div className={`text-sm font-semibold ${item.delta >= 0 ? "text-emerald-500" : "text-rose-500"}`}>
            {item.delta >= 0 ? "+" : ""}
            {item.delta} ({item.delta_pct.toFixed(1)}%)
          </div>
        </button>
      ))}
    </div>
  );
}

function SkillCompareGrid({ data }: { data: SkillCompareItem[] }) {
  if (!data.length) {
    return <div className="rounded-[22px] bg-stone-100 p-4 text-sm text-stone-500">Для compare пока недостаточно данных.</div>;
  }

  return (
    <div className="grid gap-3 md:grid-cols-3">
      {data.map((item) => (
        <div key={item.skill} className="rounded-[24px] border border-stone-200 bg-white p-4">
          <div className="text-xs font-semibold uppercase tracking-[0.22em] text-stone-400">
            {item.category ?? "Без категории"}
          </div>
          <div className="mt-2 text-xl font-semibold text-stone-950">{item.skill}</div>
          <div className="mt-3 space-y-1 text-sm text-stone-600">
            <div>Вакансий: {fmtInt(item.vacancy_count)}</div>
            <div>Средняя: {item.avg_salary_kzt ? fmtSalary(item.avg_salary_kzt) : "нет данных"}</div>
            <div>Медиана: {item.median_salary_kzt ? fmtSalary(item.median_salary_kzt) : "нет данных"}</div>
          </div>
          <div className="mt-4 h-24">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={item.monthly_trend}>
                <Line type="monotone" dataKey="count" stroke="#1d4ed8" strokeWidth={2} dot={false} />
                <Tooltip formatter={(value) => [fmtInt(Number(value ?? 0)), "Вакансий"]} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      ))}
    </div>
  );
}

function SkillCardPanel({ card }: { card: ApiSkillCard }) {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Вакансий"
          value={fmtInt(card.total_vacancies)}
          detail={card.category ?? "Без категории"}
          accent="teal"
        />
        <MetricCard
          label="Средняя"
          value={card.salary ? fmtSalary(card.salary.avg_salary_kzt) : "н/д"}
          detail={card.salary ? `Медиана: ${fmtSalary(card.salary.median_salary_kzt)}` : "Нет зарплатных данных"}
          accent="amber"
        />
        <MetricCard
          label="Минимум"
          value={card.salary ? fmtSalary(card.salary.min_salary_kzt) : "н/д"}
          detail={card.salary ? `Максимум: ${fmtSalary(card.salary.max_salary_kzt)}` : "Нет зарплатных данных"}
          accent="navy"
        />
        <MetricCard
          label="Salary coverage"
          value={card.salary ? fmtInt(card.salary.vacancy_count) : "0"}
          detail="Вакансий с зарплатой"
          accent="rose"
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="rounded-[24px] bg-stone-50 p-4">
          <div className="mb-3 text-sm font-semibold text-stone-950">Динамика по месяцам</div>
          <TrendsChart data={card.monthly_trend} />
        </div>
        <div className="rounded-[24px] bg-stone-50 p-4">
          <div className="mb-3 text-sm font-semibold text-stone-950">Связанные навыки</div>
          <div className="flex flex-wrap gap-2">
            {card.related_skills.map((item) => (
              <div key={item.skill} className="rounded-full bg-white px-3 py-2 text-sm text-stone-700 shadow-sm">
                {item.skill} · {fmtInt(item.count)}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <SimpleStatList
          title="Топ регионы"
          rows={card.top_regions.map((item) => ({
            label: item.region,
            value: `${fmtInt(item.vacancy_count)} вакансий`,
          }))}
        />
        <SimpleStatList
          title="Топ компании"
          rows={card.top_companies.map((item) => ({
            label: item.company,
            value: `${fmtInt(item.vacancy_count)} вакансий`,
          }))}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <DistributionChart title="Опыт" data={card.experience_distribution} tone="#0f766e" />
        <DistributionChart title="Занятость" data={card.employment_distribution} tone="#b45309" />
      </div>
    </div>
  );
}

function SimpleStatList({
  title,
  rows,
}: {
  title: string;
  rows: { label: string; value: string }[];
}) {
  return (
    <div className="rounded-[24px] bg-stone-50 p-4">
      <div className="mb-3 text-sm font-semibold text-stone-950">{title}</div>
      <div className="space-y-3">
        {rows.map((row) => (
          <div key={`${title}-${row.label}`} className="flex items-center justify-between gap-4 rounded-2xl bg-white px-4 py-3">
            <span className="text-sm text-stone-700">{row.label}</span>
            <span className="text-sm font-semibold text-stone-950">{row.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function VacancyDetailPanel({ vacancy }: { vacancy: ApiVacancy | null }) {
  if (!vacancy) {
    return <div className="rounded-[24px] bg-stone-100 p-6 text-sm text-stone-500">Выбери вакансию слева, чтобы увидеть детали.</div>;
  }

  return (
    <div className="rounded-[28px] border border-stone-200 bg-white p-5 shadow-[0_12px_35px_rgba(15,23,42,0.05)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.24em] text-stone-400">{vacancy.source}</div>
          <h3 className="mt-2 text-2xl font-semibold text-stone-950">{vacancy.title}</h3>
          <p className="mt-2 text-sm text-stone-600">
            {vacancy.company ?? "Компания не указана"} · {vacancy.area_name ?? "Регион не указан"}
          </p>
        </div>
        <div className="rounded-full bg-stone-100 px-3 py-1 text-xs font-semibold text-stone-600">
          {vacancy.published_at ? new Date(vacancy.published_at).toLocaleDateString("ru-RU") : "Дата не указана"}
        </div>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2">
        <DetailBox label="Зарплата" value={formatVacancySalary(vacancy)} />
        <DetailBox label="Опыт" value={formatExperience(vacancy.experience)} />
        <DetailBox label="Занятость" value={formatEmployment(vacancy.employment)} />
        <DetailBox label="Источник" value={vacancy.source === "hh" ? "hh.kz" : vacancy.tg_channel ? `Telegram · ${vacancy.tg_channel}` : "Telegram"} />
      </div>

      <div className="mt-5">
        <div className="text-sm font-semibold text-stone-950">Навыки</div>
        <div className="mt-3 flex flex-wrap gap-2">
          {(vacancy.skills ?? []).length ? (
            vacancy.skills?.map((skill) => (
              <span key={`${vacancy.id}-${skill}`} className="rounded-full bg-stone-100 px-3 py-2 text-sm text-stone-700">
                {skill}
              </span>
            ))
          ) : (
            <span className="text-sm text-stone-500">Навыки не указаны</span>
          )}
        </div>
      </div>
    </div>
  );
}

function DetailBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[22px] bg-stone-50 px-4 py-4">
      <div className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-400">{label}</div>
      <div className="mt-2 text-sm text-stone-800">{value}</div>
    </div>
  );
}

const EXPERIENCE_LABELS: Record<string, string> = {
  noExperience: "Без опыта",
  between1And3: "От 1 до 3 лет",
  between3And6: "От 3 до 6 лет",
  moreThan6: "Более 6 лет",
};

const EMPLOYMENT_LABELS: Record<string, string> = {
  FULL: "Полная занятость",
  PART: "Частичная занятость",
  PROJECT: "Проектная работа",
  FLY_IN_FLY_OUT: "Вахта",
  SIDE_JOB: "Подработка",
};

function formatExperience(value: string | null | undefined): string {
  if (!value) return "Не указан";
  return EXPERIENCE_LABELS[value] ?? value;
}

function formatEmployment(value: string | null | undefined): string {
  if (!value) return "Не указана";
  return EMPLOYMENT_LABELS[value] ?? value;
}

function formatVacancySalary(vacancy: ApiVacancy) {
  if (vacancy.salary_from && vacancy.salary_to) {
    return `${fmtInt(vacancy.salary_from)}-${fmtInt(vacancy.salary_to)} ${vacancy.currency ?? ""}`.trim();
  }
  if (vacancy.salary_from) {
    return `от ${fmtInt(vacancy.salary_from)} ${vacancy.currency ?? ""}`.trim();
  }
  if (vacancy.salary_to) {
    return `до ${fmtInt(vacancy.salary_to)} ${vacancy.currency ?? ""}`.trim();
  }
  return "Зарплата не указана";
}

function RegionsChart({ data }: { data: RegionStat[] }) {
  return (
    <ResponsiveContainer width="100%" height={420}>
      <BarChart data={data.slice(0, 10)} layout="vertical" margin={{ left: 95, right: 10 }}>
        <CartesianGrid stroke="#e7e5e4" horizontal={false} />
        <XAxis type="number" tick={tickStyle} axisLine={false} tickLine={false} />
        <YAxis dataKey="region" type="category" width={120} tick={tickStyle} axisLine={false} tickLine={false} interval={0} />
        <Tooltip formatter={(value, name) => [fmtInt(Number(value ?? 0)), name as string]} />
        <Legend />
        <Bar dataKey="with_salary" stackId="regions" fill="#0f766e" radius={[0, 8, 8, 0]} name="С зарплатой" />
        <Bar dataKey="without_salary" stackId="regions" fill="#7dd3c7" radius={[0, 8, 8, 0]} name="Без зарплаты" />
      </BarChart>
    </ResponsiveContainer>
  );
}

function CompaniesChart({ data }: { data: CompanyStat[] }) {
  return (
    <ResponsiveContainer width="100%" height={420}>
      <BarChart data={data.slice(0, 10)} layout="vertical" margin={{ left: 100, right: 10 }}>
        <CartesianGrid stroke="#e7e5e4" horizontal={false} />
        <XAxis type="number" tick={tickStyle} axisLine={false} tickLine={false} />
        <YAxis dataKey="company" type="category" width={135} tick={tickStyle} axisLine={false} tickLine={false} interval={0} />
        <Tooltip formatter={(value, name) => [fmtInt(Number(value ?? 0)), name as string]} />
        <Legend />
        <Bar dataKey="with_salary" stackId="companies" fill="#7c3aed" radius={[0, 8, 8, 0]} name="С зарплатой" />
        <Bar dataKey="without_salary" stackId="companies" fill="#d8b4fe" radius={[0, 8, 8, 0]} name="Без зарплаты" />
      </BarChart>
    </ResponsiveContainer>
  );
}

function DistributionChart({
  title,
  data,
  tone,
}: {
  title: string;
  data: LabeledCount[];
  tone: string;
}) {
  return (
    <div>
      <h3 className="mb-3 text-lg font-semibold text-stone-950">{title}</h3>
      <MiniDistributionChart data={data} tone={tone} />
    </div>
  );
}

function MiniDistributionChart({ data, tone }: { data: LabeledCount[]; tone: string }) {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={data}>
        <CartesianGrid stroke="#e7e5e4" strokeDasharray="3 3" />
        <XAxis dataKey="label" tick={tickStyle} axisLine={false} tickLine={false} interval={0} angle={-15} textAnchor="end" height={62} />
        <YAxis tick={tickStyle} axisLine={false} tickLine={false} />
        <Tooltip formatter={(value) => [fmtInt(Number(value ?? 0)), "Вакансий"]} />
        <Bar dataKey="count" fill={tone} radius={[8, 8, 0, 0]}>
          {data.map((_, index) => (
            <Cell key={index} fill={chartColors[index % chartColors.length] ?? tone} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

const tickStyle = { fill: "#57534e", fontSize: 12 };
