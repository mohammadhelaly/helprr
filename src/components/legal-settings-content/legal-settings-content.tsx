import { SettingsOption } from "@/components/settings-option";
import { useAppI18n } from "@/lib/i18n/i18n-provider";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import { Alert, ScrollView } from "react-native";

type Route = Parameters<typeof router.push>[0];

const LegalSettingsContent = () => {
  const { t } = useTranslation();
  const { appLanguage } = useAppI18n();

  const navigateToLegalChild = (route: Route) => {
    if (appLanguage === "en") {
      router.push(route);
      return;
    }

    Alert.alert(
      t("alerts.legal_english_only_title"),
      t("alerts.legal_english_only_text"),
      [{ text: t("common.continue"), onPress: () => router.push(route) }],
    );
  };

  return (
    <ScrollView
      className="flex-1"
      contentContainerClassName="grow items-center justify-center"
    >
      <SettingsOption
        label={t("legal.privacy_policy")}
        trailingIcon="chevron-forward-sharp"
        trailingIconAutoMirror
        onPress={() => navigateToLegalChild("/settings/privacy")}
      />
      <SettingsOption
        label={t("legal.terms_of_use")}
        trailingIcon="chevron-forward-sharp"
        trailingIconAutoMirror
        onPress={() => navigateToLegalChild("/settings/terms")}
      />
      <SettingsOption
        label={t("legal.safety_notice")}
        trailingIcon="chevron-forward-sharp"
        trailingIconAutoMirror
        onPress={() => navigateToLegalChild("/settings/safety")}
      />
      <SettingsOption
        label={t("legal.license")}
        trailingIcon="chevron-forward-sharp"
        trailingIconAutoMirror
        onPress={() => navigateToLegalChild("/settings/license")}
      />
      <SettingsOption
        label={t("legal.acknowledgements")}
        trailingIcon="chevron-forward-sharp"
        trailingIconAutoMirror
        onPress={() => navigateToLegalChild("/settings/acknowledgements")}
      />
      <SettingsOption
        label={t("legal.store_disclosure_notes")}
        trailingIcon="chevron-forward-sharp"
        trailingIconAutoMirror
        onPress={() => navigateToLegalChild("/settings/store-disclosures")}
      />
    </ScrollView>
  );
};

export { LegalSettingsContent };
