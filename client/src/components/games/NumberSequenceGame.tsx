import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Brain, Hash, CheckCircle, XCircle } from 'lucide-react';

interface NumberSequenceGameProps {
  onComplete: (score: number, timeTaken: number) => void;
}

export function NumberSequenceGame({ onComplete }: NumberSequenceGameProps) {
  const [gameState, setGameState] = useState<'intro' | 'showing' | 'input' | 'feedback' | 'complete'>('intro');
  const [level, setLevel] = useState(1);
  const [sequence, setSequence] = useState<number[]>([]);
  const [userInput, setUserInput] = useState<number[]>([]);
  const [gameStartTime, setGameStartTime] = useState(0);
  const [score, setScore] = useState(0);
  const [showingIndex, setShowingIndex] = useState(0);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [streak, setStreak] = useState(0);

  const maxLevels = 8;
  const baseSequenceLength = 3;

  const generateSequence = (length: number) => {
    return Array.from({ length }, () => Math.floor(Math.random() * 9) + 1);
  };

  const startLevel = () => {
    const sequenceLength = baseSequenceLength + level - 1;
    const newSequence = generateSequence(sequenceLength);
    setSequence(newSequence);
    setUserInput([]);
    setIsCorrect(null);
    setShowingIndex(0);
    setGameState('showing');
    
    // Show sequence with timing
    showSequence(newSequence);
  };

  const showSequence = (seq: number[]) => {
    let index = 0;
    const showNext = () => {
      if (index < seq.length) {
        setShowingIndex(index);
        index++;
        setTimeout(showNext, 800); // Show each number for 800ms
      } else {
        setTimeout(() => {
          setGameState('input');
        }, 500);
      }
    };
    showNext();
  };

  const handleNumberClick = (num: number) => {
    if (gameState !== 'input') return;
    
    const newInput = [...userInput, num];
    setUserInput(newInput);
    
    // Check if sequence is complete
    if (newInput.length === sequence.length) {
      const correct = newInput.every((num, index) => num === sequence[index]);
      setIsCorrect(correct);
      
      if (correct) {
        const levelScore = (level * 10) + (streak * 5);
        setScore(prev => prev + levelScore);
        setStreak(prev => prev + 1);
        
        if (level >= maxLevels) {
          setTimeout(() => {
            const totalTime = (Date.now() - gameStartTime) / 1000;
            onComplete(score + levelScore, totalTime);
            setGameState('complete');
          }, 1500);
        } else {
          setTimeout(() => {
            setLevel(prev => prev + 1);
            startLevel();
          }, 1500);
        }
      } else {
        setStreak(0);
        setTimeout(() => {
          const totalTime = (Date.now() - gameStartTime) / 1000;
          onComplete(score, totalTime);
          setGameState('complete');
        }, 1500);
      }
      setGameState('feedback');
    }
  };

  const clearInput = () => {
    setUserInput([]);
  };

  useEffect(() => {
    if (gameState === 'showing' && showingIndex < sequence.length) {
      // This effect handles the visual feedback during sequence showing
    }
  }, [gameState, showingIndex, sequence.length]);

  if (gameState === 'intro') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-6"
      >
        <div className="text-6xl mb-4">🧮</div>
        <h2 className="text-2xl font-bold mb-4">Number Sequence Memory</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
          Watch the sequence of numbers, then reproduce it in the correct order. 
          Each level adds one more number. How far can you go?
        </p>
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mb-6">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            <strong>Tip:</strong> Use chunking - group numbers into smaller sets to remember better!
          </p>
        </div>
        <Button 
          onClick={() => {
            setGameStartTime(Date.now());
            startLevel();
          }} 
          size="lg" 
          data-testid="button-start"
        >
          <Brain className="h-5 w-5 mr-2" />
          Start Memory Test
        </Button>
      </motion.div>
    );
  }

  if (gameState === 'complete') {
    const avgLevelReached = level + (isCorrect ? 0 : -1);
    
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center space-y-6"
      >
        <div className="text-6xl mb-4">{avgLevelReached >= 5 ? '🧠' : avgLevelReached >= 3 ? '👍' : '💪'}</div>
        <h2 className="text-2xl font-bold mb-4">Memory Test Complete!</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="text-center p-4">
              <Hash className="h-8 w-8 mx-auto text-blue-500 mb-2" />
              <div className="text-2xl font-bold">{avgLevelReached}</div>
              <div className="text-sm text-gray-600">Levels Reached</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="text-center p-4">
              <Brain className="h-8 w-8 mx-auto text-purple-500 mb-2" />
              <div className="text-2xl font-bold">{baseSequenceLength + avgLevelReached - 1}</div>
              <div className="text-sm text-gray-600">Max Sequence</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="text-center p-4">
              <CheckCircle className="h-8 w-8 mx-auto text-green-500 mb-2" />
              <div className="text-2xl font-bold">{score}</div>
              <div className="text-sm text-gray-600">Final Score</div>
            </CardContent>
          </Card>
        </div>

        <div className="text-lg font-semibold">
          {avgLevelReached >= 6 ? 'Exceptional memory!' : 
           avgLevelReached >= 4 ? 'Great performance!' : 
           'Good effort! Practice improves memory.'}
        </div>
        
        <div className="text-sm text-gray-500 space-y-1">
          <p><strong>Did you know?</strong> The average person can remember 7±2 items</p>
          <p>You reached {baseSequenceLength + avgLevelReached - 1} numbers!</p>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="text-center space-y-6">
      <div className="flex justify-between items-center mb-4">
        <Badge variant="secondary">Level {level}/{maxLevels}</Badge>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Score:</span>
          <span className="font-bold">{score}</span>
        </div>
      </div>

      <Progress value={level / maxLevels * 100} className="w-full mb-6" />

      <AnimatePresence mode="wait">
        {gameState === 'showing' && (
          <motion.div
            key="showing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            <div className="text-lg font-semibold">Memorize this sequence:</div>
            <div className="flex justify-center space-x-2">
              {sequence.map((num, index) => (
                <motion.div
                  key={index}
                  className={`w-16 h-16 rounded-lg flex items-center justify-center text-xl font-bold ${
                    index === showingIndex 
                      ? 'bg-blue-500 text-white' 
                      : index < showingIndex 
                        ? 'bg-blue-100 dark:bg-blue-900 text-blue-600' 
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-400'
                  }`}
                  animate={index === showingIndex ? { scale: [1, 1.2, 1] } : {}}
                  transition={{ duration: 0.3 }}
                >
                  {index <= showingIndex ? num : '?'}
                </motion.div>
              ))}
            </div>
            <div className="text-sm text-gray-500">
              Length: {sequence.length} numbers
            </div>
          </motion.div>
        )}

        {gameState === 'input' && (
          <motion.div
            key="input"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="text-lg font-semibold">Enter the sequence:</div>
            
            <div className="flex justify-center space-x-2 mb-4">
              {sequence.map((_, index) => (
                <div
                  key={index}
                  className={`w-16 h-16 rounded-lg flex items-center justify-center text-xl font-bold border-2 ${
                    index < userInput.length
                      ? 'bg-green-100 dark:bg-green-900 border-green-300 text-green-700'
                      : 'bg-gray-50 dark:bg-gray-900 border-gray-300 text-gray-400'
                  }`}
                >
                  {index < userInput.length ? userInput[index] : '?'}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-3 max-w-xs mx-auto">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                <Button
                  key={num}
                  onClick={() => handleNumberClick(num)}
                  variant="outline"
                  className="h-12 text-lg font-bold"
                  disabled={userInput.length >= sequence.length}
                  data-testid={`number-${num}`}
                >
                  {num}
                </Button>
              ))}
            </div>

            <div className="flex justify-center gap-2 mt-4">
              <Button onClick={clearInput} variant="outline" size="sm" data-testid="button-clear">
                Clear
              </Button>
            </div>

            <div className="text-sm text-gray-500">
              {userInput.length}/{sequence.length} entered
            </div>
          </motion.div>
        )}

        {gameState === 'feedback' && (
          <motion.div
            key="feedback"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-4"
          >
            <div className="text-6xl">
              {isCorrect ? '✅' : '❌'}
            </div>
            <div className={`text-2xl font-bold ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
              {isCorrect ? 'Correct!' : 'Incorrect!'}
            </div>
            
            <div className="flex justify-center space-x-2">
              {sequence.map((num, index) => (
                <div
                  key={index}
                  className={`w-12 h-12 rounded flex items-center justify-center text-sm font-bold ${
                    userInput[index] === num
                      ? 'bg-green-100 dark:bg-green-900 text-green-700'
                      : 'bg-red-100 dark:bg-red-900 text-red-700'
                  }`}
                >
                  <div className="text-center">
                    <div>{num}</div>
                    {userInput[index] !== undefined && userInput[index] !== num && (
                      <div className="text-xs opacity-70">{userInput[index]}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {isCorrect && level < maxLevels && (
              <div className="text-sm text-green-600">
                Moving to Level {level + 1}! (+{level * 10 + streak * 5} points)
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}