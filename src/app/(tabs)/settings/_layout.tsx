import { Icon } from "@/components/icon";
import { sizes } from "@/constants/theme";
import { useNavigationChrome } from "@/hooks/use-navigation-chrome";
import { useAppTheme } from "@/lib/theme/theme-provider";
import { Stack } from "expo-router/js-stack";
import { useTranslation } from "react-i18next";

const SettingsLayout = () => {
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
      <Stack.Screen
        name="index"
        options={{ title: t("navigation.settings") }}
      />
      <Stack.Screen
        name="general"
        options={{ title: t("navigation.general") }}
      />
      <Stack.Screen
        name="permissions"
        options={{ title: t("navigation.permissions") }}
      />
      <Stack.Screen
        name="language"
        options={{ title: t("navigation.language") }}
      />
      <Stack.Screen name="about" options={{ title: t("navigation.about") }} />
      <Stack.Screen name="legal" options={{ title: t("legal.legal") }} />
      <Stack.Screen
        name="privacy"
        options={{ title: t("legal.privacy_policy") }}
      />
      <Stack.Screen name="terms" options={{ title: t("legal.terms_of_use") }} />
      <Stack.Screen
        name="safety"
        options={{ title: t("legal.safety_notice") }}
      />
      <Stack.Screen
        name="store-disclosures"
        options={{ title: t("legal.store_disclosure_notes") }}
      />
      <Stack.Screen name="license" options={{ title: t("legal.license") }} />
      <Stack.Screen
        name="acknowledgements"
        options={{
          title: t("legal.acknowledgements"),
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

export default SettingsLayout;
