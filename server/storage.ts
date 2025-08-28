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
  type InsertUser,
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
  // User operations for custom authentication
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<User>): Promise<User>;
  updateUserXP(userId: string, xpGain: number): Promise<User>;
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
  growTree(treeId: number, xpToContribute: number): Promise<{ tree: UserTree, previousStage: number }>;
  
  // Coin transaction operations
  addCoinTransaction(transaction: InsertCoinTransaction): Promise<CoinTransaction>;
  getUserCoinTransactions(userId: string, limit?: number): Promise<CoinTransaction[]>;
  
  // Store operations
  getStoreItems(category?: string): Promise<StoreItem[]>;
  createStoreItem(item: InsertStoreItem): Promise<StoreItem>;
  purchaseItem(userId: string, itemId: number, quantity?: number): Promise<void>;
  getUserInventory(userId: string): Promise<UserInventory[]>;
  useInventoryItem(userId: string, storeItemId: number, quantity: number): Promise<void>;
  
  // Decoration operations  
  addDecorationToTree(treeId: number, decorationType: string): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // User operations for custom authentication
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(userData: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .returning();
    return user;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User> {
    const [user] = await db
      .update(users)
      .set({
        ...updates,
        updatedAt: new Date(),
      })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  async updateUserXP(userId: string, xpGain: number): Promise<User> {
    const user = await this.getUser(userId);
    if (!user) throw new Error('User not found');

    let newXP = (user.xp || 0) + xpGain;
    let newLevel: number;
    
    if (newXP < 2000) {
      // Levels 1-9: Every 200 XP
      newLevel = Math.floor(newXP / 200) + 1;
      newLevel = Math.min(newLevel, 10); // Cap at level 10 until 2000 XP
    } else if (newXP >= 2000 && (user.level || 1) < 10) {
      // Player reaches level 10 for the first time at exactly 2000 XP
      newLevel = 10;
    } else if (newXP >= 2000) {
      // After level 10, continue leveling with 300 XP per level
      const excessXP = newXP - 2000;
      newLevel = 11 + Math.floor(excessXP / 300);
    } else {
      newLevel = user.level || 1;
    }

    const [updatedUser] = await db
      .update(users)
      .set({
        xp: newXP,
        level: newLevel,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
      .returning();
      
    return updatedUser;
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
        case 'trees_planted':
          const userTrees = await this.getUserTrees(userId);
          shouldUnlock = userTrees.length >= requirement.count;
          break;
        case 'trees_watered':
          // Count watering events from coin transactions
          const waterTransactions = await db
            .select()
            .from(coinTransactions)
            .where(and(
              eq(coinTransactions.userId, userId),
              eq(coinTransactions.transactionType, 'tree_watered')
            ));
          shouldUnlock = waterTransactions.length >= requirement.count;
          break;
        case 'trees_grown':
          // Count growth events from coin transactions
          const growthTransactions = await db
            .select()
            .from(coinTransactions)
            .where(and(
              eq(coinTransactions.userId, userId),
              eq(coinTransactions.transactionType, 'tree_growth')
            ));
          shouldUnlock = growthTransactions.length >= requirement.count;
          break;
        case 'coins_earned':
          const earnedTransactions = await db
            .select()
            .from(coinTransactions)
            .where(and(
              eq(coinTransactions.userId, userId),
              sql`amount > 0`
            ));
          const totalEarned = earnedTransactions.reduce((sum, t) => sum + t.amount, 0);
          shouldUnlock = totalEarned >= requirement.count;
          break;
        case 'coins_spent':
          const spentTransactions = await db
            .select()
            .from(coinTransactions)
            .where(and(
              eq(coinTransactions.userId, userId),
              sql`amount < 0`
            ));
          const totalSpent = Math.abs(spentTransactions.reduce((sum, t) => sum + t.amount, 0));
          shouldUnlock = totalSpent >= requirement.count;
          break;
      }

      if (shouldUnlock) {
        await this.unlockAchievement(userId, achievement.id);
        if (achievement.xpReward > 0) {
          await this.updateUserXP(userId, achievement.xpReward);
        }
        // Award 20 coins for each achievement
        await this.updateUserCoins(userId, 20);
        await this.addCoinTransaction({
          userId,
          amount: 20,
          transactionType: 'achievement_reward',
          description: `Achievement unlocked: ${achievement.name}`
        });
        
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

  async growTree(treeId: number, xpToContribute: number): Promise<{ tree: UserTree, previousStage: number }> {
    const [tree] = await db
      .select()
      .from(userTrees)
      .where(eq(userTrees.id, treeId));

    if (!tree) {
      throw new Error('Tree not found');
    }

    const currentXpContributed = tree.xpContributed ?? 0;
    const currentGrowthStage = tree.growthStage ?? 1;
    const newXpContributed = currentXpContributed + xpToContribute;
    let newGrowthStage = currentGrowthStage;

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

    if (!updatedTree) {
      throw new Error('Failed to update tree');
    }

    return { 
      tree: updatedTree, 
      previousStage: currentGrowthStage 
    };
  }

  async decorateTree(treeId: number, decorationType: string): Promise<void> {
    const currentDecorations = await db
      .select()
      .from(userTrees)
      .where(eq(userTrees.id, treeId));

    if (currentDecorations.length > 0) {
      const tree = currentDecorations[0];
      const existingDecorations = Array.isArray(tree.decorations) ? tree.decorations : [];
      
      // Handle special gnome decorations with multiple colors
      if (decorationType === 'gnome') {
        // Get current gnome count
        const currentGnomes = existingDecorations.filter(d => 
          typeof d === 'string' && (d === 'gnome' || d.startsWith('gnome_'))
        );
        
        // Limit to 4 gnomes maximum
        if (currentGnomes.length >= 4) {
          return; // Maximum gnomes reached
        }
        
        // Add new gnome with random color and alternating position
        const colors = ['green', 'blue', 'pink', 'red', 'purple', 'orange'];
        const positions = ['left', 'right'];
        const gnomeId = currentGnomes.length + 1;
        const color = colors[Math.floor(Math.random() * colors.length)];
        const position = positions[gnomeId % 2]; // Alternate left/right
        
        const newGnome = `gnome_${gnomeId}_${color}_${position}`;
        
        await db
          .update(userTrees)
          .set({
            decorations: [...existingDecorations, newGnome],
          })
          .where(eq(userTrees.id, treeId));
      } else {
        // Regular decoration handling
        if (!existingDecorations.includes(decorationType)) {
          await db
            .update(userTrees)
            .set({
              decorations: [...existingDecorations, decorationType],
            })
            .where(eq(userTrees.id, treeId));
        }
      }
    }
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

    // Deduct coins first
    await db
      .update(users)
      .set({
        coins: (user.coins || 0) - totalCost,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId));

    // Check if user already has this item in inventory
    const [existingItem] = await db
      .select()
      .from(userInventory)
      .where(and(eq(userInventory.userId, userId), eq(userInventory.storeItemId, itemId)));

    if (existingItem) {
      // Update existing quantity
      await db
        .update(userInventory)
        .set({
          quantity: (existingItem.quantity || 0) + quantity,
        })
        .where(and(eq(userInventory.userId, userId), eq(userInventory.storeItemId, itemId)));
    } else {
      // Add new inventory item
      await db
        .insert(userInventory)
        .values({
          userId,
          storeItemId: itemId,
          quantity,
        });
    }

    // Create coin transaction record only (don't double-deduct coins)
    await db
      .insert(coinTransactions)
      .values({
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

  async useInventoryItem(userId: string, itemId: number, quantity: number): Promise<void> {
    const [inventoryItem] = await db
      .select()
      .from(userInventory)
      .where(and(eq(userInventory.userId, userId), eq(userInventory.storeItemId, itemId)));

    if (!inventoryItem || (inventoryItem.quantity || 0) < quantity) {
      throw new Error('Insufficient items in inventory');
    }

    if ((inventoryItem.quantity || 0) === quantity) {
      // Remove the entire entry if using all items
      await db
        .delete(userInventory)
        .where(and(eq(userInventory.userId, userId), eq(userInventory.storeItemId, itemId)));
    } else {
      // Decrease quantity
      await db
        .update(userInventory)
        .set({
          quantity: (inventoryItem.quantity || 0) - quantity,
        })
        .where(and(eq(userInventory.userId, userId), eq(userInventory.storeItemId, itemId)));
    }
  }

  async addDecorationToTree(treeId: number, decorationType: string): Promise<void> {
    const [tree] = await db
      .select()
      .from(userTrees)
      .where(eq(userTrees.id, treeId));

    if (!tree) {
      throw new Error('Tree not found');
    }

    const currentDecorations = (tree.decorations as any[]) || [];
    const updatedDecorations = [...currentDecorations, { 
      type: decorationType, 
      addedAt: new Date().toISOString() 
    }];

    await db
      .update(userTrees)
      .set({ decorations: updatedDecorations })
      .where(eq(userTrees.id, treeId));
  }
}

export const storage = new DatabaseStorage();
