import { useState, useEffect } from 'react';
import { Users, Loader2, AlertCircle } from 'lucide-react';
import { useAdminLang } from './AdminLanguageContext';
import { useAuth } from '../contexts/AuthContext';

interface User {
  id: string;
  email: string;
  role: 'admin' | 'user';
  created_at: string;
}

export function UserManagement() {
  const { t } = useAdminLang();
  const { session } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [assigningId, setAssigningId] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/auth.users?select=id,email,raw_app_meta_data,created_at`,
        {
          headers: {
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
            'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }

      const data = await response.json();
      const formattedUsers: User[] = data.map((u: any) => ({
        id: u.id,
        email: u.email,
        role: u.raw_app_meta_data?.role || 'user',
        created_at: u.created_at,
      }));

      setUsers(formattedUsers);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load users');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const assignRole = async (userId: string, newRole: 'admin' | 'user') => {
    if (!session) return;

    try {
      setAssigningId(userId);
      setError(null);
      setSuccessMessage(null);

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/manage-user-role`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId,
            role: newRole,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to assign role');
      }

      setUsers(users.map(u =>
        u.id === userId ? { ...u, role: newRole } : u
      ));

      setSuccessMessage(t.roleAssigned);
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : t.roleAssignmentFailed);
    } finally {
      setAssigningId(null);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">{t.manageUsers}</h1>
        <p className="text-slate-600 mt-1">{t.manageUserRoles}</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {successMessage && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-green-800">
          {successMessage}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center p-8">
            <Loader2 className="w-6 h-6 text-slate-400 animate-spin" />
          </div>
        ) : users.length === 0 ? (
          <div className="text-center p-8">
            <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-600">{t.noUsers}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">
                    {t.email}
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">
                    {t.role}
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">
                    {t.created}
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">
                    {t.actions}
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b border-slate-200 hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-slate-900">{user.email}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                        user.role === 'admin'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-slate-100 text-slate-800'
                      }`}>
                        {user.role === 'admin' ? t.admin : t.user}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm space-x-2 flex items-center">
                      {user.role !== 'admin' && (
                        <button
                          onClick={() => assignRole(user.id, 'admin')}
                          disabled={assigningId === user.id}
                          className="px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 transition-colors disabled:bg-slate-300 disabled:cursor-not-allowed flex items-center gap-1"
                        >
                          {assigningId === user.id && <Loader2 className="w-3 h-3 animate-spin" />}
                          {assigningId === user.id ? t.assigning : t.admin}
                        </button>
                      )}
                      {user.role === 'admin' && (
                        <button
                          onClick={() => assignRole(user.id, 'user')}
                          disabled={assigningId === user.id}
                          className="px-3 py-1 bg-slate-500 text-white text-xs rounded hover:bg-slate-600 transition-colors disabled:bg-slate-300 disabled:cursor-not-allowed flex items-center gap-1"
                        >
                          {assigningId === user.id && <Loader2 className="w-3 h-3 animate-spin" />}
                          {assigningId === user.id ? t.assigning : t.user}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
