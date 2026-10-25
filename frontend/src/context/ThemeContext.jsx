import { createContext, useContext, useEffect, useState } from "react";
import { loadJSON, saveJSON } from "@/utils/storage";

// CONTEXT API (1/2): theme is UI state shared by every page, so Context fits.
const ThemeContext = createContext(null);

const isValidTheme = (t) => t === "light" || t === "dark";

function getInitialTheme() {
  const saved = loadJSON("githelp-theme", null);
  if (isValidTheme(saved)) return saved; // ignore invalid saved values
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    document.documentElement.dataset.theme = theme; // CSS reads [data-theme="dark"]
    saveJSON("githelp-theme", theme);
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside <ThemeProvider>");
  return ctx;
}
