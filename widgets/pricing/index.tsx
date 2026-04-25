import Link from "next/link";
import { Check } from "@/shared/ui/Check";
import { Arrow } from "@/shared/ui/Arrow";

export default function Pricing() {
  return (
    <section id="pricing" className="hairline-t hairline-b py-20 md:py-28">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <div className="grid grid-cols-12 gap-8 mb-14 items-end">
          <div className="col-span-12 md:col-span-7">
            <span className="eyebrow">[&nbsp;05&nbsp;] &nbsp;&nbsp;Pricing · KZT</span>
            <h2 className="large mt-4">
              Один раз настроил —
              <br />
              <em className="font-display italic text-[color:var(--accent)]">
                платишь как за кофе.
              </em>
            </h2>
          </div>
          <div className="col-span-12 md:col-span-5">
            <p className="text-[15px] text-[color:var(--text-dim)] leading-relaxed max-w-md">
              Цены в тенге. НДС включён. Месячная оплата, без автопродления —
              отменяешь в один клик. Годовой план даёт −20% и доступ к
              историческим данным с мая 2024.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-px bg-[color:var(--border)]">
          {/* FREE */}
          <div className="bg-[color:var(--bg)] p-8 md:p-10 flex flex-col">
            <div className="flex items-baseline justify-between">
              <span className="eyebrow">Free</span>
              <span className="font-mono text-[10px] text-[color:var(--muted)]">
                для&nbsp;начала
              </span>
            </div>
            <div className="mt-8 flex items-baseline gap-2">
              <span className="num-lg text-6xl">0</span>
              <span className="font-mono text-sm text-[color:var(--text-dim)]">₸ / навсегда</span>
            </div>
            <p className="mt-4 text-[14px] text-[color:var(--text-dim)] leading-relaxed">
              Чтобы понять тренд и прикинуть зарплатную вилку для переговоров.
            </p>
            <ul className="mt-8 space-y-3 text-[14px] flex-1">
              {[
                "Топ-20 скиллов",
                "Зарплаты по 3 городам",
                "График 12 месяцев",
                "Обновление раз в неделю",
              ].map((f) => (
                <li key={f} className="flex items-start gap-3">
                  <Check />
                  <span className="text-[color:var(--text)]">{f}</span>
                </li>
              ))}
            </ul>
            <Link href="/login" className="btn-ghost mt-10 justify-center">
              Попробовать
            </Link>
          </div>

          {/* PRO */}
          <div className="bg-[color:var(--surface)] p-8 md:p-10 flex flex-col relative overflow-hidden">
            <div
              className="absolute -top-20 -right-20 w-[300px] h-[300px] rounded-full pointer-events-none"
              style={{
                background:
                  "radial-gradient(circle at center, rgba(124,108,255,0.22), transparent 60%)",
              }}
            />
            <div className="relative flex items-baseline justify-between">
              <span className="eyebrow text-[color:var(--accent)]">⚡ Pro · популярное</span>
              <span className="font-mono text-[10px] text-[color:var(--accent)]">
                14&nbsp;дней&nbsp;бесплатно
              </span>
            </div>
            <div className="relative mt-8 flex items-baseline gap-2">
              <span className="num-lg text-6xl text-[color:var(--accent-bright)]">4,900</span>
              <span className="font-mono text-sm text-[color:var(--text-dim)]">₸ / месяц</span>
            </div>
            <div className="mt-1 font-mono text-[11px] text-[color:var(--muted)]">
              или 47,000 ₸ / год (−20%)
            </div>
            <p className="relative mt-4 text-[14px] text-[color:var(--text-dim)] leading-relaxed">
              Для тех, кто принимает решения по цифрам — соискатели, HR, тимлиды.
            </p>
            <ul className="relative mt-8 space-y-3 text-[14px] flex-1">
              {[
                "Всё из Free",
                "500+ скиллов, 8 городов",
                "Обновление каждые 4 часа",
                "Срезы по компаниям",
                "CSV / JSON выгрузка до 10K строк",
                "Алерты по порогу зарплаты",
                "API 1,000 запросов/мес",
              ].map((f) => (
                <li key={f} className="flex items-start gap-3">
                  <Check accent />
                  <span className="text-[color:var(--text)]">{f}</span>
                </li>
              ))}
            </ul>
            <Link href="/login" className="btn-primary mt-10 justify-center">
              Начать 14&nbsp;дней Pro <Arrow />
            </Link>
          </div>

          {/* TEAM */}
          <div className="bg-[color:var(--bg)] p-8 md:p-10 flex flex-col">
            <div className="flex items-baseline justify-between">
              <span className="eyebrow">Team</span>
              <span className="font-mono text-[10px] text-[color:var(--muted)]">
                для&nbsp;HR&nbsp;и&nbsp;агентств
              </span>
            </div>
            <div className="mt-8 flex items-baseline gap-2">
              <span className="num-lg text-6xl">19,900</span>
              <span className="font-mono text-sm text-[color:var(--text-dim)]">₸ / месяц</span>
            </div>
            <div className="mt-1 font-mono text-[11px] text-[color:var(--muted)]">
              за воркспейс · до 5 пользователей
            </div>
            <p className="mt-4 text-[14px] text-[color:var(--text-dim)] leading-relaxed">
              Для команд которым нужен общий дашборд, API без лимитов и SLA.
            </p>
            <ul className="mt-8 space-y-3 text-[14px] flex-1">
              {[
                "Всё из Pro",
                "До 5 пользователей",
                "API без лимитов",
                "Webhook на новые вакансии",
                "SLA 99.5% + приоритет",
                "White-label дашборды",
                "Персональный менеджер",
              ].map((f) => (
                <li key={f} className="flex items-start gap-3">
                  <Check />
                  <span className="text-[color:var(--text)]">{f}</span>
                </li>
              ))}
            </ul>
            <a href="mailto:team@j-ai.kz" className="btn-ghost mt-10 justify-center">
              Связаться
            </a>
          </div>
        </div>

        <div className="mt-6 panel hairline px-6 md:px-8 py-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-baseline gap-6 flex-wrap">
            <span className="eyebrow text-[color:var(--accent)]">Enterprise</span>
            <p className="text-[14px] text-[color:var(--text-dim)] max-w-[600px]">
              Нужен SSO, on-prem, кастомный парсинг внутренних источников или DPA с
              казахстанской юрисдикцией?
            </p>
          </div>
          <a
            href="mailto:enterprise@j-ai.kz"
            className="font-mono text-[11px] tracking-[0.12em] uppercase text-[color:var(--accent)] hover:text-[color:var(--accent-bright)] flex items-center gap-2"
          >
            enterprise@j-ai.kz <Arrow />
          </a>
        </div>
      </div>
    </section>
  );
}
