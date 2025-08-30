import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Trophy, Zap, Timer, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useStaticGameProgress } from "@/hooks/useStaticData";
import { NotificationSystem, useNotifications } from "@/components/NotificationSystem";

interface GameContainerProps {
  gameType: string;
  name: string;
  children: React.ReactNode;
  onBack: () => void;
  score?: number;
  timeLeft?: number;
  totalTime?: number;
  onGameComplete?: (score: number, timeTaken: number) => void;
  showTimer?: boolean;
  showScore?: boolean;
  showGeneral?: (message: string, type?: "success" | "error" | "info") => void;
}

export function GameContainer({
  gameType,
  name,
  children,
  onBack,
  score = 0,
  timeLeft,
  totalTime,
  onGameComplete,
  showTimer = true,
  showScore = true,
  showGeneral,
}: GameContainerProps) {
  const [gameStarted, setGameStarted] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [finalTime, setFinalTime] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const { toast } = useToast();
  const { addGameProgress } = useStaticGameProgress();
  const {
    notifications,
    removeNotification,
    showXPGain,
    showCoinsGained,
    showCongratulations,
    showAchievement,
  } = useNotifications();

  const handleGameProgressSave = async (gameData: { gameType: string; score: number; timeTaken: number }) => {
    try {
      const result = addGameProgress(gameData);
      
      if (result) {
        // Calculate rewards based on score and performance
        const baseXP = 15; // Base XP for completing a game
        const bonusXP = Math.floor(gameData.score / 50); // Bonus XP based on score
        const xpEarned = baseXP + bonusXP;
        const coinsEarned = result.coinsEarned || Math.floor(gameData.score / 10); // Coins based on score
        
        // Show advanced animated reward notifications similar to tree growth
        setTimeout(() => {
          showXPGain(xpEarned);
        }, 500);
        
        setTimeout(() => {
          showCoinsGained(coinsEarned);
        }, 1000);
        
        setTimeout(() => {
          showCongratulations(`Game completed! Well done!`);
        }, 1500);
      }
    } catch (error) {
      console.error("Error saving progress:", error);
      toast({
        title: "Error",
        description: "Failed to save progress. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleGameComplete = (score: number, timeTaken: number) => {
    setFinalScore(score);
    setFinalTime(timeTaken);
    setGameCompleted(true);
    
    // Save progress using static data
    handleGameProgressSave({
      gameType,
      score,
      timeTaken,
    });
    
    onGameComplete?.(score, timeTaken);
  };

  const getScoreRating = (score: number) => {
    if (score >= 90) return { text: "Excellent!", color: "text-green-600", icon: <Trophy className="w-5 h-5" /> };
    if (score >= 70) return { text: "Good!", color: "text-blue-600", icon: <Star className="w-5 h-5" /> };
    if (score >= 50) return { text: "Not bad!", color: "text-yellow-600", icon: <Zap className="w-5 h-5" /> };
    return { text: "Keep practicing!", color: "text-gray-600", icon: <Timer className="w-5 h-5" /> };
  };

  const rating = getScoreRating(finalScore);

  if (gameCompleted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 p-4">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="text-center">
              <CardHeader className="pb-4">
                <motion.div
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="flex justify-center mb-4"
                >
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                    {rating.icon}
                  </div>
                </motion.div>
                <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  {name} Complete!
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
                  className="text-center"
                >
                  <div className="text-4xl font-bold mb-2">{finalScore}</div>
                  <div className={`text-lg font-semibold ${rating.color}`}>
                    {rating.text}
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="grid grid-cols-3 gap-4"
                >
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                    <div className="text-sm text-gray-600 dark:text-gray-400">Time</div>
                    <div className="text-2xl font-bold">{Math.round(finalTime)}s</div>
                  </div>
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30 rounded-lg p-4 border border-purple-200 dark:border-purple-700">
                    <div className="text-sm text-purple-600 dark:text-purple-400">XP Earned</div>
                    <div className="text-2xl font-bold text-purple-600">+{15 + Math.floor(finalScore / 50)}</div>
                  </div>
                  <div className="bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-900/30 dark:to-amber-900/30 rounded-lg p-4 border border-yellow-200 dark:border-yellow-700">
                    <div className="text-sm text-yellow-600 dark:text-yellow-400">Coins Earned</div>
                    <div className="text-2xl font-bold text-yellow-600">+{Math.floor(finalScore / 10)}</div>
                  </div>
                </motion.div>

                {showCelebration && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="bg-gradient-to-r from-yellow-100 to-orange-100 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-lg p-4 border-2 border-yellow-300 dark:border-yellow-600"
                  >
                    <div className="text-lg font-bold text-yellow-800 dark:text-yellow-200 mb-2">
                      🎉 Achievement Unlocked!
                    </div>
                    <div className="text-yellow-700 dark:text-yellow-300">
                      You've earned a new badge! Check your achievements.
                    </div>
                  </motion.div>
                )}

                <div className="space-y-3">
                  <Button
                    onClick={() => {
                      setGameCompleted(false);
                      setGameStarted(false);
                      setShowCelebration(false);
                    }}
                    className="w-full"
                    size="lg"
                  >
                    Play Again
                  </Button>
                  <Button
                    onClick={onBack}
                    variant="outline"
                    className="w-full"
                    size="lg"
                  >
                    Back to Games
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button
            onClick={onBack}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          
          <div className="flex items-center gap-4">
            {showScore && (
              <Badge variant="secondary" className="text-lg px-4 py-2">
                Score: {score}
              </Badge>
            )}
            {showTimer && timeLeft !== undefined && totalTime && (
              <div className="flex items-center gap-2">
                <Timer className="w-4 h-4" />
                <div className="text-sm font-medium">
                  {Math.ceil(timeLeft)}s
                </div>
                <Progress 
                  value={(timeLeft / totalTime) * 100} 
                  className="w-20"
                />
              </div>
            )}
          </div>
        </div>

        {/* Game Title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            {name}
          </h1>
        </motion.div>

        {/* Game Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          {children}
        </motion.div>

        {/* Hidden completion handler */}
        <div style={{ display: 'none' }}>
          <button onClick={() => handleGameComplete(score, finalTime)} ref={(el) => {
            if (el) {
              (window as any).completeGame = (score: number, timeTaken: number) => {
                handleGameComplete(score, timeTaken);
              };
            }
          }} />
        </div>
      </div>
      
      {/* Notification System */}
      <NotificationSystem 
        notifications={notifications}
        onRemove={removeNotification}
      />
    </div>
  );
}