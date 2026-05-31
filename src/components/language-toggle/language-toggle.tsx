import { Pressable, Text } from "react-native";

import type { LanguageCode } from "@/lib/i18n/i18n";

interface Props {
  language: LanguageCode;
  onToggle: () => void;
}

const LanguageToggle = (props: Props) => {
  const { language, onToggle } = props;

  return (
    <Pressable
      className="flex h-10 min-w-10 flex-shrink-0 items-center justify-center rounded-full bg-light-grey"
      onPress={onToggle}
    >
      <Text className="text-sm font-bold text-black">
        {language.toUpperCase()}
      </Text>
    </Pressable>
  );
};

export { LanguageToggle };
