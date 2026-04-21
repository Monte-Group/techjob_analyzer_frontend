import axios from "axios";

const BASE = process.env.NEXT_PUBLIC_API_URL ?? "/api-proxy";

const api = axios.create({ baseURL: BASE });

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
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

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

export async function getSkills(limit = 20) {
  const { data } = await api.get(`/analytics/skills?limit=${limit}`);
  return data as { skill: string; count: number }[];
}

export async function getSkillBreakdown(limitPerCategory = 8) {
  const { data } = await api.get(`/analytics/skills-breakdown?limit_per_category=${limitPerCategory}`);
  return data as { category: string; label: string; items: { skill: string; count: number }[] }[];
}

export async function getSalaries(category?: string) {
  const suffix = category ? `?category=${encodeURIComponent(category)}` : "";
  const { data } = await api.get(`/analytics/salaries${suffix}`);
  return data as { skill: string; avg_salary_kzt: number; vacancy_count: number }[];
}

export async function getTrends() {
  const { data } = await api.get("/analytics/trends");
  return data as { month: string; count: number }[];
}

export async function getRegions() {
  const { data } = await api.get("/analytics/regions");
  return data as {
    region: string;
    vacancy_count: number;
    with_salary: number;
    without_salary: number;
    avg_salary_kzt: number;
  }[];
}

export async function getExperience(region?: string) {
  const suffix = region ? `?region=${encodeURIComponent(region)}` : "";
  const { data } = await api.get(`/analytics/experience${suffix}`);
  return data as { label: string; count: number }[];
}

export async function getEmployment(region?: string) {
  const suffix = region ? `?region=${encodeURIComponent(region)}` : "";
  const { data } = await api.get(`/analytics/employment${suffix}`);
  return data as { label: string; count: number }[];
}

export async function getCompanies() {
  const { data } = await api.get("/analytics/companies");
  return data as {
    company: string;
    vacancy_count: number;
    with_salary: number;
    without_salary: number;
    avg_salary_kzt: number;
  }[];
}

export async function getSummary() {
  const { data } = await api.get("/analytics/summary");
  return data as { total_vacancies: number; with_salary: number };
}
