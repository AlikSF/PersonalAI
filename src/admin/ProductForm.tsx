import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAdminLang } from './AdminLanguageContext';
import { ArrowLeft, Loader2, CheckCircle, XCircle, X, ChevronDown, ChevronUp } from 'lucide-react';
import { ImageUploader } from './ImageUploader';

interface ProductFormProps {
  productId?: string;
}

const CATEGORIES = [
  'Трансфер',
  'Острова',
  'Озеро',
  'Экстрим',
  'Клубы',
  'Шоу',
  'Инста туры',
  'Приват туры',
];

const CATEGORY_TRANSLATIONS: Record<string, Record<string, string>> = {
  'Трансфер': {
    en: 'Transfer',
    kk: 'Трансфер',
    ky: 'Трансфер',
    az: 'Transfer',
    zh: '接送服务',
    fr: 'Transfert',
    uz: 'Transfer',
  },
  'Острова': {
    en: 'Islands',
    kk: 'Аралдар',
    ky: 'Аралдар',
    az: 'Adalar',
    zh: '岛屿',
    fr: 'Îles',
    uz: 'Orollar',
  },
  'Озеро': {
    en: 'Lake',
    kk: 'Көл',
    ky: 'Көл',
    az: 'Göl',
    zh: '湖泊',
    fr: 'Lac',
    uz: 'Ko\'l',
  },
  'Экстрим': {
    en: 'Extreme',
    kk: 'Экстрим',
    ky: 'Экстрим',
    az: 'Ekstremal',
    zh: '极限运动',
    fr: 'Extrême',
    uz: 'Ekstrim',
  },
  'Клубы': {
    en: 'Clubs',
    kk: 'Клубтар',
    ky: 'Клубдар',
    az: 'Klublar',
    zh: '俱乐部',
    fr: 'Clubs',
    uz: 'Klublar',
  },
  'Шоу': {
    en: 'Show',
    kk: 'Шоу',
    ky: 'Шоу',
    az: 'Şou',
    zh: '表演',
    fr: 'Spectacle',
    uz: 'Shou',
  },
  'Инста туры': {
    en: 'Insta Tours',
    kk: 'Инста турлар',
    ky: 'Инста турлар',
    az: 'İnsta Turlar',
    zh: '网红打卡游',
    fr: 'Tours Insta',
    uz: 'Insta Turlar',
  },
  'Приват туры': {
    en: 'Private Tours',
    kk: 'Жеке турлар',
    ky: 'Жеке турлар',
    az: 'Xüsusi Turlar',
    zh: '私人旅游',
    fr: 'Tours Privés',
    uz: 'Xususiy Turlar',
  },
};

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

type FormData = Record<string, string | number | boolean | string[] | null>;

export function ProductForm({ productId }: ProductFormProps) {
  const { t } = useAdminLang();
  const isEdit = Boolean(productId);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [expandedSections, setExpandedSections] = useState<string[]>(['ru']);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    category: '',
    price_per_day: '',
    images: [],
    location: '',
    features: '',
    is_active: true,
    priority: '',
    name_en: '',
    description_en: '',
    location_en: '',
    category_en: '',
    features_en: '',
    name_kk: '',
    description_kk: '',
    location_kk: '',
    category_kk: '',
    features_kk: '',
    name_ky: '',
    description_ky: '',
    location_ky: '',
    category_ky: '',
    features_ky: '',
    name_az: '',
    description_az: '',
    location_az: '',
    category_az: '',
    features_az: '',
    name_zh: '',
    description_zh: '',
    location_zh: '',
    category_zh: '',
    features_zh: '',
    name_fr: '',
    description_fr: '',
    location_fr: '',
    category_fr: '',
    features_fr: '',
    name_uz: '',
    description_uz: '',
    location_uz: '',
    category_uz: '',
    features_uz: '',
  });

  useEffect(() => {
    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const fetchProduct = async () => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', productId)
      .maybeSingle();

    if (error) {
      setNotification({ type: 'error', message: error.message });
    } else if (data) {
      const mapped: FormData = {};
      Object.keys(formData).forEach((key) => {
        const value = (data as Record<string, unknown>)[key];
        if (key === 'price_per_day' || key === 'priority') {
          mapped[key] = value !== null && value !== undefined ? String(value) : '';
        } else if (key.startsWith('features') && Array.isArray(value)) {
          mapped[key] = arrayToCommaSeparated(value);
        } else if (key === 'images' && Array.isArray(value)) {
          mapped[key] = value;
        } else if (typeof value === 'boolean') {
          mapped[key] = value;
        } else {
          mapped[key] = value !== null && value !== undefined ? String(value) : '';
        }
      });
      setFormData(mapped);
    }
    setLoading(false);
  };

  const navigate = (path: string) => {
    window.history.pushState({}, '', path);
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  const handleChange = (field: string, value: string | number | boolean | string[] | null) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleSection = (code: string) => {
    setExpandedSections((prev) =>
      prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]
    );
  };

  const arrayToCommaSeparated = (arr: string[] | null | undefined): string => {
    if (!arr || arr.length === 0) return '';
    return arr.join(', ');
  };

  const commaSeparatedToArray = (str: string): string[] => {
    if (!str.trim()) return [];
    return str.split(',').map((s) => s.trim()).filter(Boolean);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const payload: Record<string, unknown> = {};

    Object.entries(formData).forEach(([key, value]) => {
      if (key === 'price_per_day' || key === 'priority') {
        payload[key] = value !== '' ? Number(value) : null;
      } else if (key === 'is_active') {
        payload[key] = value;
      } else if (key === 'images') {
        payload[key] = value;
      } else if (key.startsWith('features')) {
        payload[key] = commaSeparatedToArray(value as string);
      } else {
        payload[key] = value !== '' ? value : null;
      }
    });

    payload['updated_at'] = new Date().toISOString();

    let error;
    if (isEdit) {
      const result = await supabase.from('products').update(payload).eq('id', productId);
      error = result.error;
    } else {
      const result = await supabase.from('products').insert([payload]);
      error = result.error;
    }

    if (error) {
      setNotification({ type: 'error', message: error.message });
      setSaving(false);
    } else {
      setNotification({ type: 'success', message: isEdit ? t.productUpdated : t.productCreated });
      setTimeout(() => navigate('/admin/products'), 500);
    }
  };

  const renderLanguageSection = (lang: FieldGroup) => {
    const isExpanded = expandedSections.includes(lang.code);
    const nameField = lang.suffix ? `name${lang.suffix}` : 'name';
    const descField = lang.suffix ? `description${lang.suffix}` : 'description';
    const locationField = lang.suffix ? `location${lang.suffix}` : 'location';
    const categoryField = lang.suffix ? `category${lang.suffix}` : 'category';
    const featuresField = lang.suffix ? `features${lang.suffix}` : 'features';

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
              <label className="block text-sm font-medium text-slate-700 mb-1">{t.name}</label>
              <input
                type="text"
                value={(formData[nameField] as string) || ''}
                onChange={(e) => handleChange(nameField, e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500"
                placeholder={`Product name in ${lang.label}`}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">{t.description}</label>
              <textarea
                value={(formData[descField] as string) || ''}
                onChange={(e) => handleChange(descField, e.target.value)}
                rows={4}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 resize-none"
                placeholder={`Product description in ${lang.label}`}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">{t.location}</label>
              <input
                type="text"
                value={(formData[locationField] as string) || ''}
                onChange={(e) => handleChange(locationField, e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500"
                placeholder={`Location in ${lang.label}`}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">{t.category}</label>
              <select
                value={(formData[categoryField] as string) || ''}
                onChange={(e) => handleChange(categoryField, e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500"
              >
                <option value="">{t.selectCategory}</option>
                {CATEGORIES.map((catRu) => {
                  const translated = lang.code === 'ru' ? catRu : CATEGORY_TRANSLATIONS[catRu][lang.code];
                  const displayText = lang.code === 'ru' ? catRu : `${translated} (${catRu})`;
                  return (
                    <option key={catRu} value={translated}>
                      {displayText}
                    </option>
                  );
                })}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                {t.features}
              </label>
              <textarea
                value={(formData[featuresField] as string) || ''}
                onChange={(e) => handleChange(featuresField, e.target.value)}
                rows={3}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 resize-none"
                placeholder="Feature 1, Feature 2, Feature 3"
              />
              <p className="text-xs text-slate-500 mt-1">{t.featuresHint}</p>
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

      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/admin/products')}
          className="p-2 text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            {isEdit ? t.editProduct : t.createProduct}
          </h1>
          <p className="text-slate-600 mt-1">
            {isEdit ? t.updateProductDetails : t.addNewProduct}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">{t.generalSettings}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                {t.pricePerDay}
              </label>
              <input
                type="number"
                value={formData.price_per_day as string}
                onChange={(e) => handleChange('price_per_day', e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500"
                placeholder="0"
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">{t.priority}</label>
              <select
                value={formData.priority as string}
                onChange={(e) => handleChange('priority', e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500"
              >
                <option value="">{t.priorityNotSet}</option>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                  <option key={num} value={num}>
                    {num}
                  </option>
                ))}
              </select>
              <p className="text-xs text-slate-500 mt-1">{t.priorityHint}</p>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-3">
            <input
              type="checkbox"
              id="is_active"
              checked={formData.is_active as boolean}
              onChange={(e) => handleChange('is_active', e.target.checked)}
              className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="is_active" className="text-sm font-medium text-slate-700">
              {t.activeHint}
            </label>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">{t.images}</h2>
          <ImageUploader
            images={(formData.images as string[]) || []}
            onChange={(newImages) => handleChange('images', newImages)}
            translations={{
              uploadImages: t.uploadImages,
              dragToReorder: t.dragToReorder,
              uploading: t.uploading,
              dropHere: t.dropHere,
              orClickToSelect: t.orClickToSelect,
              firstImageMain: t.firstImageMain,
            }}
          />
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">{t.translations}</h2>
          <div className="space-y-3">
            {LANGUAGES.map((lang) => renderLanguageSection(lang))}
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={() => navigate('/admin/products')}
            className="px-6 py-2 text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
          >
            {t.cancel}
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            {saving && <Loader2 className="w-4 h-4 animate-spin" />}
            {isEdit ? t.updateProduct : t.createProduct}
          </button>
        </div>
      </form>
    </div>
  );
}
