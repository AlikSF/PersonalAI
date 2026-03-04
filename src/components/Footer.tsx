import { useState, useEffect } from 'react';
import { MapPin, Shield, CreditCard, FileText } from 'lucide-react';
import { supabase, CompanyInfo } from '../lib/supabase';
import { useLanguage } from '../contexts/LanguageContext';

export function Footer() {
  const { language } = useLanguage();
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCompanyInfo();
  }, []);

  const fetchCompanyInfo = async () => {
    try {
      const { data, error } = await supabase
        .from('company_info')
        .select('*')
        .single();

      if (error) throw error;
      setCompanyInfo(data);
    } catch (error) {
      console.error('Error fetching company info:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-gray-400">Загрузка...</div>
        </div>
      </footer>
    );
  }

  if (!companyInfo) {
    return null;
  }

  // Helper function to get display value with fallback
  const getDisplayValue = (
    russianValue: string,
    englishValue?: string | null,
    azValue?: string | null,
    kkValue?: string | null,
    kyValue?: string | null,
    zhValue?: string | null,
    frValue?: string | null,
    uzValue?: string | null
  ): string => {
    if (language === 'en' && englishValue?.trim()) {
      return englishValue.trim();
    }
    if (language === 'az' && azValue?.trim()) {
      return azValue.trim();
    }
    if (language === 'kk' && kkValue?.trim()) {
      return kkValue.trim();
    }
    if (language === 'ky' && kyValue?.trim()) {
      return kyValue.trim();
    }
    if (language === 'zh' && zhValue?.trim()) {
      return zhValue.trim();
    }
    if (language === 'fr' && frValue?.trim()) {
      return frValue.trim();
    }
    if (language === 'uz' && uzValue?.trim()) {
      return uzValue.trim();
    }
    return russianValue;
  };

  // Get display values based on language
  const displayAddress = getDisplayValue(
    companyInfo.address,
    companyInfo.address_en,
    companyInfo.address_az,
    companyInfo.address_kk,
    companyInfo.address_ky,
    companyInfo.address_zh,
    companyInfo.address_fr,
    companyInfo.address_uz
  );
  const displayLicenseInfo = getDisplayValue(
    companyInfo.license_info,
    companyInfo.license_info_en,
    companyInfo.license_info_az,
    companyInfo.license_info_kk,
    companyInfo.license_info_ky,
    companyInfo.license_info_zh,
    companyInfo.license_info_fr,
    companyInfo.license_info_uz
  );
  const displayInsuranceInfo = getDisplayValue(
    companyInfo.insurance_info,
    companyInfo.insurance_info_en,
    companyInfo.insurance_info_az,
    companyInfo.insurance_info_kk,
    companyInfo.insurance_info_ky,
    companyInfo.insurance_info_zh,
    companyInfo.insurance_info_fr,
    companyInfo.insurance_info_uz
  );
  const displayPaymentInfo = getDisplayValue(
    companyInfo.payment_info,
    companyInfo.payment_info_en,
    companyInfo.payment_info_az,
    companyInfo.payment_info_kk,
    companyInfo.payment_info_ky,
    companyInfo.payment_info_zh,
    companyInfo.payment_info_fr,
    companyInfo.payment_info_uz
  );

  const getHeadings = () => {
    switch (language) {
      case 'en':
        return {
          licenses: 'Licenses & Documents',
          insurance: 'Insurance',
          payment: 'Payment Methods',
          rights: 'All rights reserved.',
          cookieSettings: 'Cookie Settings',
          privacyPolicy: 'Privacy Policy',
          termsAndConditions: 'Terms & Conditions',
          refundPolicy: 'Refund Policy',
          cookiePolicy: 'Cookie Policy',
          contact: 'Contact Us'
        };
      case 'az':
        return {
          licenses: 'Lisenziyalar və sənədlər',
          insurance: 'Sığorta',
          payment: 'Ödəniş üsulları',
          rights: 'Bütün hüquqlar qorunur.',
          cookieSettings: 'Cookie parametrləri',
          privacyPolicy: 'Gizlilik Siyaseti',
          termsAndConditions: 'Şərtlər',
          refundPolicy: 'Geri Ödeme',
          cookiePolicy: 'Cookie Siyaseti',
          contact: 'Bizimlə Əlaqə'
        };
      case 'kk':
        return {
          licenses: 'Лицензиялар және құжаттар',
          insurance: 'Сақтандыру',
          payment: 'Төлем әдістері',
          rights: 'Барлық құқықтар қорғалған.',
          cookieSettings: 'Cookie параметрлері',
          privacyPolicy: 'Құпиялылық саясаты',
          termsAndConditions: 'Шарттар',
          refundPolicy: 'Қайтару саясаты',
          cookiePolicy: 'Cookie саясаты',
          contact: 'Байланыс'
        };
      case 'ky':
        return {
          licenses: 'Лицензиялар жана документтер',
          insurance: 'Камсыздандыруу',
          payment: 'Төлөм ыкмалары',
          rights: 'Бардык укуктар корголгон.',
          cookieSettings: 'Cookie жөндөөлөрү',
          privacyPolicy: 'Купуялык саясаты',
          termsAndConditions: 'Шарттар',
          refundPolicy: 'Кайтаруу саясаты',
          cookiePolicy: 'Cookie саясаты',
          contact: 'Байланыш'
        };
      case 'zh':
        return {
          licenses: '许可证和文件',
          insurance: '保险',
          payment: '支付方式',
          rights: '版权所有。',
          cookieSettings: 'Cookie 设置',
          privacyPolicy: '隐私政策',
          termsAndConditions: '条款和条件',
          refundPolicy: '退款政策',
          cookiePolicy: 'Cookie 政策',
          contact: '联系我们'
        };
      case 'fr':
        return {
          licenses: 'Licences et documents',
          insurance: 'Assurance',
          payment: 'Moyens de paiement',
          rights: 'Tous droits réservés.',
          cookieSettings: 'Paramètres des cookies',
          privacyPolicy: 'Politique de confidentialité',
          termsAndConditions: 'Conditions générales',
          refundPolicy: 'Politique de remboursement',
          cookiePolicy: 'Politique des cookies',
          contact: 'Contactez-nous'
        };
      case 'uz':
        return {
          licenses: 'Litsenziyalar va hujjatlar',
          insurance: 'Sug\'urta',
          payment: 'To\'lov usullari',
          rights: 'Barcha huquqlar himoyalangan.',
          cookieSettings: 'Cookie sozlamalari',
          privacyPolicy: 'Maxfiylik siyosati',
          termsAndConditions: 'Shartlar',
          refundPolicy: 'Qaytarish siyosati',
          cookiePolicy: 'Cookie siyosati',
          contact: 'Biz bilan bog\'laning'
        };
      default:
        return {
          licenses: 'Лицензии и документы',
          insurance: 'Страхование',
          payment: 'Способы оплаты',
          rights: 'Все права защищены.',
          cookieSettings: 'Настройки cookie',
          privacyPolicy: 'Политика конфиденциальности',
          termsAndConditions: 'Условия использования',
          refundPolicy: 'Политика возврата',
          cookiePolicy: 'Политика cookie',
          contact: 'Контакты'
        };
    }
  };

  const headings = getHeadings();

  return (
    <footer className="bg-gray-900 text-white py-12 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="text-2xl font-bold mb-4">{companyInfo.name}</h3>
            <div className="flex items-start space-x-2 text-gray-300">
              <MapPin className="h-5 w-5 flex-shrink-0 mt-0.5" />
              <p className="text-sm leading-relaxed">{displayAddress}</p>
            </div>
          </div>

          <div>
            <div className="flex items-start space-x-2 mb-4">
              <FileText className="h-5 w-5 flex-shrink-0 mt-0.5 text-blue-400" />
              <div>
                <h4 className="font-semibold mb-1">{headings.licenses}</h4>
                <p className="text-sm text-gray-300 whitespace-pre-line">{displayLicenseInfo}</p>
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-start space-x-2 mb-4">
              <Shield className="h-5 w-5 flex-shrink-0 mt-0.5 text-green-400" />
              <div>
                <h4 className="font-semibold mb-1">{headings.insurance}</h4>
                <p className="text-sm text-gray-300 whitespace-pre-line">{displayInsuranceInfo}</p>
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-start space-x-2 mb-4">
              <CreditCard className="h-5 w-5 flex-shrink-0 mt-0.5 text-yellow-400" />
              <div>
                <h4 className="font-semibold mb-1">{headings.payment}</h4>
                <p className="text-sm text-gray-300 whitespace-pre-line">{displayPaymentInfo}</p>
                <div className="flex items-center gap-2 mt-4">
                  <div className="bg-white rounded px-2 py-1 flex items-center justify-center">
                    <img src="/VISA_logo_(1).png" alt="VISA" className="h-4 w-auto" />
                  </div>
                  <div className="bg-white rounded px-2 py-1 flex items-center justify-center">
                    <img src="/mastercard_(1).png" alt="Mastercard" className="h-4 w-auto" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mb-4">
            <a
              href="/contact"
              onClick={(e) => {
                e.preventDefault();
                window.history.pushState({}, '', '/contact');
                window.dispatchEvent(new PopStateEvent('popstate'));
              }}
              className="text-sm text-gray-500 hover:text-gray-300 transition-colors"
            >
              {headings.contact}
            </a>
            <span className="text-gray-700 hidden sm:inline">|</span>
            <a
              href="/privacy-policy"
              onClick={(e) => {
                e.preventDefault();
                window.history.pushState({}, '', '/privacy-policy');
                window.dispatchEvent(new PopStateEvent('popstate'));
              }}
              className="text-sm text-gray-500 hover:text-gray-300 transition-colors"
            >
              {headings.privacyPolicy}
            </a>
            <span className="text-gray-700 hidden sm:inline">|</span>
            <a
              href="/terms-and-conditions"
              onClick={(e) => {
                e.preventDefault();
                window.history.pushState({}, '', '/terms-and-conditions');
                window.dispatchEvent(new PopStateEvent('popstate'));
              }}
              className="text-sm text-gray-500 hover:text-gray-300 transition-colors"
            >
              {headings.termsAndConditions}
            </a>
            <span className="text-gray-700 hidden sm:inline">|</span>
            <a
              href="/refund-policy"
              onClick={(e) => {
                e.preventDefault();
                window.history.pushState({}, '', '/refund-policy');
                window.dispatchEvent(new PopStateEvent('popstate'));
              }}
              className="text-sm text-gray-500 hover:text-gray-300 transition-colors"
            >
              {headings.refundPolicy}
            </a>
            <span className="text-gray-700 hidden sm:inline">|</span>
            <a
              href="/cookie-policy"
              onClick={(e) => {
                e.preventDefault();
                window.history.pushState({}, '', '/cookie-policy');
                window.dispatchEvent(new PopStateEvent('popstate'));
              }}
              className="text-sm text-gray-500 hover:text-gray-300 transition-colors"
            >
              {headings.cookiePolicy}
            </a>
            <span className="text-gray-700 hidden sm:inline">|</span>
            <button
              onClick={() => window.dispatchEvent(new CustomEvent('openCookieSettings'))}
              className="text-sm text-gray-500 hover:text-gray-300 transition-colors"
            >
              {headings.cookieSettings}
            </button>
          </div>
          <p className="text-sm text-gray-400 text-center">
            &copy; {new Date().getFullYear()} {companyInfo.name}. {headings.rights}
          </p>
        </div>
      </div>
    </footer>
  );
}
