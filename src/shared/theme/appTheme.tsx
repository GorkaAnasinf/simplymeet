import AsyncStorage from "@react-native-async-storage/async-storage";
import { PropsWithChildren, createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useColorScheme } from "react-native";

import { splashColors } from "../../features/splash/theme/splashColors";
import { colors } from "./colors";

const STORAGE_KEY = "simplymeet.theme.preference";

export type ThemePreference = "system" | "light" | "dark";
export type ThemeMode = "light" | "dark";

export type AppThemePalette = {
  gradientStart: string;
  gradientMid: string;
  gradientEnd: string;
  glow: string;
  glowLight: string;
  glowSoft: string;
  textBright: string;
  textMuted: string;
  textSubtle: string;
  progressTrack: string;
  progressFill: string;
  progressGlow: string;
  particlePlum: string;
  particleTeal: string;
  checkDone: string;
  surfaceDark: string;
  surfaceDarkSolid: string;
  borderLight: string;
  borderMedium: string;
  meetingPastBg: string;
  meetingPastBorder: string;
  rowOccupied: string;
  screenBackground: string;
  errorText: string;
};

type AppThemeContextValue = {
  mode: ThemeMode;
  preference: ThemePreference;
  setPreference: (value: ThemePreference) => void;
  toggleMode: () => void;
  palette: AppThemePalette;
};

const darkPalette: AppThemePalette = {
  gradientStart: splashColors.gradientStart,
  gradientMid: splashColors.gradientMid,
  gradientEnd: splashColors.gradientEnd,
  glow: splashColors.glow,
  glowLight: splashColors.glowLight,
  glowSoft: splashColors.glowSoft,
  textBright: splashColors.textBright,
  textMuted: splashColors.textMuted,
  textSubtle: splashColors.textSubtle,
  progressTrack: splashColors.progressTrack,
  progressFill: splashColors.progressFill,
  progressGlow: splashColors.progressGlow,
  particlePlum: "rgba(167, 109, 148, 0.16)",
  particleTeal: "rgba(0, 160, 157, 0.12)",
  checkDone: splashColors.checkDone,
  surfaceDark: splashColors.surfaceDark,
  surfaceDarkSolid: splashColors.surfaceDarkSolid,
  borderLight: splashColors.borderLight,
  borderMedium: splashColors.borderMedium,
  meetingPastBg: splashColors.meetingPastBg,
  meetingPastBorder: splashColors.meetingPastBorder,
  rowOccupied: splashColors.rowOccupied,
  screenBackground: splashColors.gradientStart,
  errorText: "#FCA5A5",
};

const lightPalette: AppThemePalette = {
  gradientStart: "#F8F4F7",
  gradientMid: "#F5F0F3",
  gradientEnd: "#EEE7EC",
  glow: colors.accent,
  glowLight: "#926082",
  glowSoft: "rgba(113, 75, 103, 0.22)",
  textBright: colors.textPrimary,
  textMuted: colors.textSecondary,
  textSubtle: "rgba(92, 77, 87, 0.72)",
  progressTrack: "rgba(113, 75, 103, 0.14)",
  progressFill: colors.accent,
  progressGlow: "rgba(113, 75, 103, 0.28)",
  particlePlum: "rgba(113, 75, 103, 0.16)",
  particleTeal: "rgba(0, 160, 157, 0.16)",
  checkDone: colors.accentTeal,
  surfaceDark: "rgba(255,255,255,0.90)",
  surfaceDarkSolid: "#FFFFFF",
  borderLight: "rgba(113, 75, 103, 0.20)",
  borderMedium: "rgba(113, 75, 103, 0.28)",
  meetingPastBg: "#DAD1D7",
  meetingPastBorder: "rgba(113, 75, 103, 0.28)",
  rowOccupied: "rgba(113, 75, 103, 0.30)",
  screenBackground: colors.background,
  errorText: "#B91C1C",
};

const AppThemeContext = createContext<AppThemeContextValue | undefined>(undefined);

export function AppThemeProvider({ children }: PropsWithChildren) {
  const systemScheme = useColorScheme();
  const [preference, setPreferenceState] = useState<ThemePreference>("system");

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((value) => {
        if (value === "light" || value === "dark" || value === "system") {
          setPreferenceState(value);
        }
      })
      .catch(() => undefined);
  }, []);

  const setPreference = useCallback((value: ThemePreference) => {
    setPreferenceState(value);
    AsyncStorage.setItem(STORAGE_KEY, value).catch(() => undefined);
  }, []);

  const mode: ThemeMode = preference === "system" ? (systemScheme === "dark" ? "dark" : "light") : preference;

  const toggleMode = useCallback(() => {
    setPreference(mode === "dark" ? "light" : "dark");
  }, [mode, setPreference]);

  const palette = mode === "dark" ? darkPalette : lightPalette;

  const value = useMemo<AppThemeContextValue>(
    () => ({
      mode,
      preference,
      setPreference,
      toggleMode,
      palette,
    }),
    [mode, palette, preference, setPreference, toggleMode],
  );

  return <AppThemeContext.Provider value={value}>{children}</AppThemeContext.Provider>;
}

export function useAppTheme() {
  const context = useContext(AppThemeContext);
  if (!context) {
    throw new Error("useAppTheme debe usarse dentro de AppThemeProvider.");
  }
  return context;
}
