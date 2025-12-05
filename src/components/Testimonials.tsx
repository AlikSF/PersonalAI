import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useState, useEffect, useRef } from 'react';

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
    textRu: 'Прекрасная организация! Брали несколько экскурсий на Пхукете, всё прошло идеально. Очень дружелюбный персонал, помогли выбрать лучшие островные туры. Обязательно вернёмся!',
    textEn: 'Excellent organization! We booked several tours in Phuket, and everything was perfect. The staff was very friendly and helped us choose the best island trips. We will definitely come back!',
    textAz: 'Əla təşkilat! Biz Phuketdə bir neçə tura qatıldıq və hər şey mükəmməl idi. İşçilər çox mehriban idi və ən yaxşı ada turlarını seçməyə kömək etdilər. Mütləq yenə gələcəyik!',
    textKk: 'Өте жақсы ұйымдастырылған! Пхукетте бірнеше турға қатыстық, бәрі керемет өтті. Қызметкерлер өте жылы шырайлы, ең жақсы арал турларын таңдауға көмектесті. Міндетті түрде қайта келеміз!',
    textKy: 'Абдан сонун уюштурулган турлар! Пхукетте бир нече экскурсия алдык, баары мыкты өттү. Жумушчулар абдан жылуу мамиле кылышты, эң жакшы арал турларын тандоого жардам беришти. Кайра келебиз!',
    textZh: '组织非常出色！我们在普吉岛参加了几次旅行，一切都非常顺利。工作人员非常友好，并帮我们选择了最好的海岛行程。我们一定会再来！',
    textFr: 'Organisation parfaite ! Nous avons réservé plusieurs excursions à Phuket et tout s\'est déroulé à merveille. Le personnel était très accueillant et nous a aidés à choisir les meilleures excursions sur les îles. Nous reviendrons sans hésiter !',
    textUz: 'A\'lo tashkilot! Biz Pxuketda bir nechta turga bordik, hammasi zo\'r o\'tdi. Xodimlar juda do\'stona va eng yaxshi orol turlarini tanlashda yordam berishdi. Albatta yana qaytamiz!',
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
    textRu: 'Лучшие туры на Пхукете! Наш гид был очень профессиональный и хорошо рассказывал про острова. Особенно понравилась поездка на Симиланы — вода просто невероятная!',
    textEn: 'The best tours in Phuket! Our guide was very professional and shared great information about the islands. We especially loved the trip to the Similan Islands — the water was unbelievable!',
    textAz: 'Phuketdəki ən yaxşı turlar! Bələdçimiz çox peşəkar idi və adalar haqqında maraqlı məlumatlar verdi. Xüsusilə Similan adalarına səyahət bizə çox xoş gəldi — su möhtəşəmdir!',
    textKk: 'Пхукеттегі ең керемет турлар! Біздің гид өте кәсіби болды, аралдар туралы тамаша ақпарат берді. Әсіресе Симилан аралына барғанымыз қатты ұнады — суы керемет!',
    textKy: 'Пхукеттеги эң мыкты турлар! Гидибиз абдан кесипкөй болуп, аралдар тууралуу көп кызыктуу маалымат айтты. Өзгөчө Симилан аралына болгон сапар жакты — суусу керемет!',
    textZh: '普吉岛最棒的旅行！我们的导游非常专业，并提供了很多关于岛屿的介绍。我们特别喜欢斯米兰群岛之旅——海水美得令人难以置信！',
    textFr: 'Les meilleures excursions à Phuket ! Notre guide était très professionnel et nous a donné beaucoup d\'informations sur les îles. Nous avons particulièrement adoré la sortie aux îles Similan — l\'eau était incroyable !',
    textUz: 'Pxuketdagi eng zo\'r turlar! Gidimiz juda professional edi va orollar haqida juda qiziqarli ma\'lumotlar berdi. Ayniqsa, Similan orollariga sayohat juda yoqdi — suvi ajoyib!',
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
    textRu: 'Отличный сервис! Заказывали туры Пхи-Пхи и Джеймс Бонд. Все прошло комфортно: трансфер вовремя, еда вкусная, гиды внимательные. Безопасно и приятно. Рекомендую!',
    textEn: 'Great service! We booked Phi Phi and James Bond tours. Everything was comfortable: timely transfer, delicious food, attentive guides. Safe and enjoyable. Highly recommended!',
    textAz: 'Əla xidmət! Phi Phi və James Bond turlarını sifariş etdik. Hər şey rahat keçdi: transfer vaxtında, yeməklər dadlı, bələdçilər diqqətli. Təhlükəsiz və xoş təcrübə. Tövsiyə edirəm!',
    textKk: 'Керемет сервис! Пхи-Пхи және Джеймс Бонд турларына тапсырыс бердік. Барлығы жайлы өтті: трансфер уақытында, тамақ дәмді, гидтер мұқият. Қауіпсіз және көңілді. Ұсынамын!',
    textKy: 'Супер сервис! Пхи-Пхи жана Жеймс Бонд турларын заказ кылдык. Баары абдан жакшы болду: трансфер өз убагында, тамак даамдуу, гиддер көңүл бурган. Коопсуз жана жагымдуу. Сунуштайм!',
    textZh: '非常棒的服务！我们预订了皮皮岛和詹姆斯邦德岛的行程。一切都很舒适：接送准时，食物好吃，导游贴心。安全又愉快，非常推荐！',
    textFr: 'Excellent service ! Nous avons réservé les excursions Phi Phi et James Bond. Tout était très confortable : transfert à l\'heure, repas délicieux, guides attentifs. Sécurisé et agréable. Je recommande !',
    textUz: 'Ajoyib xizmat! Biz Phi Phi va James Bond turlarini buyurtma qildik. Hammasi qulay bo\'ldi: transfer o\'z vaqtida, ovqatlar mazali, gidlar e\'tiborli. Xavfsiz va yoqimli. Tavsiya qilaman!',
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
    textRu: 'Аmazing experience! Очень хорошо организованные туры и дружелюбные гиды. Поездка на Пхи-Пхи стала ярким моментом нашего отпуска. Рекомендую всем!',
    textEn: 'Amazing experience! Very well-organized tours and friendly guides. The trip to Phi Phi was the highlight of our vacation. Highly recommended!',
    textAz: 'Möhtəşəm təcrübə! Çox yaxşı təşkil olunmuş turlar və mehriban bələdçilər. Phi Phi səfəri tətilimizin ən yaxşı hissəsi oldu. Şiddətlə tövsiyə edirəm!',
    textKk: 'Тамаша тәжірибе! Өте жақсы ұйымдастырылған турлар және достық гидтер. Пхи-Пхи аралына сапар демалысымыздың ең үздік сәті болды. Ұсынамын!',
    textKy: 'Супер тажрыйба! Мыкты уюштурулган турлар жана жылуу мамилелүү гиддер. Пхи-Пхига баруу эс алуудагы эң сонун учур болду. Бардыгына сунуштайм!',
    textZh: '非常棒的体验！行程安排得很好，导游也非常友善。皮皮岛之旅成为我们假期中最精彩的部分。强烈推荐！',
    textFr: 'Une expérience incroyable ! Les excursions étaient très bien organisées et les guides très sympathiques. La sortie à Phi Phi a été le meilleur moment de nos vacances. Je recommande vivement !',
    textUz: 'Zo\'r tajriba! Juda yaxshi tashkil qilingan turlar va do\'stona gidlar. Phi Phi safarimiz ta\'tildagi eng yaxshi qism bo\'ldi. Tavsiya qilaman!',
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
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [slidesPerView, setSlidesPerView] = useState(1);
  const autoPlayRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const updateSlidesPerView = () => {
      if (window.innerWidth >= 1024) {
        setSlidesPerView(3);
      } else if (window.innerWidth >= 768) {
        setSlidesPerView(2);
      } else {
        setSlidesPerView(1);
      }
    };

    updateSlidesPerView();
    window.addEventListener('resize', updateSlidesPerView);
    return () => window.removeEventListener('resize', updateSlidesPerView);
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  useEffect(() => {
    if (isAutoPlaying) {
      autoPlayRef.current = setInterval(nextSlide, 3500);
    }
    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [isAutoPlaying, currentIndex]);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 75) {
      nextSlide();
    }
    if (touchStart - touchEnd < -75) {
      prevSlide();
    }
  };

  const handleMouseEnter = () => {
    setIsAutoPlaying(false);
  };

  const handleMouseLeave = () => {
    setIsAutoPlaying(true);
  };

  return (
    <section className="py-12 md:py-16 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
            {t('testimonials.title')}
          </h2>
          <p className="text-sm md:text-base text-gray-600">
            {t('testimonials.subtitle')}
          </p>
        </div>

        <div
          className="relative"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-700 ease-in-out"
              style={{
                transform: `translateX(-${currentIndex * (100 / slidesPerView)}%)`
              }}
            >
              {testimonials.map((testimonial) => (
                <div
                  key={testimonial.id}
                  className="w-full md:w-1/2 lg:w-1/3 flex-shrink-0 px-3"
                >
                  <div className="bg-gray-50 rounded-xl p-6 shadow-md hover:shadow-xl transition-shadow duration-300 h-full">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex gap-1">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star
                            key={i}
                            className="h-5 w-5 fill-yellow-400 text-yellow-400"
                          />
                        ))}
                      </div>
                    </div>

                    <p className="text-sm text-gray-700 mb-4 leading-relaxed min-h-[120px]">
                      {language === 'en' ? testimonial.textEn :
                        language === 'az' ? testimonial.textAz :
                        language === 'kk' ? testimonial.textKk :
                        language === 'ky' ? testimonial.textKy :
                        language === 'zh' ? testimonial.textZh :
                        language === 'fr' ? testimonial.textFr :
                        language === 'uz' ? testimonial.textUz :
                        testimonial.textRu}
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
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={prevSlide}
            className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors z-10"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="h-6 w-6 text-gray-600" />
          </button>

          <button
            onClick={nextSlide}
            className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors z-10"
            aria-label="Next testimonial"
          >
            <ChevronRight className="h-6 w-6 text-gray-600" />
          </button>
        </div>

        <div className="flex justify-center gap-2 mt-8">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? 'w-8 bg-blue-600'
                  : 'w-2 bg-gray-300 hover:bg-gray-400'
              }`}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
