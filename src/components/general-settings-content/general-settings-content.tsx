import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import { View } from "react-native";

import { SettingsOption } from "@/components/settings-option";

const GeneralSettingsContent = () => {
  const { t } = useTranslation();

  return (
    <View className="flex-1 items-center justify-center">
      <SettingsOption
        label={t("settings.appearance")}
        trailingIcon="chevron-forward-sharp"
        trailingIconAutoMirror
        onPress={() => router.push("/settings/appearance")}
      />
      <SettingsOption
        label={t("settings.tutorials")}
        trailingText={t("common.coming_soon")}
      />
    </View>
  );
};

export { GeneralSettingsContent };
