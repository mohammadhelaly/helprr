import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";

import { SettingsOption } from "@/components/settings-option";
import { SpeechRecognitionPermissionOption } from "@/components/speech-recognition-permission-option";
import {
  getCameraPermission,
  getMicrophonePermission,
  getSpeechRecognitionPermission,
  openAppSettings,
  requestCameraPermission,
  requestMicrophonePermission,
  requestSpeechRecognitionPermission,
} from "@/lib/permissions/app-permissions";

const PermissionsSettingsContent = () => {
  const { t } = useTranslation();
  const [hasCameraPermission, setHasCameraPermission] = useState(false);
  const [canAskAgainForCameraPermission, setCanAskAgainForCameraPermission] =
    useState(false);
  const [hasMicrophonePermission, setHasMicrophonePermission] = useState(false);
  const [
    canAskAgainForMicrophonePermission,
    setCanAskAgainForMicrophonePermission,
  ] = useState(false);
  const [hasSpeechRecognitionPermission, setHasSpeechRecognitionPermission] =
    useState(false);

  const refreshPermissions = async () => {
    const cameraPermission = await getCameraPermission();
    if (cameraPermission) {
      setHasCameraPermission(cameraPermission.granted);
      setCanAskAgainForCameraPermission(cameraPermission.canAskAgain);
    }

    const microphonePermission = await getMicrophonePermission();
    if (microphonePermission) {
      setHasMicrophonePermission(microphonePermission.granted);
      setCanAskAgainForMicrophonePermission(microphonePermission.canAskAgain);
    }

    const speechRecognitionPermission = await getSpeechRecognitionPermission();
    setHasSpeechRecognitionPermission(
      speechRecognitionPermission?.granted ?? false,
    );
  };

  const handleCameraPermissions = async () => {
    if (hasCameraPermission || !canAskAgainForCameraPermission) {
      await openAppSettings();
      return;
    }

    const permission = await requestCameraPermission();
    setHasCameraPermission(permission.granted);
    setCanAskAgainForCameraPermission(permission.canAskAgain);
  };

  const handleMicrophonePermissions = async () => {
    if (hasMicrophonePermission || !canAskAgainForMicrophonePermission) {
      await openAppSettings();
      return;
    }

    const permission = await requestMicrophonePermission();
    setHasMicrophonePermission(permission.granted);
    setCanAskAgainForMicrophonePermission(permission.canAskAgain);
  };

  const handleSpeechRecognitionPermissions = async () => {
    if (hasSpeechRecognitionPermission) {
      await openAppSettings();
      return;
    }

    const permission = await requestSpeechRecognitionPermission();
    setHasSpeechRecognitionPermission(permission.granted);
  };

  useEffect(() => {
    void Promise.resolve().then(refreshPermissions);
  }, []);

  return (
    <View className="flex-1 justify-center">
      <Text className="self-start px-4 text-start text-base text-muted dark:text-muted-dark">
        {t("settings.permissions_intro")}
      </Text>
      <SettingsOption
        label={t("settings.camera")}
        trailingIcon={hasCameraPermission ? "checkmark-sharp" : null}
        onPress={handleCameraPermissions}
      />
      <SettingsOption
        label={t("settings.microphone")}
        trailingIcon={hasMicrophonePermission ? "checkmark-sharp" : null}
        onPress={handleMicrophonePermissions}
      />
      <SpeechRecognitionPermissionOption
        hasPermission={hasSpeechRecognitionPermission}
        onPress={handleSpeechRecognitionPermissions}
      />
    </View>
  );
};

export { PermissionsSettingsContent };
