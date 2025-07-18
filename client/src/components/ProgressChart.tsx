import { motion } from "framer-motion";

interface ProgressChartProps {
  data: { date: string; score: number }[];
  className?: string;
}

export function ProgressChart({ data, className = "" }: ProgressChartProps) {
  const maxScore = Math.max(...data.map(d => d.score), 100);
  const chartHeight = 200;
  const chartWidth = 600;
  const padding = 50;

  const pathData = data.map((point, index) => {
    const x = padding + (index * (chartWidth - padding * 2)) / (data.length - 1);
    const y = chartHeight - padding - ((point.score / maxScore) * (chartHeight - padding * 2));
    return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
  }).join(' ');

  const areaData = `${pathData} L ${chartWidth - padding} ${chartHeight - padding} L ${padding} ${chartHeight - padding} Z`;

  return (
    <div className={`bg-white rounded-2xl shadow-sm p-8 ${className}`}>
      <h3 className="font-inter font-semibold text-navy mb-6">Performance Trends</h3>
      
      <div className="h-64 bg-gray-50 rounded-xl flex items-center justify-center mb-6">
        <svg width="100%" height="100%" viewBox={`0 0 ${chartWidth} ${chartHeight}`}>
          <defs>
            <linearGradient id="progressGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" style={{ stopColor: "#00C2CB", stopOpacity: 0.3 }} />
              <stop offset="100%" style={{ stopColor: "#00C2CB", stopOpacity: 0 }} />
            </linearGradient>
          </defs>
          
          {/* Grid Lines */}
          <g stroke="#E5E7EB" strokeWidth="1" opacity="0.5">
            {[...Array(6)].map((_, i) => (
              <line
                key={i}
                x1={padding + i * (chartWidth - padding * 2) / 5}
                y1={padding}
                x2={padding + i * (chartWidth - padding * 2) / 5}
                y2={chartHeight - padding}
              />
            ))}
          </g>
          
          {/* Progress Area */}
          <motion.path
            d={areaData}
            fill="url(#progressGradient)"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          />
          
          {/* Progress Line */}
          <motion.path
            d={pathData}
            fill="none"
            stroke="#00C2CB"
            strokeWidth="3"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          />
          
          {/* Data Points */}
          {data.map((point, index) => {
            const x = padding + (index * (chartWidth - padding * 2)) / (data.length - 1);
            const y = chartHeight - padding - ((point.score / maxScore) * (chartHeight - padding * 2));
            return (
              <motion.circle
                key={index}
                cx={x}
                cy={y}
                r="4"
                fill={index === data.length - 1 ? "#00C2CB" : "#002E5D"}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              />
            );
          })}
        </svg>
      </div>
      
      {/* Performance Metrics */}
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center p-4 bg-cyan/10 rounded-xl">
          <div className="text-2xl font-bold text-cyan">
            {data.length > 0 ? `${Math.round(data[data.length - 1].score)}%` : "0%"}
          </div>
          <div className="text-sm text-gray-600">Latest Score</div>
        </div>
        <div className="text-center p-4 bg-green-50 rounded-xl">
          <div className="text-2xl font-bold text-green-600">
            {data.length > 1 ? 
              `${Math.round(((data[data.length - 1].score - data[0].score) / data[0].score) * 100)}%` : 
              "0%"
            }
          </div>
          <div className="text-sm text-gray-600">Improvement</div>
        </div>
        <div className="text-center p-4 bg-blue-50 rounded-xl">
          <div className="text-2xl font-bold text-blue-600">{data.length}</div>
          <div className="text-sm text-gray-600">Sessions</div>
        </div>
      </div>
    </div>
  );
}
