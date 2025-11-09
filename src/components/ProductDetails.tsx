import { useState } from 'react';
import { X, MapPin, Users, Calendar, MessageCircle, User, ChevronLeft, ChevronRight } from 'lucide-react';
import { Product } from '../lib/supabase';
import { useLanguage } from '../contexts/LanguageContext';

interface ProductDetailsProps {
  product: Product | null;
  onClose: () => void;
}

export function ProductDetails({ product, onClose }: ProductDetailsProps) {
  const { t } = useLanguage();
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    guests: '',
    checkIn: '',
    checkOut: ''
  });

  if (!product) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleConfirmBooking = () => {
    const { name, guests, checkIn, checkOut } = formData;

    if (!name || !guests || !checkIn || !checkOut) {
      alert(t('booking.fillFields'));
      return;
    }

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const days = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));
    const totalPrice = days * product.price_per_day;

    const message = encodeURIComponent(
      `🎯 ЗАПРОС НА БРОНИРОВАНИЕ\n\n` +
      `👤 Клиент: ${name}\n` +
      `📦 Товар: ${product.name}\n` +
      `📍 Местоположение: ${product.location}\n\n` +
      `👥 Количество гостей: ${guests}\n` +
      `📅 Заезд: ${new Date(checkIn).toLocaleDateString()}\n` +
      `📅 Выезд: ${new Date(checkOut).toLocaleDateString()}\n` +
      `🗓️ Продолжительность: ${days} ${days === 1 ? 'день' : days < 5 ? 'дня' : 'дней'}\n\n` +
      `💰 Цена: $${product.price_per_day}/день\n` +
      `💵 Итого: $${totalPrice.toFixed(2)}`
    );

    const telegramUsername = import.meta.env.VITE_TELEGRAM_USERNAME || 'yourusername';
    window.open(`https://t.me/${telegramUsername}?text=${message}`, '_blank');
  };

  const getTodayDate = () => {
    return new Date().toISOString().split('T')[0];
  };

  const images = product.images && product.images.length > 0 ? product.images : [product.image_url];

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      handleNextImage();
    }
    if (isRightSwipe) {
      handlePrevImage();
    }

    setTouchStart(0);
    setTouchEnd(0);
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 overflow-y-auto"
      onClick={onClose}
    >
      <div className="min-h-screen px-4 py-8 flex items-center justify-center">
        <div
          className="bg-white rounded-2xl max-w-4xl w-full"
          onClick={(e) => e.stopPropagation()}
        >
          <div
            className="relative h-48 md:h-96"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <img
              src={images[currentImageIndex]}
              alt={`${product.name} - ${currentImageIndex + 1}`}
              className="w-full h-full object-cover rounded-t-2xl"
            />

            {images.length > 1 && (
              <>
                <button
                  onClick={handlePrevImage}
                  className="absolute left-2 md:left-4 top-1/2 transform -translate-y-1/2 bg-white/90 rounded-full p-1 md:p-2 hover:bg-white transition shadow-lg"
                >
                  <ChevronLeft className="h-4 w-4 md:h-6 md:w-6 text-gray-700" />
                </button>
                <button
                  onClick={handleNextImage}
                  className="absolute right-12 md:right-16 top-1/2 transform -translate-y-1/2 bg-white/90 rounded-full p-1 md:p-2 hover:bg-white transition shadow-lg"
                >
                  <ChevronRight className="h-4 w-4 md:h-6 md:w-6 text-gray-700" />
                </button>

                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                  {images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-2 h-2 rounded-full transition ${
                        index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}

            <button
              onClick={onClose}
              className="absolute top-4 right-4 bg-white rounded-full p-2 hover:bg-gray-100 transition shadow-lg z-10"
            >
              <X className="h-5 w-5 md:h-6 md:w-6 text-gray-700" />
            </button>

            {images.length > 1 && (
              <div className="absolute top-4 left-4 bg-black/60 text-white px-2 md:px-3 py-1 rounded-full text-xs md:text-sm">
                {currentImageIndex + 1} / {images.length}
              </div>
            )}
          </div>

          <div className="p-4 md:p-8">
            <div className="mb-4 md:mb-6">
            <h1 className="text-2xl md:text-4xl font-bold text-gray-900 mb-3 md:mb-4">
              {product.name}
            </h1>

            <div className="flex flex-wrap gap-3 md:gap-4 text-gray-600 mb-4 md:mb-6 text-sm md:text-base">
              <div className="flex items-center space-x-1 md:space-x-2">
                <MapPin className="h-4 w-4 md:h-5 md:w-5" />
                <span>{product.location}</span>
              </div>
              {product.capacity && (
                <div className="flex items-center space-x-1 md:space-x-2">
                  <Users className="h-4 w-4 md:h-5 md:w-5" />
                  <span>{product.capacity} {t('products.guests')}</span>
                </div>
              )}
              <div className="flex items-center space-x-1 md:space-x-2">
                <Calendar className="h-4 w-4 md:h-5 md:w-5" />
                <span className="capitalize">{product.category}</span>
              </div>
            </div>

            <div className="prose max-w-none mb-6 md:mb-8">
              <p className="text-gray-700 text-sm md:text-lg leading-relaxed">
                {product.description}
              </p>
            </div>

            {product.features && product.features.length > 0 && (
              <div className="mb-6 md:mb-8">
                <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-3 md:mb-4">{t('products.features')}</h3>
                <div className="flex flex-wrap gap-2">
                  {product.features.map((feature, index) => (
                    <span
                      key={index}
                      className="px-3 md:px-4 py-1 md:py-2 bg-blue-50 text-blue-700 rounded-full text-xs md:text-sm font-medium border border-blue-200"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="border-t border-gray-200 pt-4 md:pt-6">
              {!showBookingForm ? (
                <div>
                  <div className="mb-4 md:mb-6">
                    <p className="text-gray-600 text-xs md:text-sm mb-1">{t('products.startingFrom')}</p>
                    <div className="flex items-baseline">
                      <span className="text-3xl md:text-4xl font-bold text-gray-900">
                        ${product.price_per_day.toFixed(2)}
                      </span>
                      <span className="text-gray-600 text-sm md:text-base ml-2">{t('products.perDay')}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setShowBookingForm(true)}
                    className="w-full flex items-center justify-center space-x-2 bg-blue-600 text-white px-6 md:px-8 py-3 md:py-4 rounded-lg text-base md:text-lg font-semibold hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    <MessageCircle className="h-5 w-5" />
                    <span>{t('products.bookNow')}</span>
                  </button>
                </div>
              ) : (
                <div>
                  <h3 className="text-xl md:text-2xl font-semibold text-gray-900 mb-4 md:mb-6">{t('booking.title')}</h3>

                  <div className="space-y-3 md:space-y-4 mb-4 md:mb-6">
                    <div>
                      <label htmlFor="name" className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
                        <div className="flex items-center space-x-2">
                          <User className="h-4 w-4" />
                          <span>{t('booking.name')}</span>
                        </div>
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder={t('booking.namePlaceholder')}
                        className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-sm md:text-base"
                      />
                    </div>

                    <div>
                      <label htmlFor="guests" className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
                        <div className="flex items-center space-x-2">
                          <Users className="h-4 w-4" />
                          <span>{t('booking.guests')}</span>
                        </div>
                      </label>
                      <input
                        type="number"
                        id="guests"
                        name="guests"
                        value={formData.guests}
                        onChange={handleInputChange}
                        min="1"
                        max={product.capacity || 100}
                        placeholder={t('booking.guestsPlaceholder')}
                        className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-sm md:text-base"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="checkIn" className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4" />
                            <span>{t('booking.checkIn')}</span>
                          </div>
                        </label>
                        <input
                          type="date"
                          id="checkIn"
                          name="checkIn"
                          value={formData.checkIn}
                          onChange={handleInputChange}
                          min={getTodayDate()}
                          className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-sm md:text-base"
                        />
                      </div>

                      <div>
                        <label htmlFor="checkOut" className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4" />
                            <span>{t('booking.checkOut')}</span>
                          </div>
                        </label>
                        <input
                          type="date"
                          id="checkOut"
                          name="checkOut"
                          value={formData.checkOut}
                          onChange={handleInputChange}
                          min={formData.checkIn || getTodayDate()}
                          className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-sm md:text-base"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 md:pt-6 border-t gap-2">
                    <button
                      onClick={() => setShowBookingForm(false)}
                      className="px-4 md:px-6 py-2 md:py-3 border border-gray-300 rounded-lg text-sm md:text-base text-gray-700 font-semibold hover:bg-gray-50 transition"
                    >
                      {t('booking.back')}
                    </button>

                    <button
                      onClick={handleConfirmBooking}
                      className="flex items-center space-x-2 bg-blue-600 text-white px-4 md:px-8 py-2 md:py-3 rounded-lg text-sm md:text-lg font-semibold hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl"
                    >
                      <MessageCircle className="h-4 w-4 md:h-5 md:w-5" />
                      <span>{t('booking.confirm')}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
