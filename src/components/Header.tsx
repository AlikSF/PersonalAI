import { useLanguage } from '../contexts/LanguageContext';
import { LanguageSelector } from './LanguageSelector';

export function Header() {
  const { t } = useLanguage();

  const isHomePage = () => {
    const path = window.location.pathname;
    return path === '/' || path === '';
  };

  const navigateToHome = () => {
    if (isHomePage()) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      window.history.pushState(null, '', '/');
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  };

  const navigateToSection = (id: string) => {
    if (isHomePage()) {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      window.history.pushState(null, '', `/#${id}`);
      window.dispatchEvent(new PopStateEvent('popstate'));
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  };

  return (
    <header className="bg-white/95 backdrop-blur-sm shadow-sm fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          <button
            onClick={navigateToHome}
            className="flex items-center space-x-2 md:space-x-3 hover:opacity-80 transition"
          >
            <img
              src="/companylogo.jpg"
              alt="Phuket Vibe Tours Logo"
              className="h-10 w-10 md:h-14 md:w-14 rounded-full object-cover shadow-sm"
            />
            <span className="text-lg md:text-2xl font-bold text-gray-900">
              Phuket Vibe Tours
            </span>
          </button>

          <nav className="hidden md:flex items-center space-x-8">
            <button
              onClick={navigateToHome}
              className="text-gray-700 hover:text-blue-600 transition font-medium"
            >
              {t('nav.home')}
            </button>
            <button
              onClick={() => navigateToSection('rentals')}
              className="text-gray-700 hover:text-blue-600 transition font-medium"
            >
              {t('nav.products')}
            </button>
            <button
              onClick={() => navigateToSection('contact')}
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
