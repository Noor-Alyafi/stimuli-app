import { motion } from "framer-motion";

interface GrowthTreeProps {
  xp: number;
  level: number;
  achievements: number;
  className?: string;
}

export function GrowthTree({ xp, level, achievements, className = "" }: GrowthTreeProps) {
  const getTreeStage = (level: number) => {
    if (level <= 1) return "sprout";
    if (level <= 3) return "young";
    if (level <= 5) return "mature";
    return "ancient";
  };

  const treeStage = getTreeStage(level);
  const flowerCount = Math.min(achievements, 5);

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div className="relative">
        <svg width="200" height="240" viewBox="0 0 200 240" className="drop-shadow-sm">
          {/* Tree Trunk */}
          <motion.rect
            x="95"
            y="180"
            width="10"
            height="40"
            fill="#8B4513"
            rx="2"
            initial={{ height: 0 }}
            animate={{ height: 40 }}
            transition={{ duration: 0.5 }}
          />
          
          {/* Tree Base */}
          <motion.ellipse
            cx="100"
            cy="220"
            rx="15"
            ry="8"
            fill="#22C55E"
            opacity="0.3"
            initial={{ rx: 0, ry: 0 }}
            animate={{ rx: 15, ry: 8 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          />
          
          {/* Level 1 Branches */}
          {level >= 1 && (
            <motion.circle
              cx="100"
              cy="160"
              r="25"
              fill="#22C55E"
              opacity="0.8"
              initial={{ r: 0 }}
              animate={{ r: 25 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            />
          )}
          
          {/* Level 2 Branches */}
          {level >= 2 && (
            <>
              <motion.circle
                cx="85"
                cy="140"
                r="20"
                fill="#16A34A"
                opacity="0.9"
                initial={{ r: 0 }}
                animate={{ r: 20 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              />
              <motion.circle
                cx="115"
                cy="140"
                r="20"
                fill="#16A34A"
                opacity="0.9"
                initial={{ r: 0 }}
                animate={{ r: 20 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              />
            </>
          )}
          
          {/* Level 3 Branches */}
          {level >= 3 && (
            <>
              <motion.circle
                cx="100"
                cy="120"
                r="18"
                fill="#15803D"
                initial={{ r: 0 }}
                animate={{ r: 18 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              />
              <motion.circle
                cx="75"
                cy="125"
                r="15"
                fill="#15803D"
                initial={{ r: 0 }}
                animate={{ r: 15 }}
                transition={{ duration: 0.5, delay: 0.7 }}
              />
              <motion.circle
                cx="125"
                cy="125"
                r="15"
                fill="#15803D"
                initial={{ r: 0 }}
                animate={{ r: 15 }}
                transition={{ duration: 0.5, delay: 0.8 }}
              />
            </>
          )}
          
          {/* Achievement Flowers */}
          {flowerCount > 0 && (
            <motion.g 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 1 }}
            >
              {[...Array(flowerCount)].map((_, i) => (
                <motion.circle
                  key={i}
                  cx={90 + i * 5}
                  cy={115 - i * 2}
                  r="4"
                  fill={i % 2 === 0 ? "#F59E0B" : "#EF4444"}
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.2 
                  }}
                />
              ))}
            </motion.g>
          )}
          
          {/* Next Level Preview (faded) */}
          {level >= 4 && (
            <>
              <circle cx="100" cy="90" r="12" fill="#22C55E" opacity="0.3" />
              <circle cx="85" cy="95" r="10" fill="#22C55E" opacity="0.3" />
              <circle cx="115" cy="95" r="10" fill="#22C55E" opacity="0.3" />
            </>
          )}
        </svg>
      </div>
      
      {/* Tree Stats */}
      <div className="mt-4 p-3 bg-gray-50 rounded-lg text-center min-w-[200px]">
        <p className="text-sm text-gray-600">
          XP: <span className="font-medium text-navy">{xp}</span> | 
          Level: <span className="font-medium text-navy">{level}</span>
        </p>
        <p className="text-xs text-gray-500 mt-1">
          {treeStage === "sprout" && "Your journey begins! 🌱"}
          {treeStage === "young" && "Growing strong! 🌿"}
          {treeStage === "mature" && "Your mind is blooming! 🌸"}
          {treeStage === "ancient" && "Neural mastery achieved! 🌳"}
        </p>
      </div>
    </div>
  );
}
