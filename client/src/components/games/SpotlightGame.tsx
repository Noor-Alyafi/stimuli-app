import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface SpotlightGameProps {
  onComplete: (score: number, timeTaken: number) => void;
}

interface Target {
  id: string;
  x: number;
  y: number;
  size: number;
  color: string;
  isOdd: boolean;
}

const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD'];

export function SpotlightGame({ onComplete }: SpotlightGameProps) {
  const [gameState, setGameState] = useState<'intro' | 'playing' | 'feedback'>('intro');
  const [currentLevel, setCurrentLevel] = useState(1);
  const [targets, setTargets] = useState<Target[]>([]);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [gameStartTime, setGameStartTime] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | ''>('');
  const [timeLeft, setTimeLeft] = useState(40);
  const [roundTimeLeft, setRoundTimeLeft] = useState(5);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const roundTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (gameState === 'playing' && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            endGame();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [gameState, timeLeft]);

  useEffect(() => {
    if (gameState === 'playing' && roundTimeLeft > 0) {
      roundTimerRef.current = setInterval(() => {
        setRoundTimeLeft(prev => {
          if (prev <= 1) {
            // Time's up - incorrect
            handleIncorrect();
            return 5;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (roundTimerRef.current) {
      clearInterval(roundTimerRef.current);
    }

    return () => {
      if (roundTimerRef.current) {
        clearInterval(roundTimerRef.current);
      }
    };
  }, [gameState, roundTimeLeft]);

  const generateTargets = () => {
    const newTargets: Target[] = [];
    const numTargets = Math.min(6 + Math.floor(currentLevel / 3), 12);
    const baseColor = colors[Math.floor(Math.random() * colors.length)];
    const oddColor = colors.find(c => c !== baseColor) || colors[0];
    
    for (let i = 0; i < numTargets; i++) {
      const isOdd = i === 0; // First target is always the odd one
      newTargets.push({
        id: `target-${i}`,
        x: Math.random() * 80 + 10, // 10-90% of container width
        y: Math.random() * 80 + 10, // 10-90% of container height
        size: Math.random() * 30 + 40, // 40-70px
        color: isOdd ? oddColor : baseColor,
        isOdd,
      });
    }
    
    // Shuffle so odd one isn't always first
    for (let i = newTargets.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newTargets[i], newTargets[j]] = [newTargets[j], newTargets[i]];
    }
    
    setTargets(newTargets);
  };

  const startGame = () => {
    setGameState('playing');
    setGameStartTime(Date.now());
    setTimeLeft(40);
    setScore(0);
    setStreak(0);
    setCurrentLevel(1);
    generateTargets();
    setRoundTimeLeft(5);
  };

  const handleTargetClick = (target: Target) => {
    if (gameState !== 'playing') return;
    
    if (target.isOdd) {
      handleCorrect();
    } else {
      handleIncorrect();
    }
  };

  const handleCorrect = () => {
    setFeedback('correct');
    const basePoints = 20 + (currentLevel * 5);
    const speedBonus = roundTimeLeft * 2;
    const streakBonus = streak * 3;
    const totalPoints = basePoints + speedBonus + streakBonus;
    
    setScore(prev => prev + totalPoints);
    setStreak(prev => prev + 1);
    setCurrentLevel(prev => prev + 1);
    
    setTimeout(() => {
      setFeedback('');
      if (timeLeft > 0) {
        generateTargets();
        setRoundTimeLeft(5);
      } else {
        endGame();
      }
    }, 1000);
  };

  const handleIncorrect = () => {
    setFeedback('incorrect');
    setStreak(0);
    
    setTimeout(() => {
      setFeedback('');
      if (timeLeft > 0) {
        generateTargets();
        setRoundTimeLeft(5);
      } else {
        endGame();
      }
    }, 1000);
  };

  const endGame = () => {
    const timeTaken = (Date.now() - gameStartTime) / 1000;
    onComplete(score, timeTaken);
  };

  if (gameState === 'intro') {
    return (
      <div className="max-w-2xl mx-auto text-center space-y-6">
        <Card>
          <CardContent className="p-8">
            <div className="space-y-4">
              <div className="text-6xl">🔍</div>
              <h2 className="text-2xl font-bold">Spotlight</h2>
              <p className="text-gray-600 dark:text-gray-300">
                Find the odd one out! Look carefully at all the shapes and click the one that's different.
                You have 5 seconds per round, so think fast!
              </p>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                  <strong>Goal:</strong> Find the different shape
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                  <strong>Scoring:</strong> 20+ points per correct answer
                </div>
                <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg">
                  <strong>Speed bonus:</strong> +2 points per second left
                </div>
                <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded-lg">
                  <strong>Streak bonus:</strong> +3 points per consecutive success
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Button
          onClick={startGame}
          size="lg"
          className="text-lg px-8 py-6"
        >
          Start Game
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Game Status */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Badge variant="secondary">Level {currentLevel}</Badge>
          <Badge variant="outline">Streak: {streak}</Badge>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant="destructive">Round: {roundTimeLeft}s</Badge>
          <div className="text-sm text-gray-600 dark:text-gray-300">
            Time: {timeLeft}s
          </div>
          <Badge className="text-lg px-4 py-2">Score: {score}</Badge>
        </div>
      </div>

      {/* Game Instructions */}
      <Card>
        <CardContent className="p-4">
          <div className="text-center text-sm text-gray-600 dark:text-gray-300">
            🎯 Click the shape that's different from the others
          </div>
        </CardContent>
      </Card>

      {/* Game Area */}
      <Card>
        <CardContent className="p-6">
          <div className="relative w-full h-96 bg-gray-50 dark:bg-gray-800 rounded-lg overflow-hidden">
            {targets.map((target) => (
              <motion.button
                key={target.id}
                onClick={() => handleTargetClick(target)}
                className="absolute rounded-full cursor-pointer hover:scale-110 transition-transform duration-200"
                style={{
                  left: `${target.x}%`,
                  top: `${target.y}%`,
                  width: `${target.size}px`,
                  height: `${target.size}px`,
                  backgroundColor: target.color,
                  transform: 'translate(-50%, -50%)',
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Round Progress */}
      <Card>
        <CardContent className="p-4">
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-red-500 to-orange-500 h-2 rounded-full transition-all duration-1000"
              style={{ width: `${(roundTimeLeft / 5) * 100}%` }}
            />
          </div>
          <div className="text-center text-sm text-gray-600 dark:text-gray-300 mt-2">
            {roundTimeLeft}s remaining
          </div>
        </CardContent>
      </Card>

      {/* Feedback */}
      <AnimatePresence>
        {feedback && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center"
          >
            <Card className={`${feedback === 'correct' ? 'border-green-500' : 'border-red-500'} border-2`}>
              <CardContent className="p-6">
                <div className={`text-2xl font-bold ${feedback === 'correct' ? 'text-green-600' : 'text-red-600'}`}>
                  {feedback === 'correct' ? '🎉 Correct!' : '❌ Incorrect'}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                  {feedback === 'correct' ? 
                    `Great spotting! Level ${currentLevel} completed.` : 
                    'Keep looking! The odd one out was there.'
                  }
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}