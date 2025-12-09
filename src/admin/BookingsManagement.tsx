import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAdminLang } from './AdminLanguageContext';
import { CompanyInfoEditor } from './CompanyInfoEditor';
import { BookingEditModal } from './BookingEditModal';
import { BookingComments } from './BookingComments';
import { BookingActivityLog } from './BookingActivityLog';
import {
  Calendar,
  Mail,
  Phone,
  User,
  MessageSquare,
  Filter,
  X,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Eye,
  CheckCircle,
  Clock,
  XCircle,
  RefreshCw,
  Building2,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Edit,
  History,
} from 'lucide-react';

interface Booking {
  id: string;
  product_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  country_code: string | null;
  dial_code: string | null;
  start_date: string | null;
  end_date: string | null;
  tour_date: string | null;
  adults: number;
  children: number;
  total_price: number;
  payment_status: 'pending' | 'paid' | 'failed';
  booking_status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  special_requests: string | null;
  created_at: string;
  product?: { name: string };
}

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
  product?: { name: string };
}

type ActiveTab = 'bookings' | 'messages' | 'companyInfo';
type BookingSortField = 'customer_name' | 'total_price' | 'payment_status' | 'booking_status' | 'tour_date' | 'created_at';
type MessageSortField = 'name' | 'created_at';
type SortDirection = 'asc' | 'desc';
type BookingDetailsTab = 'details' | 'comments' | 'activity';

const ITEMS_PER_PAGE = 15;

export function BookingsManagement() {
  const { t } = useAdminLang();
  const [activeTab, setActiveTab] = useState<ActiveTab>('bookings');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookingsPage, setBookingsPage] = useState(1);
  const [messagesPage, setMessagesPage] = useState(1);
  const [bookingsTotal, setBookingsTotal] = useState(0);
  const [messagesTotal, setMessagesTotal] = useState(0);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);
  const [bookingDetailsTab, setBookingDetailsTab] = useState<BookingDetailsTab>('details');
  const [bookingSortField, setBookingSortField] = useState<BookingSortField>('created_at');
  const [bookingSortDirection, setBookingSortDirection] = useState<SortDirection>('desc');
  const [messageSortField, setMessageSortField] = useState<MessageSortField>('created_at');
  const [messageSortDirection, setMessageSortDirection] = useState<SortDirection>('desc');

  const [bookingFilters, setBookingFilters] = useState({
    dateFrom: '',
    dateTo: '',
    paymentStatus: '',
    bookingStatus: '',
    search: '',
  });

  const [messageFilters, setMessageFilters] = useState({
    dateFrom: '',
    dateTo: '',
    telegramSent: '',
    search: '',
  });

  const [showBookingFilters, setShowBookingFilters] = useState(false);
  const [showMessageFilters, setShowMessageFilters] = useState(false);

  useEffect(() => {
    if (activeTab === 'bookings') {
      fetchBookings();
    } else {
      fetchMessages();
    }
  }, [activeTab, bookingsPage, messagesPage, bookingFilters, messageFilters, bookingSortField, bookingSortDirection, messageSortField, messageSortDirection]);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('bookings')
        .select('*, product:products(name)', { count: 'exact' })
        .order(bookingSortField, { ascending: bookingSortDirection === 'asc' });

      if (bookingFilters.dateFrom) {
        query = query.gte('created_at', bookingFilters.dateFrom);
      }
      if (bookingFilters.dateTo) {
        query = query.lte('created_at', bookingFilters.dateTo + 'T23:59:59');
      }
      if (bookingFilters.paymentStatus) {
        query = query.eq('payment_status', bookingFilters.paymentStatus);
      }
      if (bookingFilters.bookingStatus) {
        query = query.eq('booking_status', bookingFilters.bookingStatus);
      }
      if (bookingFilters.search) {
        query = query.or(
          `customer_name.ilike.%${bookingFilters.search}%,customer_email.ilike.%${bookingFilters.search}%,customer_phone.ilike.%${bookingFilters.search}%`
        );
      }

      const from = (bookingsPage - 1) * ITEMS_PER_PAGE;
      const to = from + ITEMS_PER_PAGE - 1;
      query = query.range(from, to);

      const { data, error, count } = await query;

      if (error) throw error;
      setBookings(data || []);
      setBookingsTotal(count || 0);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('contact_messages')
        .select('*, product:products(name)', { count: 'exact' })
        .order(messageSortField, { ascending: messageSortDirection === 'asc' });

      if (messageFilters.dateFrom) {
        query = query.gte('created_at', messageFilters.dateFrom);
      }
      if (messageFilters.dateTo) {
        query = query.lte('created_at', messageFilters.dateTo + 'T23:59:59');
      }
      if (messageFilters.telegramSent !== '') {
        query = query.eq('telegram_sent', messageFilters.telegramSent === 'true');
      }
      if (messageFilters.search) {
        query = query.or(
          `name.ilike.%${messageFilters.search}%,email.ilike.%${messageFilters.search}%,phone.ilike.%${messageFilters.search}%,message.ilike.%${messageFilters.search}%`
        );
      }

      const from = (messagesPage - 1) * ITEMS_PER_PAGE;
      const to = from + ITEMS_PER_PAGE - 1;
      query = query.range(from, to);

      const { data, error, count } = await query;

      if (error) throw error;
      setMessages(data || []);
      setMessagesTotal(count || 0);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getPaymentStatusBadge = (status: string) => {
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
  };

  const getBookingStatusBadge = (status: string) => {
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
  };

  const clearBookingFilters = () => {
    setBookingFilters({
      dateFrom: '',
      dateTo: '',
      paymentStatus: '',
      bookingStatus: '',
      search: '',
    });
    setBookingsPage(1);
  };

  const clearMessageFilters = () => {
    setMessageFilters({
      dateFrom: '',
      dateTo: '',
      telegramSent: '',
      search: '',
    });
    setMessagesPage(1);
  };

  const hasActiveBookingFilters = Object.values(bookingFilters).some((v) => v !== '');
  const hasActiveMessageFilters = Object.values(messageFilters).some((v) => v !== '');

  const totalBookingPages = Math.ceil(bookingsTotal / ITEMS_PER_PAGE);
  const totalMessagePages = Math.ceil(messagesTotal / ITEMS_PER_PAGE);

  const handleBookingSort = (field: BookingSortField) => {
    if (bookingSortField === field) {
      setBookingSortDirection(bookingSortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setBookingSortField(field);
      setBookingSortDirection('asc');
    }
  };

  const handleMessageSort = (field: MessageSortField) => {
    if (messageSortField === field) {
      setMessageSortDirection(messageSortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setMessageSortField(field);
      setMessageSortDirection('asc');
    }
  };

  const getBookingSortIcon = (field: BookingSortField) => {
    if (bookingSortField !== field) {
      return <ArrowUpDown className="w-4 h-4 opacity-30" />;
    }
    return bookingSortDirection === 'asc' ? (
      <ArrowUp className="w-4 h-4" />
    ) : (
      <ArrowDown className="w-4 h-4" />
    );
  };

  const getMessageSortIcon = (field: MessageSortField) => {
    if (messageSortField !== field) {
      return <ArrowUpDown className="w-4 h-4 opacity-30" />;
    }
    return messageSortDirection === 'asc' ? (
      <ArrowUp className="w-4 h-4" />
    ) : (
      <ArrowDown className="w-4 h-4" />
    );
  };

  const renderBookingsTable = () => (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center gap-3">
          <h3 className="font-semibold text-slate-900">{t.bookingsList}</h3>
          <span className="px-2 py-1 bg-slate-100 text-slate-600 text-sm rounded-full">
            {bookingsTotal} {t.total}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => fetchBookings()}
            className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={() => setShowBookingFilters(!showBookingFilters)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
              hasActiveBookingFilters
                ? 'bg-blue-100 text-blue-700'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Filter className="w-4 h-4" />
            {t.filters}
            {hasActiveBookingFilters && (
              <span className="w-2 h-2 bg-blue-500 rounded-full" />
            )}
          </button>
        </div>
      </div>

      {showBookingFilters && (
        <div className="p-4 bg-slate-50 border-b border-slate-200">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">{t.search}</label>
              <input
                type="text"
                value={bookingFilters.search}
                onChange={(e) => {
                  setBookingFilters({ ...bookingFilters, search: e.target.value });
                  setBookingsPage(1);
                }}
                placeholder={t.searchPlaceholder}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">{t.dateFrom}</label>
              <input
                type="date"
                value={bookingFilters.dateFrom}
                onChange={(e) => {
                  setBookingFilters({ ...bookingFilters, dateFrom: e.target.value });
                  setBookingsPage(1);
                }}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">{t.dateTo}</label>
              <input
                type="date"
                value={bookingFilters.dateTo}
                onChange={(e) => {
                  setBookingFilters({ ...bookingFilters, dateTo: e.target.value });
                  setBookingsPage(1);
                }}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">{t.paymentStatus}</label>
              <select
                value={bookingFilters.paymentStatus}
                onChange={(e) => {
                  setBookingFilters({ ...bookingFilters, paymentStatus: e.target.value });
                  setBookingsPage(1);
                }}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">{t.all}</option>
                <option value="pending">{t.pending}</option>
                <option value="paid">{t.paid}</option>
                <option value="failed">{t.failed}</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">{t.bookingStatus}</label>
              <select
                value={bookingFilters.bookingStatus}
                onChange={(e) => {
                  setBookingFilters({ ...bookingFilters, bookingStatus: e.target.value });
                  setBookingsPage(1);
                }}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">{t.all}</option>
                <option value="pending">{t.pending}</option>
                <option value="confirmed">{t.confirmed}</option>
                <option value="completed">{t.completed}</option>
                <option value="cancelled">{t.cancelled}</option>
              </select>
            </div>
          </div>
          {hasActiveBookingFilters && (
            <button
              onClick={clearBookingFilters}
              className="mt-3 text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              <X className="w-4 h-4" />
              {t.clearFilters}
            </button>
          )}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th
                className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider cursor-pointer hover:bg-slate-100 transition-colors"
                onClick={() => handleBookingSort('customer_name')}
              >
                <div className="flex items-center gap-2">
                  {t.customer}
                  {getBookingSortIcon('customer_name')}
                </div>
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">{t.product}</th>
              <th
                className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider cursor-pointer hover:bg-slate-100 transition-colors"
                onClick={() => handleBookingSort('tour_date')}
              >
                <div className="flex items-center gap-2">
                  {t.tourDate}
                  {getBookingSortIcon('tour_date')}
                </div>
              </th>
              <th
                className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider cursor-pointer hover:bg-slate-100 transition-colors"
                onClick={() => handleBookingSort('total_price')}
              >
                <div className="flex items-center gap-2">
                  {t.price}
                  {getBookingSortIcon('total_price')}
                </div>
              </th>
              <th
                className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider cursor-pointer hover:bg-slate-100 transition-colors"
                onClick={() => handleBookingSort('payment_status')}
              >
                <div className="flex items-center gap-2">
                  {t.paymentStatus}
                  {getBookingSortIcon('payment_status')}
                </div>
              </th>
              <th
                className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider cursor-pointer hover:bg-slate-100 transition-colors"
                onClick={() => handleBookingSort('booking_status')}
              >
                <div className="flex items-center gap-2">
                  {t.status}
                  {getBookingSortIcon('booking_status')}
                </div>
              </th>
              <th
                className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider cursor-pointer hover:bg-slate-100 transition-colors"
                onClick={() => handleBookingSort('created_at')}
              >
                <div className="flex items-center gap-2">
                  {t.created}
                  {getBookingSortIcon('created_at')}
                </div>
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider">{t.actions}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {bookings.map((booking) => (
              <tr key={booking.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex flex-col">
                    <span className="font-medium text-slate-900">{booking.customer_name}</span>
                    <span className="text-sm text-slate-500">{booking.customer_email}</span>
                    <span className="text-sm text-slate-500">
                      {booking.dial_code || ''}{booking.customer_phone}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="text-sm text-slate-700">{booking.product?.name || '-'}</span>
                </td>
                <td className="px-4 py-3">
                  <span className="text-sm text-slate-700">{formatDate(booking.tour_date)}</span>
                </td>
                <td className="px-4 py-3">
                  <span className="font-medium text-slate-900">{booking.total_price?.toLocaleString()} THB</span>
                </td>
                <td className="px-4 py-3">{getPaymentStatusBadge(booking.payment_status)}</td>
                <td className="px-4 py-3">{getBookingStatusBadge(booking.booking_status)}</td>
                <td className="px-4 py-3">
                  <span className="text-sm text-slate-500">{formatDateTime(booking.created_at)}</span>
                </td>
                <td className="px-4 py-3 text-center">
                  <button
                    onClick={() => setSelectedBooking(booking)}
                    className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {bookings.length === 0 && !loading && (
        <div className="p-8 text-center text-slate-500">{t.noBookingsFound}</div>
      )}

      {totalBookingPages > 1 && (
        <div className="p-4 border-t border-slate-200 flex items-center justify-between">
          <span className="text-sm text-slate-600">
            {t.showing} {(bookingsPage - 1) * ITEMS_PER_PAGE + 1}-{Math.min(bookingsPage * ITEMS_PER_PAGE, bookingsTotal)} {t.of} {bookingsTotal}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setBookingsPage(Math.max(1, bookingsPage - 1))}
              disabled={bookingsPage === 1}
              className="p-2 rounded-lg border border-slate-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-sm text-slate-700">
              {bookingsPage} / {totalBookingPages}
            </span>
            <button
              onClick={() => setBookingsPage(Math.min(totalBookingPages, bookingsPage + 1))}
              disabled={bookingsPage === totalBookingPages}
              className="p-2 rounded-lg border border-slate-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );

  const renderMessagesTable = () => (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center gap-3">
          <h3 className="font-semibold text-slate-900">{t.contactMessages}</h3>
          <span className="px-2 py-1 bg-slate-100 text-slate-600 text-sm rounded-full">
            {messagesTotal} {t.total}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => fetchMessages()}
            className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={() => setShowMessageFilters(!showMessageFilters)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
              hasActiveMessageFilters
                ? 'bg-blue-100 text-blue-700'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Filter className="w-4 h-4" />
            {t.filters}
            {hasActiveMessageFilters && (
              <span className="w-2 h-2 bg-blue-500 rounded-full" />
            )}
          </button>
        </div>
      </div>

      {showMessageFilters && (
        <div className="p-4 bg-slate-50 border-b border-slate-200">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">{t.search}</label>
              <input
                type="text"
                value={messageFilters.search}
                onChange={(e) => {
                  setMessageFilters({ ...messageFilters, search: e.target.value });
                  setMessagesPage(1);
                }}
                placeholder={t.searchPlaceholder}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">{t.dateFrom}</label>
              <input
                type="date"
                value={messageFilters.dateFrom}
                onChange={(e) => {
                  setMessageFilters({ ...messageFilters, dateFrom: e.target.value });
                  setMessagesPage(1);
                }}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">{t.dateTo}</label>
              <input
                type="date"
                value={messageFilters.dateTo}
                onChange={(e) => {
                  setMessageFilters({ ...messageFilters, dateTo: e.target.value });
                  setMessagesPage(1);
                }}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">{t.telegramStatus}</label>
              <select
                value={messageFilters.telegramSent}
                onChange={(e) => {
                  setMessageFilters({ ...messageFilters, telegramSent: e.target.value });
                  setMessagesPage(1);
                }}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">{t.all}</option>
                <option value="true">{t.sent}</option>
                <option value="false">{t.notSent}</option>
              </select>
            </div>
          </div>
          {hasActiveMessageFilters && (
            <button
              onClick={clearMessageFilters}
              className="mt-3 text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              <X className="w-4 h-4" />
              {t.clearFilters}
            </button>
          )}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th
                className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider cursor-pointer hover:bg-slate-100 transition-colors"
                onClick={() => handleMessageSort('name')}
              >
                <div className="flex items-center gap-2">
                  {t.contact}
                  {getMessageSortIcon('name')}
                </div>
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">{t.message}</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">{t.product}</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">{t.telegram}</th>
              <th
                className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider cursor-pointer hover:bg-slate-100 transition-colors"
                onClick={() => handleMessageSort('created_at')}
              >
                <div className="flex items-center gap-2">
                  {t.created}
                  {getMessageSortIcon('created_at')}
                </div>
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider">{t.actions}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {messages.map((msg) => (
              <tr key={msg.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex flex-col">
                    <span className="font-medium text-slate-900">{msg.name}</span>
                    <span className="text-sm text-slate-500">{msg.email}</span>
                    <span className="text-sm text-slate-500">{msg.phone}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <p className="text-sm text-slate-700 line-clamp-2 max-w-xs">{msg.message}</p>
                </td>
                <td className="px-4 py-3">
                  <span className="text-sm text-slate-700">{msg.product?.name || '-'}</span>
                </td>
                <td className="px-4 py-3">
                  {msg.telegram_sent ? (
                    <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full border bg-emerald-100 text-emerald-700 border-emerald-200">
                      <CheckCircle className="w-3 h-3" />
                      {t.sent}
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full border bg-slate-100 text-slate-600 border-slate-200">
                      <Clock className="w-3 h-3" />
                      {t.notSent}
                    </span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <span className="text-sm text-slate-500">{formatDateTime(msg.created_at)}</span>
                </td>
                <td className="px-4 py-3 text-center">
                  <button
                    onClick={() => setSelectedMessage(msg)}
                    className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {messages.length === 0 && !loading && (
        <div className="p-8 text-center text-slate-500">{t.noMessagesFound}</div>
      )}

      {totalMessagePages > 1 && (
        <div className="p-4 border-t border-slate-200 flex items-center justify-between">
          <span className="text-sm text-slate-600">
            {t.showing} {(messagesPage - 1) * ITEMS_PER_PAGE + 1}-{Math.min(messagesPage * ITEMS_PER_PAGE, messagesTotal)} {t.of} {messagesTotal}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setMessagesPage(Math.max(1, messagesPage - 1))}
              disabled={messagesPage === 1}
              className="p-2 rounded-lg border border-slate-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-sm text-slate-700">
              {messagesPage} / {totalMessagePages}
            </span>
            <button
              onClick={() => setMessagesPage(Math.min(totalMessagePages, messagesPage + 1))}
              disabled={messagesPage === totalMessagePages}
              className="p-2 rounded-lg border border-slate-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );

  const renderBookingModal = () => {
    if (!selectedBooking) return null;

    return (
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
                      <Calendar className="w-4 h-4" />
                      {t.bookingInfo}
                    </h4>
                    <div className="space-y-2">
                      <p className="text-sm"><span className="text-slate-500">{t.product}:</span> <span className="font-medium">{selectedBooking.product?.name || '-'}</span></p>
                      <p className="text-sm"><span className="text-slate-500">{t.tourDate}:</span> <span className="font-medium">{formatDate(selectedBooking.tour_date)}</span></p>
                      <p className="text-sm"><span className="text-slate-500">{t.adultsCount}:</span> <span className="font-medium">{selectedBooking.adults || 0}</span></p>
                      <p className="text-sm"><span className="text-slate-500">{t.childrenCount}:</span> <span className="font-medium">{selectedBooking.children || 0}</span></p>
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
    );
  };

  const renderMessageModal = () => {
    if (!selectedMessage) return null;

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b border-slate-200 flex items-center justify-between">
            <h3 className="text-xl font-bold text-slate-900">{t.messageDetails}</h3>
            <button
              onClick={() => setSelectedMessage(null)}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-semibold text-slate-900 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  {t.contactInfo}
                </h4>
                <div className="space-y-2">
                  <p className="text-sm flex items-center gap-2">
                    <User className="w-4 h-4 text-slate-400" />
                    <span className="font-medium">{selectedMessage.name}</span>
                  </p>
                  <p className="text-sm flex items-center gap-2">
                    <Mail className="w-4 h-4 text-slate-400" />
                    <span className="font-medium">{selectedMessage.email}</span>
                  </p>
                  <p className="text-sm flex items-center gap-2">
                    <Phone className="w-4 h-4 text-slate-400" />
                    <span className="font-medium">{selectedMessage.phone}</span>
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <h4 className="font-semibold text-slate-900">{t.details}</h4>
                <div className="space-y-2">
                  <p className="text-sm"><span className="text-slate-500">{t.product}:</span> <span className="font-medium">{selectedMessage.product?.name || '-'}</span></p>
                  <p className="text-sm"><span className="text-slate-500">{t.telegram}:</span> {selectedMessage.telegram_sent ? (
                    <span className="text-emerald-600 font-medium">{t.sent}</span>
                  ) : (
                    <span className="text-slate-500">{t.notSent}</span>
                  )}</p>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-slate-900 flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                {t.message}
              </h4>
              <p className="text-sm text-slate-700 bg-slate-50 p-4 rounded-lg whitespace-pre-wrap">{selectedMessage.message}</p>
            </div>
            <div className="text-sm text-slate-500">
              {t.created}: {formatDateTime(selectedMessage.created_at)}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">{t.bookingsAndMessages}</h1>
        <p className="text-slate-600 mt-1">{t.manageBookingsAndMessages}</p>
      </div>

      <div className="flex gap-2 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('bookings')}
          className={`px-4 py-3 font-medium text-sm transition-colors relative ${
            activeTab === 'bookings'
              ? 'text-blue-600'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <span className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            {t.bookings}
          </span>
          {activeTab === 'bookings' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
          )}
        </button>
        <button
          onClick={() => setActiveTab('messages')}
          className={`px-4 py-3 font-medium text-sm transition-colors relative ${
            activeTab === 'messages'
              ? 'text-blue-600'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <span className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            {t.contactMessages}
          </span>
          {activeTab === 'messages' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
          )}
        </button>
        <button
          onClick={() => setActiveTab('companyInfo')}
          className={`px-4 py-3 font-medium text-sm transition-colors relative ${
            activeTab === 'companyInfo'
              ? 'text-blue-600'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <span className="flex items-center gap-2">
            <Building2 className="w-4 h-4" />
            {t.companyInfo || 'Company Info'}
          </span>
          {activeTab === 'companyInfo' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
          )}
        </button>
      </div>

      {loading && activeTab !== 'companyInfo' ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        </div>
      ) : activeTab === 'bookings' ? (
        renderBookingsTable()
      ) : activeTab === 'messages' ? (
        renderMessagesTable()
      ) : (
        <CompanyInfoEditor />
      )}

      {renderBookingModal()}
      {renderMessageModal()}

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
