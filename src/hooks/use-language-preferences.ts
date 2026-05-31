import { useCallback, useState } from "react";

import { defaultLanguage, type LanguageCode } from "@/lib/i18n/i18n";
import { useAppI18n } from "@/lib/i18n/i18n-provider";

const useConversationLanguage = () => {
  const { appLanguage } = useAppI18n();
  const [language, setLanguage] = useState<LanguageCode>(
    appLanguage ?? defaultLanguage,
  );

  const selectLanguage = useCallback((next: LanguageCode) => {
    setLanguage(next);
  }, []);

  return { language, selectLanguage };
};

const useAppLanguage = () => {
  const { appLanguage, selectAppLanguage } = useAppI18n();

  const selectLanguage = useCallback(
    (next: LanguageCode) => {
      void selectAppLanguage(next);
    },
    [selectAppLanguage],
  );

  return { language: appLanguage, selectLanguage };
};

export { useAppLanguage, useConversationLanguage };
