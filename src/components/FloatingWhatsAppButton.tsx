import { useLanguage } from '../contexts/LanguageContext';

interface FloatingWhatsAppButtonProps {
  productName?: string;
}

export function FloatingWhatsAppButton({ productName }: FloatingWhatsAppButtonProps) {
  const { language } = useLanguage();
  const whatsappNumber = '33788603290';

  const handleClick = () => {
    let message: string;

    if (productName) {
      if (language === 'ru') {
        message = `Здравствуйте! Хочу узнать доступность тура «${productName}».`;
      } else {
        message = `Hello! I would like to check availability for the «${productName}» tour.`;
      }
    } else {
      if (language === 'ru') {
        message = 'Здравствуйте! Я хочу узнать подробнее о доступных турах в Пхукете.';
      } else {
        message = 'Hello! I would like to get more information about available tours in Phuket.';
      }
    }

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-6 right-6 md:bottom-8 md:right-8 bg-transparent p-0 rounded-full shadow-lg hover:scale-110 transition-all"
      style={{ zIndex: 9999 }}
      aria-label="WhatsApp"
      title="WhatsApp"
    >
      <img
        src="/whatsapp-icon.png"
        alt="WhatsApp"
        className="w-14 h-14 md:w-16 md:h-16 rounded-full"
      />
    </button>
  );
}
