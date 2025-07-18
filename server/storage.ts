import {
  users,
  gameProgress,
  achievements,
  userAchievements,
  journalEntries,
  skillProgress,
  type User,
  type UpsertUser,
  type GameProgress,
  type InsertGameProgress,
  type Achievement,
  type InsertAchievement,
  type UserAchievement,
  type InsertUserAchievement,
  type JournalEntry,
  type InsertJournalEntry,
  type SkillProgress,
  type InsertSkillProgress,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, sql } from "drizzle-orm";

export interface IStorage {
  // User operations (mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  updateUserXP(userId: string, xpGain: number): Promise<void>;
  updateUserStreak(userId: string): Promise<void>;
  
  // Game progress operations
  addGameProgress(progress: InsertGameProgress): Promise<GameProgress>;
  getUserGameProgress(userId: string, gameType?: string): Promise<GameProgress[]>;
  getUserBestScores(userId: string): Promise<{ gameType: string; bestScore: number }[]>;
  
  // Achievement operations
  getAchievements(): Promise<Achievement[]>;
  createAchievement(achievement: InsertAchievement): Promise<Achievement>;
  getUserAchievements(userId: string): Promise<UserAchievement[]>;
  unlockAchievement(userId: string, achievementId: number): Promise<void>;
  checkAndUnlockAchievements(userId: string): Promise<UserAchievement[]>;
  
  // Journal operations
  addJournalEntry(entry: InsertJournalEntry): Promise<JournalEntry>;
  getUserJournalEntries(userId: string, limit?: number): Promise<JournalEntry[]>;
  
  // Skill progress operations
  updateSkillProgress(userId: string, skillType: string, level: number): Promise<void>;
  getUserSkillProgress(userId: string): Promise<SkillProgress[]>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async updateUserXP(userId: string, xpGain: number): Promise<void> {
    const user = await this.getUser(userId);
    if (!user) return;

    const newXP = (user.xp || 0) + xpGain;
    const newLevel = Math.floor(newXP / 100) + 1; // Level up every 100 XP

    await db
      .update(users)
      .set({
        xp: newXP,
        level: newLevel,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId));
  }

  async updateUserStreak(userId: string): Promise<void> {
    const user = await this.getUser(userId);
    if (!user) return;

    const today = new Date();
    const lastLogin = user.lastLoginDate;
    let newStreak = 1;

    if (lastLogin) {
      const daysDiff = Math.floor((today.getTime() - lastLogin.getTime()) / (1000 * 60 * 60 * 24));
      if (daysDiff === 1) {
        newStreak = (user.streak || 0) + 1;
      } else if (daysDiff === 0) {
        newStreak = user.streak || 0; // Same day, no change
      }
    }

    await db
      .update(users)
      .set({
        streak: newStreak,
        lastLoginDate: today,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId));
  }

  // Game progress operations
  async addGameProgress(progress: InsertGameProgress): Promise<GameProgress> {
    const [newProgress] = await db
      .insert(gameProgress)
      .values(progress)
      .returning();
    return newProgress;
  }

  async getUserGameProgress(userId: string, gameType?: string): Promise<GameProgress[]> {
    let query = db
      .select()
      .from(gameProgress)
      .where(eq(gameProgress.userId, userId))
      .orderBy(desc(gameProgress.completedAt));

    if (gameType) {
      query = db
        .select()
        .from(gameProgress)
        .where(and(eq(gameProgress.userId, userId), eq(gameProgress.gameType, gameType)))
        .orderBy(desc(gameProgress.completedAt));
    }

    return query;
  }

  async getUserBestScores(userId: string): Promise<{ gameType: string; bestScore: number }[]> {
    const results = await db
      .select({
        gameType: gameProgress.gameType,
        bestScore: sql<number>`max(${gameProgress.score})`,
      })
      .from(gameProgress)
      .where(eq(gameProgress.userId, userId))
      .groupBy(gameProgress.gameType);

    return results;
  }

  // Achievement operations
  async getAchievements(): Promise<Achievement[]> {
    return db.select().from(achievements);
  }

  async createAchievement(achievement: InsertAchievement): Promise<Achievement> {
    const [newAchievement] = await db
      .insert(achievements)
      .values(achievement)
      .returning();
    return newAchievement;
  }

  async getUserAchievements(userId: string): Promise<UserAchievement[]> {
    return db
      .select()
      .from(userAchievements)
      .where(eq(userAchievements.userId, userId))
      .orderBy(desc(userAchievements.unlockedAt));
  }

  async unlockAchievement(userId: string, achievementId: number): Promise<void> {
    await db
      .insert(userAchievements)
      .values({
        userId,
        achievementId,
      })
      .onConflictDoNothing();
  }

  async checkAndUnlockAchievements(userId: string): Promise<UserAchievement[]> {
    const user = await this.getUser(userId);
    if (!user) return [];

    const allAchievements = await this.getAchievements();
    const userAchievementsData = await this.getUserAchievements(userId);
    const unlockedIds = userAchievementsData.map(ua => ua.achievementId);

    const newlyUnlocked: UserAchievement[] = [];

    for (const achievement of allAchievements) {
      if (unlockedIds.includes(achievement.id)) continue;

      const requirement = achievement.requirement as any;
      let shouldUnlock = false;

      switch (achievement.key) {
        case 'neural-spark':
          shouldUnlock = (user.xp || 0) >= 10; // First game played
          break;
        case 'focused-flame':
          shouldUnlock = (user.streak || 0) >= 7; // 7-day streak
          break;
        case 'synesthetic-pro':
          const colorEchoGames = await this.getUserGameProgress(userId, 'color-echo');
          shouldUnlock = colorEchoGames.length >= 5; // 5 color echo games
          break;
        // Add more achievement logic here
      }

      if (shouldUnlock) {
        await this.unlockAchievement(userId, achievement.id);
        await this.updateUserXP(userId, achievement.xpReward);
        const [newAchievement] = await db
          .select()
          .from(userAchievements)
          .where(and(
            eq(userAchievements.userId, userId),
            eq(userAchievements.achievementId, achievement.id)
          ));
        if (newAchievement) {
          newlyUnlocked.push(newAchievement);
        }
      }
    }

    return newlyUnlocked;
  }

  // Journal operations
  async addJournalEntry(entry: InsertJournalEntry): Promise<JournalEntry> {
    const [newEntry] = await db
      .insert(journalEntries)
      .values(entry)
      .returning();
    return newEntry;
  }

  async getUserJournalEntries(userId: string, limit = 10): Promise<JournalEntry[]> {
    return db
      .select()
      .from(journalEntries)
      .where(eq(journalEntries.userId, userId))
      .orderBy(desc(journalEntries.createdAt))
      .limit(limit);
  }

  // Skill progress operations
  async updateSkillProgress(userId: string, skillType: string, level: number): Promise<void> {
    await db
      .insert(skillProgress)
      .values({
        userId,
        skillType,
        level,
      })
      .onConflictDoUpdate({
        target: [skillProgress.userId, skillProgress.skillType],
        set: {
          level,
          updatedAt: new Date(),
        },
      });
  }

  async getUserSkillProgress(userId: string): Promise<SkillProgress[]> {
    return db
      .select()
      .from(skillProgress)
      .where(eq(skillProgress.userId, userId));
  }
}

export const storage = new DatabaseStorage();
