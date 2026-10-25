import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme(); // reads shared Context
  const dark = theme === "dark";
  return (
    <button className="icon-round" onClick={toggleTheme} aria-label={dark ? "Switch to light theme" : "Switch to dark theme"} data-testid="theme-toggle">
      {dark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}
