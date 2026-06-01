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
    <View className="flex-1 items-center justify-center bg-background dark:bg-background-dark">
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
      <View className="min-h-[50%] w-full items-center justify-center gap-6 bg-background px-4 dark:bg-background-dark">
        <Text className="text-start text-lg text-muted dark:text-muted-dark">
          <Trans
            i18nKey="listen.intro"
            components={{
              conversation: (
                <Text className="font-bold text-highlight dark:text-highlight-dark" />
              ),
              transcribe: (
                <Text className="font-bold text-foreground dark:text-foreground-dark" />
              ),
              speak: (
                <Text className="font-bold text-foreground dark:text-foreground-dark" />
              ),
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
