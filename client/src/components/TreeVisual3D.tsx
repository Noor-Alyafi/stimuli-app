import { motion } from "framer-motion";

interface TreeVisual3DProps {
  type: string;
  stage: number;
  className?: string;
}

export const TreeVisual3D = ({ type, stage, className = "" }: TreeVisual3DProps) => {
  
  const getTreeHeight = (stage: number) => {
    switch (stage) {
      case 1: return "h-16";
      case 2: return "h-20";
      case 3: return "h-24";
      case 4: return "h-28";
      case 5: return "h-32";
      default: return "h-16";
    }
  };

  const getTreeWidth = (stage: number) => {
    switch (stage) {
      case 1: return "w-16";
      case 2: return "w-20";
      case 3: return "w-24";
      case 4: return "w-28";
      case 5: return "w-32";
      default: return "w-16";
    }
  };

  return (
    <div className={`relative flex items-end justify-center ${getTreeHeight(stage)} ${getTreeWidth(stage)} ${className}`}>
      <motion.div
        className="relative"
        initial={{ scale: 0.8, opacity: 0.7 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Tree Shadow */}
        <div 
          className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 bg-black opacity-10 rounded-full"
          style={{ width: `${40 + (stage * 8)}px`, height: `${16 + (stage * 2)}px` }}
        />
        
        {/* Trunk - 3D isometric style like reference */}
        <div
          className="absolute bottom-0 left-1/2 transform -translate-x-1/2 z-10"
          style={{
            width: `${12 + (stage * 2)}px`,
            height: `${20 + (stage * 4)}px`,
            background: 'linear-gradient(135deg, #8B4513 0%, #A0522D 50%, #654321 100%)',
            clipPath: 'polygon(25% 0%, 75% 0%, 85% 100%, 15% 100%)',
            filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.3))'
          }}
        />
        
        {/* Tree Crown - Layered isometric foliage like reference image */}
        {/* Back layer - darkest */}
        <motion.div
          className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20"
          style={{
            width: `${50 + (stage * 8)}px`,
            height: `${45 + (stage * 6)}px`,
            background: type === 'oak' 
              ? 'linear-gradient(135deg, #228B22 0%, #32CD32 30%, #90EE90 100%)'
              : type === 'cherry'
              ? 'linear-gradient(135deg, #FF69B4 0%, #FFB6C1 30%, #FFC0CB 100%)'
              : type === 'willow'
              ? 'linear-gradient(135deg, #9ACD32 0%, #ADFF2F 30%, #CCFF99 100%)'
              : 'linear-gradient(135deg, #FF6347 0%, #FF7F50 30%, #FFA07A 100%)',
            borderRadius: '60% 60% 70% 70% / 60% 60% 80% 80%',
            transform: 'perspective(100px) rotateX(15deg) rotateY(-10deg)',
            filter: 'drop-shadow(3px 3px 6px rgba(0,0,0,0.4))'
          }}
          animate={{ 
            rotateY: [-10, -8, -10],
            scale: [1, 1.02, 1]
          }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        
        {/* Middle layer - medium tone */}
        <motion.div
          className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-30"
          style={{
            width: `${45 + (stage * 7)}px`,
            height: `${40 + (stage * 5)}px`,
            background: type === 'oak'
              ? 'linear-gradient(135deg, #32CD32 0%, #90EE90 50%, #98FB98 100%)'
              : type === 'cherry'
              ? 'linear-gradient(135deg, #FFB6C1 0%, #FFC0CB 50%, #FFCCCB 100%)'
              : type === 'willow'
              ? 'linear-gradient(135deg, #ADFF2F 0%, #CCFF99 50%, #E6FFE6 100%)'
              : 'linear-gradient(135deg, #FF7F50 0%, #FFA07A 50%, #FFCC99 100%)',
            borderRadius: '50% 50% 60% 60% / 50% 50% 70% 70%',
            transform: 'perspective(100px) rotateX(10deg) rotateY(5deg)',
            filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.3))'
          }}
          animate={{ 
            rotateY: [5, 7, 5],
            scale: [1, 1.015, 1]
          }}
          transition={{ duration: 3.5, repeat: Infinity }}
        />
        
        {/* Front layer - lightest */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-40"
          style={{
            width: `${40 + (stage * 6)}px`,
            height: `${35 + (stage * 4)}px`,
            background: type === 'oak'
              ? 'linear-gradient(135deg, #90EE90 0%, #98FB98 50%, #F0FFF0 100%)'
              : type === 'cherry'
              ? 'linear-gradient(135deg, #FFC0CB 0%, #FFCCCB 50%, #FFF0F5 100%)'
              : type === 'willow'
              ? 'linear-gradient(135deg, #CCFF99 0%, #E6FFE6 50%, #F5FFFA 100%)'
              : 'linear-gradient(135deg, #FFA07A 0%, #FFCC99 50%, #FFF8DC 100%)',
            borderRadius: '40% 40% 50% 50% / 40% 40% 60% 60%',
            transform: 'perspective(100px) rotateX(5deg) rotateY(-5deg)',
            filter: 'drop-shadow(1px 1px 2px rgba(0,0,0,0.2))'
          }}
          animate={{ 
            rotateY: [-5, -3, -5],
            scale: [1, 1.01, 1]
          }}
          transition={{ duration: 3, repeat: Infinity }}
        />
        
        {/* Growth indicators */}
        {stage >= 3 && (
          <motion.div
            className="absolute top-2 right-2 text-yellow-400 text-lg z-50"
            animate={{ 
              rotate: [0, 15, -15, 0],
              scale: [1, 1.2, 1]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            ✨
          </motion.div>
        )}
        
        {stage === 5 && (
          <motion.div
            className="absolute top-0 left-1/2 transform -translate-x-1/2 text-amber-300 text-xl z-50"
            animate={{ 
              scale: [1, 1.3, 1],
              opacity: [0.8, 1, 0.8],
              rotate: [0, 360]
            }}
            transition={{ duration: 2.5, repeat: Infinity }}
          >
            🌟
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};