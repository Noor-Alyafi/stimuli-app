import { motion } from "framer-motion";

interface TreeExampleProps {
  style: 'cute' | 'professional' | 'playful' | 'minimal';
  type: 'oak' | 'cherry' | 'willow';
  stage: number;
  hasFlowers?: boolean;
  className?: string;
}

export const CartoonTreeExamples = ({ style, type, stage, hasFlowers = false, className = "" }: TreeExampleProps) => {
  
  const getTypeColors = (type: string) => {
    switch (type) {
      case 'oak':
        return { crown: '#4CAF50', dark: '#2E7D32', trunk: '#8D6E63' };
      case 'cherry':
        return { crown: '#E91E63', dark: '#AD1457', trunk: '#8D6E63' };
      case 'willow':
        return { crown: '#9CCC65', dark: '#689F38', trunk: '#8D6E63' };
      default:
        return { crown: '#4CAF50', dark: '#2E7D32', trunk: '#8D6E63' };
    }
  };

  const colors = getTypeColors(type);
  const size = 40 + (stage * 6);

  const renderCuteStyle = () => (
    <div className="relative w-20 h-24 flex items-end justify-center">
      {/* Simple rounded tree with cute proportions */}
      <div className="relative">
        {/* Main crown - soft rounded */}
        <div
          style={{
            width: `${size}px`,
            height: `${size * 0.9}px`,
            backgroundColor: colors.crown,
            borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
            position: 'relative',
            filter: 'drop-shadow(2px 4px 6px rgba(0,0,0,0.15))'
          }}
        >
          {/* Cute highlight */}
          <div
            style={{
              position: 'absolute',
              top: '25%',
              left: '30%',
              width: '20%',
              height: '20%',
              backgroundColor: 'rgba(255,255,255,0.4)',
              borderRadius: '50%'
            }}
          />
          {/* Cute shadow detail */}
          <div
            style={{
              position: 'absolute',
              bottom: '10%',
              right: '15%',
              width: '30%',
              height: '15%',
              backgroundColor: colors.dark,
              borderRadius: '50%',
              opacity: 0.3
            }}
          />
        </div>
        {/* Trunk - cute proportions */}
        <div
          style={{
            width: `${8 + stage}px`,
            height: `${14 + stage * 2}px`,
            backgroundColor: colors.trunk,
            borderRadius: '4px',
            position: 'absolute',
            bottom: '-2px',
            left: '50%',
            transform: 'translateX(-50%)',
            filter: 'drop-shadow(1px 2px 3px rgba(0,0,0,0.2))'
          }}
        />
      </div>
      {/* Flowers scattered naturally around crown */}
      {hasFlowers && (
        <>
          <div className="absolute top-2 left-2 text-sm">🌸</div>
          <div className="absolute top-4 right-1 text-sm">🌺</div>
          <div className="absolute top-6 left-4 text-sm">🌸</div>
        </>
      )}
    </div>
  );

  const renderProfessionalStyle = () => (
    <div className="relative w-20 h-24 flex items-end justify-center">
      <div className="relative">
        {/* Professional layered crown */}
        <div
          style={{
            width: `${size}px`,
            height: `${size * 0.8}px`,
            background: `linear-gradient(135deg, ${colors.crown} 0%, ${colors.dark} 100%)`,
            borderRadius: '50%',
            position: 'relative',
            filter: 'drop-shadow(3px 5px 8px rgba(0,0,0,0.2))'
          }}
        >
          {/* Professional gradient highlight */}
          <div
            style={{
              position: 'absolute',
              top: '15%',
              left: '20%',
              width: '40%',
              height: '40%',
              background: 'linear-gradient(135deg, rgba(255,255,255,0.3) 0%, transparent 70%)',
              borderRadius: '50%'
            }}
          />
        </div>
        {/* Professional trunk with texture */}
        <div
          style={{
            width: `${10 + stage}px`,
            height: `${16 + stage * 2}px`,
            background: `linear-gradient(to bottom, ${colors.trunk} 0%, #6D4C41 100%)`,
            borderRadius: '3px',
            position: 'absolute',
            bottom: '-2px',
            left: '50%',
            transform: 'translateX(-50%)',
            filter: 'drop-shadow(2px 3px 4px rgba(0,0,0,0.3))'
          }}
        />
      </div>
      {/* Flowers positioned naturally on branches */}
      {hasFlowers && (
        <>
          <div className="absolute top-3 left-1 text-sm">🌸</div>
          <div className="absolute top-1 right-2 text-sm">🌺</div>
          <div className="absolute top-5 left-5 text-sm">🏵️</div>
          <div className="absolute top-2 right-4 text-sm">🌸</div>
        </>
      )}
    </div>
  );

  const renderPlayfulStyle = () => (
    <div className="relative w-20 h-24 flex items-end justify-center">
      <div className="relative">
        {/* Playful wavy crown */}
        <div
          style={{
            width: `${size}px`,
            height: `${size * 0.85}px`,
            backgroundColor: colors.crown,
            borderRadius: '50% 40% 60% 30%',
            position: 'relative',
            filter: 'drop-shadow(2px 4px 6px rgba(0,0,0,0.15))',
            transform: 'rotate(5deg)'
          }}
        >
          {/* Playful patches */}
          <div
            style={{
              position: 'absolute',
              top: '20%',
              left: '25%',
              width: '25%',
              height: '25%',
              backgroundColor: colors.dark,
              borderRadius: '50%',
              opacity: 0.4
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: '20%',
              right: '20%',
              width: '30%',
              height: '20%',
              backgroundColor: 'rgba(255,255,255,0.3)',
              borderRadius: '50%'
            }}
          />
        </div>
        {/* Playful wavy trunk */}
        <div
          style={{
            width: `${9 + stage}px`,
            height: `${15 + stage * 2}px`,
            backgroundColor: colors.trunk,
            borderRadius: '5px',
            position: 'absolute',
            bottom: '-2px',
            left: '50%',
            transform: 'translateX(-50%) rotate(-2deg)',
            filter: 'drop-shadow(1px 2px 3px rgba(0,0,0,0.2))'
          }}
        />
      </div>
      {/* Flowers in playful arrangement */}
      {hasFlowers && (
        <>
          <div className="absolute top-1 left-3 text-sm transform rotate-12">🌸</div>
          <div className="absolute top-4 right-0 text-sm transform -rotate-12">🌺</div>
          <div className="absolute top-6 left-1 text-sm transform rotate-45">🌸</div>
          <div className="absolute top-2 right-3 text-sm transform -rotate-45">🏵️</div>
        </>
      )}
    </div>
  );

  const renderMinimalStyle = () => (
    <div className="relative w-20 h-24 flex items-end justify-center">
      <div className="relative">
        {/* Clean minimal crown */}
        <div
          style={{
            width: `${size}px`,
            height: `${size * 0.75}px`,
            backgroundColor: colors.crown,
            borderRadius: '50%',
            position: 'relative',
            filter: 'drop-shadow(1px 2px 4px rgba(0,0,0,0.1))'
          }}
        >
          {/* Single clean highlight */}
          <div
            style={{
              position: 'absolute',
              top: '30%',
              left: '35%',
              width: '15%',
              height: '15%',
              backgroundColor: 'rgba(255,255,255,0.6)',
              borderRadius: '50%'
            }}
          />
        </div>
        {/* Clean minimal trunk */}
        <div
          style={{
            width: `${7 + stage}px`,
            height: `${12 + stage * 2}px`,
            backgroundColor: colors.trunk,
            borderRadius: '2px',
            position: 'absolute',
            bottom: '-1px',
            left: '50%',
            transform: 'translateX(-50%)',
            filter: 'drop-shadow(1px 1px 2px rgba(0,0,0,0.15))'
          }}
        />
      </div>
      {/* Minimal flower placement */}
      {hasFlowers && (
        <>
          <div className="absolute top-3 left-2 text-xs">🌸</div>
          <div className="absolute top-5 right-2 text-xs">🌺</div>
        </>
      )}
    </div>
  );

  switch (style) {
    case 'cute': return renderCuteStyle();
    case 'professional': return renderProfessionalStyle();
    case 'playful': return renderPlayfulStyle();
    case 'minimal': return renderMinimalStyle();
    default: return renderCuteStyle();
  }
};

export const TreeStyleComparison = () => {
  const styles: ('cute' | 'professional' | 'playful' | 'minimal')[] = ['cute', 'professional', 'playful', 'minimal'];
  const types: ('oak' | 'cherry' | 'willow')[] = ['oak', 'cherry', 'willow'];

  return (
    <div className="p-8 bg-white dark:bg-gray-900 rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">Cartoon Tree Style Options</h2>
      
      {/* Style comparison */}
      <div className="grid grid-cols-4 gap-8 mb-8">
        {styles.map((style) => (
          <div key={style} className="text-center">
            <h3 className="text-lg font-semibold mb-4 capitalize">{style}</h3>
            <div className="space-y-4">
              {types.map((type) => (
                <div key={`${style}-${type}`} className="flex flex-col items-center">
                  <CartoonTreeExamples
                    style={style}
                    type={type}
                    stage={3}
                    hasFlowers={true}
                  />
                  <span className="text-sm text-gray-600 capitalize mt-1">{type}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Growth stages example */}
      <div className="border-t pt-8">
        <h3 className="text-lg font-semibold mb-4 text-center">Growth Stages (Professional Style)</h3>
        <div className="flex justify-center items-end gap-6">
          {[1, 2, 3, 4, 5].map((stage) => (
            <div key={stage} className="flex flex-col items-center">
              <CartoonTreeExamples
                style="professional"
                type="oak"
                stage={stage}
                hasFlowers={stage >= 3}
              />
              <span className="text-sm text-gray-600 mt-2">Stage {stage}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 text-center text-sm text-gray-600">
        <p>Trees grow larger and more detailed with each stage.</p>
        <p>Flowers appear naturally scattered around the crown (not centered).</p>
        <p>Each type has distinct colors: Oak (green), Cherry (pink), Willow (light green).</p>
      </div>
    </div>
  );
};