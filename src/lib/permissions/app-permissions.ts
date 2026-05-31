import { Alert, Linking } from "react-native";
import { ExpoSpeechRecognitionModule } from "expo-speech-recognition";
import {
  VisionCamera,
  type PermissionStatus,
} from "react-native-vision-camera";

import { i18n } from "@/lib/i18n/i18n";

const toPermissionResponse = (status: PermissionStatus) => ({
  canAskAgain: status === "not-determined",
  granted: status === "authorized",
});

const getCameraPermission = async () => {
  try {
    return toPermissionResponse(VisionCamera.cameraPermissionStatus);
  } catch {
    Alert.alert(
      i18n.t("alerts.camera_permission_title"),
      i18n.t("alerts.camera_permission_text"),
    );
    return null;
  }
};

const requestCameraPermission = async () => {
  const granted = await VisionCamera.requestCameraPermission();

  return toPermissionResponse(granted ? "authorized" : "denied");
};

const getMicrophonePermission = async () => {
  try {
    return await ExpoSpeechRecognitionModule.getMicrophonePermissionsAsync();
  } catch {
    Alert.alert(
      i18n.t("alerts.microphone_permission_title"),
      i18n.t("alerts.microphone_permission_text"),
    );
    return null;
  }
};

const requestMicrophonePermission = async () => {
  return ExpoSpeechRecognitionModule.requestMicrophonePermissionsAsync();
};

const getSpeechPermission = async () => {
  try {
    return await ExpoSpeechRecognitionModule.getPermissionsAsync();
  } catch {
    Alert.alert(
      i18n.t("alerts.speech_permission_title"),
      i18n.t("alerts.speech_permission_text"),
    );
    return null;
  }
};

const requestSpeechPermission = async () => {
  return ExpoSpeechRecognitionModule.requestPermissionsAsync();
};

const getSpeechRecognitionPermission = async () => {
  try {
    return await ExpoSpeechRecognitionModule.getSpeechRecognizerPermissionsAsync();
  } catch {
    return null;
  }
};

const requestSpeechRecognitionPermission = async () => {
  return ExpoSpeechRecognitionModule.requestSpeechRecognizerPermissionsAsync();
};

const openAppSettings = async () => {
  await Linking.openSettings();
};

export {
  getCameraPermission,
  getMicrophonePermission,
  getSpeechPermission,
  getSpeechRecognitionPermission,
  openAppSettings,
  requestCameraPermission,
  requestMicrophonePermission,
  requestSpeechPermission,
  requestSpeechRecognitionPermission,
};
