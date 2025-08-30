// Local storage utilities for static deployment
export interface StoredUser {
  id: string;
  email: string;
  username: string;
  firstName?: string;
  lastName?: string;
  xp: number;
  level: number;
  streak: number;
  coins: number;
  totalTreesPlanted: number;
  lastLoginDate?: string;
  createdAt: string;
}

export interface StoredGameProgress {
  id: string;
  userId: string;
  gameType: string;
  score: number;
  completedAt: string;
  difficulty: string;
  timeTaken: number;
}

export interface StoredAchievement {
  id: string;
  key: string;
  name: string;
  description: string;
  xpReward: number;
  iconType: string;
  requirement: any;
}

export interface StoredUserAchievement {
  id: string;
  userId: string;
  achievementId: string;
  unlockedAt: string;
}

export interface StoredTree {
  id: string;
  userId: string;
  treeType: string;
  growthStage: number;
  xpContributed: number;
  plantedAt: string;
  decorations: string[];
  lastWatered?: string;
}

export interface StoredInventoryItem {
  id: string;
  userId: string;
  storeItemId: string;
  quantity: number;
  purchasedAt: string;
}

export interface StoredCoinTransaction {
  id: string;
  userId: string;
  amount: number;
  transactionType: string;
  description: string;
  gameType?: string;
  createdAt: string;
}

export interface StoredJournalEntry {
  id: string;
  userId: string;
  focusLevel: number;
  energyLevel: number;
  moodLevel: number;
  notes?: string;
  createdAt: string;
}

export interface StoredStoreItem {
  id: string;
  itemType: string;
  name: string;
  description: string;
  price: number;
  category: string;
  isAvailable: boolean;
}

// Type aliases for compatibility with components expecting @shared types
export type User = StoredUser;
export type UserTree = StoredTree;
export type UserInventory = StoredInventoryItem;
export type StoreItem = StoredStoreItem;

// Initialize default data
const defaultAchievements: StoredAchievement[] = [
  {
    id: "1",
    key: "neural-spark",
    name: "Neural Spark",
    description: "Your brain's warming up!",
    xpReward: 0,
    iconType: "⚡",
    requirement: { type: "xp", value: 50 },
  },
  {
    id: "2",
    key: "cortex-climber",
    name: "Cortex Climber",
    description: "Scaling the mental mountain!",
    xpReward: 0,
    iconType: "🧗‍♀️",
    requirement: { type: "xp", value: 100 },
  },
  {
    id: "3",
    key: "memory-mage",
    name: "Memory Mage",
    description: "You've got memory magic!",
    xpReward: 0,
    iconType: "🧙‍♂️",
    requirement: { type: "xp", value: 200 },
  },
  {
    id: "4",
    key: "focus-master",
    name: "Focus Master",
    description: "Laser-focused excellence!",
    xpReward: 100,
    iconType: "🎯",
    requirement: { type: "xp", value: 500 },
  },
  {
    id: "5",
    key: "sensory-explorer",
    name: "Sensory Explorer",
    description: "For being curious AF",
    xpReward: 50,
    iconType: "🔍",
    requirement: { type: "games_played", value: 6 },
  },
  {
    id: "6",
    key: "synesthetic-pro",
    name: "Synesthetic Pro",
    description: "Complete 5 color-echo games",
    xpReward: 75,
    iconType: "🎨",
    requirement: { type: "game_count", game: "color-echo", value: 5 },
  },
  {
    id: "7",
    key: "tree-master",
    name: "Tree Master",
    description: "Congratulations! You grew your first tree to full maturity!",
    xpReward: 200,
    iconType: "🌳",
    requirement: { type: "xp", value: 2000 },
  },
];

const defaultStoreItems: StoredStoreItem[] = [
  {
    id: "1",
    itemType: "tree_seed",
    name: "Cherry Blossom Seed",
    description: "Plant a beautiful cherry blossom tree that grows pink petals",
    price: 25,
    category: "seeds",
    isAvailable: true,
  },
  {
    id: "2",
    itemType: "tree_seed",
    name: "Rainbow Eucalyptus Seed",
    description: "A magical tree with multicolored bark - rare and special!",
    price: 50,
    category: "seeds",
    isAvailable: true,
  },
  {
    id: "7",
    itemType: "tree_seed",
    name: "Oak Seed",
    description: "Classic oak tree - strong and majestic with beautiful green foliage",
    price: 15,
    category: "seeds",
    isAvailable: true,
  },
  {
    id: "8",
    itemType: "tree_seed",
    name: "Cherry Seed",
    description: "Beautiful cherry tree with stunning pink blossoms",
    price: 25,
    category: "seeds",
    isAvailable: true,
  },
  {
    id: "9",
    itemType: "tree_seed",
    name: "Pine Seed",
    description: "Evergreen pine tree - perfect for a forest feel",
    price: 20,
    category: "seeds",
    isAvailable: true,
  },
  {
    id: "10",
    itemType: "tree_seed",
    name: "Maple Seed",
    description: "Vibrant maple tree with gorgeous orange-red autumn colors",
    price: 30,
    category: "seeds",
    isAvailable: true,
  },
  {
    id: "11",
    itemType: "tree_seed",
    name: "Birch Seed",
    description: "Elegant birch tree with distinctive white bark and light green leaves",
    price: 22,
    category: "seeds",
    isAvailable: true,
  },
  {
    id: "12",
    itemType: "tree_seed",
    name: "Sakura Seed",
    description: "Delicate Japanese cherry blossom tree with soft pink flowers",
    price: 35,
    category: "seeds",
    isAvailable: true,
  },
  {
    id: "3",
    itemType: "tree_fertilizer",
    name: "Growth Booster",
    description: "Instantly advance your tree to the next growth stage",
    price: 30,
    category: "boosters",
    isAvailable: true,
  },
  {
    id: "4",
    itemType: "tree_fertilizer",
    name: "Miracle Grow",
    description: "Doubles XP contribution for tree growth",
    price: 20,
    category: "boosters",
    isAvailable: true,
  },
  {
    id: "5",
    itemType: "decoration",
    name: "Fairy Lights",
    description: "Add magical twinkling lights to your trees",
    price: 35,
    category: "decorations",
    isAvailable: true,
  },
  {
    id: "6",
    itemType: "decoration",
    name: "Garden Gnome",
    description: "A friendly gnome to watch over your garden",
    price: 40,
    category: "decorations",
    isAvailable: true,
  },
];

export class LocalStorageManager {
  private static generateId(): string {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }

  // Initialize data if not exists
  static initializeData(): void {
    if (!localStorage.getItem('stimuli_achievements')) {
      localStorage.setItem('stimuli_achievements', JSON.stringify(defaultAchievements));
    }
    if (!localStorage.getItem('stimuli_store_items')) {
      localStorage.setItem('stimuli_store_items', JSON.stringify(defaultStoreItems));
    }
    if (!localStorage.getItem('stimuli_demo_user')) {
      this.createDemoUser();
    }
  }

  static createDemoUser(): void {
    const demoUser: StoredUser = {
      id: "demo-user",
      email: "demo@stimuli.com",
      username: "demo",
      firstName: "Demo",
      lastName: "User",
      xp: 0,
      level: 1,
      streak: 0,
      coins: 50,
      totalTreesPlanted: 0,
      createdAt: new Date().toISOString(),
    };
    localStorage.setItem('stimuli_current_user', JSON.stringify(demoUser));
    localStorage.setItem('stimuli_demo_user', JSON.stringify(demoUser));
  }

  // User management
  static getCurrentUser(): StoredUser | null {
    const user = localStorage.getItem('stimuli_current_user');
    return user ? JSON.parse(user) : null;
  }

  static setCurrentUser(user: StoredUser): void {
    localStorage.setItem('stimuli_current_user', JSON.stringify(user));
  }

  static createUser(userData: Partial<StoredUser>): StoredUser {
    const user: StoredUser = {
      id: this.generateId(),
      email: userData.email!,
      username: userData.username!,
      firstName: userData.firstName,
      lastName: userData.lastName,
      xp: 0,
      level: 1,
      streak: 0,
      coins: 50,
      totalTreesPlanted: 0,
      createdAt: new Date().toISOString(),
    };

    // Store user in registered users list
    const users = this.getRegisteredUsers();
    users.push(user);
    localStorage.setItem('stimuli_users', JSON.stringify(users));
    
    this.setCurrentUser(user);
    return user;
  }

  static getRegisteredUsers(): StoredUser[] {
    const users = localStorage.getItem('stimuli_users');
    return users ? JSON.parse(users) : [];
  }

  static findUserByUsername(username: string): StoredUser | null {
    const users = this.getRegisteredUsers();
    return users.find(user => user.username === username) || null;
  }

  static findUserByEmail(email: string): StoredUser | null {
    const users = this.getRegisteredUsers();
    return users.find(user => user.email === email) || null;
  }

  static updateUser(user: StoredUser): void {
    // Update current user
    this.setCurrentUser(user);
    
    // Update in registered users list
    const users = this.getRegisteredUsers();
    const index = users.findIndex(u => u.id === user.id);
    if (index !== -1) {
      users[index] = user;
      localStorage.setItem('stimuli_users', JSON.stringify(users));
    }
  }

  // Game progress
  static addGameProgress(progress: Omit<StoredGameProgress, 'id' | 'completedAt'>): StoredGameProgress {
    const gameProgress: StoredGameProgress = {
      ...progress,
      id: this.generateId(),
      completedAt: new Date().toISOString(),
    };

    const allProgress = this.getGameProgress(progress.userId);
    allProgress.push(gameProgress);
    localStorage.setItem(`stimuli_game_progress_${progress.userId}`, JSON.stringify(allProgress));
    
    return gameProgress;
  }

  static getGameProgress(userId: string, gameType?: string): StoredGameProgress[] {
    const progress = localStorage.getItem(`stimuli_game_progress_${userId}`);
    const allProgress = progress ? JSON.parse(progress) : [];
    return gameType ? allProgress.filter((p: StoredGameProgress) => p.gameType === gameType) : allProgress;
  }

  // Achievements
  static getAchievements(): StoredAchievement[] {
    const achievements = localStorage.getItem('stimuli_achievements');
    return achievements ? JSON.parse(achievements) : defaultAchievements;
  }

  static getUserAchievements(userId: string): StoredUserAchievement[] {
    const achievements = localStorage.getItem(`stimuli_user_achievements_${userId}`);
    return achievements ? JSON.parse(achievements) : [];
  }

  static unlockAchievement(userId: string, achievementId: string): void {
    const userAchievements = this.getUserAchievements(userId);
    const alreadyUnlocked = userAchievements.find(ua => ua.achievementId === achievementId);
    
    if (!alreadyUnlocked) {
      const newUserAchievement: StoredUserAchievement = {
        id: this.generateId(),
        userId,
        achievementId,
        unlockedAt: new Date().toISOString(),
      };
      
      userAchievements.push(newUserAchievement);
      localStorage.setItem(`stimuli_user_achievements_${userId}`, JSON.stringify(userAchievements));
      
      // Award coins for achievement
      this.addCoinTransaction({
        userId,
        amount: 20,
        transactionType: 'achievement_reward',
        description: 'Achievement unlocked!',
      });
    }
  }

  // Trees
  static getUserTrees(userId: string): StoredTree[] {
    const trees = localStorage.getItem(`stimuli_trees_${userId}`);
    return trees ? JSON.parse(trees) : [];
  }

  static plantTree(tree: Omit<StoredTree, 'id' | 'plantedAt'>): StoredTree {
    const newTree: StoredTree = {
      ...tree,
      id: this.generateId(),
      plantedAt: new Date().toISOString(),
    };

    const trees = this.getUserTrees(tree.userId);
    trees.push(newTree);
    localStorage.setItem(`stimuli_trees_${tree.userId}`, JSON.stringify(trees));
    
    return newTree;
  }

  static updateTree(tree: StoredTree): void {
    const trees = this.getUserTrees(tree.userId);
    const index = trees.findIndex(t => t.id === tree.id);
    if (index !== -1) {
      trees[index] = tree;
      localStorage.setItem(`stimuli_trees_${tree.userId}`, JSON.stringify(trees));
    }
  }

  // Store and inventory
  static getStoreItems(): StoredStoreItem[] {
    const items = localStorage.getItem('stimuli_store_items');
    return items ? JSON.parse(items) : defaultStoreItems;
  }

  static getUserInventory(userId: string): StoredInventoryItem[] {
    const inventory = localStorage.getItem(`stimuli_inventory_${userId}`);
    return inventory ? JSON.parse(inventory) : [];
  }

  static addToInventory(item: Omit<StoredInventoryItem, 'id' | 'purchasedAt'>): void {
    const inventory = this.getUserInventory(item.userId);
    const newItem: StoredInventoryItem = {
      ...item,
      id: this.generateId(),
      purchasedAt: new Date().toISOString(),
    };
    
    inventory.push(newItem);
    localStorage.setItem(`stimuli_inventory_${item.userId}`, JSON.stringify(inventory));
  }

  // Coin transactions
  static addCoinTransaction(transaction: Omit<StoredCoinTransaction, 'id' | 'createdAt'>): void {
    const newTransaction: StoredCoinTransaction = {
      ...transaction,
      id: this.generateId(),
      createdAt: new Date().toISOString(),
    };

    const transactions = this.getCoinTransactions(transaction.userId);
    transactions.push(newTransaction);
    localStorage.setItem(`stimuli_coin_transactions_${transaction.userId}`, JSON.stringify(transactions));

    // Update user coins
    const user = this.getCurrentUser();
    if (user && user.id === transaction.userId) {
      user.coins = (user.coins || 0) + transaction.amount;
      this.updateUser(user);
    }
  }

  static getCoinTransactions(userId: string): StoredCoinTransaction[] {
    const transactions = localStorage.getItem(`stimuli_coin_transactions_${userId}`);
    return transactions ? JSON.parse(transactions) : [];
  }

  // Journal entries
  static addJournalEntry(entry: Omit<StoredJournalEntry, 'id' | 'createdAt'>): StoredJournalEntry {
    const newEntry: StoredJournalEntry = {
      ...entry,
      id: this.generateId(),
      createdAt: new Date().toISOString(),
    };

    const entries = this.getJournalEntries(entry.userId);
    entries.push(newEntry);
    localStorage.setItem(`stimuli_journal_${entry.userId}`, JSON.stringify(entries));
    
    return newEntry;
  }

  static getJournalEntries(userId: string): StoredJournalEntry[] {
    const entries = localStorage.getItem(`stimuli_journal_${userId}`);
    return entries ? JSON.parse(entries) : [];
  }

  // Logout
  static logout(): void {
    localStorage.removeItem('stimuli_current_user');
  }
}