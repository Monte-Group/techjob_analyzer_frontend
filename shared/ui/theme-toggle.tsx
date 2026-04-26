"use client";

import { useSyncExternalStore } from "react";

type Theme = "light" | "dark";

function readTheme(): Theme {
  if (typeof document === "undefined") return "dark";
  return document.documentElement.dataset.theme === "light" ? "light" : "dark";
}

function subscribe(onStoreChange: () => void) {
  if (typeof window === "undefined") {
    return () => {};
  }

  const media = window.matchMedia("(prefers-color-scheme: dark)");
  const onMedia = () => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "light" || savedTheme === "dark") return;
    const systemTheme = media.matches ? "dark" : "light";
    document.documentElement.dataset.theme = systemTheme;
    document.documentElement.style.colorScheme = systemTheme;
    window.dispatchEvent(new CustomEvent("themechange", { detail: systemTheme }));
    onStoreChange();
  };

  media.addEventListener("change", onMedia);
  window.addEventListener("themechange", onStoreChange as EventListener);
  window.addEventListener("storage", onStoreChange);

  return () => {
    media.removeEventListener("change", onMedia);
    window.removeEventListener("themechange", onStoreChange as EventListener);
    window.removeEventListener("storage", onStoreChange);
  };
}

function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;
  localStorage.setItem("theme", theme);
  window.dispatchEvent(new CustomEvent("themechange", { detail: theme }));
}

export function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, readTheme, () => "dark");

  function toggleTheme() {
    const next = theme === "dark" ? "light" : "dark";
    applyTheme(next);
  }

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Переключить тему"
      title="Переключить тему"
      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[color:var(--border)] bg-[linear-gradient(135deg,rgba(124,108,255,0.14),transparent)] text-[color:var(--text-dim)] transition hover:border-[color:var(--accent-bright)] hover:text-[color:var(--accent)]"
    >
      {isDark ? (
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2" />
          <path d="M12 20v2" />
          <path d="m4.93 4.93 1.41 1.41" />
          <path d="m17.66 17.66 1.41 1.41" />
          <path d="M2 12h2" />
          <path d="M20 12h2" />
          <path d="m6.34 17.66-1.41 1.41" />
          <path d="m19.07 4.93-1.41 1.41" />
        </svg>
      ) : (
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9" />
        </svg>
      )}
    </button>
  );
}
