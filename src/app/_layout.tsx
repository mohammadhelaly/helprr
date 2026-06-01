import "@/global.css";

import { AppI18nProvider } from "@/lib/i18n/i18n-provider";
import { AppThemeProvider } from "@/lib/theme/theme-provider";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const TabLayout = () => {
  return (
    <GestureHandlerRootView className="flex-1">
      <AppThemeProvider>
        <AppI18nProvider>
          <StatusBar style="auto" />
          <Stack screenOptions={{ headerShown: false }} />
        </AppI18nProvider>
      </AppThemeProvider>
    </GestureHandlerRootView>
  );
};

export default TabLayout;
