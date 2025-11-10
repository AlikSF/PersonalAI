import { Languages } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export function Header() {
  const { language, setLanguage, t } = useLanguage();

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="bg-white/95 backdrop-blur-sm shadow-sm fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="text-lg md:text-2xl font-bold text-gray-900 hover:text-blue-600 transition"
          >
            LuxeRentals
          </button>

          <nav className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="text-gray-700 hover:text-blue-600 transition font-medium"
            >
              {t('nav.home')}
            </button>
            <button
              onClick={() => scrollToSection('rentals')}
              className="text-gray-700 hover:text-blue-600 transition font-medium"
            >
              {t('nav.products')}
            </button>
            <button
              onClick={() => scrollToSection('contact')}
              className="text-gray-700 hover:text-blue-600 transition font-medium"
            >
              {t('nav.contact')}
            </button>
          </nav>

          <div className="flex items-center space-x-2 md:space-x-4">
            <button
              onClick={() => setLanguage(language === 'ru' ? 'en' : 'ru')}
              className="flex items-center space-x-1 md:space-x-2 px-3 md:px-4 py-2 hover:bg-gray-100 rounded-lg transition"
            >
              <Languages className="h-4 w-4 md:h-5 md:w-5 text-gray-700" />
              <span className="text-xs md:text-sm font-medium text-gray-700 uppercase">
                {language}
              </span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
