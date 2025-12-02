export interface CountryCode {
  code: string;
  name: string;
  nameRu: string;
  dial: string;
  flag: string;
}

export const countryCodes: CountryCode[] = [
  { code: 'RU', name: 'Russia', nameRu: 'Россия', dial: '+7', flag: '🇷🇺' },
  { code: 'KZ', name: 'Kazakhstan', nameRu: 'Казахстан', dial: '+7', flag: '🇰🇿' },
  { code: 'TH', name: 'Thailand', nameRu: 'Таиланд', dial: '+66', flag: '🇹🇭' },
  { code: 'US', name: 'United States', nameRu: 'США', dial: '+1', flag: '🇺🇸' },
  { code: 'CN', name: 'China', nameRu: 'Китай', dial: '+86', flag: '🇨🇳' },
  { code: 'KG', name: 'Kyrgyzstan', nameRu: 'Кыргызстан', dial: '+996', flag: '🇰🇬' },
  { code: 'UZ', name: 'Uzbekistan', nameRu: 'Узбекистан', dial: '+998', flag: '🇺🇿' },
  { code: 'AZ', name: 'Azerbaijan', nameRu: 'Азербайджан', dial: '+994', flag: '🇦🇿' },
  { code: 'UA', name: 'Ukraine', nameRu: 'Украина', dial: '+380', flag: '🇺🇦' },
  { code: 'BY', name: 'Belarus', nameRu: 'Беларусь', dial: '+375', flag: '🇧🇾' },
  { code: 'GB', name: 'United Kingdom', nameRu: 'Великобритания', dial: '+44', flag: '🇬🇧' },
  { code: 'DE', name: 'Germany', nameRu: 'Германия', dial: '+49', flag: '🇩🇪' },
  { code: 'FR', name: 'France', nameRu: 'Франция', dial: '+33', flag: '🇫🇷' },
  { code: 'IT', name: 'Italy', nameRu: 'Италия', dial: '+39', flag: '🇮🇹' },
  { code: 'ES', name: 'Spain', nameRu: 'Испания', dial: '+34', flag: '🇪🇸' },
  { code: 'TR', name: 'Turkey', nameRu: 'Турция', dial: '+90', flag: '🇹🇷' },
  { code: 'AE', name: 'UAE', nameRu: 'ОАЭ', dial: '+971', flag: '🇦🇪' },
  { code: 'IN', name: 'India', nameRu: 'Индия', dial: '+91', flag: '🇮🇳' },
  { code: 'JP', name: 'Japan', nameRu: 'Япония', dial: '+81', flag: '🇯🇵' },
  { code: 'KR', name: 'South Korea', nameRu: 'Южная Корея', dial: '+82', flag: '🇰🇷' },
  { code: 'AU', name: 'Australia', nameRu: 'Австралия', dial: '+61', flag: '🇦🇺' },
  { code: 'CA', name: 'Canada', nameRu: 'Канада', dial: '+1', flag: '🇨🇦' },
  { code: 'SG', name: 'Singapore', nameRu: 'Сингапур', dial: '+65', flag: '🇸🇬' },
  { code: 'MY', name: 'Malaysia', nameRu: 'Малайзия', dial: '+60', flag: '🇲🇾' },
  { code: 'VN', name: 'Vietnam', nameRu: 'Вьетнам', dial: '+84', flag: '🇻🇳' },
  { code: 'ID', name: 'Indonesia', nameRu: 'Индонезия', dial: '+62', flag: '🇮🇩' },
];
