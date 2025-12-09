import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAdminLang } from './AdminLanguageContext';
import { BookingEditModal } from './BookingEditModal';

interface Booking {
  id: string;
  customer_name: string;
  customer_email: string;
  tour_date: string;
  booking_status: string;
  payment_status: string;
  product: {
    name: string;
    name_en?: string;
  };
}

export function CalendarView() {
  const { t, lang } = useAdminLang();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, [currentDate]);

  async function fetchBookings() {
    try {
      setLoading(true);
      const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

      const { data, error } = await supabase
        .from('bookings')
        .select('*, product:products(name, name_en)')
        .gte('tour_date', firstDay.toISOString().split('T')[0])
        .lte('tour_date', lastDay.toISOString().split('T')[0])
        .order('tour_date', { ascending: true });

      if (error) throw error;
      setBookings(data || []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  }

  function getDaysInMonth(date: Date) {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek, year, month };
  }

  function getBookingsForDate(date: Date) {
    const dateStr = date.toISOString().split('T')[0];
    return bookings.filter((booking) => booking.tour_date === dateStr);
  }

  function previousMonth() {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    setSelectedDate(null);
  }

  function nextMonth() {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    setSelectedDate(null);
  }

  function goToToday() {
    setCurrentDate(new Date());
    setSelectedDate(new Date());
  }

  const { daysInMonth, startingDayOfWeek, year, month } = getDaysInMonth(currentDate);
  const days = [];

  for (let i = 0; i < startingDayOfWeek; i++) {
    days.push(null);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    days.push(day);
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const selectedBookings = selectedDate ? getBookingsForDate(selectedDate) : [];

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const monthNamesRu = [
    'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
    'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
  ];

  const monthName = lang === 'ru' ? monthNamesRu[month] : monthNames[month];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <CalendarIcon className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-900">{t.scheduleCalendar}</h2>
              <p className="text-sm text-slate-600">{t.viewSchedule}</p>
            </div>
          </div>
          <button
            onClick={goToToday}
            className="px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            {t.today}
          </button>
        </div>

        <div className="flex items-center justify-between mb-6">
          <button
            onClick={previousMonth}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            aria-label={t.previousMonth}
          >
            <ChevronLeft className="w-5 h-5 text-slate-600" />
          </button>
          <h3 className="text-lg font-semibold text-slate-900">
            {monthName} {year}
          </h3>
          <button
            onClick={nextMonth}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            aria-label={t.nextMonth}
          >
            <ChevronRight className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-7 gap-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => {
              const dayNamesRu = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
              return (
                <div
                  key={day}
                  className="text-center text-xs font-semibold text-slate-600 py-2"
                >
                  {lang === 'ru' ? dayNamesRu[index] : day}
                </div>
              );
            })}

            {days.map((day, index) => {
              if (day === null) {
                return <div key={`empty-${index}`} className="h-16" />;
              }

              const date = new Date(year, month, day);
              date.setHours(0, 0, 0, 0);
              const isToday = date.getTime() === today.getTime();
              const dayBookings = getBookingsForDate(date);
              const isSelected = selectedDate?.getTime() === date.getTime();

              return (
                <button
                  key={day}
                  onClick={() => setSelectedDate(date)}
                  className={`h-16 p-1 rounded-lg border transition-all ${
                    isSelected
                      ? 'bg-blue-100 border-blue-300 shadow-sm'
                      : isToday
                      ? 'bg-blue-50 border-blue-200'
                      : dayBookings.length > 0
                      ? 'bg-emerald-50 border-emerald-200 hover:bg-emerald-100'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex flex-col items-center justify-center h-full">
                    <span
                      className={`text-sm font-medium ${
                        isSelected
                          ? 'text-blue-900'
                          : isToday
                          ? 'text-blue-700'
                          : 'text-slate-700'
                      }`}
                    >
                      {day}
                    </span>
                    {dayBookings.length > 0 && (
                      <span className="text-xs font-semibold text-emerald-600 mt-0.5">
                        {dayBookings.length}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {selectedDate && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">
            {t.bookingsFor} {selectedDate.toLocaleDateString(lang === 'ru' ? 'ru-RU' : 'en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </h3>

          {selectedBookings.length === 0 ? (
            <p className="text-slate-500 text-center py-8">{t.noBookingsForDate}</p>
          ) : (
            <div className="space-y-3">
              {selectedBookings.map((booking) => (
                <div
                  key={booking.id}
                  onDoubleClick={() => {
                    setSelectedBookingId(booking.id);
                    setShowEditModal(true);
                  }}
                  className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200 hover:border-slate-300 transition-colors cursor-pointer"
                  title={lang === 'ru' ? 'Дважды щелкните для редактирования' : 'Double-click to edit'}
                >
                  <div className="flex-1">
                    <p className="font-medium text-slate-900">{booking.customer_name}</p>
                    <p className="text-sm text-slate-600">
                      {lang === 'en' && booking.product?.name_en
                        ? booking.product.name_en
                        : booking.product?.name}
                    </p>
                    <p className="text-xs text-slate-500">{booking.customer_email}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        booking.booking_status === 'confirmed'
                          ? 'bg-emerald-100 text-emerald-700'
                          : booking.booking_status === 'completed'
                          ? 'bg-blue-100 text-blue-700'
                          : booking.booking_status === 'cancelled'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-amber-100 text-amber-700'
                      }`}
                    >
                      {booking.booking_status}
                    </span>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        booking.payment_status === 'paid'
                          ? 'bg-emerald-100 text-emerald-700'
                          : booking.payment_status === 'failed'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {booking.payment_status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {showEditModal && selectedBookingId && (
        <BookingEditModal
          bookingId={selectedBookingId}
          onClose={() => {
            setShowEditModal(false);
            setSelectedBookingId(null);
          }}
          onSave={() => {
            fetchBookings();
            setShowEditModal(false);
            setSelectedBookingId(null);
          }}
        />
      )}
    </div>
  );
}
