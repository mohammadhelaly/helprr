import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

import { EditableText } from "@/components/editable-text";
import { Icon } from "@/components/icon";
import { sizes } from "@/constants/theme";
import type { Message } from "@/lib/db/schema";
import { useAppTheme } from "@/lib/theme/theme-provider";
import { formatTime } from "@/lib/utils/date-time";

interface Props {
  message: Message;
  isSpeaking: boolean;
  onEdit: (body: string) => void;
  onSpeak: () => void;
}

const bubbleEntering = FadeInDown.duration(200)
  .springify()
  .mass(0.4)
  .damping(20)
  .stiffness(200);

const MessageBubble = (props: Props) => {
  const { message, isSpeaking, onEdit, onSpeak } = props;
  const { colors } = useAppTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [draftBody, setDraftBody] = useState(message.body);

  const isSpeechToText = message.type === "speech-to-text";

  const saveBody = () => {
    const nextBody = draftBody.trim();

    if (nextBody.length !== 0 && nextBody !== message.body) {
      setDraftBody(nextBody);
      onEdit(nextBody);
    } else {
      setDraftBody(message.body);
    }

    setIsEditing(false);
  };

  const startEditing = () => {
    setDraftBody(message.body);
    setIsEditing(true);
  };
  const textClassName = `font-bold ${
    isSpeechToText
      ? "text-2xl text-highlight dark:text-highlight-dark"
      : "text-lg text-foreground dark:text-foreground-dark"
  } ${message.direction === "rtl" ? "text-end" : "text-start"}`;

  return (
    <Animated.View
      entering={bubbleEntering}
      className={`my-2 px-4 ${isSpeechToText ? "items-start" : "items-end"}`}
    >
      <View
        className={`relative flex w-3/5 flex-col gap-4 rounded-2xl bg-background p-4 dark:bg-background-dark ${
          isSpeechToText ? "self-start" : "self-end"
        }`}
      >
        <View
          className={`absolute bottom-6 h-4 w-4 rotate-45 bg-background dark:bg-background-dark ${
            isSpeechToText ? "-left-2" : "-right-2"
          }`}
        />
        <EditableText
          className={textClassName}
          editClassName={`py-auto p-0 ${textClassName}`}
          inputProps={{ multiline: true }}
          isEditing={isEditing}
          onChangeText={setDraftBody}
          onSave={saveBody}
          text={message.body}
          value={draftBody}
        />
        <View className="flex flex-row items-end justify-end gap-2">
          <Pressable
            className="flex h-5 w-5 items-center justify-center"
            onPress={isSpeechToText ? startEditing : onSpeak}
          >
            <Icon
              name={
                isSpeechToText
                  ? "create-outline"
                  : isSpeaking
                    ? "volume-high-outline"
                    : "play-outline"
              }
              size={sizes.icon.xs}
              color={colors.muted}
            />
          </Pressable>
          <Text className="text-xs text-muted dark:text-muted-dark">
            {formatTime(message.createdAt)}
          </Text>
        </View>
      </View>
    </Animated.View>
  );
};

export { MessageBubble };
