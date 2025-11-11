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
    tour_date: '',
    adults_count: '1',
    children_count: '0',
    special_requests: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const totalPrice = product ? product.price_per_day : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!product) return;

    setLoading(true);

    try {
      const { data: bookingData, error: bookingError } = await supabase.from('bookings').insert({
        product_id: product.id,
        customer_name: formData.customer_name,
        customer_email: formData.customer_email || 'no-email@provided.com',
        customer_phone: formData.customer_phone,
        tour_date: formData.tour_date,
        start_date: formData.tour_date,
        end_date: formData.tour_date,
        total_price: totalPrice,
        payment_status: 'paid',
        booking_status: 'confirmed',
        special_requests: `Взрослых: ${formData.adults_count}, Детей: ${formData.children_count}`,
      });

      if (bookingError) {
        console.error('Booking error details:', bookingError);
        throw bookingError;
      }

      console.log('Booking created successfully:', bookingData);

      const telegramMessage = `🎉 НОВОЕ БРОНИРОВАНИЕ!\n\n` +
        `🎯 Тур: ${product.name}\n` +
        `📂 Категория: ${product.category}\n` +
        `📍 Локация: ${product.location}\n\n` +
        `👤 Информация о клиенте:\n` +
        `Имя: ${formData.customer_name}\n` +
        `Телефон: ${formData.customer_phone}\n\n` +
        `📅 Детали бронирования:\n` +
        `Дата тура: ${formData.tour_date}\n` +
        `Взрослых: ${formData.adults_count}\n` +
        `Детей: ${formData.children_count}\n` +
        `Цена: ฿${totalPrice}`;

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
    } catch (err: any) {
      const errorMessage = err?.message || 'Failed to create booking. Please try again.';
      setError(errorMessage);
      console.error('Full error:', err);
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
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Бронирование подтверждено!</h2>
          <p className="text-gray-600 mb-4">
            Ваше бронирование <strong>{product.name}</strong> подтверждено.
          </p>
          <div className="bg-gray-50 rounded-lg p-4 text-left text-sm">
            <p className="mb-2"><strong>Дата тура:</strong> {formData.tour_date}</p>
            <p className="mb-2"><strong>Взрослых:</strong> {formData.adults_count} | <strong>Детей:</strong> {formData.children_count}</p>
            <p className="mb-2"><strong>Цена:</strong> ฿{totalPrice}</p>
            <p><strong>Телефон:</strong> {formData.customer_phone}</p>
          </div>
          <p className="text-sm text-gray-500 mt-4">
            Наша команда свяжется с вами в ближайшее время.
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
            <h2 className="text-2xl font-bold text-gray-900">Забронировать {product.name}</h2>
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
                Ваше имя *
              </label>
              <input
                type="text"
                required
                placeholder="Введите ваше полное имя"
                value={formData.customer_name}
                onChange={(e) =>
                  setFormData({ ...formData, customer_name: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Телефон *
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Дата тура *
              </label>
              <input
                type="date"
                required
                min={today}
                value={formData.tour_date}
                onChange={(e) =>
                  setFormData({ ...formData, tour_date: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Количество взрослых *
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={formData.adults_count}
                  onChange={(e) =>
                    setFormData({ ...formData, adults_count: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Количество детей *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  value={formData.children_count}
                  onChange={(e) =>
                    setFormData({ ...formData, children_count: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-700 font-medium">Цена:</span>
                <span className="text-2xl font-bold text-blue-600">
                  ฿{totalPrice}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6 flex space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
            >
              Назад
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Подтверждение...' : 'Подтвердить бронирование'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
