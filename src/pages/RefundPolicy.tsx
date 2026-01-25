import { useLanguage } from '../contexts/LanguageContext';
import { PolicyLayout } from './PolicyLayout';

export function RefundPolicy() {
  const { language } = useLanguage();
  const isRussian = language === 'ru';

  return (
    <PolicyLayout title={{ en: 'Refund Policy', ru: 'Политика возврата' }}>
      {isRussian ? <RussianContent /> : <EnglishContent />}
    </PolicyLayout>
  );
}

function EnglishContent() {
  return (
    <div className="space-y-6 text-gray-700">
      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Overview</h2>
        <p>
          At PhuketVibe, we want you to have the best experience. If you need to cancel your booking, please review our refund policy below.
        </p>
        <p className="mt-2">
          <strong>Company:</strong> PhuketVibe<br />
          <strong>Address:</strong> 182, 20 Phangmuang Sai Gor Road, PaTong, Kathu District, Phuket 83150, Thailand
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-3">2. Cancellation Window</h2>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-2">
          <p className="font-semibold text-blue-900">
            Full refunds are available for cancellations made at least 24 hours before your scheduled tour.
          </p>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-3">3. Refund Conditions</h2>
        <table className="w-full border-collapse border border-gray-300 mt-2">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2 text-left">Cancellation Time</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Refund Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-300 px-4 py-2">24+ hours before tour</td>
              <td className="border border-gray-300 px-4 py-2 text-green-600 font-semibold">100% refund</td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2">Less than 24 hours before tour</td>
              <td className="border border-gray-300 px-4 py-2 text-red-600 font-semibold">No refund</td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2">No-show</td>
              <td className="border border-gray-300 px-4 py-2 text-red-600 font-semibold">No refund</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-3">4. How to Request a Refund</h2>
        <p>To request a cancellation and refund:</p>
        <ol className="list-decimal pl-6 mt-2 space-y-2">
          <li>Contact us via <strong>WhatsApp</strong> or <strong>Telegram</strong> at +66972137197</li>
          <li>Provide your booking details (name, tour date, tour name)</li>
          <li>State your reason for cancellation</li>
          <li>We will process your request within 24 hours</li>
        </ol>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-3">5. Refund Processing Time</h2>
        <p>
          Once approved, refunds are typically processed within <strong>5-7 business days</strong>. The actual time for funds to appear in your account may vary depending on your payment method and financial institution.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-3">6. Tour Cancellation by PhuketVibe</h2>
        <p>
          If we cancel a tour due to weather conditions, safety concerns, or insufficient participants, you will receive a <strong>full refund</strong> or the option to reschedule at no additional cost.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-3">7. Modifications to Bookings</h2>
        <p>
          If you wish to change your tour date instead of canceling, please contact us at least 24 hours in advance. Date changes are subject to availability and may be accommodated at no extra charge.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-3">8. Contact Us</h2>
        <p>For refund requests or questions, please contact us:</p>
        <ul className="list-none mt-2 space-y-1">
          <li><strong>Email:</strong> website.manager57@gmail.com</li>
          <li><strong>Phone/WhatsApp/Telegram:</strong> +66972137197</li>
        </ul>
      </section>
    </div>
  );
}

function RussianContent() {
  return (
    <div className="space-y-6 text-gray-700">
      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Обзор</h2>
        <p>
          В PhuketVibe мы хотим, чтобы вы получили лучший опыт. Если вам нужно отменить бронирование, ознакомьтесь с нашей политикой возврата ниже.
        </p>
        <p className="mt-2">
          <strong>Компания:</strong> PhuketVibe<br />
          <strong>Адрес:</strong> 182, 20 Phangmuang Sai Gor Road, PaTong, Kathu District, Phuket 83150, Thailand
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-3">2. Сроки отмены</h2>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-2">
          <p className="font-semibold text-blue-900">
            Полный возврат средств доступен при отмене минимум за 24 часа до запланированного тура.
          </p>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-3">3. Условия возврата</h2>
        <table className="w-full border-collapse border border-gray-300 mt-2">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2 text-left">Время отмены</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Сумма возврата</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-300 px-4 py-2">За 24+ часа до тура</td>
              <td className="border border-gray-300 px-4 py-2 text-green-600 font-semibold">100% возврат</td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2">Менее 24 часов до тура</td>
              <td className="border border-gray-300 px-4 py-2 text-red-600 font-semibold">Без возврата</td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2">Неявка</td>
              <td className="border border-gray-300 px-4 py-2 text-red-600 font-semibold">Без возврата</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Как запросить возврат</h2>
        <p>Для отмены и возврата средств:</p>
        <ol className="list-decimal pl-6 mt-2 space-y-2">
          <li>Свяжитесь с нами через <strong>WhatsApp</strong> или <strong>Telegram</strong> по номеру +66972137197</li>
          <li>Укажите данные бронирования (имя, дата тура, название тура)</li>
          <li>Укажите причину отмены</li>
          <li>Мы обработаем ваш запрос в течение 24 часов</li>
        </ol>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-3">5. Сроки обработки возврата</h2>
        <p>
          После одобрения возврат обычно обрабатывается в течение <strong>5-7 рабочих дней</strong>. Фактическое время поступления средств зависит от способа оплаты и вашего банка.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-3">6. Отмена тура со стороны PhuketVibe</h2>
        <p>
          Если мы отменяем тур из-за погодных условий, безопасности или недостаточного количества участников, вы получите <strong>полный возврат</strong> или возможность перенести тур без дополнительной оплаты.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-3">7. Изменение бронирования</h2>
        <p>
          Если вы хотите изменить дату тура вместо отмены, свяжитесь с нами минимум за 24 часа. Изменения даты зависят от наличия мест и могут быть сделаны бесплатно.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-3">8. Свяжитесь с нами</h2>
        <p>Для запросов на возврат или вопросов свяжитесь с нами:</p>
        <ul className="list-none mt-2 space-y-1">
          <li><strong>Email:</strong> website.manager57@gmail.com</li>
          <li><strong>Телефон/WhatsApp/Telegram:</strong> +66972137197</li>
        </ul>
      </section>
    </div>
  );
}
