import { FlashList } from "@shopify/flash-list";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";

import {
  openSourceNotices,
  type OpenSourceNotice,
} from "@/data/legal/generated/open-source-notice-data";

const AcknowledgementsSettingsContent = () => {
  const { t } = useTranslation();

  const renderItem = ({ item }: { item: OpenSourceNotice }) => {
    return (
      <View
        className="mx-4 my-2 justify-start gap-2"
        // All text in this view is in English, so we want to ensure it's always left-to-right
        style={{ direction: "ltr" }}
      >
        <Text className="text-start text-sm font-bold text-foreground dark:text-foreground-dark">
          {item.name} {item.version}
        </Text>
        <Text className="text-start text-xs font-semibold text-foreground dark:text-foreground-dark">
          {t("legal.license_label")}: {item.license}
        </Text>
        {item.repository ? (
          <Text className="text-start text-[8px] text-foreground dark:text-foreground-dark">
            {item.repository}
          </Text>
        ) : null}
        <Text className="text-start text-[8px] text-foreground dark:text-foreground-dark">
          {item.licenseText || t("legal.license_unavailable")}
        </Text>
      </View>
    );
  };

  return (
    <FlashList
      ListHeaderComponent={
        <Text className="m-4 text-base font-bold text-foreground dark:text-foreground-dark">
          {t("legal.acknowledgements_summary")}
        </Text>
      }
      data={openSourceNotices}
      keyExtractor={(item) => `${item.name}-${item.version}`}
      renderItem={renderItem}
      style={{ flex: 1 }}
    />
  );
};

export { AcknowledgementsSettingsContent };
