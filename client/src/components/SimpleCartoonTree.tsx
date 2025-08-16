import { motion } from "framer-motion";

interface SimpleCartoonTreeProps {
  type: string;
  stage: number;
  xpContributed?: number;
  className?: string;
}

export const SimpleCartoonTree = ({ 
  type, 
  stage, 
  xpContributed = 0, 
  className = "" 
}: SimpleCartoonTreeProps) => {
  
  // Get tree colors based on type - simple and cartoonish
  const getTreeColors = () => {
    switch (type) {
      case 'oak':
        return {
          crown: '#4CAF50', // Green
          crownLight: '#81C784',
          trunk: '#8D6E63' // Brown
        };
      case 'cherry':
        return {
          crown: '#E91E63', // Pink
          crownLight: '#F48FB1',
          trunk: '#8D6E63'
        };
      case 'willow':
        return {
          crown: '#9CCC65', // Light green
          crownLight: '#C5E1A5',
          trunk: '#8D6E63'
        };
      case 'rainbow':
        return {
          crown: '#FF9800', // Orange
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

  return (
    <div className={`relative flex items-end justify-center h-32 w-32 ${className}`}>
      <motion.div
        className="relative flex items-end justify-center"
        initial={{ scale: 0.3, opacity: 0 }}
        animate={{ scale: treeScale, opacity: 1 }}
        transition={{ duration: 0.8, ease: "backOut" }}
      >
        {/* Tree Crown - Simple cartoon style like your reference */}
        <motion.div
          className="relative z-20"
          style={{
            width: `${40 + (stage * 8)}px`,
            height: `${40 + (stage * 8)}px`,
            backgroundColor: colors.crown,
            borderRadius: '50%',
            filter: 'drop-shadow(2px 3px 6px rgba(0,0,0,0.2))'
          }}
          animate={{
            scale: [1, 1.02, 1],
          }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          {/* Light highlight on crown */}
          <div
            style={{
              position: 'absolute',
              top: '15%',
              left: '20%',
              width: '30%',
              height: '30%',
              backgroundColor: colors.crownLight,
              borderRadius: '50%',
              opacity: 0.7
            }}
          />
        </motion.div>
        
        {/* Tree Trunk - Simple cartoon style */}
        <div
          className="absolute bottom-0 left-1/2 transform -translate-x-1/2 z-10"
          style={{
            width: `${8 + (stage * 2)}px`,
            height: `${16 + (stage * 3)}px`,
            backgroundColor: colors.trunk,
            borderRadius: '2px',
            filter: 'drop-shadow(1px 2px 3px rgba(0,0,0,0.3))'
          }}
        />
        

        
        {/* Maturity indicator */}
        {stage >= 5 && (
          <motion.div
            className="absolute -top-2 left-1/2 transform -translate-x-1/2 text-amber-300 text-xl z-30"
            animate={{ 
              scale: [1, 1.3, 1],
              rotate: [0, 360]
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            👑
          </motion.div>
        )}
        
        {/* High XP glow */}
        {xpContributed > 30 && (
          <motion.div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-5"
            style={{
              width: `${50 + (stage * 10)}px`,
              height: `${50 + (stage * 10)}px`,
              background: 'radial-gradient(circle, rgba(255,215,0,0.3) 0%, transparent 60%)',
              borderRadius: '50%'
            }}
            animate={{
              scale: [1, 1.15, 1],
              opacity: [0.4, 0.7, 0.4]
            }}
            transition={{ duration: 2.5, repeat: Infinity }}
          />
        )}
      </motion.div>
    </div>
  );
};