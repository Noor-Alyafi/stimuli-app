import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  index,
  serial,
  integer,
  boolean,
  real,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table (mandatory for Replit Auth)
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table (mandatory for Replit Auth)
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  xp: integer("xp").default(0),
  level: integer("level").default(1),
  streak: integer("streak").default(0),
  lastLoginDate: timestamp("last_login_date"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Game progress tracking
export const gameProgress = pgTable("game_progress", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  gameType: varchar("game_type").notNull(), // 'color-echo', 'shape-sequence', etc.
  score: integer("score").notNull(),
  completedAt: timestamp("completed_at").defaultNow(),
  difficulty: varchar("difficulty").default("normal"),
  timeTaken: integer("time_taken"), // in seconds
});

// Achievements
export const achievements = pgTable("achievements", {
  id: serial("id").primaryKey(),
  key: varchar("key").notNull().unique(),
  name: varchar("name").notNull(),
  description: text("description").notNull(),
  xpReward: integer("xp_reward").notNull(),
  iconType: varchar("icon_type").notNull(),
  requirement: jsonb("requirement").notNull(), // criteria for unlocking
});

// User achievements (junction table)
export const userAchievements = pgTable("user_achievements", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  achievementId: integer("achievement_id").references(() => achievements.id).notNull(),
  unlockedAt: timestamp("unlocked_at").defaultNow(),
});

// Journal entries
export const journalEntries = pgTable("journal_entries", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  focusLevel: integer("focus_level").notNull(), // 1-10
  energyLevel: varchar("energy_level").notNull(), // 'low', 'medium', 'high'
  reflection: text("reflection"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Skill progress tracking
export const skillProgress = pgTable("skill_progress", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  skillType: varchar("skill_type").notNull(), // 'memory', 'attention', 'speed', 'pattern'
  level: real("level").notNull(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Type exports
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type GameProgress = typeof gameProgress.$inferSelect;
export type InsertGameProgress = typeof gameProgress.$inferInsert;
export type Achievement = typeof achievements.$inferSelect;
export type InsertAchievement = typeof achievements.$inferInsert;
export type UserAchievement = typeof userAchievements.$inferSelect;
export type InsertUserAchievement = typeof userAchievements.$inferInsert;
export type JournalEntry = typeof journalEntries.$inferSelect;
export type InsertJournalEntry = typeof journalEntries.$inferInsert;
export type SkillProgress = typeof skillProgress.$inferSelect;
export type InsertSkillProgress = typeof skillProgress.$inferInsert;

// Zod schemas
export const insertGameProgressSchema = createInsertSchema(gameProgress);
export const insertJournalEntrySchema = createInsertSchema(journalEntries);
export const insertSkillProgressSchema = createInsertSchema(skillProgress);
