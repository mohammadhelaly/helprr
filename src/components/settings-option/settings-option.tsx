import { Pressable, Text, View } from "react-native";

import { Icon, type IconName } from "@/components/icon";
import { colors } from "@/constants/theme";

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

  return (
    <Pressable
      className={`w-full bg-white px-4 ${disabled ? "opacity-50" : ""}`}
      disabled={disabled}
      onPress={onPress}
    >
      <View className="w-full border-b border-light-grey py-8">
        <View className="w-full flex-row items-center justify-between gap-4">
          <View className="flex-1 flex-row items-center">
            <Text className="text-start text-lg text-black">{label}</Text>
          </View>
          {trailingIcon ? (
            <Icon
              name={trailingIcon}
              autoMirror={trailingIconAutoMirror}
              color={colors.black}
            />
          ) : trailingText ? (
            <Text className="text-start text-base text-grey">
              {trailingText}
            </Text>
          ) : null}
        </View>
      </View>
    </Pressable>
  );
};

export { SettingsOption };
