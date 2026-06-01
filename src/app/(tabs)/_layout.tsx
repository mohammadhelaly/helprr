import { Tabs } from "expo-router";
import { useTranslation } from "react-i18next";

import { Icon } from "@/components/icon";
import { sizes } from "@/constants/theme";
import { useAppTheme } from "@/lib/theme/theme-provider";

const TabsLayout = () => {
  const { t } = useTranslation();
  const { colors } = useAppTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.foreground,
        tabBarInactiveTintColor: colors.muted,
        tabBarStyle: {
          height: sizes.spacing["4xl"],
          paddingTop: sizes.spacing.sm,
          paddingBottom: sizes.spacing.md,
          borderTopWidth: sizes.spacing.none,
          elevation: sizes.spacing.none,
          backgroundColor: colors.background,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t("navigation.home"),
          tabBarIcon: ({ focused }) => (
            <Icon
              name="home-sharp"
              size={sizes.icon.sm}
              color={focused ? colors.foreground : colors.muted}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="listen"
        options={{
          title: t("navigation.listen"),
          tabBarIcon: ({ focused }) => (
            <Icon
              name="ear-sharp"
              size={sizes.icon.sm}
              color={focused ? colors.foreground : colors.muted}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="see"
        options={{
          title: t("navigation.see"),
          tabBarIcon: ({ focused }) => (
            <Icon
              name="eye-sharp"
              size={sizes.icon.sm}
              color={focused ? colors.foreground : colors.muted}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: t("navigation.settings"),
          tabBarIcon: ({ focused }) => (
            <Icon
              name="settings-sharp"
              size={sizes.icon.sm}
              color={focused ? colors.foreground : colors.muted}
            />
          ),
        }}
      />
    </Tabs>
  );
};

export default TabsLayout;
