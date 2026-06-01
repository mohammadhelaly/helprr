import * as SystemUI from "expo-system-ui";
import { useColorScheme as useNativeWindColorScheme } from "nativewind";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from "react";
import { Appearance, useColorScheme } from "react-native";

import { colorSchemes } from "@/constants/theme";
import {
  getAppAppearancePreference,
  setAppAppearancePreference,
  type AppearancePreference,
  type ResolvedColorScheme,
} from "@/lib/theme/appearance-preferences";

type ThemeColors = (typeof colorSchemes)[ResolvedColorScheme];

type ThemeContextValue = {
  appearancePreference: AppearancePreference;
  colorScheme: ResolvedColorScheme;
  colors: ThemeColors;
  selectAppearancePreference: (appearance: AppearancePreference) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

const resolveColorScheme = (
  appearancePreference: AppearancePreference,
  systemColorScheme: ReturnType<typeof useColorScheme>,
): ResolvedColorScheme => {
  if (appearancePreference !== "system") {
    return appearancePreference;
  }

  return systemColorScheme === "dark" ? "dark" : "light";
};

const AppThemeProvider = (props: PropsWithChildren) => {
  const { children } = props;
  const [appearancePreference, setAppearancePreference] =
    useState<AppearancePreference>(getAppAppearancePreference);
  const systemColorScheme = useColorScheme();
  const { setColorScheme } = useNativeWindColorScheme();
  const colorScheme = resolveColorScheme(
    appearancePreference,
    systemColorScheme,
  );
  const schemeColors = colorSchemes[colorScheme];

  useEffect(() => {
    setColorScheme(appearancePreference);
    Appearance.setColorScheme(
      appearancePreference === "system" ? "unspecified" : appearancePreference,
    );
  }, [appearancePreference, setColorScheme]);

  useEffect(() => {
    void SystemUI.setBackgroundColorAsync(schemeColors.background);
  }, [schemeColors.background]);

  const selectAppearancePreference = useCallback(
    (nextAppearancePreference: AppearancePreference) => {
      setAppAppearancePreference(nextAppearancePreference);
      setAppearancePreference(nextAppearancePreference);
    },
    [],
  );

  const value = useMemo(
    () => ({
      appearancePreference,
      colorScheme,
      colors: schemeColors,
      selectAppearancePreference,
    }),
    [
      appearancePreference,
      colorScheme,
      schemeColors,
      selectAppearancePreference,
    ],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

const useAppTheme = () => {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useAppTheme must be used inside AppThemeProvider");
  }

  return context;
};

export { AppThemeProvider, useAppTheme };
export type { ThemeColors };
