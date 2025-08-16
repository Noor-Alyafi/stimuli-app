import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Eye, Puzzle, CheckCircle, XCircle } from 'lucide-react';

interface PatternRecognitionGameProps {
  onComplete: (score: number, timeTaken: number) => void;
}

type PatternType = 'color' | 'shape' | 'size' | 'position';

interface PatternElement {
  color: string;
  shape: string;
  size: 'small' | 'medium' | 'large';
  position: number;
}

export function PatternRecognitionGame({ onComplete }: PatternRecognitionGameProps) {
  const [gameState, setGameState] = useState<'intro' | 'showing' | 'question' | 'feedback' | 'complete'>('intro');
  const [level, setLevel] = useState(1);
  const [pattern, setPattern] = useState<PatternElement[]>([]);
  const [options, setOptions] = useState<PatternElement[]>([]);
  const [correctAnswer, setCorrectAnswer] = useState(0);
  const [userAnswer, setUserAnswer] = useState<number | null>(null);
  const [gameStartTime, setGameStartTime] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const maxLevels = 10;
  const colors = ['#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6', '#EC4899'];
  const shapes = ['●', '■', '▲', '♦', '★', '♠'];
  const sizes = ['small', 'medium', 'large'] as const;

  const generatePatternElement = (): PatternElement => ({
    color: colors[Math.floor(Math.random() * colors.length)],
    shape: shapes[Math.floor(Math.random() * shapes.length)],
    size: sizes[Math.floor(Math.random() * sizes.length)],
    position: Math.floor(Math.random() * 4)
  });

  const generatePattern = (length: number): PatternElement[] => {
    return Array.from({ length }, generatePatternElement);
  };

  const getPatternRule = (pattern: PatternElement[]): { type: PatternType; rule: string } => {
    // Analyze the pattern to find the rule
    if (pattern.length < 3) {
      return { type: 'color', rule: 'color sequence' };
    }

    // Check for color patterns
    const colorPattern = pattern.every((el, i) => i === 0 || el.color !== pattern[i - 1].color);
    if (colorPattern && pattern.length >= 3) {
      return { type: 'color', rule: 'alternating colors' };
    }

    // Check for shape patterns
    const shapePattern = pattern.every((el, i) => i === 0 || el.shape !== pattern[i - 1].shape);
    if (shapePattern && pattern.length >= 3) {
      return { type: 'shape', rule: 'alternating shapes' };
    }

    // Check for size patterns
    const sizeIncreasing = pattern.every((el, i) => {
      if (i === 0) return true;
      const prevSize = sizes.indexOf(pattern[i - 1].size);
      const currentSize = sizes.indexOf(el.size);
      return currentSize >= prevSize;
    });
    
    if (sizeIncreasing) {
      return { type: 'size', rule: 'increasing size' };
    }

    // Default to position pattern
    return { type: 'position', rule: 'position sequence' };
  };

  const generateNextElement = (pattern: PatternElement[], rule: { type: PatternType; rule: string }): PatternElement => {
    const lastElement = pattern[pattern.length - 1];
    const secondLastElement = pattern[pattern.length - 2];

    switch (rule.type) {
      case 'color':
        if (rule.rule === 'alternating colors' && secondLastElement) {
          // Continue alternating pattern
          const availableColors = colors.filter(c => c !== lastElement.color);
          return {
            ...lastElement,
            color: availableColors[Math.floor(Math.random() * availableColors.length)]
          };
        }
        break;
      
      case 'shape':
        if (rule.rule === 'alternating shapes' && secondLastElement) {
          const availableShapes = shapes.filter(s => s !== lastElement.shape);
          return {
            ...lastElement,
            shape: availableShapes[Math.floor(Math.random() * availableShapes.length)]
          };
        }
        break;
      
      case 'size':
        if (rule.rule === 'increasing size') {
          const currentSizeIndex = sizes.indexOf(lastElement.size);
          const nextSizeIndex = Math.min(currentSizeIndex + 1, sizes.length - 1);
          return {
            ...lastElement,
            size: sizes[nextSizeIndex]
          };
        }
        break;
      
      case 'position':
        return {
          ...lastElement,
          position: (lastElement.position + 1) % 4
        };
    }

    return generatePatternElement();
  };

  const startLevel = () => {
    const patternLength = Math.min(3 + Math.floor(level / 2), 6);
    const newPattern = generatePattern(patternLength);
    const rule = getPatternRule(newPattern);
    const nextElement = generateNextElement(newPattern, rule);
    
    // Generate options including the correct answer
    const wrongOptions = Array.from({ length: 3 }, generatePatternElement);
    const allOptions = [nextElement, ...wrongOptions].sort(() => Math.random() - 0.5);
    const correctIndex = allOptions.indexOf(nextElement);
    
    setPattern(newPattern);
    setOptions(allOptions);
    setCorrectAnswer(correctIndex);
    setUserAnswer(null);
    setIsCorrect(null);
    setGameState('showing');
    
    // Show pattern for a few seconds
    setTimeout(() => {
      setGameState('question');
    }, 2000 + patternLength * 500);
  };

  const handleAnswerClick = (answerIndex: number) => {
    if (gameState !== 'question') return;
    
    setUserAnswer(answerIndex);
    const correct = answerIndex === correctAnswer;
    setIsCorrect(correct);
    
    if (correct) {
      const levelScore = level * 15 + streak * 5;
      setScore(prev => prev + levelScore);
      setStreak(prev => prev + 1);
    } else {
      setStreak(0);
    }
    
    setGameState('feedback');
    
    setTimeout(() => {
      if (correct && level < maxLevels) {
        setLevel(prev => prev + 1);
        startLevel();
      } else {
        const totalTime = (Date.now() - gameStartTime) / 1000;
        onComplete(score + (correct ? level * 15 + streak * 5 : 0), totalTime);
        setGameState('complete');
      }
    }, 2000);
  };

  const renderElement = (element: PatternElement, index: number, isOption = false) => {
    const sizeClasses = {
      small: 'text-lg',
      medium: 'text-2xl',
      large: 'text-4xl'
    };

    return (
      <motion.div
        key={index}
        className={`flex items-center justify-center w-16 h-16 rounded-lg border-2 ${
          isOption ? 'cursor-pointer hover:border-blue-400 border-gray-300' : 'border-blue-300'
        }`}
        style={{ backgroundColor: isOption ? '#f8f9fa' : undefined }}
        whileHover={isOption ? { scale: 1.05 } : undefined}
        whileTap={isOption ? { scale: 0.95 } : undefined}
        onClick={isOption ? () => handleAnswerClick(index) : undefined}
        data-testid={isOption ? `option-${index}` : undefined}
      >
        <div
          className={`${sizeClasses[element.size]} font-bold`}
          style={{ color: element.color }}
        >
          {element.shape}
        </div>
      </motion.div>
    );
  };

  if (gameState === 'intro') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-6"
      >
        <div className="text-6xl mb-4">🧩</div>
        <h2 className="text-2xl font-bold mb-4">Pattern Recognition</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
          Study the pattern sequence and identify what comes next. 
          Look for patterns in color, shape, size, or position.
        </p>
        <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg mb-6">
          <p className="text-sm text-purple-800 dark:text-purple-200">
            <strong>Strategy:</strong> Look for repeating patterns, sequences, or logical progressions.
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
          <Eye className="h-5 w-5 mr-2" />
          Start Pattern Test
        </Button>
      </motion.div>
    );
  }

  if (gameState === 'complete') {
    const levelReached = level + (isCorrect ? 0 : -1);
    
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center space-y-6"
      >
        <div className="text-6xl mb-4">{levelReached >= 7 ? '🎯' : levelReached >= 4 ? '👀' : '🧩'}</div>
        <h2 className="text-2xl font-bold mb-4">Pattern Test Complete!</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="text-center p-4">
              <Puzzle className="h-8 w-8 mx-auto text-purple-500 mb-2" />
              <div className="text-2xl font-bold">{levelReached}</div>
              <div className="text-sm text-gray-600">Levels Reached</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="text-center p-4">
              <Eye className="h-8 w-8 mx-auto text-blue-500 mb-2" />
              <div className="text-2xl font-bold">{streak}</div>
              <div className="text-sm text-gray-600">Best Streak</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="text-center p-4">
              <CheckCircle className="h-8 w-8 mx-auto text-green-500 mb-2" />
              <div className="text-2xl font-bold">{score}</div>
              <div className="text-sm text-gray-600">Total Score</div>
            </CardContent>
          </Card>
        </div>

        <div className="text-lg font-semibold">
          {levelReached >= 8 ? 'Outstanding pattern recognition!' : 
           levelReached >= 5 ? 'Great analytical skills!' : 
           'Good effort! Pattern skills improve with practice.'}
        </div>
        
        <div className="text-sm text-gray-500 space-y-1">
          <p><strong>Brain fact:</strong> Pattern recognition is key to intelligence</p>
          <p>You mastered {levelReached} different pattern types!</p>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="text-center space-y-6">
      <div className="flex justify-between items-center mb-4">
        <Badge variant="secondary">Level {level}/{maxLevels}</Badge>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Streak:</span>
            <span className="font-bold text-purple-600">{streak}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Score:</span>
            <span className="font-bold">{score}</span>
          </div>
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
            className="space-y-6"
          >
            <div className="text-lg font-semibold">Study this pattern:</div>
            <div className="flex justify-center space-x-4">
              {pattern.map((element, index) => renderElement(element, index))}
              <div className="flex items-center justify-center w-16 h-16 rounded-lg border-2 border-dashed border-gray-400">
                <span className="text-2xl text-gray-400">?</span>
              </div>
            </div>
            <div className="text-sm text-blue-600">
              Look for patterns in color, shape, size, or sequence...
            </div>
          </motion.div>
        )}

        {gameState === 'question' && (
          <motion.div
            key="question"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="text-lg font-semibold">What comes next in the pattern?</div>
            
            <div className="flex justify-center space-x-4 mb-8">
              {pattern.map((element, index) => renderElement(element, index))}
              <div className="flex items-center justify-center w-16 h-16 rounded-lg border-2 border-dashed border-blue-400 bg-blue-50 dark:bg-blue-900/20">
                <span className="text-2xl text-blue-500">?</span>
              </div>
            </div>

            <div className="text-md font-medium mb-4">Choose the correct answer:</div>
            <div className="flex justify-center space-x-4">
              {options.map((option, index) => renderElement(option, index, true))}
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
            
            <div className="flex justify-center space-x-4">
              {pattern.map((element, index) => renderElement(element, index))}
              <div className="flex items-center justify-center w-16 h-16 rounded-lg border-2 border-green-400 bg-green-100 dark:bg-green-900">
                {renderElement(options[correctAnswer], 0).props.children}
              </div>
            </div>

            {isCorrect && level < maxLevels && (
              <div className="text-sm text-green-600">
                Great pattern recognition! (+{level * 15 + streak * 5} points)
              </div>
            )}

            {!isCorrect && (
              <div className="text-sm text-gray-600">
                The correct answer was option {correctAnswer + 1}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}