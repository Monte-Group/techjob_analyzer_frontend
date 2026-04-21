type Tick = { sym: string; price: string; delta: string; up: boolean };

const TICKS: Tick[] = [
  { sym: "REACT",       price: "720K ₸", delta: "+24.1%", up: true },
  { sym: "TYPESCRIPT",  price: "690K ₸", delta: "+31.4%", up: true },
  { sym: "GO",          price: "920K ₸", delta: "+42.0%", up: true },
  { sym: "PYTHON",      price: "610K ₸", delta: "+12.3%", up: true },
  { sym: "KUBERNETES",  price: "980K ₸", delta: "+48.7%", up: true },
  { sym: "JAVA",        price: "780K ₸", delta: "+04.2%", up: true },
  { sym: "NODE.JS",     price: "680K ₸", delta: "+18.6%", up: true },
  { sym: "POSTGRESQL",  price: "640K ₸", delta: "+09.1%", up: true },
  { sym: "PHP",         price: "420K ₸", delta: "-08.7%", up: false },
  { sym: "RUBY",        price: "540K ₸", delta: "-03.2%", up: false },
  { sym: "RUST",        price: "1.2M ₸", delta: "+61.8%", up: true },
  { sym: "SWIFT",       price: "830K ₸", delta: "+14.9%", up: true },
  { sym: "KOTLIN",      price: "760K ₸", delta: "+22.4%", up: true },
  { sym: "FLUTTER",     price: "610K ₸", delta: "+28.3%", up: true },
  { sym: "AWS",         price: "890K ₸", delta: "+19.7%", up: true },
  { sym: "TERRAFORM",   price: "1.0M ₸", delta: "+36.5%", up: true },
];

export default function Ticker() {
  const items = [...TICKS, ...TICKS];
  return (
    <div className="hairline-y bg-[color:var(--bg-2)] overflow-hidden relative">
      <div className="ticker-track py-3">
        {items.map((t, i) => (
          <span
            key={i}
            className="inline-flex items-baseline gap-3 px-6 font-mono text-[11px] tracking-[0.12em] uppercase border-r border-[color:var(--border)]"
          >
            <span className="text-[color:var(--text-dim)]">{t.sym}</span>
            <span className="text-[color:var(--text)] tabular">{t.price}</span>
            <span className="tabular" style={{ color: t.up ? "var(--green)" : "var(--red)" }}>
              {t.delta}
            </span>
          </span>
        ))}
      </div>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-[color:var(--bg-2)] to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-[color:var(--bg-2)] to-transparent" />
    </div>
  );
}
