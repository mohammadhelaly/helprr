import Ionicons from "@expo/vector-icons/Ionicons";
import type { ComponentProps } from "react";
import { I18nManager } from "react-native";

import { colors, sizes } from "@/constants/theme";

export type IconName = ComponentProps<typeof Ionicons>["name"];

export type IconProps = Omit<ComponentProps<typeof Ionicons>, "name"> & {
  name: IconName;
  autoMirror?: boolean;
  className?: string;
};

const Icon = (props: IconProps) => {
  const {
    autoMirror = false,
    color = colors.black,
    name,
    size = sizes.icon.sm,
    style,
    ...iconProps
  } = props;
  const shouldMirror = autoMirror && I18nManager.isRTL;
  const iconStyle = shouldMirror
    ? [{ transform: [{ scaleX: -1 }] }, style]
    : style;

  return (
    <Ionicons
      color={color}
      name={name}
      size={size}
      style={iconStyle}
      {...iconProps}
    />
  );
};

export { Icon };
