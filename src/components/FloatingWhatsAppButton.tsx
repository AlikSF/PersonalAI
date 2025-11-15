import { MessageCircle } from 'lucide-react';
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
        message = `Здравствуйте! Хочу узнать доступность и подробности тура «${productName}». Есть ли свободные места на ближайшие даты?`;
      } else {
        message = `Hello! I would like to check the availability and details for the «${productName}» tour. Are there any spots available in the coming days?`;
      }
    } else {
      if (language === 'ru') {
        message = 'Здравствуйте! Я хочу узнать подробнее о доступных турах в Пхукете и ближайших свободных датах. Подскажите, пожалуйста?';
      } else {
        message = 'Hello! I would like to get more information about the available tours in Phuket and the nearest available dates. Could you please assist me?';
      }
    }

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-6 right-6 md:bottom-8 md:right-8 bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition-all hover:scale-110 z-40"
      aria-label="WhatsApp"
      title="WhatsApp"
    >
      <MessageCircle className="h-6 w-6" />
    </button>
  );
}
