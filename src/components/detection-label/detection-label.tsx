import { ActivityIndicator, Text, View } from "react-native";

import { useAppTheme } from "@/lib/theme/theme-provider";

interface Props {
  label?: string;
}

const DetectionLabel = (props: Props) => {
  const { label } = props;
  const { colors } = useAppTheme();

  return (
    <View className="absolute z-10 mt-24 min-h-14 min-w-44 items-center justify-center self-center rounded-lg bg-background p-4 dark:bg-background-dark">
      {label ? (
        <Text className="text-lg font-bold text-foreground dark:text-foreground-dark">
          {label}
        </Text>
      ) : (
        <ActivityIndicator color={colors.foreground} />
      )}
    </View>
  );
};

export { DetectionLabel };
