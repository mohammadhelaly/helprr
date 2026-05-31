import { useState } from "react";
import { Alert, Platform, Pressable, Text, View } from "react-native";
import { useTranslation } from "react-i18next";

import { EditableText } from "@/components/editable-text";
import { Icon } from "@/components/icon";
import { colors, sizes } from "@/constants/theme";
import type { Conversation } from "@/lib/db/schema";
import { formatDate } from "@/lib/utils/date-time";

type Props = {
  conversation: Conversation;
  onDelete: (conversationId: string) => void;
  onRename: (conversationId: string, title: string) => void;
  onSelect: (conversationId: string) => void;
};

const ConversationListItem = (props: Props) => {
  const { t } = useTranslation();
  const { conversation, onDelete, onRename, onSelect } = props;
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(conversation.title);

  const preview = conversation.lastMessagePreview
    ? conversation.lastMessagePreview.length > 48
      ? `${conversation.lastMessagePreview.substring(0, 48)}...`
      : conversation.lastMessagePreview
    : "";

  const saveTitle = () => {
    const nextTitle = title.trim();

    if (nextTitle.length !== 0 && nextTitle !== conversation.title) {
      setTitle(nextTitle);
      onRename(conversation.id, nextTitle);
    } else {
      setTitle(conversation.title);
    }

    setIsEditing(false);
  };

  const confirmDelete = () => {
    Alert.alert(
      t("listen.delete_conversation_title"),
      t("listen.delete_conversation_text"),
      [
        { text: t("listen.cancel"), style: "cancel" },
        {
          text: t("listen.delete"),
          style: "destructive",
          onPress: () => onDelete(conversation.id),
        },
      ],
    );
  };

  return (
    <Pressable
      className="w-full bg-white px-4 pt-5"
      onPress={() => onSelect(conversation.id)}
    >
      <View className="w-full border-b border-light-grey pb-5">
        <View className="w-full flex-row items-center justify-between">
          <View className="flex-1 flex-row items-center">
            <EditableText
              className="text-lg font-bold text-black"
              editClassName={`min-w-1 flex-1 p-0 text-lg font-bold text-black ${Platform.OS === "ios" ? "-mt-3 h-10" : ""}`}
              inputProps={{ maxLength: 32 }}
              isEditing={isEditing}
              onChangeText={setTitle}
              onSave={saveTitle}
              text={title}
              textProps={{ numberOfLines: 1 }}
              value={title}
            />
            {isEditing ? null : (
              <Pressable
                className="h-8 w-8 items-center justify-center"
                onPress={(event) => {
                  event.stopPropagation();
                  setIsEditing(true);
                }}
              >
                <Icon
                  name="create-outline"
                  color={colors.grey}
                  size={sizes.icon.xxs}
                />
              </Pressable>
            )}
          </View>
          <Pressable
            className="h-8 w-8 items-center justify-center"
            onPress={(event) => {
              event.stopPropagation();
              confirmDelete();
            }}
          >
            <Icon
              name="trash-outline"
              color={colors.grey}
              size={sizes.icon.xxs}
            />
          </Pressable>
        </View>
        <Text className="self-start text-xs text-grey">
          {formatDate(conversation.updatedAt)}
        </Text>
        <Text className="mt-2.5 self-start text-base text-black">
          {preview}
        </Text>
      </View>
    </Pressable>
  );
};

export { ConversationListItem };
