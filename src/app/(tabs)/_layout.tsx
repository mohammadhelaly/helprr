import { Tabs } from "expo-router";
import { useTranslation } from "react-i18next";

import { Icon } from "@/components/icon";
import { colors, sizes } from "@/constants/theme";

const TabsLayout = () => {
  const { t } = useTranslation();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.black,
        tabBarInactiveTintColor: colors.grey,
        tabBarStyle: {
          height: sizes.sizing.lg,
          paddingTop: sizes.spacing.sm,
          paddingBottom: sizes.spacing.md,
          borderTopWidth: sizes.sizing.none,
          elevation: sizes.sizing.none,
          backgroundColor: colors.white,
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
              color={focused ? colors.black : colors.grey}
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
              color={focused ? colors.black : colors.grey}
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
              color={focused ? colors.black : colors.grey}
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
              color={focused ? colors.black : colors.grey}
            />
          ),
        }}
      />
    </Tabs>
  );
};

export default TabsLayout;
