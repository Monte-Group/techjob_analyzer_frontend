import Link from "next/link";
import { Arrow } from "@/shared/ui/Arrow";

export default function FinalCta() {
  return (
    <section className="relative py-24 md:py-36 overflow-hidden hairline-t">
      <div className="absolute inset-0 gridlines opacity-[0.4] pointer-events-none" />
      <div
        className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-[1100px] h-[1100px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at center, rgba(124,108,255,0.18), rgba(124,108,255,0) 65%)",
        }}
      />
      <div className="relative mx-auto max-w-[1200px] px-6 md:px-10 text-center">
        <span className="eyebrow">J — AI · 2026</span>
        <h2 className="huge mt-8">
          Перестань <em className="font-display italic text-[color:var(--accent)]">гадать</em>.
          <br />
          Начни считать.
        </h2>
        <p className="mt-10 max-w-[580px] mx-auto text-[17px] text-[color:var(--text-dim)] leading-relaxed">
          Первые 14 дней Pro — бесплатно. Без карты. Если не зайдёт —
          возвращаешься на Free, данные остаются.
        </p>
        <div className="mt-12 flex flex-wrap items-center justify-center gap-3">
          <Link href="/login" className="btn-primary">
            Открыть дашборд <Arrow />
          </Link>
          <a href="#pricing" className="btn-ghost">
            Сравнить тарифы
          </a>
        </div>
      </div>
    </section>
  );
}
