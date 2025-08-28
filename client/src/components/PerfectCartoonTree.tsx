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
        return { ...colors, crown: '#b36ae2', crownDark: '#9854c7', crownLight: '#c985eb' };
      case 'willow':
        return { ...colors, crown: '#9CCC65', crownDark: '#689F38', crownLight: '#DCEDC8' };
      case 'maple':
        return { ...colors, crown: '#FF7043', crownDark: '#D84315', crownLight: '#FFAB91' };
      case 'birch':
        return { ...colors, crown: '#66BB6A', crownDark: '#388E3C', crownLight: '#A5D6A7' };
      case 'sakura':
        return { ...colors, crown: '#F8BBD9', crownDark: '#E91E63', crownLight: '#FCE4EC' };
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
      
      case 2: // Sprout - leaves attached to top of stem
        return (
          <div className="relative flex items-center justify-center">
            {/* Vertical stem - shorter and thinner */}
            <div 
              className="relative"
              style={{
                width: `${2.5 * sizeMultiplier}px`,
                height: `${9 * sizeMultiplier}px`,
                backgroundColor: '#93c47d',
                borderRadius: '50% 50% 0% 0%'
              }}
            >
              {/* Left leaf - attached at top center of stem */}
              <div 
                className="absolute"
                style={{
                  width: `${11 * sizeMultiplier}px`,
                  height: `${5 * sizeMultiplier}px`,
                  backgroundColor: colors.crownLight,
                  top: `${0 * sizeMultiplier}px`,
                  left: `${-8.5 * sizeMultiplier}px`,
                  borderRadius: '100% 0% 100% 0%',
                  transform: 'rotate(35deg)',
                  transformOrigin: 'right center'
                }}
              />
              {/* Right leaf - attached at top center of stem */}
              <div 
                className="absolute"
                style={{
                  width: `${11 * sizeMultiplier}px`,
                  height: `${5 * sizeMultiplier}px`,
                  backgroundColor: colors.crownLight,
                  top: `${0 * sizeMultiplier}px`,
                  right: `${-8.5 * sizeMultiplier}px`,
                  borderRadius: '0% 100% 0% 100%',
                  transform: 'rotate(-35deg)',
                  transformOrigin: 'left center'
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
            
            {/* Garden gnome decoration for small trees */}
            {decorations.includes('gnome') && (
              <div 
                className="absolute bottom-0 right-0 transform translate-x-1/2"
                style={{ zIndex: 5 }}
              >
                <svg 
                  width={`${12 * sizeMultiplier}px`} 
                  height={`${15 * sizeMultiplier}px`} 
                  viewBox="0 0 16 20"
                  className="drop-shadow-md"
                >
                  {/* Gnome body */}
                  <ellipse cx="8" cy="16" rx="4" ry="3" fill="#8FBC8F" />
                  {/* Gnome face */}
                  <circle cx="8" cy="12" r="2.5" fill="#FDBCB4" />
                  {/* Colorful hat - positioned lower */}
                  <path 
                    d="M 8 4 Q 12 4 12 8 Q 12 10 10 11 L 6 11 Q 4 10 4 8 Q 4 4 8 4 Z" 
                    fill="#32CD32" 
                  />
                  <circle cx="8" cy="4" r="1" fill="#90EE90" />
                  {/* White beard */}
                  <ellipse cx="8" cy="14" rx="2" ry="1.5" fill="#FFFFFF" />
                  {/* Eyes */}
                  <circle cx="7" cy="11.5" r="0.3" fill="#000000" />
                  <circle cx="9" cy="11.5" r="0.3" fill="#000000" />
                  {/* Pink nose */}
                  <circle cx="8" cy="12.5" r="0.2" fill="#FFB6C1" />
                  {/* Hands */}
                  <circle cx="4.5" cy="15" r="0.8" fill="#FDBCB4" />
                  <circle cx="11.5" cy="15" r="0.8" fill="#FDBCB4" />
                  {/* Black shoes */}
                  <ellipse cx="6" cy="19" rx="1.2" ry="0.8" fill="#2C2C2C" />
                  <ellipse cx="10" cy="19" rx="1.2" ry="0.8" fill="#2C2C2C" />
                </svg>
              </div>
            )}
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
              
              {/* Fairy lights for medium tree - single horizontal line */}
              {decorations.includes('fairy_lights') && (
                <>
                  {/* Single wire string from side to side */}
                  <div className="absolute" style={{ top: '45%', left: '5%', right: '5%', height: '1px', backgroundColor: '#2d2d2d', zIndex: 10 }} />
                  
                  {/* Medium sized bulbs along single line */}
                  <div className="absolute animate-pulse" style={{ top: '43%', left: '8%', width: `${4 * sizeMultiplier}px`, height: `${6 * sizeMultiplier}px`, backgroundColor: '#FFD700', borderRadius: '50% 50% 50% 0%', transform: 'rotate(45deg)', filter: 'drop-shadow(0 0 3px #FFD700)', zIndex: 11 }} />
                  <div className="absolute animate-pulse" style={{ top: '43%', left: '25%', width: `${4 * sizeMultiplier}px`, height: `${6 * sizeMultiplier}px`, backgroundColor: '#FF1493', borderRadius: '50% 50% 50% 0%', transform: 'rotate(45deg)', filter: 'drop-shadow(0 0 3px #FF1493)', animationDelay: '0.3s', zIndex: 11 }} />
                  <div className="absolute animate-pulse" style={{ top: '43%', left: '45%', width: `${4 * sizeMultiplier}px`, height: `${6 * sizeMultiplier}px`, backgroundColor: '#00BFFF', borderRadius: '50% 50% 50% 0%', transform: 'rotate(45deg)', filter: 'drop-shadow(0 0 3px #00BFFF)', animationDelay: '0.6s', zIndex: 11 }} />
                  <div className="absolute animate-pulse" style={{ top: '43%', right: '25%', width: `${4 * sizeMultiplier}px`, height: `${6 * sizeMultiplier}px`, backgroundColor: '#32CD32', borderRadius: '50% 50% 50% 0%', transform: 'rotate(45deg)', filter: 'drop-shadow(0 0 3px #32CD32)', animationDelay: '0.9s', zIndex: 11 }} />
                  <div className="absolute animate-pulse" style={{ top: '43%', right: '8%', width: `${4 * sizeMultiplier}px`, height: `${6 * sizeMultiplier}px`, backgroundColor: '#9932CC', borderRadius: '50% 50% 50% 0%', transform: 'rotate(45deg)', filter: 'drop-shadow(0 0 3px #9932CC)', animationDelay: '1.2s', zIndex: 11 }} />
                </>
              )}
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
            
            {/* Garden gnome decoration for medium trees */}
            {decorations.includes('gnome') && (
              <div 
                className="absolute bottom-0 right-0 transform translate-x-1/2"
                style={{ zIndex: 5 }}
              >
                <svg 
                  width={`${14 * sizeMultiplier}px`} 
                  height={`${17 * sizeMultiplier}px`} 
                  viewBox="0 0 16 20"
                  className="drop-shadow-md"
                >
                  {/* Gnome body */}
                  <ellipse cx="8" cy="16" rx="4" ry="3" fill="#8FBC8F" />
                  {/* Gnome face */}
                  <circle cx="8" cy="12" r="2.5" fill="#FDBCB4" />
                  {/* Colorful hat - positioned lower */}
                  <path 
                    d="M 8 4 Q 12 4 12 8 Q 12 10 10 11 L 6 11 Q 4 10 4 8 Q 4 4 8 4 Z" 
                    fill="#00BFFF" 
                  />
                  <circle cx="8" cy="4" r="1" fill="#87CEEB" />
                  {/* White beard */}
                  <ellipse cx="8" cy="14" rx="2" ry="1.5" fill="#FFFFFF" />
                  {/* Eyes */}
                  <circle cx="7" cy="11.5" r="0.3" fill="#000000" />
                  <circle cx="9" cy="11.5" r="0.3" fill="#000000" />
                  {/* Pink nose */}
                  <circle cx="8" cy="12.5" r="0.2" fill="#FFB6C1" />
                  {/* Hands */}
                  <circle cx="4.5" cy="15" r="0.8" fill="#FDBCB4" />
                  <circle cx="11.5" cy="15" r="0.8" fill="#FDBCB4" />
                  {/* Black shoes */}
                  <ellipse cx="6" cy="19" rx="1.2" ry="0.8" fill="#2C2C2C" />
                  <ellipse cx="10" cy="19" rx="1.2" ry="0.8" fill="#2C2C2C" />
                </svg>
              </div>
            )}
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
                background: type === 'rainbow' 
                  ? colors.crown  // Flat color for rainbow tree
                  : `radial-gradient(circle at 30% 30%, ${colors.crownLight} 0%, ${colors.crown} 40%, ${colors.crownDark} 100%)`,
                borderRadius: '50% 45% 55% 50%',
                filter: type === 'rainbow' 
                  ? 'none'  // No drop shadow for rainbow tree
                  : 'drop-shadow(4px 8px 16px rgba(0,0,0,0.3))',
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
              
              {/* Fairy lights decoration - single horizontal line from side to side */}
              {decorations.includes('fairy_lights') && (
                <>
                  {/* Single black wire string connecting tree sides */}
                  <div 
                    className="absolute"
                    style={{
                      top: '50%',
                      left: '2%',
                      right: '2%',
                      height: '1px',
                      backgroundColor: '#2d2d2d',
                      zIndex: 10
                    }}
                  />
                  
                  {/* Large teardrop-shaped colorful bulbs along single line */}
                  <div 
                    className="absolute animate-pulse"
                    style={{
                      top: '48%',
                      left: '5%',
                      width: `${6 * sizeMultiplier}px`,
                      height: `${8 * sizeMultiplier}px`,
                      backgroundColor: '#FFD700',
                      borderRadius: '50% 50% 50% 0%',
                      transform: 'rotate(45deg)',
                      filter: 'drop-shadow(0 0 4px #FFD700)',
                      zIndex: 11
                    }}
                  />
                  <div 
                    className="absolute animate-pulse"
                    style={{
                      top: '48%',
                      left: '20%',
                      width: `${6 * sizeMultiplier}px`,
                      height: `${8 * sizeMultiplier}px`,
                      backgroundColor: '#FF1493',
                      borderRadius: '50% 50% 50% 0%',
                      transform: 'rotate(45deg)',
                      filter: 'drop-shadow(0 0 4px #FF1493)',
                      animationDelay: '0.3s',
                      zIndex: 11
                    }}
                  />
                  <div 
                    className="absolute animate-pulse"
                    style={{
                      top: '48%',
                      left: '35%',
                      width: `${6 * sizeMultiplier}px`,
                      height: `${8 * sizeMultiplier}px`,
                      backgroundColor: '#00BFFF',
                      borderRadius: '50% 50% 50% 0%',
                      transform: 'rotate(45deg)',
                      filter: 'drop-shadow(0 0 4px #00BFFF)',
                      animationDelay: '0.6s',
                      zIndex: 11
                    }}
                  />
                  <div 
                    className="absolute animate-pulse"
                    style={{
                      top: '48%',
                      left: '50%',
                      width: `${6 * sizeMultiplier}px`,
                      height: `${8 * sizeMultiplier}px`,
                      backgroundColor: '#32CD32',
                      borderRadius: '50% 50% 50% 0%',
                      transform: 'rotate(45deg)',
                      filter: 'drop-shadow(0 0 4px #32CD32)',
                      animationDelay: '0.9s',
                      zIndex: 11
                    }}
                  />
                  <div 
                    className="absolute animate-pulse"
                    style={{
                      top: '48%',
                      right: '35%',
                      width: `${6 * sizeMultiplier}px`,
                      height: `${8 * sizeMultiplier}px`,
                      backgroundColor: '#FF4500',
                      borderRadius: '50% 50% 50% 0%',
                      transform: 'rotate(45deg)',
                      filter: 'drop-shadow(0 0 4px #FF4500)',
                      animationDelay: '1.2s',
                      zIndex: 11
                    }}
                  />
                  <div 
                    className="absolute animate-pulse"
                    style={{
                      top: '48%',
                      right: '20%',
                      width: `${6 * sizeMultiplier}px`,
                      height: `${8 * sizeMultiplier}px`,
                      backgroundColor: '#9932CC',
                      borderRadius: '50% 50% 50% 0%',
                      transform: 'rotate(45deg)',
                      filter: 'drop-shadow(0 0 4px #9932CC)',
                      animationDelay: '1.5s',
                      zIndex: 11
                    }}
                  />
                  <div 
                    className="absolute animate-pulse"
                    style={{
                      top: '48%',
                      right: '5%',
                      width: `${6 * sizeMultiplier}px`,
                      height: `${8 * sizeMultiplier}px`,
                      backgroundColor: '#FF69B4',
                      borderRadius: '50% 50% 50% 0%',
                      transform: 'rotate(45deg)',
                      filter: 'drop-shadow(0 0 4px #FF69B4)',
                      animationDelay: '1.8s',
                      zIndex: 11
                    }}
                  />
                </>
              )}
            </motion.div>
            
            {/* FULL CARTOON TRUNK */}
            <div
              className="relative z-10"
              style={{
                width: `${fullTrunkWidth}px`,
                height: `${fullTrunkHeight}px`,
                background: type === 'rainbow'
                  ? colors.trunk  // Flat color for rainbow tree
                  : `linear-gradient(45deg, ${colors.trunkDark} 0%, ${colors.trunk} 30%, ${colors.trunkDark} 100%)`,
                borderRadius: '3px 3px 1px 1px',
                filter: type === 'rainbow' 
                  ? 'none'  // No drop shadow for rainbow tree
                  : 'drop-shadow(2px 4px 8px rgba(0,0,0,0.4))',
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
            
            {/* Garden gnome decoration - cute gnome with colorful hat at tree base */}
            {decorations.includes('gnome') && (
              <div 
                className="absolute bottom-0 right-0 transform translate-x-1/2"
                style={{ zIndex: 5 }}
              >
                <svg 
                  width={`${16 * sizeMultiplier}px`} 
                  height={`${20 * sizeMultiplier}px`} 
                  viewBox="0 0 16 20"
                  className="drop-shadow-md"
                >
                  {/* Gnome body */}
                  <ellipse cx="8" cy="16" rx="4" ry="3" fill="#8FBC8F" />
                  
                  {/* Gnome face */}
                  <circle cx="8" cy="12" r="2.5" fill="#FDBCB4" />
                  
                  {/* Colorful hat - positioned lower to attach to head */}
                  <path 
                    d="M 8 4 Q 12 4 12 8 Q 12 10 10 11 L 6 11 Q 4 10 4 8 Q 4 4 8 4 Z" 
                    fill="#FF69B4" 
                  />
                  <circle cx="8" cy="4" r="1" fill="#FFB6C1" />
                  
                  {/* White beard */}
                  <ellipse cx="8" cy="14" rx="2" ry="1.5" fill="#FFFFFF" />
                  
                  {/* Little black eyes */}
                  <circle cx="7" cy="11.5" r="0.3" fill="#000000" />
                  <circle cx="9" cy="11.5" r="0.3" fill="#000000" />
                  
                  {/* Pink nose */}
                  <circle cx="8" cy="12.5" r="0.2" fill="#FFB6C1" />
                  
                  {/* Little hands */}
                  <circle cx="4.5" cy="15" r="0.8" fill="#FDBCB4" />
                  <circle cx="11.5" cy="15" r="0.8" fill="#FDBCB4" />
                  
                  {/* Black shoes */}
                  <ellipse cx="6" cy="19" rx="1.2" ry="0.8" fill="#2C2C2C" />
                  <ellipse cx="10" cy="19" rx="1.2" ry="0.8" fill="#2C2C2C" />
                </svg>
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