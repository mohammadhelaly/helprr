import { eq } from "drizzle-orm";

import { appSettings } from "@/lib/db/schema";
import { db } from "@/lib/db/client";
import {
  isLanguageCode,
  normalizeLanguageCode,
  type LanguageCode,
} from "@/lib/i18n/i18n";

const appLanguageKey = "app-language";

const getStoredLanguagePreference = (key: string) => {
  const setting = db
    .select()
    .from(appSettings)
    .where(eq(appSettings.key, key))
    .get();

  if (!setting) {
    return undefined;
  }

  const normalized = normalizeLanguageCode(setting.value);

  if (setting.value !== normalized) {
    setStoredLanguagePreference(key, normalized);
  }

  return isLanguageCode(normalized) ? normalized : undefined;
};

const setStoredLanguagePreference = (key: string, language: LanguageCode) => {
  db.insert(appSettings)
    .values({ key, value: language })
    .onConflictDoUpdate({
      target: appSettings.key,
      set: { value: language },
    })
    .run();
};

const getAppLanguagePreference = (): LanguageCode | undefined => {
  return getStoredLanguagePreference(appLanguageKey);
};

const setAppLanguagePreference = (language: LanguageCode) => {
  setStoredLanguagePreference(appLanguageKey, language);
};

export { getAppLanguagePreference, setAppLanguagePreference };
