import { useEffect, useState } from "react";
import { MoonIcon, SunIcon } from "@heroicons/react/24/outline";

export const THEME_STORAGE_KEY = "stock-master-theme";

export function initThemeFromStorage() {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === "dark" || stored === "light") {
      document.documentElement.setAttribute("data-theme", stored);
      return;
    }
  } catch {
    /* ignore */
  }
  const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)")?.matches;
  document.documentElement.setAttribute("data-theme", prefersDark ? "dark" : "light");
}

function readTheme() {
  return document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
}

export default function ThemeToggle() {
  const [mode, setMode] = useState(readTheme);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", mode);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, mode);
    } catch {
      /* ignore */
    }
  }, [mode]);

  const isDark = mode === "dark";

  return (
    <button
      type="button"
      onClick={() => setMode(isDark ? "light" : "dark")}
      className="btn btn-ghost btn-circle btn-sm border border-transparent text-base-content/70 transition-colors duration-200 hover:border-base-300 hover:bg-base-200 hover:text-base-content"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Light mode" : "Dark mode"}
    >
      {isDark ? <SunIcon className="h-5 w-5" aria-hidden /> : <MoonIcon className="h-5 w-5" aria-hidden />}
    </button>
  );
}
