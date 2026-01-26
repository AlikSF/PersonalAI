import { useState, useEffect } from 'react';
import { ArrowLeft, MapPin, Phone, Mail, Clock, Building2, Loader2 } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { supabase, CompanyInfo } from '../lib/supabase';

const SITE_URL = 'https://phuketvibe.com';

function setMeta(attr: string, key: string, value: string) {
  let meta = document.querySelector(`meta[${attr}="${key}"]`);
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute(attr, key);
    document.head.appendChild(meta);
  }
  meta.setAttribute('content', value);
}

function setLink(rel: string, href: string) {
  let link = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement;
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', rel);
    document.head.appendChild(link);
  }
  link.setAttribute('href', href);
}

function getSchemaMarkup(info: CompanyInfo): string {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'TravelAgency',
    name: info.name,
    address: {
      '@type': 'PostalAddress',
      streetAddress: info.address_en || info.address,
      addressLocality: 'Patong',
      addressRegion: 'Phuket',
      postalCode: '83150',
      addressCountry: 'TH',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 7.8965,
      longitude: 98.2972,
    },
    url: SITE_URL,
    ...(info.phone && { telephone: info.phone }),
    ...(info.email && { email: info.email }),
    ...(info.google_maps_place_id && { hasMap: `https://www.google.com/maps/place/?q=place_id:${info.google_maps_place_id}` }),
    priceRange: '$$',
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      opens: '08:00',
      closes: '22:00',
    },
  };
  return JSON.stringify(schema);
}

export function ContactPage() {
  const { language } = useLanguage();
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo | null>(null);
  const [loading, setLoading] = useState(true);

  const translations: Record<string, Record<string, string>> = {
    en: {
      title: 'Contact Us',
      description: 'Get in touch with PhuketVibe Tours',
      backHome: 'Back to Home',
      address: 'Address',
      phone: 'Phone',
      email: 'Email',
      hours: 'Opening Hours',
      category: 'Business Category',
      findUs: 'Find Us',
      getDirections: 'Get Directions',
      loadingError: 'Unable to load contact information',
    },
    ru: {
      title: 'Контакты',
      description: 'Свяжитесь с PhuketVibe Tours',
      backHome: 'На главную',
      address: 'Адрес',
      phone: 'Телефон',
      email: 'Email',
      hours: 'Часы работы',
      category: 'Категория бизнеса',
      findUs: 'Как нас найти',
      getDirections: 'Построить маршрут',
      loadingError: 'Не удалось загрузить контактную информацию',
    },
    az: {
      title: 'Bizimlə Əlaqə',
      description: 'PhuketVibe Tours ilə əlaqə saxlayın',
      backHome: 'Ana səhifəyə',
      address: 'Ünvan',
      phone: 'Telefon',
      email: 'Email',
      hours: 'İş saatları',
      category: 'Biznes kateqoriyası',
      findUs: 'Bizi tapın',
      getDirections: 'Yol tarifini al',
      loadingError: 'Əlaqə məlumatları yüklənə bilmədi',
    },
    kk: {
      title: 'Байланыс',
      description: 'PhuketVibe Tours-пен байланысыңыз',
      backHome: 'Басты бетке',
      address: 'Мекенжай',
      phone: 'Телефон',
      email: 'Email',
      hours: 'Жұмыс уақыты',
      category: 'Бизнес санаты',
      findUs: 'Бізді табыңыз',
      getDirections: 'Бағыт алу',
      loadingError: 'Байланыс ақпаратын жүктеу мүмкін емес',
    },
    ky: {
      title: 'Байланыш',
      description: 'PhuketVibe Tours менен байланышыңыз',
      backHome: 'Башкы бетке',
      address: 'Дарек',
      phone: 'Телефон',
      email: 'Email',
      hours: 'Иш убактысы',
      category: 'Бизнес категориясы',
      findUs: 'Бизди табыңыз',
      getDirections: 'Багыт алуу',
      loadingError: 'Байланыш маалыматын жүктөө мүмкүн эмес',
    },
    zh: {
      title: '联系我们',
      description: '与PhuketVibe Tours取得联系',
      backHome: '返回首页',
      address: '地址',
      phone: '电话',
      email: '邮箱',
      hours: '营业时间',
      category: '业务类别',
      findUs: '如何找到我们',
      getDirections: '获取路线',
      loadingError: '无法加载联系信息',
    },
    fr: {
      title: 'Contactez-nous',
      description: 'Contactez PhuketVibe Tours',
      backHome: 'Retour à l\'accueil',
      address: 'Adresse',
      phone: 'Téléphone',
      email: 'Email',
      hours: 'Heures d\'ouverture',
      category: 'Catégorie d\'entreprise',
      findUs: 'Nous trouver',
      getDirections: 'Obtenir l\'itinéraire',
      loadingError: 'Impossible de charger les informations de contact',
    },
    uz: {
      title: 'Biz bilan bog\'laning',
      description: 'PhuketVibe Tours bilan bog\'laning',
      backHome: 'Bosh sahifaga',
      address: 'Manzil',
      phone: 'Telefon',
      email: 'Email',
      hours: 'Ish vaqti',
      category: 'Biznes toifasi',
      findUs: 'Bizni toping',
      getDirections: 'Yo\'nalishni olish',
      loadingError: 'Aloqa ma\'lumotlarini yuklab bo\'lmadi',
    },
  };

  const t = translations[language] || translations.en;

  useEffect(() => {
    fetchCompanyInfo();
  }, []);

  useEffect(() => {
    const canonicalUrl = `${SITE_URL}/contact`;
    document.title = `${t.title} | PhuketVibe Tours`;
    setMeta('name', 'description', t.description);
    setMeta('name', 'robots', 'index, follow');
    setMeta('property', 'og:title', `${t.title} | PhuketVibe Tours`);
    setMeta('property', 'og:description', t.description);
    setMeta('property', 'og:type', 'website');
    setMeta('property', 'og:url', canonicalUrl);
    setLink('canonical', canonicalUrl);

    return () => {
      document.title = 'Phuket Tours & Excursions | Phi Phi, Similan Islands | PhuketVibe Tours';
    };
  }, [language, t]);

  useEffect(() => {
    if (companyInfo) {
      let script = document.querySelector('script[type="application/ld+json"][data-schema="business"]') as HTMLScriptElement;
      if (!script) {
        script = document.createElement('script');
        script.type = 'application/ld+json';
        script.setAttribute('data-schema', 'business');
        document.head.appendChild(script);
      }
      script.textContent = getSchemaMarkup(companyInfo);

      return () => {
        script?.remove();
      };
    }
  }, [companyInfo]);

  const fetchCompanyInfo = async () => {
    try {
      const { data, error } = await supabase
        .from('company_info')
        .select('*')
        .maybeSingle();

      if (error) throw error;
      setCompanyInfo(data);
    } catch (error) {
      console.error('Error fetching company info:', error);
    } finally {
      setLoading(false);
    }
  };

  const getLocalizedField = (
    baseValue: string | null | undefined,
    langValues: Record<string, string | null | undefined>
  ): string => {
    if (language !== 'ru' && langValues[language]?.trim()) {
      return langValues[language]!.trim();
    }
    return baseValue || '';
  };

  const handleBack = () => {
    window.history.pushState({}, '', '/');
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (!companyInfo) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <button
              onClick={handleBack}
              className="inline-flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span className="font-medium">{t.backHome}</span>
            </button>
          </div>
        </header>
        <div className="max-w-4xl mx-auto px-4 py-20 text-center">
          <p className="text-gray-500">{t.loadingError}</p>
        </div>
      </div>
    );
  }

  const displayAddress = getLocalizedField(companyInfo.address, {
    en: companyInfo.address_en,
    az: companyInfo.address_az,
    kk: companyInfo.address_kk,
    ky: companyInfo.address_ky,
    zh: companyInfo.address_zh,
    fr: companyInfo.address_fr,
    uz: companyInfo.address_uz,
  });

  const displayOpeningHours = getLocalizedField(companyInfo.opening_hours, {
    en: companyInfo.opening_hours_en,
    az: companyInfo.opening_hours_az,
    kk: companyInfo.opening_hours_kk,
    ky: companyInfo.opening_hours_ky,
    zh: companyInfo.opening_hours_zh,
    fr: companyInfo.opening_hours_fr,
    uz: companyInfo.opening_hours_uz,
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={handleBack}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="font-medium">{t.backHome}</span>
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">
          {t.title}
        </h1>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">{companyInfo.name}</h2>

            <div className="space-y-5">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                  <MapPin className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">{t.address}</h3>
                  <p className="text-gray-900">{displayAddress}</p>
                </div>
              </div>

              {companyInfo.phone && (
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                    <Phone className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">{t.phone}</h3>
                    <a
                      href={`tel:${companyInfo.phone}`}
                      className="text-gray-900 hover:text-blue-600 transition-colors"
                    >
                      {companyInfo.phone}
                    </a>
                  </div>
                </div>
              )}

              {companyInfo.email && (
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center">
                    <Mail className="h-5 w-5 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">{t.email}</h3>
                    <a
                      href={`mailto:${companyInfo.email}`}
                      className="text-gray-900 hover:text-blue-600 transition-colors"
                    >
                      {companyInfo.email}
                    </a>
                  </div>
                </div>
              )}

              {displayOpeningHours && (
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                    <Clock className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">{t.hours}</h3>
                    <p className="text-gray-900 whitespace-pre-line">{displayOpeningHours}</p>
                  </div>
                </div>
              )}

              {companyInfo.business_category && (
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-teal-50 rounded-lg flex items-center justify-center">
                    <Building2 className="h-5 w-5 text-teal-600" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">{t.category}</h3>
                    <p className="text-gray-900">{companyInfo.business_category}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">{t.findUs}</h2>

            {companyInfo.google_maps_url ? (
              <div className="space-y-4">
                <div className="aspect-[4/3] rounded-lg overflow-hidden bg-gray-100">
                  <iframe
                    src={companyInfo.google_maps_url}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Business Location"
                  />
                </div>
                {companyInfo.google_maps_place_id && (
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination_place_id=${companyInfo.google_maps_place_id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <MapPin className="h-4 w-4" />
                    {t.getDirections}
                  </a>
                )}
              </div>
            ) : (
              <div className="aspect-[4/3] rounded-lg bg-gray-100 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <MapPin className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Map coming soon</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
