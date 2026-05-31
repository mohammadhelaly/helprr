import { SettingsOption } from "@/components/settings-option";
import { i18n } from "@/lib/i18n/i18n";

type Props = {
  hasPermission: boolean;
  onPress: () => void;
};

const SpeechRecognitionPermissionOption = (props: Props) => {
  const { hasPermission, onPress } = props;

  return (
    <SettingsOption
      label={i18n.t("settings.speech_recognition")}
      trailingIcon={hasPermission ? "checkmark-sharp" : "chevron-forward-sharp"}
      trailingIconAutoMirror={!hasPermission}
      onPress={onPress}
    />
  );
};

export { SpeechRecognitionPermissionOption };
