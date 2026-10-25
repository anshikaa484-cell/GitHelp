import { createContext, useContext, useEffect, useState } from "react";
import { loadJSON, saveJSON } from "@/utils/storage";

// CONTEXT API (2/2): the display name is a personal preference used in the
// navbar, dashboard and profile. Learning DATA (progress, quiz, bookmarks) is in Redux.
const PreferencesContext = createContext(null);

export function PreferencesProvider({ children }) {
  const [displayName, setDisplayName] = useState(() => {
    const saved = loadJSON("githelp-name", "");
    return typeof saved === "string" ? saved.slice(0, 30) : "";
  });

  useEffect(() => saveJSON("githelp-name", displayName), [displayName]);

  return (
    <PreferencesContext.Provider value={{ displayName, setDisplayName }}>
      {children}
    </PreferencesContext.Provider>
  );
}

export function usePreferences() {
  const ctx = useContext(PreferencesContext);
  if (!ctx) throw new Error("usePreferences must be used inside <PreferencesProvider>");
  return ctx;
}
