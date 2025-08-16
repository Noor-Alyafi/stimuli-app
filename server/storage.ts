import {
  users,
  gameProgress,
  achievements,
  userAchievements,
  journalEntries,
  skillProgress,
  userTrees,
  coinTransactions,
  storeItems,
  userInventory,
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
  type UserTree,
  type InsertUserTree,
  type CoinTransaction,
  type InsertCoinTransaction,
  type StoreItem,
  type InsertStoreItem,
  type UserInventory,
  type InsertUserInventory,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, sql } from "drizzle-orm";

export interface IStorage {
  // User operations (mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  updateUserXP(userId: string, xpGain: number): Promise<void>;
  updateUserStreak(userId: string): Promise<void>;
  updateUserCoins(userId: string, coinChange: number): Promise<void>;
  
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

  // Tree operations
  plantTree(tree: InsertUserTree): Promise<UserTree>;
  getUserTrees(userId: string): Promise<UserTree[]>;
  waterTree(treeId: number): Promise<void>;
  growTree(treeId: number, xpToContribute: number): Promise<UserTree>;
  
  // Coin transaction operations
  addCoinTransaction(transaction: InsertCoinTransaction): Promise<CoinTransaction>;
  getUserCoinTransactions(userId: string, limit?: number): Promise<CoinTransaction[]>;
  
  // Store operations
  getStoreItems(category?: string): Promise<StoreItem[]>;
  createStoreItem(item: InsertStoreItem): Promise<StoreItem>;
  purchaseItem(userId: string, itemId: number, quantity?: number): Promise<void>;
  getUserInventory(userId: string): Promise<UserInventory[]>;
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

      switch (requirement.type) {
        case 'xp':
          shouldUnlock = (user.xp || 0) >= requirement.value;
          break;
        case 'streak':
          shouldUnlock = (user.streak || 0) >= requirement.value;
          break;
        case 'game_count':
          if (requirement.game) {
            const games = await this.getUserGameProgress(userId, requirement.game);
            shouldUnlock = games.length >= requirement.value;
          }
          break;
        case 'journal_count':
          const journalEntries = await this.getUserJournalEntries(userId, 100);
          shouldUnlock = journalEntries.length >= requirement.value;
          break;
        case 'games_played':
          const allGames = await this.getUserGameProgress(userId);
          const uniqueGames = new Set(allGames.map(g => g.gameType));
          shouldUnlock = uniqueGames.size >= requirement.value;
          break;
      }

      if (shouldUnlock) {
        await this.unlockAchievement(userId, achievement.id);
        if (achievement.xpReward > 0) {
          await this.updateUserXP(userId, achievement.xpReward);
        }
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

  // Coin operations
  async updateUserCoins(userId: string, coinChange: number): Promise<void> {
    const user = await this.getUser(userId);
    if (!user) return;

    const newCoins = Math.max(0, (user.coins || 0) + coinChange);
    
    await db
      .update(users)
      .set({
        coins: newCoins,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId));
  }

  async addCoinTransaction(transaction: InsertCoinTransaction): Promise<CoinTransaction> {
    // Add transaction record
    const [newTransaction] = await db
      .insert(coinTransactions)
      .values(transaction)
      .returning();

    // Update user's coin balance
    await this.updateUserCoins(transaction.userId, transaction.amount);

    return newTransaction;
  }

  async getUserCoinTransactions(userId: string, limit = 20): Promise<CoinTransaction[]> {
    return db
      .select()
      .from(coinTransactions)
      .where(eq(coinTransactions.userId, userId))
      .orderBy(desc(coinTransactions.createdAt))
      .limit(limit);
  }

  // Tree operations
  async plantTree(tree: InsertUserTree): Promise<UserTree> {
    const [newTree] = await db
      .insert(userTrees)
      .values(tree)
      .returning();

    // Update user's total trees planted
    const user = await this.getUser(tree.userId);
    if (user) {
      await db
        .update(users)
        .set({
          totalTreesPlanted: (user.totalTreesPlanted || 0) + 1,
          updatedAt: new Date(),
        })
        .where(eq(users.id, tree.userId));
    }

    return newTree;
  }

  async getUserTrees(userId: string): Promise<UserTree[]> {
    return db
      .select()
      .from(userTrees)
      .where(eq(userTrees.userId, userId))
      .orderBy(desc(userTrees.plantedAt));
  }

  async waterTree(treeId: number): Promise<void> {
    await db
      .update(userTrees)
      .set({
        lastWatered: new Date(),
      })
      .where(eq(userTrees.id, treeId));
  }

  async growTree(treeId: number, xpToContribute: number): Promise<UserTree> {
    const [tree] = await db
      .select()
      .from(userTrees)
      .where(eq(userTrees.id, treeId));

    if (!tree) throw new Error('Tree not found');

    const newXpContributed = (tree.xpContributed || 0) + xpToContribute;
    let newGrowthStage = tree.growthStage || 1;

    // Growth stages based on XP contributed
    if (newXpContributed >= 500 && newGrowthStage < 5) {
      newGrowthStage = 5; // Mature tree
    } else if (newXpContributed >= 300 && newGrowthStage < 4) {
      newGrowthStage = 4; // Full tree
    } else if (newXpContributed >= 150 && newGrowthStage < 3) {
      newGrowthStage = 3; // Sapling
    } else if (newXpContributed >= 50 && newGrowthStage < 2) {
      newGrowthStage = 2; // Sprout
    }

    const [updatedTree] = await db
      .update(userTrees)
      .set({
        xpContributed: newXpContributed,
        growthStage: newGrowthStage,
      })
      .where(eq(userTrees.id, treeId))
      .returning();

    return updatedTree;
  }

  // Store operations
  async getStoreItems(category?: string): Promise<StoreItem[]> {
    let query = db.select().from(storeItems).where(eq(storeItems.isAvailable, true));
    
    if (category) {
      query = db
        .select()
        .from(storeItems)
        .where(and(eq(storeItems.isAvailable, true), eq(storeItems.category, category)));
    }

    return query;
  }

  async createStoreItem(item: InsertStoreItem): Promise<StoreItem> {
    const [newItem] = await db
      .insert(storeItems)
      .values(item)
      .returning();
    return newItem;
  }

  async purchaseItem(userId: string, itemId: number, quantity = 1): Promise<void> {
    const [storeItem] = await db
      .select()
      .from(storeItems)
      .where(eq(storeItems.id, itemId));

    if (!storeItem || !storeItem.isAvailable) {
      throw new Error('Item not available');
    }

    const totalCost = storeItem.price * quantity;
    const user = await this.getUser(userId);
    
    if (!user || (user.coins || 0) < totalCost) {
      throw new Error('Insufficient coins');
    }

    // Add to inventory
    await db
      .insert(userInventory)
      .values({
        userId,
        storeItemId: itemId,
        quantity,
      })
      .onConflictDoUpdate({
        target: [userInventory.userId, userInventory.storeItemId],
        set: {
          quantity: sql`${userInventory.quantity} + ${quantity}`,
        },
      });

    // Create coin transaction
    await this.addCoinTransaction({
      userId,
      amount: -totalCost,
      transactionType: 'purchase',
      description: `Purchased ${quantity}x ${storeItem.name}`,
    });
  }

  async getUserInventory(userId: string): Promise<UserInventory[]> {
    return db
      .select()
      .from(userInventory)
      .where(eq(userInventory.userId, userId))
      .orderBy(desc(userInventory.purchasedAt));
  }
}

export const storage = new DatabaseStorage();
