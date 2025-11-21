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
    textZh: '优质服务！我们租了一周的摩托车，一切都很完美。工作人员非常友好，帮助我们选择了最佳路线。',
    textFr: 'Excellent service ! Nous avons loué un scooter pour une semaine, tout était parfait. Le personnel était très sympathique et nous a aidés à choisir les meilleurs itinéraires.',
    textUz: 'Ajoyib xizmat! Biz bir haftalik skuter ijaraga oldik, hammasi mukammal edi. Xodimlar juda do\'stona bo\'ldi va eng yaxshi yo\'nalishlarni tanlashga yordam berdi.',
    locationRu: 'Москва, Россия',
    locationEn: 'Moscow, Russia',
    locationAz: 'Moskva, Rusiya',
    locationKk: 'Мәскеу, Ресей',
    locationKy: 'Москва, Россия',
    locationZh: '莫斯科，俄罗斯',
    locationFr: 'Moscou, Russie',
    locationUz: 'Moskva, Rossiya'
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
    textZh: '普吉岛最好的旅游！组织完美，导游非常专业。我们特别喜欢岛屿游览。',
    textFr: 'Meilleurs circuits à Phuket ! Organisation parfaite, le guide était très instructif. Nous avons particulièrement aimé l\'excursion sur les îles.',
    textUz: 'Phuketdagi eng yaxshi turlar! Mukammal tashkilot, gid juda ma\'lumotli edi. Ayniqsa orollarga ekskursiyani juda yoqtirdik.',
    locationRu: 'Париж, Франция',
    locationEn: 'Paris, France',
    locationAz: 'Paris, Fransa',
    locationKk: 'Париж, Франция',
    locationKy: 'Париж, Франция',
    locationZh: '巴黎，法国',
    locationFr: 'Paris, France',
    locationUz: 'Parij, Fransiya'
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
    textZh: '很棒的租车体验。所有文件处理得很快，摩托车状况很好。我们一定会再来！',
    textFr: 'Excellente expérience de location de moto. Tous les documents ont été traités rapidement, la moto était en excellent état. Nous reviendrons certainement !',
    textUz: 'Ajoyib motosiklet ijaraga olish tajribasi. Barcha hujjatlar tez tayyorlandi, motosiklet ajoyib holatda edi. Albatta yana kelamiz!',
    locationRu: 'Алматы, Казахстан',
    locationEn: 'Almaty, Kazakhstan',
    locationAz: 'Almatı, Qazaxıstan',
    locationKk: 'Алматы, Қазақстан',
    locationKy: 'Алматы, Казакстан',
    locationZh: '阿拉木图，哈萨克斯坦',
    locationFr: 'Almaty, Kazakhstan',
    locationUz: 'Olmota, Qozog\'iston'
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
    textZh: '对每个客户都非常专业。他们帮助我们选择了合适的旅游，并满足了我们所有的要求。强烈推荐！',
    textFr: 'Approche professionnelle pour chaque client. Ils nous ont aidés à choisir le bon circuit et ont pris en compte toutes nos demandes. Je recommande vivement !',
    textUz: 'Har bir mijozga professional yondashuv. Turni tanlashga yordam berishdi va barcha iltimoslarimizni hisobga olishdi. Hammaga tavsiya qilaman!',
    locationRu: 'Нью-Йорк, США',
    locationEn: 'New York, USA',
    locationAz: 'Nyu-York, ABŞ',
    locationKk: 'Нью-Йорк, АҚШ',
    locationKy: 'Нью-Йорк, АКШ',
    locationZh: '纽约，美国',
    locationFr: 'New York, États-Unis',
    locationUz: 'Nyu-York, AQSh'
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
                  language === 'zh' ? testimonial.textZh :
                  language === 'fr' ? testimonial.textFr :
                  language === 'uz' ? testimonial.textUz :
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
                   language === 'zh' ? testimonial.locationZh :
                   language === 'fr' ? testimonial.locationFr :
                   language === 'uz' ? testimonial.locationUz :
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
