"use client";

import { useMemo, useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";

type Row = { m: string; react: number; python: number; go: number; devops: number };

const DATA: Row[] = [
  { m: "Май 25", react: 312, python: 268, go: 84,  devops: 142 },
  { m: "Июн",    react: 334, python: 281, go: 96,  devops: 151 },
  { m: "Июл",    react: 341, python: 290, go: 110, devops: 163 },
  { m: "Авг",    react: 368, python: 308, go: 128, devops: 172 },
  { m: "Сен",    react: 390, python: 322, go: 145, devops: 184 },
  { m: "Окт",    react: 412, python: 338, go: 163, devops: 198 },
  { m: "Ноя",    react: 438, python: 347, go: 179, devops: 211 },
  { m: "Дек",    react: 461, python: 352, go: 191, devops: 228 },
  { m: "Янв 26", react: 479, python: 361, go: 204, devops: 241 },
  { m: "Фев",    react: 498, python: 368, go: 218, devops: 256 },
  { m: "Мар",    react: 512, python: 374, go: 228, devops: 268 },
  { m: "Апр",    react: 531, python: 379, go: 241, devops: 279 },
];

const SERIES = [
  { key: "react",  label: "React / TS",   color: "#7c6cff" },
  { key: "python", label: "Python",       color: "#fbf4df" },
  { key: "go",     label: "Go",           color: "#82c1f0" },
  { key: "devops", label: "DevOps / K8s", color: "#a4e47b" },
] as const;

export default function DemandChart() {
  const [active, setActive] = useState<Record<string, boolean>>({
    react: true, python: true, go: true, devops: true,
  });

  const visible = useMemo(() => SERIES.filter((s) => active[s.key]), [active]);

  return (
    <div className="w-full">
      <div className="flex flex-wrap items-center gap-3 mb-6">
        {SERIES.map((s) => (
          <button
            key={s.key}
            type="button"
            onClick={() => setActive((a) => ({ ...a, [s.key]: !a[s.key] }))}
            className="group flex items-center gap-2 px-3 py-1.5 hairline text-[11px] font-mono uppercase tracking-[0.12em] transition-colors"
            style={{
              opacity: active[s.key] ? 1 : 0.35,
              borderColor: active[s.key] ? s.color : undefined,
              color: active[s.key] ? s.color : "var(--text-dim)",
            }}
          >
            <span className="h-2 w-2 rounded-full" style={{ background: s.color }} />
            {s.label}
          </button>
        ))}
      </div>
      <div className="h-[340px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={DATA} margin={{ top: 8, right: 12, left: -10, bottom: 0 }}>
            <CartesianGrid stroke="rgba(251,244,223,0.06)" strokeDasharray="0" />
            <XAxis
              dataKey="m"
              stroke="#817c70"
              fontSize={11}
              fontFamily="var(--font-mono)"
              tickLine={false}
              axisLine={{ stroke: "#262629" }}
            />
            <YAxis
              stroke="#817c70"
              fontSize={11}
              fontFamily="var(--font-mono)"
              tickLine={false}
              axisLine={{ stroke: "#262629" }}
              width={42}
            />
            <Tooltip
              cursor={{ stroke: "#7c6cff", strokeWidth: 1, strokeDasharray: "2 3" }}
              contentStyle={{
                background: "#0a0a0b",
                border: "1px solid #35353a",
                borderRadius: 0,
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                color: "#fbf4df",
                padding: "8px 12px",
              }}
              labelStyle={{ color: "#c4bcaa", marginBottom: 4 }}
              itemStyle={{ padding: 0 }}
            />
            <Legend iconType="square" wrapperStyle={{ display: "none" }} />
            {visible.map((s) => (
              <Line
                key={s.key}
                type="monotone"
                dataKey={s.key}
                stroke={s.color}
                strokeWidth={s.key === "react" ? 2 : 1.3}
                dot={false}
                activeDot={{ r: 3, fill: s.color, stroke: "#0a0a0b", strokeWidth: 2 }}
                animationDuration={900}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
