import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from "lucide-react";
import { NotificationSystem, useNotifications } from "@/components/NotificationSystem";

interface QuickResponseGameProps {
  onComplete: (score: number, timeTaken: number) => void;
}

interface Challenge {
  type: 'direction' | 'color' | 'word' | 'shape';
  stimulus: string;
  correctAnswer: string;
  options: string[];
  color?: string;
}

const directions = [
  { name: 'up', icon: <ArrowUp className="w-8 h-8" />, key: 'ArrowUp' },
  { name: 'down', icon: <ArrowDown className="w-8 h-8" />, key: 'ArrowDown' },
  { name: 'left', icon: <ArrowLeft className="w-8 h-8" />, key: 'ArrowLeft' },
  { name: 'right', icon: <ArrowRight className="w-8 h-8" />, key: 'ArrowRight' },
];

const colors = [
  { name: 'red', value: '#FF6B6B' },
  { name: 'blue', value: '#45B7D1' },
  { name: 'green', value: '#96CEB4' },
  { name: 'yellow', value: '#FFEAA7' },
];

const words = ['FAST', 'SLOW', 'BIG', 'SMALL', 'HOT', 'COLD'];
const shapes = ['●', '■', '▲', '◆'];

export function QuickResponseGame({ onComplete }: QuickResponseGameProps) {
  const [gameState, setGameState] = useState<'intro' | 'playing' | 'feedback'>('intro');
  const [currentChallenge, setCurrentChallenge] = useState<Challenge | null>(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [gameStartTime, setGameStartTime] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | ''>('');
  const [timeLeft, setTimeLeft] = useState(45);
  const [reactionTime, setReactionTime] = useState(0);
  const [challengeStartTime, setChallengeStartTime] = useState(0);
  const [averageReactionTime, setAverageReactionTime] = useState(0);
  const [totalChallenges, setTotalChallenges] = useState(0);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const { notifications, removeNotification, showCongratulations, showGeneral } = useNotifications();

  useEffect(() => {
    if (gameState === 'playing' && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setGameState('feedback');
            setTimeout(() => endGame(), 100);
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
  }, [gameState]);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (gameState !== 'playing' || !currentChallenge) return;
      
      if (currentChallenge.type === 'direction') {
        const direction = directions.find(d => d.key === event.key);
        if (direction) {
          handleAnswer(direction.name);
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameState, currentChallenge]);

  const generateChallenge = (): Challenge => {
    const types = ['direction', 'color', 'word', 'shape'];
    const type = types[Math.floor(Math.random() * types.length)] as Challenge['type'];
    
    switch (type) {
      case 'direction': {
        const direction = directions[Math.floor(Math.random() * directions.length)];
        return {
          type: 'direction',
          stimulus: direction.name,
          correctAnswer: direction.name,
          options: directions.map(d => d.name),
        };
      }
      
      case 'color': {
        const color = colors[Math.floor(Math.random() * colors.length)];
        const wrongColor = colors[Math.floor(Math.random() * colors.length)];
        return {
          type: 'color',
          stimulus: color.name.toUpperCase(),
          correctAnswer: color.name,
          options: colors.map(c => c.name),
          color: wrongColor.value, // Display word in wrong color for Stroop effect
        };
      }
      
      case 'word': {
        const word = words[Math.floor(Math.random() * words.length)];
        return {
          type: 'word',
          stimulus: word,
          correctAnswer: word,
          options: words,
        };
      }
      
      case 'shape': {
        const shape = shapes[Math.floor(Math.random() * shapes.length)];
        return {
          type: 'shape',
          stimulus: shape,
          correctAnswer: shape,
          options: shapes,
        };
      }
      
      default:
        return generateChallenge();
    }
  };

  const startGame = () => {
    setGameState('playing');
    setGameStartTime(Date.now());
    setTimeLeft(45);
    setScore(0);
    setStreak(0);
    setTotalChallenges(0);
    setAverageReactionTime(0);
    nextChallenge();
  };

  const nextChallenge = () => {
    const challenge = generateChallenge();
    setCurrentChallenge(challenge);
    setChallengeStartTime(Date.now());
    setTotalChallenges(prev => prev + 1);
  };

  const handleAnswer = (answer: string) => {
    if (!currentChallenge) return;
    
    const currentReactionTime = Date.now() - challengeStartTime;
    setReactionTime(currentReactionTime);
    
    // Update average reaction time
    setAverageReactionTime(prev => 
      (prev * (totalChallenges - 1) + currentReactionTime) / totalChallenges
    );
    
    if (answer === currentChallenge.correctAnswer) {
      setFeedback('correct');
      
      // Scoring based on speed
      const basePoints = 15;
      const speedBonus = Math.max(0, 20 - Math.floor(currentReactionTime / 100));
      const streakBonus = streak * 2;
      const totalPoints = basePoints + speedBonus + streakBonus;
      
      setScore(prev => prev + totalPoints);
      setStreak(prev => prev + 1);
      
      showCongratulations(`⚡ Fast! +${totalPoints} points! (${currentReactionTime}ms)`);
      
      setTimeout(() => {
        setFeedback('');
        if (timeLeft > 0) {
          nextChallenge();
        } else {
          endGame();
        }
      }, 800);
    } else {
      setFeedback('incorrect');
      setStreak(0);
      
      // Show error feedback in-game only
      
      setTimeout(() => {
        setFeedback('');
        if (timeLeft > 0) {
          nextChallenge();
        } else {
          endGame();
        }
      }, 800);
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
              <div className="text-6xl">⚡</div>
              <h2 className="text-2xl font-bold">Quick Response</h2>
              <p className="text-gray-600 dark:text-gray-300">
                React as quickly as possible to various stimuli. Test your processing speed 
                and reaction time with directions, colors, words, and shapes!
              </p>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                  <strong>Goal:</strong> Respond quickly and accurately
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                  <strong>Scoring:</strong> 15 points + speed bonus
                </div>
                <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg">
                  <strong>Speed bonus:</strong> Up to +20 points for fast responses
                </div>
                <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded-lg">
                  <strong>Controls:</strong> Click buttons or use arrow keys
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
          <Badge variant="secondary">Challenge {totalChallenges}</Badge>
          <Badge variant="outline">Streak: {streak}</Badge>
          <Badge variant="outline">Avg RT: {Math.round(averageReactionTime)}ms</Badge>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-600 dark:text-gray-300">
            Time: {timeLeft}s
          </div>
          <Badge className="text-lg px-4 py-2">Score: {score}</Badge>
        </div>
      </div>

      {/* Challenge Display */}
      {currentChallenge && (
        <Card>
          <CardContent className="p-8">
            <div className="text-center">
              <div className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                {currentChallenge.type === 'direction' && "Press arrow key or click the direction"}
                {currentChallenge.type === 'color' && "What COLOR is this word written in?"}
                {currentChallenge.type === 'word' && "Click the matching word"}
                {currentChallenge.type === 'shape' && "Click the matching shape"}
              </div>
              
              <div className="text-6xl font-bold mb-8" style={{ color: currentChallenge.color }}>
                {currentChallenge.stimulus}
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-md mx-auto">
                {currentChallenge.options.map((option, index) => (
                  <Button
                    key={index}
                    onClick={() => handleAnswer(option)}
                    variant="outline"
                    size="lg"
                    className="h-16 text-lg"
                  >
                    {currentChallenge.type === 'direction' && 
                      directions.find(d => d.name === option)?.icon
                    }
                    {currentChallenge.type === 'color' && (
                      <div 
                        className="w-12 h-12 rounded-full border-2 border-gray-300"
                        style={{ backgroundColor: colors.find(c => c.name === option)?.value }}
                      />
                    )}
                    {currentChallenge.type === 'word' && option}
                    {currentChallenge.type === 'shape' && (
                      <span className="text-4xl">{option}</span>
                    )}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Reaction Time Display */}
      {reactionTime > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-sm text-gray-600 dark:text-gray-300">
                Last reaction time: <span className="font-bold">{reactionTime}ms</span>
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
                  {feedback === 'correct' ? '⚡ Fast!' : '❌ Incorrect'}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                  {feedback === 'correct' ? 
                    `${reactionTime}ms reaction time! Streak: ${streak}` : 
                    'Take your time to read carefully!'
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