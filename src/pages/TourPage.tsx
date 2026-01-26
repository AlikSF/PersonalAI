import { useState, useEffect } from 'react';
import { MapPin, Calendar, ChevronLeft, ChevronRight, MessageCircle, User, Minus, Plus, ArrowLeft, Loader2, X } from 'lucide-react';
import { Product, supabase } from '../lib/supabase';
import { useLanguage } from '../contexts/LanguageContext';
import { Lightbox } from '../components/Lightbox';
import { PhoneInput } from '../components/PhoneInput';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { FloatingWhatsAppButton } from '../components/FloatingWhatsAppButton';
import { CookieConsent } from '../components/CookieConsent';
import { getDisplayName, getDisplayDescription, getDisplayLocation, getDisplayFeatures, getDisplayCategory } from '../lib/productHelpers';

interface TourPageProps {
  slug: string;
  showBooking?: boolean;
}

function setMeta(attr: string, key: string, value: string, _isProperty = false) {
  let meta = document.querySelector(`meta[${attr}="${key}"]`);
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute(attr, key);
    document.head.appendChild(meta);
  }
  meta.setAttribute('content', value);
}

function setLink(rel: string, href: string) {
  let link = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement;
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', rel);
    document.head.appendChild(link);
  }
  link.setAttribute('href', href);
}

function TourSEOHead({ product, language }: { product: Product; language: string }) {
  useEffect(() => {
    const SITE_URL = 'https://phuketvibe.com';
    const name = getDisplayName(product, language as any);
    const location = getDisplayLocation(product, language as any);
    const rawDescription = getDisplayDescription(product, language as any);
    const description = rawDescription.length > 155 ? rawDescription.substring(0, 155) + '...' : rawDescription;
    const image = product.images?.[0] || product.image_url;
    const slug = product.slug || product.id;
    const canonicalUrl = `${SITE_URL}/tour/${slug}`;

    const seoTitle = `${name} | Phuket Tour | Book Now | Phuket Vibe Tours`;
    const seoDescription = `${name} in ${location}. ${description} Book your Phuket adventure today!`;

    document.title = seoTitle;

    setMeta('name', 'description', seoDescription.substring(0, 160));
    setMeta('name', 'robots', 'index, follow');

    setMeta('property', 'og:title', seoTitle);
    setMeta('property', 'og:description', seoDescription.substring(0, 160));
    setMeta('property', 'og:type', 'product');
    setMeta('property', 'og:url', canonicalUrl);
    setMeta('property', 'og:image', image);
    setMeta('property', 'og:site_name', 'Phuket Vibe Tours');

    setMeta('name', 'twitter:card', 'summary_large_image');
    setMeta('name', 'twitter:title', seoTitle);
    setMeta('name', 'twitter:description', seoDescription.substring(0, 160));
    setMeta('name', 'twitter:image', image);

    setLink('canonical', canonicalUrl);

    const features = getDisplayFeatures(product, language as any);

    const tourSchema = {
      "@context": "https://schema.org",
      "@type": "TouristTrip",
      "@id": canonicalUrl,
      "name": name,
      "description": rawDescription,
      "image": product.images && product.images.length > 0 ? product.images : [product.image_url],
      "touristType": ["Adventure tourism", "Beach tourism"],
      "offers": {
        "@type": "Offer",
        "price": product.price_per_day,
        "priceCurrency": "THB",
        "availability": "https://schema.org/InStock",
        "url": `${canonicalUrl}/book`,
        "validFrom": new Date().toISOString().split('T')[0]
      },
      "provider": {
        "@type": "TravelAgency",
        "@id": `${SITE_URL}/#organization`,
        "name": "PhuketVibe",
        "url": SITE_URL
      },
      "itinerary": {
        "@type": "ItemList",
        "itemListElement": features.map((feature, index) => ({
          "@type": "ListItem",
          "position": index + 1,
          "name": feature
        }))
      }
    };

    const productSchema = {
      "@context": "https://schema.org",
      "@type": "Product",
      "@id": `${canonicalUrl}#product`,
      "name": name,
      "description": rawDescription,
      "image": product.images && product.images.length > 0 ? product.images : [product.image_url],
      "brand": {
        "@type": "Brand",
        "name": "PhuketVibe"
      },
      "offers": {
        "@type": "Offer",
        "price": product.price_per_day,
        "priceCurrency": "THB",
        "availability": "https://schema.org/InStock",
        "url": `${canonicalUrl}/book`,
        "priceValidUntil": new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
        "seller": {
          "@type": "Organization",
          "@id": `${SITE_URL}/#organization`,
          "name": "PhuketVibe"
        }
      },
      "category": "Tours & Excursions",
      "areaServed": {
        "@type": "Place",
        "name": "Phuket, Thailand",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Phuket",
          "addressCountry": "TH"
        }
      },
      "provider": {
        "@type": "TravelAgency",
        "@id": `${SITE_URL}/#organization`,
        "name": "PhuketVibe",
        "url": SITE_URL,
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "105 Phangmuang Sai Kor Rd",
          "addressLocality": "Patong",
          "addressRegion": "Phuket",
          "postalCode": "83150",
          "addressCountry": "TH"
        }
      }
    };

    const breadcrumbSchema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": SITE_URL
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Tours",
          "item": `${SITE_URL}/#rentals`
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": name,
          "item": canonicalUrl
        }
      ]
    };

    const existingTourSchema = document.getElementById('tour-schema');
    if (existingTourSchema) existingTourSchema.remove();
    const existingProductSchema = document.getElementById('product-schema');
    if (existingProductSchema) existingProductSchema.remove();
    const existingBreadcrumb = document.getElementById('breadcrumb-schema');
    if (existingBreadcrumb) existingBreadcrumb.remove();

    const tourScript = document.createElement('script');
    tourScript.type = 'application/ld+json';
    tourScript.id = 'tour-schema';
    tourScript.textContent = JSON.stringify(tourSchema);
    document.head.appendChild(tourScript);

    const productScript = document.createElement('script');
    productScript.type = 'application/ld+json';
    productScript.id = 'product-schema';
    productScript.textContent = JSON.stringify(productSchema);
    document.head.appendChild(productScript);

    const breadcrumbScript = document.createElement('script');
    breadcrumbScript.type = 'application/ld+json';
    breadcrumbScript.id = 'breadcrumb-schema';
    breadcrumbScript.textContent = JSON.stringify(breadcrumbSchema);
    document.head.appendChild(breadcrumbScript);

    return () => {
      document.title = 'Phuket Tours & Excursions | Phi Phi, Similan Islands | Phuket Vibe Tours';
      const tourSchemaEl = document.getElementById('tour-schema');
      if (tourSchemaEl) tourSchemaEl.remove();
      const productSchemaEl = document.getElementById('product-schema');
      if (productSchemaEl) productSchemaEl.remove();
      const breadcrumbEl = document.getElementById('breadcrumb-schema');
      if (breadcrumbEl) breadcrumbEl.remove();
    };
  }, [product, language]);

  return null;
}

export function TourPage({ slug, showBooking = false }: TourPageProps) {
  const { t, language } = useLanguage();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showBookingForm, setShowBookingForm] = useState(showBooking);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    countryCode: 'TH',
    dialCode: '+66',
    tourDate: '',
    adults: 1,
    children: 0
  });
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  useEffect(() => {
    fetchProduct();
  }, [slug]);

  useEffect(() => {
    setShowBookingForm(showBooking);
  }, [showBooking]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      setError(null);

      let data = null;
      let fetchError = null;

      const slugResult = await supabase
        .from('products')
        .select('*')
        .eq('slug', slug)
        .eq('is_active', true)
        .maybeSingle();

      if (slugResult.data) {
        data = slugResult.data;
      } else if (!slugResult.error || slugResult.error.code === 'PGRST116') {
        const idResult = await supabase
          .from('products')
          .select('*')
          .eq('id', slug)
          .eq('is_active', true)
          .maybeSingle();

        data = idResult.data;
        fetchError = idResult.error;
      } else {
        fetchError = slugResult.error;
      }

      if (fetchError) throw fetchError;

      if (!data) {
        setError('Tour not found');
        return;
      }

      setProduct(data);
    } catch (err) {
      console.error('Error fetching product:', err);
      setError(err instanceof Error ? err.message : 'Failed to load tour');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validateForm = (): string | null => {
    const { name, tourDate, adults } = formData;

    if (!name || name.trim().length < 2) {
      return t('booking.invalidName') || 'Please enter a valid name (at least 2 characters)';
    }

    if (!tourDate) {
      return t('booking.selectDate') || 'Please select a tour date';
    }

    const selectedDate = new Date(tourDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    selectedDate.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      return t('booking.pastDate') || 'Please select today or a future date';
    }

    if (!adults || adults < 1) {
      return t('booking.minAdults') || 'At least one adult is required';
    }

    if (adults > 50) {
      return t('booking.maxGuests') || 'Maximum 50 guests allowed';
    }

    return null;
  };

  const handleConfirmBooking = (platform: 'telegram' | 'whatsapp') => {
    if (!product) return;

    const validationError = validateForm();
    if (validationError) {
      alert(validationError);
      return;
    }

    const { name, phone, dialCode, tourDate, adults, children } = formData;
    const totalPrice = product.price_per_day;
    const displayName = getDisplayName(product, language);
    const displayLocation = getDisplayLocation(product, language);
    const fullPhone = phone ? `${dialCode} ${phone}` : '';

    let telegramMessage: string;
    let whatsappMessage: string;

    if (language === 'en' || language === 'fr') {
      telegramMessage =
        `🎯 TOUR BOOKING REQUEST\n\n` +
        `👤 Client: ${name}\n` +
        (fullPhone ? `📞 Phone: ${fullPhone}\n` : '') +
        `🎯 Tour: ${displayName}\n` +
        `📍 Location: ${displayLocation}\n\n` +
        `📅 Tour date: ${new Date(tourDate).toLocaleDateString()}\n` +
        `👥 Adults: ${adults}\n` +
        `👶 Children: ${children}`;

      whatsappMessage =
        `TOUR BOOKING REQUEST\n\n` +
        `Client: ${name}\n` +
        (fullPhone ? `Phone: ${fullPhone}\n` : '') +
        `Tour: ${displayName}\n` +
        `Location: ${displayLocation}\n\n` +
        `Tour date: ${new Date(tourDate).toLocaleDateString()}\n` +
        `Adults: ${adults}\n` +
        `Children: ${children}`;
    } else {
      telegramMessage =
        `🎯 ЗАПРОС НА БРОНИРОВАНИЕ ТУРА\n\n` +
        `👤 Клиент: ${name}\n` +
        (fullPhone ? `📞 Телефон: ${fullPhone}\n` : '') +
        `🎯 Тур: ${displayName}\n` +
        `📍 Местоположение: ${displayLocation}\n\n` +
        `📅 Дата тура: ${new Date(tourDate).toLocaleDateString()}\n` +
        `👥 Взрослых: ${adults}\n` +
        `👶 Детей: ${children}`;

      whatsappMessage =
        `ЗАПРОС НА БРОНИРОВАНИЕ ТУРА\n\n` +
        `Клиент: ${name}\n` +
        (fullPhone ? `Телефон: ${fullPhone}\n` : '') +
        `Тур: ${displayName}\n` +
        `Местоположение: ${displayLocation}\n\n` +
        `Дата тура: ${new Date(tourDate).toLocaleDateString()}\n` +
        `Взрослых: ${adults}\n` +
        `Детей: ${children}`;
    }

    let url: string;
    if (platform === 'telegram') {
      const telegramUsername = 'PhuketVibemanager';
      url = `https://t.me/${telegramUsername}?text=${encodeURIComponent(telegramMessage)}`;
    } else {
      const whatsappNumber = '66972137197';
      url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;
    }

    window.location.href = url;

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

    (async () => {
      try {
        await supabase.from('bookings').insert({
          product_id: product.id,
          customer_name: name,
          customer_email: 'no-email@provided.com',
          customer_phone: phone || null,
          country_code: phone ? dialCode : null,
          dial_code: phone ? dialCode : null,
          tour_date: tourDate,
          adults: adults,
          children: children,
          platform: platform,
          total_price: totalPrice,
          payment_status: 'pending',
          booking_status: 'pending',
          special_requests: null,
        });
      } catch (err) {
        console.error('Failed to save booking:', err);
      }
    })();
  };

  const getTodayDate = () => new Date().toISOString().split('T')[0];

  const handlePrevImage = () => {
    if (!product) return;
    const images = product.images && product.images.length > 0 ? product.images : [product.image_url];
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    if (!product) return;
    const images = product.images && product.images.length > 0 ? product.images : [product.image_url];
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleTouchStart = (e: React.TouchEvent) => setTouchStart(e.targetTouches[0].clientX);
  const handleTouchMove = (e: React.TouchEvent) => setTouchEnd(e.targetTouches[0].clientX);

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    if (distance > 50) handleNextImage();
    if (distance < -50) handlePrevImage();
    setTouchStart(0);
    setTouchEnd(0);
  };

  const goBack = () => {
    if (showBookingForm) {
      setShowBookingForm(false);
      window.history.pushState(null, '', `/tour/${product?.slug || product?.id}`);
    } else {
      window.history.pushState(null, '', '/');
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex justify-center items-center py-32">
          <Loader2 className="h-12 w-12 text-blue-600 animate-spin" />
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {error || 'Tour not found'}
          </h1>
          <p className="text-gray-600 mb-8">
            {t('products.noRentalsFound') || 'The tour you are looking for does not exist.'}
          </p>
          <button
            onClick={goBack}
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            <ArrowLeft className="h-5 w-5" />
            {t('common.backToHome') || 'Back to Tours'}
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  const images = product.images && product.images.length > 0 ? product.images : [product.image_url];

  return (
    <div className="min-h-screen bg-gray-50">
      <TourSEOHead product={product} language={language} />
      <Header />

      <main className="max-w-6xl mx-auto px-4 py-6 md:py-10">
        <button
          onClick={goBack}
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>{showBookingForm ? t('booking.back') : (t('common.backToHome') || 'Back to Tours')}</span>
        </button>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div
            className="relative h-64 md:h-[500px]"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <img
              src={images[currentImageIndex]}
              alt={`${getDisplayName(product, language)} - ${currentImageIndex + 1}`}
              className="w-full h-full object-cover cursor-pointer"
              onClick={() => {
                setLightboxIndex(currentImageIndex);
                setIsLightboxOpen(true);
              }}
            />

            {images.length > 1 && (
              <>
                <button
                  onClick={handlePrevImage}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 rounded-full p-2 md:p-3 hover:bg-white transition shadow-lg"
                >
                  <ChevronLeft className="h-5 w-5 md:h-6 md:w-6 text-gray-700" />
                </button>
                <button
                  onClick={handleNextImage}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 rounded-full p-2 md:p-3 hover:bg-white transition shadow-lg"
                >
                  <ChevronRight className="h-5 w-5 md:h-6 md:w-6 text-gray-700" />
                </button>

                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                  {images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-2.5 h-2.5 md:w-3 md:h-3 rounded-full transition ${
                        index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                      }`}
                    />
                  ))}
                </div>

                <div className="absolute top-4 left-4 bg-black/60 text-white px-3 py-1.5 rounded-full text-sm">
                  {currentImageIndex + 1} / {images.length}
                </div>
              </>
            )}

            <div className="absolute top-4 right-4 flex items-center gap-2">
              <span className="px-4 py-2 rounded-full text-sm font-semibold bg-white text-gray-700 shadow-lg">
                {getDisplayCategory(product, language, t)}
              </span>
              <button
                onClick={goBack}
                className="w-9 h-9 flex items-center justify-center bg-white/90 hover:bg-white rounded-full shadow-lg transition"
                aria-label="Close"
              >
                <X className="h-5 w-5 text-gray-700" />
              </button>
            </div>
          </div>

          <div className="p-6 md:p-10">
            <h1 className="text-2xl md:text-4xl font-bold text-gray-900 mb-4">
              {getDisplayName(product, language)}
            </h1>

            <div className="flex flex-wrap gap-4 text-gray-600 mb-6">
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-blue-600" />
                <span>{getDisplayLocation(product, language)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-blue-600" />
                <span>{getDisplayCategory(product, language, t)}</span>
              </div>
            </div>

            <div className="prose max-w-none mb-8">
              <div className="text-gray-700 text-base md:text-lg leading-relaxed whitespace-pre-line">
                {getDisplayDescription(product, language)}
              </div>
            </div>

            {getDisplayFeatures(product, language).length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-4">
                  {t('products.features')}
                </h2>
                <div className="flex flex-wrap gap-2">
                  {getDisplayFeatures(product, language).map((feature, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-medium border border-blue-200"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="border-t border-gray-200 pt-8">
              {!showBookingForm ? (
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                  <div>
                    <p className="text-gray-600 text-sm mb-1">{t('products.startingFrom')}</p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl md:text-3xl font-bold text-gray-900">
                        ฿{product.price_per_day.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
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
                      window.history.pushState(null, '', `/tour/${product.slug || product.id}/book`);
                    }}
                    className="flex items-center justify-center gap-2 md:gap-3 bg-blue-600 text-white px-6 py-3 md:px-8 md:py-4 rounded-xl text-base md:text-lg font-semibold hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    <MessageCircle className="h-5 w-5 md:h-6 md:w-6" />
                    <span>{t('products.bookNow')}</span>
                  </button>
                </div>
              ) : (
                <div className="max-w-xl">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-6">{t('booking.title')}</h2>

                  <div className="space-y-4 mb-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          <span>{t('booking.name')} <span className="text-red-500">*</span></span>
                        </div>
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder={t('booking.namePlaceholder')}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                      />
                    </div>

                    <PhoneInput
                      value={formData.phone}
                      onChange={(phone, countryCode, dialCode) =>
                        setFormData({ ...formData, phone, countryCode, dialCode })
                      }
                      label={t('booking.phone')}
                      placeholder={t('booking.phonePlaceholder')}
                      id="phone"
                    />

                    <div>
                      <label htmlFor="tourDate" className="block text-sm font-medium text-gray-700 mb-2">
                        <div className="flex items-center gap-2">
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
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition bg-white text-gray-900"
                        style={{ colorScheme: 'light', minHeight: '44px' }}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {t('booking.adults')}
                        </label>
                        <div className="flex items-center justify-center gap-3 border border-gray-300 rounded-lg py-2">
                          <button
                            type="button"
                            onClick={() => setFormData({ ...formData, adults: Math.max(1, formData.adults - 1) })}
                            className="w-9 h-9 flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full transition"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="text-xl font-semibold text-gray-900 w-10 text-center">
                            {formData.adults}
                          </span>
                          <button
                            type="button"
                            onClick={() => setFormData({ ...formData, adults: formData.adults + 1 })}
                            className="w-9 h-9 flex items-center justify-center bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-full transition"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {t('booking.children')}
                        </label>
                        <div className="flex items-center justify-center gap-3 border border-gray-300 rounded-lg py-2">
                          <button
                            type="button"
                            onClick={() => setFormData({ ...formData, children: Math.max(0, formData.children - 1) })}
                            className="w-9 h-9 flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full transition"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="text-xl font-semibold text-gray-900 w-10 text-center">
                            {formData.children}
                          </span>
                          <button
                            type="button"
                            onClick={() => setFormData({ ...formData, children: formData.children + 1 })}
                            className="w-9 h-9 flex items-center justify-center bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-full transition"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 border-t space-y-3">
                    <label className="flex items-start gap-3 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={agreedToTerms}
                        onChange={(e) => setAgreedToTerms(e.target.checked)}
                        className="mt-0.5 w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                      />
                      <span className="text-sm text-gray-600 leading-relaxed">
                        {t('booking.privacyConsent')}{' '}
                        <a href="/privacy-policy" target="_blank" className="text-blue-600 hover:underline">
                          {t('booking.privacyPolicy')}
                        </a>{' '}
                        {t('booking.and')}{' '}
                        <a href="/terms-and-conditions" target="_blank" className="text-blue-600 hover:underline">
                          {t('booking.termsOfService')}
                        </a>
                        <span className="text-red-500 ml-1">*</span>
                      </span>
                    </label>

                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => handleConfirmBooking('telegram')}
                        disabled={!agreedToTerms}
                        className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold transition-all shadow-lg ${
                          agreedToTerms
                            ? 'bg-blue-500 text-white hover:bg-blue-600'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/>
                        </svg>
                        <span>Telegram</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleConfirmBooking('whatsapp')}
                        disabled={!agreedToTerms}
                        className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold transition-all shadow-lg ${
                          agreedToTerms
                            ? 'bg-green-500 text-white hover:bg-green-600'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                        </svg>
                        <span>WhatsApp</span>
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setShowBookingForm(false);
                        window.history.pushState(null, '', `/tour/${product.slug || product.id}`);
                      }}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 transition"
                    >
                      {t('booking.back')}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
      {!showBookingForm && <FloatingWhatsAppButton />}
      <CookieConsent />

      <Lightbox
        images={images}
        startIndex={lightboxIndex}
        isOpen={isLightboxOpen}
        onClose={() => setIsLightboxOpen(false)}
      />
    </div>
  );
}
