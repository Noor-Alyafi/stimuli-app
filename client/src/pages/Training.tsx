import { useEffect, useState } from "react";
import { useStaticGameProgress } from "@/hooks/useStaticData";
import { useStaticAuth } from "@/hooks/useStaticAuth";
import { GameCard } from "@/components/GameCard";
import { GameContainer } from "@/components/games/GameContainer";
import { ColorEchoGame } from "@/components/games/ColorEchoGame";
import { ShapeSequenceGame } from "@/components/games/ShapeSequenceGame";
import { SpotlightGame } from "@/components/games/SpotlightGame";
import { SynestheticRecallGame } from "@/components/games/SynestheticRecallGame";
import { MemoryMatrixGame } from "@/components/games/MemoryMatrixGame";
import { QuickResponseGame } from "@/components/games/QuickResponseGame";
import { ReactionTimeGame } from "@/components/games/ReactionTimeGame";
import { NumberSequenceGame } from "@/components/games/NumberSequenceGame";
import { PatternRecognitionGame } from "@/components/games/PatternRecognitionGame";
// import StroopTestGame from "@/components/games/StroopTestGame";
// import DualNBackGame from "@/components/games/DualNBackGame";
// import VisualAttentionGame from "@/components/games/VisualAttentionGame";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";


const games = [
  // Original Synesthesia Games
  {
    gameType: "color-echo",
    name: "Color Echo",
    description: "Match colors to sounds and strengthen cross-sensory connections.",
    skillType: "Synesthetic Memory",
    badge: "Synesthesia",
  },
  {
    gameType: "shape-sequence",
    name: "Shape Sequence",
    description: "Remember and reproduce complex visual patterns.",
    skillType: "Pattern Recognition",
    badge: "Memory",
  },
  {
    gameType: "spotlight",
    name: "Spotlight",
    description: "Find the odd one out and improve focused attention.",
    skillType: "Attention Training",
    badge: "Focus",
  },
  {
    gameType: "synesthetic-recall",
    name: "Synesthetic Recall",
    description: "Connect words with colors to enhance semantic memory.",
    skillType: "Word-Color Memory",
    badge: "Synesthesia",
  },
  {
    gameType: "memory-matrix",
    name: "Memory Matrix",
    description: "Remember and manipulate information in your mind.",
    skillType: "Working Memory",
    badge: "Memory",
  },
  {
    gameType: "quick-response",
    name: "Quick Response",
    description: "React quickly to visual stimuli and improve mental speed.",
    skillType: "Processing Speed",
    badge: "Speed",
  },
  
  // New Scientifically-Backed Games
  {
    gameType: "reaction-time",
    name: "Reaction Time",
    description: "Test and improve your reflexes with scientific precision timing.",
    skillType: "Motor Response",
    badge: "Science-Backed",
  },
  {
    gameType: "number-sequence",
    name: "Number Sequence Memory",
    description: "Challenge your working memory with digit span tasks.",
    skillType: "Working Memory",
    badge: "Science-Backed",
  },
  {
    gameType: "pattern-recognition",
    name: "Pattern Recognition",
    description: "Develop analytical thinking with complex pattern sequences.",
    skillType: "Logical Reasoning",
    badge: "Science-Backed",
  },
  // {
  //   gameType: "stroop-test",
  //   name: "Stroop Test",
  //   description: "Scientific attention control training based on the classic Stroop effect.",
  //   skillType: "Cognitive Flexibility",
  //   badge: "Science-Backed",
  // },
  // {
  //   gameType: "dual-n-back",
  //   name: "Dual N-Back",
  //   description: "Proven working memory training that can increase fluid intelligence.",
  //   skillType: "Working Memory",
  //   badge: "IQ Training",
  // },
  // {
  //   gameType: "visual-attention",
  //   name: "Visual Attention",
  //   description: "Train your attention networks with this research-based paradigm.",
  //   skillType: "Attention Networks",
  //   badge: "Science-Backed",
  // },
];

export default function Training() {
  const { toast } = useToast();
  const { user } = useStaticAuth();
  const { addGameProgress, gameProgress } = useStaticGameProgress();
  const [activeGame, setActiveGame] = useState<string | null>(null);

  const handlePlayGame = (gameType: string) => {
    setActiveGame(gameType);
  };

  const handleGameComplete = (gameType: string, score: number, timeTaken: number) => {
    if (user) {
      addGameProgress({
        gameType,
        score,
        timeTaken,
        difficulty: 'normal'
      });
      
      toast({
        title: "Great job!",
        description: "Your progress has been saved. XP earned!",
      });
    }
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
      'reaction-time': ReactionTimeGame,
      'number-sequence': NumberSequenceGame,
      'pattern-recognition': PatternRecognitionGame,
      // 'stroop-test': StroopTestGame,
      // 'dual-n-back': DualNBackGame,
      // 'visual-attention': VisualAttentionGame,
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
    if (!bestScores || !Array.isArray(bestScores)) return undefined;
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
