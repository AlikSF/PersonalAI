import { MonthlyData } from '../hooks/useDashboardData';

interface BarChartProps {
  data: MonthlyData[];
  color?: string;
  showValues?: boolean;
}

export function BarChart({ data, color = '#10b981', showValues = true }: BarChartProps) {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-slate-400 text-sm">
        No data available
      </div>
    );
  }

  const maxCount = Math.max(...data.map((d) => d.count), 1);

  return (
    <div className="space-y-2">
      {data.map((item, index) => (
        <div key={index} className="flex items-center gap-3 group">
          <span className="text-sm text-slate-600 font-medium w-16 text-right">
            {item.month}
          </span>
          <div className="flex-1 relative">
            <div className="bg-slate-100 rounded h-6 overflow-hidden">
              <div
                className="h-full rounded flex items-center justify-end px-3 transition-all duration-700 ease-out"
                style={{
                  width: `${Math.max((item.count / maxCount) * 100, item.count > 0 ? 5 : 0)}%`,
                  background: `linear-gradient(135deg, ${color} 0%, ${adjustColorBrightness(color, -20)} 100%)`,
                }}
              >
                {showValues && item.count > 0 && (
                  <span className="text-sm font-bold text-white drop-shadow">
                    {item.count}
                  </span>
                )}
              </div>
            </div>
            <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
              <div className="absolute inset-0 rounded-lg ring-2 ring-blue-400 ring-opacity-50"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function adjustColorBrightness(color: string, percent: number): string {
  const num = parseInt(color.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);
  const R = (num >> 16) + amt;
  const G = ((num >> 8) & 0x00ff) + amt;
  const B = (num & 0x0000ff) + amt;
  return `#${(
    0x1000000 +
    (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
    (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
    (B < 255 ? (B < 1 ? 0 : B) : 255)
  )
    .toString(16)
    .slice(1)}`;
}
