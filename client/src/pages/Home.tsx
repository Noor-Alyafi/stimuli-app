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
  const nextLevelXP = currentLevel * 100;
  const progressPercentage = ((currentXP % 100) / 100) * 100;
  
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
            <Card>
              <CardContent className="p-8">
                <h2 className="text-3xl font-inter font-bold text-navy mb-2">
                  Welcome back{(user as any)?.firstName ? `, ${(user as any).firstName}` : ''}!
                </h2>
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
                <div className="bg-gradient-to-r from-cyan/10 to-blue-500/10 rounded-xl p-6 border-l-4 border-cyan">
                  <h3 className="font-inter font-semibold text-navy mb-2">
                    Today's Challenge
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Complete 2 training sessions to maintain your streak
                  </p>
                  <Button 
                    className="bg-navy text-white hover:bg-navy/90"
                    onClick={() => {
                      // Navigate to training tab
                      const event = new CustomEvent('navigate', { detail: 'training' });
                      window.dispatchEvent(event);
                    }}
                  >
                    Start Training
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Daily Quote */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <Quote className="text-cyan" size={24} />
                  <h3 className="font-inter font-semibold text-navy">
                    Daily Motivation
                  </h3>
                </div>
                <p className="text-gray-700 text-lg italic">
                  "{todayQuote}"
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Growth Tree Visualization */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card>
            <CardContent className="p-8">
              <h3 className="font-inter font-semibold text-navy mb-6 text-center">
                Your Mind Tree
              </h3>
              
              <GrowthTree 
                xp={currentXP}
                level={currentLevel}
                achievements={(user as any)?.achievementCount || 0}
                className="w-full"
              />
              
              {/* Tree Stats */}
              <div className="mt-6 space-y-3 text-center">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <div className="text-lg font-semibold text-green-600">{currentXP}</div>
                    <div className="text-xs text-gray-600">Total XP</div>
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-blue-600">{currentLevel}</div>
                    <div className="text-xs text-gray-600">Level</div>
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-purple-600">{(user as any)?.achievementCount || 0}</div>
                    <div className="text-xs text-gray-600">Achievements</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
