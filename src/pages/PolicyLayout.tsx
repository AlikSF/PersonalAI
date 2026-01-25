import { useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface PolicyLayoutProps {
  title: { en: string; ru: string };
  description: { en: string; ru: string };
  path: string;
  children: React.ReactNode;
}

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

export function PolicyLayout({ title, description, path, children }: PolicyLayoutProps) {
  const { language } = useLanguage();
  const isRussian = language === 'ru';
  const SITE_URL = 'https://phuketvibe.com';

  useEffect(() => {
    const pageTitle = isRussian ? title.ru : title.en;
    const pageDesc = isRussian ? description.ru : description.en;
    const canonicalUrl = `${SITE_URL}${path}`;

    document.title = `${pageTitle} | Phuket Vibe Tours`;

    setMeta('name', 'description', pageDesc);
    setMeta('name', 'robots', 'index, follow');

    setMeta('property', 'og:title', `${pageTitle} | Phuket Vibe Tours`);
    setMeta('property', 'og:description', pageDesc);
    setMeta('property', 'og:type', 'website');
    setMeta('property', 'og:url', canonicalUrl);

    setLink('canonical', canonicalUrl);

    return () => {
      document.title = 'Phuket Tours & Excursions | Phi Phi, Similan Islands | Phuket Vibe Tours';
    };
  }, [isRussian, title, description, path]);

  const handleBack = () => {
    window.history.pushState({}, '', '/');
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={handleBack}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="font-medium">{isRussian ? 'На главную' : 'Back to Home'}</span>
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">
          {isRussian ? title.ru : title.en}
        </h1>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
          <div className="prose prose-gray max-w-none">
            {children}
          </div>
        </div>

        <p className="text-center text-sm text-gray-500 mt-8">
          {isRussian ? 'Последнее обновление: Январь 2025' : 'Last updated: January 2025'}
        </p>
      </main>
    </div>
  );
}
