import { motion } from "framer-motion";

interface TreeDesignProps {
  type: string;
  stage: number;
  style: 'simple' | 'fluffy' | 'geometric' | 'layered';
  xpContributed?: number;
  className?: string;
}

export const TreeDesignOptions = ({ 
  type, 
  stage, 
  style,
  xpContributed = 0, 
  className = "" 
}: TreeDesignProps) => {
  
  const getColors = (type: string) => {
    switch (type) {
      case 'oak':
        return { crown: '#4CAF50', light: '#81C784', trunk: '#8D6E63' };
      case 'cherry':
        return { crown: '#E91E63', light: '#F48FB1', trunk: '#8D6E63' };
      case 'willow':
        return { crown: '#9CCC65', light: '#C5E1A5', trunk: '#8D6E63' };
      default:
        return { crown: '#4CAF50', light: '#81C784', trunk: '#8D6E63' };
    }
  };

  const colors = getColors(type);
  const size = 40 + (stage * 8);
  const treeScale = 0.8 + (stage * 0.1);

  const renderSimpleTree = () => (
    <div className="relative flex items-end justify-center h-24 w-24">
      <motion.div className="relative" animate={{ scale: treeScale }}>
        {/* Simple circular crown */}
        <div
          style={{
            width: `${size}px`,
            height: `${size}px`,
            backgroundColor: colors.crown,
            borderRadius: '50%',
            position: 'relative',
            filter: 'drop-shadow(2px 3px 6px rgba(0,0,0,0.2))'
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: '20%',
              left: '25%',
              width: '25%',
              height: '25%',
              backgroundColor: colors.light,
              borderRadius: '50%',
              opacity: 0.8
            }}
          />
        </div>
        <div
          style={{
            position: 'absolute',
            bottom: '-8px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: `${8 + stage * 2}px`,
            height: `${16 + stage * 2}px`,
            backgroundColor: colors.trunk,
            borderRadius: '2px'
          }}
        />
      </motion.div>
    </div>
  );

  const renderFluffyTree = () => (
    <div className="relative flex items-end justify-center h-24 w-24">
      <motion.div className="relative" animate={{ scale: treeScale }}>
        {/* Fluffy cloud-like crown */}
        <div className="relative">
          {/* Main crown circles */}
          <div
            style={{
              width: `${size}px`,
              height: `${size * 0.8}px`,
              backgroundColor: colors.crown,
              borderRadius: '50%',
              position: 'relative'
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: `${-size * 0.2}px`,
              left: `${-size * 0.15}px`,
              width: `${size * 0.7}px`,
              height: `${size * 0.7}px`,
              backgroundColor: colors.light,
              borderRadius: '50%'
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: `${-size * 0.1}px`,
              right: `${-size * 0.1}px`,
              width: `${size * 0.6}px`,
              height: `${size * 0.6}px`,
              backgroundColor: colors.light,
              borderRadius: '50%'
            }}
          />
        </div>
        <div
          style={{
            position: 'absolute',
            bottom: '-8px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: `${10 + stage * 2}px`,
            height: `${18 + stage * 2}px`,
            backgroundColor: colors.trunk,
            borderRadius: '4px'
          }}
        />
      </motion.div>
    </div>
  );

  const renderGeometricTree = () => (
    <div className="relative flex items-end justify-center h-24 w-24">
      <motion.div className="relative" animate={{ scale: treeScale }}>
        {/* Geometric triangular crown */}
        <div
          style={{
            width: 0,
            height: 0,
            borderLeft: `${size * 0.6}px solid transparent`,
            borderRight: `${size * 0.6}px solid transparent`,
            borderBottom: `${size}px solid ${colors.crown}`,
            position: 'relative',
            filter: 'drop-shadow(2px 3px 6px rgba(0,0,0,0.2))'
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: `${size * 0.3}px`,
              left: `${-size * 0.3}px`,
              width: 0,
              height: 0,
              borderLeft: `${size * 0.3}px solid transparent`,
              borderRight: `${size * 0.3}px solid transparent`,
              borderBottom: `${size * 0.5}px solid ${colors.light}`
            }}
          />
        </div>
        <div
          style={{
            position: 'absolute',
            bottom: '-8px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: `${8 + stage * 2}px`,
            height: `${16 + stage * 3}px`,
            backgroundColor: colors.trunk,
            borderRadius: '1px'
          }}
        />
      </motion.div>
    </div>
  );

  const renderLayeredTree = () => (
    <div className="relative flex items-end justify-center h-24 w-24">
      <motion.div className="relative" animate={{ scale: treeScale }}>
        {/* Layered oval crown */}
        <div className="relative">
          <div
            style={{
              width: `${size}px`,
              height: `${size * 0.7}px`,
              backgroundColor: colors.crown,
              borderRadius: '50%',
              position: 'relative'
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: `${size * 0.15}px`,
              left: '50%',
              transform: 'translateX(-50%)',
              width: `${size * 0.8}px`,
              height: `${size * 0.6}px`,
              backgroundColor: colors.light,
              borderRadius: '50%'
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: `${size * 0.25}px`,
              left: '50%',
              transform: 'translateX(-50%)',
              width: `${size * 0.6}px`,
              height: `${size * 0.4}px`,
              backgroundColor: colors.crown,
              borderRadius: '50%',
              opacity: 0.8
            }}
          />
        </div>
        <div
          style={{
            position: 'absolute',
            bottom: '-8px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: `${10 + stage * 2}px`,
            height: `${18 + stage * 2}px`,
            backgroundColor: colors.trunk,
            borderRadius: '3px'
          }}
        />
      </motion.div>
    </div>
  );

  switch (style) {
    case 'simple': return renderSimpleTree();
    case 'fluffy': return renderFluffyTree();
    case 'geometric': return renderGeometricTree();
    case 'layered': return renderLayeredTree();
    default: return renderSimpleTree();
  }
};

// Demo component to show all options
export const TreeStyleShowcase = () => {
  const treeTypes = ['oak', 'cherry', 'willow'];
  const styles: ('simple' | 'fluffy' | 'geometric' | 'layered')[] = ['simple', 'fluffy', 'geometric', 'layered'];
  
  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">Tree Design Options</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {styles.map((style) => (
          <div key={style} className="text-center">
            <h3 className="text-lg font-semibold mb-3 capitalize">{style} Style</h3>
            <div className="space-y-3">
              {treeTypes.map((type) => (
                <div key={type} className="flex flex-col items-center">
                  <TreeDesignOptions
                    type={type}
                    stage={3}
                    style={style}
                    xpContributed={25}
                  />
                  <span className="text-sm text-gray-600 capitalize">{type}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-8 text-center">
        <h3 className="text-lg font-semibold mb-4">Growth Stages (Simple Style Example)</h3>
        <div className="flex justify-center items-end gap-4">
          {[1, 2, 3, 4, 5].map((stage) => (
            <div key={stage} className="flex flex-col items-center">
              <TreeDesignOptions
                type="oak"
                stage={stage}
                style="simple"
                xpContributed={stage * 10}
              />
              <span className="text-sm text-gray-600">Stage {stage}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};