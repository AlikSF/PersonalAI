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

  // Translations for section headings
  const getHeadings = () => {
    switch (language) {
      case 'en':
        return {
          licenses: 'Licenses & Documents',
          insurance: 'Insurance',
          payment: 'Payment Methods',
          rights: 'All rights reserved.'
        };
      case 'az':
        return {
          licenses: 'Lisenziyalar və sənədlər',
          insurance: 'Sığorta',
          payment: 'Ödəniş üsulları',
          rights: 'Bütün hüquqlar qorunur.'
        };
      case 'kk':
        return {
          licenses: 'Лицензиялар және құжаттар',
          insurance: 'Сақтандыру',
          payment: 'Төлем әдістері',
          rights: 'Барлық құқықтар қорғалған.'
        };
      case 'ky':
        return {
          licenses: 'Лицензиялар жана документтер',
          insurance: 'Камсыздандыруу',
          payment: 'Төлөм ыкмалары',
          rights: 'Бардык укуктар корголгон.'
        };
      case 'zh':
        return {
          licenses: '许可证和文件',
          insurance: '保险',
          payment: '支付方式',
          rights: '版权所有。'
        };
      case 'fr':
        return {
          licenses: 'Licences et documents',
          insurance: 'Assurance',
          payment: 'Moyens de paiement',
          rights: 'Tous droits réservés.'
        };
      case 'uz':
        return {
          licenses: 'Litsenziyalar va hujjatlar',
          insurance: 'Sug\'urta',
          payment: 'To\'lov usullari',
          rights: 'Barcha huquqlar himoyalangan.'
        };
      default:
        return {
          licenses: 'Лицензии и документы',
          insurance: 'Страхование',
          payment: 'Способы оплаты',
          rights: 'Все права защищены.'
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
                    <img src="/VISA logo.png" alt="VISA" className="h-4 w-auto" />
                  </div>
                  <div className="bg-white rounded px-2 py-1 flex items-center justify-center">
                    <img src="/mastercard.png" alt="Mastercard" className="h-4 w-auto" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-sm text-gray-400">
            &copy; {new Date().getFullYear()} {companyInfo.name}. {headings.rights}
          </p>
        </div>
      </div>
    </footer>
  );
}
