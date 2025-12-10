import { DailyData } from '../hooks/useDashboardData';

interface LineChartProps {
  data: DailyData[];
  color?: string;
  height?: number;
}

export function LineChart({ data, color = '#3b82f6', height = 120 }: LineChartProps) {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-slate-400">
        No data available
      </div>
    );
  }

  const maxCount = Math.max(...data.map((d) => d.count), 1);
  const points: string[] = [];
  const width = 100;
  const padding = 10;

  data.forEach((item, index) => {
    const x = (index / (data.length - 1)) * (width - padding * 2) + padding;
    const y = height - (item.count / maxCount) * (height - 40) - 20;
    points.push(`${x},${y}`);
  });

  const pathD = points.length > 0 ? `M ${points.join(' L ')}` : '';
  const areaD = points.length > 0
    ? `${pathD} L ${width - padding},${height - 20} L ${padding},${height - 20} Z`
    : '';

  return (
    <div className="relative">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full"
        style={{ minHeight: '120px' }}
      >
        <defs>
          <linearGradient id={`gradient-${color}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={color} stopOpacity="0.3" />
            <stop offset="100%" stopColor={color} stopOpacity="0.05" />
          </linearGradient>
        </defs>

        <path
          d={areaD}
          fill={`url(#gradient-${color})`}
          className="transition-all duration-500"
        />

        <path
          d={pathD}
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="transition-all duration-500"
        />

        {points.map((point, index) => {
          const [x, y] = point.split(',').map(Number);
          return (
            <g key={index}>
              <circle
                cx={x}
                cy={y}
                r="3"
                fill={color}
                className="transition-all duration-500"
              />
              {data[index].count > 0 && (
                <text
                  x={x}
                  y={y - 8}
                  textAnchor="middle"
                  className="text-[3px] fill-slate-600 font-medium"
                >
                  {data[index].count}
                </text>
              )}
            </g>
          );
        })}

        <line
          x1={padding}
          y1={height - 20}
          x2={width - padding}
          y2={height - 20}
          stroke="#e2e8f0"
          strokeWidth="1"
        />
      </svg>

      <div className="flex justify-between mt-2 px-2 text-xs text-slate-500">
        <span>{data[0]?.date}</span>
        <span>{data[Math.floor(data.length / 2)]?.date}</span>
        <span>{data[data.length - 1]?.date}</span>
      </div>
    </div>
  );
}
