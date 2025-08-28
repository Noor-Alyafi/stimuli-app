import { motion } from "framer-motion";
import { PerfectCartoonTree } from "./PerfectCartoonTree";

interface GrowthTreeProps {
  xp: number;
  level: number;
  achievements?: number;
  className?: string;
}

export const GrowthTree = ({ xp, level, achievements = 0, className = "" }: GrowthTreeProps) => {
  
  // Determine tree type based on level progression
  const getTreeType = () => {
    if (level >= 10) return 'rainbow';
    if (level >= 7) return 'cherry';  
    if (level >= 4) return 'willow';
    return 'oak';
  };

  // Calculate growth stage based on level with special rules for levels 7+ 
  const getGrowthStage = () => {
    if (level <= 2) return 1; // Seed stage
    if (level <= 4) return 2; // Sprout stage
    if (level <= 6) return 3; // Sapling stage
    if (level <= 7) return 4; // Tree stage
    if (level <= 9) return 4; // Level 8-9 looks like level 7 (Tree stage)
    if (level >= 10) return 5; // Level 10+ is Mature stage
    return Math.min(Math.max(Math.floor(level / 2) + 1, 1), 5);
  };

  const treeType = getTreeType();
  const growthStage = getGrowthStage();

  return (
    <div className={`flex flex-col items-center ${className}`}>
      {/* Large Growth Tree using the cute cartoon style */}
      <div className="flex justify-center mb-4">
        <PerfectCartoonTree
          type={treeType}
          stage={growthStage}
          xpContributed={xp}
          size="large"
          className="hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Level indicator */}
      <motion.div
        className="mb-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5 }}
      >
        <div className="bg-white dark:bg-gray-800 rounded-full px-4 py-2 shadow-md border">
          <span className="text-lg font-semibold text-navy dark:text-cyan">
            Level {level}
          </span>
        </div>
      </motion.div>

      {/* Progress info */}
      <div className="text-center space-y-2">
        <div className="flex justify-between items-center gap-8 text-sm text-gray-600 dark:text-gray-400">
          <div className="text-center">
            <div className="font-semibold text-green-600">{xp}</div>
            <div>Total XP</div>
          </div>
          <div className="text-center">
            <div className="font-semibold text-blue-600">{growthStage}</div>
            <div>Growth Stage</div>
          </div>
          <div className="text-center">
            <div className="font-semibold text-purple-600">{achievements}</div>
            <div>Achievements</div>
          </div>
        </div>
        
        <div className="text-xs text-gray-500 mt-2">
          {growthStage === 1 && "🌱 Your journey begins!"}
          {growthStage === 2 && "🌿 Growing strong!"}
          {growthStage === 3 && "🌳 Your mind is blooming!"}
          {growthStage === 4 && "🏆 Impressive growth!"}
          {growthStage === 5 && "👑 Neural mastery achieved!"}
        </div>
      </div>
    </div>
  );
};