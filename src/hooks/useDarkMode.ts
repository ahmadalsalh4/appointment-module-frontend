import { useEffect, useLayoutEffect, useState } from "react";

export type Theme = "light" | "dark";

const STORAGE_KEY = "theme";

function getInitialTheme(): Theme {
  if (typeof window === "undefined") return "light";

  const stored = localStorage.getItem(STORAGE_KEY) as Theme | null;
  if (stored === "light" || stored === "dark") return stored;

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  if (theme === "dark") {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }
}

export function useDarkMode() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  // Apply the theme synchronously before paint so a hard reload with
  // `localStorage.theme === "dark"` doesn't flash light first.
  useLayoutEffect(() => {
    applyTheme(theme);
  }, [theme]);

  // Persist + follow OS preference while the user hasn't chosen yet.
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, theme);

    if (typeof window === "undefined") return;
    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = (e: MediaQueryListEvent) => {
      // Only react to OS changes when the user has NOT chosen manually.
      if (localStorage.getItem(STORAGE_KEY)) return;
      setTheme(e.matches ? "dark" : "light");
    };
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [theme]);

  const toggleTheme = () =>
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));

  return { theme, setTheme, toggleTheme };
}