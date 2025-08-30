import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { GameContainer } from './GameContainer';

// Scientifically-backed Stroop Test for attention and cognitive flexibility
const COLORS = ['red', 'blue', 'green', 'yellow', 'orange', 'purple'];
const WORD_COLORS = ['text-red-500', 'text-blue-500', 'text-green-500', 'text-yellow-500', 'text-orange-500', 'text-purple-500'];

interface StroopItem {
  word: string;
  color: string;
  colorClass: string;
  isCongruent: boolean;
}

interface StroopTestGameProps {
  onComplete: (score: number, timeTaken: number) => void;
}

export default function StroopTestGame({ onComplete }: StroopTestGameProps) {
  const [currentItem, setCurrentItem] = useState<StroopItem | null>(null);
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(1);
  const [timeLeft, setTimeLeft] = useState(60); // 60 seconds
  const [gameActive, setGameActive] = useState(false);
  const [startTime, setStartTime] = useState<number>(0);
  const [reactions, setReactions] = useState<number[]>([]);

  const generateStroopItem = useCallback((): StroopItem => {
    const wordColor = COLORS[Math.floor(Math.random() * COLORS.length)];
    const displayColor = COLORS[Math.floor(Math.random() * COLORS.length)];
    const displayColorClass = WORD_COLORS[COLORS.indexOf(displayColor)];
    
    return {
      word: wordColor,
      color: displayColor,
      colorClass: displayColorClass,
      isCongruent: wordColor === displayColor
    };
  }, []);

  const startGame = () => {
    setGameActive(true);
    setScore(0);
    setRound(1);
    setTimeLeft(60);
    setReactions([]);
    setStartTime(Date.now());
    setCurrentItem(generateStroopItem());
  };

  const handleColorChoice = (chosenColor: string) => {
    if (!currentItem || !gameActive) return;
    
    const reactionTime = Date.now() - startTime;
    const correct = chosenColor === currentItem.color;
    
    if (correct) {
      setScore(prev => prev + 1);
      setReactions(prev => [...prev, reactionTime]);
    }
    
    setRound(prev => prev + 1);
    setStartTime(Date.now());
    setCurrentItem(generateStroopItem());
  };

  useEffect(() => {
    if (gameActive && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      setGameActive(false);
    }
  }, [gameActive, timeLeft]);

  const averageReactionTime = reactions.length > 0 
    ? Math.round(reactions.reduce((a, b) => a + b, 0) / reactions.length)
    : 0;

  return (
    <GameContainer
      name="Stroop Test"
      score={score}
      timeLeft={timeLeft}
      onGameComplete={onComplete}
      gameType="stroop-test"
      onBack={() => {}}
    >
      <div className="space-y-6">
        {!gameActive && timeLeft === 60 ? (
          <div className="text-center space-y-4">
            <p className="text-gray-600 dark:text-gray-400">
              Scientific Benefits: Improves cognitive flexibility, attention control, and processing speed.
              Based on the classic Stroop interference effect research.
            </p>
            <Button onClick={startGame} size="lg" data-testid="button-start-stroop">
              Start Stroop Test
            </Button>
          </div>
        ) : gameActive ? (
          <div className="text-center space-y-6">
            <div className="text-sm text-gray-500">Round {round}</div>
            
            {currentItem && (
              <div className="space-y-4">
                <div className="text-4xl font-bold mb-8">
                  <span className={currentItem.colorClass} data-testid="text-stroop-word">
                    {currentItem.word.toUpperCase()}
                  </span>
                </div>
                
                <p className="text-lg mb-4">What COLOR is this word displayed in?</p>
                
                <div className="grid grid-cols-3 gap-3 max-w-md mx-auto">
                  {COLORS.map((color, index) => (
                    <Button
                      key={color}
                      onClick={() => handleColorChoice(color)}
                      variant="outline"
                      className="h-12 text-sm"
                      style={{ borderColor: color, color: color }}
                      data-testid={`button-color-${color}`}
                    >
                      {color.toUpperCase()}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center space-y-4">
            <h3 className="text-2xl font-bold">Game Complete!</h3>
            <div className="space-y-2">
              <p className="text-lg">Correct Answers: {score}</p>
              <p className="text-lg">Average Reaction Time: {averageReactionTime}ms</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Faster reaction times with high accuracy indicate better cognitive flexibility!
              </p>
            </div>
            <Button onClick={startGame} size="lg" data-testid="button-restart-stroop">
              Play Again
            </Button>
          </div>
        )}
      </div>
    </GameContainer>
  );
}