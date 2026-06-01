import { Pressable, Text, View } from "react-native";
import { useTranslation } from "react-i18next";

import { Icon } from "@/components/icon";
import { sizes } from "@/constants/theme";
import { appUrls } from "@/constants/urls";
import { openExternalUrl } from "@/lib/external-links/open-external-url";
import { useAppTheme } from "@/lib/theme/theme-provider";

const WebsiteCard = () => {
  const { t } = useTranslation();
  const { colors } = useAppTheme();

  return (
    <Pressable
      className="mx-4 mb-4 self-stretch rounded-xl bg-neutral p-5 dark:bg-neutral-dark"
      onPress={() => openExternalUrl(appUrls.website)}
    >
      <View className="flex-row items-center gap-4">
        <View className="h-14 w-14 items-center justify-center rounded-full bg-background dark:bg-background-dark">
          <Icon
            name="globe-outline"
            size={sizes.icon.md}
            color={colors.foreground}
          />
        </View>
        <View className="flex-1">
          <Text className="text-start text-lg font-bold text-foreground dark:text-foreground-dark">
            {t("common.website")}
          </Text>
          <Text className="mt-1 text-start text-base text-muted dark:text-muted-dark">
            {t("common.visit_website")}
          </Text>
        </View>
        <Icon name="open-outline" color={colors.foreground} />
      </View>
    </Pressable>
  );
};

export { WebsiteCard };
