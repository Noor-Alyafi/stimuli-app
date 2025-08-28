import { useQuery } from "@tanstack/react-query";
import { GrowthTree } from "@/components/GrowthTree";
import { PerfectCartoonTree } from "@/components/PerfectCartoonTree";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Quote } from "lucide-react";

const dailyQuotes = [
  "Your mind is like a muscle - the more you challenge it, the stronger it becomes.",
  "Every expert was once a beginner. Every pro was once an amateur.",
  "The brain that changes itself is the brain that grows.",
  "Small daily improvements lead to stunning long-term results.",
  "Your potential is limitless when you train consistently.",
  "Each challenge is an opportunity to grow stronger.",
  "Progress, not perfection, is the goal.",
];

export default function Home() {
  const { data: user } = useQuery({
    queryKey: ["/api/auth/user"],
    retry: false,
  });
  
  if (!user) return (
    <div className="min-h-screen bg-light-gray flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-r from-navy to-cyan rounded-2xl flex items-center justify-center mx-auto mb-4">
          <i className="fas fa-brain text-white text-2xl"></i>
        </div>
        <p className="text-gray-600">Loading...</p>
      </div>
    </div>
  );

  const currentXP = (user as any)?.xp || 0;
  const currentLevel = (user as any)?.level || 1;
  
  // Calculate next level XP based on new system
  let nextLevelXP: number;
  let progressPercentage: number;
  
  if (currentLevel < 10) {
    // Levels 1-9: Every 200 XP
    nextLevelXP = currentLevel * 200;
    progressPercentage = ((currentXP % 200) / 200) * 100;
  } else if (currentLevel === 10) {
    // Level 10 special case: 2000 XP for tree completion
    nextLevelXP = 2000;
    progressPercentage = (currentXP / 2000) * 100;
  } else {
    // Level 11+: Every 300 XP after 2000
    const excessLevels = currentLevel - 10;
    nextLevelXP = 2000 + (excessLevels * 300);
    const currentProgress = currentXP - 2000 - ((currentLevel - 11) * 300);
    progressPercentage = (currentProgress / 300) * 100;
  }
  
  const todayQuote = dailyQuotes[new Date().getDay()];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Welcome Section */}
        <div className="lg:col-span-2 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="bg-gradient-to-br from-white to-blue-50 dark:from-gray-800 dark:to-blue-900/20 border-2 border-blue-200 dark:border-blue-700 shadow-xl">
              <CardContent className="p-8">
                <div className="flex items-center gap-4 mb-2">
                  <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
                    <svg width="24" height="24" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="50" cy="30" r="15" fill="white"/>
                      <circle cx="35" cy="60" r="8" fill="white"/>
                      <circle cx="65" cy="60" r="8" fill="white"/>
                      <circle cx="50" cy="80" r="6" fill="white"/>
                    </svg>
                  </div>
                  <h2 className="text-3xl font-inter font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    Welcome back{(user as any)?.firstName ? `, ${(user as any).firstName}` : ''}!
                  </h2>
                </div>
                <p className="text-gray-600 text-lg mb-6">
                  Ready to train your mind today?
                </p>
                
                {/* XP Progress Bar */}
                <div className="mb-6">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Level {currentLevel} - Neural Explorer</span>
                    <span>{currentXP} / {nextLevelXP} XP</span>
                  </div>
                  <Progress value={progressPercentage} className="h-3" />
                </div>

                {/* Daily Challenge */}
                <motion.div 
                  className="bg-gradient-to-r from-cyan/10 to-blue-500/10 rounded-xl p-6 border-l-4 border-cyan"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <h3 className="font-inter font-semibold text-navy mb-2">
                    🎯 Today's Challenge
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Complete 2 training sessions to maintain your streak
                  </p>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button 
                      className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 shadow-lg"
                      onClick={() => {
                        // Navigate to training tab
                        const event = new CustomEvent('navigate', { detail: 'training' });
                        window.dispatchEvent(event);
                      }}
                    >
                      ⚡ Start Training
                    </Button>
                  </motion.div>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Daily Quote */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-2 border-purple-200 dark:border-purple-700 shadow-xl">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Quote className="text-purple-600" size={24} />
                  </motion.div>
                  <h3 className="font-inter font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    ✨ Daily Motivation
                  </h3>
                </div>
                <motion.p 
                  className="text-gray-700 dark:text-gray-300 text-lg italic"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  "{todayQuote}"
                </motion.p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Growth Tree Visualization */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 dark:from-green-900/20 dark:via-blue-900/20 dark:to-purple-900/20 rounded-xl p-6 border-2 border-green-200 dark:border-green-700"
        >
          <div className="text-center mb-4">
            <h3 className="text-xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              🌳 Your Mind Tree
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Watch your growth flourish
            </p>
          </div>
          
          <GrowthTree 
            xp={currentXP}
            level={currentLevel}
            achievements={(user as any)?.achievementCount || 0}
            className="w-full"
          />
        </motion.div>
      </div>
    </div>
  );
}
