import { Pressable, Text, View } from "react-native";

import { Icon, type IconName } from "@/components/icon";
import { useAppTheme } from "@/lib/theme/theme-provider";

interface Props {
  label: string;
  description?: string;
  disabled?: boolean;
  trailingIcon?: IconName | null;
  trailingIconAutoMirror?: boolean;
  trailingText?: string;
  onPress?: () => void;
}

const SettingsOption = (props: Props) => {
  const {
    label,
    disabled = false,
    trailingIcon,
    trailingIconAutoMirror = false,
    trailingText,
    onPress,
  } = props;
  const { colors } = useAppTheme();

  return (
    <Pressable
      className={`w-full bg-background px-4 dark:bg-background-dark ${disabled ? "opacity-50" : ""}`}
      disabled={disabled}
      onPress={onPress}
    >
      <View className="w-full border-b border-neutral py-8 dark:border-neutral-dark">
        <View className="w-full flex-row items-center justify-between gap-4">
          <View className="flex-1 flex-row items-center">
            <Text className="text-start text-lg text-foreground dark:text-foreground-dark">
              {label}
            </Text>
          </View>
          {trailingIcon ? (
            <Icon
              name={trailingIcon}
              autoMirror={trailingIconAutoMirror}
              color={colors.foreground}
            />
          ) : trailingText ? (
            <Text className="text-start text-base text-muted dark:text-muted-dark">
              {trailingText}
            </Text>
          ) : null}
        </View>
      </View>
    </Pressable>
  );
};

export { SettingsOption };
