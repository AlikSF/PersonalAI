import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAdminLang } from './AdminLanguageContext';
import { X, Loader2, Save } from 'lucide-react';

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  product_id: string | null;
  booking_id: string | null;
  message: string;
  telegram_sent: boolean;
  created_at: string;
}

interface MessageEditModalProps {
  message: ContactMessage;
  onClose: () => void;
  onUpdate: () => void;
}

export function MessageEditModal({ message, onClose, onUpdate }: MessageEditModalProps) {
  const { t } = useAdminLang();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: message.name || '',
    email: message.email || '',
    phone: message.phone || '',
    message: message.message || '',
    telegram_sent: message.telegram_sent || false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error: updateError } = await supabase
        .from('contact_messages')
        .update({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          message: formData.message,
          telegram_sent: formData.telegram_sent,
        })
        .eq('id', message.id);

      if (updateError) throw updateError;

      onUpdate();
    } catch (err) {
      console.error('Error updating message:', err);
      setError(err instanceof Error ? err.message : 'Failed to update message');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-slate-200 flex items-center justify-between">
          <h3 className="text-xl font-bold text-slate-900">{t.editMessage || 'Edit Message'}</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  {t.name}
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  {t.email}
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                {t.phone}
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                {t.message}
              </label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                rows={6}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg">
              <input
                type="checkbox"
                id="telegram_sent"
                checked={formData.telegram_sent}
                onChange={(e) => setFormData({ ...formData, telegram_sent: e.target.checked })}
                className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-2 focus:ring-blue-500"
              />
              <label htmlFor="telegram_sent" className="text-sm font-medium text-slate-700">
                {t.telegramSent || 'Telegram Sent'}
              </label>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 mt-6 pt-6 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors disabled:opacity-50"
            >
              {t.cancel}
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {t.saving || 'Saving...'}
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  {t.save || 'Save'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
