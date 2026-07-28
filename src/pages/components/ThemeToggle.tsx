import { useDarkMode } from "../../hooks/useDarkMode";
import { Moon, Sun } from "lucide-react";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useDarkMode();
  const isDark = theme === "dark";

  return (
    <button
      onClick={toggleTheme}
      aria-label={isDark ? "Açık moda geç" : "Karanlık moda geç"}
      className="flex h-9 w-9 items-center justify-center rounded-lg bg-main/5 text-main/70 transition hover:bg-main/10 hover:text-main"
    >
      {isDark ? (
        <Sun className="h-5 w-5" />
      ) : (
        <Moon className="h-5 w-5" />
      )}
    </button>
  );
}
