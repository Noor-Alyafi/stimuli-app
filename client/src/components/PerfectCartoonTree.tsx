import React from 'react';
import { motion } from 'framer-motion';

interface PerfectCartoonTreeProps {
  type?: string;
  stage?: number;
  xpContributed?: number;
  size?: 'small' | 'medium' | 'large';
  className?: string;
  decorations?: string[];
}

export const PerfectCartoonTree: React.FC<PerfectCartoonTreeProps> = ({
  type = 'oak',
  stage = 1,
  xpContributed = 0,
  size = 'medium',
  className = '',
  decorations = []
}) => {
  // Tree colors based on your exact image
  const getTreeColors = () => {
    const colors = {
      crown: '#8BC34A', // Light green like image
      crownDark: '#689F38', // Darker green for depth
      crownLight: '#AED581', // Lighter green for highlights
      trunk: '#8D6E63', // Brown trunk
      trunkDark: '#5D4037', // Darker brown for depth
      soil: '#8B4513', // Brown soil
      seed: '#CD853F' // Light brown seed
    };
    
    // Different tree types get slight color variations
    switch (type) {
      case 'cherry':
        return { ...colors, crown: '#E91E63', crownDark: '#AD1457', crownLight: '#F48FB1' };
      case 'pine':
        return { ...colors, crown: '#4CAF50', crownDark: '#2E7D32', crownLight: '#81C784' };
      case 'rainbow':
        return { ...colors, crown: '#9C27B0', crownDark: '#6A1B9A', crownLight: '#CE93D8' };
      default:
        return colors;
    }
  };

  const colors = getTreeColors();
  
  // Size multipliers - made even bigger
  const sizeMultiplier = size === 'small' ? 1.5 : size === 'large' ? 3.0 : 2.5;
  const containerHeight = size === 'small' ? 'h-24' : size === 'large' ? 'h-60' : 'h-48';
  const containerWidth = size === 'small' ? 'w-24' : size === 'large' ? 'w-60' : 'w-48';
  
  // Render different visuals based on growth stage
  const renderTreeByStage = () => {
    switch (stage) {
      case 1: // Seed
        return (
          <div className="relative flex items-end justify-center">
            {/* Soil mound */}
            <div 
              className="rounded-full"
              style={{
                width: `${20 * sizeMultiplier}px`,
                height: `${8 * sizeMultiplier}px`,
                backgroundColor: colors.soil,
                position: 'relative'
              }}
            >
              {/* Seed visible in soil */}
              <div 
                className="absolute rounded-full"
                style={{
                  width: `${6 * sizeMultiplier}px`,
                  height: `${4 * sizeMultiplier}px`,
                  backgroundColor: colors.seed,
                  top: `${-2 * sizeMultiplier}px`,
                  left: '50%',
                  transform: 'translateX(-50%)'
                }}
              />
            </div>
          </div>
        );
      
      case 2: // Sprout - clean design like your image
        return (
          <div className="relative flex items-end justify-center">
            {/* Simple stem */}
            <div 
              className="relative"
              style={{
                width: `${3 * sizeMultiplier}px`,
                height: `${18 * sizeMultiplier}px`,
                backgroundColor: colors.crown,
                borderRadius: '50% 50% 30% 30%',
                background: `linear-gradient(180deg, ${colors.crownLight} 0%, ${colors.crown} 100%)`
              }}
            >
              {/* Left curved leaf - simple and clean */}
              <div 
                className="absolute"
                style={{
                  width: `${8 * sizeMultiplier}px`,
                  height: `${4 * sizeMultiplier}px`,
                  backgroundColor: colors.crownLight,
                  top: `${2 * sizeMultiplier}px`,
                  left: `${-6 * sizeMultiplier}px`,
                  borderRadius: '0% 80% 80% 20%',
                  transform: 'rotate(-25deg)',
                  border: `1px solid ${colors.crown}`
                }}
              />
              {/* Right curved leaf - simple and clean */}
              <div 
                className="absolute"
                style={{
                  width: `${8 * sizeMultiplier}px`,
                  height: `${4 * sizeMultiplier}px`,
                  backgroundColor: colors.crownLight,
                  top: `${2 * sizeMultiplier}px`,
                  right: `${-6 * sizeMultiplier}px`,
                  borderRadius: '80% 0% 20% 80%',
                  transform: 'rotate(25deg)',
                  border: `1px solid ${colors.crown}`
                }}
              />
            </div>
          </div>
        );
      
      case 3: // Small tree
        const smallCrownSize = 16 * sizeMultiplier;
        const smallTrunkWidth = 4 * sizeMultiplier;
        const smallTrunkHeight = 12 * sizeMultiplier;
        return (
          <div className="relative flex flex-col items-center justify-end">
            {/* Small crown */}
            <div
              className="relative z-20 rounded-full"
              style={{
                width: `${smallCrownSize}px`,
                height: `${smallCrownSize}px`,
                background: `radial-gradient(circle at 30% 30%, ${colors.crownLight}, ${colors.crown}, ${colors.crownDark})`,
                marginBottom: `${-smallTrunkHeight * 0.3}px`
              }}
            />
            {/* Small trunk */}
            <div
              className="relative z-10"
              style={{
                width: `${smallTrunkWidth}px`,
                height: `${smallTrunkHeight}px`,
                backgroundColor: colors.trunk,
                borderRadius: '2px 2px 1px 1px'
              }}
            />
          </div>
        );
      
      case 4: // Medium tree
        const mediumCrownSize = 28 * sizeMultiplier;
        const mediumTrunkWidth = 8 * sizeMultiplier;
        const mediumTrunkHeight = 20 * sizeMultiplier;
        return (
          <div className="relative flex flex-col items-center justify-end">
            {/* Medium crown */}
            <div
              className="relative z-20"
              style={{
                width: `${mediumCrownSize}px`,
                height: `${mediumCrownSize * 0.9}px`,
                background: `radial-gradient(circle at 30% 30%, ${colors.crownLight}, ${colors.crown}, ${colors.crownDark})`,
                borderRadius: '50% 45% 55% 50%',
                marginBottom: `${-mediumTrunkHeight * 0.3}px`
              }}
            >
              {/* Some leaf details */}
              <div
                className="absolute rounded-full"
                style={{
                  width: '25%',
                  height: '25%',
                  backgroundColor: colors.crownLight,
                  top: '20%',
                  left: '20%',
                  opacity: 0.8
                }}
              />
              <div
                className="absolute rounded-full"
                style={{
                  width: '20%',
                  height: '20%',
                  backgroundColor: colors.crownDark,
                  bottom: '25%',
                  right: '25%',
                  opacity: 0.6
                }}
              />
            </div>
            {/* Medium trunk */}
            <div
              className="relative z-10"
              style={{
                width: `${mediumTrunkWidth}px`,
                height: `${mediumTrunkHeight}px`,
                background: `linear-gradient(45deg, ${colors.trunkDark}, ${colors.trunk}, ${colors.trunkDark})`,
                borderRadius: '3px 3px 1px 1px'
              }}
            />
          </div>
        );
      
      case 5: // Full mature tree (original design)
      default:
        const fullCrownSize = 40 * sizeMultiplier;
        const fullTrunkWidth = 12 * sizeMultiplier;
        const fullTrunkHeight = 28 * sizeMultiplier;
        return (
          <div className="relative flex flex-col items-center justify-end">
            {/* FULL CARTOON TREE CROWN */}
            <motion.div
              className="relative z-20"
              style={{
                width: `${fullCrownSize}px`,
                height: `${fullCrownSize * 0.9}px`,
                background: `radial-gradient(circle at 30% 30%, ${colors.crownLight} 0%, ${colors.crown} 40%, ${colors.crownDark} 100%)`,
                borderRadius: '50% 45% 55% 50%',
                filter: 'drop-shadow(4px 8px 16px rgba(0,0,0,0.3))',
                position: 'relative',
                marginBottom: `${-fullTrunkHeight * 0.3}px`,
                border: `1px solid ${colors.crownDark}`,
              }}
              animate={{
                scale: [1, 1.02, 1],
              }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              {/* Full leaf detail clusters */}
              <div
                style={{
                  position: 'absolute',
                  top: '15%',
                  left: '20%',
                  width: '25%',
                  height: '25%',
                  backgroundColor: colors.crownLight,
                  borderRadius: '50%',
                  opacity: 0.8
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  top: '25%',
                  right: '15%',
                  width: '30%',
                  height: '20%',
                  backgroundColor: colors.crownLight,
                  borderRadius: '60%',
                  opacity: 0.7
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  bottom: '20%',
                  left: '25%',
                  width: '20%',
                  height: '25%',
                  backgroundColor: colors.crownDark,
                  borderRadius: '50%',
                  opacity: 0.6
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  bottom: '15%',
                  right: '20%',
                  width: '25%',
                  height: '20%',
                  backgroundColor: colors.crownDark,
                  borderRadius: '50%',
                  opacity: 0.5
                }}
              />
              
              {/* Fairy lights decoration for mature tree only */}
              {decorations.includes('fairy_lights') && (
                <>
                  <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-yellow-300 rounded-full animate-pulse"></div>
                  <div className="absolute top-1/3 right-1/4 w-2 h-2 bg-red-300 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                  <div className="absolute bottom-1/3 left-1/3 w-2 h-2 bg-blue-300 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
                  <div className="absolute bottom-1/4 right-1/3 w-2 h-2 bg-green-300 rounded-full animate-pulse" style={{ animationDelay: '1.5s' }}></div>
                </>
              )}
            </motion.div>
            
            {/* FULL CARTOON TRUNK */}
            <div
              className="relative z-10"
              style={{
                width: `${fullTrunkWidth}px`,
                height: `${fullTrunkHeight}px`,
                background: `linear-gradient(45deg, ${colors.trunkDark} 0%, ${colors.trunk} 30%, ${colors.trunkDark} 100%)`,
                borderRadius: '3px 3px 1px 1px',
                filter: 'drop-shadow(2px 4px 8px rgba(0,0,0,0.4))',
                border: `1px solid ${colors.trunkDark}`,
              }}
            >
              {/* Bark texture lines */}
              <div 
                style={{
                  position: 'absolute',
                  top: '25%',
                  left: '10%',
                  right: '10%',
                  height: '1px',
                  backgroundColor: colors.trunkDark,
                  opacity: 0.8
                }}
              />
              <div 
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '15%',
                  right: '15%',
                  height: '1px',
                  backgroundColor: colors.trunkDark,
                  opacity: 0.6
                }}
              />
              <div 
                style={{
                  position: 'absolute',
                  top: '75%',
                  left: '20%',
                  right: '20%',
                  height: '1px',
                  backgroundColor: colors.trunkDark,
                  opacity: 0.4
                }}
              />
            </div>
            
            {/* Garden gnome decoration for mature tree only */}
            {decorations.includes('gnome') && (
              <div 
                className="absolute bottom-0 right-0 text-xs transform translate-x-1/2"
                style={{ zIndex: 5 }}
              >
                🧙‍♂️
              </div>
            )}
          </div>
        );
    }
  };

  return (
    <div className={`relative flex items-end justify-center ${containerHeight} ${containerWidth} ${className}`}>
      <motion.div
        className="relative flex flex-col items-center justify-end"
        initial={{ scale: 0.3, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.0, ease: "backOut" }}
      >
        {renderTreeByStage()}
      </motion.div>
    </div>
  );
};