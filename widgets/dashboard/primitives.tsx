import type { ReactNode } from "react";

const TONE_ACCENT: Record<
  "teal" | "amber" | "navy" | "stone",
  { bg: string; text: string; border: string; hover: string }
> = {
  teal: {
    bg: "var(--accent)",
    text: "#fbf4df",
    border: "var(--accent)",
    hover: "var(--accent-bright)",
  },
  amber: {
    bg: "transparent",
    text: "var(--text)",
    border: "var(--accent-bright)",
    hover: "var(--accent-bright)",
  },
  navy: {
    bg: "var(--surface-2)",
    text: "var(--text)",
    border: "var(--border-strong)",
    hover: "var(--accent-bright)",
  },
  stone: {
    bg: "transparent",
    text: "var(--text-dim)",
    border: "var(--border-strong)",
    hover: "var(--accent-bright)",
  },
};

export function ActionButton({
  title,
  subtitle,
  onClick,
  disabled = false,
  loading = false,
  tone,
}: {
  title: string;
  subtitle: string;
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
  tone: "teal" | "amber" | "navy" | "stone";
}) {
  const palette = TONE_ACCENT[tone];

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="group relative px-5 py-4 text-left transition-colors disabled:cursor-not-allowed disabled:opacity-60"
      style={{
        background: palette.bg,
        color: palette.text,
        border: `1px solid ${palette.border}`,
      }}
      onMouseEnter={(e) => {
        if (disabled) return;
        (e.currentTarget as HTMLButtonElement).style.borderColor = palette.hover;
      }}
      onMouseLeave={(e) => {
        if (disabled) return;
        (e.currentTarget as HTMLButtonElement).style.borderColor = palette.border;
      }}
    >
      <div className="font-mono text-[11px] tracking-[0.14em] uppercase">
        {loading ? "Запуск…" : title}
      </div>
      <div
        className="mt-1.5 text-[12px] leading-snug"
        style={{ color: tone === "teal" ? "rgba(251,244,223,0.78)" : "var(--text-dim)" }}
      >
        {subtitle}
      </div>
    </button>
  );
}

const METRIC_ACCENT: Record<
  "teal" | "amber" | "navy" | "rose",
  string
> = {
  teal: "var(--accent)",
  amber: "var(--green)",
  navy: "var(--blue)",
  rose: "var(--red)",
};

export function MetricCard({
  label,
  value,
  detail,
  accent,
}: {
  label: string;
  value: string;
  detail: string;
  accent: "teal" | "amber" | "navy" | "rose";
}) {
  const accentColor = METRIC_ACCENT[accent];

  return (
    <div className="panel-lift relative overflow-hidden p-5">
      <span
        className="absolute left-0 top-0 h-full w-[2px]"
        style={{ background: accentColor }}
      />
      <p className="eyebrow" style={{ color: accentColor }}>
        {label}
      </p>
      <p className="num-lg mt-4 text-[2.25rem] text-[color:var(--text)]">
        {value}
      </p>
      <p className="mt-2 font-mono text-[11px] tracking-[0.06em] text-[color:var(--text-dim)] leading-relaxed">
        {detail}
      </p>
    </div>
  );
}

export function Panel({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <section className="panel hairline px-6 md:px-8 py-7">
      <p className="eyebrow">{eyebrow}</p>
      <h2 className="medium mt-3 text-[1.4rem] md:text-[1.6rem] leading-tight">
        {title}
      </h2>
      <p className="mt-3 max-w-3xl text-[14px] leading-relaxed text-[color:var(--text-dim)]">
        {description}
      </p>
      <div className="mt-6">{children}</div>
    </section>
  );
}
