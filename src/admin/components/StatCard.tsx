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
      className={`relative overflow-hidden rounded-lg p-2.5 shadow-sm border transition-all duration-300 hover:shadow-md hover:scale-[1.02] ${gradient}`}
    >
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-1.5">
          <div className={`p-1.5 rounded ${iconBg} shadow-sm`}>
            <Icon className={`w-3.5 h-3.5 ${textColor}`} />
          </div>
          {trend && (
            <div
              className={`flex items-center gap-0.5 text-xs font-semibold px-1.5 py-0.5 rounded-full ${
                trend.isPositive
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'bg-red-100 text-red-700'
              }`}
            >
              <span>{trend.isPositive ? '↑' : '↓'}</span>
              <span className="text-xs">{Math.abs(trend.value)}%</span>
            </div>
          )}
        </div>
        <div>
          <p className="text-xs font-medium text-slate-600 mb-0.5">{title}</p>
          <p className={`text-xl font-bold ${textColor}`}>
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
