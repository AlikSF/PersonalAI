import { useState, useEffect } from 'react';
import { X, Calendar, AlertCircle, CheckCircle } from 'lucide-react';
import { Product, supabase } from '../lib/supabase';

interface BookingModalProps {
  product: Product | null;
  onClose: () => void;
  onSuccess: () => void;
}

export function BookingModal({ product, onClose, onSuccess }: BookingModalProps) {
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    start_date: '',
    end_date: '',
    special_requests: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [unavailableDates, setUnavailableDates] = useState<string[]>([]);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    if (product) {
      fetchUnavailableDates();
    }
  }, [product]);

  useEffect(() => {
    if (formData.start_date && formData.end_date && product) {
      const start = new Date(formData.start_date);
      const end = new Date(formData.end_date);
      const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
      setTotalPrice(days * product.price_per_day);
    }
  }, [formData.start_date, formData.end_date, product]);

  const fetchUnavailableDates = async () => {
    if (!product) return;

    const { data, error } = await supabase
      .from('bookings')
      .select('start_date, end_date')
      .eq('product_id', product.id)
      .in('booking_status', ['confirmed', 'completed']);

    if (!error && data) {
      const dates: string[] = [];
      data.forEach((booking) => {
        const start = new Date(booking.start_date);
        const end = new Date(booking.end_date);
        for (let d = start; d <= end; d.setDate(d.getDate() + 1)) {
          dates.push(d.toISOString().split('T')[0]);
        }
      });
      setUnavailableDates(dates);
    }
  };

  const isDateUnavailable = (dateStr: string) => {
    return unavailableDates.includes(dateStr);
  };

  const validateDates = () => {
    const start = new Date(formData.start_date);
    const end = new Date(formData.end_date);

    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split('T')[0];
      if (isDateUnavailable(dateStr)) {
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!product) return;

    if (!validateDates()) {
      setError('Selected dates are not available. Please choose different dates.');
      return;
    }

    setLoading(true);

    try {
      const { error: bookingError } = await supabase.from('bookings').insert({
        product_id: product.id,
        customer_name: formData.customer_name,
        customer_email: formData.customer_email,
        customer_phone: formData.customer_phone,
        start_date: formData.start_date,
        end_date: formData.end_date,
        total_price: totalPrice,
        payment_status: 'paid',
        booking_status: 'confirmed',
        special_requests: formData.special_requests,
      });

      if (bookingError) throw bookingError;

      const telegramMessage = `NEW BOOKING CONFIRMED!\n\n` +
        `Product: ${product.name}\n` +
        `Category: ${product.category}\n` +
        `Location: ${product.location}\n\n` +
        `Customer Details:\n` +
        `Name: ${formData.customer_name}\n` +
        `Email: ${formData.customer_email}\n` +
        `Phone: ${formData.customer_phone}\n\n` +
        `Booking Details:\n` +
        `Start Date: ${formData.start_date}\n` +
        `End Date: ${formData.end_date}\n` +
        `Total Price: $${totalPrice.toFixed(2)}\n` +
        `Special Requests: ${formData.special_requests || 'None'}`;

      await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-telegram`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({
            name: formData.customer_name,
            email: formData.customer_email,
            phone: formData.customer_phone,
            message: telegramMessage,
            type: 'booking',
          }),
        }
      );

      setSuccess(true);
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 3000);
    } catch (err) {
      setError('Failed to create booking. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!product) return null;

  const today = new Date().toISOString().split('T')[0];

  if (success) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-2xl max-w-md w-full p-8 text-center">
          <div className="mb-4 flex justify-center">
            <div className="bg-green-100 rounded-full p-4">
              <CheckCircle className="h-16 w-16 text-green-600" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Booking Confirmed!</h2>
          <p className="text-gray-600 mb-4">
            Your booking for <strong>{product.name}</strong> has been confirmed.
          </p>
          <div className="bg-gray-50 rounded-lg p-4 text-left text-sm">
            <p className="mb-2"><strong>Dates:</strong> {formData.start_date} to {formData.end_date}</p>
            <p className="mb-2"><strong>Total:</strong> ${totalPrice.toFixed(2)}</p>
            <p><strong>Email:</strong> {formData.customer_email}</p>
          </div>
          <p className="text-sm text-gray-500 mt-4">
            Our team will contact you shortly with further details.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Book {product.name}</h2>
            <p className="text-sm text-gray-500">{product.location}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={formData.customer_name}
                onChange={(e) =>
                  setFormData({ ...formData, customer_name: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  required
                  value={formData.customer_email}
                  onChange={(e) =>
                    setFormData({ ...formData, customer_email: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.customer_phone}
                  onChange={(e) =>
                    setFormData({ ...formData, customer_phone: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Calendar className="inline h-4 w-4 mr-1" />
                  Start Date *
                </label>
                <input
                  type="date"
                  required
                  min={today}
                  value={formData.start_date}
                  onChange={(e) =>
                    setFormData({ ...formData, start_date: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Calendar className="inline h-4 w-4 mr-1" />
                  End Date *
                </label>
                <input
                  type="date"
                  required
                  min={formData.start_date || today}
                  value={formData.end_date}
                  onChange={(e) =>
                    setFormData({ ...formData, end_date: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Special Requests
              </label>
              <textarea
                rows={3}
                value={formData.special_requests}
                onChange={(e) =>
                  setFormData({ ...formData, special_requests: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder="Any special requirements or questions..."
              />
            </div>

            {totalPrice > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 font-medium">Total Price:</span>
                  <span className="text-2xl font-bold text-blue-600">
                    ${totalPrice.toFixed(2)}
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="mt-6 flex space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Confirming Booking...' : 'Confirm Booking'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
