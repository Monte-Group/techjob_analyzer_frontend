import type { ReactNode } from "react";

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
  const toneClass = {
    teal: "bg-teal-900 text-teal-50 hover:bg-teal-800",
    amber: "bg-amber-600 text-amber-50 hover:bg-amber-500",
    navy: "bg-blue-900 text-blue-50 hover:bg-blue-800",
    stone: "bg-stone-200 text-stone-900 hover:bg-stone-300",
  }[tone];

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`rounded-[22px] px-4 py-4 text-left transition ${toneClass} disabled:cursor-not-allowed disabled:opacity-60`}
    >
      <div className="text-sm font-semibold">{loading ? "Запуск..." : title}</div>
      <div className="mt-1 text-xs opacity-85">{subtitle}</div>
    </button>
  );
}

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
  const accentClass = {
    teal: "from-teal-700/90 to-teal-500/85 text-white",
    amber: "from-amber-500/95 to-orange-500/85 text-stone-950",
    navy: "from-blue-900/95 to-blue-700/85 text-white",
    rose: "from-rose-700/90 to-orange-600/85 text-white",
  }[accent];

  return (
    <div className={`rounded-[24px] bg-gradient-to-br ${accentClass} p-5 shadow-[0_18px_45px_rgba(15,23,42,0.12)]`}>
      <p className="text-xs font-semibold uppercase tracking-[0.22em] opacity-80">{label}</p>
      <p className="mt-4 text-3xl font-semibold">{value}</p>
      <p className="mt-2 text-sm opacity-85">{detail}</p>
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
    <section className="rounded-[30px] border border-white/75 bg-white/78 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.07)] backdrop-blur">
      <p className="text-xs font-semibold uppercase tracking-[0.26em] text-stone-400">{eyebrow}</p>
      <h2 className="mt-3 text-2xl font-semibold text-stone-950">{title}</h2>
      <p className="mt-2 max-w-3xl text-sm leading-6 text-stone-600">{description}</p>
      <div className="mt-6">{children}</div>
    </section>
  );
}
