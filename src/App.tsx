import { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Benefits } from './components/Benefits';
import { TrustSection } from './components/TrustSection';
import { ProductCard } from './components/ProductCard';
import { ProductDetails } from './components/ProductDetails';
import { Testimonials } from './components/Testimonials';
import { ContactForm } from './components/ContactForm';
import { Footer } from './components/Footer';
import { FloatingWhatsAppButton } from './components/FloatingWhatsAppButton';
import { CookieConsent } from './components/CookieConsent';
import { PrivacyPolicy } from './pages/PrivacyPolicy';
import { TermsAndConditions } from './pages/TermsAndConditions';
import { RefundPolicy } from './pages/RefundPolicy';
import { CookiePolicy } from './pages/CookiePolicy';
import { TourPage } from './pages/TourPage';
import { Product, supabase } from './lib/supabase';
import { Loader2, Search, X } from 'lucide-react';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import { AuthProvider } from './contexts/AuthContext';
import { AdminRouter } from './admin/AdminRouter';
import { getDisplayName } from './lib/productHelpers';

function AppContent() {
  const { t, language } = useLanguage();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showProductDetails, setShowProductDetails] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data, error: fetchError } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .order('priority', { ascending: true, nullsLast: true })
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      if (data) setProducts(data);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError(err instanceof Error ? err.message : 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    if (categoryFilter) {
      filtered = filtered.filter((p) => p.category === categoryFilter);
    }

    if (debouncedSearchQuery.trim()) {
      const query = debouncedSearchQuery.toLowerCase();

      filtered = filtered.filter((p) => {
        const getField = (langField: string | null | undefined, baseField: string) => {
          return (langField || baseField || '').toLowerCase();
        };

        const langFieldMap: Record<string, keyof Product> = {
          en: `name_en` as keyof Product,
          az: `name_az` as keyof Product,
          kk: `name_kk` as keyof Product,
          ky: `name_ky` as keyof Product,
          zh: `name_zh` as keyof Product,
          fr: `name_fr` as keyof Product,
          uz: `name_uz` as keyof Product,
        };

        const getName = () => {
          const field = langFieldMap[language];
          return field ? getField(p[field] as string, p.name) : p.name.toLowerCase();
        };

        const getDesc = () => {
          const field = (`description_${language === 'ru' ? '' : language}`.replace('description_', 'description_') || 'description') as keyof Product;
          return field !== 'description' ? getField(p[field] as string, p.description) : p.description.toLowerCase();
        };

        const getLoc = () => {
          const field = (`location_${language === 'ru' ? '' : language}`.replace('location_', 'location_') || 'location') as keyof Product;
          return field !== 'location' ? getField(p[field] as string, p.location) : p.location.toLowerCase();
        };

        const name = getName();
        const description = getDesc();
        const location = getLoc();
        const category = p.category?.toLowerCase() || '';
        const features = p.features ? JSON.stringify(p.features).toLowerCase() : '';

        return (
          name.includes(query) ||
          description.includes(query) ||
          location.includes(query) ||
          category.includes(query) ||
          features.includes(query)
        );
      });

      filtered.sort((a, b) => {
        const aName = getDisplayName(a, language).toLowerCase();
        const bName = getDisplayName(b, language).toLowerCase();
        const aMatch = aName.includes(query) ? 1 : 0;
        const bMatch = bName.includes(query) ? 1 : 0;
        return bMatch - aMatch;
      });
    }

    return filtered;
  }, [products, categoryFilter, debouncedSearchQuery, language]);

  const handleViewDetails = (product: Product) => {
    setSelectedProduct(product);
    setShowProductDetails(true);
  };

  const handleCloseDetails = () => {
    setShowProductDetails(false);
    setSelectedProduct(null);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    // Remove focus to close keyboard on mobile
    const searchInput = document.querySelector('input[type="search"]') as HTMLInputElement;
    if (searchInput) {
      searchInput.blur();
    }
  };

  const scrollToContact = () => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Hero />

      <main id="rentals" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-3 md:mb-4">
            {t('products.title')}
          </h2>
          <p className="text-base md:text-xl text-gray-600 max-w-2xl mx-auto">
            {t('products.subtitle')}
          </p>
        </div>

        <div className="mb-8 md:mb-12">
          <div className="max-w-2xl mx-auto mb-6 md:mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 md:h-5 md:w-5 text-gray-400 pointer-events-none" />
              <input
                type="search"
                enterKeyHint="search"
                inputMode="search"
                placeholder={t('products.searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 md:pl-12 pr-10 md:pr-12 py-3 md:py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none text-gray-900 text-base md:text-lg"
              />
              {searchQuery && (
                <button
                  onClick={handleClearSearch}
                  className="absolute right-3 md:right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1"
                  aria-label="Clear search"
                  type="button"
                >
                  <X className="h-4 w-4 md:h-5 md:w-5" />
                </button>
              )}
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-2 md:gap-3 mb-6 md:mb-8">
            {[
              { value: '', labelKey: 'products.filter.all' },
              { value: 'Трансфер', labelKey: 'products.filter.transfer' },
              { value: 'Острова', labelKey: 'products.filter.islands' },
              { value: 'Озеро', labelKey: 'products.filter.mainland' },
              { value: 'Экстрим', labelKey: 'products.filter.extreme' },
              { value: 'Клубы', labelKey: 'products.filter.clubs' },
              { value: 'Шоу', labelKey: 'products.filter.show' },
              { value: 'Инста туры', labelKey: 'products.filter.insta' },
              { value: 'Приват туры', labelKey: 'products.filter.private' },
            ].map((category) => (
              <button
                key={category.value}
                onClick={() => setCategoryFilter(category.value)}
                className={`px-3 md:px-5 py-1.5 md:py-2 rounded-full font-medium transition text-xs md:text-sm ${
                  categoryFilter === category.value
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:border-blue-600'
                }`}
              >
                {t(category.labelKey)}
              </button>
            ))}
          </div>
        </div>
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-12 w-12 text-blue-600 animate-spin" />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
              <p className="text-red-700 text-center mb-4">{error}</p>
              <button
                onClick={fetchProducts}
                className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
              >
                {t('common.retry') || 'Try Again'}
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-4 md:mb-6 text-center">
              <p className="text-gray-600 text-lg">
                {searchQuery && searchQuery !== debouncedSearchQuery && (
                  <span className="inline-flex items-center gap-2 text-blue-600 mr-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Searching...
                  </span>
                )}
                {filteredProducts.length} {filteredProducts.length === 1 ? t('products.rental') : t('products.rentals')}{' '}
                {t('products.available')}
              </p>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-gray-500 text-lg">
                  {t('products.noRentalsFound')}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onViewDetails={handleViewDetails}
                    eager={true}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </main>

      <Benefits />

      <TrustSection />

      <Testimonials />

      <ContactForm />

      <Footer />

      {!showProductDetails && <FloatingWhatsAppButton />}

      {showProductDetails && (
        <ProductDetails
          product={selectedProduct}
          onClose={handleCloseDetails}
        />
      )}

      <CookieConsent />
    </div>
  );
}

function useRoute() {
  const [path, setPath] = useState(window.location.pathname);

  useEffect(() => {
    const handlePopState = () => setPath(window.location.pathname);
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  return path;
}

function PolicyPage({ path }: { path: string }) {
  switch (path) {
    case '/privacy-policy':
      return <PrivacyPolicy />;
    case '/terms-and-conditions':
      return <TermsAndConditions />;
    case '/refund-policy':
      return <RefundPolicy />;
    case '/cookie-policy':
      return <CookiePolicy />;
    default:
      return null;
  }
}

function parseTourRoute(path: string): { slug: string; showBooking: boolean } | null {
  const tourMatch = path.match(/^\/tour\/([^/]+)$/);
  if (tourMatch) {
    return { slug: decodeURIComponent(tourMatch[1]), showBooking: false };
  }

  const bookingMatch = path.match(/^\/tour\/([^/]+)\/book$/);
  if (bookingMatch) {
    return { slug: decodeURIComponent(bookingMatch[1]), showBooking: true };
  }

  return null;
}

function App() {
  const path = useRoute();
  const isAdmin = path.startsWith('/admin');
  const isPolicyPage = ['/privacy-policy', '/terms-and-conditions', '/refund-policy', '/cookie-policy'].includes(path);
  const tourRoute = parseTourRoute(path);

  if (isAdmin) {
    return (
      <AuthProvider>
        <AdminRouter />
      </AuthProvider>
    );
  }

  if (isPolicyPage) {
    return (
      <LanguageProvider>
        <PolicyPage path={path} />
        <CookieConsent />
      </LanguageProvider>
    );
  }

  if (tourRoute) {
    return (
      <LanguageProvider>
        <TourPage slug={tourRoute.slug} showBooking={tourRoute.showBooking} />
      </LanguageProvider>
    );
  }

  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}

export default App;
