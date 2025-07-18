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
      <div className="mb-8">
        <h2 className="text-3xl font-inter font-bold text-navy mb-2">
          Achievements
        </h2>
        <p className="text-gray-600">
          Celebrate your cognitive milestones
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {allAchievements.map((achievement: any, index: number) => (
          <motion.div
            key={achievement.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
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
