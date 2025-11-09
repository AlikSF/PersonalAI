import { useLanguage } from '../contexts/LanguageContext';

export function Hero() {
  const { t } = useLanguage();
  const scrollToRentals = () => {
    const rentalsSection = document.getElementById('rentals');
    if (rentalsSection) {
      rentalsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative h-[calc(100vh-64px)] md:h-screen min-h-[500px]">
      <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 to-slate-800/70 z-10"></div>
      <img
        src="https://images.pexels.com/photos/1268855/pexels-photo-1268855.jpeg"
        alt="Luxury tropical resort"
        className="absolute inset-0 w-full h-full object-cover"
      />

      <div className="relative z-20 h-full flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-3xl">
            <h1 className="text-3xl sm:text-4xl md:text-7xl font-bold text-white mb-4 md:mb-6 leading-tight">
              {t('hero.title')}
            </h1>
            <p className="text-base sm:text-lg md:text-2xl text-gray-200 mb-6 md:mb-10 leading-relaxed">
              {t('hero.subtitle')}
            </p>
            <button
              onClick={scrollToRentals}
              className="bg-blue-600 text-white px-6 md:px-10 py-3 md:py-4 rounded-lg text-base md:text-lg font-semibold hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 w-full sm:w-auto"
            >
              {t('hero.cta')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
