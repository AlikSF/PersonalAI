import { TrendingUp } from 'lucide-react';

export function AdminDashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-600 mt-1">Welcome to your admin dashboard</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 mb-4">
            <TrendingUp className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900">Coming Soon</h3>
          <p className="text-slate-500 mt-2 max-w-md mx-auto">
            This dashboard will be expanded with analytics, charts, and more management tools.
            For now, you can manage your products using the Products tab.
          </p>
        </div>
      </div>
    </div>
  );
}
