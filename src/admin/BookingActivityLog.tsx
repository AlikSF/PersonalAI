import { useState, useEffect } from 'react';
import { History, FileText, Edit, MessageSquare } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAdminLang } from './AdminLanguageContext';

interface ActivityLog {
  id: string;
  user_email: string;
  action: string;
  details: any;
  created_at: string;
}

interface BookingActivityLogProps {
  bookingId: string;
}

export function BookingActivityLog({ bookingId }: BookingActivityLogProps) {
  const { t } = useAdminLang();
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActivities();
  }, [bookingId]);

  async function fetchActivities() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('booking_activity_log')
        .select('*')
        .eq('booking_id', bookingId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setActivities(data || []);
    } catch (error) {
      console.error('Error fetching activity log:', error);
    } finally {
      setLoading(false);
    }
  }

  function formatDate(dateString: string) {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  function getActionIcon(action: string) {
    switch (action) {
      case 'created':
        return <FileText className="w-4 h-4 text-emerald-600" />;
      case 'updated':
        return <Edit className="w-4 h-4 text-blue-600" />;
      case 'comment_added':
        return <MessageSquare className="w-4 h-4 text-purple-600" />;
      default:
        return <History className="w-4 h-4 text-slate-600" />;
    }
  }

  function getActionText(action: string) {
    switch (action) {
      case 'created':
        return t.bookingCreated;
      case 'updated':
        return t.bookingUpdated;
      case 'comment_added':
        return t.commentAdded;
      default:
        return action;
    }
  }

  function formatFieldName(field: string) {
    const fieldMap: Record<string, string> = {
      booking_status: t.bookingStatus,
      payment_status: t.paymentStatus,
      customer_name: `${t.customer} ${t.name}`,
      customer_email: t.email,
      customer_phone: t.phone,
      tour_date: t.tourDate,
      adults: t.adultsCount,
      children: t.childrenCount,
    };
    return fieldMap[field] || field;
  }

  function renderChangeDetails(details: any) {
    if (!details || typeof details !== 'object') return null;

    const changes = Object.entries(details).filter(
      ([key]) => key !== 'comment_preview'
    );

    if (changes.length === 0 && details.comment_preview) {
      return (
        <p className="text-xs text-slate-600 mt-1 italic">
          "{details.comment_preview}..."
        </p>
      );
    }

    return (
      <div className="mt-2 space-y-1">
        {changes.map(([field, change]: [string, any]) => {
          if (change && typeof change === 'object' && 'old' in change && 'new' in change) {
            return (
              <div key={field} className="text-xs">
                <span className="font-medium text-slate-700">
                  {formatFieldName(field)}:
                </span>{' '}
                <span className="text-red-600 line-through">{String(change.old)}</span>
                {' → '}
                <span className="text-emerald-600">{String(change.new)}</span>
              </div>
            );
          }
          return null;
        })}
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <History className="w-5 h-5 text-slate-600" />
        <h3 className="font-semibold text-slate-900">{t.activityLog}</h3>
        <span className="text-sm text-slate-500">({activities.length})</span>
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {activities.length === 0 ? (
          <p className="text-slate-500 text-center py-8">{t.noActivity}</p>
        ) : (
          activities.map((activity) => (
            <div
              key={activity.id}
              className="relative pl-8 pb-4 border-l-2 border-slate-200 last:border-l-0 last:pb-0"
            >
              <div className="absolute left-0 top-0 -translate-x-1/2 bg-white p-1 rounded-full border-2 border-slate-200">
                {getActionIcon(activity.action)}
              </div>
              <div>
                <div className="flex items-start justify-between mb-1">
                  <div>
                    <p className="text-sm font-medium text-slate-900">
                      {getActionText(activity.action)}
                    </p>
                    <p className="text-xs text-slate-500">
                      {activity.user_email} · {formatDate(activity.created_at)}
                    </p>
                  </div>
                </div>
                {renderChangeDetails(activity.details)}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
