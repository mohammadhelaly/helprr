import { Pressable, Text, View } from "react-native";
import { useTranslation } from "react-i18next";

import { Icon } from "@/components/icon";
import { colors, sizes } from "@/constants/theme";
import { appUrls } from "@/constants/urls";
import { openExternalUrl } from "@/lib/external-links/open-external-url";

const WebsiteCard = () => {
  const { t } = useTranslation();

  return (
    <Pressable
      className="mx-4 mb-4 self-stretch rounded-xl bg-light-grey p-5"
      onPress={() => openExternalUrl(appUrls.website)}
    >
      <View className="flex-row items-center gap-4">
        <View className="h-14 w-14 items-center justify-center rounded-full bg-white">
          <Icon
            name="globe-outline"
            size={sizes.icon.md}
            color={colors.black}
          />
        </View>
        <View className="flex-1">
          <Text className="text-start text-lg font-bold text-black">
            {t("common.website")}
          </Text>
          <Text className="mt-1 text-start text-base text-grey">
            {t("common.visit_website")}
          </Text>
        </View>
        <Icon name="open-outline" color={colors.black} />
      </View>
    </Pressable>
  );
};

export { WebsiteCard };
