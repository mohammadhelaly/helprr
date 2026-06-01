import { useTranslation } from "react-i18next";
import { View } from "react-native";

import { SettingsOption } from "@/components/settings-option";
import { appearancePreferences } from "@/lib/theme/appearance-preferences";
import { useAppTheme } from "@/lib/theme/theme-provider";

const AppearanceSettingsContent = () => {
  const { t } = useTranslation();
  const { appearancePreference, selectAppearancePreference } = useAppTheme();

  return (
    <View className="flex-1 items-center justify-center">
      {appearancePreferences.map((appearance) => {
        return (
          <SettingsOption
            key={appearance}
            label={t(`appearance.${appearance}`)}
            trailingIcon={
              appearancePreference === appearance ? "checkmark-sharp" : null
            }
            onPress={() => selectAppearancePreference(appearance)}
          />
        );
      })}
    </View>
  );
};

export { AppearanceSettingsContent };
