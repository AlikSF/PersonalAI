import { Shield, Eye } from 'lucide-react';
import { useAdminLang } from './AdminLanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { DashboardStats } from './DashboardStats';

export function AdminDashboard() {
  const { t } = useAdminLang();
  const { userRole, isAdmin } = useAuth();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">{t.dashboard}</h1>
        <p className="text-slate-600 mt-1">{t.welcomeToDashboard}</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          {isAdmin ? (
            <div className="p-3 bg-blue-100 rounded-full">
              <Shield className="w-6 h-6 text-blue-600" />
            </div>
          ) : (
            <div className="p-3 bg-slate-100 rounded-full">
              <Eye className="w-6 h-6 text-slate-600" />
            </div>
          )}
          <div>
            <h3 className="text-lg font-semibold text-slate-900">
              {t.yourRole}
            </h3>
            <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
              isAdmin
                ? 'bg-blue-100 text-blue-700 border border-blue-200'
                : 'bg-slate-100 text-slate-700 border border-slate-200'
            }`}>
              {userRole === 'admin' ? t.adminRole : t.userRole}
            </span>
          </div>
        </div>
        <div className="space-y-2 text-sm text-slate-600">
          <p className="font-medium text-slate-900">{t.permissions}:</p>
          <ul className="space-y-1 ml-4">
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
              {t.viewProducts}
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
              {t.editProducts}
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
              {t.viewBookings}
            </li>
            {isAdmin ? (
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                {t.deleteItems}
              </li>
            ) : (
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                {t.cannotDelete}
              </li>
            )}
          </ul>
        </div>
      </div>

      <DashboardStats />
    </div>
  );
}
