import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { insertGameProgressSchema, insertJournalEntrySchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Game progress routes
  app.post('/api/game-progress', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
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

  app.get('/api/game-progress', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { gameType } = req.query;
      
      const progress = await storage.getUserGameProgress(userId, gameType as string);
      res.json(progress);
    } catch (error) {
      console.error("Error fetching game progress:", error);
      res.status(500).json({ message: "Failed to fetch progress" });
    }
  });

  app.get('/api/best-scores', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const bestScores = await storage.getUserBestScores(userId);
      res.json(bestScores);
    } catch (error) {
      console.error("Error fetching best scores:", error);
      res.status(500).json({ message: "Failed to fetch best scores" });
    }
  });

  // Achievement routes
  app.get('/api/achievements', isAuthenticated, async (req: any, res) => {
    try {
      const achievements = await storage.getAchievements();
      res.json(achievements);
    } catch (error) {
      console.error("Error fetching achievements:", error);
      res.status(500).json({ message: "Failed to fetch achievements" });
    }
  });

  app.get('/api/user-achievements', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const userAchievements = await storage.getUserAchievements(userId);
      res.json(userAchievements);
    } catch (error) {
      console.error("Error fetching user achievements:", error);
      res.status(500).json({ message: "Failed to fetch achievements" });
    }
  });

  // Journal routes
  app.post('/api/journal', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
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

  app.get('/api/journal', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { limit } = req.query;
      
      const entries = await storage.getUserJournalEntries(userId, limit ? parseInt(limit as string) : undefined);
      res.json(entries);
    } catch (error) {
      console.error("Error fetching journal entries:", error);
      res.status(500).json({ message: "Failed to fetch journal entries" });
    }
  });

  // Skill progress routes
  app.get('/api/skill-progress', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const skillProgress = await storage.getUserSkillProgress(userId);
      res.json(skillProgress);
    } catch (error) {
      console.error("Error fetching skill progress:", error);
      res.status(500).json({ message: "Failed to fetch skill progress" });
    }
  });

  app.put('/api/skill-progress', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
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
