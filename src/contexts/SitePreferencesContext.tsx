import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from "react";

export type ThemeMode = "light" | "dark";
export type Orthography = "atual" | "antigo" | "etimologico";
export type MotionLevel = "reduzido" | "normal";
export type TextSize = "pequeno" | "normal" | "grande";

export interface SitePreferences {
  theme: ThemeMode;
  orthography: Orthography;
  motion: MotionLevel;
  music: boolean;
  textSize: TextSize;
}

interface SitePreferencesContextValue extends SitePreferences {
  setTheme: (v: ThemeMode) => void;
  setOrthography: (v: Orthography) => void;
  setMotion: (v: MotionLevel) => void;
  setMusic: (v: boolean) => void;
  setTextSize: (v: TextSize) => void;
}

const STORAGE_KEY = "lusiada.preferences.v1";

const defaults: SitePreferences = {
  theme: "light",
  orthography: "atual",
  motion: "normal",
  music: false,
  textSize: "normal",
};

const SitePreferencesContext = createContext<SitePreferencesContextValue | null>(null);

function load(): SitePreferences {
  if (typeof window === "undefined") return defaults;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaults;
    return { ...defaults, ...JSON.parse(raw) };
  } catch {
    return defaults;
  }
}

export function SitePreferencesProvider({ children }: { children: ReactNode }) {
  const [prefs, setPrefs] = useState<SitePreferences>(() => load());

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
    } catch {
      /* ignore */
    }
  }, [prefs]);

  useEffect(() => {
    const root = document.documentElement;
    if (prefs.theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
  }, [prefs.theme]);

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.textSize = prefs.textSize;
    const scale =
      prefs.textSize === "pequeno" ? "93.75%" : prefs.textSize === "grande" ? "112.5%" : "100%";
    root.style.fontSize = scale;
  }, [prefs.textSize]);

  useEffect(() => {
    document.documentElement.dataset.motion = prefs.motion;
  }, [prefs.motion]);

  useEffect(() => {
    document.documentElement.dataset.orthography = prefs.orthography;
    document.documentElement.lang =
      prefs.orthography === "etimologico" ? "pt-PT-x-etimologico" : "pt-PT";
  }, [prefs.orthography]);

  const value = useMemo<SitePreferencesContextValue>(
    () => ({
      ...prefs,
      setTheme: (theme) => setPrefs((p) => ({ ...p, theme })),
      setOrthography: (orthography) => setPrefs((p) => ({ ...p, orthography })),
      setMotion: (motion) => setPrefs((p) => ({ ...p, motion })),
      setMusic: (music) => setPrefs((p) => ({ ...p, music })),
      setTextSize: (textSize) => setPrefs((p) => ({ ...p, textSize })),
    }),
    [prefs],
  );

  return <SitePreferencesContext.Provider value={value}>{children}</SitePreferencesContext.Provider>;
}

export function useSitePreferences() {
  const ctx = useContext(SitePreferencesContext);
  if (!ctx) throw new Error("useSitePreferences must be used within SitePreferencesProvider");
  return ctx;
}
