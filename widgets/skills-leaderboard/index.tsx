import Link from "next/link";
import { SKILLS } from "@/entities/skill";
import { Sparkline } from "@/shared/ui/Sparkline";
import { Arrow } from "@/shared/ui/Arrow";
import { fmtK, fmtDelta } from "@/shared/lib/format";

const COLS: [string, string][] = [
  ["#", "w-[50px] text-center"],
  ["Skill", "text-left"],
  ["Cat.", "text-left"],
  ["Junior", "text-right"],
  ["Middle", "text-right"],
  ["Senior", "text-right"],
  ["Jobs/30d", "text-right"],
  ["Δ 12M", "text-right"],
  ["Trend", "text-right"],
];

export default function SkillsLeaderboard() {
  return (
    <section id="live" className="py-20 md:py-28">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <div className="flex flex-wrap items-end justify-between gap-6 mb-12">
          <div>
            <span className="eyebrow">[&nbsp;02&nbsp;] &nbsp;&nbsp;Leaderboard</span>
            <h2 className="large mt-4">
              Топ-10 скиллов
              <br />
              <em className="font-display italic text-[color:var(--accent)]">прямо сейчас.</em>
            </h2>
          </div>
          <div className="flex items-center gap-2 text-[11px] font-mono tracking-[0.12em] uppercase text-[color:var(--text-dim)]">
            <span className="live-dot h-[6px] w-[6px] rounded-full bg-[color:var(--green)] inline-block" />
            обновлено 4&nbsp;минуты назад
            <span className="mx-2 text-[color:var(--faint)]">·</span>
            n = 124,812
          </div>
        </div>

        <div className="panel hairline overflow-x-auto">
          <table className="w-full min-w-[860px] text-[13px]">
            <thead>
              <tr className="hairline-b bg-[color:var(--bg-2)]">
                {COLS.map(([label, cls]) => (
                  <th
                    key={label}
                    className={`px-4 py-3 font-mono text-[10px] tracking-[0.14em] uppercase text-[color:var(--muted)] font-medium ${cls}`}
                  >
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="font-mono">
              {SKILLS.map((s) => (
                <tr
                  key={s.name}
                  className="hairline-b last:border-b-0 transition-colors hover:bg-[color:var(--bg-2)]"
                >
                  <td className="px-4 py-3 text-center text-[color:var(--muted)] text-[11px]">
                    {String(s.rank).padStart(2, "0")}
                  </td>
                  <td className="px-4 py-3 text-[color:var(--text)] font-medium">{s.name}</td>
                  <td className="px-4 py-3 text-[color:var(--text-dim)] text-[11px]">
                    {s.category}
                  </td>
                  <td className="px-4 py-3 text-right text-[color:var(--text-dim)] tabular">
                    {fmtK(s.junior)}
                  </td>
                  <td className="px-4 py-3 text-right text-[color:var(--text)] tabular">
                    {fmtK(s.middle)}
                  </td>
                  <td className="px-4 py-3 text-right text-[color:var(--accent)] tabular font-medium">
                    {fmtK(s.senior)}
                  </td>
                  <td className="px-4 py-3 text-right text-[color:var(--text-dim)] tabular">
                    {s.jobs.toLocaleString()}
                  </td>
                  <td
                    className="px-4 py-3 text-right tabular"
                    style={{ color: s.delta >= 0 ? "var(--green)" : "var(--red)" }}
                  >
                    {fmtDelta(s.delta)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="inline-flex">
                      <Sparkline
                        data={s.spark}
                        color={s.delta >= 30 ? "var(--accent)" : "var(--text-dim)"}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-6 flex items-center justify-between text-[11px] font-mono tracking-[0.12em] uppercase text-[color:var(--muted)]">
          <span>фильтры · регион · уровень · компания · тип оффера — в&nbsp;дашборде</span>
          <Link
            href="/login"
            className="text-[color:var(--accent)] hover:text-[color:var(--accent-bright)] flex items-center gap-2"
          >
            открыть полный рейтинг <Arrow />
          </Link>
        </div>
      </div>
    </section>
  );
}
