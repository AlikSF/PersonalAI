import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Eye, Edit, X, User, MessageSquare, History, CheckCircle, Clock, XCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAdminLang } from './AdminLanguageContext';
import { BookingEditModal } from './BookingEditModal';
import { BookingComments } from './BookingComments';
import { BookingActivityLog } from './BookingActivityLog';

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

interface FullBooking {
  id: string;
  product_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  country_code: string | null;
  dial_code: string | null;
  tour_date: string | null;
  adults: number;
  children: number;
  total_price: number;
  booking_status: string;
  payment_status: string;
  platform?: string | null;
  special_requests?: string | null;
  created_at: string;
  product?: { name: string };
}

type BookingDetailsTab = 'details' | 'comments' | 'activity';

export function CalendarView() {
  const { t, lang } = useAdminLang();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedBooking, setSelectedBooking] = useState<FullBooking | null>(null);
  const [editingBooking, setEditingBooking] = useState<FullBooking | null>(null);
  const [bookingDetailsTab, setBookingDetailsTab] = useState<BookingDetailsTab>('details');

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

  async function fetchFullBooking(bookingId: string) {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('id, product_id, customer_name, customer_email, customer_phone, country_code, dial_code, tour_date, adults, children, total_price, booking_status, payment_status, platform, special_requests, created_at, product:products(name)')
        .eq('id', bookingId)
        .single();

      if (error) throw error;
      return data as FullBooking;
    } catch (error) {
      console.error('Error fetching booking:', error);
      return null;
    }
  }

  function formatDate(dateString: string | null) {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  }

  function formatDateTime(dateString: string) {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  function getPaymentStatusBadge(status: string) {
    const styles = {
      pending: 'bg-amber-100 text-amber-700 border-amber-200',
      paid: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      failed: 'bg-red-100 text-red-700 border-red-200',
    };
    const icons = {
      pending: <Clock className="w-3 h-3" />,
      paid: <CheckCircle className="w-3 h-3" />,
      failed: <XCircle className="w-3 h-3" />,
    };
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full border ${styles[status as keyof typeof styles]}`}>
        {icons[status as keyof typeof icons]}
        {status}
      </span>
    );
  }

  function getBookingStatusBadge(status: string) {
    const styles = {
      pending: 'bg-slate-100 text-slate-700 border-slate-200',
      confirmed: 'bg-blue-100 text-blue-700 border-blue-200',
      completed: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      cancelled: 'bg-slate-100 text-slate-600 border-slate-200',
    };
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full border ${styles[status as keyof typeof styles]}`}>
        {status}
      </span>
    );
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
                  className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200 hover:border-slate-300 transition-colors"
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
                  <div className="flex items-center gap-3">
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
                    <button
                      onClick={async () => {
                        const fullBooking = await fetchFullBooking(booking.id);
                        if (fullBooking) {
                          setSelectedBooking(fullBooking);
                          setBookingDetailsTab('details');
                        }
                      }}
                      className="p-2 hover:bg-blue-100 rounded-lg transition-colors group"
                      title={lang === 'ru' ? 'Просмотреть бронирование' : 'View booking'}
                    >
                      <Eye className="w-4 h-4 text-slate-600 group-hover:text-blue-600" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {selectedBooking && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-900">{t.bookingDetails}</h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setEditingBooking(selectedBooking);
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Edit className="w-4 h-4" />
                  {t.editBooking}
                </button>
                <button
                  onClick={() => {
                    setSelectedBooking(null);
                    setBookingDetailsTab('details');
                  }}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex border-b border-slate-200">
              <button
                onClick={() => setBookingDetailsTab('details')}
                className={`px-6 py-3 font-medium text-sm transition-colors relative ${
                  bookingDetailsTab === 'details'
                    ? 'text-blue-600'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span className="flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  {t.details}
                </span>
                {bookingDetailsTab === 'details' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
                )}
              </button>
              <button
                onClick={() => setBookingDetailsTab('comments')}
                className={`px-6 py-3 font-medium text-sm transition-colors relative ${
                  bookingDetailsTab === 'comments'
                    ? 'text-blue-600'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  {t.comments}
                </span>
                {bookingDetailsTab === 'comments' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
                )}
              </button>
              <button
                onClick={() => setBookingDetailsTab('activity')}
                className={`px-6 py-3 font-medium text-sm transition-colors relative ${
                  bookingDetailsTab === 'activity'
                    ? 'text-blue-600'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span className="flex items-center gap-2">
                  <History className="w-4 h-4" />
                  {t.activityLog}
                </span>
                {bookingDetailsTab === 'activity' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
                )}
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {bookingDetailsTab === 'details' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-semibold text-slate-900 flex items-center gap-2">
                        <User className="w-4 h-4" />
                        {t.customerInfo}
                      </h4>
                      <div className="space-y-2">
                        <p className="text-sm"><span className="text-slate-500">{t.name}:</span> <span className="font-medium">{selectedBooking.customer_name}</span></p>
                        <p className="text-sm"><span className="text-slate-500">{t.email}:</span> <span className="font-medium">{selectedBooking.customer_email}</span></p>
                        <p className="text-sm"><span className="text-slate-500">{t.phone}:</span> <span className="font-medium">{selectedBooking.dial_code || ''}{selectedBooking.customer_phone}</span></p>
                        {selectedBooking.country_code && (
                          <p className="text-sm"><span className="text-slate-500">{t.country}:</span> <span className="font-medium">{selectedBooking.country_code}</span></p>
                        )}
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h4 className="font-semibold text-slate-900 flex items-center gap-2">
                        <CalendarIcon className="w-4 h-4" />
                        {t.bookingInfo}
                      </h4>
                      <div className="space-y-2">
                        <p className="text-sm"><span className="text-slate-500">{t.product}:</span> <span className="font-medium">{selectedBooking.product?.name || '-'}</span></p>
                        <p className="text-sm"><span className="text-slate-500">{t.tourDate}:</span> <span className="font-medium">{formatDate(selectedBooking.tour_date)}</span></p>
                        <p className="text-sm"><span className="text-slate-500">{t.adultsCount}:</span> <span className="font-medium">{selectedBooking.adults || 0}</span></p>
                        <p className="text-sm"><span className="text-slate-500">{t.childrenCount}:</span> <span className="font-medium">{selectedBooking.children || 0}</span></p>
                        <p className="text-sm"><span className="text-slate-500">Platform:</span> <span className="font-medium">{selectedBooking.platform || 'telegram'}</span></p>
                        <p className="text-sm"><span className="text-slate-500">{t.price}:</span> <span className="font-medium">{selectedBooking.total_price?.toLocaleString()} THB</span></p>
                        <div className="space-y-2">
                          <p className="text-sm">
                            <span className="text-slate-500">{t.paymentStatus}:</span>{' '}
                            {getPaymentStatusBadge(selectedBooking.payment_status)}
                          </p>
                          <p className="text-sm">
                            <span className="text-slate-500">{t.bookingStatus}:</span>{' '}
                            {getBookingStatusBadge(selectedBooking.booking_status)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  {selectedBooking.special_requests && (
                    <div className="space-y-2">
                      <h4 className="font-semibold text-slate-900 flex items-center gap-2">
                        <MessageSquare className="w-4 h-4" />
                        {t.specialRequests}
                      </h4>
                      <p className="text-sm text-slate-700 bg-slate-50 p-4 rounded-lg">{selectedBooking.special_requests}</p>
                    </div>
                  )}
                  <div className="text-sm text-slate-500">
                    {t.created}: {formatDateTime(selectedBooking.created_at)}
                  </div>
                </div>
              )}

              {bookingDetailsTab === 'comments' && (
                <BookingComments bookingId={selectedBooking.id} />
              )}

              {bookingDetailsTab === 'activity' && (
                <BookingActivityLog bookingId={selectedBooking.id} />
              )}
            </div>
          </div>
        </div>
      )}

      {editingBooking && (
        <BookingEditModal
          booking={editingBooking}
          onClose={() => setEditingBooking(null)}
          onUpdate={() => {
            fetchBookings();
            setEditingBooking(null);
            if (selectedBooking) {
              setSelectedBooking({ ...editingBooking });
            }
          }}
        />
      )}
    </div>
  );
}
