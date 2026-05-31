import { getLocales } from "expo-localization";
import * as Updates from "expo-updates";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from "react";
import { I18nextProvider } from "react-i18next";
import { DevSettings, I18nManager, View } from "react-native";

import {
  defaultLanguage,
  i18n,
  isLanguageCode,
  type LanguageCode,
  type TextDirection,
} from "@/lib/i18n/i18n";
import {
  getAppLanguagePreference,
  setAppLanguagePreference,
} from "@/lib/i18n/language-preferences";

type I18nContextValue = {
  appLanguage: LanguageCode;
  direction: TextDirection;
  selectAppLanguage: (language: LanguageCode) => Promise<void>;
};

const I18nContext = createContext<I18nContextValue | null>(null);

const getSystemAppLanguage = () => {
  const languageCode = getLocales()[0]?.languageCode;

  return languageCode && isLanguageCode(languageCode)
    ? languageCode
    : defaultLanguage;
};

const getInitialAppLanguage = () => {
  return getAppLanguagePreference() ?? getSystemAppLanguage();
};

const reloadApp = async () => {
  try {
    await Updates.reloadAsync();
  } catch {
    DevSettings.reload();
  }
};

const AppI18nProvider = (props: PropsWithChildren) => {
  const { children } = props;
  const [appLanguage, setAppLanguage] = useState<LanguageCode>(
    getInitialAppLanguage,
  );
  const direction = i18n.dir(appLanguage);

  useEffect(() => {
    void i18n.changeLanguage(appLanguage);
  }, [appLanguage]);

  useEffect(() => {
    const shouldUseRtl = direction === "rtl";
    const shouldReload =
      I18nManager.isRTL !== shouldUseRtl ||
      (shouldUseRtl && !I18nManager.doLeftAndRightSwapInRTL);

    I18nManager.allowRTL(true);
    I18nManager.swapLeftAndRightInRTL(true);

    if (shouldReload) {
      I18nManager.forceRTL(shouldUseRtl);
      void reloadApp();
    }
  }, [direction]);

  const selectAppLanguage = useCallback(async (nextLanguage: LanguageCode) => {
    setAppLanguagePreference(nextLanguage);
    setAppLanguage(nextLanguage);
    await i18n.changeLanguage(nextLanguage);
  }, []);

  const value = useMemo(
    () => ({
      appLanguage,
      direction,
      selectAppLanguage,
    }),
    [appLanguage, direction, selectAppLanguage],
  );

  return (
    <I18nContext.Provider value={value}>
      <I18nextProvider i18n={i18n}>
        <View className="flex-1" style={{ direction }}>
          {children}
        </View>
      </I18nextProvider>
    </I18nContext.Provider>
  );
};

const useAppI18n = () => {
  const context = useContext(I18nContext);

  if (!context) {
    throw new Error("useAppI18n must be used inside AppI18nProvider");
  }

  return context;
};

export { AppI18nProvider, useAppI18n };
