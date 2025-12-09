import { useState, useEffect } from 'react';
import { X, Calendar, AlertCircle, CheckCircle, Minus, Plus } from 'lucide-react';
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
    adults_count: 1,
    children_count: 0,
    special_requests: '',
    platform: 'telegram' as 'telegram' | 'whatsapp',
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
        adults: formData.adults_count,
        children: formData.children_count,
        total_price: totalPrice,
        payment_status: 'pending',
        booking_status: 'pending',
        platform: formData.platform,
        special_requests: formData.special_requests || null,
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
        `Телефон: ${formData.customer_phone}\n` +
        `📱 Платформа: ${formData.platform === 'telegram' ? 'Telegram' : 'WhatsApp'}\n\n` +
        `📅 Детали бронирования:\n` +
        `Дата тура: ${formData.tour_date}\n` +
        `Взрослых: ${formData.adults_count}\n` +
        `Детей: ${formData.children_count}\n` +
        `Цена: ฿${totalPrice}` +
        (formData.special_requests ? `\n\n📝 Особые пожелания:\n${formData.special_requests}` : '');

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
            <p className="mb-2"><strong>Телефон:</strong> {formData.customer_phone}</p>
            <p><strong>Платформа:</strong> {formData.platform === 'telegram' ? 'Telegram' : 'WhatsApp'}</p>
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Платформа для связи *
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, platform: 'telegram' })}
                  className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 transition-all ${
                    formData.platform === 'telegram'
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                  }`}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.18 1.897-.962 6.502-1.359 8.627-.168.9-.5 1.201-.82 1.23-.697.064-1.226-.461-1.901-.903-1.056-.692-1.653-1.123-2.678-1.799-1.185-.781-.417-1.21.258-1.911.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.139-5.062 3.345-.479.329-.913.489-1.302.481-.428-.008-1.252-.241-1.865-.44-.752-.244-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.831-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635.099-.002.321.023.465.141.121.098.155.23.171.324.016.094.037.308.021.475z"/>
                  </svg>
                  <span className="font-medium">Telegram</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, platform: 'whatsapp' })}
                  className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 transition-all ${
                    formData.platform === 'whatsapp'
                      ? 'border-green-500 bg-green-50 text-green-700'
                      : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                  }`}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                  <span className="font-medium">WhatsApp</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Количество взрослых *
                </label>
                <div className="flex items-center justify-center gap-4">
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        adults_count: Math.max(1, formData.adults_count - 1),
                      })
                    }
                    className="w-10 h-10 flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full transition-all active:scale-95 shadow-sm"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="text-2xl font-semibold text-gray-900 w-12 text-center">
                    {formData.adults_count}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        adults_count: formData.adults_count + 1,
                      })
                    }
                    className="w-10 h-10 flex items-center justify-center bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-full transition-all active:scale-95 shadow-sm"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Количество детей *
                </label>
                <div className="flex items-center justify-center gap-4">
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        children_count: Math.max(0, formData.children_count - 1),
                      })
                    }
                    className="w-10 h-10 flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full transition-all active:scale-95 shadow-sm"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="text-2xl font-semibold text-gray-900 w-12 text-center">
                    {formData.children_count}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        children_count: formData.children_count + 1,
                      })
                    }
                    className="w-10 h-10 flex items-center justify-center bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-full transition-all active:scale-95 shadow-sm"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Особые пожелания
              </label>
              <textarea
                value={formData.special_requests}
                onChange={(e) =>
                  setFormData({ ...formData, special_requests: e.target.value })
                }
                rows={3}
                placeholder="Расскажите о ваших особых пожеланиях или требованиях..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
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
