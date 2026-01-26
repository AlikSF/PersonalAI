import { useLanguage } from '../contexts/LanguageContext';
import { LanguageSelector } from './LanguageSelector';

export function Header() {
  const { t } = useLanguage();

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
            className="flex items-center space-x-2 md:space-x-3 hover:opacity-80 transition"
          >
            <img
              src="/logo web.jpg"
              alt="Phuket Vibe Tours Logo"
              className="h-10 w-10 md:h-14 md:w-14 rounded-full object-cover shadow-sm"
            />
            <span className="text-lg md:text-2xl font-bold text-gray-900">
              Phuket Vibe Tours
            </span>
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

          <div className="flex items-center">
            <LanguageSelector />
          </div>
        </div>
      </div>
    </header>
  );
}
