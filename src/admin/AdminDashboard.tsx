import { TrendingUp } from 'lucide-react';
import { useAdminLang } from './AdminLanguageContext';

export function AdminDashboard() {
  const { t } = useAdminLang();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">{t.dashboard}</h1>
        <p className="text-slate-600 mt-1">{t.welcomeToDashboard}</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 mb-4">
            <TrendingUp className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900">{t.comingSoon}</h3>
          <p className="text-slate-500 mt-2 max-w-md mx-auto">
            {t.dashboardDescription}
          </p>
        </div>
      </div>
    </div>
  );
}
