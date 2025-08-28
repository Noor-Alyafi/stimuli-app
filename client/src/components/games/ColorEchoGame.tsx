import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Volume2, Play, Pause } from "lucide-react";
import { NotificationSystem, useNotifications } from "@/components/NotificationSystem";

interface ColorEchoGameProps {
  onComplete: (score: number, timeTaken: number) => void;
}

interface ColorSound {
  color: string;
  name: string;
  frequency: number;
}

const colorSounds: ColorSound[] = [
  { color: "#FF6B6B", name: "Red", frequency: 261.63 }, // C4
  { color: "#4ECDC4", name: "Teal", frequency: 293.66 }, // D4
  { color: "#45B7D1", name: "Blue", frequency: 329.63 }, // E4
  { color: "#96CEB4", name: "Green", frequency: 349.23 }, // F4
  { color: "#FFEAA7", name: "Yellow", frequency: 392.00 }, // G4
  { color: "#DDA0DD", name: "Purple", frequency: 440.00 }, // A4
  { color: "#FFB347", name: "Orange", frequency: 493.88 }, // B4
  { color: "#FFB6C1", name: "Pink", frequency: 523.25 }, // C5
];

export function ColorEchoGame({ onComplete }: ColorEchoGameProps) {
  const [gameState, setGameState] = useState<'intro' | 'playing' | 'showing' | 'guessing' | 'feedback'>('intro');
  const [currentLevel, setCurrentLevel] = useState(1);
  const [sequence, setSequence] = useState<ColorSound[]>([]);
  const [playerSequence, setPlayerSequence] = useState<ColorSound[]>([]);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [gameStartTime, setGameStartTime] = useState(0);
  const [currentShowingIndex, setCurrentShowingIndex] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | ''>('');
  const [timeLeft, setTimeLeft] = useState(30);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const { notifications, removeNotification, showGeneral } = useNotifications();

  useEffect(() => {
    // Initialize audio context
    if (typeof window !== 'undefined') {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

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

  const playSound = async (colorSound: ColorSound) => {
    if (!audioContextRef.current) return;
    
    const oscillator = audioContextRef.current.createOscillator();
    const gainNode = audioContextRef.current.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContextRef.current.destination);
    
    oscillator.frequency.value = colorSound.frequency;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.3, audioContextRef.current.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContextRef.current.currentTime + 0.8);
    
    oscillator.start();
    oscillator.stop(audioContextRef.current.currentTime + 0.8);
  };

  const generateSequence = () => {
    const newSequence: ColorSound[] = [];
    // Start with 2 colors, increase gradually but cap at 6 for better gameplay
    const sequenceLength = Math.min(2 + Math.floor(currentLevel / 3), 6);
    
    for (let i = 0; i < sequenceLength; i++) {
      const randomColor = colorSounds[Math.floor(Math.random() * colorSounds.length)];
      newSequence.push(randomColor);
    }
    
    setSequence(newSequence);
    return newSequence;
  };

  const startGame = () => {
    setGameState('playing');
    setGameStartTime(Date.now());
    setTimeLeft(30);
    setScore(0);
    setStreak(0);
    setCurrentLevel(1);
    showSequence();
  };

  const showSequence = () => {
    const newSequence = generateSequence();
    setSequence(newSequence); // Set sequence BEFORE showing
    setGameState('showing');
    setCurrentShowingIndex(0);
    setIsPlaying(true);
    
    // Play the sequence
    newSequence.forEach((colorSound, index) => {
      setTimeout(() => {
        setCurrentShowingIndex(index);
        playSound(colorSound);
        
        if (index === newSequence.length - 1) {
          setTimeout(() => {
            setGameState('guessing');
            setIsPlaying(false);
            setCurrentShowingIndex(-1);
          }, 1500); // Longer pause after sequence
        }
      }, index * 1500); // Slower timing for better processing
    });
  };

  const handleColorClick = (colorSound: ColorSound) => {
    if (gameState !== 'guessing') return;
    
    // Don't allow clicks beyond sequence length
    if (playerSequence.length >= sequence.length) {
      return;
    }
    
    const newPlayerSequence = [...playerSequence, colorSound];
    setPlayerSequence(newPlayerSequence);
    playSound(colorSound);
    
    // Check if the current selection is correct using the current position
    const expectedColor = sequence[playerSequence.length]; // Use current position, not new length
    const isCorrect = colorSound.color === expectedColor.color && colorSound.frequency === expectedColor.frequency;
    
    // Play correct/incorrect sound effects
    if (isCorrect) {
      // Play correct sound effect
      playCorrectSound();
      // Visual feedback for correct answer
      setFeedback('correct');
      showGeneral("✅ Correct!", "success");
    } else {
      // Play incorrect sound effect
      playIncorrectSound();
      setFeedback('incorrect');
      setStreak(0);
      showGeneral("❌ Wrong color! Try again.", "error");
      setTimeout(() => {
        setFeedback('');
        if (currentLevel > 1) {
          setCurrentLevel(prev => prev - 1);
        }
        nextRound();
      }, 1500);
      return;
    }
    
    // Check if sequence is complete
    if (newPlayerSequence.length === sequence.length) {
      setFeedback('correct');
      const points = sequence.length * 10 + (streak * 2);
      setScore(prev => prev + points);
      setStreak(prev => prev + 1);
      setCurrentLevel(prev => prev + 1);
      
      showGeneral(`🎉 Perfect sequence! +${points} points!`, "success");
      
      setTimeout(() => {
        setFeedback('');
        nextRound();
      }, 1500);
    }
  };

  const nextRound = () => {
    setPlayerSequence([]);
    if (timeLeft > 0) {
      showSequence();
    } else {
      endGame();
    }
  };

  const endGame = () => {
    const timeTaken = (Date.now() - gameStartTime) / 1000;
    onComplete(score, timeTaken);
  };

  const replaySequence = () => {
    if (gameState !== 'guessing' || isPlaying) return;
    
    setIsPlaying(true);
    setCurrentShowingIndex(0);
    
    sequence.forEach((colorSound, index) => {
      setTimeout(() => {
        setCurrentShowingIndex(index);
        playSound(colorSound);
        
        if (index === sequence.length - 1) {
          setTimeout(() => {
            setCurrentShowingIndex(-1);
            setIsPlaying(false);
          }, 1000);
        }
      }, index * 1200);
    });
  };

  if (gameState === 'intro') {
    return (
      <div className="max-w-2xl mx-auto text-center space-y-6">
        <Card>
          <CardContent className="p-8">
            <div className="space-y-4">
              <div className="text-6xl">🎵</div>
              <h2 className="text-2xl font-bold">Color Echo</h2>
              <p className="text-gray-600 dark:text-gray-300">
                Listen to the sequence of color-sounds, then click the colors in the same order. 
                Each color has its own unique musical tone. Can you remember the pattern?
              </p>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                  <strong>Goal:</strong> Match the sequence perfectly
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                  <strong>Scoring:</strong> Longer sequences = more points
                </div>
                <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg">
                  <strong>Streak bonus:</strong> +2 points per correct sequence
                </div>
                <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded-lg">
                  <strong>Time limit:</strong> 30 seconds
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
              {gameState === 'showing' && "🎵 Listen to the sequence..."}
              {gameState === 'guessing' && "🎯 Click the colors in the same order"}
            </div>
            {gameState === 'guessing' && (
              <Button
                onClick={replaySequence}
                variant="outline"
                size="sm"
                disabled={isPlaying}
                className="flex items-center gap-2"
              >
                <Volume2 className="w-4 h-4" />
                Replay
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Color Grid */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-4 gap-4">
            {colorSounds.map((colorSound, index) => (
              <motion.button
                key={colorSound.name}
                onClick={() => handleColorClick(colorSound)}
                disabled={gameState !== 'guessing'}
                className={`
                  aspect-square rounded-xl border-4 transition-all duration-300
                  ${gameState === 'guessing' ? 'hover:scale-105 cursor-pointer' : 'cursor-not-allowed'}
                  ${currentShowingIndex === index ? 'scale-110 border-white shadow-lg' : 'border-gray-300 dark:border-gray-600'}
                  ${gameState !== 'guessing' ? 'opacity-70' : ''}
                `}
                style={{ backgroundColor: colorSound.color }}
                whileHover={gameState === 'guessing' ? { scale: 1.05 } : {}}
                whileTap={gameState === 'guessing' ? { scale: 0.95 } : {}}
              >
                <div className="text-white font-bold text-sm drop-shadow-lg">
                  {colorSound.name}
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
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(playerSequence.length / sequence.length) * 100}%` }}
              />
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
                  {feedback === 'correct' ? '🎉 Correct!' : '❌ Incorrect'}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                  {feedback === 'correct' ? 
                    `+${sequence.length * 10 + (streak * 2)} points!` : 
                    'Try again! Listen carefully to the sequence.'
                  }
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <NotificationSystem
        notifications={notifications}
        onRemove={removeNotification}
      />
    </div>
  );
}