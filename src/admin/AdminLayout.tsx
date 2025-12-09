import { ReactNode } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useAdminLang } from './AdminLanguageContext';
import { LayoutDashboard, Package, LogOut, Home, Menu, X, Globe, CalendarDays } from 'lucide-react';
import { useState } from 'react';

interface AdminLayoutProps {
  children: ReactNode;
  currentPath: string;
}

export function AdminLayout({ children, currentPath }: AdminLayoutProps) {
  const { user, userRole, signOut } = useAuth();
  const { lang, setLang, t } = useAdminLang();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    window.history.pushState({}, '', '/admin/login');
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  const navigate = (path: string) => {
    window.history.pushState({}, '', path);
    window.dispatchEvent(new PopStateEvent('popstate'));
    setSidebarOpen(false);
  };

  const isActive = (path: string) => {
    if (path === '/admin/products') {
      return currentPath.startsWith('/admin/products');
    }
    if (path === '/admin/bookings') {
      return currentPath.startsWith('/admin/bookings');
    }
    return currentPath === path;
  };

  const navItems = [
    { path: '/admin/products', label: t.products, icon: Package },
    { path: '/admin/bookings', label: t.bookings, icon: CalendarDays },
    { path: '/admin/dashboard', label: t.dashboard, icon: LayoutDashboard },
  ];

  const toggleLang = () => {
    setLang(lang === 'en' ? 'ru' : 'en');
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <button
        onClick={() => setSidebarOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md hover:bg-slate-50 transition-colors"
      >
        <Menu className="w-6 h-6 text-slate-700" />
      </button>

      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-slate-900 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-slate-800">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-bold text-white">{t.adminPanel}</h1>
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden p-1 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-sm text-slate-500 mt-1 truncate">{user?.email}</p>
            {userRole && (
              <div className="mt-2">
                <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
                  userRole === 'admin'
                    ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                    : 'bg-slate-700 text-slate-300 border border-slate-600'
                }`}>
                  {userRole === 'admin' ? t.adminRole || 'Admin' : t.userRole || 'User'}
                </span>
              </div>
            )}
          </div>

          <nav className="flex-1 p-4 space-y-1">
            {navItems.map((item) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  isActive(item.path)
                    ? 'bg-blue-500/20 text-blue-400'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </nav>

          <div className="p-4 border-t border-slate-800 space-y-2">
            <button
              onClick={toggleLang}
              className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-slate-800 hover:text-white rounded-lg transition-all"
            >
              <Globe className="w-5 h-5" />
              <span className="font-medium">{lang === 'en' ? 'Русский' : 'English'}</span>
            </button>
            <a
              href="/"
              className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-slate-800 hover:text-white rounded-lg transition-all"
            >
              <Home className="w-5 h-5" />
              <span className="font-medium">{t.backToWebsite}</span>
            </a>
            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">{t.signOut}</span>
            </button>
          </div>
        </div>
      </aside>

      <main className="lg:ml-64 min-h-screen">
        <div className="p-4 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
