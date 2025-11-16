import { sql } from "drizzle-orm";
import { mysqlTable, text, varchar, int, timestamp, float, boolean, json } from "drizzle-orm/mysql-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table
export const users = mysqlTable("users", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`(UUID())`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
});

// Study Sessions table
export const studySessions = mysqlTable("study_sessions", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`(UUID())`),
  userId: varchar("user_id", { length: 36 }).notNull(),
  topic: text("topic").notNull(),
  studyMode: varchar("study_mode", { length: 50 }).notNull(), // active-learning, break-mode, focused, review
  language: varchar("language", { length: 10 }).default("en"),
  duration: int("duration").default(0), // in minutes
  startedAt: timestamp("started_at").defaultNow(),
  endedAt: timestamp("ended_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
});

// Chat Messages table
export const chatMessages = mysqlTable("chat_messages", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`(UUID())`),
  sessionId: varchar("session_id", { length: 36 }).notNull(),
  userId: varchar("user_id", { length: 36 }).notNull(),
  role: varchar("role", { length: 20 }).notNull(), // 'user' or 'assistant'
  message: text("message").notNull(),
  timestamp: timestamp("timestamp").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
  isDeleted: boolean("is_deleted").default(false),
});

// User Emotions table
export const userEmotions = mysqlTable("user_emotions", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`(UUID())`),
  userId: varchar("user_id", { length: 36 }).notNull(),
  sessionId: varchar("session_id", { length: 36 }).notNull(),
  messageId: varchar("message_id", { length: 36 }).notNull(),
  emotion: varchar("emotion", { length: 50 }).notNull(),
  sentiment: float("sentiment").notNull(),
  confidence: float("confidence").notNull(),
  analysisData: json("analysis_data"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Study Progress table
export const studyProgress = mysqlTable("study_progress", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`(UUID())`),
  userId: varchar("user_id", { length: 36 }).notNull(),
  sessionId: varchar("session_id", { length: 36 }).notNull(),
  topicsReviewed: json("topics_reviewed"),
  comprehensionLevel: int("comprehension_level").default(0), // 0-100
  timeSpent: int("time_spent").default(0), // in minutes
  questionsAnswered: int("questions_answered").default(0),
  correctAnswers: int("correct_answers").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
});

// User Preferences table
export const userPreferences = mysqlTable("user_preferences", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`(UUID())`),
  userId: varchar("user_id", { length: 36 }).notNull().unique(),
  preferredLanguage: varchar("preferred_language", { length: 10 }).default("en"),
  preferredStudyMode: varchar("preferred_study_mode", { length: 50 }).default("active-learning"),
  darkMode: boolean("dark_mode").default(false),
  dailyGoalMinutes: int("daily_goal_minutes").default(30),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
});

// Zod schemas for validation
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertSessionSchema = createInsertSchema(studySessions).pick({
  userId: true,
  topic: true,
  studyMode: true,
  language: true,
});

export const insertMessageSchema = createInsertSchema(chatMessages).pick({
  sessionId: true,
  userId: true,
  role: true,
  message: true,
});

export const insertEmotionSchema = createInsertSchema(userEmotions).pick({
  userId: true,
  sessionId: true,
  messageId: true,
  emotion: true,
  sentiment: true,
  confidence: true,
});

// Type inference
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type StudySession = typeof studySessions.$inferSelect;
export type ChatMessage = typeof chatMessages.$inferSelect;
export type UserEmotion = typeof userEmotions.$inferSelect;
export type StudyProgress = typeof studyProgress.$inferSelect;
export type UserPreference = typeof userPreferences.$inferSelect;
