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
  // Parse gnome decorations to support multiple gnomes
  const parseDecorations = () => {
    const gnomes: Array<{ id: number, color: string, position: 'left' | 'right' }> = [];
    const otherDecorations = [];
    
    for (const decoration of decorations) {
      if (typeof decoration === 'string') {
        if (decoration === 'gnome') {
          // Legacy single gnome support
          gnomes.push({ id: 1, color: 'green', position: 'right' });
        } else if (decoration.startsWith('gnome_')) {
          // New multiple gnome support: gnome_1_green_left, gnome_2_blue_right, etc.
          const parts = decoration.split('_');
          if (parts.length >= 4) {
            const id = parseInt(parts[1]);
            const color = parts[2];
            const position = parts[3] as 'left' | 'right';
            gnomes.push({ id, color, position });
          }
        } else {
          otherDecorations.push(decoration);
        }
      } else {
        otherDecorations.push(decoration);
      }
    }
    
    return { gnomes, hasLights: otherDecorations.includes('fairy_lights') };
  };
  
  const { gnomes, hasLights } = parseDecorations();
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
  
  // Gnome color mapping
  const getGnomeHatColor = (color: string) => {
    switch (color) {
      case 'green': return '#32CD32';
      case 'blue': return '#00BFFF';
      case 'pink': return '#FF69B4';
      case 'red': return '#FF6347';
      case 'purple': return '#9370DB';
      case 'orange': return '#FF8C00';
      default: return '#32CD32';
    }
  };
  
  const getGnomeHatTipColor = (color: string) => {
    switch (color) {
      case 'green': return '#90EE90';
      case 'blue': return '#87CEEB';
      case 'pink': return '#FFB6C1';
      case 'red': return '#FFA07A';
      case 'purple': return '#DDA0DD';
      case 'orange': return '#FFD700';
      default: return '#90EE90';
    }
  };
  
  // Generate gnome positioning for multiple gnomes with equal distance around tree center
  const getGnomePositions = (count: number, treeWidth: number) => {
    if (count === 0) return [];
    
    const radius = treeWidth * 0.7; // Increased distance from tree center
    const positions = [];
    
    // Place gnomes in a semicircle around the tree base
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI / (count + 1)) * (i + 1); // Spread evenly in semicircle
      const x = Math.cos(angle) * radius; // Positive = right, negative = left
      const z = Math.sin(angle) * radius * 0.2; // Reduced depth effect for better spacing
      
      positions.push({ 
        x: x, 
        z: z,
        side: x > 0 ? 'right' as const : (x < 0 ? 'left' as const : 'center' as const)
      });
    }
    
    return positions;
  };
  
  // Render multiple gnomes with different colors and positions
  const renderGnomes = (gnomeCount: number, gnomeWidth: number, gnomeHeight: number, treeWidth: number) => {
    if (gnomes.length === 0) return null;
    
    const positions = getGnomePositions(Math.min(gnomes.length, 4), treeWidth);
    
    return gnomes.slice(0, 4).map((gnome, index) => {
      const position = positions[index];
      if (!position) return null;
      
      return (
        <div 
          key={gnome.id}
          className="absolute bottom-0"
          style={{ 
            zIndex: 5,
            left: '50%',
            transform: `translateX(calc(-50% + ${position.x}px)) translateY(${position.z || 0}px)`,
          }}
        >
          <svg 
            width={`${gnomeWidth}px`} 
            height={`${gnomeHeight}px`} 
            viewBox="0 0 16 20"
            className="drop-shadow-md"
          >
            {/* Gnome body */}
            <ellipse cx="8" cy="16" rx="4" ry="3" fill="#8FBC8F" />
            {/* Gnome face */}
            <circle cx="8" cy="12" r="2.5" fill="#FDBCB4" />
            {/* Pointed cone hat with gnome's specific color */}
            <path 
              d="M 8 3 L 12 11 L 4 11 Z" 
              fill={getGnomeHatColor(gnome.color)} 
            />
            <circle cx="8" cy="3" r="1" fill={getGnomeHatTipColor(gnome.color)} />
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
      );
    });
  };
  
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
            
            {/* Multiple gnome decorations for small trees */}
            {renderGnomes(gnomes.length, 12 * sizeMultiplier, 15 * sizeMultiplier, smallCrownSize)}
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
              {hasLights && (
                <>
                  {/* Single wire string exactly from tree sides */}
                  <div className="absolute" style={{ top: '45%', left: '0%', right: '0%', height: '1px', backgroundColor: '#2d2d2d', zIndex: 10 }} />
                  
                  {/* Medium Christmas light bulbs starting from edges */}
                  <div className="absolute animate-pulse" style={{ top: '45%', left: '0%', width: `${4 * sizeMultiplier}px`, height: `${6 * sizeMultiplier}px`, backgroundColor: '#FF6B35', borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%', filter: 'drop-shadow(0 0 3px #FF6B35)', zIndex: 11 }} />
                  <div className="absolute animate-pulse" style={{ top: '45%', left: '24%', width: `${4 * sizeMultiplier}px`, height: `${6 * sizeMultiplier}px`, backgroundColor: '#4ECDC4', borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%', filter: 'drop-shadow(0 0 3px #4ECDC4)', animationDelay: '0.4s', zIndex: 11 }} />
                  <div className="absolute animate-pulse" style={{ top: '45%', left: '48%', width: `${4 * sizeMultiplier}px`, height: `${6 * sizeMultiplier}px`, backgroundColor: '#FFD93D', borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%', filter: 'drop-shadow(0 0 3px #FFD93D)', animationDelay: '0.8s', zIndex: 11 }} />
                  <div className="absolute animate-pulse" style={{ top: '45%', right: '24%', width: `${4 * sizeMultiplier}px`, height: `${6 * sizeMultiplier}px`, backgroundColor: '#6BCF7F', borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%', filter: 'drop-shadow(0 0 3px #6BCF7F)', animationDelay: '1.2s', zIndex: 11 }} />
                  <div className="absolute animate-pulse" style={{ top: '45%', right: '0%', width: `${4 * sizeMultiplier}px`, height: `${6 * sizeMultiplier}px`, backgroundColor: '#FF6B9D', borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%', filter: 'drop-shadow(0 0 3px #FF6B9D)', animationDelay: '1.6s', zIndex: 11 }} />
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
            {/* Multiple gnome decorations for medium trees */}
            {renderGnomes(gnomes.length, 14 * sizeMultiplier, 17 * sizeMultiplier, mediumCrownSize)}
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
              {hasLights && (
                <>
                  {/* Single black wire string connecting exactly from tree sides */}
                  <div 
                    className="absolute"
                    style={{
                      top: '50%',
                      left: '0%',
                      right: '0%',
                      height: '1px',
                      backgroundColor: '#2d2d2d',
                      zIndex: 10
                    }}
                  />
                  
                  {/* Christmas light bulbs starting exactly from tree edges */}
                  <div 
                    className="absolute animate-pulse"
                    style={{
                      top: '50%',
                      left: '0%',
                      width: `${5 * sizeMultiplier}px`,
                      height: `${7 * sizeMultiplier}px`,
                      backgroundColor: '#FF6B35',
                      borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
                      filter: 'drop-shadow(0 0 4px #FF6B35)',
                      zIndex: 11
                    }}
                  />
                  <div 
                    className="absolute animate-pulse"
                    style={{
                      top: '50%',
                      left: '12%',
                      width: `${5 * sizeMultiplier}px`,
                      height: `${7 * sizeMultiplier}px`,
                      backgroundColor: '#4ECDC4',
                      borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
                      filter: 'drop-shadow(0 0 4px #4ECDC4)',
                      animationDelay: '0.3s',
                      zIndex: 11
                    }}
                  />
                  <div 
                    className="absolute animate-pulse"
                    style={{
                      top: '50%',
                      left: '25%',
                      width: `${5 * sizeMultiplier}px`,
                      height: `${7 * sizeMultiplier}px`,
                      backgroundColor: '#FFD93D',
                      borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
                      filter: 'drop-shadow(0 0 4px #FFD93D)',
                      animationDelay: '0.6s',
                      zIndex: 11
                    }}
                  />
                  <div 
                    className="absolute animate-pulse"
                    style={{
                      top: '50%',
                      left: '37%',
                      width: `${5 * sizeMultiplier}px`,
                      height: `${7 * sizeMultiplier}px`,
                      backgroundColor: '#6BCF7F',
                      borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
                      filter: 'drop-shadow(0 0 4px #6BCF7F)',
                      animationDelay: '0.9s',
                      zIndex: 11
                    }}
                  />
                  <div 
                    className="absolute animate-pulse"
                    style={{
                      top: '50%',
                      left: '50%',
                      width: `${5 * sizeMultiplier}px`,
                      height: `${7 * sizeMultiplier}px`,
                      backgroundColor: '#4D96FF',
                      borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
                      filter: 'drop-shadow(0 0 4px #4D96FF)',
                      animationDelay: '1.2s',
                      zIndex: 11
                    }}
                  />
                  <div 
                    className="absolute animate-pulse"
                    style={{
                      top: '50%',
                      right: '37%',
                      width: `${5 * sizeMultiplier}px`,
                      height: `${7 * sizeMultiplier}px`,
                      backgroundColor: '#FF6B9D',
                      borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
                      filter: 'drop-shadow(0 0 4px #FF6B9D)',
                      animationDelay: '1.5s',
                      zIndex: 11
                    }}
                  />
                  <div 
                    className="absolute animate-pulse"
                    style={{
                      top: '50%',
                      right: '25%',
                      width: `${5 * sizeMultiplier}px`,
                      height: `${7 * sizeMultiplier}px`,
                      backgroundColor: '#A8E6CF',
                      borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
                      filter: 'drop-shadow(0 0 4px #A8E6CF)',
                      animationDelay: '1.8s',
                      zIndex: 11
                    }}
                  />
                  <div 
                    className="absolute animate-pulse"
                    style={{
                      top: '50%',
                      right: '12%',
                      width: `${5 * sizeMultiplier}px`,
                      height: `${7 * sizeMultiplier}px`,
                      backgroundColor: '#FFA726',
                      borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
                      filter: 'drop-shadow(0 0 4px #FFA726)',
                      animationDelay: '2.1s',
                      zIndex: 11
                    }}
                  />
                  <div 
                    className="absolute animate-pulse"
                    style={{
                      top: '50%',
                      right: '0%',
                      width: `${5 * sizeMultiplier}px`,
                      height: `${7 * sizeMultiplier}px`,
                      backgroundColor: '#B19CD9',
                      borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
                      filter: 'drop-shadow(0 0 4px #B19CD9)',
                      animationDelay: '2.4s',
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
            {/* Multiple gnome decorations for large trees */}
            {renderGnomes(gnomes.length, 16 * sizeMultiplier, 20 * sizeMultiplier, fullCrownSize)}
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