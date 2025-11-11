import { useState, useEffect } from 'react';
import { MapPin, Shield, CreditCard, FileText } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface CompanyInfo {
  id: number;
  name: string;
  address: string;
  license_info: string;
  insurance_info: string;
  payment_info: string;
}

export function Footer() {
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

  return (
    <footer className="bg-gray-900 text-white py-12 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="text-2xl font-bold mb-4">{companyInfo.name}</h3>
            <div className="flex items-start space-x-2 text-gray-300">
              <MapPin className="h-5 w-5 flex-shrink-0 mt-0.5" />
              <p className="text-sm leading-relaxed">{companyInfo.address}</p>
            </div>
          </div>

          <div>
            <div className="flex items-start space-x-2 mb-4">
              <FileText className="h-5 w-5 flex-shrink-0 mt-0.5 text-blue-400" />
              <div>
                <h4 className="font-semibold mb-1">Лицензии и документы</h4>
                <p className="text-sm text-gray-300 whitespace-pre-line">{companyInfo.license_info}</p>
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-start space-x-2 mb-4">
              <Shield className="h-5 w-5 flex-shrink-0 mt-0.5 text-green-400" />
              <div>
                <h4 className="font-semibold mb-1">Страхование</h4>
                <p className="text-sm text-gray-300 whitespace-pre-line">{companyInfo.insurance_info}</p>
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-start space-x-2 mb-4">
              <CreditCard className="h-5 w-5 flex-shrink-0 mt-0.5 text-yellow-400" />
              <div>
                <h4 className="font-semibold mb-1">Способы оплаты</h4>
                <p className="text-sm text-gray-300 whitespace-pre-line">{companyInfo.payment_info}</p>
                <div className="flex items-center gap-3 mt-4 flex-wrap">
                  <div className="bg-white rounded px-2 py-1 flex items-center justify-center">
                    <svg className="h-6 w-8" viewBox="0 0 48 32" fill="none">
                      <rect width="48" height="32" rx="4" fill="white"/>
                      <path d="M18.5 11.5L14 20.5H17.5L22 11.5H18.5Z" fill="#1434CB"/>
                      <path d="M22 11.5L17.5 20.5H21L25.5 11.5H22Z" fill="#FAA61A"/>
                    </svg>
                  </div>
                  <div className="bg-white rounded px-2 py-1 flex items-center justify-center">
                    <svg className="h-6 w-8" viewBox="0 0 48 32" fill="none">
                      <rect width="48" height="32" rx="4" fill="white"/>
                      <circle cx="18" cy="16" r="7" fill="#EB001B"/>
                      <circle cx="30" cy="16" r="7" fill="#FF5F00"/>
                      <circle cx="24" cy="16" r="7" fill="#F79E1B" opacity="0.6"/>
                    </svg>
                  </div>
                  <div className="bg-white rounded px-2 py-1 flex items-center justify-center">
                    <svg className="h-6 w-8" viewBox="0 0 48 32" fill="none">
                      <rect width="48" height="32" rx="4" fill="white"/>
                      <path d="M20 12h8v8h-8z" fill="#003087"/>
                      <path d="M28 16c0-3-2-5-5-5h-3v10h3c3 0 5-2 5-5z" fill="#009CDE"/>
                      <path d="M20 16c0-3 2-5 5-5v10c-3 0-5-2-5-5z" fill="#012169"/>
                    </svg>
                  </div>
                  <div className="bg-white rounded px-2 py-1 flex items-center justify-center">
                    <svg className="h-6 w-8" viewBox="0 0 48 32" fill="none">
                      <rect width="48" height="32" rx="4" fill="white"/>
                      <path d="M24 12c-4 0-7 3-7 7s3 7 7 7 7-3 7-7-3-7-7-7zm0 12c-3 0-5-2-5-5s2-5 5-5 5 2 5 5-2 5-5 5z" fill="#0075FF"/>
                      <path d="M24 15v6" stroke="#0075FF" strokeWidth="1.5"/>
                      <path d="M21 19h6" stroke="#0075FF" strokeWidth="1.5"/>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-sm text-gray-400">
            &copy; {new Date().getFullYear()} {companyInfo.name}. Все права защищены.
          </p>
        </div>
      </div>
    </footer>
  );
}
