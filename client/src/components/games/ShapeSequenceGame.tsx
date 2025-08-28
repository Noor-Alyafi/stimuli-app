import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Circle, Square, Triangle, Diamond, Heart, Star } from "lucide-react";
import { NotificationSystem, useNotifications } from "@/components/NotificationSystem";

interface ShapeSequenceGameProps {
  onComplete: (score: number, timeTaken: number) => void;
}

interface Shape {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
}

const shapes: Shape[] = [
  { id: 'circle', name: 'Circle', icon: <Circle className="w-8 h-8" />, color: '#FF6B6B' },
  { id: 'square', name: 'Square', icon: <Square className="w-8 h-8" />, color: '#4ECDC4' },
  { id: 'triangle', name: 'Triangle', icon: <Triangle className="w-8 h-8" />, color: '#45B7D1' },
  { id: 'diamond', name: 'Diamond', icon: <Diamond className="w-8 h-8" />, color: '#96CEB4' },
  { id: 'heart', name: 'Heart', icon: <Heart className="w-8 h-8" />, color: '#FFEAA7' },
  { id: 'star', name: 'Star', icon: <Star className="w-8 h-8" />, color: '#DDA0DD' },
];

export function ShapeSequenceGame({ onComplete }: ShapeSequenceGameProps) {
  const [gameState, setGameState] = useState<'intro' | 'playing' | 'showing' | 'guessing' | 'feedback'>('intro');
  const [currentLevel, setCurrentLevel] = useState(1);
  const [sequence, setSequence] = useState<Shape[]>([]);
  const [playerSequence, setPlayerSequence] = useState<Shape[]>([]);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [gameStartTime, setGameStartTime] = useState(0);
  const [currentShowingIndex, setCurrentShowingIndex] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | ''>('');
  const [timeLeft, setTimeLeft] = useState(45);
  const [isShowing, setIsShowing] = useState(false);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const { notifications, removeNotification, showCongratulations, showGeneral } = useNotifications();

  useEffect(() => {
    // Initialize audio context
    if (typeof window !== 'undefined') {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }, []);

  const playCorrectSound = () => {
    if (!audioContextRef.current) return;
    
    const oscillator = audioContextRef.current.createOscillator();
    const gainNode = audioContextRef.current.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContextRef.current.destination);
    
    oscillator.frequency.setValueAtTime(523.25, audioContextRef.current.currentTime); // C5 - cheerful sound
    oscillator.frequency.setValueAtTime(659.25, audioContextRef.current.currentTime + 0.1); // E5
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.3, audioContextRef.current.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContextRef.current.currentTime + 0.3);
    
    oscillator.start();
    oscillator.stop(audioContextRef.current.currentTime + 0.3);
  };

  const playIncorrectSound = () => {
    if (!audioContextRef.current) return;
    
    const oscillator = audioContextRef.current.createOscillator();
    const gainNode = audioContextRef.current.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContextRef.current.destination);
    
    oscillator.frequency.setValueAtTime(196.00, audioContextRef.current.currentTime); // G3 - lower, somber sound
    oscillator.type = 'sawtooth';
    
    gainNode.gain.setValueAtTime(0.2, audioContextRef.current.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContextRef.current.currentTime + 0.5);
    
    oscillator.start();
    oscillator.stop(audioContextRef.current.currentTime + 0.5);
  };

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

  const generateSequence = () => {
    const newSequence: Shape[] = [];
    const sequenceLength = Math.min(3 + Math.floor(currentLevel / 2), 8);
    
    for (let i = 0; i < sequenceLength; i++) {
      const randomShape = shapes[Math.floor(Math.random() * shapes.length)];
      newSequence.push(randomShape);
    }
    
    setSequence(newSequence);
    return newSequence;
  };

  const startGame = () => {
    setGameState('playing');
    setGameStartTime(Date.now());
    setTimeLeft(45);
    setScore(0);
    setStreak(0);
    setCurrentLevel(1);
    showSequence();
  };

  const showSequence = () => {
    const newSequence = generateSequence();
    setSequence(newSequence); // Set sequence before showing
    setGameState('showing');
    setCurrentShowingIndex(0);
    setIsShowing(true);
    
    // Show the sequence
    newSequence.forEach((shape, index) => {
      setTimeout(() => {
        setCurrentShowingIndex(index);
        
        if (index === newSequence.length - 1) {
          setTimeout(() => {
            setGameState('guessing');
            setIsShowing(false);
            setCurrentShowingIndex(-1);
          }, 1000);
        }
      }, index * 1000);
    });
  };

  const handleShapeClick = (shape: Shape) => {
    if (gameState !== 'guessing') return;
    
    const newPlayerSequence = [...playerSequence, shape];
    setPlayerSequence(newPlayerSequence);
    
    // Check if the current selection is correct - fix the bug by ensuring sequence is properly set
    const expectedShape = sequence[newPlayerSequence.length - 1];
    if (!expectedShape) {
      console.error('No expected shape found', { 
        newPlayerSequenceLength: newPlayerSequence.length, 
        sequenceLength: sequence.length, 
        sequence: sequence.map(s => s.id)
      });
      return;
    }
    const isCorrect = shape.id === expectedShape.id;
    
    // Play correct/incorrect sound effects
    if (isCorrect) {
      playCorrectSound();
    } else {
      playIncorrectSound();
      setFeedback('incorrect');
      setStreak(0);
      showGeneral("❌ Wrong shape! Try again.", "error");
      setTimeout(() => {
        setFeedback('');
        if (currentLevel > 1) {
          setCurrentLevel(prev => prev - 1);
        }
        setPlayerSequence([]);
        nextRound();
      }, 1500);
      return;
    }
    
    // Check if sequence is complete
    if (newPlayerSequence.length === sequence.length) {
      setFeedback('correct');
      const basePoints = sequence.length * 15;
      const streakBonus = streak * 5;
      const speedBonus = Math.max(0, (45 - timeLeft) < 10 ? 10 : 0);
      const totalPoints = basePoints + streakBonus + speedBonus;
      
      setScore(prev => prev + totalPoints);
      setStreak(prev => prev + 1);
      setCurrentLevel(prev => prev + 1);
      
      showCongratulations(`🎉 Perfect sequence! +${totalPoints} points!`);
      
      setTimeout(() => {
        setFeedback('');
        setPlayerSequence([]);
        nextRound();
      }, 1500);
    } else {
      // Show positive feedback for correct individual clicks
      showGeneral("✅ Correct shape!", "success");
    }
  };

  const nextRound = () => {
    setPlayerSequence([]);
    // Don't reset sequence here - let showSequence() handle it
    if (timeLeft > 0) {
      setTimeout(() => {
        showSequence();
      }, 500);
    } else {
      endGame();
    }
  };

  const endGame = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setGameState('intro');
    const timeTaken = (Date.now() - gameStartTime) / 1000;
    onComplete(score, timeTaken);
  };

  const replaySequence = () => {
    if (gameState !== 'guessing' || isShowing) return;
    
    setIsShowing(true);
    setCurrentShowingIndex(0);
    
    sequence.forEach((shape, index) => {
      setTimeout(() => {
        setCurrentShowingIndex(index);
        
        if (index === sequence.length - 1) {
          setTimeout(() => {
            setCurrentShowingIndex(-1);
            setIsShowing(false);
          }, 1000);
        }
      }, index * 1000);
    });
  };

  if (gameState === 'intro') {
    return (
      <div className="max-w-2xl mx-auto text-center space-y-6">
        <Card>
          <CardContent className="p-8">
            <div className="space-y-4">
              <div className="text-6xl">🔷</div>
              <h2 className="text-2xl font-bold">Shape Sequence</h2>
              <p className="text-gray-600 dark:text-gray-300">
                Watch the sequence of shapes appear, then click them in the same order. 
                Each level gets longer and more challenging!
              </p>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                  <strong>Goal:</strong> Reproduce the exact sequence
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                  <strong>Scoring:</strong> 15 points per shape + bonuses
                </div>
                <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg">
                  <strong>Streak bonus:</strong> +5 points per consecutive success
                </div>
                <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded-lg">
                  <strong>Speed bonus:</strong> +10 points for quick completion
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
          <div className="text-sm text-gray-600 dark:text-gray-300">
            Time: {timeLeft}s
          </div>
          <Badge className="text-lg px-4 py-2">Score: {score}</Badge>
        </div>
      </div>

      {/* Game Instructions */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600 dark:text-gray-300">
              {gameState === 'showing' && "👀 Watch the sequence carefully..."}
              {gameState === 'guessing' && "🎯 Click the shapes in the same order"}
            </div>
            {gameState === 'guessing' && (
              <Button
                onClick={replaySequence}
                variant="outline"
                size="sm"
                disabled={isShowing}
              >
                Show Again
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Shape Grid */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-3 gap-4">
            {shapes.map((shape, index) => (
              <motion.button
                key={shape.id}
                onClick={() => handleShapeClick(shape)}
                disabled={gameState !== 'guessing'}
                className={`
                  aspect-square rounded-xl border-4 p-4 transition-all duration-300 flex flex-col items-center justify-center gap-2
                  ${gameState === 'guessing' ? 'hover:scale-105 cursor-pointer' : 'cursor-not-allowed'}
                  ${currentShowingIndex === index ? 'scale-110 border-yellow-400 shadow-lg bg-yellow-50 dark:bg-yellow-900/20' : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800'}
                  ${gameState !== 'guessing' ? 'opacity-70' : ''}
                `}
                whileHover={gameState === 'guessing' ? { scale: 1.05 } : {}}
                whileTap={gameState === 'guessing' ? { scale: 0.95 } : {}}
              >
                <div style={{ color: shape.color }}>
                  {shape.icon}
                </div>
                <div className="text-xs font-medium text-gray-600 dark:text-gray-300">
                  {shape.name}
                </div>
              </motion.button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Progress Indicator */}
      {gameState === 'guessing' && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-gray-600 dark:text-gray-300">
                Progress: {playerSequence.length} / {sequence.length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                Sequence length: {sequence.length}
              </div>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(playerSequence.length / sequence.length) * 100}%` }}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Current Sequence Display */}
      {gameState === 'showing' && (
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                Sequence: {currentShowingIndex + 1} of {sequence.length}
              </div>
              <div className="flex justify-center gap-2">
                {sequence.map((shape, index) => (
                  <div
                    key={index}
                    className={`
                      w-3 h-3 rounded-full transition-all duration-300
                      ${index <= currentShowingIndex ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'}
                    `}
                  />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

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
                  {feedback === 'correct' ? '🎉 Perfect!' : '❌ Incorrect'}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                  {feedback === 'correct' ? 
                    `Great memory! Level ${currentLevel} completed.` : 
                    'Try again! Watch the sequence more carefully.'
                  }
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Notification System */}
      <NotificationSystem 
        notifications={notifications}
        onRemove={removeNotification}
      />
    </div>
  );
}