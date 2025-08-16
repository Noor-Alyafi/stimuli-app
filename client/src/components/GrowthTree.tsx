import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface GrowthTreeProps {
  xp: number;
  level: number;
  achievements?: number;
  className?: string;
}

export const GrowthTree = ({ xp, level, achievements = 0, className = "" }: GrowthTreeProps) => {
  const [animationKey, setAnimationKey] = useState(0);

  useEffect(() => {
    setAnimationKey(prev => prev + 1);
  }, [level, xp]);

  // Calculate tree size and complexity based on level
  const baseSize = 120;
  const treeHeight = baseSize + (level * 15);
  const treeWidth = baseSize + (level * 12);
  
  // Calculate colors that get richer with level
  const getTreeColor = () => {
    if (level >= 10) return { main: '#2E7D32', light: '#4CAF50', accent: '#81C784' }; // Deep green
    if (level >= 7) return { main: '#388E3C', light: '#66BB6A', accent: '#A5D6A7' }; // Forest green  
    if (level >= 5) return { main: '#4CAF50', light: '#81C784', accent: '#C8E6C9' }; // Medium green
    if (level >= 3) return { main: '#66BB6A', light: '#A5D6A7', accent: '#DCEDC8' }; // Light green
    return { main: '#8BC34A', light: '#AED581', accent: '#F1F8E9' }; // Young green
  };

  const colors = getTreeColor();

  // Calculate branch positions based on level
  const getBranches = () => {
    const branches = [];
    const maxBranches = Math.min(level + 2, 8);
    
    for (let i = 0; i < maxBranches; i++) {
      const angle = (i / maxBranches) * 360 + (level * 15); // Spread branches around
      const radius = 35 + (level * 3);
      const branchLength = 25 + (level * 2);
      
      branches.push({
        angle,
        radius,
        length: branchLength,
        thickness: 3 + Math.floor(level / 3)
      });
    }
    return branches;
  };

  const branches = getBranches();

  // Calculate flowers/achievements based on progress
  const getFlowers = () => {
    const flowers = [];
    const flowerCount = Math.min(achievements + Math.floor(level / 2), 12);
    
    for (let i = 0; i < flowerCount; i++) {
      const angle = (i / flowerCount) * 360 + (level * 10);
      const radius = 45 + (level * 4) + Math.random() * 15;
      
      flowers.push({
        angle,
        radius,
        type: i % 3 === 0 ? '🌸' : i % 3 === 1 ? '🌺' : '🏵️'
      });
    }
    return flowers;
  };

  const flowers = getFlowers();

  return (
    <div className={`flex items-center justify-center min-h-[300px] ${className}`}>
      <div className="relative" style={{ width: treeWidth + 50, height: treeHeight + 50 }}>
        
        {/* Tree Trunk */}
        <motion.div
          key={`trunk-${animationKey}`}
          className="absolute bottom-0 left-1/2 transform -translate-x-1/2"
          style={{
            width: Math.max(16, level * 3),
            height: Math.max(40, level * 8),
            background: `linear-gradient(to bottom, #8D6E63, #6D4C41)`,
            borderRadius: `${Math.max(8, level * 1.5)}px`,
            boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
          }}
          initial={{ height: 0, opacity: 0 }}
          animate={{ 
            height: Math.max(40, level * 8), 
            opacity: 1 
          }}
          transition={{ duration: 1, ease: "backOut" }}
        />

        {/* Main Tree Crown - Professional layered approach */}
        <motion.div
          key={`crown-${animationKey}`}
          className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.2, ease: "backOut", delay: 0.3 }}
        >
          {/* Base crown layer */}
          <div
            style={{
              width: treeWidth * 0.7,
              height: treeWidth * 0.7,
              background: `radial-gradient(circle at 30% 30%, ${colors.light}, ${colors.main})`,
              borderRadius: '50%',
              boxShadow: `0 8px 16px rgba(0,0,0,0.15), inset 0 4px 8px ${colors.accent}`,
              position: 'relative'
            }}
          >
            {/* Highlight on crown */}
            <div
              style={{
                position: 'absolute',
                top: '20%',
                left: '25%',
                width: '30%',
                height: '30%',
                background: `radial-gradient(circle, ${colors.accent}, transparent)`,
                borderRadius: '50%',
                opacity: 0.7
              }}
            />
          </div>

          {/* Secondary crown layers for depth */}
          <div
            style={{
              position: 'absolute',
              top: '-15%',
              left: '-10%',
              width: '60%',
              height: '60%',
              background: `radial-gradient(circle at 40% 40%, ${colors.light}, ${colors.main})`,
              borderRadius: '50%',
              opacity: 0.8,
              boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
            }}
          />

          <div
            style={{
              position: 'absolute',
              top: '-10%',
              right: '-15%',
              width: '50%',
              height: '50%',
              background: `radial-gradient(circle at 60% 40%, ${colors.light}, ${colors.main})`,
              borderRadius: '50%',
              opacity: 0.85,
              boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
            }}
          />
        </motion.div>

        {/* Dynamic Branches */}
        {branches.map((branch, index) => {
          const x = Math.cos((branch.angle * Math.PI) / 180) * branch.radius;
          const y = Math.sin((branch.angle * Math.PI) / 180) * branch.radius;
          
          return (
            <motion.div
              key={`branch-${index}-${animationKey}`}
              className="absolute top-1/2 left-1/2"
              style={{
                width: branch.length,
                height: branch.thickness,
                background: `linear-gradient(to right, #8D6E63, ${colors.main})`,
                borderRadius: branch.thickness / 2,
                transform: `translate(${x}px, ${y}px) rotate(${branch.angle}deg)`,
                transformOrigin: '0 50%',
                boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
              }}
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ 
                duration: 0.6, 
                delay: 0.5 + index * 0.1,
                ease: "backOut" 
              }}
            />
          );
        })}

        {/* Achievement Flowers */}
        {flowers.map((flower, index) => {
          const x = Math.cos((flower.angle * Math.PI) / 180) * flower.radius;
          const y = Math.sin((flower.angle * Math.PI) / 180) * flower.radius;
          
          return (
            <motion.div
              key={`flower-${index}-${animationKey}`}
              className="absolute top-1/2 left-1/2 text-lg"
              style={{
                transform: `translate(${x}px, ${y}px)`
              }}
              initial={{ scale: 0, rotate: -180, opacity: 0 }}
              animate={{ 
                scale: [0, 1.3, 1], 
                rotate: [0, 15, 0], 
                opacity: 1 
              }}
              transition={{ 
                duration: 0.8, 
                delay: 1 + index * 0.15,
                ease: "backOut" 
              }}
              whileHover={{
                scale: 1.4,
                rotate: 10,
                transition: { duration: 0.2 }
              }}
            >
              {flower.type}
            </motion.div>
          );
        })}

        {/* Level indicator */}
        <motion.div
          className="absolute -bottom-6 left-1/2 transform -translate-x-1/2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5 }}
        >
          <div className="bg-white dark:bg-gray-800 rounded-full px-3 py-1 shadow-md border">
            <span className="text-sm font-semibold text-navy dark:text-cyan">
              Level {level}
            </span>
          </div>
        </motion.div>

        {/* XP glow effect for high performers */}
        {xp > 200 && (
          <motion.div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
            style={{
              width: treeWidth + 40,
              height: treeWidth + 40,
              background: `radial-gradient(circle, rgba(255,215,0,0.2) 0%, transparent 70%)`,
              borderRadius: '50%'
            }}
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        )}

        {/* Wind animation for leaves */}
        <motion.div
          className="absolute top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          animate={{
            rotate: [-2, 2, -2]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <div style={{
            width: treeWidth * 0.8,
            height: treeWidth * 0.8,
            opacity: 0
          }} />
        </motion.div>

      </div>
    </div>
  );
};