import { Users, MapPin, Star, Award } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export function TrustSection() {
  const { t } = useLanguage();

  const stats = [
    {
      icon: Users,
      value: '5000+',
      label: t('trust.customers'),
      color: 'text-blue-600',
    },
    {
      icon: MapPin,
      value: '1200+',
      label: t('trust.tours'),
      color: 'text-green-600',
    },
    {
      icon: Star,
      value: '4.9',
      label: t('trust.rating'),
      color: 'text-yellow-500',
    },
    {
      icon: Award,
      value: '5+',
      label: t('trust.experience'),
      color: 'text-orange-600',
    },
  ];

  return (
    <section className="py-12 md:py-20 bg-gradient-to-br from-blue-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 md:mb-16">
          <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-3 md:mb-4">
            {t('trust.title')}
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="text-center p-4 md:p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex justify-center mb-3 md:mb-4">
                  <Icon className={`h-8 w-8 md:h-12 md:w-12 ${stat.color}`} />
                </div>
                <div className="text-2xl md:text-4xl font-bold text-gray-900 mb-2">
                  {stat.value}
                </div>
                <div className="text-xs md:text-sm text-gray-600">
                  {stat.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
