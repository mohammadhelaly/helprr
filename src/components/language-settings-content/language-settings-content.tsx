import { useTranslation } from "react-i18next";
import { Alert, View } from "react-native";

import { SettingsOption } from "@/components/settings-option";
import { useAppLanguage } from "@/hooks/use-language-preferences";
import { supportedLanguageCodes, type LanguageCode } from "@/lib/i18n/i18n";

const LanguageSettingsContent = () => {
  const { t } = useTranslation();
  const { language, selectLanguage } = useAppLanguage();

  const confirmLanguageChange = (languageCode: LanguageCode) => {
    if (languageCode === language) {
      return;
    }

    Alert.alert(
      t("alerts.language_restart_title"),
      t("alerts.language_restart_text"),
      [
        { text: t("common.cancel"), style: "cancel" },
        {
          text: t("common.continue"),
          style: "destructive",
          onPress: () => selectLanguage(languageCode),
        },
      ],
    );
  };

  return (
    <View className="flex-1 items-center justify-center">
      {supportedLanguageCodes.map((languageCode) => {
        return (
          <SettingsOption
            key={languageCode}
            label={t(`language.${languageCode}`)}
            trailingIcon={language === languageCode ? "checkmark-sharp" : null}
            onPress={() => confirmLanguageChange(languageCode)}
          />
        );
      })}
    </View>
  );
};

export { LanguageSettingsContent };
