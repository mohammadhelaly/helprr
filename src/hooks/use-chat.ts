import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";

import type { LanguageCode } from "@/lib/i18n/i18n";
import {
  addMessage,
  createConversation,
  deleteConversation,
  editMessage,
  getConversation,
  listConversations,
  listMessages,
  renameConversation,
  softDeleteMessage,
} from "@/lib/chat/chat-repository";
import type { Conversation, Message, MessageType } from "@/lib/db/schema";

const useConversations = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);

  const refresh = useCallback(() => {
    setConversations(listConversations());
  }, []);

  useFocusEffect(refresh);

  const create = useCallback(
    (title?: string) => {
      const conversation = createConversation(title);
      refresh();
      return conversation;
    },
    [refresh],
  );

  const remove = useCallback(
    (conversationId: string) => {
      deleteConversation(conversationId);
      refresh();
    },
    [refresh],
  );

  const rename = useCallback(
    (conversationId: string, title: string) => {
      renameConversation(conversationId, title);
      refresh();
    },
    [refresh],
  );

  return {
    conversations,
    createConversation: create,
    deleteConversation: remove,
    renameConversation: rename,
    refresh,
  };
};

const useChatConversation = (conversationId: string) => {
  const [conversation, setConversation] = useState<Conversation | undefined>(
    () => getConversation(conversationId),
  );
  const [messages, setMessages] = useState<Message[]>(() =>
    listMessages(conversationId),
  );

  const refresh = useCallback(() => {
    setConversation(getConversation(conversationId));
    setMessages(listMessages(conversationId));
  }, [conversationId]);

  useFocusEffect(refresh);

  const add = useCallback(
    (body: string, type: MessageType, language: LanguageCode) => {
      const trimmed = body.trim();
      if (!trimmed) return undefined;

      const message = addMessage({
        conversationId,
        body: trimmed,
        type,
        language,
      });
      refresh();
      return message;
    },
    [conversationId, refresh],
  );

  const rename = useCallback(
    (title: string) => {
      renameConversation(conversationId, title);
      refresh();
    },
    [conversationId, refresh],
  );

  const remove = useCallback(
    (messageId: string) => {
      softDeleteMessage(messageId);
      refresh();
    },
    [refresh],
  );

  const edit = useCallback(
    (messageId: string, body: string) => {
      editMessage(messageId, body);
      refresh();
    },
    [refresh],
  );

  return {
    conversation,
    messages,
    addMessage: add,
    deleteMessage: remove,
    editMessage: edit,
    renameConversation: rename,
    refresh,
  };
};

export { useChatConversation, useConversations };
