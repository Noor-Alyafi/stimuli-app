import { motion } from "framer-motion";

interface SimpleCartoonTreeProps {
  type: string;
  stage: number;
  xpContributed?: number;
  className?: string;
  size?: 'small' | 'medium' | 'large';
  decorations?: { type: string; addedAt: string }[];
}

export const SimpleCartoonTree = ({ 
  type, 
  stage, 
  xpContributed = 0, 
  className = "",
  size = 'medium',
  decorations = []
}: SimpleCartoonTreeProps) => {
  
  // Get tree colors based on type
  const getTreeColors = () => {
    switch (type) {
      case 'oak':
        return {
          crown: '#4CAF50',
          crownLight: '#81C784',
          trunk: '#8D6E63'
        };
      case 'cherry':
        return {
          crown: '#E91E63',
          crownLight: '#F48FB1',
          trunk: '#8D6E63'
        };
      case 'willow':
        return {
          crown: '#9CCC65',
          crownLight: '#C5E1A5',
          trunk: '#8D6E63'
        };
      case 'rainbow':
        return {
          crown: '#FF9800',
          crownLight: '#FFB74D',
          trunk: '#8D6E63'
        };
      default:
        return {
          crown: '#4CAF50',
          crownLight: '#81C784',
          trunk: '#8D6E63'
        };
    }
  };

  const colors = getTreeColors();
  const treeScale = 0.8 + (stage * 0.15) + Math.min(xpContributed / 100, 0.2);
  
  // Size multipliers
  const sizeMultiplier = size === 'small' ? 0.7 : size === 'large' ? 1.8 : 1;
  const containerHeight = size === 'small' ? 'h-20' : size === 'large' ? 'h-48' : 'h-32';
  const containerWidth = size === 'small' ? 'w-20' : size === 'large' ? 'w-48' : 'w-32';

  return (
    <div className={`relative flex items-end justify-center ${containerHeight} ${containerWidth} ${className}`}>
      <motion.div
        className="relative flex flex-col items-center justify-end"
        initial={{ scale: 0.3, opacity: 0 }}
        animate={{ scale: treeScale * sizeMultiplier, opacity: 1 }}
        transition={{ duration: 0.8, ease: "backOut" }}
      >
        {/* Tree Crown - Cute cartoon style */}
        <motion.div
          className="relative z-20"
          style={{
            width: `${40 + (stage * 8)}px`,
            height: `${40 + (stage * 8)}px`,
            backgroundColor: colors.crown,
            borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
            filter: 'drop-shadow(2px 4px 6px rgba(0,0,0,0.15))',
            position: 'relative',
            marginBottom: `-${5 + (stage * 2)}px` // Overlap with trunk
          }}
          animate={{
            scale: [1, 1.02, 1],
          }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          {/* Cute highlight */}
          <div
            style={{
              position: 'absolute',
              top: '25%',
              left: '30%',
              width: '20%',
              height: '20%',
              backgroundColor: 'rgba(255,255,255,0.4)',
              borderRadius: '50%'
            }}
          />
          {/* Cute shadow detail */}
          <div
            style={{
              position: 'absolute',
              bottom: '10%',
              right: '15%',
              width: '30%',
              height: '15%',
              backgroundColor: colors.crownLight,
              borderRadius: '50%',
              opacity: 0.3
            }}
          />
          
          {/* Flowers positioned ON the tree crown edges - not floating */}
          {stage >= 3 && (
            <>
              <motion.div 
                className="absolute text-sm z-10"
                style={{ 
                  top: '8%', 
                  left: '5%'
                }}
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 1.2, duration: 0.6, ease: "backOut" }}
              >
                🌸
              </motion.div>
              <motion.div 
                className="absolute text-sm z-10"
                style={{ 
                  top: '15%', 
                  right: '8%'
                }}
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 1.4, duration: 0.6, ease: "backOut" }}
              >
                🌺
              </motion.div>
            </>
          )}
          {stage >= 4 && (
            <motion.div 
              className="absolute text-sm z-10"
              style={{ 
                bottom: '12%', 
                left: '10%'
              }}
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 1.6, duration: 0.6, ease: "backOut" }}
            >
              🌸
            </motion.div>
          )}
          {stage >= 5 && (
            <motion.div 
              className="absolute text-sm z-10"
              style={{ 
                bottom: '8%', 
                right: '12%'
              }}
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 1.8, duration: 0.6, ease: "backOut" }}
            >
              🏵️
            </motion.div>
          )}
        </motion.div>
        
        {/* Tree Trunk - Cute style */}
        <div
          className="absolute bottom-0 left-1/2 transform -translate-x-1/2 z-10"
          style={{
            width: `${8 + (stage * 2)}px`,
            height: `${14 + (stage * 2)}px`,
            backgroundColor: colors.trunk,
            borderRadius: '4px',
            filter: 'drop-shadow(1px 2px 3px rgba(0,0,0,0.2))'
          }}
        />
        
        {/* Decorations */}
        {decorations.map((decoration, index) => (
          <motion.div
            key={`${decoration.type}-${index}`}
            className="absolute z-25"
            style={{
              top: `${20 + (index * 15)}%`,
              left: `${15 + (index * 20)}%`
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 2 + (index * 0.3), duration: 0.6 }}
          >
            {decoration.type === 'fairy_lights' && (
              <motion.div
                className="text-sm"
                animate={{
                  opacity: [0.6, 1, 0.6]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                ✨
              </motion.div>
            )}
            {decoration.type === 'gnome' && (
              <div className="text-sm">🧙‍♂️</div>
            )}
          </motion.div>
        ))}

        {/* Maturity indicator */}
        {stage >= 5 && (
          <motion.div
            className="absolute -top-2 left-1/2 transform -translate-x-1/2 text-amber-300 text-xl z-30"
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: [0, 15, -15, 0]
            }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            👑
          </motion.div>
        )}
        
        {/* Subtle glow for high XP */}
        {xpContributed > 30 && (
          <motion.div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-5"
            style={{
              width: `${50 + (stage * 8)}px`,
              height: `${50 + (stage * 8)}px`,
              background: 'radial-gradient(circle, rgba(255,215,0,0.2) 0%, transparent 70%)',
              borderRadius: '50%'
            }}
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.3, 0.5, 0.3]
            }}
            transition={{ duration: 3, repeat: Infinity }}
          />
        )}
      </motion.div>
    </div>
  );
};