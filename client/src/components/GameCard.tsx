import { motion } from "framer-motion";
import { Brain, Palette, Shapes, Eye, Type, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface GameCardProps {
  gameType: string;
  name: string;
  description: string;
  skillType: string;
  bestScore?: number;
  onPlay: () => void;
}

const gameIcons = {
  "color-echo": Palette,
  "shape-sequence": Shapes,
  "spotlight": Eye,
  "synesthetic-recall": Type,
  "memory-matrix": Brain,
  "quick-response": Zap,
};

const skillColors = {
  "Synesthetic Memory": "from-purple-500 to-pink-500",
  "Pattern Recognition": "from-blue-500 to-cyan-500",
  "Attention Training": "from-green-500 to-teal-500",
  "Word-Color Memory": "from-orange-500 to-red-500",
  "Working Memory": "from-indigo-500 to-purple-500",
  "Processing Speed": "from-yellow-500 to-orange-500",
};

export function GameCard({ 
  gameType, 
  name, 
  description, 
  skillType, 
  bestScore, 
  onPlay 
}: GameCardProps) {
  const IconComponent = gameIcons[gameType as keyof typeof gameIcons] || Brain;
  const colorClass = skillColors[skillType as keyof typeof skillColors] || "from-gray-500 to-gray-600";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.02 }}
      className="h-full"
    >
      <Card className="h-full hover:shadow-md transition-shadow duration-300">
        <CardContent className="p-6 h-full flex flex-col">
          <div className="flex items-center space-x-3 mb-4">
            <div className={`w-12 h-12 bg-gradient-to-r ${colorClass} rounded-xl flex items-center justify-center`}>
              <IconComponent className="text-white" size={24} />
            </div>
            <div>
              <h3 className="font-semibold text-navy font-inter">{name}</h3>
              <p className="text-sm text-gray-500">{skillType}</p>
            </div>
          </div>
          
          <p className="text-gray-600 mb-4 flex-grow">{description}</p>
          
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm text-gray-500">
              {bestScore !== undefined ? (
                <>Best Score: <span className="font-medium text-navy">{bestScore}%</span></>
              ) : (
                "Not played yet"
              )}
            </span>
            <span className="text-sm text-gray-500">+10 XP</span>
          </div>
          
          <Button 
            onClick={onPlay}
            className="w-full bg-navy hover:bg-navy/90 text-white font-medium"
          >
            Start Training
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}
