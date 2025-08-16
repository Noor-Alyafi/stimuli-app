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
        transition={{ duration: 1, ease: "backOut" }}
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
        
        {/* Tree Crown - Chunky layered foliage exactly like reference image */}
        
        {/* Bottom layer - large bumpy foliage base */}
        <motion.div
          className="absolute left-1/2 transform -translate-x-1/2 z-20"
          style={{
            bottom: `${12 + (stage * 3)}px`,
            width: `${80 + (stage * 8)}px`,
            height: `${50 + (stage * 6)}px`,
            background: type === 'oak' 
              ? `linear-gradient(135deg, #4a7c4a 0%, #5d9c5d 40%, #6bb16b 100%)`
              : type === 'cherry'
              ? `linear-gradient(135deg, #8B4A6B 0%, #B56B8B 40%, #D48BAB 100%)`
              : `linear-gradient(135deg, #4a7c4a 0%, #5d9c5d 40%, #6bb16b 100%)`,
            clipPath: `polygon(
              15% 100%, 25% 85%, 35% 90%, 45% 80%, 55% 85%, 65% 75%, 
              75% 80%, 85% 100%, 50% 0%
            )`,
            filter: 'drop-shadow(3px 3px 6px rgba(0,0,0,0.3))',
          }}
          animate={{
            scale: [1, 1.01, 1]
          }}
          transition={{ duration: 5, repeat: Infinity }}
        />
        
        {/* Middle layer - medium bumpy sections */}
        <motion.div
          className="absolute left-1/2 transform -translate-x-1/2 z-30"
          style={{
            bottom: `${20 + (stage * 4)}px`,
            width: `${65 + (stage * 7)}px`,
            height: `${42 + (stage * 5)}px`,
            background: type === 'oak'
              ? `linear-gradient(135deg, #5d9c5d 0%, #7db87d 40%, #9dd19d 100%)`
              : type === 'cherry'
              ? `linear-gradient(135deg, #B56B8B 0%, #D48BAB 40%, #F3ABCB 100%)`
              : `linear-gradient(135deg, #5d9c5d 0%, #7db87d 40%, #9dd19d 100%)`,
            clipPath: `polygon(
              20% 100%, 30% 80%, 40% 85%, 50% 75%, 60% 80%, 70% 70%, 
              80% 100%, 50% 0%
            )`,
            filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.25))',
          }}
          animate={{
            scale: [1, 1.008, 1]
          }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        
        {/* Top layer - small bright crown */}
        <motion.div
          className="absolute left-1/2 transform -translate-x-1/2 z-40"
          style={{
            bottom: `${28 + (stage * 5)}px`,
            width: `${50 + (stage * 6)}px`,
            height: `${35 + (stage * 4)}px`,
            background: type === 'oak'
              ? `linear-gradient(135deg, #7db87d 0%, #9dd19d 40%, #bde8bd 100%)`
              : type === 'cherry'
              ? `linear-gradient(135deg, #D48BAB 0%, #F3ABCB 40%, #FFCBEB 100%)`
              : `linear-gradient(135deg, #7db87d 0%, #9dd19d 40%, #bde8bd 100%)`,
            clipPath: `polygon(
              25% 100%, 35% 85%, 45% 90%, 55% 80%, 65% 85%, 75% 100%, 
              50% 0%
            )`,
            filter: 'drop-shadow(1px 1px 2px rgba(0,0,0,0.15))',
          }}
          animate={{
            scale: [1, 1.005, 1]
          }}
          transition={{ duration: 3, repeat: Infinity }}
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