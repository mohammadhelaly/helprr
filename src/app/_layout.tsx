import "@/global.css";

import { AppI18nProvider } from "@/lib/i18n/i18n-provider";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const TabLayout = () => {
  return (
    <GestureHandlerRootView className="flex-1">
      <AppI18nProvider>
        <StatusBar style="dark" />
        <Stack screenOptions={{ headerShown: false }} />
      </AppI18nProvider>
    </GestureHandlerRootView>
  );
};

export default TabLayout;
