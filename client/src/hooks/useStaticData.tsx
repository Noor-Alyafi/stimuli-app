// Static data hooks for frontend-only deployment
import { useState, useEffect } from 'react';
import { LocalStorageManager, StoredUser } from '../lib/localStorage';
import { useStaticAuth } from './useStaticAuth';

export function useStaticGameProgress() {
  const { user } = useStaticAuth();
  const [gameProgress, setGameProgress] = useState<any[]>([]);

  const addGameProgress = (progressData: any) => {
    if (!user) return;

    const progress = LocalStorageManager.addGameProgress({
      userId: user.id,
      gameType: progressData.gameType,
      score: progressData.score,
      difficulty: progressData.difficulty || 'normal',
      timeTaken: progressData.timeTaken,
    });

    // Update user XP
    const baseXP = 15;
    const bonusXP = Math.floor(progressData.score / 50);
    const totalXP = baseXP + bonusXP;
    
    updateUserXP(totalXP);
    
    // Award coins
    let coinsEarned = 2;
    if (progressData.score >= 80) coinsEarned = 5;
    if (progressData.score >= 95) coinsEarned = 8;
    
    LocalStorageManager.addCoinTransaction({
      userId: user.id,
      amount: coinsEarned,
      transactionType: 'game_reward',
      description: `Completed ${progressData.gameType} (Score: ${progressData.score})`,
      gameType: progressData.gameType,
    });

    // Check achievements
    checkAndUnlockAchievements();
    
    refreshGameProgress();
    return { progress, coinsEarned };
  };

  const updateUserXP = (xpGain: number) => {
    if (!user) return;

    let newXP = (user.xp || 0) + xpGain;
    let newLevel: number;
    
    if (newXP < 2000) {
      newLevel = Math.floor(newXP / 200) + 1;
      newLevel = Math.min(newLevel, 10);
    } else if (newXP >= 2000 && (user.level || 1) < 10) {
      newLevel = 10;
    } else if (newXP >= 2000) {
      const excessXP = newXP - 2000;
      newLevel = 11 + Math.floor(excessXP / 300);
    } else {
      newLevel = user.level || 1;
    }

    const updatedUser = { ...user, xp: newXP, level: newLevel };
    LocalStorageManager.updateUser(updatedUser);
  };

  const checkAndUnlockAchievements = () => {
    if (!user) return [];

    const achievements = LocalStorageManager.getAchievements();
    const userAchievements = LocalStorageManager.getUserAchievements(user.id);
    const userProgress = LocalStorageManager.getGameProgress(user.id);
    const newlyUnlocked: any[] = [];

    achievements.forEach(achievement => {
      const alreadyUnlocked = userAchievements.find(ua => ua.achievementId === achievement.id);
      if (alreadyUnlocked) return;

      let shouldUnlock = false;

      switch (achievement.requirement.type) {
        case 'xp':
          shouldUnlock = (user.xp || 0) >= achievement.requirement.value;
          break;
        case 'games_played':
          shouldUnlock = userProgress.length >= achievement.requirement.value;
          break;
        case 'game_count':
          const gameCount = userProgress.filter(p => p.gameType === achievement.requirement.game).length;
          shouldUnlock = gameCount >= achievement.requirement.value;
          break;
      }

      if (shouldUnlock) {
        LocalStorageManager.unlockAchievement(user.id, achievement.id);
        newlyUnlocked.push(achievement);
      }
    });

    return newlyUnlocked;
  };

  const refreshGameProgress = () => {
    if (user) {
      setGameProgress(LocalStorageManager.getGameProgress(user.id));
    }
  };

  useEffect(() => {
    refreshGameProgress();
  }, [user]);

  return {
    gameProgress,
    addGameProgress,
    refreshGameProgress,
  };
}

export function useStaticAchievements() {
  const { user } = useStaticAuth();
  const [achievements, setAchievements] = useState<any[]>([]);
  const [userAchievements, setUserAchievements] = useState<any[]>([]);

  const refreshAchievements = () => {
    setAchievements(LocalStorageManager.getAchievements());
    if (user) {
      setUserAchievements(LocalStorageManager.getUserAchievements(user.id));
    }
  };

  useEffect(() => {
    refreshAchievements();
  }, [user]);

  return {
    achievements,
    userAchievements,
    refreshAchievements,
  };
}

export function useStaticTrees() {
  const { user } = useStaticAuth();
  const [trees, setTrees] = useState<any[]>([]);

  const plantTree = (treeData: any) => {
    if (!user) return;

    const tree = LocalStorageManager.plantTree({
      userId: user.id,
      treeType: treeData.treeType,
      growthStage: 1,
      xpContributed: 0,
      decorations: [],
    });

    refreshTrees();
    return tree;
  };

  const growTree = (treeId: string, xpToContribute: number) => {
    if (!user) return;

    const userTrees = LocalStorageManager.getUserTrees(user.id);
    const tree = userTrees.find(t => t.id === treeId);
    if (!tree) return;

    const previousStage = tree.growthStage;
    tree.xpContributed += xpToContribute;

    // Calculate new growth stage based on XP
    let newStage = 1;
    if (tree.xpContributed >= 100) newStage = 2;
    if (tree.xpContributed >= 250) newStage = 3;
    if (tree.xpContributed >= 500) newStage = 4;
    if (tree.xpContributed >= 1000) newStage = 5;

    tree.growthStage = newStage;
    LocalStorageManager.updateTree(tree);
    refreshTrees();

    return { tree, previousStage };
  };

  const refreshTrees = () => {
    if (user) {
      setTrees(LocalStorageManager.getUserTrees(user.id));
    }
  };

  useEffect(() => {
    refreshTrees();
  }, [user]);

  return {
    trees,
    plantTree,
    growTree,
    refreshTrees,
  };
}

export function useStaticStore() {
  const { user } = useStaticAuth();
  const [storeItems, setStoreItems] = useState<any[]>([]);
  const [inventory, setInventory] = useState<any[]>([]);

  const purchaseItem = (itemId: string, quantity: number = 1) => {
    if (!user) return;

    const items = LocalStorageManager.getStoreItems();
    const item = items.find(i => i.id === itemId);
    if (!item) return;

    const totalCost = item.price * quantity;
    if (user.coins < totalCost) {
      throw new Error("Insufficient coins");
    }

    // Add to inventory
    LocalStorageManager.addToInventory({
      userId: user.id,
      storeItemId: itemId,
      quantity,
    });

    // Add transaction (this will automatically deduct coins)
    LocalStorageManager.addCoinTransaction({
      userId: user.id,
      amount: -totalCost,
      transactionType: 'purchase',
      description: `Purchased ${item.name} x${quantity}`,
    });

    refreshInventory();
  };

  const refreshStore = () => {
    // Force refresh store items from localStorage
    LocalStorageManager.initializeData(); // Ensure latest store items
    setStoreItems(LocalStorageManager.getStoreItems());
  };

  const refreshInventory = () => {
    if (user) {
      setInventory(LocalStorageManager.getUserInventory(user.id));
    }
  };

  useEffect(() => {
    refreshStore();
    refreshInventory();
  }, [user]);

  return {
    storeItems,
    inventory,
    purchaseItem,
    refreshStore,
    refreshInventory,
  };
}

export function useStaticJournal() {
  const { user } = useStaticAuth();
  const [journalEntries, setJournalEntries] = useState<any[]>([]);

  const addJournalEntry = (entryData: any) => {
    if (!user) return;

    const entry = LocalStorageManager.addJournalEntry({
      userId: user.id,
      focusLevel: entryData.focusLevel,
      energyLevel: entryData.energyLevel,
      moodLevel: entryData.moodLevel,
      notes: entryData.notes,
    });

    refreshJournal();
    return entry;
  };

  const refreshJournal = () => {
    if (user) {
      setJournalEntries(LocalStorageManager.getJournalEntries(user.id));
    }
  };

  useEffect(() => {
    refreshJournal();
  }, [user]);

  return {
    journalEntries,
    addJournalEntry,
    refreshJournal,
  };
}

export function useStaticCoinTransactions() {
  const { user } = useStaticAuth();
  const [transactions, setTransactions] = useState<any[]>([]);

  const refreshTransactions = () => {
    if (user) {
      setTransactions(LocalStorageManager.getCoinTransactions(user.id));
    }
  };

  useEffect(() => {
    refreshTransactions();
  }, [user]);

  return {
    transactions,
    refreshTransactions,
  };
}