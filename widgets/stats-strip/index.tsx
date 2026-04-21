const STATS = [
  { n: "124,812", l: "вакансий в индексе",   s: "+8,420 / неделя" },
  { n: "340+",    l: "компаний отслеживаем", s: "обновлено сегодня" },
  { n: "4h",      l: "интервал обновления",  s: "инкрементально" },
  { n: "12mo",    l: "глубина истории",      s: "с мая 2025" },
];

export default function StatsStrip() {
  return (
    <div className="hairline-y">
      <div className="mx-auto max-w-[1400px] grid grid-cols-2 md:grid-cols-4 divide-x divide-[color:var(--border)]">
        {STATS.map((s, i) => (
          <div key={i} className="px-6 md:px-10 py-7 md:py-9">
            <div className="num-lg text-4xl md:text-5xl">{s.n}</div>
            <div className="mt-3 font-mono text-[11px] tracking-[0.12em] uppercase text-[color:var(--text-dim)]">
              {s.l}
            </div>
            <div className="mt-1 font-mono text-[11px] text-[color:var(--muted)]">
              {s.s}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
