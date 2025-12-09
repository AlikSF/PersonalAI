import { TrendingUp, Shield, Eye } from 'lucide-react';
import { useAdminLang } from './AdminLanguageContext';
import { useAuth } from '../contexts/AuthContext';

export function AdminDashboard() {
  const { t } = useAdminLang();
  const { userRole, isAdmin } = useAuth();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">{t.dashboard}</h1>
        <p className="text-slate-600 mt-1">{t.welcomeToDashboard}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                {t.yourRole || 'Your Role'}
              </h3>
              <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
                isAdmin
                  ? 'bg-blue-100 text-blue-700 border border-blue-200'
                  : 'bg-slate-100 text-slate-700 border border-slate-200'
              }`}>
                {userRole === 'admin' ? t.adminRole || 'Admin' : t.userRole || 'User'}
              </span>
            </div>
          </div>
          <div className="space-y-2 text-sm text-slate-600">
            <p className="font-medium text-slate-900">{t.permissions || 'Permissions'}:</p>
            <ul className="space-y-1 ml-4">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                {t.viewProducts || 'View all products'}
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                {t.editProducts || 'Create and edit products'}
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                {t.viewBookings || 'View and manage bookings'}
              </li>
              {isAdmin ? (
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                  {t.deleteItems || 'Delete products and bookings'}
                </li>
              ) : (
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                  {t.cannotDelete || 'Cannot delete items (Admin only)'}
                </li>
              )}
            </ul>
          </div>
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
    </div>
  );
}
