"use client";

import { useEffect, useState } from "react";
import { Toaster } from "sonner";

type Theme = "light" | "dark";

function readTheme(): Theme {
  if (typeof document === "undefined") return "dark";
  return document.documentElement.dataset.theme === "light" ? "light" : "dark";
}

export function ThemeToaster() {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    const sync = () => setTheme(readTheme());
    sync();
    window.addEventListener("themechange", sync as EventListener);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("themechange", sync as EventListener);
      window.removeEventListener("storage", sync);
    };
  }, []);

  return <Toaster theme={theme} position="bottom-right" richColors />;
}
