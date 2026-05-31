import { ScrollView, Text, View } from "react-native";
import { useTranslation } from "react-i18next";

import { licenseData } from "@/data/legal/license-data";

const LicenseSettingsContent = () => {
  const { t } = useTranslation();

  return (
    <ScrollView className="flex-1" contentContainerClassName="items-center">
      <View className="w-full max-w-screen-sm px-4">
        <Text className="my-4 text-base font-bold text-black">
          {t("legal.license_summary")}
        </Text>
        <Text className="mb-2 text-xs text-black">{licenseData}</Text>
      </View>
    </ScrollView>
  );
};

export { LicenseSettingsContent };
