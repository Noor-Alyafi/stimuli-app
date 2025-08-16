import { motion } from "framer-motion";

interface IsometricGrowthTreeProps {
  stage: number;
  type?: string;
  xpContributed: number;
  className?: string;
}

export const IsometricGrowthTree = ({ 
  stage, 
  type = 'oak', 
  xpContributed,
  className = "" 
}: IsometricGrowthTreeProps) => {
  
  // Calculate tree size based on stage and XP contribution
  const getTreeScale = () => {
    const baseScale = 0.8 + (stage * 0.15);
    const xpBonus = Math.min(xpContributed / 100, 0.3); // Max 30% bonus from XP
    return baseScale + xpBonus;
  };

  const treeScale = getTreeScale();

  return (
    <div className={`relative flex items-end justify-center h-40 w-40 ${className}`}>
      <motion.div
        className="relative"
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: treeScale, opacity: 1 }}
        transition={{ duration: 1, ease: "easeOutBack" }}
      >
        {/* Ground Shadow */}
        <div 
          className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-black opacity-15 rounded-full"
          style={{ 
            width: `${60 + (stage * 12)}px`, 
            height: `${20 + (stage * 3)}px`,
            transform: `translateX(-50%) perspective(100px) rotateX(60deg)`
          }}
        />
        
        {/* Tree Trunk - 3D isometric like your reference */}
        <motion.div
          className="absolute bottom-0 left-1/2 transform -translate-x-1/2 z-10"
          style={{
            width: `${16 + (stage * 3)}px`,
            height: `${30 + (stage * 8)}px`,
            background: `
              linear-gradient(135deg, 
                #8B4513 0%, 
                #A0522D 25%, 
                #CD853F 50%, 
                #8B4513 75%, 
                #654321 100%
              )
            `,
            clipPath: 'polygon(30% 0%, 70% 0%, 80% 100%, 20% 100%)',
            filter: 'drop-shadow(3px 3px 8px rgba(0,0,0,0.4))',
            borderRadius: '2px 2px 0 0'
          }}
          animate={{
            scaleY: [1, 1.02, 1]
          }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        
        {/* Tree Foliage - Multiple layered sections like your reference image */}
        
        {/* Back/Bottom layer - darkest green */}
        <motion.div
          className="absolute left-1/2 transform -translate-x-1/2 z-20"
          style={{
            bottom: `${15 + (stage * 4)}px`,
            width: `${70 + (stage * 12)}px`,
            height: `${65 + (stage * 10)}px`,
            background: type === 'oak' 
              ? `radial-gradient(ellipse at center bottom,
                  #1a4d1a 0%,
                  #2d7d2d 30%,
                  #4a9d4a 60%,
                  #2d7d2d 100%
                )`
              : type === 'cherry'
              ? `radial-gradient(ellipse at center bottom,
                  #8B2635 0%,
                  #CD5C7F 30%,
                  #FFB6C1 60%,
                  #CD5C7F 100%
                )`
              : `radial-gradient(ellipse at center bottom,
                  #1a4d1a 0%,
                  #2d7d2d 30%,
                  #4a9d4a 60%,
                  #2d7d2d 100%
                )`,
            borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
            transform: 'perspective(200px) rotateX(8deg) rotateY(-5deg)',
            filter: 'drop-shadow(4px 4px 12px rgba(0,0,0,0.3))',
          }}
          animate={{
            rotateY: [-5, -3, -5],
            scale: [1, 1.01, 1]
          }}
          transition={{ duration: 6, repeat: Infinity }}
        />
        
        {/* Middle layer - medium green */}
        <motion.div
          className="absolute left-1/2 transform -translate-x-1/2 z-30"
          style={{
            bottom: `${25 + (stage * 5)}px`,
            width: `${60 + (stage * 10)}px`,
            height: `${55 + (stage * 8)}px`,
            background: type === 'oak'
              ? `radial-gradient(ellipse at center bottom,
                  #2d7d2d 0%,
                  #4a9d4a 30%,
                  #66cc66 60%,
                  #4a9d4a 100%
                )`
              : type === 'cherry'
              ? `radial-gradient(ellipse at center bottom,
                  #CD5C7F 0%,
                  #FFB6C1 30%,
                  #FFCCCB 60%,
                  #FFB6C1 100%
                )`
              : `radial-gradient(ellipse at center bottom,
                  #2d7d2d 0%,
                  #4a9d4a 30%,
                  #66cc66 60%,
                  #4a9d4a 100%
                )`,
            borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
            transform: 'perspective(200px) rotateX(5deg) rotateY(3deg)',
            filter: 'drop-shadow(2px 2px 8px rgba(0,0,0,0.25))',
          }}
          animate={{
            rotateY: [3, 5, 3],
            scale: [1, 1.015, 1]
          }}
          transition={{ duration: 5, repeat: Infinity }}
        />
        
        {/* Front/Top layer - lightest green */}
        <motion.div
          className="absolute left-1/2 transform -translate-x-1/2 z-40"
          style={{
            bottom: `${35 + (stage * 6)}px`,
            width: `${50 + (stage * 8)}px`,
            height: `${45 + (stage * 6)}px`,
            background: type === 'oak'
              ? `radial-gradient(ellipse at center bottom,
                  #4a9d4a 0%,
                  #66cc66 30%,
                  #99ff99 60%,
                  #66cc66 100%
                )`
              : type === 'cherry'
              ? `radial-gradient(ellipse at center bottom,
                  #FFB6C1 0%,
                  #FFCCCB 30%,
                  #FFF0F5 60%,
                  #FFCCCB 100%
                )`
              : `radial-gradient(ellipse at center bottom,
                  #4a9d4a 0%,
                  #66cc66 30%,
                  #99ff99 60%,
                  #66cc66 100%
                )`,
            borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
            transform: 'perspective(200px) rotateX(2deg) rotateY(-2deg)',
            filter: 'drop-shadow(1px 1px 4px rgba(0,0,0,0.2))',
          }}
          animate={{
            rotateY: [-2, 0, -2],
            scale: [1, 1.008, 1]
          }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        
        {/* XP Growth Sparkles */}
        {xpContributed > 0 && (
          <motion.div
            className="absolute top-2 right-2 text-yellow-400 text-xl z-50"
            animate={{ 
              rotate: [0, 15, -15, 0],
              scale: [1, 1.3, 1],
              opacity: [0.7, 1, 0.7]
            }}
            transition={{ duration: 2.5, repeat: Infinity }}
          >
            ✨
          </motion.div>
        )}
        
        {/* Maturity Crown */}
        {stage >= 5 && (
          <motion.div
            className="absolute top-0 left-1/2 transform -translate-x-1/2 text-amber-300 text-2xl z-50"
            animate={{ 
              scale: [1, 1.4, 1],
              opacity: [0.8, 1, 0.8],
              rotate: [0, 360]
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            🌟
          </motion.div>
        )}
        
        {/* High XP Glow Effect */}
        {xpContributed > 50 && (
          <motion.div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-5"
            style={{
              width: `${80 + (stage * 15)}px`,
              height: `${80 + (stage * 15)}px`,
              background: `radial-gradient(circle, rgba(255,215,0,0.2) 0%, transparent 70%)`,
              borderRadius: '50%'
            }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{ duration: 3, repeat: Infinity }}
          />
        )}
      </motion.div>
    </div>
  );
};