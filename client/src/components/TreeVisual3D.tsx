import { motion } from "framer-motion";

interface TreeVisual3DProps {
  type: string;
  stage: number;
  className?: string;
}

export const TreeVisual3D = ({ type, stage, className = "" }: TreeVisual3DProps) => {
  const getCrownColor = () => {
    switch (type) {
      case 'oak': return 'bg-gradient-to-br from-green-400 to-green-600';
      case 'cherry': return 'bg-gradient-to-br from-pink-400 to-pink-600';
      case 'willow': return 'bg-gradient-to-br from-lime-400 to-lime-600';
      case 'rainbow': return 'bg-gradient-to-br from-purple-400 via-pink-500 to-red-500';
      default: return 'bg-gradient-to-br from-green-400 to-green-600';
    }
  };

  const getCrownSize = (stage: number) => {
    switch (stage) {
      case 1: return "w-8 h-8";
      case 2: return "w-12 h-12";
      case 3: return "w-16 h-16";
      case 4: return "w-20 h-20";
      case 5: return "w-24 h-24";
      default: return "w-8 h-8";
    }
  };

  const getTrunkSize = (stage: number) => {
    switch (stage) {
      case 1: return "w-2 h-6";
      case 2: return "w-3 h-8";
      case 3: return "w-4 h-10";
      case 4: return "w-4 h-12";
      case 5: return "w-5 h-14";
      default: return "w-2 h-6";
    }
  };

  const getTreeVisual = () => {
    const baseClass = "relative flex items-center justify-center";
    
    return (
      <div className={`${baseClass} ${className}`}>
        <motion.div
          className="relative"
          initial={{ scale: 0.8, opacity: 0.7 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Tree Crown */}
          <motion.div
            className={`rounded-full ${getCrownColor()} ${getCrownSize(stage)}`}
            animate={{ 
              scale: [1, 1.02, 1],
              opacity: [0.9, 1, 0.9]
            }}
            transition={{ duration: 3, repeat: Infinity }}
          />
          
          {/* Tree Trunk */}
          <div
            className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 bg-gradient-to-b from-amber-800 to-amber-900 ${getTrunkSize(stage)}`}
            style={{
              clipPath: 'polygon(30% 0%, 70% 0%, 85% 100%, 15% 100%)'
            }}
          />
          
          {/* Stage indicators */}
          {stage >= 3 && (
            <motion.div
              className="absolute top-2 left-2 text-yellow-300 text-sm"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              ✨
            </motion.div>
          )}
          
          {stage === 5 && (
            <motion.div
              className="absolute -top-1 right-1 text-green-300 text-lg"
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.7, 1, 0.7]
              }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              🌟
            </motion.div>
          )}
        </motion.div>
      </div>
    );
  };

  return getTreeVisual();
};