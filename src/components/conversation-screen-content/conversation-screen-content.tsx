import { FlashList, type FlashListRef } from "@shopify/flash-list";
import { Stack, useIsFocused } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { KeyboardAvoidingView, Text, View } from "react-native";

import { Button } from "@/components/button";
import { ConversationInput } from "@/components/conversation-input";
import { MessageBubble } from "@/components/message-bubble";
import { Warning } from "@/components/warning";
import { sizes } from "@/constants/theme";
import { useChatConversation } from "@/hooks/use-chat";
import { useConversationLanguage } from "@/hooks/use-language-preferences";
import { useNavigationChrome } from "@/hooks/use-navigation-chrome";
import { useSpeechSynthesis } from "@/hooks/use-speech-synthesis";
import type { Message } from "@/lib/db/schema";
import { getNextLanguageCode } from "@/lib/i18n/i18n";
import {
  getSpeechPermission,
  openAppSettings,
  requestSpeechPermission,
} from "@/lib/permissions/app-permissions";
import { formatDate, isSameDate } from "@/lib/utils/date-time";

type Props = {
  conversationId: string;
};

const ConversationScreenContent = (props: Props) => {
  const { t } = useTranslation();
  const { conversationId } = props;
  const { stackHeaderHeight } = useNavigationChrome();
  const isFocused = useIsFocused();
  const { conversation, messages, addMessage, editMessage } =
    useChatConversation(conversationId);
  const { language, selectLanguage } = useConversationLanguage();
  const speech = useSpeechSynthesis();
  const listRef = useRef<FlashListRef<Message>>(null);
  const [hasSpeechPermission, setHasSpeechPermission] = useState<
    boolean | null
  >(null);
  const [canAskAgainForSpeechPermission, setCanAskAgainForSpeechPermission] =
    useState(true);

  const selectNextLanguage = () => {
    selectLanguage(getNextLanguageCode(language));
  };

  const refreshSpeechPermission = useCallback(async () => {
    const permission = await getSpeechPermission();
    if (!permission) {
      return;
    }

    setHasSpeechPermission(permission.granted);
    setCanAskAgainForSpeechPermission(permission.canAskAgain);
  }, []);

  const handleSpeechPermission = useCallback(async () => {
    if (canAskAgainForSpeechPermission) {
      const permission = await requestSpeechPermission();
      setHasSpeechPermission(permission.granted);
      setCanAskAgainForSpeechPermission(permission.canAskAgain);
      return;
    }

    await openAppSettings();
  }, [canAskAgainForSpeechPermission]);

  useEffect(() => {
    if (isFocused) {
      void Promise.resolve().then(refreshSpeechPermission);
    }
  }, [isFocused, refreshSpeechPermission]);

  return (
    <>
      <Stack.Screen
        options={{
          title: conversation?.title ?? t("navigation.conversation"),
        }}
      />
      <KeyboardAvoidingView
        className="flex-1 bg-neutral dark:bg-neutral-dark"
        behavior="padding"
        // Same height as the header to ensure the input is fully visible when the keyboard is open
        // This value means: how far from the top of the screen your app content starts before keyboard avoidance should begin
        // It is usually the header height
        keyboardVerticalOffset={stackHeaderHeight}
      >
        {hasSpeechPermission === false ? (
          <Warning
            icon="mic-outline"
            title={t("listen.speech_permission_title")}
            text={t("listen.speech_permission_text")}
          >
            <Button onPress={handleSpeechPermission}>
              {canAskAgainForSpeechPermission
                ? t("listen.grant_speech_access")
                : t("common.open_settings")}
            </Button>
          </Warning>
        ) : messages.length > 0 ? (
          <FlashList
            ref={listRef}
            contentContainerStyle={{
              paddingVertical: sizes.spacing.md,
            }}
            data={messages}
            keyExtractor={(item) => item.id}
            onContentSizeChange={() =>
              listRef.current?.scrollToEnd({ animated: true })
            }
            renderItem={({ item, index }) => {
              const previousMessage = messages[index - 1];
              const shouldShowDate =
                !previousMessage ||
                !isSameDate(previousMessage.createdAt, item.createdAt);

              return (
                <>
                  {shouldShowDate ? (
                    <View className="mb-4 mt-2 items-center">
                      <Text className="rounded-full bg-background px-4 py-1 text-xs text-muted dark:bg-background-dark dark:text-muted-dark">
                        {formatDate(item.createdAt)}
                      </Text>
                    </View>
                  ) : null}
                  <MessageBubble
                    message={item}
                    isSpeaking={speech.speakingId === item.id}
                    onEdit={(body) => editMessage(item.id, body)}
                    onSpeak={() =>
                      speech.speak(item.body, item.language, item.id)
                    }
                  />
                </>
              );
            }}
            style={{ flex: 1 }}
          />
        ) : (
          <Warning
            icon="information-circle-outline"
            text={t("listen.silent_phone_warning")}
          />
        )}
        <ConversationInput
          language={language}
          onToggleLanguage={selectNextLanguage}
          onAddTextToSpeech={(text) =>
            addMessage(text, "text-to-speech", language)
          }
          onAddSpeechToText={(text) =>
            addMessage(text, "speech-to-text", language)
          }
        />
      </KeyboardAvoidingView>
    </>
  );
};

export { ConversationScreenContent };
