import type { LanguageCode } from "@/lib/i18n/i18n";

const speechRecognitionLocales = {
  en: "en-US",
  ar: "ar-EG",
} satisfies Record<LanguageCode, string>;

export { speechRecognitionLocales };
