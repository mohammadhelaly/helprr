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
import { sizes, colors as themeColors } from "@/constants/theme";
import { useNavigationChrome } from "@/hooks/use-navigation-chrome";
import { useAppTheme } from "@/lib/theme/theme-provider";

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
const recordBottomOffset = sizes.spacing["3xl"];
const recordTopGap = sizes.spacing.md;

const recordPulse: CSSAnimationKeyframes = {
  from: {
    backgroundColor: themeColors["hot-pink"],
    transform: [{ scale: 1 }],
  },
  to: {
    backgroundColor: themeColors.bubblegum,
    transform: [{ scale: 1.1 }],
  },
};

const recordHazePulse: CSSAnimationKeyframes = {
  from: {
    backgroundColor: themeColors["hot-pink"],
    opacity: 0.2,
    transform: [{ scale: 0.8 }],
  },
  to: {
    backgroundColor: themeColors["cotton-candy"],
    opacity: 0.4,
    transform: [{ scale: 1 }],
  },
};

const statusEntering = FadeIn.duration(200);
const statusExiting = FadeOut.duration(200);

const VoiceRecordButton = (props: Props) => {
  const { isListening, errorMessage, partialTranscript, onStart, onStop } =
    props;
  const { colors } = useAppTheme();
  const { height: screenHeight, width: screenWidth } = useWindowDimensions();
  const { verticalChromeHeight } = useNavigationChrome();

  const statusText = errorMessage ?? partialTranscript;
  const recordButtonClassName = isListening
    ? "bg-hot-pink"
    : errorMessage
      ? "bg-error"
      : "bg-foreground dark:bg-foreground-dark";
  const recordIconColor =
    isListening || errorMessage ? colors.accent : colors.background;

  const buttonSize = isListening ? sizes.spacing["5xl"] : sizes.spacing["2xl"];
  const iconSize = isListening ? sizes.icon.xl : sizes.icon.md;
  const pulseStyle = {
    animationDelay: isListening ? recordTransitionDuration : 0,
    animationDirection: "alternate" as const,
    animationDuration: recordPulseDuration,
    animationIterationCount: isListening ? ("infinite" as const) : 0,
    animationTimingFunction: "ease-in-out" as const,
  };
  const statusGap = isListening ? sizes.spacing.lg : sizes.spacing.xs;

  const controlHeight = sizes.spacing.xl + statusGap + buttonSize;
  const controlWidth = Math.max(buttonSize, sizes.spacing["6xl"]);
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
        style={{ height: sizes.spacing.xl }}
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
              height: sizes.spacing["6xl"],
              opacity: isListening ? 1 : 0,
              transitionDuration: recordHazeTransitionDuration,
              transitionProperty: ["opacity"],
              transitionTimingFunction: "ease-out",
              width: sizes.spacing["6xl"],
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
            className={`flex items-center justify-center rounded-full ${recordButtonClassName}`}
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
            <Icon name="mic-sharp" size={iconSize} color={recordIconColor} />
          </Animated.View>
        </Animated.View>
      </GestureDetector>
    </Animated.View>
  );
};

export { VoiceRecordButton };
