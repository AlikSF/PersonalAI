import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

export interface DailyData {
  date: string;
  count: number;
}

export interface MonthlyData {
  month: string;
  count: number;
}

export interface BookingStats {
  allTime: number;
  thisMonth: number;
  thisWeek: number;
  today: number;
  dailyData: DailyData[];
  monthlyData: MonthlyData[];
  byStatus: {
    confirmed: number;
    pending: number;
    cancelled: number;
  };
}

export interface MessageStats {
  allTime: number;
  thisMonth: number;
  thisWeek: number;
  today: number;
  dailyData: DailyData[];
}

export function useDashboardData() {
  const [bookingStats, setBookingStats] = useState<BookingStats>({
    allTime: 0,
    thisMonth: 0,
    thisWeek: 0,
    today: 0,
    dailyData: [],
    monthlyData: [],
    byStatus: { confirmed: 0, pending: 0, cancelled: 0 },
  });
  const [messageStats, setMessageStats] = useState<MessageStats>({
    allTime: 0,
    thisMonth: 0,
    thisWeek: 0,
    today: 0,
    dailyData: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStats();
  }, []);

  async function fetchStats() {
    try {
      setLoading(true);
      setError(null);

      const now = new Date();
      const startOfToday = new Date(now);
      startOfToday.setHours(0, 0, 0, 0);

      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - now.getDay());
      startOfWeek.setHours(0, 0, 0, 0);

      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

      const { data: bookings, error: bookingsError } = await supabase
        .from('bookings')
        .select('created_at, booking_status')
        .order('created_at', { ascending: true });

      if (bookingsError) throw bookingsError;

      const { data: messages, error: messagesError } = await supabase
        .from('contact_messages')
        .select('created_at')
        .order('created_at', { ascending: true });

      if (messagesError) throw messagesError;

      if (bookings) {
        const todayBookings = bookings.filter(
          (b) => new Date(b.created_at) >= startOfToday
        ).length;
        const thisWeekBookings = bookings.filter(
          (b) => new Date(b.created_at) >= startOfWeek
        ).length;
        const thisMonthBookings = bookings.filter(
          (b) => new Date(b.created_at) >= startOfMonth
        ).length;

        const byStatus = bookings.reduce(
          (acc, booking) => {
            const status = booking.booking_status?.toLowerCase() || 'pending';
            if (status === 'confirmed') acc.confirmed++;
            else if (status === 'cancelled') acc.cancelled++;
            else acc.pending++;
            return acc;
          },
          { confirmed: 0, pending: 0, cancelled: 0 }
        );

        const dailyData = calculateDailyData(bookings, 30);
        const monthlyData = calculateMonthlyData(bookings, 12);

        setBookingStats({
          allTime: bookings.length,
          thisMonth: thisMonthBookings,
          thisWeek: thisWeekBookings,
          today: todayBookings,
          dailyData,
          monthlyData,
          byStatus,
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

        const dailyData = calculateDailyData(messages, 30);

        setMessageStats({
          allTime: messages.length,
          thisMonth: thisMonthMessages,
          thisWeek: thisWeekMessages,
          today: todayMessages,
          dailyData,
        });
      }
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
      setError(err instanceof Error ? err.message : 'Failed to load statistics');
    } finally {
      setLoading(false);
    }
  }

  function calculateDailyData(data: any[], days: number): DailyData[] {
    const result: DailyData[] = [];
    const now = new Date();

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(now.getDate() - i);
      date.setHours(0, 0, 0, 0);

      const nextDay = new Date(date);
      nextDay.setDate(date.getDate() + 1);

      const count = data.filter((item) => {
        const itemDate = new Date(item.created_at);
        return itemDate >= date && itemDate < nextDay;
      }).length;

      result.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        count,
      });
    }

    return result;
  }

  function calculateMonthlyData(data: any[], months: number): MonthlyData[] {
    const result: MonthlyData[] = [];
    const now = new Date();

    for (let i = months - 1; i >= 0; i--) {
      const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const nextMonth = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);

      const count = data.filter((item) => {
        const itemDate = new Date(item.created_at);
        return itemDate >= monthDate && itemDate < nextMonth;
      }).length;

      result.push({
        month: monthDate.toLocaleDateString('en-US', {
          month: 'short',
          year: i > 6 ? '2-digit' : undefined
        }),
        count,
      });
    }

    return result;
  }

  return { bookingStats, messageStats, loading, error, refetch: fetchStats };
}
