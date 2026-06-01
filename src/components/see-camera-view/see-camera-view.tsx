import { cssInterop } from "nativewind";
import {
  Camera,
  type CameraDevice,
  type CameraFrameOutput,
} from "react-native-vision-camera";

const StyledCamera = cssInterop(Camera, {
  className: "style",
});

interface Props {
  device: CameraDevice;
  frameOutput: CameraFrameOutput;
  isActive: boolean;
  onStarted: () => void;
  onStopped: () => void;
}

const SeeCameraView = (props: Props) => {
  const { device, frameOutput, isActive, onStarted, onStopped } = props;

  return (
    <StyledCamera
      className="h-full w-full flex-1 bg-neutral dark:bg-neutral-dark"
      device={device}
      isActive={isActive}
      outputs={[frameOutput]}
      resizeMode="cover"
      orientationSource="device"
      onStarted={onStarted}
      onStopped={onStopped}
      onError={(error) => {
        console.error("VisionCamera error:", error);
      }}
    />
  );
};

export { SeeCameraView };
