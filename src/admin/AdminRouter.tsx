import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { AdminLanguageProvider } from './AdminLanguageContext';
import { AdminLogin } from './AdminLogin';
import { AdminLayout } from './AdminLayout';
import { AdminDashboard } from './AdminDashboard';
import { ProductsList } from './ProductsList';
import { ProductForm } from './ProductForm';
import { BookingsManagement } from './BookingsManagement';
import { CalendarView } from './CalendarView';
import { Loader2, ShieldAlert } from 'lucide-react';

export function AdminRouter() {
  const { user, loading, userRole, signOut } = useAuth();
  const [path, setPath] = useState(window.location.pathname);

  useEffect(() => {
    const handlePopState = () => setPath(window.location.pathname);
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <AdminLanguageProvider>
        <AdminLogin />
      </AdminLanguageProvider>
    );
  }

  const hasAccess = userRole === 'admin' || userRole === 'user';

  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-500/20 mb-4">
            <ShieldAlert className="w-8 h-8 text-red-400" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Access Denied</h1>
          <p className="text-slate-400 mb-6">
            You don't have permission to access the admin panel. This area is restricted to administrators only.
          </p>
          <div className="space-y-3">
            <button
              onClick={signOut}
              className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
            >
              Sign Out
            </button>
            <a
              href="/"
              className="block w-full px-6 py-3 border border-white/20 text-white rounded-lg hover:bg-white/5 transition font-medium"
            >
              Back to Website
            </a>
          </div>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    if (path === '/admin/dashboard') {
      return <AdminDashboard />;
    }

    if (path === '/admin/calendar') {
      return <CalendarView />;
    }

    if (path === '/admin/bookings') {
      return <BookingsManagement />;
    }

    if (path === '/admin/products/new') {
      return <ProductForm />;
    }

    const editMatch = path.match(/^\/admin\/products\/([a-f0-9-]+)$/i);
    if (editMatch) {
      return <ProductForm productId={editMatch[1]} />;
    }

    if (path === '/admin/products' || path === '/admin') {
      return <ProductsList />;
    }

    return <ProductsList />;
  };

  return (
    <AdminLanguageProvider>
      <AdminLayout currentPath={path}>{renderContent()}</AdminLayout>
    </AdminLanguageProvider>
  );
}
