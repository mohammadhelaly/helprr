import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import { Image, Text, View } from "react-native";

import { Button } from "@/components/button";

const HomeScreenContent = () => {
  const { t } = useTranslation();

  return (
    <View className="m-4 flex-1 items-center justify-center gap-4">
      <View className="items-center justify-center gap-4">
        <Image
          source={require("@/assets/images/logo.jpg")}
          className="h-40 w-40 rounded-2xl border-4 border-foreground bg-background dark:border-foreground-dark"
          resizeMode="contain"
        />
        <Text className="text-center text-5xl font-bold text-foreground dark:text-foreground-dark">
          {t("common.app_name")}
        </Text>
        <Text className="text-center text-lg text-muted dark:text-muted-dark">
          {t("common.tagline")}
        </Text>
      </View>
      <View className="my-4 flex-row items-center justify-between gap-4">
        <Button
          className="w-[168px] overflow-hidden rounded-lg border-0 px-8 py-4"
          contentClassName="justify-around"
          icon="ear-sharp"
          onPress={() => router.push("/listen")}
          textClassName="text-lg"
        >
          {t("home.listen")}
        </Button>
        <Button
          className="w-[168px] overflow-hidden rounded-lg border-0 px-8 py-4"
          contentClassName="justify-around"
          icon="eye-sharp"
          onPress={() => router.push("/see")}
          textClassName="text-lg"
        >
          {t("home.see")}
        </Button>
      </View>
    </View>
  );
};

export { HomeScreenContent };
