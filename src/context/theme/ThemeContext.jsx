"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

const ThemeContext = createContext(null);

function detectInitialTheme() {
  if (typeof window === "undefined") {
    return false;
  }

  const stored = window.localStorage.getItem("devlens-theme");
  if (stored === "dark") return true;
  if (stored === "light") return false;

  const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)")?.matches;
  return Boolean(prefersDark);
}

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(detectInitialTheme);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const stored = window.localStorage.getItem("devlens-theme");
    if (stored === "dark" || stored === "light") {
      setIsDark(stored === "dark");
    } else {
      const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)")?.matches;
      setIsDark(Boolean(prefersDark));
    }

    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready || typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem("devlens-theme", isDark ? "dark" : "light");
  }, [isDark, ready]);

  useEffect(() => {
    if (typeof document === "undefined") {
      return;
    }

    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  const value = useMemo(
    () => ({
      isDark,
      toggle: () => setIsDark((current) => !current),
      setTheme: (mode) => {
        setIsDark(mode === "dark");
      },
      ready,
    }),
    [isDark, ready]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useThemeContext() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useThemeContext must be used within ThemeProvider");
  }
  return context;
}
