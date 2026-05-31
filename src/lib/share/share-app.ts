import { Alert, Share } from "react-native";

import { appUrls } from "@/constants/urls";
import { i18n } from "@/lib/i18n/i18n";

const shareApp = async () => {
  try {
    const result = await Share.share(
      {
        message: i18n.t("alerts.share_message"),
        url: appUrls.repository,
        title: i18n.t("common.app_name"),
      },
      {
        dialogTitle: i18n.t("alerts.share_title"),
        subject: i18n.t("alerts.share_message"),
      },
    );

    if (result.action === Share.sharedAction && result.activityType) {
      Alert.alert(i18n.t("common.success"), i18n.t("alerts.share_success"));
    }
  } catch {
    Alert.alert(
      i18n.t("common.something_went_wrong"),
      i18n.t("alerts.share_error"),
    );
  }
};

export { shareApp };
