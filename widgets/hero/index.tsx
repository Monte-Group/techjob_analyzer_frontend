import Link from "next/link";
import { Arrow } from "@/shared/ui/Arrow";
import { Sparkline } from "@/shared/ui/Sparkline";

const TERMINAL_ROWS = [
  { n: 1, co: "BTS Digital",  v: "1,250,000" },
  { n: 2, co: "Kaspi.kz",     v: "1,180,000" },
  { n: 3, co: "inDrive",      v: "1,120,000" },
  { n: 4, co: "Wooppay",      v: "980,000" },
  { n: 5, co: "ForteBank",    v: "950,000" },
  { n: 6, co: "Beeline KZ",   v: "880,000" },
];

const SOURCES = [
  { name: "HH.kz",      note: "основной источник" },
  { name: "Telegram",   note: "живые сигналы рынка" },
];

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 gridlines opacity-[0.5] pointer-events-none" />
      <div
        className="absolute -right-40 -top-40 w-[700px] h-[700px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at center, color-mix(in srgb, var(--accent) 22%, transparent), transparent 60%)",
        }}
      />

      <div className="mx-auto max-w-[1400px] px-6 md:px-10 pt-16 md:pt-24 pb-16 md:pb-28 relative">
        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-12 lg:col-span-7 relative">
            <div className="flex items-center gap-3 mb-8 reveal">
              <span className="eyebrow">
                J<span className="text-[color:var(--accent)]">-</span>AI
              </span>
              <span className="h-[10px] w-px bg-[color:var(--border-strong)]" />
              <span className="eyebrow">Выпуск №14 · Апрель 2026</span>
              <span className="h-[10px] w-px bg-[color:var(--border-strong)]" />
              <span className="flex items-center gap-1.5 eyebrow text-[color:var(--green)]">
                <span className="live-dot inline-block h-[6px] w-[6px] rounded-full bg-[color:var(--green)]" />
                LIVE
              </span>
            </div>

            <h1 className="huge reveal" style={{ animationDelay: "80ms" }}>
              Сколько реально
              <br />
              стоит{" "}
              <em className="not-italic text-[color:var(--accent)] font-display italic font-[500]">
                твой&nbsp;стек
              </em>
              <br />
              в&nbsp;Казахстане.
            </h1>

            <p
              className="mt-10 max-w-[560px] text-[17px] md:text-[18px] leading-[1.55] text-[color:var(--text-dim)] reveal"
              style={{ animationDelay: "160ms" }}
            >
              Парсим HH.ru и LinkedIn каждые 4 часа, считаем медианы по{" "}
              <span className="text-[color:var(--text)]">340+ компаниям</span>, показываем какие
              скиллы в тренде и где платят больше. Без опросов. Без догадок.
              Только реальные вакансии.
            </p>

            <div
              className="mt-8 inline-flex items-center gap-2 rounded-full border border-[color:var(--border-strong)] bg-[color:var(--surface)] px-4 py-2 font-mono text-[11px] uppercase tracking-[0.14em] text-[color:var(--accent)] reveal"
              style={{ animationDelay: "200ms" }}
            >
              <span className="inline-block h-2 w-2 rounded-full bg-[color:var(--accent)]" />
              Purple signal across real market data
            </div>

            <div
              className="mt-10 flex flex-wrap items-center gap-3 reveal"
              style={{ animationDelay: "240ms" }}
            >
              <Link href="/login" className="btn-primary">
                Открыть дашборд <Arrow />
              </Link>
              <a href="#live" className="btn-ghost">Смотреть&nbsp;данные</a>
              <span className="pl-2 font-mono text-[11px] tracking-[0.12em] uppercase text-[color:var(--muted)]">
                14&nbsp;дней&nbsp;Pro — бесплатно
              </span>
            </div>

            <div
              className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-3 reveal"
              style={{ animationDelay: "320ms" }}
            >
              <span className="eyebrow">Источники:</span>
              {SOURCES.map((s) => (
                <span
                  key={s.name}
                  className="inline-flex items-baseline gap-2 font-mono text-[11px] tracking-[0.08em] uppercase text-[color:var(--text)]"
                >
                  <span className="text-[color:var(--accent)]">/</span>
                  {s.name}
                  <span className="text-[color:var(--muted)]">{s.note}</span>
                </span>
              ))}
            </div>
          </div>

          <div className="col-span-12 lg:col-span-5 relative reveal" style={{ animationDelay: "400ms" }}>
            <div className="relative">
              <div className="absolute -top-6 -left-10 z-10 panel-lift py-4 px-5 w-[260px] hidden md:block">
                <div className="eyebrow mb-2">Median · Senior · React · Almaty</div>
                <div className="flex items-baseline justify-between">
                  <div>
                    <span className="num-lg text-5xl text-[color:var(--text)]">₸ 1.1M</span>
                    <span className="block font-mono text-[11px] mt-1 text-[color:var(--text-dim)]">
                      n=214 · за 30 дней
                    </span>
                  </div>
                  <span className="font-mono text-[12px] text-[color:var(--green)] tabular">
                    +24.1%
                  </span>
                </div>
                <div className="mt-3">
                  <Sparkline data={[6, 7, 7, 8, 9, 10, 11, 11, 12, 13, 14, 15]} />
                </div>
              </div>

              <div className="panel-lift mt-14 md:mt-24 relative overflow-hidden">
                <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-[linear-gradient(180deg,rgba(124,108,255,0.12),rgba(124,108,255,0))]" />
                <div className="flex items-center justify-between px-4 py-2.5 hairline-b bg-[color:var(--bg)]">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-[color:var(--red)]" />
                    <span className="h-2 w-2 rounded-full bg-[color:var(--accent)]" />
                    <span className="h-2 w-2 rounded-full bg-[color:var(--green)]" />
                  </div>
                  <span className="font-mono text-[10px] tracking-[0.14em] uppercase text-[color:var(--muted)]">
                    j-ai / query
                  </span>
                  <span className="font-mono text-[10px] text-[color:var(--muted)]">14:02:41</span>
                </div>

                <div className="px-5 py-5 font-mono text-[12px] leading-[1.8]">
                  <div className="text-[color:var(--text-dim)]">
                    <span className="text-[color:var(--accent)]">$</span> jai query
                  </div>
                  <div className="text-[color:var(--text-dim)] pl-3">
                    --role <span className="text-[color:var(--text)]">senior</span>{" "}
                    --stack <span className="text-[color:var(--text)]">react,typescript</span>
                  </div>
                  <div className="text-[color:var(--text-dim)] pl-3">
                    --city <span className="text-[color:var(--text)]">almaty</span>{" "}
                    --window <span className="text-[color:var(--text)]">30d</span>
                  </div>
                  <div className="mt-4 hairline-t pt-3 text-[color:var(--muted)]">
                    # Top companies by median offer
                  </div>
                  {TERMINAL_ROWS.map((r) => (
                    <div key={r.n} className="flex items-baseline justify-between gap-4 py-0.5">
                      <span className="text-[color:var(--muted)]">
                        [{String(r.n).padStart(2, "0")}]
                      </span>
                      <span className="flex-1 text-[color:var(--text)]">{r.co}</span>
                      <span className="text-[color:var(--accent)] tabular">₸ {r.v}</span>
                    </div>
                  ))}
                  <div className="mt-4 hairline-t pt-3 flex justify-between">
                    <span className="text-[color:var(--text-dim)]">MEDIAN</span>
                    <span className="text-[color:var(--text)] tabular">₸ 1,100,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[color:var(--text-dim)]">Δ 12M</span>
                    <span className="text-[color:var(--green)] tabular">+24.1%</span>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-8 -right-6 z-10 panel-lift py-3 px-4 w-[220px] hidden md:block">
                <div className="eyebrow text-[color:var(--green)] mb-1">⬈ RISING FAST</div>
                <div className="font-display text-[28px] leading-none">Rust</div>
                <div className="mt-2 flex items-baseline justify-between">
                  <span className="font-mono text-[11px] text-[color:var(--text-dim)]">
                    jobs · 30d
                  </span>
                  <span className="font-mono text-[12px] text-[color:var(--green)] tabular">
                    +61.8%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
