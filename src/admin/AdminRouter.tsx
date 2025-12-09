import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { AdminLanguageProvider } from './AdminLanguageContext';
import { AdminLogin } from './AdminLogin';
import { AdminLayout } from './AdminLayout';
import { AdminDashboard } from './AdminDashboard';
import { ProductsList } from './ProductsList';
import { ProductForm } from './ProductForm';
import { Loader2 } from 'lucide-react';

export function AdminRouter() {
  const { user, loading } = useAuth();
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

  const renderContent = () => {
    if (path === '/admin/dashboard') {
      return <AdminDashboard />;
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
