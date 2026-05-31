import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import { View } from "react-native";

import { SettingsOption } from "@/components/settings-option";
import { WebsiteCard } from "@/components/website-card";
import { requestAppReview } from "@/lib/app-review/request-app-review";
import { shareApp } from "@/lib/share/share-app";

const AboutSettingsContent = () => {
  const { t } = useTranslation();

  return (
    <View className="flex-1 justify-center">
      <WebsiteCard />
      <SettingsOption
        label={t("settings.rate_helprr")}
        trailingIcon="chevron-forward-sharp"
        trailingIconAutoMirror
        onPress={requestAppReview}
      />
      <SettingsOption
        label={t("settings.share_helprr")}
        trailingIcon="chevron-forward-sharp"
        trailingIconAutoMirror
        onPress={shareApp}
      />
      <SettingsOption
        label={t("legal.legal")}
        trailingIcon="chevron-forward-sharp"
        trailingIconAutoMirror
        onPress={() => router.push("/settings/legal")}
      />
    </View>
  );
};

export { AboutSettingsContent };
