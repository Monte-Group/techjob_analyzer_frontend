"use client";

import { useState } from "react";

export type FaqItem = { q: string; a: string };

export default function Faq({ items }: { items: FaqItem[] }) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="hairline-t">
      {items.map((it, i) => {
        const isOpen = open === i;
        return (
          <div key={i} className="hairline-b" itemScope itemType="https://schema.org/Question">
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : i)}
              className="w-full text-left flex items-baseline gap-6 md:gap-10 py-6 md:py-8 group"
              aria-expanded={isOpen}
            >
              <span className="font-mono text-[11px] tracking-[0.14em] text-[color:var(--muted)] tabular pt-1 w-10 shrink-0">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3
                itemProp="name"
                className="flex-1 headline text-[1.35rem] md:text-[1.85rem] text-[color:var(--text)] transition-colors group-hover:text-[color:var(--gold-bright)]"
              >
                {it.q}
              </h3>
              <span
                className="font-mono text-[color:var(--gold)] text-xl leading-none pt-1 shrink-0 transition-transform duration-300"
                style={{ transform: isOpen ? "rotate(45deg)" : "rotate(0)" }}
                aria-hidden
              >
                +
              </span>
            </button>
            <div
              className="overflow-hidden transition-[grid-template-rows] duration-300 ease-out grid"
              style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
            >
              <div className="min-h-0 overflow-hidden">
                <div itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
                  <div
                    itemProp="text"
                    className="pl-[4rem] md:pl-[4.5rem] pr-8 pb-8 max-w-3xl text-[color:var(--text-dim)] text-[15px] leading-relaxed"
                  >
                    {it.a}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
