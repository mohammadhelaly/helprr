import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import { View } from "react-native";

import { SettingsOption } from "@/components/settings-option";

const SettingsScreenContent = () => {
  const { t } = useTranslation();

  return (
    <View className="flex-1 items-center justify-center">
      <SettingsOption
        label={t("navigation.general")}
        trailingIcon="chevron-forward-sharp"
        trailingIconAutoMirror
        onPress={() => router.push("/settings/general")}
      />
      <SettingsOption
        label={t("navigation.permissions")}
        trailingIcon="chevron-forward-sharp"
        trailingIconAutoMirror
        onPress={() => router.push("/settings/permissions")}
      />
      <SettingsOption
        label={t("navigation.language")}
        trailingIcon="chevron-forward-sharp"
        trailingIconAutoMirror
        onPress={() => router.push("/settings/language")}
      />
      <SettingsOption
        label={t("navigation.about")}
        trailingIcon="chevron-forward-sharp"
        trailingIconAutoMirror
        onPress={() => router.push("/settings/about")}
      />
    </View>
  );
};

export { SettingsScreenContent };
