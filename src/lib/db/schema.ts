import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

import type { LanguageCode, TextDirection } from "@/lib/i18n/i18n";

export const conversations = sqliteTable("conversations", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  createdAt: integer("created_at").notNull(),
  updatedAt: integer("updated_at").notNull(),
  lastMessagePreview: text("last_message_preview"),
});

export const messages = sqliteTable("messages", {
  id: text("id").primaryKey(),
  conversationId: text("conversation_id")
    .notNull()
    .references(() => conversations.id, { onDelete: "cascade" }),
  body: text("body").notNull(),
  type: text("type", { enum: ["text-to-speech", "speech-to-text"] }).notNull(),
  language: text("language").$type<LanguageCode>().notNull(),
  direction: text("direction").$type<TextDirection>().notNull(),
  createdAt: integer("created_at").notNull(),
  deletedAt: integer("deleted_at"),
});

export const appSettings = sqliteTable("app_settings", {
  key: text("key").primaryKey(),
  value: text("value").notNull(),
});

export type Conversation = typeof conversations.$inferSelect;
export type Message = typeof messages.$inferSelect;
export type MessageType = (typeof messages.$inferInsert)["type"];
