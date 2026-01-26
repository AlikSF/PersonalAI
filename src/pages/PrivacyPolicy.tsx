import { useLanguage } from '../contexts/LanguageContext';
import { PolicyLayout } from './PolicyLayout';

export function PrivacyPolicy() {
  const { language } = useLanguage();
  const isRussian = language === 'ru';

  return (
    <PolicyLayout
      title={{ en: 'Privacy Policy', ru: 'Политика конфиденциальности' }}
      description={{
        en: 'Privacy Policy for Phuket Vibe Tours. Learn how we collect, use, and protect your personal information when booking tours in Phuket, Thailand.',
        ru: 'Политика конфиденциальности Phuket Vibe Tours. Узнайте, как мы собираем, используем и защищаем вашу личную информацию при бронировании туров на Пхукете.'
      }}
      path="/privacy-policy"
    >
      {isRussian ? <RussianContent /> : <EnglishContent />}
    </PolicyLayout>
  );
}

function EnglishContent() {
  return (
    <div className="space-y-6 text-gray-700">
      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Introduction</h2>
        <p>
          PhuketVibe ("we", "our", "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your personal information when you use our tour booking services.
        </p>
        <p className="mt-2">
          <strong>Company Address:</strong> 182, 20 Phangmuang Sai Gor Road, PaTong, Kathu District, Phuket 83150, Thailand
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-3">2. Information We Collect</h2>
        <p>When you make a booking through our website, we collect the following information:</p>
        <ul className="list-disc pl-6 mt-2 space-y-1">
          <li><strong>Name</strong> - to identify you and personalize your experience</li>
          <li><strong>Phone number</strong> - to contact you regarding your booking</li>
          <li><strong>Tour date</strong> - to schedule your tour</li>
          <li><strong>Hotel/Pickup location</strong> - to arrange transportation</li>
          <li><strong>Message</strong> - any special requests or questions you may have</li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-3">3. How We Use Your Information</h2>
        <p>We use your personal information to:</p>
        <ul className="list-disc pl-6 mt-2 space-y-1">
          <li>Process and confirm your tour bookings</li>
          <li>Contact you via WhatsApp or Telegram regarding your reservation</li>
          <li>Arrange pickup and transportation services</li>
          <li>Respond to your inquiries and special requests</li>
          <li>Send booking confirmations and tour reminders</li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Communication Methods</h2>
        <p>
          We primarily contact customers through <strong>WhatsApp</strong> and <strong>Telegram</strong> using the phone number you provide. This allows for quick, convenient communication about your booking details, pickup times, and any changes to your tour.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-3">5. Analytics and Cookies</h2>
        <p>
          We use <strong>Google Analytics</strong> to understand how visitors interact with our website. This service is only activated after you provide consent through our cookie consent banner. If you reject cookies, no analytics data will be collected.
        </p>
        <p className="mt-2">
          For more details, please see our <a href="/cookie-policy" className="text-blue-600 hover:underline">Cookie Policy</a>.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-3">6. Data Security</h2>
        <p>
          We implement appropriate security measures to protect your personal information. Your data is stored securely and is only accessible to authorized personnel who need it to process your bookings.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-3">7. Data Retention</h2>
        <p>
          We retain your booking information for the duration necessary to fulfill your tour and for our business records. You may request deletion of your personal data by contacting us.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-3">8. Contact Us</h2>
        <p>If you have questions about this Privacy Policy, please contact us:</p>
        <ul className="list-none mt-2 space-y-1">
          <li><strong>Email:</strong> website.manager57@gmail.com</li>
          <li><strong>Phone:</strong> +66972137197</li>
        </ul>
      </section>
    </div>
  );
}

function RussianContent() {
  return (
    <div className="space-y-6 text-gray-700">
      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Введение</h2>
        <p>
          PhuketVibe ("мы", "наш", "нас") обязуется защищать вашу конфиденциальность. Настоящая Политика конфиденциальности объясняет, как мы собираем, используем и защищаем вашу личную информацию при использовании наших услуг по бронированию туров.
        </p>
        <p className="mt-2">
          <strong>Адрес компании:</strong> 182, 20 Phangmuang Sai Gor Road, PaTong, Kathu District, Phuket 83150, Thailand
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-3">2. Информация, которую мы собираем</h2>
        <p>При бронировании через наш сайт мы собираем следующую информацию:</p>
        <ul className="list-disc pl-6 mt-2 space-y-1">
          <li><strong>Имя</strong> - для идентификации и персонализации</li>
          <li><strong>Номер телефона</strong> - для связи по вашему бронированию</li>
          <li><strong>Дата тура</strong> - для планирования вашего тура</li>
          <li><strong>Отель/Место встречи</strong> - для организации трансфера</li>
          <li><strong>Сообщение</strong> - особые пожелания или вопросы</li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-3">3. Как мы используем вашу информацию</h2>
        <p>Мы используем вашу личную информацию для:</p>
        <ul className="list-disc pl-6 mt-2 space-y-1">
          <li>Обработки и подтверждения ваших бронирований</li>
          <li>Связи с вами через WhatsApp или Telegram</li>
          <li>Организации трансфера</li>
          <li>Ответа на ваши запросы и особые пожелания</li>
          <li>Отправки подтверждений и напоминаний о туре</li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Способы связи</h2>
        <p>
          Мы связываемся с клиентами преимущественно через <strong>WhatsApp</strong> и <strong>Telegram</strong>, используя указанный вами номер телефона. Это позволяет быстро и удобно обсудить детали бронирования, время встречи и любые изменения в туре.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-3">5. Аналитика и файлы cookie</h2>
        <p>
          Мы используем <strong>Google Analytics</strong> для анализа взаимодействия посетителей с сайтом. Эта служба активируется только после вашего согласия через баннер cookie. Если вы отклоните cookie, данные аналитики собираться не будут.
        </p>
        <p className="mt-2">
          Подробнее см. в нашей <a href="/cookie-policy" className="text-blue-600 hover:underline">Политике cookie</a>.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-3">6. Безопасность данных</h2>
        <p>
          Мы применяем соответствующие меры безопасности для защиты вашей личной информации. Ваши данные хранятся безопасно и доступны только уполномоченным сотрудникам.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-3">7. Хранение данных</h2>
        <p>
          Мы храним информацию о бронировании в течение времени, необходимого для проведения тура и ведения деловой документации. Вы можете запросить удаление своих данных, связавшись с нами.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-3">8. Свяжитесь с нами</h2>
        <p>Если у вас есть вопросы по данной Политике, свяжитесь с нами:</p>
        <ul className="list-none mt-2 space-y-1">
          <li><strong>Email:</strong> website.manager57@gmail.com</li>
          <li><strong>Телефон:</strong> +66972137197</li>
        </ul>
      </section>
    </div>
  );
}
