import type { ReactNode } from "react";
import {
  BarMiniChart,
  SalarySpread,
  DemandSpark,
  CompanyRanks,
  GeoChart,
  ApiChart,
} from "@/shared/ui/MiniCharts";

type Feature = { tag: string; title: string; body: string; chart: ReactNode };

const FEATURES: Feature[] = [
  {
    tag: "/ trends",
    title: "Тренды скиллов",
    body: "Видишь какие технологии набирают спрос, а какие уходят. Недельный срез, месячный, годовой. Топ растущих и топ падающих — с процентами и абсолютными цифрами.",
    chart: <BarMiniChart />,
  },
  {
    tag: "/ salary",
    title: "Зарплаты по стеку",
    body: "Медиана, p25, p75, max — по каждой технологии, уровню и городу. Учитываем вилку, учитываем бонусы. Сравнивай джунов, миддлов и сеньоров бок о бок.",
    chart: <SalarySpread />,
  },
  {
    tag: "/ demand",
    title: "Динамика спроса",
    body: "Сколько новых вакансий выходит каждый день по твоему стеку. Где рынок перегрет, где простой. Экспорт в CSV, алерты по порогу — на Pro.",
    chart: <DemandSpark />,
  },
  {
    tag: "/ companies",
    title: "Рейтинг компаний",
    body: "Кто реально платит топ-вилки в Казахстане. По стеку, по уровню, по региону. Плюс — скорость найма: сколько вакансий закрыто за месяц.",
    chart: <CompanyRanks />,
  },
  {
    tag: "/ geo",
    title: "География",
    body: "Алматы vs Астана vs регионы — где чей спрос растёт быстрее. Отдельный срез «удалёнка внутри РК» и «удалёнка в зарубеж с оплатой в ₸».",
    chart: <GeoChart />,
  },
  {
    tag: "/ api",
    title: "API и выгрузки",
    body: "REST-эндпоинты на всю аналитику. CSV/JSON экспорт любого среза до 10K строк. Webhook на новые вакансии по фильтру. Для HR-тулов и бордов.",
    chart: <ApiChart />,
  },
];

export default function FeaturesGrid() {
  return (
    <section id="features" className="hairline-t hairline-b">
      <div className="mx-auto max-w-[1400px] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 divide-x divide-y divide-[color:var(--border)]">
        {FEATURES.map((f, i) => (
          <div key={i} className="px-6 md:px-8 py-10 md:py-12 group">
            <div className="flex items-start justify-between">
              <span className="eyebrow text-[color:var(--accent)]">{f.tag}</span>
              <span className="font-mono text-[11px] tracking-[0.12em] text-[color:var(--muted)]">
                {String(i + 1).padStart(2, "0")}/06
              </span>
            </div>
            <h3 className="headline text-[2rem] md:text-[2.4rem] mt-6">{f.title}</h3>
            <p className="mt-4 text-[15px] leading-relaxed text-[color:var(--text-dim)] max-w-[380px]">
              {f.body}
            </p>
            <div className="mt-8 h-[80px] opacity-80 group-hover:opacity-100 transition-opacity">
              {f.chart}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
