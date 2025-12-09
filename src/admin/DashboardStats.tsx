import { useEffect, useState } from 'react';
import { Calendar, MessageSquare, TrendingUp } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAdminLang } from './AdminLanguageContext';

interface BookingStats {
  allTime: number;
  thisMonth: number;
  thisWeek: number;
  weeklyData: { week: string; count: number }[];
  monthlyData: { month: string; count: number }[];
}

interface MessageStats {
  allTime: number;
  thisMonth: number;
  thisWeek: number;
  today: number;
  dailyData: { day: string; count: number }[];
  weeklyData: { week: string; count: number }[];
  monthlyData: { month: string; count: number }[];
}

export function DashboardStats() {
  const { t } = useAdminLang();
  const [bookingStats, setBookingStats] = useState<BookingStats>({
    allTime: 0,
    thisMonth: 0,
    thisWeek: 0,
    weeklyData: [],
    monthlyData: [],
  });
  const [messageStats, setMessageStats] = useState<MessageStats>({
    allTime: 0,
    thisMonth: 0,
    thisWeek: 0,
    today: 0,
    dailyData: [],
    weeklyData: [],
    monthlyData: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  async function fetchStats() {
    try {
      const now = new Date();
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - now.getDay());
      startOfWeek.setHours(0, 0, 0, 0);

      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const startOfToday = new Date(now);
      startOfToday.setHours(0, 0, 0, 0);

      const { data: bookings } = await supabase
        .from('bookings')
        .select('created_at, tour_date')
        .order('created_at', { ascending: true });

      const { data: messages } = await supabase
        .from('contact_messages')
        .select('created_at')
        .order('created_at', { ascending: true });

      if (bookings) {
        const thisWeekBookings = bookings.filter(
          (b) => new Date(b.created_at) >= startOfWeek
        ).length;
        const thisMonthBookings = bookings.filter(
          (b) => new Date(b.created_at) >= startOfMonth
        ).length;

        const weeklyData = calculateWeeklyData(bookings);
        const monthlyData = calculateMonthlyData(bookings);

        setBookingStats({
          allTime: bookings.length,
          thisMonth: thisMonthBookings,
          thisWeek: thisWeekBookings,
          weeklyData,
          monthlyData,
        });
      }

      if (messages) {
        const todayMessages = messages.filter(
          (m) => new Date(m.created_at) >= startOfToday
        ).length;
        const thisWeekMessages = messages.filter(
          (m) => new Date(m.created_at) >= startOfWeek
        ).length;
        const thisMonthMessages = messages.filter(
          (m) => new Date(m.created_at) >= startOfMonth
        ).length;

        const dailyData = calculateDailyData(messages);
        const weeklyData = calculateWeeklyData(messages);
        const monthlyData = calculateMonthlyData(messages);

        setMessageStats({
          allTime: messages.length,
          thisMonth: thisMonthMessages,
          thisWeek: thisWeekMessages,
          today: todayMessages,
          dailyData,
          weeklyData,
          monthlyData,
        });
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  }

  function calculateDailyData(data: any[]) {
    const last7Days = [];
    const now = new Date();

    for (let i = 6; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);

      const nextDate = new Date(date);
      nextDate.setDate(date.getDate() + 1);

      const count = data.filter((item) => {
        const itemDate = new Date(item.created_at);
        return itemDate >= date && itemDate < nextDate;
      }).length;

      last7Days.push({
        day: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        count,
      });
    }

    return last7Days;
  }

  function calculateWeeklyData(data: any[]) {
    const last8Weeks = [];
    const now = new Date();

    for (let i = 7; i >= 0; i--) {
      const weekStart = new Date(now);
      weekStart.setDate(now.getDate() - now.getDay() - (i * 7));
      weekStart.setHours(0, 0, 0, 0);

      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 7);

      const count = data.filter((item) => {
        const itemDate = new Date(item.created_at);
        return itemDate >= weekStart && itemDate < weekEnd;
      }).length;

      last8Weeks.push({
        week: weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        count,
      });
    }

    return last8Weeks;
  }

  function calculateMonthlyData(data: any[]) {
    const last6Months = [];
    const now = new Date();

    for (let i = 5; i >= 0; i--) {
      const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const nextMonth = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);

      const count = data.filter((item) => {
        const itemDate = new Date(item.created_at);
        return itemDate >= monthDate && itemDate < nextMonth;
      }).length;

      last6Months.push({
        month: monthDate.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
        count,
      });
    }

    return last6Months;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const maxWeeklyBookings = Math.max(...bookingStats.weeklyData.map((d) => d.count), 1);
  const maxMonthlyBookings = Math.max(...bookingStats.monthlyData.map((d) => d.count), 1);
  const maxDailyMessages = Math.max(...messageStats.dailyData.map((d) => d.count), 1);
  const maxWeeklyMessages = Math.max(...messageStats.weeklyData.map((d) => d.count), 1);
  const maxMonthlyMessages = Math.max(...messageStats.monthlyData.map((d) => d.count), 1);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Calendar className="w-5 h-5 text-blue-600" />
          </div>
          <h2 className="text-xl font-semibold text-slate-900">{t.bookingStatistics}</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
            <p className="text-sm text-blue-700 font-medium mb-1">{t.allTime}</p>
            <p className="text-3xl font-bold text-blue-900">{bookingStats.allTime}</p>
          </div>
          <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-lg p-4 border border-emerald-200">
            <p className="text-sm text-emerald-700 font-medium mb-1">{t.thisMonth}</p>
            <p className="text-3xl font-bold text-emerald-900">{bookingStats.thisMonth}</p>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
            <p className="text-sm text-purple-700 font-medium mb-1">{t.thisWeek}</p>
            <p className="text-3xl font-bold text-purple-900">{bookingStats.thisWeek}</p>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-semibold text-slate-700 mb-3">{t.bookingsPerWeek}</h3>
            <div className="space-y-2">
              {bookingStats.weeklyData.map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <span className="text-xs text-slate-600 w-16">{item.week}</span>
                  <div className="flex-1 bg-slate-100 rounded-full h-6 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-blue-600 h-full rounded-full flex items-center justify-end pr-2 transition-all duration-500"
                      style={{ width: `${(item.count / maxWeeklyBookings) * 100}%` }}
                    >
                      {item.count > 0 && (
                        <span className="text-xs font-medium text-white">{item.count}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-700 mb-3">{t.bookingsPerMonth}</h3>
            <div className="space-y-2">
              {bookingStats.monthlyData.map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <span className="text-xs text-slate-600 w-16">{item.month}</span>
                  <div className="flex-1 bg-slate-100 rounded-full h-6 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-emerald-500 to-emerald-600 h-full rounded-full flex items-center justify-end pr-2 transition-all duration-500"
                      style={{ width: `${(item.count / maxMonthlyBookings) * 100}%` }}
                    >
                      {item.count > 0 && (
                        <span className="text-xs font-medium text-white">{item.count}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-orange-100 rounded-lg">
            <MessageSquare className="w-5 h-5 text-orange-600" />
          </div>
          <h2 className="text-xl font-semibold text-slate-900">{t.messageStatistics}</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4 border border-orange-200">
            <p className="text-sm text-orange-700 font-medium mb-1">{t.allTime}</p>
            <p className="text-3xl font-bold text-orange-900">{messageStats.allTime}</p>
          </div>
          <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-lg p-4 border border-pink-200">
            <p className="text-sm text-pink-700 font-medium mb-1">{t.thisMonth}</p>
            <p className="text-3xl font-bold text-pink-900">{messageStats.thisMonth}</p>
          </div>
          <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 rounded-lg p-4 border border-cyan-200">
            <p className="text-sm text-cyan-700 font-medium mb-1">{t.thisWeek}</p>
            <p className="text-3xl font-bold text-cyan-900">{messageStats.thisWeek}</p>
          </div>
          <div className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-lg p-4 border border-teal-200">
            <p className="text-sm text-teal-700 font-medium mb-1">{t.today}</p>
            <p className="text-3xl font-bold text-teal-900">{messageStats.today}</p>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-semibold text-slate-700 mb-3">{t.messagesPerDay}</h3>
            <div className="space-y-2">
              {messageStats.dailyData.map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <span className="text-xs text-slate-600 w-16">{item.day}</span>
                  <div className="flex-1 bg-slate-100 rounded-full h-6 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-orange-500 to-orange-600 h-full rounded-full flex items-center justify-end pr-2 transition-all duration-500"
                      style={{ width: `${(item.count / maxDailyMessages) * 100}%` }}
                    >
                      {item.count > 0 && (
                        <span className="text-xs font-medium text-white">{item.count}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-700 mb-3">{t.messagesPerWeek}</h3>
            <div className="space-y-2">
              {messageStats.weeklyData.map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <span className="text-xs text-slate-600 w-16">{item.week}</span>
                  <div className="flex-1 bg-slate-100 rounded-full h-6 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-pink-500 to-pink-600 h-full rounded-full flex items-center justify-end pr-2 transition-all duration-500"
                      style={{ width: `${(item.count / maxWeeklyMessages) * 100}%` }}
                    >
                      {item.count > 0 && (
                        <span className="text-xs font-medium text-white">{item.count}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-700 mb-3">{t.messagesPerMonth}</h3>
            <div className="space-y-2">
              {messageStats.monthlyData.map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <span className="text-xs text-slate-600 w-16">{item.month}</span>
                  <div className="flex-1 bg-slate-100 rounded-full h-6 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-cyan-500 to-cyan-600 h-full rounded-full flex items-center justify-end pr-2 transition-all duration-500"
                      style={{ width: `${(item.count / maxMonthlyMessages) * 100}%` }}
                    >
                      {item.count > 0 && (
                        <span className="text-xs font-medium text-white">{item.count}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
