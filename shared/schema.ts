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
  coins: integer("coins").default(0),
  totalTreesPlanted: integer("total_trees_planted").default(0),
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
  timeTaken: real("time_taken"), // in seconds
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

// User's planted trees for growth mechanics
export const userTrees = pgTable("user_trees", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  treeType: varchar("tree_type").notNull(), // 'oak', 'cherry', 'willow', 'rainbow'
  growthStage: integer("growth_stage").default(1), // 1=seed, 2=sprout, 3=sapling, 4=tree, 5=mature
  xpContributed: integer("xp_contributed").default(0), // XP invested in this tree
  plantedAt: timestamp("planted_at").defaultNow(),
  lastWatered: timestamp("last_watered"),
  isSpecial: boolean("is_special").default(false),
});

// Coin transaction history
export const coinTransactions = pgTable("coin_transactions", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  amount: integer("amount").notNull(), // positive for earned, negative for spent
  transactionType: varchar("transaction_type").notNull(), // 'game_reward', 'achievement', 'purchase'
  description: varchar("description").notNull(),
  gameType: varchar("game_type"), // null for non-game transactions
  createdAt: timestamp("created_at").defaultNow(),
});

// Store items that can be purchased with coins
export const storeItems = pgTable("store_items", {
  id: serial("id").primaryKey(),
  itemType: varchar("item_type").notNull(), // 'tree_seed', 'tree_fertilizer', 'decorations'
  name: varchar("name").notNull(),
  description: text("description").notNull(),
  price: integer("price").notNull(),
  category: varchar("category").notNull(),
  isAvailable: boolean("is_available").default(true),
});

// User's purchased items
export const userInventory = pgTable("user_inventory", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  storeItemId: integer("store_item_id").references(() => storeItems.id).notNull(),
  quantity: integer("quantity").default(1),
  purchasedAt: timestamp("purchased_at").defaultNow(),
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
export type UserTree = typeof userTrees.$inferSelect;
export type InsertUserTree = typeof userTrees.$inferInsert;
export type CoinTransaction = typeof coinTransactions.$inferSelect;
export type InsertCoinTransaction = typeof coinTransactions.$inferInsert;
export type StoreItem = typeof storeItems.$inferSelect;
export type InsertStoreItem = typeof storeItems.$inferInsert;
export type UserInventory = typeof userInventory.$inferSelect;
export type InsertUserInventory = typeof userInventory.$inferInsert;

// Zod schemas
export const insertGameProgressSchema = createInsertSchema(gameProgress);
export const insertJournalEntrySchema = createInsertSchema(journalEntries);
export const insertSkillProgressSchema = createInsertSchema(skillProgress);
export const insertAchievementSchema = createInsertSchema(achievements);
export const insertUserTreeSchema = createInsertSchema(userTrees);
export const insertCoinTransactionSchema = createInsertSchema(coinTransactions);
export const insertStoreItemSchema = createInsertSchema(storeItems);
export const insertUserInventorySchema = createInsertSchema(userInventory);
