import { Star } from 'lucide-react';
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

      <div className="relative z-20 h-full flex items-center py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-3xl">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 md:mb-10 leading-tight md:leading-tight">
              {t('hero.title')}
            </h1>
            <p className="text-base sm:text-lg md:text-2xl text-gray-200 mb-8 md:mb-12 leading-relaxed">
              {t('hero.subtitle')}
            </p>

            <div className="mb-8 md:mb-12">
              <div className="inline-flex items-center bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 text-white">
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400 mr-1" />
                <span className="font-bold text-lg mr-2">4.9</span>
                <span className="text-sm text-gray-200">{t('hero.rating')} 200+ {t('hero.reviews')}</span>
              </div>
            </div>

            <button
              onClick={scrollToRentals}
              className="bg-blue-600 text-white px-6 md:px-10 py-3 md:py-4 rounded-lg text-base md:text-lg font-semibold hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 w-full sm:w-auto animate-micro-bounce-once"
            >
              {t('hero.cta')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
