import { Alert, Linking } from "react-native";
import * as StoreReview from "expo-store-review";

import { i18n } from "@/lib/i18n/i18n";

const requestAppReview = async () => {
  try {
    if (await StoreReview.isAvailableAsync()) {
      await StoreReview.requestReview();
      return;
    }

    const storeUrl = StoreReview.storeUrl();
    if (storeUrl) {
      await Linking.openURL(storeUrl);
      return;
    }

    Alert.alert(
      i18n.t("alerts.review_unavailable_title"),
      i18n.t("alerts.review_unavailable_text"),
    );
  } catch {
    Alert.alert(
      i18n.t("common.something_went_wrong"),
      i18n.t("alerts.review_error"),
    );
  }
};

export { requestAppReview };
