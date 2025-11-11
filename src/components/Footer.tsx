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
