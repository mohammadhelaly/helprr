import type { PropsWithChildren } from "react";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";

import { Icon, type IconName } from "@/components/icon";
import { colors, sizes } from "@/constants/theme";

type Props = PropsWithChildren<{
  title?: string;
  text: string;
  icon: IconName;
}>;

const Warning = (props: Props) => {
  const { t } = useTranslation();
  const { title = t("common.nothing_here"), text, icon, children } = props;

  return (
    <View className="flex-1 items-center justify-center px-8">
      <Icon name={icon} size={sizes.icon.xl} color={colors.black} />
      <Text className="mt-4 text-center text-lg font-bold text-black">
        {title}
      </Text>
      <Text className="mt-2 text-center text-sm leading-5 text-grey">
        {text}
      </Text>
      {children ? <View className="m-8 mt-4 w-full">{children}</View> : null}
    </View>
  );
};

export { Warning };
