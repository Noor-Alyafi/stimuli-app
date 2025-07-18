import { motion } from "framer-motion";
import { Brain, Flame, Palette, Trophy, Lock, Rocket, TreePine } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface AchievementBadgeProps {
  achievement: {
    key: string;
    name: string;
    description: string;
    xpReward: number;
    iconType: string;
  };
  isUnlocked: boolean;
  unlockedAt?: string;
  progress?: string;
}

const achievementIcons = {
  brain: Brain,
  flame: Flame,
  palette: Palette,
  trophy: Trophy,
  rocket: Rocket,
  tree: TreePine,
};

const achievementColors = {
  brain: "from-cyan to-blue-500",
  flame: "from-orange-500 to-red-500", 
  palette: "from-purple-500 to-pink-500",
  trophy: "from-yellow-500 to-orange-500",
  rocket: "from-green-500 to-teal-500",
  tree: "from-emerald-500 to-green-600",
};

export function AchievementBadge({ 
  achievement, 
  isUnlocked, 
  unlockedAt, 
  progress 
}: AchievementBadgeProps) {
  const IconComponent = achievementIcons[achievement.iconType as keyof typeof achievementIcons] || Trophy;
  const colorClass = isUnlocked 
    ? achievementColors[achievement.iconType as keyof typeof achievementColors] || "from-gray-500 to-gray-600"
    : "from-gray-300 to-gray-400";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: isUnlocked ? 1.02 : 1 }}
    >
      <Card className={`${isUnlocked ? 'border-2 border-cyan/20' : 'border-2 border-gray-200 opacity-75'}`}>
        <CardContent className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className={`w-12 h-12 bg-gradient-to-r ${colorClass} rounded-full flex items-center justify-center`}>
              {isUnlocked ? (
                <IconComponent className="text-white" size={24} />
              ) : (
                <Lock className="text-white" size={24} />
              )}
            </div>
            <div>
              <h3 className={`font-inter font-semibold ${isUnlocked ? 'text-navy' : 'text-gray-700'}`}>
                {achievement.name}
              </h3>
              <p className={`text-sm ${isUnlocked ? 'text-cyan' : 'text-gray-500'}`}>
                {isUnlocked ? 'Unlocked!' : 'Locked'}
              </p>
            </div>
          </div>
          
          <p className={`mb-4 ${isUnlocked ? 'text-gray-600' : 'text-gray-500'}`}>
            {achievement.description}
          </p>
          
          <div className="flex justify-between items-center">
            <span className={`text-sm ${isUnlocked ? 'text-gray-500' : 'text-gray-400'}`}>
              {isUnlocked && unlockedAt ? (
                `Earned: ${new Date(unlockedAt).toLocaleDateString()}`
              ) : (
                progress || "Not started"
              )}
            </span>
            <span className={`text-sm font-medium ${isUnlocked ? 'text-cyan' : 'text-gray-400'}`}>
              +{achievement.xpReward} XP
            </span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
