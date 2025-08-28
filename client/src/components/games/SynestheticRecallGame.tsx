import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface SynestheticRecallGameProps {
  onComplete: (score: number, timeTaken: number) => void;
}

interface WordColor {
  word: string;
  color: string;
  colorName: string;
}

const wordColorPairs: WordColor[] = [
  { word: "Ocean", color: "#4ECDC4", colorName: "Teal" },
  { word: "Fire", color: "#FF6B6B", colorName: "Red" },
  { word: "Sky", color: "#45B7D1", colorName: "Blue" },
  { word: "Grass", color: "#96CEB4", colorName: "Green" },
  { word: "Sun", color: "#FFEAA7", colorName: "Yellow" },
  { word: "Lavender", color: "#DDA0DD", colorName: "Purple" },
  { word: "Orange", color: "#FFB347", colorName: "Orange" },
  { word: "Rose", color: "#FFB6C1", colorName: "Pink" },
  { word: "Storm", color: "#708090", colorName: "Gray" },
  { word: "Forest", color: "#228B22", colorName: "Dark Green" },
  { word: "Snow", color: "#F8F8FF", colorName: "White" },
  { word: "Night", color: "#191970", colorName: "Dark Blue" },
];

// Use the exact colors from wordColorPairs to ensure consistency
const colors = ["#4ECDC4", "#FF6B6B", "#45B7D1", "#96CEB4", "#FFEAA7", "#DDA0DD", "#FFB347", "#FFB6C1", "#708090", "#228B22", "#F8F8FF", "#191970"];

export function SynestheticRecallGame({ onComplete }: SynestheticRecallGameProps) {
  const [gameState, setGameState] = useState<'intro' | 'study' | 'playing' | 'feedback'>('intro');
  const [currentLevel, setCurrentLevel] = useState(1);
  const [studyPairs, setStudyPairs] = useState<WordColor[]>([]);
  const [currentWord, setCurrentWord] = useState<string>('');
  const [correctColor, setCorrectColor] = useState<string>('');
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [gameStartTime, setGameStartTime] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | ''>('');
  const [timeLeft, setTimeLeft] = useState(60);
  const [studyTimeLeft, setStudyTimeLeft] = useState(8);
  const [roundsLeft, setRoundsLeft] = useState(0);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const studyTimerRef = useRef<NodeJS.Timeout | null>(null);

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
    if (gameState === 'study' && studyTimeLeft > 0) {
      studyTimerRef.current = setInterval(() => {
        setStudyTimeLeft(prev => {
          if (prev <= 1) {
            startPlaying();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (studyTimerRef.current) {
      clearInterval(studyTimerRef.current);
    }

    return () => {
      if (studyTimerRef.current) {
        clearInterval(studyTimerRef.current);
      }
    };
  }, [gameState, studyTimeLeft]);

  const generateStudyPairs = () => {
    const numPairs = Math.min(3 + Math.floor(currentLevel / 2), 6);
    const shuffled = [...wordColorPairs].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, numPairs);
    setStudyPairs(selected);
    setRoundsLeft(numPairs);
  };

  const startGame = () => {
    setGameState('study');
    setGameStartTime(Date.now());
    setTimeLeft(60);
    setScore(0);
    setStreak(0);
    setCurrentLevel(1);
    setStudyTimeLeft(8);
    generateStudyPairs();
  };

  const startPlaying = () => {
    setGameState('playing');
    nextQuestion();
  };

  const nextQuestion = () => {
    if (roundsLeft <= 0) {
      setCurrentLevel(prev => prev + 1);
      generateStudyPairs();
      setGameState('study');
      setStudyTimeLeft(8);
      return;
    }

    const randomPair = studyPairs[Math.floor(Math.random() * studyPairs.length)];
    setCurrentWord(randomPair.word);
    setCorrectColor(randomPair.color);
    setRoundsLeft(prev => prev - 1);
  };

  const handleColorClick = (color: string) => {
    if (gameState !== 'playing') return;
    
    if (color === correctColor) {
      setFeedback('correct');
      const basePoints = 25 + (currentLevel * 5);
      const streakBonus = streak * 4;
      const totalPoints = basePoints + streakBonus;
      
      setScore(prev => prev + totalPoints);
      setStreak(prev => prev + 1);
      
      setTimeout(() => {
        setFeedback('');
        if (timeLeft > 0) {
          nextQuestion();
        } else {
          endGame();
        }
      }, 1200);
    } else {
      setFeedback('incorrect');
      setStreak(0);
      
      setTimeout(() => {
        setFeedback('');
        if (timeLeft > 0) {
          nextQuestion();
        } else {
          endGame();
        }
      }, 1200);
    }
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
              <div className="text-6xl">🌈</div>
              <h2 className="text-2xl font-bold">Synesthetic Recall</h2>
              <p className="text-gray-600 dark:text-gray-300">
                Study the word-color pairs, then match each word to its color from memory. 
                Train your brain to create stronger connections between words and colors!
              </p>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                  <strong>Study Phase:</strong> 8 seconds to memorize pairs
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                  <strong>Scoring:</strong> 25+ points per correct match
                </div>
                <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg">
                  <strong>Streak bonus:</strong> +4 points per consecutive success
                </div>
                <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded-lg">
                  <strong>Levels:</strong> More pairs as you advance
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

  if (gameState === 'study') {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center">
          <Badge variant="destructive" className="text-lg px-4 py-2">
            Study Time: {studyTimeLeft}s
          </Badge>
        </div>
        
        <Card>
          <CardContent className="p-6">
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold mb-2">Study These Word-Color Pairs</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Remember which color goes with each word!
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {studyPairs.map((pair, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center p-4 rounded-lg border-2 border-gray-200 dark:border-gray-600"
                >
                  <div className="text-2xl font-bold mb-2">{pair.word}</div>
                  <div 
                    className="w-16 h-16 rounded-full mx-auto border-2 border-gray-300 dark:border-gray-500"
                    style={{ backgroundColor: pair.color }}
                  />
                  <div className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                    {pair.colorName}
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
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
          <Badge variant="outline">Questions Left: {roundsLeft}</Badge>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-600 dark:text-gray-300">
            Time: {timeLeft}s
          </div>
          <Badge className="text-lg px-4 py-2">Score: {score}</Badge>
        </div>
      </div>

      {/* Question */}
      <Card>
        <CardContent className="p-8">
          <div className="text-center">
            <div className="text-sm text-gray-600 dark:text-gray-300 mb-4">
              What color was associated with this word?
            </div>
            <div className="text-4xl font-bold mb-8">{currentWord}</div>
            
            <div className="grid grid-cols-4 gap-4 max-w-md mx-auto">
              {colors.map((color, index) => (
                <motion.button
                  key={index}
                  onClick={() => handleColorClick(color)}
                  className="aspect-square rounded-full border-4 border-gray-300 dark:border-gray-600 hover:border-gray-500 dark:hover:border-gray-400 transition-all duration-200 hover:scale-105"
                  style={{ backgroundColor: color }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                />
              ))}
            </div>
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
                    `Perfect memory! Streak: ${streak}` : 
                    'Try to remember the color associations better!'
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