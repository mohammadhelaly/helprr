import { Icon } from "@/components/icon";
import { sizes } from "@/constants/theme";
import { useNavigationChrome } from "@/hooks/use-navigation-chrome";
import { useAppTheme } from "@/lib/theme/theme-provider";
import { Stack } from "expo-router/js-stack";
import { useTranslation } from "react-i18next";

const ListenLayout = () => {
  const { t } = useTranslation();
  const { stackHeaderHeight } = useNavigationChrome();
  const { colors } = useAppTheme();

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.background,
          height: stackHeaderHeight,
        },
        headerShadowVisible: false,
        headerTitleAlign: "left",
        headerTintColor: colors.foreground,
        headerBackButtonDisplayMode: "minimal",
        headerTitleStyle: {
          color: colors.foreground,
          fontSize: sizes.fontSize["4xl"],
          lineHeight: sizes.lineHeight["4xl"],
          fontWeight: "bold",
        },
        headerBackImage: ({ tintColor }) => (
          <Icon
            name="chevron-back-sharp"
            autoMirror
            color={tintColor ?? colors.foreground}
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
            color: colors.foreground,
            fontSize: sizes.fontSize.lg,
            lineHeight: sizes.lineHeight.xl,
            fontWeight: "bold",
          },
        }}
      />
    </Stack>
  );
};

export default ListenLayout;
