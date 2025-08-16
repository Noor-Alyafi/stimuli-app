import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import GameContainer from './GameContainer';

// Scientifically-backed Dual N-Back for working memory training
const GRID_SIZE = 3;
const POSITIONS = Array.from({ length: 9 }, (_, i) => i);
const SOUNDS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

interface Trial {
  position: number;
  sound: string;
}

export default function DualNBackGame() {
  const [nLevel, setNLevel] = useState(2); // Start with 2-back
  const [currentTrial, setCurrentTrial] = useState(0);
  const [trials, setTrials] = useState<Trial[]>([]);
  const [score, setScore] = useState(0);
  const [gameActive, setGameActive] = useState(false);
  const [showingStimulus, setShowingStimulus] = useState(false);
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes
  const [userResponses, setUserResponses] = useState<{ position: boolean; sound: boolean }>({ position: false, sound: false });

  const generateTrials = useCallback((count: number): Trial[] => {
    return Array.from({ length: count }, () => ({
      position: Math.floor(Math.random() * 9),
      sound: SOUNDS[Math.floor(Math.random() * SOUNDS.length)]
    }));
  }, []);

  const startGame = () => {
    setGameActive(true);
    setScore(0);
    setCurrentTrial(0);
    setTimeLeft(120);
    const newTrials = generateTrials(20 + nLevel * 5); // More trials for higher n-back
    setTrials(newTrials);
    setShowingStimulus(false);
    setUserResponses({ position: false, sound: false });
  };

  const isPositionMatch = (): boolean => {
    if (currentTrial < nLevel) return false;
    return trials[currentTrial].position === trials[currentTrial - nLevel].position;
  };

  const isSoundMatch = (): boolean => {
    if (currentTrial < nLevel) return false;
    return trials[currentTrial].sound === trials[currentTrial - nLevel].sound;
  };

  const nextTrial = useCallback(() => {
    if (currentTrial >= nLevel) {
      // Score the responses
      const posMatch = isPositionMatch();
      const soundMatch = isSoundMatch();
      
      let points = 0;
      if (userResponses.position === posMatch) points += 1;
      if (userResponses.sound === soundMatch) points += 1;
      
      setScore(prev => prev + points);
    }

    if (currentTrial + 1 >= trials.length) {
      setGameActive(false);
      return;
    }

    setCurrentTrial(prev => prev + 1);
    setUserResponses({ position: false, sound: false });
    setShowingStimulus(true);
    
    // Show stimulus for 500ms
    setTimeout(() => {
      setShowingStimulus(false);
    }, 500);
  }, [currentTrial, trials.length, userResponses, nLevel]);

  useEffect(() => {
    if (gameActive && trials.length > 0) {
      // Start first trial
      if (currentTrial === 0) {
        setShowingStimulus(true);
        setTimeout(() => {
          setShowingStimulus(false);
        }, 500);
      }

      // Auto-advance after 3 seconds
      const timer = setTimeout(nextTrial, 3000);
      return () => clearTimeout(timer);
    }
  }, [currentTrial, gameActive, trials.length, nextTrial]);

  useEffect(() => {
    if (gameActive && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      setGameActive(false);
    }
  }, [gameActive, timeLeft]);

  const handleResponse = (type: 'position' | 'sound') => {
    if (!gameActive || currentTrial < nLevel) return;
    setUserResponses(prev => ({ ...prev, [type]: true }));
  };

  const maxScore = trials.length > 0 ? Math.max(0, (trials.length - nLevel) * 2) : 0;
  const accuracy = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;

  return (
    <GameContainer
      title={`Dual ${nLevel}-Back`}
      description="Train your working memory with this scientifically-proven cognitive training task. Track both position and sound patterns!"
      score={score}
      isActive={gameActive}
      timeLeft={timeLeft}
      onGameEnd={() => ({
        gameType: 'dual-n-back',
        score: accuracy,
        difficulty: `${nLevel}-back`,
        timeTaken: 120 - timeLeft,
      })}
    >
      <div className="space-y-6">
        {!gameActive && timeLeft === 120 ? (
          <div className="text-center space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium">Difficulty Level:</label>
              <div className="flex gap-2 justify-center">
                {[1, 2, 3, 4].map(level => (
                  <Button
                    key={level}
                    onClick={() => setNLevel(level)}
                    variant={nLevel === level ? "default" : "outline"}
                    size="sm"
                    data-testid={`button-level-${level}`}
                  >
                    {level}-Back
                  </Button>
                ))}
              </div>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Scientific Benefits: Improves fluid intelligence, working memory, and attention.
              Research shows 19+ sessions can increase IQ scores.
            </p>
            <Button onClick={startGame} size="lg" data-testid="button-start-nback">
              Start Training
            </Button>
          </div>
        ) : gameActive ? (
          <div className="text-center space-y-6">
            <div className="flex justify-between text-sm text-gray-500">
              <span>Trial {currentTrial + 1} of {trials.length}</span>
              <span>Score: {score}/{maxScore}</span>
            </div>

            {trials.length > 0 && (
              <>
                {/* 3x3 Grid */}
                <div className="grid grid-cols-3 gap-2 w-48 h-48 mx-auto border-2 border-gray-300 dark:border-gray-700 p-2">
                  {POSITIONS.map(pos => (
                    <div
                      key={pos}
                      className={`border border-gray-200 dark:border-gray-600 ${
                        showingStimulus && trials[currentTrial]?.position === pos
                          ? 'bg-blue-500'
                          : 'bg-gray-100 dark:bg-gray-800'
                      }`}
                      data-testid={`grid-position-${pos}`}
                    />
                  ))}
                </div>

                {/* Sound Display */}
                <div className="text-4xl font-bold">
                  {showingStimulus && trials[currentTrial] ? (
                    <span className="text-green-500" data-testid="text-sound">
                      {trials[currentTrial].sound}
                    </span>
                  ) : (
                    <span className="text-gray-400">•</span>
                  )}
                </div>

                {/* Response Buttons */}
                {currentTrial >= nLevel && (
                  <div className="flex gap-4 justify-center">
                    <Button
                      onClick={() => handleResponse('position')}
                      variant={userResponses.position ? "default" : "outline"}
                      data-testid="button-position-match"
                    >
                      Position Match
                    </Button>
                    <Button
                      onClick={() => handleResponse('sound')}
                      variant={userResponses.sound ? "default" : "outline"}
                      data-testid="button-sound-match"
                    >
                      Sound Match
                    </Button>
                  </div>
                )}

                <p className="text-sm text-gray-500">
                  {currentTrial < nLevel 
                    ? `Remember the pattern... (${nLevel - currentTrial} more to start)`
                    : `Is the current stimulus the same as ${nLevel} steps back?`
                  }
                </p>
              </>
            )}
          </div>
        ) : (
          <div className="text-center space-y-4">
            <h3 className="text-2xl font-bold">Training Complete!</h3>
            <div className="space-y-2">
              <p className="text-lg">Accuracy: {accuracy}%</p>
              <p className="text-lg">Score: {score}/{maxScore}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {accuracy >= 80 
                  ? `Excellent! Consider trying ${nLevel + 1}-back next time.`
                  : accuracy >= 60
                  ? "Good progress! Keep training to improve."
                  : "Keep practicing! Working memory improves with consistent training."
                }
              </p>
            </div>
            <Button onClick={startGame} size="lg" data-testid="button-restart-nback">
              Train Again
            </Button>
          </div>
        )}
      </div>
    </GameContainer>
  );
}