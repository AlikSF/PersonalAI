import { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'ru' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  ru: {
    'nav.home': 'Главная',
    'nav.products': 'Товары',
    'nav.contact': 'Контакты',
    'hero.title': 'Найдите идеальную аренду',
    'hero.subtitle': 'От роскошных автомобилей до уютных вилл - изучите нашу подборку премиальных вариантов аренды',
    'hero.cta': 'Посмотреть товары',
    'products.title': 'Наши товары',
    'products.subtitle': 'Изучите нашу тщательно подобранную коллекцию премиальных вариантов аренды',
    'products.filter.all': 'Все',
    'products.filter.transfer': 'Трансфер',
    'products.filter.islands': 'Острова',
    'products.filter.safari': 'Сафари',
    'products.filter.extreme': 'Экстрим',
    'products.filter.clubs': 'Клубы',
    'products.filter.lake': 'Озеро',
    'products.filter.show': 'Шоу',
    'products.perDay': 'от',
    'products.viewDetails': 'Подробнее',
    'products.bookNow': 'Забронировать',
    'products.location': 'Местоположение',
    'products.guests': 'гостей',
    'products.features': 'Особенности',
    'products.startingFrom': 'Начиная от',
    'products.rentalsAvailable': 'доступно',
    'products.rental': 'аренда',
    'products.rentals': 'аренд',
    'products.noRentalsFound': 'Ничего не найдено по вашему запросу',
    'products.available': 'доступно',
    'booking.title': 'Завершите бронирование',
    'booking.name': 'Ваше имя',
    'booking.namePlaceholder': 'Введите ваше полное имя',
    'booking.phone': 'Телефон',
    'booking.phonePlaceholder': 'Введите номер телефона',
    'booking.tourDate': 'Дата тура',
    'booking.tourDatePlaceholder': 'Выберите дату тура',
    'booking.adults': 'Количество взрослых',
    'booking.children': 'Количество детей',
    'booking.back': 'Назад',
    'booking.confirm': 'Подтвердить бронирование',
    'booking.fillFields': 'Пожалуйста, заполните все поля',
    'contact.title': 'Свяжитесь с нами',
    'contact.subtitle': 'Есть вопросы? Наша команда готова помочь вам спланировать идеальную аренду.',
    'contact.name': 'Полное имя',
    'contact.namePlaceholder': 'Иван Иванов',
    'contact.email': 'Email',
    'contact.emailPlaceholder': 'ivan@example.com',
    'contact.phone': 'Телефон',
    'contact.phonePlaceholder': '+7 (999) 123-45-67',
    'contact.message': 'Сообщение',
    'contact.messagePlaceholder': 'Расскажите нам о ваших потребностях в аренде...',
    'contact.send': 'Отправить сообщение',
    'contact.sending': 'Отправка...',
    'contact.success': 'Спасибо! Мы получили ваше сообщение и скоро свяжемся с вами.',
    'contact.required': '*',
    'footer.text': 'Премиум аренда для взыскательных путешественников.',
    'category.Трансфер': 'Трансфер',
    'category.Острова': 'Острова',
    'category.Сафари': 'Сафари',
    'category.Рафтинг': 'Рафтинг',
    'category.Экскурсия': 'Экскурсия',
    'category.Экстрим': 'Экстрим',
    'category.Клубы': 'Клубы',
    'category.Парк': 'Парк',
    'category.Озеро': 'Озеро',
    'category.Шоу': 'Шоу',
  },
  en: {
    'nav.home': 'Home',
    'nav.products': 'Products',
    'nav.contact': 'Contact',
    'hero.title': 'Find Your Perfect Rental',
    'hero.subtitle': 'From luxury vehicles to cozy villas, explore our curated collection of premium rental options',
    'hero.cta': 'View Products',
    'products.title': 'Our Products',
    'products.subtitle': 'Explore our carefully curated collection of premium rental options',
    'products.filter.all': 'All',
    'products.filter.transfer': 'Transfer',
    'products.filter.islands': 'Islands',
    'products.filter.safari': 'Safari',
    'products.filter.extreme': 'Extreme',
    'products.filter.clubs': 'Clubs',
    'products.filter.lake': 'Lake',
    'products.filter.show': 'Show',
    'products.perDay': 'per day',
    'products.viewDetails': 'View Details',
    'products.bookNow': 'Book Now',
    'products.location': 'Location',
    'products.guests': 'guests',
    'products.features': 'Features',
    'products.startingFrom': 'Starting from',
    'booking.title': 'Complete Your Booking',
    'booking.name': 'Your Name',
    'booking.namePlaceholder': 'Enter your full name',
    'booking.phone': 'Phone',
    'booking.phonePlaceholder': 'Enter your phone number',
    'booking.tourDate': 'Tour Date',
    'booking.tourDatePlaceholder': 'Select tour date',
    'booking.adults': 'Adults',
    'booking.children': 'Children',
    'booking.back': 'Back',
    'booking.confirm': 'Confirm Booking',
    'booking.fillFields': 'Please fill in all fields',
    'contact.title': 'Get in Touch',
    'contact.subtitle': 'Have questions? Our team is here to help you plan your perfect rental experience.',
    'contact.name': 'Full Name',
    'contact.namePlaceholder': 'John Doe',
    'contact.email': 'Email',
    'contact.emailPlaceholder': 'john@example.com',
    'contact.phone': 'Phone',
    'contact.phonePlaceholder': '+1 (555) 000-0000',
    'contact.message': 'Message',
    'contact.messagePlaceholder': 'Tell us about your rental needs...',
    'contact.send': 'Send Message',
    'contact.sending': 'Sending...',
    'contact.success': 'Thank you! We\'ve received your message and will get back to you soon.',
    'contact.required': '*',
    'footer.text': 'Premium rentals for discerning travelers.',
    'products.rentalsAvailable': 'available',
    'products.rental': 'rental',
    'products.rentals': 'rentals',
    'products.noRentalsFound': 'No rentals found matching your criteria',
    'products.available': 'available',
    'category.Трансфер': 'Трансфер',
    'category.Острова': 'Острова',
    'category.Сафари': 'Сафари',
    'category.Рафтинг': 'Рафтинг',
    'category.Экскурсия': 'Экскурсия',
    'category.Экстрим': 'Экстрим',
    'category.Клубы': 'Клубы',
    'category.Парк': 'Парк',
    'category.Озеро': 'Озеро',
    'category.Шоу': 'Шоу',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('ru');

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
