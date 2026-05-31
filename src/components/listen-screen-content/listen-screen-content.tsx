import { router } from "expo-router";
import { Trans, useTranslation } from "react-i18next";
import { Text, View } from "react-native";

import { Button } from "@/components/button";
import { ConversationList } from "@/components/conversation-list";
import { useConversations } from "@/hooks/use-chat";

const ListenScreenContent = () => {
  const { t } = useTranslation();
  const {
    conversations,
    createConversation,
    deleteConversation,
    renameConversation,
  } = useConversations();

  const startConversation = () => {
    const conversation = createConversation();
    router.push({
      pathname: "/listen/conversation/[id]",
      params: { id: conversation.id },
    });
  };

  return (
    <View className="flex-1 items-center justify-center bg-white">
      <ConversationList
        conversations={conversations}
        onDelete={deleteConversation}
        onRename={renameConversation}
        onSelect={(conversationId) =>
          router.push({
            pathname: "/listen/conversation/[id]",
            params: { id: conversationId },
          })
        }
      />
      <View className="min-h-[50%] w-full items-center justify-center gap-6 bg-white px-4">
        <Text className="text-start text-lg text-grey">
          <Trans
            i18nKey="listen.intro"
            components={{
              conversation: <Text className="font-bold text-pink" />,
              transcribe: <Text className="font-bold text-black" />,
              speak: <Text className="font-bold text-black" />,
            }}
          />
        </Text>
        <Button
          className="w-[168px] overflow-hidden rounded-lg border-0 px-8 py-4"
          contentClassName="justify-around"
          icon="ear-sharp"
          onPress={startConversation}
          textClassName="text-lg"
        >
          {t("navigation.listen")}
        </Button>
      </View>
    </View>
  );
};

export { ListenScreenContent };
