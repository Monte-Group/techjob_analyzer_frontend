"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type {
  CompanyStat,
  LabeledCount,
  MonthlyTrend as Trend,
  RegionStat,
  SalaryBucket,
  SalaryRow as Salary,
  SkillCompareItem,
  SkillCount as Skill,
} from "@/lib/api";
import { EmptyState } from "@/widgets/dashboard/empty-state";

export interface ChartPayload {
  type:
    | "skills"
    | "salaries"
    | "trends"
    | "regions"
    | "experience"
    | "employment"
    | "companies"
    | "salary_histogram"
    | "skill_compare"
    | "generic_bar";
  data:
    | Skill[]
    | Salary[]
    | Trend[]
    | RegionStat[]
    | CompanyStat[]
    | LabeledCount[]
    | SalaryBucket[]
    | SkillCompareItem[]
    | { label: string; value: number }[];
}

const chartColors = ["#7c6cff", "#1f8f78", "#3f6df6", "#e06b5f", "#8b5cf6", "#0f9db4"];
const tickStyle = { fill: "var(--text-dim)", fontSize: 12 };
const axisStroke = "var(--muted)";
const gridStroke = "var(--border)";

const fmtInt = (value: number) => new Intl.NumberFormat("ru-RU").format(value);
const fmtSalary = (value: number) =>
  `${new Intl.NumberFormat("ru-KZ", { maximumFractionDigits: 0 }).format(value)} ₸`;

export function chartTitle(type: ChartPayload["type"]) {
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

export function AIChatChart({
  chart,
  compact = false,
}: {
  chart: ChartPayload;
  compact?: boolean;
}) {
  if (chart.type === "skills") return <SkillsChart data={chart.data as Skill[]} compact={compact} />;
  if (chart.type === "salaries") return <SalariesChart data={chart.data as Salary[]} compact={compact} />;
  if (chart.type === "trends") return <TrendsChart data={chart.data as Trend[]} compact={compact} />;
  if (chart.type === "regions") return <RegionsChart data={chart.data as RegionStat[]} compact={compact} />;
  if (chart.type === "experience") {
    return <MiniDistributionChart data={chart.data as LabeledCount[]} tone="#1d4ed8" />;
  }
  if (chart.type === "employment") {
    return <MiniDistributionChart data={chart.data as LabeledCount[]} tone="#dc2626" />;
  }
  if (chart.type === "companies") return <CompaniesChart data={chart.data as CompanyStat[]} compact={compact} />;
  if (chart.type === "salary_histogram") {
    return <SalaryHistogramChart data={chart.data as SalaryBucket[]} compact={compact} />;
  }
  if (chart.type === "skill_compare") {
    return <SkillCompareChart data={chart.data as SkillCompareItem[]} compact={compact} />;
  }
  return <GenericBarChart data={chart.data as { label: string; value: number }[]} compact={compact} />;
}

export function SkillsChart({ data, compact = false }: { data: Skill[]; compact?: boolean }) {
  if (!data.length) return <EmptyState title="Нет данных по навыкам" description="Запусти парсер или попробуй другой источник." />;
  return (
    <ResponsiveContainer width="100%" height={compact ? 280 : 420}>
      <BarChart data={data} layout="vertical" margin={{ left: compact ? 36 : 60, right: compact ? 8 : 10 }}>
        <CartesianGrid stroke={gridStroke} horizontal={false} />
        <XAxis type="number" tick={tickStyle} axisLine={{ stroke: axisStroke }} tickLine={false} />
        <YAxis dataKey="skill" type="category" width={compact ? 88 : 100} tick={tickStyle} axisLine={{ stroke: axisStroke }} tickLine={false} interval={0} />
        <Tooltip formatter={(value) => [fmtInt(Number(value ?? 0)), "Вакансий"]} />
        <Bar dataKey="count" radius={[0, compact ? 8 : 10, compact ? 8 : 10, 0]} fill="#7c6cff" />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function SalariesChart({ data, compact = false }: { data: Salary[]; compact?: boolean }) {
  if (!data.length) return <EmptyState title="Нет данных по зарплатам" description="Telegram редко даёт зарплатные вилки — попробуй HH-режим." />;
  return (
    <ResponsiveContainer width="100%" height={Math.max(compact ? 260 : 360, data.length * (compact ? 42 : 52))}>
      <BarChart data={data} layout="vertical" margin={{ left: compact ? 46 : 80, right: compact ? 8 : 16 }}>
        <CartesianGrid stroke={gridStroke} horizontal={false} />
        <XAxis type="number" tick={tickStyle} axisLine={{ stroke: axisStroke }} tickLine={false} tickFormatter={(v) => `${Math.round(Number(v) / 1000)}k`} />
        <YAxis dataKey="skill" type="category" width={compact ? 98 : 110} tick={tickStyle} axisLine={{ stroke: axisStroke }} tickLine={false} interval={0} />
        <Tooltip
          formatter={(value, name) => [fmtSalary(Number(value ?? 0)), name === "avg_salary_kzt" ? "Средняя" : "Медиана"]}
          content={compact ? undefined : ({ active, payload }) => {
            if (!active || !payload?.length) return null;
            const row = payload[0]?.payload as Salary;
            return (
              <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] px-4 py-3 text-xs shadow-lg">
                <p className="mb-2 font-semibold text-[color:var(--text)]">{row.skill}</p>
                <p className="text-[color:var(--accent)]">Средняя: {fmtSalary(row.avg_salary_kzt)}</p>
                <p className="text-[color:var(--green)]">Медиана: {fmtSalary(row.median_salary_kzt)}</p>
                <p className="mt-1 text-[color:var(--muted)]">Мин: {fmtSalary(row.min_salary_kzt)} · Макс: {fmtSalary(row.max_salary_kzt)}</p>
                <p className="text-[color:var(--muted)]">Вакансий с зарплатой: {row.vacancy_count}</p>
              </div>
            );
          }}
        />
        <Legend
          formatter={(value) => (value === "avg_salary_kzt" ? "Средняя" : "Медиана")}
          wrapperStyle={{ fontSize: 12, color: "var(--text-dim)" }}
        />
        <Bar dataKey="avg_salary_kzt" name="avg_salary_kzt" radius={[0, 6, 6, 0]} fill="#8b5cf6" barSize={compact ? 8 : 10} />
        <Bar dataKey="median_salary_kzt" name="median_salary_kzt" radius={[0, 6, 6, 0]} fill="#1f8f78" barSize={compact ? 8 : 10} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function SalaryHistogramChart({ data, compact = false }: { data: SalaryBucket[]; compact?: boolean }) {
  if (!data.length) return <EmptyState title="Нет данных для гистограммы" description="Попробуй сменить источник или запустить парсер." />;
  return (
    <ResponsiveContainer width="100%" height={compact ? 260 : 360}>
      <BarChart data={data}>
        <CartesianGrid stroke={gridStroke} strokeDasharray="3 3" />
        <XAxis dataKey="bucket" tick={tickStyle} axisLine={{ stroke: axisStroke }} tickLine={false} interval={0} angle={-12} textAnchor="end" height={64} />
        <YAxis tick={tickStyle} axisLine={{ stroke: axisStroke }} tickLine={false} />
        <Tooltip formatter={(value) => [fmtInt(Number(value ?? 0)), "Вакансий"]} />
        <Bar dataKey="count" fill="#7c6cff" radius={[8, 8, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function SkillCompareChart({ data, compact = false }: { data: SkillCompareItem[]; compact?: boolean }) {
  if (!data.length) return <EmptyState title="Нечего сравнивать" description="AI пока не предложил навыки для compare." />;
  const trendRows = buildSkillCompareTrendRows(data);

  return (
    <div className={compact ? "space-y-4" : "space-y-6"}>
      <ResponsiveContainer width="100%" height={compact ? 220 : 320}>
        <BarChart data={data}>
          <CartesianGrid stroke={gridStroke} strokeDasharray="3 3" />
          <XAxis dataKey="skill" tick={tickStyle} axisLine={{ stroke: axisStroke }} tickLine={false} />
          <YAxis tick={tickStyle} axisLine={{ stroke: axisStroke }} tickLine={false} />
          <Tooltip formatter={(value) => [fmtInt(Number(value ?? 0)), "Вакансий"]} />
          <Bar dataKey="vacancy_count" fill="#7c6cff" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>

      {!compact && (
        <div className="grid gap-3 md:grid-cols-3">
          {data.map((item) => (
            <div key={item.skill} className="rounded-[22px] bg-[color:var(--surface)] p-4">
              <div className="text-sm font-semibold text-[color:var(--text)]">{item.skill}</div>
              <div className="mt-2 space-y-1 text-xs text-[color:var(--text-dim)]">
                <div>Спрос: {fmtInt(item.vacancy_count)}</div>
                <div>Средняя: {item.avg_salary_kzt ? fmtSalary(item.avg_salary_kzt) : "нет данных"}</div>
                <div>Медиана: {item.median_salary_kzt ? fmtSalary(item.median_salary_kzt) : "нет данных"}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {trendRows.length > 0 && (
        <ResponsiveContainer width="100%" height={compact ? 220 : 280}>
          <LineChart data={trendRows}>
            <CartesianGrid stroke={gridStroke} strokeDasharray="3 3" />
            <XAxis dataKey="month" tick={tickStyle} axisLine={{ stroke: axisStroke }} tickLine={false} />
            <YAxis tick={tickStyle} axisLine={{ stroke: axisStroke }} tickLine={false} />
            <Tooltip formatter={(value) => [fmtInt(Number(value ?? 0)), "Вакансий"]} />
            <Legend />
            {data.map((item, index) => (
              <Line
                key={item.skill}
                type="monotone"
                dataKey={item.skill}
                stroke={chartColors[index % chartColors.length] ?? "#0f766e"}
                strokeWidth={compact ? 2 : 3}
                dot={{ r: compact ? 2 : 3 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

export function GenericBarChart({ data, compact = false }: { data: { label: string; value: number }[]; compact?: boolean }) {
  if (!data.length) return <EmptyState title="Нет данных для графика" />;
  return (
    <ResponsiveContainer width="100%" height={Math.max(compact ? 220 : 280, data.length * (compact ? 38 : 44))}>
      <BarChart data={data} layout="vertical" margin={{ left: compact ? 52 : 80, right: compact ? 8 : 16 }}>
        <CartesianGrid stroke={gridStroke} horizontal={false} />
        <XAxis type="number" tick={tickStyle} axisLine={{ stroke: axisStroke }} tickLine={false} />
        <YAxis dataKey="label" type="category" width={compact ? 108 : 120} tick={tickStyle} axisLine={{ stroke: axisStroke }} tickLine={false} interval={0} />
        <Tooltip formatter={(value) => [fmtInt(Number(value ?? 0)), "Значение"]} />
        <Bar dataKey="value" fill="#7c6cff" radius={[0, 8, 8, 0]} />
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

export function TrendsChart({ data, compact = false }: { data: Trend[]; compact?: boolean }) {
  if (!data.length) return <EmptyState title="Нет данных по трендам" description="Накопится после первых запусков парсера." />;
  return (
    <ResponsiveContainer width="100%" height={compact ? 240 : 360}>
      <LineChart data={data} margin={{ left: 8, right: 16 }}>
        <CartesianGrid stroke={gridStroke} strokeDasharray="3 3" />
        <XAxis dataKey="month" tick={tickStyle} axisLine={{ stroke: axisStroke }} tickLine={false} />
        <YAxis tick={tickStyle} axisLine={{ stroke: axisStroke }} tickLine={false} />
        <Tooltip formatter={(value) => [fmtInt(Number(value ?? 0)), "Вакансий"]} />
        <Line type="monotone" dataKey="count" stroke="#7c6cff" strokeWidth={3} dot={{ r: compact ? 3 : 4, fill: "#7c6cff" }} />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function RegionsChart({ data, compact = false }: { data: RegionStat[]; compact?: boolean }) {
  if (!data.length) return <EmptyState title="Нет данных по регионам" description="После загрузки вакансий тут появится география." />;
  return (
    <ResponsiveContainer width="100%" height={compact ? 280 : 420}>
      <BarChart data={data.slice(0, 10)} layout="vertical" margin={{ left: compact ? 54 : 95, right: compact ? 8 : 10 }}>
        <CartesianGrid stroke={gridStroke} horizontal={false} />
        <XAxis type="number" tick={tickStyle} axisLine={{ stroke: axisStroke }} tickLine={false} />
        <YAxis dataKey="region" type="category" width={compact ? 112 : 120} tick={tickStyle} axisLine={{ stroke: axisStroke }} tickLine={false} interval={0} />
        <Tooltip formatter={(value, name) => [fmtInt(Number(value ?? 0)), name as string]} />
        <Legend />
        <Bar dataKey="with_salary" stackId="regions" fill="#7c6cff" radius={[0, 8, 8, 0]} name="С зарплатой" />
        <Bar dataKey="without_salary" stackId="regions" fill="#9fcbff" radius={[0, 8, 8, 0]} name="Без зарплаты" />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function CompaniesChart({ data, compact = false }: { data: CompanyStat[]; compact?: boolean }) {
  if (!data.length) return <EmptyState title="Нет данных по компаниям" description="Появится после первого парсинга." />;
  return (
    <ResponsiveContainer width="100%" height={compact ? 280 : 420}>
      <BarChart data={data.slice(0, 10)} layout="vertical" margin={{ left: compact ? 62 : 100, right: compact ? 8 : 10 }}>
        <CartesianGrid stroke={gridStroke} horizontal={false} />
        <XAxis type="number" tick={tickStyle} axisLine={{ stroke: axisStroke }} tickLine={false} />
        <YAxis dataKey="company" type="category" width={compact ? 120 : 135} tick={tickStyle} axisLine={{ stroke: axisStroke }} tickLine={false} interval={0} />
        <Tooltip formatter={(value, name) => [fmtInt(Number(value ?? 0)), name as string]} />
        <Legend />
        <Bar dataKey="with_salary" stackId="companies" fill="#7c3aed" radius={[0, 8, 8, 0]} name="С зарплатой" />
        <Bar dataKey="without_salary" stackId="companies" fill="#d8b4fe" radius={[0, 8, 8, 0]} name="Без зарплаты" />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function MiniDistributionChart({ data, tone }: { data: LabeledCount[]; tone: string }) {
  if (!data.length) return <EmptyState title="Нет данных" />;
  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={data}>
        <CartesianGrid stroke={gridStroke} strokeDasharray="3 3" />
        <XAxis dataKey="label" tick={tickStyle} axisLine={{ stroke: axisStroke }} tickLine={false} interval={0} angle={-15} textAnchor="end" height={62} />
        <YAxis tick={tickStyle} axisLine={{ stroke: axisStroke }} tickLine={false} />
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
