import React from 'react';
import { motion } from 'framer-motion';

interface TreeVisual3DProps {
  treeType: string;
  growthStage: number;
  className?: string;
}

export function TreeVisual3D({ treeType, growthStage, className = '' }: TreeVisual3DProps) {
  const getTreeColors = (type: string) => {
    switch (type) {
      case 'oak':
        return {
          trunk: '#8B4513',
          leaves: '#228B22',
          accent: '#32CD32',
          shadow: '#1a5c1a'
        };
      case 'cherry':
        return {
          trunk: '#8B4513',
          leaves: '#FFB6C1',
          accent: '#FF69B4',
          shadow: '#b85c7a'
        };
      case 'willow':
        return {
          trunk: '#A0522D',
          leaves: '#9ACD32',
          accent: '#ADFF2F',
          shadow: '#6b8e23'
        };
      case 'rainbow':
        return {
          trunk: '#8B4513',
          leaves: '#FF6B6B',
          accent: '#4ECDC4',
          shadow: '#45B7D1'
        };
      default:
        return {
          trunk: '#8B4513',
          leaves: '#228B22',
          accent: '#32CD32',
          shadow: '#1a5c1a'
        };
    }
  };

  const colors = getTreeColors(treeType);

  if (growthStage === 1) {
    // Seed stage - small sprouting seed
    return (
      <motion.svg 
        width="120" 
        height="120" 
        viewBox="0 0 120 120" 
        className={className}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <defs>
          <radialGradient id="seedGradient" cx="50%" cy="30%" r="50%">
            <stop offset="0%" style={{ stopColor: '#90EE90', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#228B22', stopOpacity: 1 }} />
          </radialGradient>
        </defs>
        {/* Ground */}
        <ellipse cx="60" cy="100" rx="25" ry="5" fill="#8B4513" opacity="0.3" />
        {/* Seed */}
        <ellipse cx="60" cy="95" rx="8" ry="10" fill="#D2691E" />
        {/* Small sprout */}
        <motion.path
          d="M60 85 Q65 80 70 75 Q65 70 60 75 Q55 70 50 75 Q55 80 60 85"
          fill="url(#seedGradient)"
          animate={{ 
            d: ["M60 95 Q62 90 64 85 Q62 80 60 85 Q58 80 56 85 Q58 90 60 95",
                "M60 85 Q65 80 70 75 Q65 70 60 75 Q55 70 50 75 Q55 80 60 85"]
          }}
          transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
        />
      </motion.svg>
    );
  }

  if (growthStage === 2) {
    // Sprout stage - small plant with a few leaves
    return (
      <motion.svg 
        width="120" 
        height="120" 
        viewBox="0 0 120 120" 
        className={className}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <defs>
          <linearGradient id="sproutTrunk" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style={{ stopColor: colors.trunk, stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#654321', stopOpacity: 1 }} />
          </linearGradient>
          <radialGradient id="sproutLeaves" cx="50%" cy="30%" r="50%">
            <stop offset="0%" style={{ stopColor: colors.accent, stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: colors.leaves, stopOpacity: 1 }} />
          </radialGradient>
        </defs>
        {/* Ground shadow */}
        <ellipse cx="60" cy="110" rx="30" ry="8" fill="#000" opacity="0.1" />
        {/* Trunk */}
        <rect x="58" y="85" width="4" height="25" fill="url(#sproutTrunk)" rx="2" />
        {/* Leaves */}
        <motion.ellipse 
          cx="52" cy="80" rx="12" ry="8" 
          fill="url(#sproutLeaves)" 
          animate={{ rotate: [-2, 2, -2] }}
          transition={{ duration: 3, repeat: Infinity }}
        />
        <motion.ellipse 
          cx="68" cy="75" rx="10" ry="6" 
          fill="url(#sproutLeaves)" 
          animate={{ rotate: [2, -2, 2] }}
          transition={{ duration: 2.5, repeat: Infinity }}
        />
        <ellipse cx="60" cy="85" rx="8" ry="5" fill="url(#sproutLeaves)" />
      </motion.svg>
    );
  }

  if (growthStage === 3) {
    // Sapling stage - small tree with defined trunk and crown
    return (
      <motion.svg 
        width="140" 
        height="140" 
        viewBox="0 0 140 140" 
        className={className}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <defs>
          <linearGradient id="saplingTrunk" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: colors.trunk, stopOpacity: 1 }} />
            <stop offset="50%" style={{ stopColor: '#A0522D', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#654321', stopOpacity: 1 }} />
          </linearGradient>
          <radialGradient id="saplingLeaves" cx="40%" cy="30%" r="60%">
            <stop offset="0%" style={{ stopColor: colors.accent, stopOpacity: 1 }} />
            <stop offset="70%" style={{ stopColor: colors.leaves, stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: colors.shadow, stopOpacity: 1 }} />
          </radialGradient>
        </defs>
        {/* Ground shadow */}
        <ellipse cx="70" cy="130" rx="40" ry="10" fill="#000" opacity="0.1" />
        {/* Trunk */}
        <path d="M68 90 L72 90 L75 130 L65 130 Z" fill="url(#saplingTrunk)" />
        {/* Tree crown - layered for 3D effect */}
        <ellipse cx="70" cy="70" rx="35" ry="25" fill={colors.shadow} />
        <ellipse cx="68" cy="65" rx="32" ry="22" fill="url(#saplingLeaves)" />
        {/* Highlight */}
        <ellipse cx="60" cy="55" rx="15" ry="10" fill={colors.accent} opacity="0.7" />
        {/* Animation for gentle swaying */}
        <motion.g
          animate={{ rotate: [-1, 1, -1] }}
          transition={{ duration: 4, repeat: Infinity }}
          style={{ transformOrigin: '70px 90px' }}
        >
          <ellipse cx="70" cy="70" rx="35" ry="25" fill={colors.shadow} />
          <ellipse cx="68" cy="65" rx="32" ry="22" fill="url(#saplingLeaves)" />
          <ellipse cx="60" cy="55" rx="15" ry="10" fill={colors.accent} opacity="0.7" />
        </motion.g>
      </motion.svg>
    );
  }

  if (growthStage === 4) {
    // Tree stage - larger, more detailed tree
    return (
      <motion.svg 
        width="160" 
        height="160" 
        viewBox="0 0 160 160" 
        className={className}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <defs>
          <linearGradient id="treeTrunk" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: colors.trunk, stopOpacity: 1 }} />
            <stop offset="30%" style={{ stopColor: '#A0522D', stopOpacity: 1 }} />
            <stop offset="70%" style={{ stopColor: '#8B4513', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#654321', stopOpacity: 1 }} />
          </linearGradient>
          <radialGradient id="treeLeaves" cx="35%" cy="25%" r="70%">
            <stop offset="0%" style={{ stopColor: colors.accent, stopOpacity: 1 }} />
            <stop offset="40%" style={{ stopColor: colors.leaves, stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: colors.shadow, stopOpacity: 1 }} />
          </radialGradient>
        </defs>
        {/* Ground shadow */}
        <ellipse cx="80" cy="150" rx="50" ry="12" fill="#000" opacity="0.15" />
        {/* Trunk with texture */}
        <path d="M75 70 L85 70 L90 150 L70 150 Z" fill="url(#treeTrunk)" />
        {/* Trunk texture lines */}
        <path d="M77 80 Q80 82 83 80" stroke="#654321" strokeWidth="1" fill="none" opacity="0.6" />
        <path d="M76 100 Q82 102 84 100" stroke="#654321" strokeWidth="1" fill="none" opacity="0.6" />
        <path d="M75 120 Q81 122 85 120" stroke="#654321" strokeWidth="1" fill="none" opacity="0.6" />
        
        {/* Tree crown - multiple layers for depth */}
        <motion.g
          animate={{ rotate: [-0.5, 0.5, -0.5] }}
          transition={{ duration: 5, repeat: Infinity }}
          style={{ transformOrigin: '80px 70px' }}
        >
          {/* Shadow layer */}
          <ellipse cx="82" cy="55" rx="45" ry="35" fill={colors.shadow} />
          {/* Main crown */}
          <ellipse cx="80" cy="50" rx="42" ry="32" fill="url(#treeLeaves)" />
          {/* Additional crown layers for fullness */}
          <ellipse cx="70" cy="45" rx="25" ry="20" fill={colors.leaves} opacity="0.8" />
          <ellipse cx="90" cy="48" rx="28" ry="22" fill={colors.leaves} opacity="0.8" />
          {/* Highlights */}
          <ellipse cx="65" cy="35" rx="18" ry="12" fill={colors.accent} opacity="0.6" />
          <ellipse cx="95" cy="40" rx="15" ry="10" fill={colors.accent} opacity="0.6" />
        </motion.g>
      </motion.svg>
    );
  }

  // Mature stage (5) - full, majestic tree
  return (
    <motion.svg 
      width="200" 
      height="200" 
      viewBox="0 0 200 200" 
      className={className}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <defs>
        <linearGradient id="matureTrunk" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: colors.trunk, stopOpacity: 1 }} />
          <stop offset="20%" style={{ stopColor: '#A0522D', stopOpacity: 1 }} />
          <stop offset="60%" style={{ stopColor: colors.trunk, stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#654321', stopOpacity: 1 }} />
        </linearGradient>
        <radialGradient id="matureLeaves" cx="30%" cy="20%" r="80%">
          <stop offset="0%" style={{ stopColor: colors.accent, stopOpacity: 1 }} />
          <stop offset="30%" style={{ stopColor: colors.leaves, stopOpacity: 1 }} />
          <stop offset="70%" style={{ stopColor: colors.leaves, stopOpacity: 0.9 }} />
          <stop offset="100%" style={{ stopColor: colors.shadow, stopOpacity: 1 }} />
        </radialGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge> 
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      
      {/* Ground shadow */}
      <ellipse cx="100" cy="190" rx="70" ry="15" fill="#000" opacity="0.2" />
      
      {/* Large trunk with branches */}
      <path d="M90 60 L110 60 L118 190 L82 190 Z" fill="url(#matureTrunk)" />
      
      {/* Trunk texture and details */}
      <path d="M92 80 Q100 85 108 80" stroke="#654321" strokeWidth="2" fill="none" opacity="0.7" />
      <path d="M90 110 Q105 115 110 110" stroke="#654321" strokeWidth="2" fill="none" opacity="0.7" />
      <path d="M88 140 Q102 145 112 140" stroke="#654321" strokeWidth="2" fill="none" opacity="0.7" />
      <path d="M85 170 Q100 175 115 170" stroke="#654321" strokeWidth="2" fill="none" opacity="0.7" />
      
      {/* Branches */}
      <path d="M95 70 Q85 65 75 68" stroke={colors.trunk} strokeWidth="4" fill="none" />
      <path d="M105 75 Q115 70 125 73" stroke={colors.trunk} strokeWidth="4" fill="none" />
      <path d="M92 90 Q80 85 70 90" stroke={colors.trunk} strokeWidth="3" fill="none" />
      <path d="M108 95 Q120 90 130 95" stroke={colors.trunk} strokeWidth="3" fill="none" />
      
      {/* Majestic crown with animation */}
      <motion.g
        animate={{ rotate: [-0.3, 0.3, -0.3] }}
        transition={{ duration: 6, repeat: Infinity }}
        style={{ transformOrigin: '100px 60px' }}
      >
        {/* Shadow layer */}
        <ellipse cx="102" cy="50" rx="65" ry="45" fill={colors.shadow} />
        
        {/* Main crown layers */}
        <ellipse cx="100" cy="45" rx="62" ry="42" fill="url(#matureLeaves)" />
        <ellipse cx="85" cy="40" rx="35" ry="25" fill={colors.leaves} opacity="0.9" />
        <ellipse cx="115" cy="42" rx="40" ry="28" fill={colors.leaves} opacity="0.9" />
        <ellipse cx="100" cy="30" rx="45" ry="30" fill={colors.leaves} opacity="0.8" />
        
        {/* Top highlights and special effects */}
        <ellipse cx="80" cy="25" rx="25" ry="15" fill={colors.accent} opacity="0.7" />
        <ellipse cx="120" cy="28" rx="22" ry="12" fill={colors.accent} opacity="0.7" />
        <ellipse cx="100" cy="20" rx="20" ry="10" fill={colors.accent} opacity="0.8" />
        
        {/* Special rainbow effect for rainbow trees */}
        {treeType === 'rainbow' && (
          <motion.g
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <ellipse cx="85" cy="30" rx="15" ry="8" fill="#FF6B6B" opacity="0.6" />
            <ellipse cx="100" cy="25" rx="12" ry="6" fill="#4ECDC4" opacity="0.6" />
            <ellipse cx="115" cy="32" rx="13" ry="7" fill="#45B7D1" opacity="0.6" />
            <ellipse cx="95" cy="40" rx="10" ry="5" fill="#96CEB4" opacity="0.6" />
            <ellipse cx="105" cy="35" rx="8" ry="4" fill="#FFEAA7" opacity="0.6" />
          </motion.g>
        )}
        
        {/* Cherry blossom petals for cherry trees */}
        {treeType === 'cherry' && (
          <motion.g
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            style={{ transformOrigin: '100px 45px' }}
          >
            <circle cx="70" cy="30" r="3" fill="#FFB6C1" opacity="0.8" />
            <circle cx="130" cy="35" r="2.5" fill="#FF69B4" opacity="0.8" />
            <circle cx="90" cy="15" r="2" fill="#FFB6C1" opacity="0.8" />
            <circle cx="110" cy="20" r="2.5" fill="#FF69B4" opacity="0.8" />
          </motion.g>
        )}
      </motion.g>
      
      {/* Magical glow effect for mature trees */}
      <motion.circle 
        cx="100" 
        cy="45" 
        r="75" 
        fill="none" 
        stroke={colors.accent} 
        strokeWidth="1" 
        opacity="0.3"
        filter="url(#glow)"
        animate={{ 
          r: [70, 80, 70],
          opacity: [0.2, 0.4, 0.2] 
        }}
        transition={{ duration: 4, repeat: Infinity }}
      />
    </motion.svg>
  );
}