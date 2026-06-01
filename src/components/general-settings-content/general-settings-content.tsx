import { ActionSheetIOS, Alert, Platform, View } from "react-native";
import { useTranslation } from "react-i18next";

import { SettingsOption } from "@/components/settings-option";
import { useAppTheme } from "@/lib/theme/theme-provider";
import type { AppearancePreference } from "@/lib/theme/appearance-preferences";

const GeneralSettingsContent = () => {
  const { t } = useTranslation();
  const { appearancePreference, colorScheme, selectAppearancePreference } =
    useAppTheme();

  const appearanceOptions: {
    label: string;
    value: AppearancePreference;
  }[] = [
    { label: t("appearance.system"), value: "system" },
    { label: t("appearance.light"), value: "light" },
    { label: t("appearance.dark"), value: "dark" },
  ];

  const selectAppearance = (appearance: AppearancePreference) => {
    selectAppearancePreference(appearance);
  };

  const showAppearanceMenu = () => {
    if (Platform.OS === "ios") {
      const cancelIndex = appearanceOptions.length;

      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: [
            ...appearanceOptions.map((option) => option.label),
            t("common.cancel"),
          ],
          cancelButtonIndex: cancelIndex,
          title: t("settings.appearance"),
          userInterfaceStyle: colorScheme,
        },
        (selectedIndex) => {
          const selected = appearanceOptions[selectedIndex];

          if (selected) {
            selectAppearance(selected.value);
          }
        },
      );
      return;
    }

    Alert.alert(
      t("settings.appearance"),
      undefined,
      appearanceOptions.map((option) => ({
        text: option.label,
        onPress: () => selectAppearance(option.value),
      })),
    );
  };

  return (
    <View className="flex-1 items-center justify-center">
      <SettingsOption
        label={t("settings.appearance")}
        trailingText={t(`appearance.${appearancePreference}`)}
        onPress={showAppearanceMenu}
      />
      <SettingsOption
        label={t("settings.tutorials")}
        trailingText={t("common.coming_soon")}
      />
    </View>
  );
};

export { GeneralSettingsContent };
