import { useLanguage } from '../contexts/LanguageContext';
import { PolicyLayout } from './PolicyLayout';

export function CookiePolicy() {
  const { language } = useLanguage();
  const isRussian = language === 'ru';

  return (
    <PolicyLayout
      title={{ en: 'Cookie Policy', ru: 'Политика cookie' }}
      description={{
        en: 'Cookie Policy for Phuket Vibe Tours. Learn how we use cookies and Google Analytics on our website. You control your cookie preferences.',
        ru: 'Политика cookie Phuket Vibe Tours. Узнайте, как мы используем cookie и Google Analytics на нашем сайте. Вы контролируете свои настройки cookie.'
      }}
      path="/cookie-policy"
    >
      {isRussian ? <RussianContent /> : <EnglishContent />}
    </PolicyLayout>
  );
}

function EnglishContent() {
  return (
    <div className="space-y-6 text-gray-700">
      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-3">1. What Are Cookies?</h2>
        <p>
          Cookies are small text files stored on your device when you visit a website. They help websites remember your preferences and improve your browsing experience.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-3">2. How We Use Cookies</h2>
        <p>
          At PhuketVibe, we use cookies to improve your experience on our website. We respect your privacy and only use analytics cookies with your explicit consent.
        </p>
        <p className="mt-2">
          <strong>Company:</strong> PhuketVibe<br />
          <strong>Address:</strong> 182, 20 Phangmuang Sai Gor Road, PaTong, Kathu District, Phuket 83150, Thailand
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-3">3. Types of Cookies We Use</h2>

        <div className="space-y-4 mt-4">
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900">Essential Cookies</h3>
            <p className="text-sm mt-1">
              These cookies are necessary for the website to function properly. They enable basic functions like page navigation and language preferences. These cookies do not require consent.
            </p>
            <p className="text-xs text-gray-500 mt-2">
              <strong>Example:</strong> Language preference stored in localStorage
            </p>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900">Analytics Cookies (Requires Consent)</h3>
            <p className="text-sm mt-1">
              We use <strong>Google Analytics</strong> to understand how visitors use our website. This helps us improve our services and content. These cookies are only activated if you click "Accept" on our cookie consent banner.
            </p>
            <p className="text-xs text-gray-500 mt-2">
              <strong>Provider:</strong> Google Analytics (GA4)<br />
              <strong>Purpose:</strong> Traffic analysis, user behavior insights
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Your Cookie Choices</h2>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-2">
          <p className="font-semibold text-green-900 mb-2">You are in control!</p>
          <ul className="list-disc pl-6 space-y-1 text-sm">
            <li><strong>Accept:</strong> Google Analytics will be loaded and track your visit anonymously</li>
            <li><strong>Reject:</strong> Google Analytics will NOT be loaded at all</li>
          </ul>
        </div>
        <p className="mt-4">
          Your choice is saved in your browser's localStorage, so you won't see the cookie banner again unless you clear your browser data.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-3">5. Changing Your Cookie Preferences</h2>
        <p>
          You can change your cookie preferences at any time by clicking the <strong>"Cookie Settings"</strong> link in our website footer. This will reopen the consent banner where you can update your choice.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-3">6. Google Analytics Data</h2>
        <p>If you accept analytics cookies, Google Analytics may collect:</p>
        <ul className="list-disc pl-6 mt-2 space-y-1">
          <li>Pages you visit on our website</li>
          <li>Time spent on each page</li>
          <li>How you arrived at our site (referrer)</li>
          <li>Your approximate geographic location (country/city)</li>
          <li>Device and browser information</li>
        </ul>
        <p className="mt-2">
          This data is collected anonymously and helps us understand what content is most useful to our visitors.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-3">7. Third-Party Cookies</h2>
        <p>
          Our website does not use social media tracking pixels or advertising cookies. The only third-party service we use is Google Analytics, and only with your consent.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-3">8. Contact Us</h2>
        <p>If you have questions about our cookie policy, please contact us:</p>
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
        <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Что такое файлы cookie?</h2>
        <p>
          Файлы cookie - это небольшие текстовые файлы, сохраняемые на вашем устройстве при посещении веб-сайта. Они помогают сайтам запоминать ваши предпочтения и улучшать работу.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-3">2. Как мы используем cookie</h2>
        <p>
          В PhuketVibe мы используем cookie для улучшения вашего опыта на сайте. Мы уважаем вашу конфиденциальность и используем аналитические cookie только с вашего явного согласия.
        </p>
        <p className="mt-2">
          <strong>Компания:</strong> PhuketVibe<br />
          <strong>Адрес:</strong> 182, 20 Phangmuang Sai Gor Road, PaTong, Kathu District, Phuket 83150, Thailand
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-3">3. Типы cookie, которые мы используем</h2>

        <div className="space-y-4 mt-4">
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900">Обязательные cookie</h3>
            <p className="text-sm mt-1">
              Эти cookie необходимы для правильной работы сайта. Они обеспечивают базовые функции, такие как навигация и языковые настройки. Эти cookie не требуют согласия.
            </p>
            <p className="text-xs text-gray-500 mt-2">
              <strong>Пример:</strong> Языковые предпочтения в localStorage
            </p>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900">Аналитические cookie (требуют согласия)</h3>
            <p className="text-sm mt-1">
              Мы используем <strong>Google Analytics</strong> для понимания того, как посетители используют наш сайт. Это помогает улучшать наши услуги. Эти cookie активируются только при нажатии "Принять" в баннере cookie.
            </p>
            <p className="text-xs text-gray-500 mt-2">
              <strong>Поставщик:</strong> Google Analytics (GA4)<br />
              <strong>Цель:</strong> Анализ трафика, поведение пользователей
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Ваш выбор cookie</h2>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-2">
          <p className="font-semibold text-green-900 mb-2">Вы контролируете!</p>
          <ul className="list-disc pl-6 space-y-1 text-sm">
            <li><strong>Принять:</strong> Google Analytics будет загружен и анонимно отслеживать ваш визит</li>
            <li><strong>Отклонить:</strong> Google Analytics НЕ будет загружен вообще</li>
          </ul>
        </div>
        <p className="mt-4">
          Ваш выбор сохраняется в localStorage браузера, поэтому баннер cookie не будет показан снова, пока вы не очистите данные браузера.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-3">5. Изменение настроек cookie</h2>
        <p>
          Вы можете изменить настройки cookie в любое время, нажав на ссылку <strong>"Настройки cookie"</strong> в нижней части сайта. Это откроет баннер согласия, где вы можете обновить свой выбор.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-3">6. Данные Google Analytics</h2>
        <p>Если вы принимаете аналитические cookie, Google Analytics может собирать:</p>
        <ul className="list-disc pl-6 mt-2 space-y-1">
          <li>Страницы, которые вы посещаете на нашем сайте</li>
          <li>Время, проведенное на каждой странице</li>
          <li>Как вы попали на наш сайт (реферер)</li>
          <li>Ваше приблизительное местоположение (страна/город)</li>
          <li>Информация об устройстве и браузере</li>
        </ul>
        <p className="mt-2">
          Эти данные собираются анонимно и помогают нам понять, какой контент наиболее полезен для посетителей.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-3">7. Сторонние cookie</h2>
        <p>
          Наш сайт не использует пиксели отслеживания социальных сетей или рекламные cookie. Единственный сторонний сервис - Google Analytics, и только с вашего согласия.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-3">8. Свяжитесь с нами</h2>
        <p>Если у вас есть вопросы о политике cookie, свяжитесь с нами:</p>
        <ul className="list-none mt-2 space-y-1">
          <li><strong>Email:</strong> website.manager57@gmail.com</li>
          <li><strong>Телефон:</strong> +66972137197</li>
        </ul>
      </section>
    </div>
  );
}
