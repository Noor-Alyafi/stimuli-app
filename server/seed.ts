// Database seeding script to initialize store items
import { db } from './db';
import { storeItems } from '@shared/schema';
import { eq } from 'drizzle-orm';

const seedStoreItems = [
  {
    name: "Oak Tree Seed",
    description: "A classic oak tree seed for strong, steady growth.",
    price: 50,
    category: "seeds",
    itemType: "tree_seed",
    isAvailable: true
  },
  {
    name: "Cherry Blossom Seed",
    description: "Beautiful pink cherry blossom tree seed.",
    price: 75,
    category: "seeds", 
    itemType: "tree_seed",
    isAvailable: true
  },
  {
    name: "Willow Tree Seed",
    description: "Graceful willow tree seed for calm gardens.",
    price: 60,
    category: "seeds",
    itemType: "tree_seed", 
    isAvailable: true
  },
  {
    name: "Rainbow Tree Seed",
    description: "Rare magical rainbow tree seed - very special!",
    price: 200,
    category: "seeds",
    itemType: "tree_seed",
    isAvailable: true
  },
  {
    name: "Growth Fertilizer",
    description: "Boosts tree growth speed by 25%.",
    price: 25,
    category: "boosters",
    itemType: "tree_fertilizer",
    isAvailable: true
  },
  {
    name: "Golden Watering Can",
    description: "Increases tree XP gains by 15%.",
    price: 100,
    category: "boosters", 
    itemType: "tree_fertilizer",
    isAvailable: true
  }
];

export async function seedStore() {
  console.log('Seeding store items...');
  
  for (const item of seedStoreItems) {
    // Check if item already exists
    const existing = await db
      .select()
      .from(storeItems)
      .where(eq(storeItems.name, item.name));
      
    if (existing.length === 0) {
      await db.insert(storeItems).values(item);
      console.log(`Added store item: ${item.name}`);
    } else {
      console.log(`Store item already exists: ${item.name}`);
    }
  }
  
  console.log('Store seeding completed!');
}