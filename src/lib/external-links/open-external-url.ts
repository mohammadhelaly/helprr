import { Alert, Linking } from "react-native";

import { i18n } from "@/lib/i18n/i18n";

const openExternalUrl = async (url: string) => {
  try {
    await Linking.openURL(url);
  } catch {
    Alert.alert(
      i18n.t("alerts.link_error_title"),
      i18n.t("alerts.link_error_text"),
    );
  }
};

export { openExternalUrl };
