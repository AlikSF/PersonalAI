import { useState, useEffect, useRef, useCallback } from 'react';
import { Users, MapPin, Star, Award } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

function useCountUp(end: number, duration: number, start: boolean, decimals = 0) {
  const [value, setValue] = useState(0);
  const frameRef = useRef<number>(0);

  useEffect(() => {
    if (!start) return;

    let startTime: number | null = null;
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(parseFloat((eased * end).toFixed(decimals)));
      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      }
    };
    frameRef.current = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(frameRef.current);
  }, [start, end, duration, decimals]);

  return value;
}

interface StatConfig {
  icon: typeof Users;
  numericValue: number;
  decimals: number;
  suffix: string;
  label: string;
  color: string;
}

function AnimatedStat({ stat, hasAnimated }: { stat: StatConfig; hasAnimated: boolean }) {
  const Icon = stat.icon;
  const count = useCountUp(stat.numericValue, 1800, hasAnimated, stat.decimals);
  const display = hasAnimated
    ? `${stat.decimals > 0 ? count.toFixed(stat.decimals) : Math.round(count)}${stat.suffix}`
    : `0${stat.suffix}`;

  return (
    <div className="text-center p-4 md:p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-center mb-3 md:mb-4">
        <Icon className={`h-8 w-8 md:h-12 md:w-12 ${stat.color}`} />
      </div>
      <div className="text-2xl md:text-4xl font-bold text-gray-900 mb-2">
        {display}
      </div>
      <div className="text-xs md:text-sm text-gray-600">
        {stat.label}
      </div>
    </div>
  );
}

export function TrustSection() {
  const { t } = useLanguage();
  const sectionRef = useRef<HTMLDivElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  const handleIntersection = useCallback((entries: IntersectionObserverEntry[]) => {
    if (entries[0].isIntersecting && !hasAnimated) {
      setHasAnimated(true);
    }
  }, [hasAnimated]);

  useEffect(() => {
    const observer = new IntersectionObserver(handleIntersection, {
      threshold: 0.3,
    });
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [handleIntersection]);

  const stats: StatConfig[] = [
    {
      icon: Users,
      numericValue: 5000,
      decimals: 0,
      suffix: '+',
      label: t('trust.customers'),
      color: 'text-blue-600',
    },
    {
      icon: MapPin,
      numericValue: 1200,
      decimals: 0,
      suffix: '+',
      label: t('trust.tours'),
      color: 'text-green-600',
    },
    {
      icon: Star,
      numericValue: 4.9,
      decimals: 1,
      suffix: '',
      label: t('trust.rating'),
      color: 'text-yellow-500',
    },
    {
      icon: Award,
      numericValue: 5,
      decimals: 0,
      suffix: '+',
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

        <div ref={sectionRef} className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {stats.map((stat, index) => (
            <AnimatedStat key={index} stat={stat} hasAnimated={hasAnimated} />
          ))}
        </div>
      </div>
    </section>
  );
}
