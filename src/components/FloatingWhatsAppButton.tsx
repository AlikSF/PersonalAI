import { useLanguage } from '../contexts/LanguageContext';

export function FloatingWhatsAppButton() {
  const { language } = useLanguage();
  const telegramUsername = 'PhuketVibemanager';

  const handleClick = () => {
    let message = '';

    if (language === 'en' || language === 'fr') {
      message = 'Hello! I would like to get more information about available tours in Phuket.';
    } else {
      // For ru, kk, ky, az, zh, uz - use Russian message
      message = 'Здравствуйте! Я хочу узнать подробнее о доступных турах в Пхукете.';
    }

    const telegramUrl = `https://t.me/${telegramUsername}?text=${encodeURIComponent(message)}`;
    window.open(telegramUrl, '_blank');
  };

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-6 right-6 md:bottom-8 md:right-8 bg-transparent p-0 rounded-full shadow-lg hover:scale-110 transition-all"
      style={{ zIndex: 9999 }}
      aria-label="Telegram"
      title="Telegram"
    >
      <img
        src="/telegram logo.webp"
        alt="Telegram"
        className="w-14 h-14 md:w-16 md:h-16 rounded-full"
      />
    </button>
  );
}
