import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { GameCard } from "@/components/GameCard";
import { GameContainer } from "@/components/games/GameContainer";
import { ColorEchoGame } from "@/components/games/ColorEchoGame";
import { ShapeSequenceGame } from "@/components/games/ShapeSequenceGame";
import { SpotlightGame } from "@/components/games/SpotlightGame";
import { SynestheticRecallGame } from "@/components/games/SynestheticRecallGame";
import { MemoryMatrixGame } from "@/components/games/MemoryMatrixGame";
import { QuickResponseGame } from "@/components/games/QuickResponseGame";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest } from "@/lib/queryClient";

const games = [
  {
    gameType: "color-echo",
    name: "Color Echo",
    description: "Match colors to sounds and strengthen cross-sensory connections.",
    skillType: "Synesthetic Memory",
  },
  {
    gameType: "shape-sequence",
    name: "Shape Sequence",
    description: "Remember and reproduce complex visual patterns.",
    skillType: "Pattern Recognition",
  },
  {
    gameType: "spotlight",
    name: "Spotlight",
    description: "Find the odd one out and improve focused attention.",
    skillType: "Attention Training",
  },
  {
    gameType: "synesthetic-recall",
    name: "Synesthetic Recall",
    description: "Connect words with colors to enhance semantic memory.",
    skillType: "Word-Color Memory",
  },
  {
    gameType: "memory-matrix",
    name: "Memory Matrix",
    description: "Remember and manipulate information in your mind.",
    skillType: "Working Memory",
  },
  {
    gameType: "quick-response",
    name: "Quick Response",
    description: "React quickly to visual stimuli and improve mental speed.",
    skillType: "Processing Speed",
  },
];

export default function Training() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeGame, setActiveGame] = useState<string | null>(null);
  
  const { data: bestScores, isLoading } = useQuery({
    queryKey: ["/api/best-scores"],
    retry: false,
  });

  const gameProgressMutation = useMutation({
    mutationFn: async (gameData: { gameType: string; score: number; timeTaken: number }) => {
      await apiRequest("POST", "/api/game-progress", gameData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/best-scores"] });
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      toast({
        title: "Great job!",
        description: "Your progress has been saved. +10 XP earned!",
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to save progress. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handlePlayGame = (gameType: string) => {
    setActiveGame(gameType);
  };

  const handleGameComplete = (gameType: string, score: number, timeTaken: number) => {
    // The GameContainer will handle the API call and feedback
    setActiveGame(null);
  };

  const handleBackToGames = () => {
    setActiveGame(null);
  };

  const renderGame = (gameType: string) => {
    const game = games.find(g => g.gameType === gameType);
    if (!game) return null;

    const gameComponents = {
      'color-echo': ColorEchoGame,
      'shape-sequence': ShapeSequenceGame,
      'spotlight': SpotlightGame,
      'synesthetic-recall': SynestheticRecallGame,
      'memory-matrix': MemoryMatrixGame,
      'quick-response': QuickResponseGame,
    };

    const GameComponent = gameComponents[gameType as keyof typeof gameComponents];
    if (!GameComponent) return null;

    return (
      <GameContainer
        gameType={gameType}
        name={game.name}
        onBack={handleBackToGames}
        onGameComplete={(score, timeTaken) => handleGameComplete(gameType, score, timeTaken)}
      >
        <GameComponent onComplete={(score, timeTaken) => {
          (window as any).completeGame?.(score, timeTaken);
        }} />
      </GameContainer>
    );
  };

  const getBestScore = (gameType: string) => {
    if (!bestScores) return undefined;
    const score = bestScores.find((s: any) => s.gameType === gameType);
    return score ? score.bestScore : undefined;
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 bg-gray-200 rounded-2xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // If a game is active, render the game
  if (activeGame) {
    return renderGame(activeGame);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h2 className="text-3xl font-inter font-bold text-navy mb-2">
          Cognitive Training
        </h2>
        <p className="text-gray-600">
          Challenge your mind with scientifically-designed exercises
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {games.map((game, index) => (
          <motion.div
            key={game.gameType}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <GameCard
              gameType={game.gameType}
              name={game.name}
              description={game.description}
              skillType={game.skillType}
              bestScore={getBestScore(game.gameType)}
              onPlay={() => handlePlayGame(game.gameType)}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
