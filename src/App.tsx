import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Benefits } from './components/Benefits';
import { TrustSection } from './components/TrustSection';
import { ProductCard } from './components/ProductCard';
import { ProductDetails } from './components/ProductDetails';
import { Testimonials } from './components/Testimonials';
import { ContactForm } from './components/ContactForm';
import { AdminPanel } from './components/AdminPanel';
import { Footer } from './components/Footer';
import { FloatingWhatsAppButton } from './components/FloatingWhatsAppButton';
import { Product, supabase } from './lib/supabase';
import { Loader2, Search, X } from 'lucide-react';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';

function AppContent() {
  const { t, language } = useLanguage();
  const [currentPage, setCurrentPage] = useState('home');
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showProductDetails, setShowProductDetails] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const path = window.location.pathname;
    if (path === '/admin') {
      setCurrentPage('admin');
    } else {
      setCurrentPage('home');
    }

    const handlePopState = () => {
      const path = window.location.pathname;
      if (path === '/admin') {
        setCurrentPage('admin');
      } else {
        setCurrentPage('home');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [products, categoryFilter, searchQuery, language]);

  const fetchProducts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_active', true)
      .order('priority', { ascending: true, nullsLast: true })
      .order('created_at', { ascending: false });

    if (!error && data) {
      setProducts(data);
    }
    setLoading(false);
  };

  const filterProducts = () => {
    let filtered = [...products];

    if (categoryFilter) {
      filtered = filtered.filter((p) => p.category === categoryFilter);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((p) => {
        const name = language === 'en' ? (p.name_en || p.name) :
                     language === 'az' ? (p.name_az || p.name) :
                     language === 'kk' ? (p.name_kk || p.name) :
                     language === 'ky' ? (p.name_ky || p.name) :
                     language === 'zh' ? (p.name_zh || p.name) :
                     language === 'fr' ? (p.name_fr || p.name) :
                     language === 'uz' ? (p.name_uz || p.name) :
                     p.name;

        const location = language === 'en' ? (p.location_en || p.location) :
                         language === 'az' ? (p.location_az || p.location) :
                         language === 'kk' ? (p.location_kk || p.location) :
                         language === 'ky' ? (p.location_ky || p.location) :
                         language === 'zh' ? (p.location_zh || p.location) :
                         language === 'fr' ? (p.location_fr || p.location) :
                         language === 'uz' ? (p.location_uz || p.location) :
                         p.location;

        const category = language === 'en' ? (p.category_en || p.category) :
                         language === 'az' ? (p.category_az || p.category) :
                         language === 'kk' ? (p.category_kk || p.category) :
                         language === 'ky' ? (p.category_ky || p.category) :
                         language === 'zh' ? (p.category_zh || p.category) :
                         language === 'fr' ? (p.category_fr || p.category) :
                         language === 'uz' ? (p.category_uz || p.category) :
                         p.category;

        return (name?.toLowerCase().includes(query) ||
                location?.toLowerCase().includes(query) ||
                category?.toLowerCase().includes(query));
      });
    }

    setFilteredProducts(filtered);
  };

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


  if (currentPage === 'admin') {
    return <AdminPanel />;
  }

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
                placeholder={t('products.filter.all')}
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
        ) : (
          <>
            <div className="mb-4 md:mb-6 text-center">
              <p className="text-gray-600 text-lg">
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
    </div>
  );
}

function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}

export default App;
