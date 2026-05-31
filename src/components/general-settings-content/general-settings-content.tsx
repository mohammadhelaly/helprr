import { View } from "react-native";
import { useTranslation } from "react-i18next";

import { SettingsOption } from "@/components/settings-option";

const GeneralSettingsContent = () => {
  const { t } = useTranslation();

  return (
    <View className="flex-1 items-center justify-center">
      <SettingsOption
        label={t("settings.appearance")}
        trailingText={t("common.coming_soon")}
      />
      <SettingsOption
        label={t("settings.tutorials")}
        trailingText={t("common.coming_soon")}
      />
    </View>
  );
};

export { GeneralSettingsContent };
