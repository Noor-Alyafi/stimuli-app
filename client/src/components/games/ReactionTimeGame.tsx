import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Zap, Target, Clock } from 'lucide-react';

interface ReactionTimeGameProps {
  onComplete: (score: number, timeTaken: number) => void;
}

export function ReactionTimeGame({ onComplete }: ReactionTimeGameProps) {
  const [gameState, setGameState] = useState<'intro' | 'waiting' | 'ready' | 'reacting' | 'result' | 'complete'>('intro');
  const [round, setRound] = useState(0);
  const [reactionTimes, setReactionTimes] = useState<number[]>([]);
  const [startTime, setStartTime] = useState(0);
  const [gameStartTime, setGameStartTime] = useState(0);
  const [waitingTime, setWaitingTime] = useState(0);
  const [tooEarly, setTooEarly] = useState(false);
  const [targetColor, setTargetColor] = useState('#22C55E');

  const maxRounds = 10;
  const colors = ['#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6', '#EC4899'];

  const startNextRound = useCallback(() => {
    if (round >= maxRounds) {
      const avgReactionTime = reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length;
      const score = Math.max(0, Math.round(1000 - avgReactionTime));
      const totalTime = (Date.now() - gameStartTime) / 1000;
      onComplete(score, totalTime);
      setGameState('complete');
      return;
    }

    setTooEarly(false);
    setGameState('waiting');
    setTargetColor(colors[Math.floor(Math.random() * colors.length)]);
    const delay = 2000 + Math.random() * 3000; // 2-5 seconds
    setWaitingTime(delay);
    
    const timeoutId = setTimeout(() => {
      setGameState('ready');
      setStartTime(Date.now());
    }, delay);

    return () => clearTimeout(timeoutId);
  }, [round, maxRounds, reactionTimes, gameStartTime, onComplete, gameState, colors]);

  const handleClick = () => {
    if (gameState === 'intro') {
      setGameState('waiting');
      setGameStartTime(Date.now());
      setRound(1);
      startNextRound();
    } else if (gameState === 'waiting') {
      setTooEarly(true);
      setGameState('result');
    } else if (gameState === 'ready') {
      const reactionTime = Date.now() - startTime;
      setReactionTimes(prev => [...prev, reactionTime]);
      setGameState('result');
    } else if (gameState === 'result') {
      setRound(prev => prev + 1);
      startNextRound();
    }
  };

  const getReactionFeedback = (time: number) => {
    if (time < 200) return { text: 'Lightning Fast!', color: 'text-green-600', icon: '⚡' };
    if (time < 300) return { text: 'Excellent!', color: 'text-blue-600', icon: '🎯' };
    if (time < 400) return { text: 'Good!', color: 'text-yellow-600', icon: '👍' };
    if (time < 500) return { text: 'Average', color: 'text-orange-600', icon: '👌' };
    return { text: 'Keep Trying!', color: 'text-red-600', icon: '💪' };
  };

  if (gameState === 'intro') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-6"
      >
        <div className="text-6xl mb-4">⚡</div>
        <h2 className="text-2xl font-bold mb-4">Reaction Time Challenge</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
          Test your reflexes! Click as fast as you can when the circle changes color. 
          Complete {maxRounds} rounds to measure your average reaction time.
        </p>
        <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg mb-6">
          <p className="text-sm text-yellow-800 dark:text-yellow-200">
            <strong>Warning:</strong> Don't click too early! Wait for the color to change.
          </p>
        </div>
        <Button onClick={handleClick} size="lg" data-testid="button-start">
          <Zap className="h-5 w-5 mr-2" />
          Start Reaction Test
        </Button>
      </motion.div>
    );
  }

  if (gameState === 'complete') {
    const avgReactionTime = reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length;
    const bestTime = Math.min(...reactionTimes);
    const feedback = getReactionFeedback(avgReactionTime);

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center space-y-6"
      >
        <div className="text-6xl mb-4">{feedback.icon}</div>
        <h2 className="text-2xl font-bold mb-4">Reaction Test Complete!</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="text-center p-4">
              <Clock className="h-8 w-8 mx-auto text-blue-500 mb-2" />
              <div className="text-2xl font-bold">{Math.round(avgReactionTime)}ms</div>
              <div className="text-sm text-gray-600">Average Time</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="text-center p-4">
              <Target className="h-8 w-8 mx-auto text-green-500 mb-2" />
              <div className="text-2xl font-bold">{Math.round(bestTime)}ms</div>
              <div className="text-sm text-gray-600">Best Time</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="text-center p-4">
              <Zap className="h-8 w-8 mx-auto text-purple-500 mb-2" />
              <div className="text-2xl font-bold">{Math.max(0, Math.round(1000 - avgReactionTime))}</div>
              <div className="text-sm text-gray-600">Score</div>
            </CardContent>
          </Card>
        </div>

        <div className={`text-lg font-semibold ${feedback.color}`}>
          {feedback.text}
        </div>
        
        <div className="text-sm text-gray-500 space-y-1">
          <p><strong>Pro tip:</strong> Elite athletes have reaction times around 150-200ms</p>
          <p>Average human reaction time is 200-300ms</p>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="text-center space-y-6">
      <div className="flex justify-between items-center mb-4">
        <Badge variant="secondary">Round {round}/{maxRounds}</Badge>
        <Progress value={(round - 1) / maxRounds * 100} className="w-32" />
      </div>

      <AnimatePresence mode="wait">
        {gameState === 'waiting' && (
          <motion.div
            key="waiting"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="space-y-4"
          >
            <div className="text-lg font-semibold">Get Ready...</div>
            <motion.div
              className="w-32 h-32 mx-auto rounded-full bg-red-500 cursor-pointer flex items-center justify-center"
              animate={{ 
                scale: [1, 1.1, 1],
                backgroundColor: ['#EF4444', '#DC2626', '#EF4444']
              }}
              transition={{ duration: 0.5, repeat: Infinity }}
              onClick={handleClick}
              data-testid="reaction-circle"
            >
              <div className="text-white font-bold">WAIT</div>
            </motion.div>
            <p className="text-sm text-gray-500">Wait for the color to change...</p>
          </motion.div>
        )}

        {gameState === 'ready' && (
          <motion.div
            key="ready"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="space-y-4"
          >
            <div className="text-lg font-semibold">NOW!</div>
            <motion.div
              className="w-32 h-32 mx-auto rounded-full bg-green-500 cursor-pointer flex items-center justify-center"
              style={{ backgroundColor: targetColor }}
              animate={{ 
                scale: [1, 1.2, 1],
                boxShadow: ['0 0 0 0 rgba(34, 197, 94, 0.7)', '0 0 20px 10px rgba(34, 197, 94, 0)', '0 0 0 0 rgba(34, 197, 94, 0.7)']
              }}
              transition={{ duration: 0.3, repeat: Infinity }}
              onClick={handleClick}
              data-testid="reaction-circle"
            >
              <div className="text-white font-bold text-lg">CLICK!</div>
            </motion.div>
            <p className="text-sm text-green-600 font-semibold">Click as fast as you can!</p>
          </motion.div>
        )}

        {gameState === 'result' && (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {tooEarly ? (
              <div className="space-y-4">
                <div className="text-6xl">😅</div>
                <div className="text-lg font-semibold text-red-600">Too Early!</div>
                <p className="text-gray-600">Wait for the green signal before clicking.</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="text-6xl">{getReactionFeedback(reactionTimes[reactionTimes.length - 1]).icon}</div>
                <div className="text-2xl font-bold">
                  {Math.round(reactionTimes[reactionTimes.length - 1])}ms
                </div>
                <div className={`text-lg ${getReactionFeedback(reactionTimes[reactionTimes.length - 1]).color}`}>
                  {getReactionFeedback(reactionTimes[reactionTimes.length - 1]).text}
                </div>
              </div>
            )}
            
            <Button onClick={handleClick} data-testid="button-continue">
              {round >= maxRounds ? 'View Results' : 'Next Round'}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}