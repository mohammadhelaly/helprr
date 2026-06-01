import type { ComponentProps, PropsWithChildren } from "react";
import { Pressable, Text, View } from "react-native";

import { Icon, type IconName } from "@/components/icon";
import { useAppTheme } from "@/lib/theme/theme-provider";

type Props = PropsWithChildren<{
  onPress?: () => void;
  variant?: "primary" | "ghost";
  icon?: IconName;
  className?: string;
  contentClassName?: string;
  textClassName?: string;
}> &
  Omit<ComponentProps<typeof Pressable>, "children" | "onPress">;

const Button = (props: Props) => {
  const {
    children,
    onPress,
    variant = "primary",
    icon,
    className = "",
    contentClassName = "",
    textClassName = "",
    ...pressableProps
  } = props;
  const { colors } = useAppTheme();

  const container =
    variant === "primary"
      ? "border-foreground bg-foreground dark:border-foreground-dark dark:bg-foreground-dark"
      : "border-neutral dark:border-neutral-dark bg-background dark:bg-background-dark";
  const text =
    variant === "primary"
      ? "text-background dark:text-background-dark"
      : "text-foreground dark:text-foreground-dark";

  return (
    <Pressable
      className={`min-h-14 items-center justify-center rounded border px-6 ${container} ${className}`}
      onPress={onPress}
      {...pressableProps}
    >
      <View
        className={`flex-row items-center justify-center gap-4 ${contentClassName}`}
      >
        <Text className={`text-base font-bold ${text} ${textClassName}`}>
          {children}
        </Text>
        {icon ? (
          <Icon
            name={icon}
            color={
              variant === "primary" ? colors.background : colors.foreground
            }
          />
        ) : null}
      </View>
    </Pressable>
  );
};

export { Button };
