import { and, desc, eq, isNull, notInArray } from "drizzle-orm";

import type { LanguageCode } from "@/lib/i18n/i18n";
import { db } from "@/lib/db/client";
import {
  conversations,
  messages,
  type Conversation,
  type Message,
  type MessageType,
} from "@/lib/db/schema";
import { i18n } from "@/lib/i18n/i18n";
import { createId } from "@/lib/utils/prefixed-id";

// This is to limit the number of conversations stored locally
// To increase the number of conversations, increase the conversationLimit
// To remove the limit, remove conversationLimit, pruneConversations and all calls to it in the database functions in this file
const conversationLimit = 10;

const pruneConversations = () => {
  const retainedConversationIds = db
    .select({ id: conversations.id })
    .from(conversations)
    .orderBy(desc(conversations.updatedAt))
    .limit(conversationLimit)
    .all()
    .map((conversation) => conversation.id);

  if (retainedConversationIds.length < conversationLimit) return;

  db.delete(conversations)
    .where(notInArray(conversations.id, retainedConversationIds))
    .run();
};

const listConversations = () => {
  pruneConversations();

  return db
    .select()
    .from(conversations)
    .orderBy(desc(conversations.updatedAt))
    .all();
};

const createConversation = (title?: string) => {
  const now = Date.now();
  const conversation: Conversation = {
    id: createId("conversation"),
    title: title ?? i18n.t("listen.new_conversation"),
    createdAt: now,
    updatedAt: now,
    lastMessagePreview: null,
  };

  db.insert(conversations).values(conversation).run();
  pruneConversations();
  return conversation;
};

const getConversation = (conversationId: string) => {
  return db
    .select()
    .from(conversations)
    .where(eq(conversations.id, conversationId))
    .get();
};

const renameConversation = (conversationId: string, title: string) => {
  db.update(conversations)
    .set({ title, updatedAt: Date.now() })
    .where(eq(conversations.id, conversationId))
    .run();
  pruneConversations();
};

const deleteConversation = (conversationId: string) => {
  db.delete(conversations).where(eq(conversations.id, conversationId)).run();
};

const listMessages = (conversationId: string) => {
  return db
    .select()
    .from(messages)
    .where(
      and(
        eq(messages.conversationId, conversationId),
        isNull(messages.deletedAt),
      ),
    )
    .orderBy(messages.createdAt)
    .all();
};

interface AddMessageInput {
  conversationId: string;
  body: string;
  type: MessageType;
  language: LanguageCode;
}

const addMessage = (input: AddMessageInput) => {
  const now = Date.now();
  const message: Message = {
    id: createId("message"),
    conversationId: input.conversationId,
    body: input.body.trim(),
    type: input.type,
    language: input.language,
    direction: i18n.dir(input.language),
    createdAt: now,
    deletedAt: null,
  };

  db.insert(messages).values(message).run();
  db.update(conversations)
    .set({ updatedAt: now, lastMessagePreview: message.body })
    .where(eq(conversations.id, input.conversationId))
    .run();
  pruneConversations();

  return message;
};

const softDeleteMessage = (messageId: string) => {
  db.update(messages)
    .set({ deletedAt: Date.now() })
    .where(eq(messages.id, messageId))
    .run();
};

const editMessage = (messageId: string, body: string) => {
  const nextBody = body.trim();
  if (!nextBody) return;

  const message = db
    .select()
    .from(messages)
    .where(eq(messages.id, messageId))
    .get();

  if (!message) return;

  db.update(messages)
    .set({ body: nextBody })
    .where(eq(messages.id, messageId))
    .run();

  const latestMessage = db
    .select()
    .from(messages)
    .where(
      and(
        eq(messages.conversationId, message.conversationId),
        isNull(messages.deletedAt),
      ),
    )
    .orderBy(desc(messages.createdAt))
    .get();

  if (latestMessage?.id === messageId) {
    db.update(conversations)
      .set({ lastMessagePreview: nextBody })
      .where(eq(conversations.id, message.conversationId))
      .run();
  }
};

const clearConversation = (conversationId: string) => {
  db.update(messages)
    .set({ deletedAt: Date.now() })
    .where(eq(messages.conversationId, conversationId))
    .run();
  db.update(conversations)
    .set({ updatedAt: Date.now(), lastMessagePreview: null })
    .where(eq(conversations.id, conversationId))
    .run();
  pruneConversations();
};

export {
  addMessage,
  clearConversation,
  createConversation,
  deleteConversation,
  editMessage,
  getConversation,
  listConversations,
  listMessages,
  renameConversation,
  softDeleteMessage,
};
