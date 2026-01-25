import { useState, useEffect, useCallback } from 'react';
import { Cookie, X } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const GA4_ID = 'G-LTF5JCLRBD';
const COOKIE_CONSENT_KEY = 'cookie_consent';

type ConsentStatus = 'accepted' | 'rejected' | null;

function loadGA4() {
  if (document.querySelector(`script[src*="googletagmanager.com/gtag/js?id=${GA4_ID}"]`)) {
    return;
  }

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag(...args: unknown[]) {
    window.dataLayer.push(args);
  };
  window.gtag('js', new Date());
  window.gtag('config', GA4_ID);
}

function getStoredConsent(): ConsentStatus {
  const stored = localStorage.getItem(COOKIE_CONSENT_KEY);
  if (stored === 'accepted' || stored === 'rejected') {
    return stored;
  }
  return null;
}

const cookieTranslations: Record<string, {
  title: string;
  description: string;
  accept: string;
  reject: string;
}> = {
  ru: {
    title: 'Мы используем файлы cookie',
    description: 'Мы используем файлы cookie для анализа трафика и улучшения работы сайта. Нажимая "Принять", вы соглашаетесь с использованием аналитических cookie.',
    accept: 'Принять',
    reject: 'Отклонить',
  },
  en: {
    title: 'We use cookies',
    description: 'We use cookies for traffic analysis and to improve our website. By clicking "Accept", you agree to the use of analytics cookies.',
    accept: 'Accept',
    reject: 'Reject',
  },
  kk: {
    title: 'Біз cookie файлдарын қолданамыз',
    description: 'Біз трафикті талдау және сайт жұмысын жақсарту үшін cookie файлдарын қолданамыз. "Қабылдау" түймесін басу арқылы сіз аналитикалық cookie файлдарын пайдалануға келісесіз.',
    accept: 'Қабылдау',
    reject: 'Қабылдамау',
  },
  ky: {
    title: 'Биз cookie файлдарын колдонобуз',
    description: 'Биз трафикти талдоо жана сайттын иштешин жакшыртуу үчүн cookie файлдарын колдонобуз. "Кабыл алуу" баскычын басуу менен сиз аналитикалык cookie файлдарын колдонууга макул болосуз.',
    accept: 'Кабыл алуу',
    reject: 'Баш тартуу',
  },
  az: {
    title: 'Biz cookie fayllarindan istifade edirik',
    description: 'Trafik tehlili ve saytimizin islemesin yaxsilasidirmaq uchun cookie fayllarindan istifade edirik. "Qebul et" duymesin basaraq analitik cookie fayllarindan istifadeye razi olursunuz.',
    accept: 'Qebul et',
    reject: 'Imtina et',
  },
  zh: {
    title: '我们使用 Cookie',
    description: '我们使用 Cookie 进行流量分析并改善我们的网站。点击"接受"即表示您同意使用分析 Cookie。',
    accept: '接受',
    reject: '拒绝',
  },
  fr: {
    title: 'Nous utilisons des cookies',
    description: 'Nous utilisons des cookies pour analyser le trafic et ameliorer notre site web. En cliquant sur "Accepter", vous acceptez l\'utilisation de cookies analytiques.',
    accept: 'Accepter',
    reject: 'Refuser',
  },
  uz: {
    title: 'Biz cookie fayllaridan foydalanamiz',
    description: 'Biz trafikni tahlil qilish va saytimiz ishini yaxshilash uchun cookie fayllaridan foydalanamiz. "Qabul qilish" tugmasini bosish orqali siz analitik cookie fayllaridan foydalanishga rozilik bildirasiz.',
    accept: 'Qabul qilish',
    reject: 'Rad etish',
  },
};

export function CookieConsent() {
  const { language } = useLanguage();
  const [showBanner, setShowBanner] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const checkAndLoadGA4 = useCallback(() => {
    const consent = getStoredConsent();
    if (consent === 'accepted') {
      loadGA4();
    }
  }, []);

  useEffect(() => {
    const consent = getStoredConsent();
    if (consent === null) {
      const timer = setTimeout(() => {
        setShowBanner(true);
        setIsAnimating(true);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      checkAndLoadGA4();
    }
  }, [checkAndLoadGA4]);

  useEffect(() => {
    const handleOpenCookieSettings = () => {
      setShowBanner(true);
      setIsAnimating(true);
    };

    window.addEventListener('openCookieSettings', handleOpenCookieSettings);
    return () => window.removeEventListener('openCookieSettings', handleOpenCookieSettings);
  }, []);

  const handleAccept = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'accepted');
    loadGA4();
    setIsAnimating(false);
    setTimeout(() => setShowBanner(false), 300);
  };

  const handleReject = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'rejected');
    setIsAnimating(false);
    setTimeout(() => setShowBanner(false), 300);
  };

  const handleClose = () => {
    const consent = getStoredConsent();
    if (consent !== null) {
      setIsAnimating(false);
      setTimeout(() => setShowBanner(false), 300);
    }
  };

  if (!showBanner) return null;

  const t = cookieTranslations[language] || cookieTranslations.en;
  const hasExistingConsent = getStoredConsent() !== null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-end sm:items-center justify-center p-4 transition-opacity duration-300 ${
        isAnimating ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={hasExistingConsent ? handleClose : undefined}
      />

      <div
        className={`relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden transform transition-all duration-300 ${
          isAnimating ? 'translate-y-0 scale-100' : 'translate-y-8 scale-95'
        }`}
      >
        {hasExistingConsent && (
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Close"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        )}

        <div className="p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-blue-100 rounded-xl">
              <Cookie className="h-6 w-6 text-blue-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">{t.title}</h2>
          </div>

          <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-6">
            {t.description}
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleReject}
              className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 active:scale-[0.98]"
            >
              {t.reject}
            </button>
            <button
              onClick={handleAccept}
              className="flex-1 px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all duration-200 shadow-lg shadow-blue-600/30 active:scale-[0.98]"
            >
              {t.accept}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
