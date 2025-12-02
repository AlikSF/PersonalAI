import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Search } from 'lucide-react';
import { countryCodes, CountryCode } from '../lib/countryCodes';
import { useLanguage } from '../contexts/LanguageContext';

interface PhoneInputProps {
  value: string;
  onChange: (phone: string, countryCode: string, dialCode: string) => void;
  label: string;
  placeholder: string;
  id?: string;
}

export function PhoneInput({ value, onChange, label, placeholder, id = 'phone' }: PhoneInputProps) {
  const { language } = useLanguage();
  const [selectedCountry, setSelectedCountry] = useState<CountryCode>(countryCodes[0]);
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchQuery('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredCountries = countryCodes.filter((country) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      country.name.toLowerCase().includes(searchLower) ||
      country.nameRu.toLowerCase().includes(searchLower) ||
      country.dial.includes(searchLower) ||
      country.code.toLowerCase().includes(searchLower)
    );
  });

  const handleCountrySelect = (country: CountryCode) => {
    setSelectedCountry(country);
    setIsOpen(false);
    setSearchQuery('');
    onChange(value, country.code, country.dial);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const phoneValue = e.target.value.replace(/[^\d]/g, '');
    onChange(phoneValue, selectedCountry.code, selectedCountry.dial);
  };

  const getCountryName = (country: CountryCode) => {
    if (language === 'en') return country.name;
    return country.nameRu;
  };

  return (
    <div>
      <label htmlFor={id} className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <div className="flex gap-2">
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="h-11 md:h-12 px-3 flex items-center gap-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <span className="text-2xl">{selectedCountry.flag}</span>
            <span className="text-sm font-medium text-gray-700">{selectedCountry.dial}</span>
            <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </button>

          {isOpen && (
            <div className="absolute top-full left-0 mt-1 w-72 bg-white border border-gray-300 rounded-lg shadow-lg z-50 max-h-80 overflow-hidden flex flex-col">
              <div className="p-2 border-b border-gray-200">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={language === 'en' ? 'Search country...' : 'Поиск страны...'}
                    className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    autoFocus
                  />
                </div>
              </div>
              <div className="overflow-y-auto">
                {filteredCountries.length > 0 ? (
                  filteredCountries.map((country) => (
                    <button
                      key={country.code}
                      type="button"
                      onClick={() => handleCountrySelect(country)}
                      className="w-full px-3 py-2.5 flex items-center gap-3 hover:bg-blue-50 transition-colors text-left"
                    >
                      <span className="text-2xl">{country.flag}</span>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-900 truncate">
                          {getCountryName(country)}
                        </div>
                        <div className="text-xs text-gray-500">{country.code}</div>
                      </div>
                      <span className="text-sm font-medium text-gray-700">{country.dial}</span>
                    </button>
                  ))
                ) : (
                  <div className="px-3 py-6 text-center text-sm text-gray-500">
                    {language === 'en' ? 'No countries found' : 'Страны не найдены'}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <input
          type="tel"
          id={id}
          value={value}
          onChange={handlePhoneChange}
          placeholder={placeholder}
          className="flex-1 px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm md:text-base"
          style={{
            minHeight: '44px',
            height: 'auto'
          }}
        />
      </div>
    </div>
  );
}
