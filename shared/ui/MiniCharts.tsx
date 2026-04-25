export function BarMiniChart() {
  const bars = [18, 24, 22, 30, 28, 36, 34, 44, 42, 56, 62, 78];
  const max = Math.max(...bars);
  return (
    <svg viewBox="0 0 240 80" className="w-full h-full overflow-visible" aria-hidden>
      {bars.map((v, i) => {
        const h = (v / max) * 70;
        return (
          <rect
            key={i}
            x={i * 20 + 2}
            y={80 - h}
            width="14"
            height={h}
            fill={i === bars.length - 1 ? "var(--accent)" : "var(--border-strong)"}
          />
        );
      })}
      <line x1="0" x2="240" y1="79.5" y2="79.5" stroke="var(--border)" />
    </svg>
  );
}

export function SalarySpread() {
  const boxes = [
    { x: 10, mid: 45, lo: 30, hi: 60, label: "JR" },
    { x: 90, mid: 55, lo: 35, hi: 72, label: "MD" },
    { x: 170, mid: 30, lo: 18, hi: 62, label: "SR" },
  ];
  return (
    <svg viewBox="0 0 240 80" className="w-full h-full" aria-hidden>
      {boxes.map((b, i) => (
        <g key={i}>
          <line
            x1={b.x + 30}
            x2={b.x + 30}
            y1={b.lo}
            y2={b.hi}
            stroke="var(--border-strong)"
            strokeWidth="1"
          />
          <rect
            x={b.x + 20}
            y={Math.min(b.mid, b.mid + 8)}
            width="20"
            height="8"
            fill={i === 2 ? "var(--accent)" : "var(--text-dim)"}
          />
          <text
            x={b.x + 30}
            y={78}
            textAnchor="middle"
            fontSize="9"
            fill="var(--muted)"
            fontFamily="var(--font-mono)"
          >
            {b.label}
          </text>
        </g>
      ))}
      <line x1="0" x2="240" y1="65" y2="65" stroke="var(--border)" strokeDasharray="2 3" />
    </svg>
  );
}

export function DemandSpark() {
  const d = [10, 12, 11, 14, 18, 16, 22, 28, 26, 38, 48, 60];
  const max = Math.max(...d);
  const min = Math.min(...d);
  const range = max - min;
  const w = 240;
  const h = 80;
  const pts = d.map((v, i) => `${(i / (d.length - 1)) * w},${h - ((v - min) / range) * (h - 8) - 4}`);
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-full overflow-visible" aria-hidden>
      <defs>
        <linearGradient id="dg" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.4" />
          <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={`0,${h} ${pts.join(" ")} ${w},${h}`} fill="url(#dg)" />
      <polyline points={pts.join(" ")} fill="none" stroke="var(--accent)" strokeWidth="1.5" />
      <circle
        cx={w}
        cy={h - ((d[d.length - 1] - min) / range) * (h - 8) - 4}
        r="3"
        fill="var(--accent-bright)"
      />
    </svg>
  );
}

export function CompanyRanks() {
  const rows = [
    { n: "BTS Digital", v: 95, c: "var(--accent)" },
    { n: "Kaspi.kz",    v: 88, c: "var(--text)" },
    { n: "inDrive",     v: 82, c: "var(--text)" },
    { n: "Wooppay",     v: 72, c: "var(--text-dim)" },
  ];
  return (
    <svg viewBox="0 0 240 80" className="w-full h-full" aria-hidden>
      {rows.map((r, i) => (
        <g key={i}>
          <rect x="0" y={i * 20 + 2} width={(r.v / 100) * 240} height="14" fill={r.c} opacity={0.85} />
          <text
            x="6"
            y={i * 20 + 12}
            fontSize="9"
            fill="var(--bg)"
            fontFamily="var(--font-mono)"
            letterSpacing="0.5"
          >
            {r.n.toUpperCase()}
          </text>
        </g>
      ))}
    </svg>
  );
}

export function GeoChart() {
  const bars = [
    { l: "ALM", v: 58, c: "var(--accent)" },
    { l: "AST", v: 27, c: "var(--text)" },
    { l: "SHY", v: 6, c: "var(--text-dim)" },
    { l: "KGD", v: 4, c: "var(--text-dim)" },
    { l: "OTH", v: 5, c: "var(--border-strong)" },
  ];
  let acc1 = 0;
  let acc2 = 0;
  return (
    <svg viewBox="0 0 240 80" className="w-full h-full" aria-hidden>
      {bars.map((b) => {
        const x = (acc1 / 100) * 240;
        const w = (b.v / 100) * 240;
        acc1 += b.v;
        return <rect key={b.l} x={x} y="20" width={w - 2} height="30" fill={b.c} />;
      })}
      {bars.map((b) => {
        const x = (acc2 / 100) * 240;
        const w = (b.v / 100) * 240;
        acc2 += b.v;
        return (
          <text
            key={b.l + "t"}
            x={x + w / 2}
            y="66"
            textAnchor="middle"
            fontSize="9"
            fill="var(--muted)"
            fontFamily="var(--font-mono)"
          >
            {b.l} {b.v}%
          </text>
        );
      })}
    </svg>
  );
}

export function ApiChart() {
  return (
    <svg viewBox="0 0 240 80" className="w-full h-full font-mono" aria-hidden>
      <text x="0" y="14" fontSize="10" fill="var(--text-dim)" fontFamily="var(--font-mono)">
        <tspan fill="var(--accent)">GET</tspan> /v1/skills/top?limit=10
      </text>
      <text x="0" y="30" fontSize="10" fill="var(--muted)" fontFamily="var(--font-mono)">
        ⤷ 200 OK · 42ms
      </text>
      <text x="0" y="52" fontSize="10" fill="var(--text-dim)" fontFamily="var(--font-mono)">
        <tspan fill="var(--accent)">GET</tspan> /v1/salary?stack=go
      </text>
      <text x="0" y="68" fontSize="10" fill="var(--muted)" fontFamily="var(--font-mono)">
        ⤷ 200 OK · 38ms
      </text>
    </svg>
  );
}
