import { useState } from 'react';
import {
  Calendar,
  MessageSquare,
  TrendingUp,
  CheckCircle2,
  Clock,
  XCircle,
  BarChart3,
  Activity,
  AlertCircle,
} from 'lucide-react';
import { useAdminLang } from './AdminLanguageContext';
import { useDashboardData } from './hooks/useDashboardData';
import { StatCard } from './components/StatCard';
import { LineChart } from './components/LineChart';
import { BarChart } from './components/BarChart';

type BookingFilter = 'all' | 'confirmed' | 'pending' | 'cancelled';

export function DashboardStats() {
  const { t } = useAdminLang();
  const { bookingStats, messageStats, loading, error } = useDashboardData();
  const [bookingFilter, setBookingFilter] = useState<BookingFilter>('all');

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-slate-200"></div>
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent absolute top-0 left-0"></div>
        </div>
        <p className="mt-4 text-slate-600 font-medium">Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 flex items-start gap-4">
        <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
        <div>
          <h3 className="text-red-900 font-semibold mb-1">Error Loading Dashboard</h3>
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  const getFilteredBookingCount = () => {
    switch (bookingFilter) {
      case 'confirmed':
        return bookingStats.byStatus.confirmed;
      case 'pending':
        return bookingStats.byStatus.pending;
      case 'cancelled':
        return bookingStats.byStatus.cancelled;
      default:
        return bookingStats.allTime;
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-br from-blue-50 via-white to-cyan-50 rounded-2xl p-8 border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-blue-600 rounded-xl shadow-lg">
            <Calendar className="w-7 h-7 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900">{t.bookingStatistics}</h2>
            <p className="text-sm text-slate-600">Track your booking performance</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            title={t.allTime}
            value={bookingStats.allTime}
            icon={TrendingUp}
            gradient="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200"
            textColor="text-blue-700"
            iconBg="bg-white"
          />
          <StatCard
            title={t.thisMonth}
            value={bookingStats.thisMonth}
            icon={Calendar}
            gradient="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200"
            textColor="text-emerald-700"
            iconBg="bg-white"
          />
          <StatCard
            title={t.thisWeek}
            value={bookingStats.thisWeek}
            icon={Activity}
            gradient="bg-gradient-to-br from-cyan-50 to-cyan-100 border-cyan-200"
            textColor="text-cyan-700"
            iconBg="bg-white"
          />
          <StatCard
            title={t.today}
            value={bookingStats.today}
            icon={BarChart3}
            gradient="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200"
            textColor="text-orange-700"
            iconBg="bg-white"
          />
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-slate-900">Status Overview</h3>
            <div className="flex gap-2">
              <button
                onClick={() => setBookingFilter('all')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  bookingFilter === 'all'
                    ? 'bg-slate-900 text-white shadow-md'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setBookingFilter('confirmed')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  bookingFilter === 'confirmed'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                }`}
              >
                Confirmed
              </button>
              <button
                onClick={() => setBookingFilter('pending')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  bookingFilter === 'pending'
                    ? 'bg-amber-600 text-white shadow-md'
                    : 'bg-amber-50 text-amber-600 hover:bg-amber-100'
                }`}
              >
                Pending
              </button>
              <button
                onClick={() => setBookingFilter('cancelled')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  bookingFilter === 'cancelled'
                    ? 'bg-red-600 text-white shadow-md'
                    : 'bg-red-50 text-red-600 hover:bg-red-100'
                }`}
              >
                Cancelled
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-lg p-4 border border-emerald-200">
              <div className="flex items-center gap-3 mb-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span className="text-sm font-medium text-emerald-700">Confirmed</span>
              </div>
              <p className="text-3xl font-bold text-emerald-900">{bookingStats.byStatus.confirmed}</p>
            </div>
            <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg p-4 border border-amber-200">
              <div className="flex items-center gap-3 mb-2">
                <Clock className="w-5 h-5 text-amber-600" />
                <span className="text-sm font-medium text-amber-700">Pending</span>
              </div>
              <p className="text-3xl font-bold text-amber-900">{bookingStats.byStatus.pending}</p>
            </div>
            <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-4 border border-red-200">
              <div className="flex items-center gap-3 mb-2">
                <XCircle className="w-5 h-5 text-red-600" />
                <span className="text-sm font-medium text-red-700">Cancelled</span>
              </div>
              <p className="text-3xl font-bold text-red-900">{bookingStats.byStatus.cancelled}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">
              Daily Bookings (Last 30 Days)
            </h3>
            <LineChart data={bookingStats.dailyData} color="#3b82f6" />
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">
              Monthly Bookings (Last 12 Months)
            </h3>
            <div className="max-h-[400px] overflow-y-auto pr-2">
              <BarChart data={bookingStats.monthlyData} color="#10b981" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-orange-50 via-white to-pink-50 rounded-2xl p-8 border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-orange-600 rounded-xl shadow-lg">
            <MessageSquare className="w-7 h-7 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900">{t.messageStatistics}</h2>
            <p className="text-sm text-slate-600">Monitor customer inquiries</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard
            title={t.allTime}
            value={messageStats.allTime}
            icon={MessageSquare}
            gradient="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200"
            textColor="text-orange-700"
            iconBg="bg-white"
          />
          <StatCard
            title={t.thisMonth}
            value={messageStats.thisMonth}
            icon={TrendingUp}
            gradient="bg-gradient-to-br from-pink-50 to-pink-100 border-pink-200"
            textColor="text-pink-700"
            iconBg="bg-white"
          />
          <StatCard
            title={t.thisWeek}
            value={messageStats.thisWeek}
            icon={Activity}
            gradient="bg-gradient-to-br from-fuchsia-50 to-fuchsia-100 border-fuchsia-200"
            textColor="text-fuchsia-700"
            iconBg="bg-white"
          />
          <StatCard
            title={t.today}
            value={messageStats.today}
            icon={BarChart3}
            gradient="bg-gradient-to-br from-rose-50 to-rose-100 border-rose-200"
            textColor="text-rose-700"
            iconBg="bg-white"
          />
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">
            Daily Messages (Last 30 Days)
          </h3>
          <LineChart data={messageStats.dailyData} color="#f97316" />
        </div>
      </div>
    </div>
  );
}
