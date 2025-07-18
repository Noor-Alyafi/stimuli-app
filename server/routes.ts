import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertGameProgressSchema, insertJournalEntrySchema } from "@shared/schema";
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
        });

        // Seed initial achievements
        const existingAchievements = await storage.getAchievements();
        if (existingAchievements.length === 0) {
          await storage.createAchievement({
            key: "neural-spark",
            name: "Neural Spark",
            description: "Complete your first brain training session",
            xpReward: 50,
            iconType: "brain",
            requirement: { type: "xp", value: 10 },
          });
          await storage.createAchievement({
            key: "focused-flame",
            name: "Focused Flame",
            description: "Maintain a 7-day training streak",
            xpReward: 100,
            iconType: "flame",
            requirement: { type: "streak", value: 7 },
          });
          await storage.createAchievement({
            key: "synesthetic-pro",
            name: "Synesthetic Pro",
            description: "Complete 5 color-echo games",
            xpReward: 75,
            iconType: "palette",
            requirement: { type: "game_count", game: "color-echo", value: 5 },
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
      
      // Check for new achievements
      const newAchievements = await storage.checkAndUnlockAchievements(userId);
      
      res.json({ 
        progress, 
        newAchievements,
        message: newAchievements.length > 0 ? "Achievement unlocked!" : "Progress saved!"
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

  const httpServer = createServer(app);
  return httpServer;
}
