import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertGameProgressSchema, 
  insertJournalEntrySchema,
  insertUserTreeSchema,
  insertCoinTransactionSchema,
  insertStoreItemSchema 
} from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Create a demo user for testing
  const demoUserId = "demo-user";
  
  // Initialize database connection with retry logic
  const initializeDatabase = async (retries = 3) => {
    for (let i = 0; i < retries; i++) {
      try {
        console.log(`Attempting to connect to database (attempt ${i + 1}/${retries})...`);
        
        await storage.upsertUser({
          id: demoUserId,
          email: "demo@stimuli.com",
          firstName: "Demo",
          lastName: "User",
          profileImageUrl: null,
          coins: 50, // Start with 50 coins
        });

        // Seed initial achievements
        const existingAchievements = await storage.getAchievements();
        if (existingAchievements.length === 0) {
          // XP Milestone Badges
          await storage.createAchievement({
            key: "neural-spark",
            name: "Neural Spark",
            description: "Your brain's warming up!",
            xpReward: 0,
            iconType: "⚡",
            requirement: { type: "xp", value: 50 },
          });
          await storage.createAchievement({
            key: "cortex-climber",
            name: "Cortex Climber",
            description: "Scaling the mental mountain!",
            xpReward: 0,
            iconType: "🧗‍♀️",
            requirement: { type: "xp", value: 100 },
          });
          await storage.createAchievement({
            key: "memory-mage",
            name: "Memory Mage",
            description: "You've got memory magic!",
            xpReward: 0,
            iconType: "🪄",
            requirement: { type: "xp", value: 250 },
          });
          await storage.createAchievement({
            key: "synesthesia-savant",
            name: "Synesthesia Savant",
            description: "You see sounds. You feel colors. You slay.",
            xpReward: 0,
            iconType: "🌈",
            requirement: { type: "xp", value: 500 },
          });
          await storage.createAchievement({
            key: "neuro-legend",
            name: "NeuroLegend",
            description: "Cognitive Queen/King 👑 unlocked.",
            xpReward: 0,
            iconType: "👑",
            requirement: { type: "xp", value: 1000 },
          });

          // Streak Rewards
          await storage.createAchievement({
            key: "baby-brainiac",
            name: "Baby Brainiac",
            description: "3 days of brain training!",
            xpReward: 20,
            iconType: "🍼",
            requirement: { type: "streak", value: 3 },
          });
          await storage.createAchievement({
            key: "neural-discipline",
            name: "Neural Discipline",
            description: "14+ days of cognitive commitment!",
            xpReward: 100,
            iconType: "🏅",
            requirement: { type: "streak", value: 14 },
          });

          // Behavioral Achievements
          await storage.createAchievement({
            key: "mindful-moment",
            name: "Mindful Moment",
            description: "For tracking emotions consistently",
            xpReward: 30,
            iconType: "🧘",
            requirement: { type: "journal_count", value: 3 },
          });
          await storage.createAchievement({
            key: "sensory-explorer",
            name: "Sensory Explorer",
            description: "For being curious AF",
            xpReward: 50,
            iconType: "🔍",
            requirement: { type: "games_played", value: 6 },
          });
          await storage.createAchievement({
            key: "synesthetic-pro",
            name: "Synesthetic Pro",
            description: "Complete 5 color-echo games",
            xpReward: 75,
            iconType: "🎨",
            requirement: { type: "game_count", game: "color-echo", value: 5 },
          });
        }

        // Seed store items if empty
        const existingStoreItems = await storage.getStoreItems();
        if (existingStoreItems.length === 0) {
          // Tree seeds
          await storage.createStoreItem({
            itemType: 'tree_seed',
            name: 'Cherry Blossom Seed',
            description: 'Plant a beautiful cherry blossom tree that grows pink petals',
            price: 25,
            category: 'seeds',
            isAvailable: true,
          });
          await storage.createStoreItem({
            itemType: 'tree_seed',
            name: 'Rainbow Eucalyptus Seed',
            description: 'A magical tree with multicolored bark - rare and special!',
            price: 50,
            category: 'seeds',
            isAvailable: true,
          });
          await storage.createStoreItem({
            itemType: 'tree_seed',
            name: 'Willow Seed',
            description: 'Graceful weeping willow for peaceful meditation',
            price: 15,
            category: 'seeds',
            isAvailable: true,
          });
          
          // Tree fertilizers/boosters
          await storage.createStoreItem({
            itemType: 'tree_fertilizer',
            name: 'Growth Booster',
            description: 'Instantly advance your tree to the next growth stage',
            price: 30,
            category: 'boosters',
            isAvailable: true,
          });
          await storage.createStoreItem({
            itemType: 'tree_fertilizer',
            name: 'Miracle Grow',
            description: 'Doubles XP contribution for tree growth',
            price: 20,
            category: 'boosters',
            isAvailable: true,
          });
          
          // Decorative items
          await storage.createStoreItem({
            itemType: 'decoration',
            name: 'Fairy Lights',
            description: 'Add magical twinkling lights to your trees',
            price: 35,
            category: 'decorations',
            isAvailable: true,
          });
          await storage.createStoreItem({
            itemType: 'decoration',
            name: 'Garden Gnome',
            description: 'A friendly gnome to watch over your garden',
            price: 40,
            category: 'decorations',
            isAvailable: true,
          });
        }
        
        console.log("Database initialized successfully");
        return;
      } catch (error) {
        console.error(`Database initialization error (attempt ${i + 1}):`, error);
        if (i === retries - 1) {
          console.error("Failed to initialize database after all retries");
          // Don't throw error, let the app continue without database initialization
        } else {
          // Wait before retry
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      }
    }
  };

  // Initialize database asynchronously
  initializeDatabase().catch(console.error);

  // Auth routes (simplified for demo)
  app.get('/api/auth/user', async (req: any, res) => {
    try {
      const user = await storage.getUser(demoUserId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Game progress routes
  app.post('/api/game-progress', async (req: any, res) => {
    try {
      const userId = demoUserId;
      const progressData = insertGameProgressSchema.parse({
        ...req.body,
        userId,
      });

      const progress = await storage.addGameProgress(progressData);
      
      // Update user XP
      await storage.updateUserXP(userId, 10); // 10 XP per game
      
      // Update streak
      await storage.updateUserStreak(userId);
      
      // Award coins based on performance
      let coinsEarned = 2; // Base coins per game
      if (progressData.score >= 80) coinsEarned = 5; // Bonus for good performance
      if (progressData.score >= 95) coinsEarned = 8; // Bonus for excellent performance
      
      await storage.addCoinTransaction({
        userId,
        amount: coinsEarned,
        transactionType: 'game_reward',
        description: `Completed ${progressData.gameType} (Score: ${progressData.score})`,
        gameType: progressData.gameType,
      });
      
      // Check for new achievements
      const newAchievements = await storage.checkAndUnlockAchievements(userId);
      
      res.json({ 
        progress, 
        newAchievements,
        coinsEarned,
        message: newAchievements.length > 0 ? "Achievement unlocked!" : `Progress saved! +${coinsEarned} coins`
      });
    } catch (error) {
      console.error("Error saving game progress:", error);
      res.status(500).json({ message: "Failed to save progress" });
    }
  });

  app.get('/api/game-progress', async (req: any, res) => {
    try {
      const userId = demoUserId;
      const { gameType } = req.query;
      
      const progress = await storage.getUserGameProgress(userId, gameType as string);
      res.json(progress);
    } catch (error) {
      console.error("Error fetching game progress:", error);
      res.status(500).json({ message: "Failed to fetch progress" });
    }
  });

  app.get('/api/best-scores', async (req: any, res) => {
    try {
      const userId = demoUserId;
      const bestScores = await storage.getUserBestScores(userId);
      res.json(bestScores);
    } catch (error) {
      console.error("Error fetching best scores:", error);
      res.status(500).json({ message: "Failed to fetch best scores" });
    }
  });

  // Achievement routes
  app.get('/api/achievements', async (req: any, res) => {
    try {
      const achievements = await storage.getAchievements();
      res.json(achievements);
    } catch (error) {
      console.error("Error fetching achievements:", error);
      res.status(500).json({ message: "Failed to fetch achievements" });
    }
  });

  app.get('/api/user-achievements', async (req: any, res) => {
    try {
      const userId = demoUserId;
      const userAchievements = await storage.getUserAchievements(userId);
      res.json(userAchievements);
    } catch (error) {
      console.error("Error fetching user achievements:", error);
      res.status(500).json({ message: "Failed to fetch achievements" });
    }
  });

  // Journal routes
  app.post('/api/journal', async (req: any, res) => {
    try {
      const userId = demoUserId;
      const entryData = insertJournalEntrySchema.parse({
        ...req.body,
        userId,
      });

      const entry = await storage.addJournalEntry(entryData);
      
      // Award XP for journal entry
      await storage.updateUserXP(userId, 5);
      
      res.json({ entry, message: "Journal entry saved! +5 XP" });
    } catch (error) {
      console.error("Error saving journal entry:", error);
      res.status(500).json({ message: "Failed to save journal entry" });
    }
  });

  app.get('/api/journal', async (req: any, res) => {
    try {
      const userId = demoUserId;
      const { limit } = req.query;
      
      const entries = await storage.getUserJournalEntries(userId, limit ? parseInt(limit as string) : undefined);
      res.json(entries);
    } catch (error) {
      console.error("Error fetching journal entries:", error);
      res.status(500).json({ message: "Failed to fetch journal entries" });
    }
  });

  // Skill progress routes
  app.get('/api/skill-progress', async (req: any, res) => {
    try {
      const userId = demoUserId;
      const skillProgress = await storage.getUserSkillProgress(userId);
      res.json(skillProgress);
    } catch (error) {
      console.error("Error fetching skill progress:", error);
      res.status(500).json({ message: "Failed to fetch skill progress" });
    }
  });

  app.put('/api/skill-progress', async (req: any, res) => {
    try {
      const userId = demoUserId;
      const { skillType, level } = req.body;
      
      await storage.updateSkillProgress(userId, skillType, level);
      res.json({ message: "Skill progress updated" });
    } catch (error) {
      console.error("Error updating skill progress:", error);
      res.status(500).json({ message: "Failed to update skill progress" });
    }
  });

  // Tree management routes
  app.get('/api/trees', async (req: any, res) => {
    try {
      const userId = demoUserId;
      const trees = await storage.getUserTrees(userId);
      res.json(trees);
    } catch (error) {
      console.error("Error fetching trees:", error);
      res.status(500).json({ message: "Failed to fetch trees" });
    }
  });

  app.post('/api/trees/plant', async (req: any, res) => {
    try {
      const userId = demoUserId;
      const { treeType } = req.body;
      
      const tree = await storage.plantTree({
        userId,
        treeType: treeType || 'oak',
        growthStage: 1,
        xpContributed: 0,
      });
      
      // Award coins for planting
      await storage.addCoinTransaction({
        userId,
        amount: 5,
        transactionType: 'achievement',
        description: 'Planted a new tree',
      });
      
      res.json({ tree, message: "Tree planted! +5 coins" });
    } catch (error) {
      console.error("Error planting tree:", error);
      res.status(500).json({ message: "Failed to plant tree" });
    }
  });

  app.post('/api/trees/:treeId/water', async (req: any, res) => {
    try {
      const { treeId } = req.params;
      await storage.waterTree(parseInt(treeId));
      res.json({ message: "Tree watered!" });
    } catch (error) {
      console.error("Error watering tree:", error);
      res.status(500).json({ message: "Failed to water tree" });
    }
  });

  app.post('/api/trees/:treeId/grow', async (req: any, res) => {
    try {
      const { treeId } = req.params;
      const { xpToContribute } = req.body;
      
      const updatedTree = await storage.growTree(parseInt(treeId), xpToContribute || 10);
      res.json({ tree: updatedTree, message: "Tree grew!" });
    } catch (error) {
      console.error("Error growing tree:", error);
      res.status(500).json({ message: "Failed to grow tree" });
    }
  });

  // Coin system routes
  app.get('/api/coins/transactions', async (req: any, res) => {
    try {
      const userId = demoUserId;
      const transactions = await storage.getUserCoinTransactions(userId);
      res.json(transactions);
    } catch (error) {
      console.error("Error fetching coin transactions:", error);
      res.status(500).json({ message: "Failed to fetch transactions" });
    }
  });

  // Store routes
  app.get('/api/store', async (req: any, res) => {
    try {
      const { category } = req.query;
      const items = await storage.getStoreItems(category as string);
      res.json(items);
    } catch (error) {
      console.error("Error fetching store items:", error);
      res.status(500).json({ message: "Failed to fetch store items" });
    }
  });

  app.post('/api/store/purchase', async (req: any, res) => {
    try {
      const userId = demoUserId;
      const { itemId, quantity = 1 } = req.body;
      
      await storage.purchaseItem(userId, itemId, quantity);
      res.json({ message: "Purchase successful!" });
    } catch (error) {
      console.error("Error purchasing item:", error);
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Failed to purchase item" });
      }
    }
  });

  app.get('/api/inventory', async (req: any, res) => {
    try {
      const userId = demoUserId;
      const inventory = await storage.getUserInventory(userId);
      res.json(inventory);
    } catch (error) {
      console.error("Error fetching inventory:", error);
      res.status(500).json({ message: "Failed to fetch inventory" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
