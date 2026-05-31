import { Icon } from "@/components/icon";
import { colors, sizes } from "@/constants/theme";
import { useNavigationChrome } from "@/hooks/use-navigation-chrome";
import { Stack } from "expo-router/js-stack";
import { useTranslation } from "react-i18next";

const ListenLayout = () => {
  const { t } = useTranslation();
  const { stackHeaderHeight } = useNavigationChrome();

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.white,
          height: stackHeaderHeight,
        },
        headerShadowVisible: false,
        headerTitleAlign: "left",
        headerTintColor: colors.black,
        headerBackButtonDisplayMode: "minimal",
        headerTitleStyle: {
          color: colors.black,
          fontSize: sizes.font.xxxl,
          lineHeight: sizes.font.xxxxl,
          fontWeight: "bold",
        },
        headerBackImage: ({ tintColor }) => (
          <Icon
            name="chevron-back-sharp"
            autoMirror
            color={tintColor ?? colors.black}
            size={sizes.icon.md}
          />
        ),
      }}
    >
      <Stack.Screen name="index" options={{ title: t("navigation.listen") }} />
      <Stack.Screen
        name="conversation/[id]"
        options={{
          title: t("navigation.conversation"),
          headerTitleAlign: "center",
          headerTitleStyle: {
            color: colors.black,
            fontSize: sizes.font.lg,
            lineHeight: sizes.font.xl,
            fontWeight: "bold",
          },
        }}
      />
    </Stack>
  );
};

export default ListenLayout;
