import { Text, useWindowDimensions, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  FadeIn,
  FadeOut,
  useAnimatedStyle,
  useSharedValue,
  type CSSAnimationKeyframes,
} from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";

import { Icon } from "@/components/icon";
import { colors, sizes } from "@/constants/theme";
import { useNavigationChrome } from "@/hooks/use-navigation-chrome";

interface Props {
  isListening: boolean;
  errorMessage: string | null;
  partialTranscript: string;
  onStart: () => void;
  onStop: () => void;
}

const recordTransitionDuration = 200;
const recordHazeTransitionDuration = 400;
const recordPulseDuration = 600;

const recordGestureHitSlop = sizes.spacing.sm;
const recordGestureMinDistance = sizes.spacing.xs;

const recordHoldDuration = 100;
const recordBottomOffset = sizes.spacing.xxxl;
const recordTopGap = sizes.spacing.md;

const recordPulse: CSSAnimationKeyframes = {
  from: { backgroundColor: colors.pink, transform: [{ scale: 1 }] },
  to: { backgroundColor: colors["pink-light"], transform: [{ scale: 1.1 }] },
};

const recordHazePulse: CSSAnimationKeyframes = {
  from: {
    backgroundColor: colors.pink,
    opacity: 0.2,
    transform: [{ scale: 0.8 }],
  },
  to: {
    backgroundColor: colors["pink-haze"],
    opacity: 0.4,
    transform: [{ scale: 1 }],
  },
};

const statusEntering = FadeIn.duration(200);
const statusExiting = FadeOut.duration(200);

const VoiceRecordButton = (props: Props) => {
  const { isListening, errorMessage, partialTranscript, onStart, onStop } =
    props;
  const { height: screenHeight, width: screenWidth } = useWindowDimensions();
  const { verticalChromeHeight } = useNavigationChrome();

  const statusText = errorMessage ?? partialTranscript;

  const buttonSize = isListening ? sizes.sizing.xl : sizes.sizing.md;
  const iconSize = isListening ? sizes.icon.xl : sizes.icon.md;
  const pulseStyle = {
    animationDelay: isListening ? recordTransitionDuration : 0,
    animationDirection: "alternate" as const,
    animationDuration: recordPulseDuration,
    animationIterationCount: isListening ? ("infinite" as const) : 0,
    animationTimingFunction: "ease-in-out" as const,
  };
  const statusGap = isListening ? sizes.spacing.lg : sizes.spacing.xs;

  const controlHeight = sizes.sizing.sm + statusGap + buttonSize;
  const controlWidth = Math.max(buttonSize, sizes.sizing.xxl);
  const horizontalLimit = (screenWidth - controlWidth) / 2;
  const minX = -horizontalLimit;
  const maxX = horizontalLimit;
  const minY = -Math.max(
    0,
    screenHeight -
      verticalChromeHeight -
      recordBottomOffset -
      recordTopGap -
      controlHeight,
  );
  const maxY = 0;
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const dragStartX = useSharedValue(0);
  const dragStartY = useSharedValue(0);

  const dragGesture = Gesture.Pan()
    .minDistance(recordGestureMinDistance)
    .hitSlop(recordGestureHitSlop)
    .onBegin(() => {
      dragStartX.value = translateX.value;
      dragStartY.value = translateY.value;
    })
    .onUpdate((event) => {
      translateX.value = Math.min(
        Math.max(dragStartX.value + event.translationX, minX),
        maxX,
      );
      translateY.value = Math.min(
        Math.max(dragStartY.value + event.translationY, minY),
        maxY,
      );
    });

  const recordGesture = Gesture.LongPress()
    .minDuration(recordHoldDuration)
    .maxDistance(recordGestureMinDistance)
    .hitSlop(recordGestureHitSlop)
    .onStart(() => {
      scheduleOnRN(onStart);
    })
    .onEnd((_event, success) => {
      if (success) {
        scheduleOnRN(onStop);
      }
    });

  const recordAndDragGesture = Gesture.Simultaneous(dragGesture, recordGesture);

  const dragStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
    ],
  }));

  return (
    <Animated.View
      className="absolute end-0 start-0 z-10 flex flex-col items-center justify-center"
      pointerEvents="box-none"
      style={[
        {
          bottom: recordBottomOffset,
          gap: statusGap,
        },
        dragStyle,
      ]}
    >
      <View
        className="items-center justify-center"
        style={{ height: sizes.sizing.sm }}
      >
        {statusText ? (
          <Animated.View
            className="max-w-72 rounded-full bg-black/60 px-4 py-2"
            entering={statusEntering}
            exiting={statusExiting}
          >
            <Text className="text-center text-xs text-white" numberOfLines={2}>
              {statusText}
            </Text>
          </Animated.View>
        ) : null}
      </View>
      <GestureDetector gesture={recordAndDragGesture}>
        <Animated.View
          className="items-center justify-center"
          style={{
            height: buttonSize,
            transitionDuration: recordTransitionDuration,
            transitionProperty: ["height", "width"],
            transitionTimingFunction: "ease-out",
            width: buttonSize,
          }}
        >
          <Animated.View
            className="absolute items-center justify-center"
            style={{
              height: sizes.sizing.xxl,
              opacity: isListening ? 1 : 0,
              transitionDuration: recordHazeTransitionDuration,
              transitionProperty: ["opacity"],
              transitionTimingFunction: "ease-out",
              width: sizes.sizing.xxl,
            }}
          >
            <Animated.View
              className="h-full w-full rounded-full"
              style={{
                ...pulseStyle,
                animationName: isListening ? recordHazePulse : "none",
              }}
            />
          </Animated.View>
          <Animated.View
            className={`flex items-center justify-center rounded-full ${
              isListening ? "bg-pink" : errorMessage ? "bg-red-600" : "bg-black"
            }`}
            style={{
              ...pulseStyle,
              animationName: isListening ? recordPulse : "none",
              height: buttonSize,
              transitionDuration: recordTransitionDuration,
              transitionProperty: ["height", "width"],
              transitionTimingFunction: "ease-out",
              width: buttonSize,
            }}
          >
            <Icon name="mic-sharp" size={iconSize} color={colors.white} />
          </Animated.View>
        </Animated.View>
      </GestureDetector>
    </Animated.View>
  );
};

export { VoiceRecordButton };
