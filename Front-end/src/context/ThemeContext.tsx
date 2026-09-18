import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import apiClient from "@/services/api/axios";

export type ThemeMode = "dark" | "light" | "system";
export type AccentColor = "emerald" | "blue" | "violet" | "amber" | "rose";

export type AppearanceSettings = {
  theme: ThemeMode;
  accentColor: AccentColor;
  compactTables: boolean;
  showSidebarLabels: boolean;
};

const STORAGE_KEY = "slbl-erp-appearance";

const defaults: AppearanceSettings = {
  theme: "dark",
  accentColor: "emerald",
  compactTables: false,
  showSidebarLabels: true,
};

const isThemeMode = (value: unknown): value is ThemeMode => value === "dark" || value === "light" || value === "system";
const isAccentColor = (value: unknown): value is AccentColor => ["emerald", "blue", "violet", "amber", "rose"].includes(String(value));

const normalizeAppearance = (value: Partial<AppearanceSettings> | null | undefined): AppearanceSettings => ({
  theme: isThemeMode(value?.theme) ? value.theme : defaults.theme,
  accentColor: isAccentColor(value?.accentColor) ? value.accentColor : defaults.accentColor,
  compactTables: Boolean(value?.compactTables),
  showSidebarLabels: value?.showSidebarLabels !== false,
});

type ThemeContextValue = {
  appearance: AppearanceSettings;
  setAppearance: (value: Partial<AppearanceSettings>) => void;
  resolvedTheme: "dark" | "light";
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [appearance, setAppearanceState] = useState<AppearanceSettings>(() => {
    try {
      return normalizeAppearance(JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "null"));
    } catch {
      return defaults;
    }
  });
  const [systemTheme, setSystemTheme] = useState<"dark" | "light">("dark");

  const resolvedTheme = appearance.theme === "system" ? systemTheme : appearance.theme;

  const setAppearance = (value: Partial<AppearanceSettings>) => {
    setAppearanceState((current) => {
      const next = normalizeAppearance({ ...current, ...value });
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  };

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: light)");
    const updateSystemTheme = () => setSystemTheme(mediaQuery.matches ? "light" : "dark");
    updateSystemTheme();
    mediaQuery.addEventListener("change", updateSystemTheme);
    return () => mediaQuery.removeEventListener("change", updateSystemTheme);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.theme = resolvedTheme;
    root.dataset.accent = appearance.accentColor;
    root.classList.toggle("compact-tables", appearance.compactTables);
    root.style.colorScheme = resolvedTheme;
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", resolvedTheme === "light" ? "#F4F7F6" : "#0B1915");
  }, [appearance, resolvedTheme]);

  useEffect(() => {
    if (!localStorage.getItem("access_token")) return;
    let cancelled = false;
    apiClient.get("/settings").then((response) => {
      if (cancelled) return;
      const record = response.data.find((item: { key: string }) => item.key === "settings.appearance");
      if (record?.value) setAppearance(normalizeAppearance(record.value));
    }).catch(() => {
      // Local preferences remain available when the settings endpoint is unavailable.
    });
    return () => { cancelled = true; };
  }, []);

  const value = useMemo(() => ({ appearance, setAppearance, resolvedTheme }), [appearance, resolvedTheme]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within ThemeProvider");
  return context;
};

export default ThemeProvider;
