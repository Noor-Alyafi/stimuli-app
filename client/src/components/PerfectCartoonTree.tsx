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
      trunkDark: '#5D4037' // Darker brown for depth
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
  const treeScale = 0.6 + (stage * 0.2) + Math.min(xpContributed / 200, 0.4);
  
  // Size multipliers
  const sizeMultiplier = size === 'small' ? 0.6 : size === 'large' ? 1.4 : 1;
  const containerHeight = size === 'small' ? 'h-16' : size === 'large' ? 'h-40' : 'h-28';
  const containerWidth = size === 'small' ? 'w-16' : size === 'large' ? 'w-40' : 'w-28';
  
  // Crown size based on stage - gets bigger and more detailed
  const crownSize = (30 + (stage * 8)) * sizeMultiplier * treeScale;
  const trunkWidth = (8 + (stage * 2)) * sizeMultiplier * treeScale;
  const trunkHeight = (20 + (stage * 4)) * sizeMultiplier * treeScale;

  return (
    <div className={`relative flex items-end justify-center ${containerHeight} ${containerWidth} ${className}`}>
      <motion.div
        className="relative flex flex-col items-center justify-end"
        initial={{ scale: 0.3, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.0, ease: "backOut" }}
      >
        {/* PERFECT CARTOON TREE CROWN - EXACTLY LIKE YOUR IMAGE */}
        <motion.div
          className="relative z-20"
          style={{
            width: `${crownSize}px`,
            height: `${crownSize * 0.9}px`, // Slightly flattened like image
            background: `radial-gradient(circle at 30% 30%, ${colors.crownLight} 0%, ${colors.crown} 40%, ${colors.crownDark} 100%)`,
            borderRadius: '50% 45% 55% 50%', // Organic but round shape like image
            filter: 'drop-shadow(4px 8px 16px rgba(0,0,0,0.3))',
            position: 'relative',
            marginBottom: `-${trunkHeight * 0.3}px`, // Perfect overlap
            border: `1px solid ${colors.crownDark}`,
          }}
          animate={{
            scale: [1, 1.02, 1],
          }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          {/* Multiple leaf clusters for cartoon detail like your image */}
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
          
          {/* Fairy lights decoration */}
          {decorations.includes('fairy_lights') && (
            <>
              <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-yellow-300 rounded-full animate-pulse"></div>
              <div className="absolute top-1/3 right-1/4 w-2 h-2 bg-red-300 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
              <div className="absolute bottom-1/3 left-1/3 w-2 h-2 bg-blue-300 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
              <div className="absolute bottom-1/4 right-1/3 w-2 h-2 bg-green-300 rounded-full animate-pulse" style={{ animationDelay: '1.5s' }}></div>
            </>
          )}
        </motion.div>
        
        {/* PERFECT CARTOON TRUNK - EXACTLY LIKE YOUR IMAGE */}
        <div
          className="absolute bottom-0 left-1/2 transform -translate-x-1/2 z-10"
          style={{
            width: `${trunkWidth}px`,
            height: `${trunkHeight}px`,
            background: `linear-gradient(45deg, ${colors.trunkDark} 0%, ${colors.trunk} 30%, ${colors.trunkDark} 100%)`,
            borderRadius: '3px 3px 1px 1px',
            filter: 'drop-shadow(2px 4px 8px rgba(0,0,0,0.4))',
            border: `1px solid ${colors.trunkDark}`,
          }}
        >
          {/* Bark texture lines exactly like cartoon style */}
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
        
        {/* Garden gnome decoration */}
        {decorations.includes('gnome') && (
          <div 
            className="absolute bottom-0 right-0 text-xs transform translate-x-1/2"
            style={{ zIndex: 5 }}
          >
            🧙‍♂️
          </div>
        )}
      </motion.div>
    </div>
  );
};