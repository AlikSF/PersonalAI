import { useState } from 'react';
import { X, MapPin, Calendar, MessageCircle, User, ChevronLeft, ChevronRight, Minus, Plus } from 'lucide-react';
import { Product, supabase } from '../lib/supabase';
import { useLanguage } from '../contexts/LanguageContext';
import { Lightbox } from './Lightbox';
import { getDisplayName, getDisplayDescription, getDisplayLocation, getDisplayFeatures, getDisplayCategory } from '../lib/productHelpers';

interface ProductDetailsProps {
  product: Product | null;
  onClose: () => void;
}

export function ProductDetails({ product, onClose }: ProductDetailsProps) {
  const { t, language } = useLanguage();
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    tourDate: '',
    adults: 1,
    children: 0
  });

  if (!product) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleConfirmBooking = (platform: 'telegram' | 'whatsapp') => {
    const { name, phone, tourDate, adults, children } = formData;

    if (!name || !phone || !tourDate || !adults) {
      alert(t('booking.fillFields'));
      return;
    }

    const totalPrice = product.price_per_day;
    const displayName = getDisplayName(product, language);
    const displayLocation = getDisplayLocation(product, language);

    // Build message based on current language
    let telegramMessage: string;
    let whatsappMessage: string;

    if (language === 'en') {
      // English message templates
      telegramMessage =
        `🎯 TOUR BOOKING REQUEST\n\n` +
        `👤 Client: ${name}\n` +
        `📞 Phone: ${phone}\n` +
        `🎯 Tour: ${displayName}\n` +
        `📍 Location: ${displayLocation}\n\n` +
        `📅 Tour date: ${new Date(tourDate).toLocaleDateString()}\n` +
        `👥 Adults: ${adults}\n` +
        `👶 Children: ${children}\n\n` +
        `💰 Price: ฿${totalPrice.toFixed(2)}`;

      whatsappMessage =
        `TOUR BOOKING REQUEST\n\n` +
        `Client: ${name}\n` +
        `Phone: ${phone}\n` +
        `Tour: ${displayName}\n` +
        `Location: ${displayLocation}\n\n` +
        `Tour date: ${new Date(tourDate).toLocaleDateString()}\n` +
        `Adults: ${adults}\n` +
        `Children: ${children}\n\n` +
        `Price: ฿${totalPrice.toFixed(2)}`;
    } else {
      // Russian message templates (default)
      telegramMessage =
        `🎯 ЗАПРОС НА БРОНИРОВАНИЕ ТУРА\n\n` +
        `👤 Клиент: ${name}\n` +
        `📞 Телефон: ${phone}\n` +
        `🎯 Тур: ${displayName}\n` +
        `📍 Местоположение: ${displayLocation}\n\n` +
        `📅 Дата тура: ${new Date(tourDate).toLocaleDateString()}\n` +
        `👥 Взрослых: ${adults}\n` +
        `👶 Детей: ${children}\n\n` +
        `💰 Цена: ฿${totalPrice.toFixed(2)}`;

      whatsappMessage =
        `ЗАПРОС НА БРОНИРОВАНИЕ ТУРА\n\n` +
        `Клиент: ${name}\n` +
        `Телефон: ${phone}\n` +
        `Тур: ${displayName}\n` +
        `Местоположение: ${displayLocation}\n\n` +
        `Дата тура: ${new Date(tourDate).toLocaleDateString()}\n` +
        `Взрослых: ${adults}\n` +
        `Детей: ${children}\n\n` +
        `Цена: ฿${totalPrice.toFixed(2)}`;
    }

    // CRITICAL: Open window BEFORE any async operations for Safari iOS compatibility
    let url: string;
    if (platform === 'telegram') {
      const telegramUsername = 'PhuketVibemanager';
      url = `https://t.me/${telegramUsername}?text=${encodeURIComponent(telegramMessage)}`;
    } else {
      const whatsappNumber = '66972137197';
      url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;
    }

    // Open immediately - Safari blocks window.open() if it's not called synchronously
    window.location.href = url;

    // Track lead event in Google Analytics (after opening, non-blocking)
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'generate_lead', {
        currency: 'THB',
        value: totalPrice,
        event_category: 'Booking',
        event_label: `${platform === 'telegram' ? 'Telegram' : 'WhatsApp'} - ${displayName}`,
        tour_name: displayName,
        tour_category: getDisplayCategory(product, language, t),
        platform: platform,
        adults: adults,
        children: children
      });
    }

    // Save booking to database (non-blocking)
    supabase.from('bookings').insert({
      product_id: product.id,
      customer_name: name,
      customer_email: 'no-email@provided.com',
      customer_phone: phone,
      tour_date: tourDate,
      start_date: tourDate,
      end_date: tourDate,
      total_price: totalPrice,
      payment_status: 'pending',
      booking_status: 'confirmed',
      special_requests: `Взрослых: ${adults}, Детей: ${children}, Платформа: ${platform}`,
    }).then(({ error }) => {
      if (error) {
        console.error('Error saving booking:', error);
      } else {
        console.log('Booking saved successfully');
      }
    }).catch(err => {
      console.error('Failed to save booking:', err);
    });
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
    <>
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
              alt={`${getDisplayName(product, language)} - ${currentImageIndex + 1}`}
              className="w-full h-full object-cover rounded-t-2xl cursor-pointer"
              onClick={() => {
                setLightboxIndex(currentImageIndex);
                setIsLightboxOpen(true);
              }}
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
              {getDisplayName(product, language)}
            </h1>

            <div className="flex flex-wrap gap-3 md:gap-4 text-gray-600 mb-4 md:mb-6 text-sm md:text-base">
              <div className="flex items-center space-x-1 md:space-x-2">
                <MapPin className="h-4 w-4 md:h-5 md:w-5" />
                <span>{getDisplayLocation(product, language)}</span>
              </div>
              <div className="flex items-center space-x-1 md:space-x-2">
                <Calendar className="h-4 w-4 md:h-5 md:w-5" />
                <span>{getDisplayCategory(product, language, t)}</span>
              </div>
            </div>

            <div className="prose max-w-none mb-6 md:mb-8">
              <div className="text-gray-700 text-sm md:text-base leading-relaxed whitespace-pre-line">
                {getDisplayDescription(product, language)}
              </div>
            </div>

            {getDisplayFeatures(product, language).length > 0 && (
              <div className="mb-6 md:mb-8">
                <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-3 md:mb-4">{t('products.features')}</h3>
                <div className="flex flex-wrap gap-2">
                  {getDisplayFeatures(product, language).map((feature, index) => (
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
                        ฿{product.price_per_day.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      // Track booking intent in Google Analytics
                      if (typeof window !== 'undefined' && window.gtag) {
                        window.gtag('event', 'begin_checkout', {
                          currency: 'THB',
                          value: product.price_per_day,
                          event_category: 'Booking',
                          event_label: `Book Now - ${getDisplayName(product, language)}`,
                          tour_name: getDisplayName(product, language),
                          tour_category: getDisplayCategory(product, language, t),
                          tour_price: product.price_per_day
                        });
                      }
                      setShowBookingForm(true);
                    }}
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
                      <label htmlFor="phone" className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
                        <span>{t('booking.phone')}</span>
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder={t('booking.phonePlaceholder')}
                        className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-sm md:text-base"
                      />
                    </div>

                    <div>
                      <label htmlFor="tourDate" className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-blue-600" />
                          <span>{t('booking.tourDate')} <span className="text-red-500">*</span></span>
                        </div>
                      </label>
                      <input
                        type="date"
                        id="tourDate"
                        name="tourDate"
                        value={formData.tourDate}
                        onChange={handleInputChange}
                        min={getTodayDate()}
                        placeholder={language === 'en' ? 'Select tour date' : 'Выберите дату тура'}
                        className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-sm md:text-base bg-white text-gray-900"
                        style={{
                          colorScheme: 'light',
                          WebkitAppearance: 'none',
                          MozAppearance: 'none',
                          appearance: 'none',
                          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='%232563eb' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='3' y='4' width='18' height='18' rx='2' ry='2'%3E%3C/rect%3E%3Cline x1='16' y1='2' x2='16' y2='6'%3E%3C/line%3E%3Cline x1='8' y1='2' x2='8' y2='6'%3E%3C/line%3E%3Cline x1='3' y1='10' x2='21' y2='10'%3E%3C/line%3E%3C/svg%3E")`,
                          backgroundRepeat: 'no-repeat',
                          backgroundPosition: 'right 0.75rem center',
                          backgroundSize: '1.25rem',
                          paddingRight: '2.5rem'
                        }}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
                          <span>{t('booking.adults')}</span>
                        </label>
                        <div className="flex items-center justify-center gap-3 border border-gray-300 rounded-lg py-2 md:py-3">
                          <button
                            type="button"
                            onClick={() =>
                              setFormData({
                                ...formData,
                                adults: Math.max(1, formData.adults - 1),
                              })
                            }
                            className="w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full transition-all active:scale-95"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="text-xl md:text-2xl font-semibold text-gray-900 w-10 text-center">
                            {formData.adults}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              setFormData({
                                ...formData,
                                adults: formData.adults + 1,
                              })
                            }
                            className="w-8 h-8 flex items-center justify-center bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-full transition-all active:scale-95"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
                          <span>{t('booking.children')}</span>
                        </label>
                        <div className="flex items-center justify-center gap-3 border border-gray-300 rounded-lg py-2 md:py-3">
                          <button
                            type="button"
                            onClick={() =>
                              setFormData({
                                ...formData,
                                children: Math.max(0, formData.children - 1),
                              })
                            }
                            className="w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full transition-all active:scale-95"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="text-xl md:text-2xl font-semibold text-gray-900 w-10 text-center">
                            {formData.children}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              setFormData({
                                ...formData,
                                children: formData.children + 1,
                              })
                            }
                            className="w-8 h-8 flex items-center justify-center bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-full transition-all active:scale-95"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 md:pt-6 border-t space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => handleConfirmBooking('telegram')}
                        className="flex items-center justify-center space-x-2 bg-blue-500 text-white px-4 py-3 rounded-lg text-sm md:text-base font-semibold hover:bg-blue-600 transition-all shadow-lg hover:shadow-xl active:scale-95"
                      >
                        <svg className="h-4 w-4 md:h-5 md:w-5" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/>
                        </svg>
                        <span>Telegram</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleConfirmBooking('whatsapp')}
                        className="flex items-center justify-center space-x-2 bg-green-500 text-white px-4 py-3 rounded-lg text-sm md:text-base font-semibold hover:bg-green-600 transition-all shadow-lg hover:shadow-xl active:scale-95"
                      >
                        <svg className="h-4 w-4 md:h-5 md:w-5" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                        </svg>
                        <span>WhatsApp</span>
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => setShowBookingForm(false)}
                      className="w-full px-4 py-2 md:py-3 border border-gray-300 rounded-lg text-sm md:text-base text-gray-700 font-semibold hover:bg-gray-50 transition"
                    >
                      {t('booking.back')}
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

      <Lightbox
        images={images}
        startIndex={lightboxIndex}
        isOpen={isLightboxOpen}
        onClose={() => setIsLightboxOpen(false)}
      />
    </>
  );
}
