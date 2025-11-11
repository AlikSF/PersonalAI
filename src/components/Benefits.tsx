import { Shield, Clock, DollarSign } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export function Benefits() {
  const { t } = useLanguage();

  const benefits = [
    {
      icon: Shield,
      title: t('benefits.verified'),
      description: t('benefits.verifiedDesc'),
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      icon: Clock,
      title: t('benefits.support'),
      description: t('benefits.supportDesc'),
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      icon: DollarSign,
      title: t('benefits.price'),
      description: t('benefits.priceDesc'),
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
  ];

  return (
    <section className="py-12 md:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <div
                key={index}
                className="text-center p-6 md:p-8 rounded-xl hover:shadow-lg transition-shadow"
              >
                <div className={`${benefit.bgColor} w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6`}>
                  <Icon className={`h-8 w-8 md:h-10 md:w-10 ${benefit.color}`} />
                </div>
                <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2 md:mb-3">
                  {benefit.title}
                </h3>
                <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
