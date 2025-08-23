import { useQuery } from "@tanstack/react-query";
import { AchievementBadge } from "@/components/AchievementBadge";
import { motion } from "framer-motion";

// Default achievements data
const defaultAchievements = [
  {
    id: 1,
    key: "neural-spark",
    name: "Neural Spark",
    description: "Complete your first brain training session",
    xpReward: 50,
    iconType: "brain",
  },
  {
    id: 2,
    key: "focused-flame",
    name: "Focused Flame",
    description: "Maintain a 7-day training streak",
    xpReward: 100,
    iconType: "flame",
  },
  {
    id: 3,
    key: "synesthetic-pro",
    name: "Synesthetic Pro",
    description: "Master all color-sound matching games",
    xpReward: 75,
    iconType: "palette",
  },
  {
    id: 4,
    key: "memory-master",
    name: "Memory Master",
    description: "Score 95% or higher on all memory games",
    xpReward: 150,
    iconType: "trophy",
  },
  {
    id: 5,
    key: "speed-demon",
    name: "Speed Demon",
    description: "Complete 10 games in under 5 minutes each",
    xpReward: 200,
    iconType: "rocket",
  },
  {
    id: 6,
    key: "tree-sage",
    name: "Tree Sage",
    description: "Grow your tree to maximum level",
    xpReward: 500,
    iconType: "tree",
  },
];

export default function Achievements() {
  const { data: achievements } = useQuery({
    queryKey: ["/api/achievements"],
    retry: false,
  });

  const { data: userAchievements } = useQuery({
    queryKey: ["/api/user-achievements"],
    retry: false,
  });

  // Use default achievements if API fails
  const allAchievements = achievements || defaultAchievements;
  const unlockedAchievements = userAchievements || [];

  const isUnlocked = (achievementId: number) => {
    return unlockedAchievements.some((ua: any) => ua.achievementId === achievementId);
  };

  const getUnlockedDate = (achievementId: number) => {
    const userAchievement = unlockedAchievements.find((ua: any) => ua.achievementId === achievementId);
    return userAchievement?.unlockedAt;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Modern Header */}
      <motion.div 
        className="text-center mb-12 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl p-8 border-2 border-purple-200 dark:border-purple-700"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            🏆 Achievement Gallery
          </h1>
        </motion.div>
        <motion.p 
          className="text-gray-600 dark:text-gray-400 text-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          Track your progress and unlock amazing rewards!
        </motion.p>
        
        {/* Achievement Stats */}
        <motion.div 
          className="flex justify-center gap-8 mt-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {unlockedAchievements.length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Unlocked</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {allAchievements.length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {allAchievements.length > 0 ? Math.round((unlockedAchievements.length / allAchievements.length) * 100) : 0}%
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Progress</div>
          </div>
        </motion.div>
      </motion.div>

      {/* Achievement Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {allAchievements.map((achievement: any, index: number) => (
          <motion.div
            key={achievement.id}
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ 
              delay: index * 0.1, 
              duration: 0.5,
              type: "spring",
              stiffness: 100
            }}
            whileHover={{ 
              y: -8,
              transition: { duration: 0.2 }
            }}
          >
            <AchievementBadge
              achievement={achievement}
              isUnlocked={isUnlocked(achievement.id)}
              unlockedAt={getUnlockedDate(achievement.id)}
              progress={!isUnlocked(achievement.id) ? "Not started" : undefined}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
