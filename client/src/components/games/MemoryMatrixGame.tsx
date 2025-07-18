import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface MemoryMatrixGameProps {
  onComplete: (score: number, timeTaken: number) => void;
}

interface Cell {
  row: number;
  col: number;
  isActive: boolean;
  isSelected: boolean;
}

export function MemoryMatrixGame({ onComplete }: MemoryMatrixGameProps) {
  const [gameState, setGameState] = useState<'intro' | 'showing' | 'playing' | 'feedback'>('intro');
  const [currentLevel, setCurrentLevel] = useState(1);
  const [gridSize, setGridSize] = useState(3);
  const [cells, setCells] = useState<Cell[]>([]);
  const [activeCells, setActiveCells] = useState<Cell[]>([]);
  const [selectedCells, setSelectedCells] = useState<Cell[]>([]);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [gameStartTime, setGameStartTime] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | ''>('');
  const [timeLeft, setTimeLeft] = useState(50);
  const [showTimeLeft, setShowTimeLeft] = useState(3);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const showTimerRef = useRef<NodeJS.Timeout | null>(null);

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
    if (gameState === 'showing' && showTimeLeft > 0) {
      showTimerRef.current = setInterval(() => {
        setShowTimeLeft(prev => {
          if (prev <= 1) {
            startPlaying();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (showTimerRef.current) {
      clearInterval(showTimerRef.current);
    }

    return () => {
      if (showTimerRef.current) {
        clearInterval(showTimerRef.current);
      }
    };
  }, [gameState, showTimeLeft]);

  const generateGrid = () => {
    const size = Math.min(3 + Math.floor(currentLevel / 3), 6);
    setGridSize(size);
    
    const newCells: Cell[] = [];
    for (let row = 0; row < size; row++) {
      for (let col = 0; col < size; col++) {
        newCells.push({
          row,
          col,
          isActive: false,
          isSelected: false,
        });
      }
    }
    
    // Randomly select cells to be active
    const numActive = Math.min(3 + Math.floor(currentLevel / 2), Math.floor(size * size / 2));
    const shuffled = [...newCells].sort(() => Math.random() - 0.5);
    const active = shuffled.slice(0, numActive);
    
    active.forEach(cell => {
      cell.isActive = true;
    });
    
    setCells(newCells);
    setActiveCells(active);
    setSelectedCells([]);
  };

  const startGame = () => {
    setGameState('showing');
    setGameStartTime(Date.now());
    setTimeLeft(50);
    setScore(0);
    setStreak(0);
    setCurrentLevel(1);
    setShowTimeLeft(3);
    generateGrid();
  };

  const startPlaying = () => {
    setGameState('playing');
    // Hide the active cells
    setCells(prev => prev.map(cell => ({ ...cell, isActive: false })));
  };

  const handleCellClick = (clickedCell: Cell) => {
    if (gameState !== 'playing') return;
    
    const newSelectedCells = [...selectedCells];
    const existingIndex = newSelectedCells.findIndex(
      cell => cell.row === clickedCell.row && cell.col === clickedCell.col
    );
    
    if (existingIndex >= 0) {
      // Deselect cell
      newSelectedCells.splice(existingIndex, 1);
    } else {
      // Select cell
      newSelectedCells.push(clickedCell);
    }
    
    setSelectedCells(newSelectedCells);
    
    // Update cells display
    setCells(prev => prev.map(cell => ({
      ...cell,
      isSelected: newSelectedCells.some(
        selected => selected.row === cell.row && selected.col === cell.col
      )
    })));
  };

  const checkAnswer = () => {
    const isCorrect = 
      selectedCells.length === activeCells.length &&
      selectedCells.every(selected => 
        activeCells.some(active => 
          active.row === selected.row && active.col === selected.col
        )
      );
    
    if (isCorrect) {
      setFeedback('correct');
      const basePoints = 30 + (currentLevel * 8);
      const accuracyBonus = Math.floor((selectedCells.length / activeCells.length) * 20);
      const streakBonus = streak * 5;
      const totalPoints = basePoints + accuracyBonus + streakBonus;
      
      setScore(prev => prev + totalPoints);
      setStreak(prev => prev + 1);
      setCurrentLevel(prev => prev + 1);
      
      setTimeout(() => {
        setFeedback('');
        if (timeLeft > 0) {
          setShowTimeLeft(3);
          generateGrid();
          setGameState('showing');
        } else {
          endGame();
        }
      }, 1500);
    } else {
      setFeedback('incorrect');
      setStreak(0);
      
      setTimeout(() => {
        setFeedback('');
        if (timeLeft > 0) {
          setShowTimeLeft(3);
          generateGrid();
          setGameState('showing');
        } else {
          endGame();
        }
      }, 1500);
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
              <div className="text-6xl">🧠</div>
              <h2 className="text-2xl font-bold">Memory Matrix</h2>
              <p className="text-gray-600 dark:text-gray-300">
                Study the pattern of highlighted cells, then recreate it from memory. 
                Train your spatial working memory and pattern recognition skills!
              </p>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                  <strong>Study Phase:</strong> 3 seconds to memorize pattern
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                  <strong>Scoring:</strong> 30+ points per correct pattern
                </div>
                <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg">
                  <strong>Streak bonus:</strong> +5 points per consecutive success
                </div>
                <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded-lg">
                  <strong>Difficulty:</strong> Grid size increases with level
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
          <Badge variant="outline">Grid: {gridSize}x{gridSize}</Badge>
        </div>
        <div className="flex items-center gap-4">
          {gameState === 'showing' && (
            <Badge variant="destructive">Study: {showTimeLeft}s</Badge>
          )}
          <div className="text-sm text-gray-600 dark:text-gray-300">
            Time: {timeLeft}s
          </div>
          <Badge className="text-lg px-4 py-2">Score: {score}</Badge>
        </div>
      </div>

      {/* Game Instructions */}
      <Card>
        <CardContent className="p-4">
          <div className="text-center text-sm text-gray-600 dark:text-gray-300">
            {gameState === 'showing' && "📚 Study the pattern - remember which cells are highlighted"}
            {gameState === 'playing' && "🎯 Click the cells that were highlighted"}
          </div>
        </CardContent>
      </Card>

      {/* Game Grid */}
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-center">
            <div 
              className="grid gap-2 max-w-md"
              style={{ 
                gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
                gridTemplateRows: `repeat(${gridSize}, 1fr)`,
              }}
            >
              {cells.map((cell, index) => (
                <motion.button
                  key={index}
                  onClick={() => handleCellClick(cell)}
                  disabled={gameState !== 'playing'}
                  className={`
                    w-16 h-16 border-2 rounded-lg transition-all duration-200
                    ${gameState === 'playing' ? 'hover:scale-105 cursor-pointer' : 'cursor-not-allowed'}
                    ${cell.isActive && gameState === 'showing' ? 'bg-blue-500 border-blue-600' : ''}
                    ${cell.isSelected && gameState === 'playing' ? 'bg-green-500 border-green-600' : ''}
                    ${!cell.isActive && !cell.isSelected ? 'bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600' : ''}
                  `}
                  whileHover={gameState === 'playing' ? { scale: 1.05 } : {}}
                  whileTap={gameState === 'playing' ? { scale: 0.95 } : {}}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Submit Button */}
      {gameState === 'playing' && (
        <div className="text-center">
          <Button
            onClick={checkAnswer}
            size="lg"
            className="text-lg px-8 py-4"
          >
            Submit Answer ({selectedCells.length}/{activeCells.length})
          </Button>
        </div>
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
                    `Excellent memory! Pattern ${currentLevel} mastered.` : 
                    'Study the pattern more carefully next time!'
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