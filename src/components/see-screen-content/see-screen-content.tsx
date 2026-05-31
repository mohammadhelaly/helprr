import { useIsFocused } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { View } from "react-native";
import { useTranslation } from "react-i18next";
import {
  initExecutorch,
  isAvailable as isExecutorchAvailable,
  SSDLITE_320_MOBILENET_V3_LARGE,
  useObjectDetection,
  type Detection,
} from "react-native-executorch";
import { ExpoResourceFetcher } from "react-native-executorch-expo-resource-fetcher";
import {
  CommonResolutions,
  useCameraDevice,
  useCameraPermission,
  useFrameOutput,
  type Frame,
} from "react-native-vision-camera";
import { createSynchronizable, scheduleOnRN } from "react-native-worklets";

import { Button } from "@/components/button";
import { DetectionLabel } from "@/components/detection-label";
import { SeeCameraView } from "@/components/see-camera-view";
import { Warning } from "@/components/warning";
import { useSpeechSynthesis } from "@/hooks/use-speech-synthesis";
import { useAppI18n } from "@/lib/i18n/i18n-provider";
import { openAppSettings } from "@/lib/permissions/app-permissions";

const MIN_SCORE = 0.75;
const OBJECT_DETECTION_INTERVAL_SECONDS = 1;
const OBJECT_DETECTION_INTERVAL_MS = OBJECT_DETECTION_INTERVAL_SECONDS * 1000;

initExecutorch({
  resourceFetcher: ExpoResourceFetcher,
});

const toObjectLabelKey = (value: string) =>
  value.toLowerCase().replaceAll(" ", "_");

const toDisplayLabel = (value: string) =>
  toObjectLabelKey(value)
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

const SeeScreenContent = () => {
  const { t } = useTranslation();
  const { appLanguage } = useAppI18n();
  const isFocused = useIsFocused();
  const device = useCameraDevice("back");
  const { canRequestPermission, hasPermission, requestPermission } =
    useCameraPermission();
  const { speak, stop } = useSpeechSynthesis();
  const lastObjectDetectionTime = useMemo(() => createSynchronizable(0), []);
  const objectDetection = useObjectDetection({
    model: SSDLITE_320_MOBILENET_V3_LARGE,
    preventLoad: !isExecutorchAvailable,
  });
  const runObjectDetection = objectDetection.runOnFrame;
  const isObjectDetectionReady =
    objectDetection.isReady && !!runObjectDetection;

  const [labelKey, setLabelKey] = useState<string>();
  const [cameraReady, setCameraReady] = useState(false);
  const label = labelKey
    ? t(`objects.${labelKey}`, { defaultValue: toDisplayLabel(labelKey) })
    : undefined;

  const handleCameraPermission = useCallback(async () => {
    if (canRequestPermission) {
      await requestPermission();
      return;
    }

    await openAppSettings();
  }, [canRequestPermission, requestPermission]);

  useEffect(() => {
    if (isFocused && !hasPermission && canRequestPermission) {
      void requestPermission();
    }
  }, [canRequestPermission, hasPermission, isFocused, requestPermission]);

  useEffect(() => {
    if (!isFocused) {
      void stop();
    }
  }, [isFocused, stop]);

  useEffect(() => {
    if (!isFocused) {
      return;
    }

    if (
      !cameraReady ||
      !hasPermission ||
      !isExecutorchAvailable ||
      !isObjectDetectionReady ||
      objectDetection.error ||
      !device
    ) {
      return;
    }

    void speak(label ?? t("see.loading"), appLanguage);
  }, [
    appLanguage,
    cameraReady,
    device,
    hasPermission,
    isFocused,
    isObjectDetectionReady,
    label,
    objectDetection.error,
    speak,
    t,
  ]);

  const updateDetections = useCallback(
    (detections: Detection[]) => {
      const prediction = detections[0];

      if (!prediction) {
        return;
      }

      const nextLabelKey = toObjectLabelKey(String(prediction.label));
      setLabelKey((currentLabelKey) =>
        currentLabelKey === nextLabelKey ? currentLabelKey : nextLabelKey,
      );
    },
    [setLabelKey],
  );

  const frameOutput = useFrameOutput({
    targetResolution: CommonResolutions.VGA_4_3,
    pixelFormat: "rgb",
    dropFramesWhileBusy: true,
    enablePreviewSizedOutputBuffers: true,
    onFrame: useCallback(
      (frame: Frame) => {
        "worklet";

        try {
          if (!isObjectDetectionReady) {
            return;
          }

          const now = performance.now();
          const lastDetectionTime = lastObjectDetectionTime.getDirty();

          if (now - lastDetectionTime < OBJECT_DETECTION_INTERVAL_MS) {
            return;
          }

          lastObjectDetectionTime.setBlocking(now);

          const detections = runObjectDetection(frame, false, {
            detectionThreshold: MIN_SCORE,
          });

          if (detections.length > 0) {
            scheduleOnRN(updateDetections, detections);
          }
        } catch (error) {
          const message =
            error instanceof Error ? error.message : String(error);

          if (!message.includes("Failed to lock AHardwareBuffer")) {
            console.error("Object detection frame error:", error);
          }
        } finally {
          frame.dispose();
        }
      },
      [
        isObjectDetectionReady,
        lastObjectDetectionTime,
        runObjectDetection,
        updateDetections,
      ],
    ),
  });

  if (!isFocused) {
    return null;
  }

  if (!hasPermission) {
    return (
      <View className="flex-1 bg-light-grey">
        <Warning
          icon="camera-outline"
          title={t("see.permission_title")}
          text={t("see.permission_text")}
        >
          <Button onPress={handleCameraPermission}>
            {canRequestPermission
              ? t("see.grant_camera_access")
              : t("common.open_settings")}
          </Button>
        </Warning>
      </View>
    );
  }

  if (!isExecutorchAvailable) {
    return (
      <View className="flex-1 bg-light-grey">
        <Warning
          icon="alert-circle-outline"
          title={t("see.unavailable_title")}
          text={t("see.unavailable_runtime")}
        />
      </View>
    );
  }

  if (objectDetection.error) {
    return (
      <View className="flex-1 bg-light-grey">
        <Warning
          icon="alert-circle-outline"
          title={t("see.unavailable_title")}
          text={t("see.unavailable_model")}
        />
      </View>
    );
  }

  if (!device) {
    return (
      <View className="flex-1 bg-light-grey">
        <Warning
          icon="camera-outline"
          title={t("see.camera_unavailable_title")}
          text={t("see.camera_unavailable_text")}
        />
      </View>
    );
  }

  return (
    <View className="flex-1">
      <SeeCameraView
        device={device}
        frameOutput={frameOutput}
        isActive={isFocused && hasPermission && isObjectDetectionReady}
        onStarted={() => {
          setLabelKey(undefined);
          setCameraReady(true);
        }}
        onStopped={() => {
          setLabelKey(undefined);
          setCameraReady(false);
        }}
      />
      <DetectionLabel label={label} />
    </View>
  );
};

export { SeeScreenContent };
