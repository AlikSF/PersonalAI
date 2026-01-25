import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAdminLang } from './AdminLanguageContext';
import { Loader2, Save, CheckCircle, XCircle, X, ChevronDown, ChevronUp } from 'lucide-react';

interface CompanyInfo {
  id: number;
  name: string;
  phone?: string | null;
  email?: string | null;
  google_maps_url?: string | null;
  google_maps_place_id?: string | null;
  business_category?: string | null;
  address: string;
  address_en?: string | null;
  address_kk?: string | null;
  address_ky?: string | null;
  address_az?: string | null;
  address_zh?: string | null;
  address_fr?: string | null;
  address_uz?: string | null;
  opening_hours?: string | null;
  opening_hours_en?: string | null;
  opening_hours_kk?: string | null;
  opening_hours_ky?: string | null;
  opening_hours_az?: string | null;
  opening_hours_zh?: string | null;
  opening_hours_fr?: string | null;
  opening_hours_uz?: string | null;
  license_info: string;
  license_info_en?: string | null;
  license_info_kk?: string | null;
  license_info_ky?: string | null;
  license_info_az?: string | null;
  license_info_zh?: string | null;
  license_info_fr?: string | null;
  license_info_uz?: string | null;
  insurance_info: string;
  insurance_info_en?: string | null;
  insurance_info_kk?: string | null;
  insurance_info_ky?: string | null;
  insurance_info_az?: string | null;
  insurance_info_zh?: string | null;
  insurance_info_fr?: string | null;
  insurance_info_uz?: string | null;
  payment_info: string;
  payment_info_en?: string | null;
  payment_info_kk?: string | null;
  payment_info_ky?: string | null;
  payment_info_az?: string | null;
  payment_info_zh?: string | null;
  payment_info_fr?: string | null;
  payment_info_uz?: string | null;
}

interface FieldGroup {
  code: string;
  label: string;
  suffix: string;
}

const LANGUAGES: FieldGroup[] = [
  { code: 'ru', label: 'Russian (Base)', suffix: '' },
  { code: 'en', label: 'English', suffix: '_en' },
  { code: 'kk', label: 'Kazakh', suffix: '_kk' },
  { code: 'ky', label: 'Kyrgyz', suffix: '_ky' },
  { code: 'az', label: 'Azerbaijani', suffix: '_az' },
  { code: 'zh', label: 'Chinese', suffix: '_zh' },
  { code: 'fr', label: 'French', suffix: '_fr' },
  { code: 'uz', label: 'Uzbek', suffix: '_uz' },
];

export function CompanyInfoEditor() {
  const { t } = useAdminLang();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo | null>(null);
  const [expandedSections, setExpandedSections] = useState<string[]>(['ru']);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  useEffect(() => {
    fetchCompanyInfo();
  }, []);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const fetchCompanyInfo = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('company_info')
      .select('*')
      .maybeSingle();

    if (error) {
      setNotification({ type: 'error', message: error.message });
    } else if (data) {
      setCompanyInfo(data);
    }
    setLoading(false);
  };

  const handleSave = async () => {
    if (!companyInfo) return;

    setSaving(true);
    const { error } = await supabase
      .from('company_info')
      .update(companyInfo)
      .eq('id', companyInfo.id);

    if (error) {
      setNotification({ type: 'error', message: error.message });
    } else {
      setNotification({ type: 'success', message: 'Company info updated successfully!' });
      fetchCompanyInfo();
    }
    setSaving(false);
  };

  const handleChange = (field: keyof CompanyInfo, value: string) => {
    if (!companyInfo) return;
    setCompanyInfo({ ...companyInfo, [field]: value });
  };

  const toggleSection = (code: string) => {
    setExpandedSections((prev) =>
      prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]
    );
  };

  const renderLanguageSection = (lang: FieldGroup) => {
    if (!companyInfo) return null;

    const isExpanded = expandedSections.includes(lang.code);
    const addressField = lang.suffix ? `address${lang.suffix}` as keyof CompanyInfo : 'address';
    const openingHoursField = lang.suffix ? `opening_hours${lang.suffix}` as keyof CompanyInfo : 'opening_hours';
    const licenseField = lang.suffix ? `license_info${lang.suffix}` as keyof CompanyInfo : 'license_info';
    const insuranceField = lang.suffix ? `insurance_info${lang.suffix}` as keyof CompanyInfo : 'insurance_info';
    const paymentField = lang.suffix ? `payment_info${lang.suffix}` as keyof CompanyInfo : 'payment_info';

    return (
      <div key={lang.code} className="border border-slate-200 rounded-lg overflow-hidden">
        <button
          type="button"
          onClick={() => toggleSection(lang.code)}
          className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 transition-colors"
        >
          <span className="font-medium text-slate-700">{lang.label}</span>
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-slate-500" />
          ) : (
            <ChevronDown className="w-5 h-5 text-slate-500" />
          )}
        </button>

        {isExpanded && (
          <div className="p-4 space-y-4 bg-white">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                {t.address || 'Address'}
              </label>
              <textarea
                value={(companyInfo[addressField] as string) || ''}
                onChange={(e) => handleChange(addressField, e.target.value)}
                rows={3}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 resize-y min-h-[72px]"
                placeholder={`Company address in ${lang.label}`}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Opening Hours
              </label>
              <textarea
                value={(companyInfo[openingHoursField] as string) || ''}
                onChange={(e) => handleChange(openingHoursField, e.target.value)}
                rows={3}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 resize-y min-h-[72px]"
                placeholder={`Opening hours in ${lang.label} (e.g., Mon-Sun: 08:00 - 22:00)`}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                {t.license || 'License Info'}
              </label>
              <textarea
                value={(companyInfo[licenseField] as string) || ''}
                onChange={(e) => handleChange(licenseField, e.target.value)}
                rows={3}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 resize-y min-h-[72px]"
                placeholder={`License information in ${lang.label}`}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                {t.insurance || 'Insurance Info'}
              </label>
              <textarea
                value={(companyInfo[insuranceField] as string) || ''}
                onChange={(e) => handleChange(insuranceField, e.target.value)}
                rows={3}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 resize-y min-h-[72px]"
                placeholder={`Insurance information in ${lang.label}`}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                {t.payment || 'Payment Info'}
              </label>
              <textarea
                value={(companyInfo[paymentField] as string) || ''}
                onChange={(e) => handleChange(paymentField, e.target.value)}
                rows={3}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 resize-y min-h-[72px]"
                placeholder={`Payment information in ${lang.label}`}
              />
            </div>
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  if (!companyInfo) {
    return (
      <div className="text-center py-20">
        <p className="text-slate-500">No company information found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {notification && (
        <div
          className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg ${
            notification.type === 'success'
              ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}
        >
          {notification.type === 'success' ? (
            <CheckCircle className="w-5 h-5 text-emerald-500" />
          ) : (
            <XCircle className="w-5 h-5 text-red-500" />
          )}
          <span className="font-medium">{notification.message}</span>
          <button
            onClick={() => setNotification(null)}
            className="p-1 hover:bg-black/5 rounded transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">{t.companyName || 'Company Name'}</h2>
            <p className="text-sm text-slate-600">Edit the company name displayed on the website</p>
          </div>
        </div>
        <input
          type="text"
          value={companyInfo.name}
          onChange={(e) => handleChange('name', e.target.value)}
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500"
          placeholder="Company name"
        />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-slate-900">Business Information (SEO)</h2>
          <p className="text-sm text-slate-600">Contact details for the Contact page and Schema.org markup. Must match Google Maps exactly.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              value={companyInfo.phone || ''}
              onChange={(e) => handleChange('phone', e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500"
              placeholder="+66 XX XXX XXXX"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              value={companyInfo.email || ''}
              onChange={(e) => handleChange('email', e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500"
              placeholder="contact@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Business Category
            </label>
            <input
              type="text"
              value={companyInfo.business_category || ''}
              onChange={(e) => handleChange('business_category', e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500"
              placeholder="Travel Agency"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Google Place ID
            </label>
            <input
              type="text"
              value={companyInfo.google_maps_place_id || ''}
              onChange={(e) => handleChange('google_maps_place_id', e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500"
              placeholder="ChIJ..."
            />
            <p className="text-xs text-slate-500 mt-1">Find at: Google Maps &gt; Share &gt; Embed &gt; Copy Place ID from URL</p>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Google Maps Embed URL
            </label>
            <input
              type="url"
              value={companyInfo.google_maps_url || ''}
              onChange={(e) => handleChange('google_maps_url', e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500"
              placeholder="https://www.google.com/maps/embed?pb=..."
            />
            <p className="text-xs text-slate-500 mt-1">Google Maps &gt; Share &gt; Embed a map &gt; Copy the src URL from iframe</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">{t.translations || 'Translations'}</h2>
        <div className="space-y-3">
          {LANGUAGES.map((lang) => renderLanguageSection(lang))}
        </div>
      </div>

      <div className="flex items-center justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
        >
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Save Changes
            </>
          )}
        </button>
      </div>
    </div>
  );
}
