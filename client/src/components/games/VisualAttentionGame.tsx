import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { GameContainer } from './GameContainer';

// Visual attention training based on Attention Network Test (ANT)
interface Stimulus {
  id: number;
  x: number;
  y: number;
  type: 'target' | 'distractor';
  direction: 'left' | 'right';
  flankerType: 'congruent' | 'incongruent' | 'neutral';
}

interface VisualAttentionGameProps {
  onComplete: (score: number, timeTaken: number) => void;
}

export default function VisualAttentionGame({ onComplete }: VisualAttentionGameProps) {
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(1);
  const [gameActive, setGameActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(90);
  const [currentStimulus, setCurrentStimulus] = useState<Stimulus | null>(null);
  const [showCue, setShowCue] = useState(false);
  const [trialPhase, setTrialPhase] = useState<'waiting' | 'cue' | 'stimulus' | 'response'>('waiting');
  const [reactionTimes, setReactionTimes] = useState<number[]>([]);
  const [trialStartTime, setTrialStartTime] = useState(0);

  const generateStimulus = useCallback((): Stimulus => {
    const flankerTypes = ['congruent', 'incongruent', 'neutral'];
    const directions = ['left', 'right'];
    const flankerType = flankerTypes[Math.floor(Math.random() * flankerTypes.length)] as 'congruent' | 'incongruent' | 'neutral';
    const direction = directions[Math.floor(Math.random() * directions.length)] as 'left' | 'right';
    
    return {
      id: Date.now(),
      x: Math.random() * 60 + 20, // 20-80% of container width
      y: Math.random() * 60 + 20, // 20-80% of container height
      type: 'target',
      direction,
      flankerType
    };
  }, []);

  const startGame = () => {
    setGameActive(true);
    setScore(0);
    setRound(1);
    setTimeLeft(90);
    setReactionTimes([]);
    startNewTrial();
  };

  const startNewTrial = useCallback(() => {
    setTrialPhase('waiting');
    setCurrentStimulus(null);
    setShowCue(false);
    
    // Wait 1-2 seconds before showing cue
    setTimeout(() => {
      setShowCue(true);
      setTrialPhase('cue');
      
      // Show cue for 100ms
      setTimeout(() => {
        setShowCue(false);
        
        // Wait 400ms then show stimulus
        setTimeout(() => {
          const stimulus = generateStimulus();
          setCurrentStimulus(stimulus);
          setTrialPhase('stimulus');
          setTrialStartTime(Date.now());
          
          // Auto-advance after 1.5 seconds if no response
          setTimeout(() => {
            if (trialPhase === 'stimulus') {
              nextTrial(false);
            }
          }, 1500);
        }, 400);
      }, 100);
    }, Math.random() * 1000 + 1000);
  }, [generateStimulus, trialPhase]);

  const handleResponse = (chosenDirection: 'left' | 'right') => {
    if (trialPhase !== 'stimulus' || !currentStimulus) return;
    
    const reactionTime = Date.now() - trialStartTime;
    const correct = chosenDirection === currentStimulus.direction;
    
    if (correct) {
      setScore(prev => prev + 1);
      setReactionTimes(prev => [...prev, reactionTime]);
    }
    
    nextTrial(correct);
  };

  const nextTrial = (correct: boolean) => {
    setTrialPhase('response');
    setRound(prev => prev + 1);
    
    setTimeout(() => {
      if (round < 30) { // 30 trials total
        startNewTrial();
      } else {
        setGameActive(false);
      }
    }, 500);
  };

  useEffect(() => {
    if (gameActive && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      setGameActive(false);
    }
  }, [gameActive, timeLeft]);

  const averageReactionTime = reactionTimes.length > 0 
    ? Math.round(reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length)
    : 0;

  const renderFlankers = (stimulus: Stimulus) => {
    const arrows = [];
    const targetArrow = stimulus.direction === 'left' ? '←' : '→';
    
    if (stimulus.flankerType === 'congruent') {
      // All arrows point same direction
      arrows.push(targetArrow, targetArrow, targetArrow, targetArrow, targetArrow);
    } else if (stimulus.flankerType === 'incongruent') {
      // Flankers point opposite direction
      const flankerArrow = stimulus.direction === 'left' ? '→' : '←';
      arrows.push(flankerArrow, flankerArrow, targetArrow, flankerArrow, flankerArrow);
    } else {
      // Neutral flankers
      arrows.push('—', '—', targetArrow, '—', '—');
    }
    
    return arrows.join(' ');
  };

  return (
    <GameContainer
      name="Visual Attention Training"
      score={score}
      timeLeft={timeLeft}
      onGameComplete={onComplete}
      gameType="visual-attention"
      onBack={() => {}}
    >
      <div className="space-y-6">
        {!gameActive && timeLeft === 90 ? (
          <div className="text-center space-y-4">
            <p className="text-gray-600 dark:text-gray-400">
              Scientific Benefits: Trains alerting, orienting, and executive attention networks.
              Based on the Attention Network Test (ANT) paradigm.
            </p>
            <div className="text-sm space-y-2 text-left max-w-md mx-auto">
              <p><strong>Instructions:</strong></p>
              <ul className="list-disc list-inside space-y-1">
                <li>Watch for the center arrow</li>
                <li>Ignore the flanking arrows/lines</li>
                <li>Respond as quickly and accurately as possible</li>
                <li>Click the direction the CENTER arrow points</li>
              </ul>
            </div>
            <Button onClick={startGame} size="lg" data-testid="button-start-attention">
              Start Training
            </Button>
          </div>
        ) : gameActive ? (
          <div className="relative h-96 w-full border-2 border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden">
            <div className="text-sm text-center mb-2">Trial {round}/30</div>
            
            {/* Fixation cross */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-2xl">
              +
            </div>
            
            {/* Spatial cue */}
            {showCue && (
              <div className="absolute top-8 left-1/2 transform -translate-x-1/2 text-sm">
                ↓
              </div>
            )}
            
            {/* Stimulus */}
            {currentStimulus && trialPhase === 'stimulus' && (
              <div
                className="absolute text-2xl font-mono"
                style={{
                  left: `${currentStimulus.x}%`,
                  top: `${currentStimulus.y}%`,
                  transform: 'translate(-50%, -50%)'
                }}
                data-testid="stimulus-display"
              >
                {renderFlankers(currentStimulus)}
              </div>
            )}
            
            {/* Response buttons */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-4">
              <Button
                onClick={() => handleResponse('left')}
                disabled={trialPhase !== 'stimulus'}
                size="lg"
                data-testid="button-left"
              >
                ← Left
              </Button>
              <Button
                onClick={() => handleResponse('right')}
                disabled={trialPhase !== 'stimulus'}
                size="lg"
                data-testid="button-right"
              >
                Right →
              </Button>
            </div>
            
            <div className="absolute top-2 left-2 text-sm text-gray-500">
              Phase: {trialPhase}
            </div>
          </div>
        ) : (
          <div className="text-center space-y-4">
            <h3 className="text-2xl font-bold">Training Complete!</h3>
            <div className="space-y-2">
              <p className="text-lg">Correct Responses: {score}/30</p>
              <p className="text-lg">Accuracy: {Math.round((score / 30) * 100)}%</p>
              <p className="text-lg">Average Reaction Time: {averageReactionTime}ms</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                High accuracy with fast reaction times indicates efficient attention networks!
              </p>
            </div>
            <Button onClick={startGame} size="lg" data-testid="button-restart-attention">
              Train Again
            </Button>
          </div>
        )}
      </div>
    </GameContainer>
  );
}