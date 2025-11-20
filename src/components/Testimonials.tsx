import { Star } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface Testimonial {
  id: number;
  name: string;
  rating: number;
  textRu: string;
  textEn: string;
  textAz: string;
  textKk: string;
  textKy: string;
  locationRu: string;
  locationEn: string;
  locationAz: string;
  locationKk: string;
  locationKy: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: 'Анна Петрова',
    rating: 5,
    textRu: 'Отличный сервис! Арендовали скутер на неделю, всё было идеально. Персонал очень дружелюбный и помогли с выбором маршрута.',
    textEn: 'Excellent service! We rented a scooter for a week, everything was perfect. The staff was very friendly and helped us choose the best routes.',
    textAz: 'Əla xidmət! Bir həftəliyə skuter icarəyə götürdük, hər şey mükəmməl idi. Personal çox mehriban idi və ən yaxşı marşrutları seçməyə kömək etdi.',
    textKk: 'Тамаша қызмет! Біз бір аптаға скутер жалдадық, бәрі керемет болды. Қызметкерлер өте достық және ең жақсы бағыттарды таңдауға көмектесті.',
    textKy: 'Мыкты кызмат! Бир жумага скутер ижарага алдык, баары эң сонун болду. Кызматкерлер өтө достук жана эң мыкты багыттарды тандоого жардам беришти.',
    locationRu: 'Москва, Россия',
    locationEn: 'Moscow, Russia',
    locationAz: 'Moskva, Rusiya',
    locationKk: 'Мәскеу, Ресей',
    locationKy: 'Москва, Россия'
  },
  {
    id: 2,
    name: 'Sophie Dubois',
    rating: 5,
    textRu: 'Лучшие туры на Пхукете! Организация на высоте, гид был очень информативным. Особенно понравилась экскурсия к островам.',
    textEn: 'Best tours in Phuket! Perfect organization, the guide was very informative. We especially loved the island excursion.',
    textAz: 'Phuketdə ən yaxşı turlar! Mükəmməl təşkilat, bələdçi çox məlumatlı idi. Xüsusilə ada ekskursiyası çox xoşumuza gəldi.',
    textKk: 'Пхукеттегі ең жақсы турлар! Тамаша ұйымдастыру, гид өте ақпараттық болды. Біз әсіресе аралдарға экскурсияны ұнаттық.',
    textKy: 'Пхукеттеги эң мыкты турлар! Эң сонун уюштуруу, гид өтө маалыматтуу болду. Биз өзгөчө аралдарга экскурсияны жакшы көрдүк.',
    locationRu: 'Париж, Франция',
    locationEn: 'Paris, France',
    locationAz: 'Paris, Fransa',
    locationKk: 'Париж, Франция',
    locationKy: 'Париж, Франция'
  },
  {
    id: 3,
    name: 'Айгүл Нұрғалиева',
    rating: 5,
    textRu: 'Прекрасный опыт аренды байка. Все документы оформили быстро, техника в отличном состоянии. Обязательно вернёмся снова!',
    textEn: 'Great bike rental experience. All documents were processed quickly, the bike was in excellent condition. Will definitely come back again!',
    textAz: 'Motosiklet icarəsi üzrə əla təcrübə. Bütün sənədlər tez hazırlandı, motosiklet əla vəziyyətdə idi. Mütləq yenidən gələcəyik!',
    textKk: 'Мотоцикл жалдаудың керемет тәжірибесі. Барлық құжаттар тез рәсімделді, мотоцикл тамаша жағдайда болды. Міндетті түрде қайта оралармыз!',
    textKy: 'Мотоцикл ижарага алуунун мыкты тажрыйбасы. Бардык документтер тез даярдалды, мотоцикл эң сонун абалда болгон. Сөзсүз кайра келебиз!',
    locationRu: 'Алматы, Казахстан',
    locationEn: 'Almaty, Kazakhstan',
    locationAz: 'Almatı, Qazaxıstan',
    locationKk: 'Алматы, Қазақстан',
    locationKy: 'Алматы, Казакстан'
  },
  {
    id: 4,
    name: 'Michael Johnson',
    rating: 5,
    textRu: 'Профессиональный подход к каждому клиенту. Помогли с выбором тура, учли все наши пожелания. Рекомендую всем!',
    textEn: 'Professional approach to every client. They helped us choose the right tour and accommodated all our requests. Highly recommend!',
    textAz: 'Hər bir müştəriyə peşəkar yanaşma. Tur seçməyə kömək etdilər və bütün istəklərimizi nəzərə aldılar. Hamıya tövsiyə edirəm!',
    textKk: 'Әрбір клиентке кәсіби көзқарас. Турды таңдауға көмектесті және барлық тілектерімізді ескерді. Барлығына ұсынамын!',
    textKy: 'Ар бир кардарга кесипкөй мамиле. Турду тандоого жардам беришти жана бардык каалообузду эске алышты. Баарына сунуштайм!',
    locationRu: 'Нью-Йорк, США',
    locationEn: 'New York, USA',
    locationAz: 'Nyu-York, ABŞ',
    locationKk: 'Нью-Йорк, АҚШ',
    locationKy: 'Нью-Йорк, АКШ'
  }
];

export function Testimonials() {
  const { language, t } = useLanguage();
  return (
    <section className="py-12 md:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
            {t('testimonials.title')}
          </h2>
          <p className="text-sm md:text-base text-gray-600">
            {t('testimonials.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-gray-50 rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex gap-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
              </div>

              <p className="text-sm text-gray-700 mb-4 leading-relaxed">
                "{language === 'en' ? testimonial.textEn :
                  language === 'az' ? testimonial.textAz :
                  language === 'kk' ? testimonial.textKk :
                  language === 'ky' ? testimonial.textKy :
                  testimonial.textRu}"
              </p>

              <div className="border-t border-gray-200 pt-4">
                <p className="font-semibold text-gray-900 text-sm">
                  {testimonial.name}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {language === 'en' ? testimonial.locationEn :
                   language === 'az' ? testimonial.locationAz :
                   language === 'kk' ? testimonial.locationKk :
                   language === 'ky' ? testimonial.locationKy :
                   testimonial.locationRu}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
