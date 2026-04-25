"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getMe } from "@/lib/api";
import { Arrow } from "@/shared/ui/Arrow";

export default function Nav() {
  const [hasSession, setHasSession] = useState<boolean | null>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    let active = true;

    void getMe()
      .then(() => {
        if (active) setHasSession(true);
      })
      .catch(() => {
        if (active) setHasSession(false);
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className="sticky top-0 z-40 backdrop-blur-sm transition-colors"
      style={{
        background: scrolled ? "rgba(10,10,11,0.82)" : "transparent",
        borderBottom: scrolled ? "1px solid var(--border)" : "1px solid transparent",
      }}
    >
      <div className="mx-auto max-w-[1400px] px-6 md:px-10 h-16 flex items-center justify-between gap-6">
        <Link href="/" className="flex items-center gap-2 group" aria-label="Stack.kz — home">
          <span
            className="text-[color:var(--gold)] text-lg leading-none transition-transform group-hover:scale-110"
            aria-hidden
          >
            ⚡
          </span>
          <span className="font-mono text-[13px] tracking-[0.22em] uppercase text-[color:var(--text)]">
            STACK<span className="text-[color:var(--gold)]">/</span>KZ
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 font-mono text-[11px] tracking-[0.12em] uppercase text-[color:var(--text-dim)]">
          <a href="#features" className="hover:text-[color:var(--text)] transition-colors">Возможности</a>
          <a href="#live" className="hover:text-[color:var(--text)] transition-colors">Данные</a>
          <a href="#pricing" className="hover:text-[color:var(--text)] transition-colors">Цены</a>
          <a href="#faq" className="hover:text-[color:var(--text)] transition-colors">FAQ</a>
        </nav>

        <div className="flex items-center gap-3">
          {hasSession ? (
            <Link href="/dashboard" className="btn-primary">
              Дашборд <Arrow />
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="hidden sm:inline-flex font-mono text-[11px] tracking-[0.12em] uppercase text-[color:var(--text-dim)] hover:text-[color:var(--text)]"
              >
                Войти
              </Link>
              <Link href="/login" className="btn-primary">
                Начать <Arrow />
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
