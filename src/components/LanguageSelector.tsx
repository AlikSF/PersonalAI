import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { useLanguage, languageConfig } from '../contexts/LanguageContext';

export function LanguageSelector() {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentLang = languageConfig[language];
  const languages = Object.values(languageConfig);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white hover:bg-gray-50 transition-colors border border-gray-200 shadow-sm"
      >
        <span className="text-xl">{currentLang.flag}</span>
        <span className="font-medium text-gray-900">{currentLang.label}</span>
        <ChevronDown className={`h-4 w-4 text-gray-900 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden z-50">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                setLanguage(lang.code as 'ru' | 'en' | 'kk' | 'ky' | 'az');
                setIsOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors ${
                language === lang.code ? 'bg-blue-50' : ''
              }`}
            >
              <span className="text-xl">{lang.flag}</span>
              <span className="font-medium text-gray-900">{lang.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
