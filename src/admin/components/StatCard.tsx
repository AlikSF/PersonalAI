import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  gradient: string;
  textColor: string;
  iconBg: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export function StatCard({
  title,
  value,
  icon: Icon,
  gradient,
  textColor,
  iconBg,
  trend,
}: StatCardProps) {
  return (
    <div
      className={`relative overflow-hidden rounded-lg p-4 shadow-sm border transition-all duration-300 hover:shadow-md hover:scale-[1.02] ${gradient}`}
    >
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-2">
          <div className={`p-2 rounded-lg ${iconBg} shadow-sm`}>
            <Icon className={`w-5 h-5 ${textColor}`} />
          </div>
          {trend && (
            <div
              className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${
                trend.isPositive
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'bg-red-100 text-red-700'
              }`}
            >
              <span>{trend.isPositive ? '↑' : '↓'}</span>
              <span>{Math.abs(trend.value)}%</span>
            </div>
          )}
        </div>
        <div>
          <p className="text-sm font-medium text-slate-600 mb-1">{title}</p>
          <p className={`text-2xl font-bold ${textColor}`}>
            {value.toLocaleString()}
          </p>
        </div>
      </div>
      <div className="absolute top-0 right-0 w-32 h-32 transform translate-x-8 -translate-y-8 opacity-10">
        <Icon className="w-full h-full" />
      </div>
    </div>
  );
}
