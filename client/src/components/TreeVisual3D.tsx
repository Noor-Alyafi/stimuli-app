import { motion } from "framer-motion";

interface TreeVisual3DProps {
  type: string;
  stage: number;
  className?: string;
}

export const TreeVisual3D = ({ type, stage, className = "" }: TreeVisual3DProps) => {
  const getTreeVisual = () => {
    const baseClass = "relative flex items-center justify-center";
    
    switch (type) {
      case 'oak':
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
        
      case 'cherry':
        return (
          <div className={`${baseClass} ${className}`}>
            <motion.div
              className="relative"
              initial={{ scale: 0.8, opacity: 0.7 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {/* Cherry Tree Crown */}
              <motion.div
                className={`rounded-full bg-gradient-to-br from-pink-300 to-rose-400 ${getCrownSize(stage)} shadow-lg`}
                animate={{ 
                  scale: [1, 1.05, 1],
                  boxShadow: ['0 4px 12px rgba(251, 113, 133, 0.3)', '0 6px 16px rgba(251, 113, 133, 0.5)', '0 4px 12px rgba(251, 113, 133, 0.3)']
                }}
                transition={{ duration: 4, repeat: Infinity }}
              />
              
              {/* Pink blossoms overlay */}
              {stage >= 2 && (
                <motion.div
                  className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full bg-pink-200 opacity-60 ${getCrownSize(stage - 1)}`}
                  animate={{ 
                    scale: [1, 1.1, 1],
                    opacity: [0.4, 0.7, 0.4]
                  }}
                  transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                />
              )}
              
              {/* Tree Trunk */}
              <div
                className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 bg-gradient-to-b from-amber-700 to-amber-900 ${getTrunkSize(stage)}`}
                style={{
                  clipPath: 'polygon(25% 0%, 75% 0%, 90% 100%, 10% 100%)'
                }}
              />
              
              {/* Falling petals */}
              {stage >= 4 && (
                <>
                  <motion.div
                    className="absolute top-0 left-3 text-pink-300 text-xs"
                    animate={{ 
                      y: [0, 30, 60],
                      x: [0, 10, -5],
                      opacity: [1, 0.7, 0]
                    }}
                    transition={{ duration: 3, repeat: Infinity, delay: 0 }}
                  >
                    🌸
                  </motion.div>
                  <motion.div
                    className="absolute top-2 right-2 text-pink-200 text-xs"
                    animate={{ 
                      y: [0, 40, 80],
                      x: [0, -15, 10],
                      opacity: [1, 0.5, 0]
                    }}
                    transition={{ duration: 4, repeat: Infinity, delay: 1.5 }}
                  >
                    🌸
                  </motion.div>
                </>
              )}
            </motion.div>
          </div>
        );
        
      case 'willow':
        return (
          <div className={`${baseClass} ${className}`}>
            <motion.div
              className="relative"
              initial={{ scale: 0.8, opacity: 0.7 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {/* Willow Crown - elongated */}
              <motion.div
                className={`rounded-full bg-gradient-to-b from-green-300 to-green-500 ${getCrownSize(stage)} shadow-md`}
                style={{ 
                  borderRadius: '50% 50% 50% 50% / 40% 40% 60% 60%' 
                }}
                animate={{ 
                  scaleY: [1, 1.1, 1],
                  scaleX: [1, 0.95, 1]
                }}
                transition={{ duration: 5, repeat: Infinity }}
              />
              
              {/* Drooping branches */}
              {stage >= 2 && (
                <>
                  <motion.div
                    className="absolute bottom-2 left-2 w-1 h-8 bg-green-400 rounded-full opacity-70"
                    animate={{ 
                      scaleY: [1, 1.2, 1],
                      rotate: [5, 15, 5]
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                  />
                  <motion.div
                    className="absolute bottom-1 right-3 w-1 h-6 bg-green-400 rounded-full opacity-70"
                    animate={{ 
                      scaleY: [1, 1.3, 1],
                      rotate: [-8, -18, -8]
                    }}
                    transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                  />
                </>
              )}
              
              {/* Tree Trunk */}
              <div
                className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 bg-gradient-to-b from-amber-600 to-amber-800 ${getTrunkSize(stage)}`}
                style={{
                  clipPath: 'polygon(35% 0%, 65% 0%, 80% 100%, 20% 100%)'
                }}
              />
            </motion.div>
          </div>
        );
        
      case 'rainbow':
        return (
          <div className={`${baseClass} ${className}`}>
            <motion.div
              className="relative"
              initial={{ scale: 0.8, opacity: 0.7 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {/* Rainbow Tree Crown */}
              <motion.div
                className={`rounded-full bg-gradient-to-br from-purple-400 via-blue-400 via-green-400 via-yellow-400 via-orange-400 to-red-400 ${getCrownSize(stage)} shadow-xl`}
                animate={{ 
                  scale: [1, 1.08, 1],
                  rotate: [0, 3, -3, 0],
                  boxShadow: [
                    '0 0 20px rgba(168, 85, 247, 0.4)',
                    '0 0 30px rgba(59, 130, 246, 0.4)', 
                    '0 0 25px rgba(34, 197, 94, 0.4)',
                    '0 0 20px rgba(168, 85, 247, 0.4)'
                  ]
                }}
                transition={{ duration: 6, repeat: Infinity }}
              />
              
              {/* Magical sparkles */}
              {stage >= 2 && (
                <>
                  <motion.div
                    className="absolute top-1 left-1 text-yellow-200 text-sm"
                    animate={{ 
                      scale: [1, 1.5, 1],
                      opacity: [1, 0.3, 1],
                      rotate: [0, 180, 360]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    ✦
                  </motion.div>
                  <motion.div
                    className="absolute top-3 right-2 text-purple-200 text-xs"
                    animate={{ 
                      scale: [1, 1.3, 1],
                      opacity: [0.8, 0.2, 0.8],
                      rotate: [0, -180, -360]
                    }}
                    transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                  >
                    ★
                  </motion.div>
                  <motion.div
                    className="absolute bottom-4 left-4 text-cyan-200 text-xs"
                    animate={{ 
                      scale: [1, 1.4, 1],
                      opacity: [1, 0.4, 1],
                      rotate: [0, 90, 180]
                    }}
                    transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
                  >
                    ◆
                  </motion.div>
                </>
              )}
              
              {/* Enchanted trunk */}
              <div
                className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 bg-gradient-to-b from-purple-800 to-indigo-900 ${getTrunkSize(stage)} shadow-lg`}
                style={{
                  clipPath: 'polygon(30% 0%, 70% 0%, 85% 100%, 15% 100%)',
                  boxShadow: '0 0 10px rgba(168, 85, 247, 0.3)'
                }}
              />
              
              {/* Ultimate stage rainbow aura */}
              {stage === 5 && (
                <motion.div
                  className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-transparent via-white to-transparent opacity-20 ${getCrownSize(stage + 1)}`}
                  animate={{ 
                    rotate: [0, 360],
                    scale: [1, 1.2, 1]
                  }}
                  transition={{ duration: 8, repeat: Infinity }}
                />
              )}
            </motion.div>
          </div>
        );
        
      default:
        return (
          <div className={`${baseClass} ${className}`}>
            <div className={`rounded-full bg-green-400 ${getCrownSize(stage)}`} />
            <div
              className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 bg-amber-800 ${getTrunkSize(stage)}`}
              style={{
                clipPath: 'polygon(40% 0%, 60% 0%, 75% 100%, 25% 100%)'
              }}
            />
          </div>
        );
    }
  };

  const getCrownColor = () => {
    switch (type) {
      case 'oak': return 'bg-gradient-to-br from-green-500 to-green-700';
      case 'cherry': return 'bg-gradient-to-br from-pink-300 to-rose-400';
      case 'willow': return 'bg-gradient-to-b from-green-300 to-green-500';
      case 'rainbow': return 'bg-gradient-conic from-purple-400 via-blue-400 via-green-400 via-yellow-400 via-orange-400 to-red-400';
      default: return 'bg-green-500';
    }
  };

  const getCrownSize = (stage: number) => {
    switch (stage) {
      case 0: return 'w-0 h-0';
      case 1: return 'w-4 h-4';
      case 2: return 'w-8 h-8';
      case 3: return 'w-12 h-12';
      case 4: return 'w-16 h-16';
      case 5: return 'w-20 h-20';
      default: return 'w-6 h-6';
    }
  };

  const getTrunkSize = (stage: number) => {
    switch (stage) {
      case 0: return 'w-0 h-0';
      case 1: return 'w-1 h-2';
      case 2: return 'w-2 h-4';
      case 3: return 'w-3 h-6';
      case 4: return 'w-4 h-8';
      case 5: return 'w-5 h-10';
      default: return 'w-2 h-3';
    }
  };

  return (
    <motion.div
      className={`flex items-center justify-center ${className}`}
      style={{ height: '120px', width: '120px' }}
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.2 }}
    >
      {getTreeVisual()}
    </motion.div>
  );
};