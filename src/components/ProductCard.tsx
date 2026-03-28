import { useState, memo } from 'react';
import { MapPin, ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { Product } from '../lib/supabase';
import { useLanguage } from '../contexts/LanguageContext';
import { getDisplayName, getDisplayLocation, getDisplayFeatures, getDisplayCategory } from '../lib/productHelpers';
import { generateTourUrl } from '../lib/router';

interface ProductCardProps {
  product: Product;
  onViewDetails: (product: Product) => void;
  eager?: boolean;
  useUrlNavigation?: boolean;
}

function ProductCardComponent({ product, onViewDetails, eager = false, useUrlNavigation = true }: ProductCardProps) {
  const { t, language } = useLanguage();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  const images = product.images && product.images.length > 0 ? product.images : [product.image_url];

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    e.stopPropagation();
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && currentImageIndex < images.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
    if (isRightSwipe && currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }

    setTouchStart(0);
    setTouchEnd(0);
  };

  const handleClick = (e: React.MouseEvent) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'select_item', {
        currency: 'THB',
        value: product.price_per_day,
        item_list_name: 'Tours',
        items: [{
          item_id: product.id,
          item_name: getDisplayName(product, language),
          item_category: getDisplayCategory(product, language, t),
          price: product.price_per_day,
        }],
        tour_name: getDisplayName(product, language),
        tour_id: product.id,
        tour_slug: product.slug || '',
        tour_category: getDisplayCategory(product, language, t),
        tour_price: product.price_per_day,
      });
    }

    if (useUrlNavigation) {
      e.preventDefault();
      sessionStorage.setItem('scrollPosition', window.scrollY.toString());
      const tourUrl = generateTourUrl(product.slug, product.id);
      window.history.pushState(null, '', tourUrl);
      window.dispatchEvent(new PopStateEvent('popstate'));
    } else {
      onViewDetails(product);
    }
  };

  const tourUrl = generateTourUrl(product.slug, product.id);

  return (
    <a
      href={tourUrl}
      onClick={handleClick}
      className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group flex flex-col h-full no-underline"
    >
      <div
        className="relative h-40 md:h-56 overflow-hidden flex-shrink-0"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {imageLoading && (
          <div className="absolute inset-0 bg-slate-200 animate-pulse" />
        )}
        {imageError ? (
          <div className="absolute inset-0 bg-slate-100 flex items-center justify-center">
            <span className="text-slate-400 text-sm">Image unavailable</span>
          </div>
        ) : (
          <img
            src={images[currentImageIndex]}
            alt={`${getDisplayName(product, language)} - ${currentImageIndex + 1}`}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            loading={eager ? "eager" : "lazy"}
            onLoad={() => setImageLoading(false)}
            onError={() => {
              setImageLoading(false);
              setImageError(true);
            }}
          />
        )}

        {images.length > 1 && (
          <>
            <button
              onClick={handlePrevImage}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 rounded-full p-1 hover:bg-white transition opacity-0 group-hover:opacity-100"
            >
              <ChevronLeft className="h-3 w-3 md:h-4 md:w-4 text-gray-700" />
            </button>
            <button
              onClick={handleNextImage}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 rounded-full p-1 hover:bg-white transition opacity-0 group-hover:opacity-100"
            >
              <ChevronRight className="h-3 w-3 md:h-4 md:w-4 text-gray-700" />
            </button>

            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
              {images.map((_, index) => (
                <div
                  key={index}
                  className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full transition ${
                    index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          </>
        )}

        <div className="absolute top-2 left-2 right-2 md:top-4 md:left-4 md:right-4 flex items-start justify-between gap-1 md:gap-2">
          {product.priority !== null && product.priority !== undefined && product.priority <= 3 && (
            <span className="px-1.5 py-0.5 md:px-2.5 md:py-1 rounded-full text-[10px] md:text-xs font-semibold bg-red-500 text-white shadow-md whitespace-nowrap">
              🔥 HOT
            </span>
          )}
          <span className="px-2 py-1 md:px-3 rounded-full text-xs md:text-sm font-semibold bg-white text-gray-700 ml-auto whitespace-nowrap">
            {getDisplayCategory(product, language, t)}
          </span>
        </div>
      </div>

      <div className="p-3 md:p-5 flex flex-col flex-grow">
        <h3 className="text-sm md:text-lg font-bold text-gray-900 mb-1 md:mb-2 group-hover:text-blue-600 transition line-clamp-2">
          {getDisplayName(product, language)}
        </h3>

        <div className="flex items-center text-gray-600 text-xs md:text-sm mb-2 md:mb-3">
          <MapPin className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0" />
          <span className="truncate ml-1">{getDisplayLocation(product, language)}</span>
        </div>

        <div className="flex flex-wrap gap-1 md:gap-2 mb-3 md:mb-4">
          {getDisplayFeatures(product, language).slice(0, 2).map((feature, index) => (
            <span
              key={index}
              className="bg-blue-50 text-blue-700 text-[10px] md:text-xs px-2 py-0.5 md:px-2 md:py-1 rounded-full"
            >
              {feature}
            </span>
          ))}
        </div>

        <div className="mt-auto pt-3 md:pt-4 border-t">
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="text-base md:text-xl font-bold text-gray-900">
                ฿{product.price_per_day}
              </p>
              <p className="text-[10px] md:text-xs text-gray-500">{t('products.startingFrom')}</p>
            </div>
          </div>
          <span className="w-full bg-blue-600 text-white py-2 md:py-2.5 rounded-lg text-xs md:text-sm font-semibold hover:bg-blue-700 transition group-hover:shadow-lg flex items-center justify-center gap-1 overflow-hidden">
            <span className="transition-transform duration-300 group-hover:-translate-x-1">{t('products.viewDetails')}</span>
            <ArrowRight className="h-3.5 w-3.5 md:h-4 md:w-4 opacity-0 -translate-x-3 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0" />
          </span>
        </div>
      </div>
    </a>
  );
}

export const ProductCard = memo(ProductCardComponent);
