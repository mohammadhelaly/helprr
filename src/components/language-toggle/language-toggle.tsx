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
      className="flex h-10 min-w-10 flex-shrink-0 items-center justify-center rounded-full bg-neutral dark:bg-neutral-dark"
      onPress={onToggle}
    >
      <Text className="text-sm font-bold text-foreground dark:text-foreground-dark">
        {language.toUpperCase()}
      </Text>
    </Pressable>
  );
};

export { LanguageToggle };
