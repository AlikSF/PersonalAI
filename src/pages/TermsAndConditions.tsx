import { useLanguage } from '../contexts/LanguageContext';
import { PolicyLayout } from './PolicyLayout';

export function TermsAndConditions() {
  const { language } = useLanguage();
  const isRussian = language === 'ru';

  return (
    <PolicyLayout title={{ en: 'Terms and Conditions', ru: 'Условия использования' }}>
      {isRussian ? <RussianContent /> : <EnglishContent />}
    </PolicyLayout>
  );
}

function EnglishContent() {
  return (
    <div className="space-y-6 text-gray-700">
      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Agreement to Terms</h2>
        <p>
          By accessing and using the PhuketVibe website and booking our tour services, you agree to be bound by these Terms and Conditions. If you do not agree, please do not use our services.
        </p>
        <p className="mt-2">
          <strong>Company:</strong> PhuketVibe<br />
          <strong>Address:</strong> 182, 20 Phangmuang Sai Gor Road, PaTong, Kathu District, Phuket 83150, Thailand
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-3">2. Booking Process</h2>
        <p>When making a booking, you will be asked to provide:</p>
        <ul className="list-disc pl-6 mt-2 space-y-1">
          <li>Your name</li>
          <li>Phone number (for WhatsApp/Telegram communication)</li>
          <li>Preferred tour date</li>
          <li>Hotel or pickup location</li>
          <li>Any special requests or messages</li>
        </ul>
        <p className="mt-2">
          Upon submission, our team will contact you via <strong>WhatsApp</strong> or <strong>Telegram</strong> to confirm your booking and provide further details.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-3">3. Tour Confirmation</h2>
        <p>
          A booking is considered confirmed only after you receive written confirmation from our team via WhatsApp or Telegram. Please ensure your contact information is accurate.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Pricing and Payment</h2>
        <p>
          All prices displayed on our website are in Thai Baht (THB) unless otherwise stated. Payment methods and timing will be communicated during the booking confirmation process.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-3">5. Cancellation Policy</h2>
        <p>
          Cancellations made at least <strong>24 hours before</strong> the scheduled tour date are eligible for a full refund. Please see our <a href="/refund-policy" className="text-blue-600 hover:underline">Refund Policy</a> for complete details.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-3">6. Tour Modifications</h2>
        <p>
          We reserve the right to modify tour itineraries due to weather conditions, safety concerns, or other unforeseen circumstances. In such cases, we will offer alternatives or refunds as appropriate.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-3">7. Customer Responsibilities</h2>
        <p>Customers are responsible for:</p>
        <ul className="list-disc pl-6 mt-2 space-y-1">
          <li>Providing accurate contact and pickup information</li>
          <li>Being ready at the agreed pickup time and location</li>
          <li>Following safety instructions during tours</li>
          <li>Having appropriate travel documents and insurance</li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-3">8. Limitation of Liability</h2>
        <p>
          PhuketVibe acts as an intermediary between customers and tour operators. While we ensure quality partnerships, we are not liable for accidents, injuries, or losses that may occur during tours.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-3">9. Contact Information</h2>
        <p>For questions about these Terms, please contact us:</p>
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
        <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Принятие условий</h2>
        <p>
          Используя сайт PhuketVibe и бронируя наши туры, вы соглашаетесь с настоящими Условиями использования. Если вы не согласны, пожалуйста, не используйте наши услуги.
        </p>
        <p className="mt-2">
          <strong>Компания:</strong> PhuketVibe<br />
          <strong>Адрес:</strong> 182, 20 Phangmuang Sai Gor Road, PaTong, Kathu District, Phuket 83150, Thailand
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-3">2. Процесс бронирования</h2>
        <p>При бронировании вам необходимо указать:</p>
        <ul className="list-disc pl-6 mt-2 space-y-1">
          <li>Ваше имя</li>
          <li>Номер телефона (для связи через WhatsApp/Telegram)</li>
          <li>Желаемую дату тура</li>
          <li>Отель или место встречи</li>
          <li>Особые пожелания или сообщения</li>
        </ul>
        <p className="mt-2">
          После отправки заявки наша команда свяжется с вами через <strong>WhatsApp</strong> или <strong>Telegram</strong> для подтверждения бронирования.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-3">3. Подтверждение тура</h2>
        <p>
          Бронирование считается подтвержденным только после получения письменного подтверждения от нашей команды через WhatsApp или Telegram. Убедитесь в правильности контактных данных.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Цены и оплата</h2>
        <p>
          Все цены на сайте указаны в тайских батах (THB), если не указано иное. Способы и сроки оплаты будут сообщены при подтверждении бронирования.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-3">5. Политика отмены</h2>
        <p>
          Отмены, сделанные минимум за <strong>24 часа до</strong> даты тура, подлежат полному возврату средств. Подробности см. в нашей <a href="/refund-policy" className="text-blue-600 hover:underline">Политике возврата</a>.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-3">6. Изменения тура</h2>
        <p>
          Мы оставляем за собой право изменять маршруты из-за погодных условий, соображений безопасности или других обстоятельств. В таких случаях мы предложим альтернативы или возврат средств.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-3">7. Обязанности клиента</h2>
        <p>Клиенты обязаны:</p>
        <ul className="list-disc pl-6 mt-2 space-y-1">
          <li>Предоставить точную контактную информацию и место встречи</li>
          <li>Быть готовыми в согласованное время и месте</li>
          <li>Соблюдать инструкции по безопасности</li>
          <li>Иметь необходимые документы и страховку</li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-3">8. Ограничение ответственности</h2>
        <p>
          PhuketVibe выступает посредником между клиентами и туроператорами. Несмотря на качественное партнерство, мы не несем ответственности за несчастные случаи, травмы или убытки во время туров.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-3">9. Контактная информация</h2>
        <p>По вопросам об этих Условиях свяжитесь с нами:</p>
        <ul className="list-none mt-2 space-y-1">
          <li><strong>Email:</strong> website.manager57@gmail.com</li>
          <li><strong>Телефон:</strong> +66972137197</li>
        </ul>
      </section>
    </div>
  );
}
