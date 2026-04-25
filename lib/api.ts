import axios from "axios";

const BASE = process.env.NEXT_PUBLIC_API_URL ?? "/api-proxy";

const api = axios.create({ baseURL: BASE, withCredentials: true });

api.interceptors.request.use((cfg) => {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

api.interceptors.response.use(
  (r) => r,
  (err) => {
    if (err.response?.status === 401 && typeof window !== "undefined") {
      localStorage.removeItem("token");
    }
    return Promise.reject(err);
  }
);

export type VacancySource = "all" | "hh" | "telegram";
export type VacancyExperience =
  | "noExperience"
  | "between1And3"
  | "between3And6"
  | "moreThan6";
export type VacancyEmployment = "FULL" | "PART" | "PROJECT" | "FLY_IN_FLY_OUT" | "SIDE_JOB";

export interface SkillCount {
  skill: string;
  count: number;
}

export interface SkillGroup {
  category: string;
  label: string;
  items: SkillCount[];
}

export interface SalaryRow {
  skill: string;
  avg_salary_kzt: number;
  median_salary_kzt: number;
  min_salary_kzt: number;
  max_salary_kzt: number;
  vacancy_count: number;
}

export interface SalaryBucket {
  bucket: string;
  count: number;
}

export interface MonthlyTrend {
  month: string;
  count: number;
}

export interface RegionStat {
  region: string;
  vacancy_count: number;
  with_salary: number;
  without_salary: number;
  avg_salary_kzt: number;
}

export interface CompanyStat {
  company: string;
  vacancy_count: number;
  with_salary: number;
  without_salary: number;
  avg_salary_kzt: number;
}

export interface LabeledCount {
  label: string;
  count: number;
}

export interface Summary {
  total_vacancies: number;
  with_salary: number;
  hh_vacancies: number;
  telegram_vacancies: number;
}

export interface SkillCompareItem {
  skill: string;
  category: string | null;
  vacancy_count: number;
  avg_salary_kzt: number | null;
  median_salary_kzt: number | null;
  monthly_trend: MonthlyTrend[];
}

export interface TrendingSkill {
  skill: string;
  category: string | null;
  current_count: number;
  previous_count: number;
  delta: number;
  delta_pct: number;
}

export interface SkillCard {
  skill: string;
  category: string | null;
  total_vacancies: number;
  salary: {
    avg_salary_kzt: number;
    median_salary_kzt: number;
    min_salary_kzt: number;
    max_salary_kzt: number;
    vacancy_count: number;
  } | null;
  top_regions: RegionStat[];
  top_companies: CompanyStat[];
  experience_distribution: LabeledCount[];
  employment_distribution: LabeledCount[];
  monthly_trend: MonthlyTrend[];
  related_skills: SkillCount[];
}

export interface Vacancy {
  id: string;
  source: string;
  tg_channel: string | null;
  hh_id: string | null;
  title: string;
  company: string | null;
  salary_from: number | null;
  salary_to: number | null;
  currency: string | null;
  area_name: string | null;
  skills: string[] | null;
  experience: string | null;
  employment: string | null;
  published_at: string | null;
}

export interface Page<T> {
  items: T[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

type VacancyQuery = {
  page?: number;
  size?: number;
  source?: VacancySource;
  region?: string;
  skill?: string;
  experience?: string;
  employment?: string;
  search?: string;
  date_from?: string;
  date_to?: string;
  with_salary?: boolean;
};

type AnalyticsQuery = {
  source?: VacancySource;
  category?: string;
  region?: string;
};

function toQuery(params: AnalyticsQuery = {}) {
  const query = new URLSearchParams();
  if (params.source) query.set("source", params.source);
  if (params.category) query.set("category", params.category);
  if (params.region) query.set("region", params.region);
  const suffix = query.toString();
  return suffix ? `?${suffix}` : "";
}

export default api;

export async function login(email: string, password: string): Promise<string> {
  const form = new URLSearchParams({ username: email, password });
  const { data } = await api.post("/auth/token", form, {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });
  return data.access_token;
}

export async function register(email: string, password: string) {
  const { data } = await api.post("/auth/register", { email, password });
  return data;
}

export async function getSkills(limit = 20, source: VacancySource = "all") {
  const { data } = await api.get(`/analytics/skills?limit=${limit}&source=${source}`);
  return data as SkillCount[];
}

export async function getSkillBreakdown(limitPerCategory = 8, source: VacancySource = "all") {
  const { data } = await api.get(`/analytics/skills-breakdown?limit_per_category=${limitPerCategory}&source=${source}`);
  return data as SkillGroup[];
}

export async function getSalaries(category?: string, source: VacancySource = "all") {
  const suffix = toQuery({ source, category });
  const { data } = await api.get(`/analytics/salaries${suffix}`);
  return data as SalaryRow[];
}

export async function getSalaryHistogram(source: VacancySource = "all") {
  const { data } = await api.get(`/analytics/salary-histogram?source=${source}`);
  return data as SalaryBucket[];
}

export async function getTrends(source: VacancySource = "all", skill?: string) {
  const q = new URLSearchParams({ source });
  if (skill) q.set("skill", skill);
  const { data } = await api.get(`/analytics/trends?${q}`);
  return data as MonthlyTrend[];
}

export async function getRegions(source: VacancySource = "all") {
  const { data } = await api.get(`/analytics/regions?source=${source}`);
  return data as RegionStat[];
}

export async function getExperience(region?: string, source: VacancySource = "all") {
  const { data } = await api.get(`/analytics/experience${toQuery({ region, source })}`);
  return data as LabeledCount[];
}

export async function getEmployment(region?: string, source: VacancySource = "all") {
  const { data } = await api.get(`/analytics/employment${toQuery({ region, source })}`);
  return data as LabeledCount[];
}

export async function getCompanies(source: VacancySource = "all") {
  const { data } = await api.get(`/analytics/companies?source=${source}`);
  return data as CompanyStat[];
}

export async function getSkillsCompare(skills: string[], source: VacancySource = "all") {
  const query = new URLSearchParams({ skills: skills.join(","), source });
  const { data } = await api.get(`/analytics/skills/compare?${query.toString()}`);
  return data as SkillCompareItem[];
}

export async function getTrendingSkills(limit = 12, source: VacancySource = "all") {
  const { data } = await api.get(`/analytics/skills/trending?limit=${limit}&source=${source}`);
  return data as TrendingSkill[];
}

export async function getSkillCard(skill: string, source: VacancySource = "all") {
  const { data } = await api.get(`/analytics/skill/${encodeURIComponent(skill)}?source=${source}`);
  return data as SkillCard;
}

export async function exportAnalyticsCsv(
  params: Pick<AnalyticsQuery, "source" | "category" | "region"> & {
    experience?: string;
    employment?: string;
  } = {}
) {
  const query = new URLSearchParams();
  if (params.source) query.set("source", params.source);
  if (params.category) query.set("category", params.category);
  if (params.region) query.set("region", params.region);
  if (params.experience) query.set("experience", params.experience);
  if (params.employment) query.set("employment", params.employment);

  const { data } = await api.get(`/analytics/export.csv?${query.toString()}`, {
    responseType: "blob",
  });
  return data as Blob;
}

export async function getSummary(source: VacancySource = "all") {
  const { data } = await api.get(`/analytics/summary?source=${source}`);
  return data as Summary;
}

export async function listVacancies(params: VacancyQuery = {}) {
  const query = new URLSearchParams();
  if (params.page) query.set("page", String(params.page));
  if (params.size) query.set("size", String(params.size));
  if (params.source) query.set("source", params.source);
  if (params.region) query.set("region", params.region);
  if (params.skill) query.set("skill", params.skill);
  if (params.experience) query.set("experience", params.experience);
  if (params.employment) query.set("employment", params.employment);
  if (params.search) query.set("search", params.search);
  if (params.date_from) query.set("date_from", params.date_from);
  if (params.date_to) query.set("date_to", params.date_to);
  if (typeof params.with_salary === "boolean") query.set("with_salary", String(params.with_salary));

  const suffix = query.toString();
  const { data } = await api.get(`/vacancies${suffix ? `?${suffix}` : ""}`);
  return data as Page<Vacancy>;
}

export async function getVacancy(vacancyId: string) {
  const { data } = await api.get(`/vacancies/${vacancyId}`);
  return data as Vacancy;
}

export interface CurrentUser {
  id: string;
  email: string;
  is_admin: boolean;
}

export async function getMe(): Promise<CurrentUser> {
  const { data } = await api.get("/auth/me");
  return data as CurrentUser;
}

export interface ParseRun {
  id: string;
  parse_type: string;
  status: string;
  vacancies_fetched: number | null;
  error: string | null;
  started_at: string | null;
  finished_at: string | null;
}

export interface TriggerResponse {
  run_id: string;
  task_id: string;
  status: string;
}

export async function triggerParse(parseType: "hh" | "telegram"): Promise<TriggerResponse> {
  const { data } = await api.post(`/parser/trigger/${parseType}`);
  return data as TriggerResponse;
}

export async function listParseRuns(): Promise<ParseRun[]> {
  const { data } = await api.get("/parser/runs");
  return data as ParseRun[];
}

export async function logout(): Promise<void> {
  await api.post("/auth/logout");
}

// Salary Calculator
export interface SalaryCalcCompany {
  company: string;
  vacancy_count: number;
  avg_salary_kzt: number;
}

export interface SalaryCalcResult {
  skill: string;
  experience: string | null;
  region: string | null;
  avg_salary_kzt: number;
  median_salary_kzt: number;
  p25_salary_kzt: number;
  p75_salary_kzt: number;
  min_salary_kzt: number;
  max_salary_kzt: number;
  sample_count: number;
  top_companies: SalaryCalcCompany[];
}

export async function getSalaryCalc(params: {
  skill: string;
  experience?: string;
  region?: string;
  source?: string;
}): Promise<SalaryCalcResult | null> {
  const query = new URLSearchParams({ skill: params.skill });
  if (params.experience) query.set("experience", params.experience);
  if (params.region) query.set("region", params.region);
  if (params.source) query.set("source", params.source);
  const { data } = await api.get(`/analytics/salary-calc?${query}`);
  return data as SalaryCalcResult | null;
}

// Skill Gap Analyzer
export interface MissingSkill {
  skill: string;
  co_occurrence: number;
  extra_vacancies: number;
  avg_salary_kzt: number | null;
  priority_score: number;
}

export interface SkillGapResult {
  total_vacancies: number;
  matched_vacancies: number;
  match_pct: number;
  missing_skills: MissingSkill[];
}

export async function getSkillGap(skills: string[], source?: string): Promise<SkillGapResult> {
  const query = source ? `?source=${source}` : "";
  const { data } = await api.post(`/analytics/skill-gap${query}`, skills);
  return data as SkillGapResult;
}
