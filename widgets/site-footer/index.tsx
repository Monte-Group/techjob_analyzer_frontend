import Image from "next/image";

type Col = { title: string; links: [string, string][] };

const COLS: Col[] = [
  {
    title: "Продукт",
    links: [
      ["Дашборд", "/login"],
      ["Возможности", "#features"],
      ["Цены", "#pricing"],
      ["API", "#"],
      ["Changelog", "#"],
    ],
  },
  {
    title: "Данные",
    links: [
      ["Методология", "#"],
      ["Источники", "#"],
      ["Покрытие", "#"],
      ["Отчёт 2025", "#"],
    ],
  },
  {
    title: "Компания",
    links: [
      ["Блог", "#"],
      ["Контакты", "mailto:hello@j-ai.kz"],
      ["Telegram", "https://t.me/j_ai_kz"],
      ["Вакансии", "#"],
      ["Пресса", "#"],
    ],
  },
];

export default function SiteFooter() {
  return (
    <footer className="hairline-t bg-[color:var(--bg-2)]">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10 py-14">
        <div className="grid grid-cols-2 md:grid-cols-12 gap-8">
          <div className="col-span-2 md:col-span-5">
            <div className="flex items-center gap-2">
              <Image
                src="/logo-on-dark-512.png"
                alt=""
                width={24}
                height={24}
                className="h-6 w-6"
                aria-hidden
              />
              <span className="font-mono text-[13px] tracking-[0.22em] uppercase">
                J<span className="text-[color:var(--accent)]">-</span>AI
              </span>
            </div>
            <p className="mt-5 text-[14px] text-[color:var(--text-dim)] max-w-sm leading-relaxed">
              Аналитика IT-рынка труда Казахстана. Парсим каждую вакансию.
              Считаем честно. Показываем всё.
            </p>
            <div className="mt-6 font-mono text-[11px] text-[color:var(--muted)] space-y-1">
              <div>ТОО «J — AI», БИН 250340012345</div>
              <div>Алматы, пр. Достык 89</div>
              <div>hello@j-ai.kz · +7&nbsp;(727)&nbsp;000&nbsp;01&nbsp;02</div>
            </div>
          </div>

          {COLS.map((c) => (
            <div key={c.title} className="col-span-1 md:col-span-2 lg:col-span-2">
              <div className="eyebrow mb-5">{c.title}</div>
              <ul className="space-y-3 text-[13px]">
                {c.links.map(([label, href]) => (
                  <li key={label}>
                    <a
                      href={href}
                      className="text-[color:var(--text-dim)] hover:text-[color:var(--accent-bright)] transition-colors"
                    >
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 pt-6 hairline-t flex flex-wrap items-center justify-between gap-3 font-mono text-[11px] tracking-[0.12em] uppercase text-[color:var(--muted)]">
          <span>© 2026 J — AI · Все права защищены</span>
          <div className="flex items-center gap-6">
            <a href="/docs/privacy" className="hover:text-[color:var(--text)]">Политика</a>
            <a href="/docs/terms" className="hover:text-[color:var(--text)]">Условия</a>
            <a href="/docs/cookies" className="hover:text-[color:var(--text)]">Cookies</a>
            <span className="flex items-center gap-2">
              <span className="live-dot h-[6px] w-[6px] rounded-full bg-[color:var(--green)] inline-block" />
              systems · operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
