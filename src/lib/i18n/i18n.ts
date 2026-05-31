import { createInstance } from "i18next";
import { initReactI18next } from "react-i18next";

import ar from "@/lib/i18n/resources/ar.json";
import en from "@/lib/i18n/resources/en.json";

const resources = {
  en: { translation: en },
  ar: { translation: ar },
} as const;
const supportedLanguageCodes = Object.keys(resources) as LanguageCode[];
const defaultLanguage = "en" satisfies LanguageCode;

type LanguageCode = keyof typeof resources;

const i18n = createInstance();
type TextDirection = ReturnType<typeof i18n.dir>;

void i18n.use(initReactI18next).init({
  resources,
  lng: defaultLanguage,
  fallbackLng: defaultLanguage,
  supportedLngs: ["en", "ar"],
  load: "languageOnly",
  interpolation: {
    escapeValue: false,
  },
  react: {
    useSuspense: false,
  },
});

export { i18n, resources };
export type { LanguageCode, TextDirection };

const isLanguageCode = (value: string): value is LanguageCode => {
  return value in resources;
};

const normalizeLanguageCode = (value?: string | null): LanguageCode => {
  if (!value) {
    return defaultLanguage;
  }

  if (isLanguageCode(value)) {
    return value;
  }

  const languageCode = value.split("-")[0];

  return isLanguageCode(languageCode) ? languageCode : defaultLanguage;
};

const getNextLanguageCode = (locale: LanguageCode) => {
  const currentIndex = supportedLanguageCodes.indexOf(locale);
  const nextIndex = (currentIndex + 1) % supportedLanguageCodes.length;

  return supportedLanguageCodes[nextIndex];
};

export {
  defaultLanguage,
  getNextLanguageCode,
  isLanguageCode,
  normalizeLanguageCode,
  supportedLanguageCodes,
};
