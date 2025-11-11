import { Star } from 'lucide-react';

interface Testimonial {
  id: number;
  name: string;
  rating: number;
  text: string;
  location: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: 'Анна Петрова',
    rating: 5,
    text: 'Отличный сервис! Арендовали скутер на неделю, всё было идеально. Персонал очень дружелюбный и помогли с выбором маршрута.',
    location: 'Москва, Россия'
  },
  {
    id: 2,
    name: 'Sophie Dubois',
    rating: 5,
    text: 'Лучшие туры на Пхукете! Организация на высоте, гид был очень информативным. Особенно понравилась экскурсия к островам.',
    location: 'Париж, Франция'
  },
  {
    id: 3,
    name: 'Айгүл Нұрғалиева',
    rating: 5,
    text: 'Прекрасный опыт аренды байка. Все документы оформили быстро, техника в отличном состоянии. Обязательно вернёмся снова!',
    location: 'Алматы, Казахстан'
  },
  {
    id: 4,
    name: 'Michael Johnson',
    rating: 5,
    text: 'Профессиональный подход к каждому клиенту. Помогли с выбором тура, учли все наши пожелания. Рекомендую всем!',
    location: 'New York, USA'
  }
];

export function Testimonials() {
  return (
    <section className="py-12 md:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
            Отзывы наших клиентов
          </h2>
          <p className="text-sm md:text-base text-gray-600">
            Узнайте, что говорят о нас наши довольные клиенты
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
                "{testimonial.text}"
              </p>

              <div className="border-t border-gray-200 pt-4">
                <p className="font-semibold text-gray-900 text-sm">
                  {testimonial.name}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {testimonial.location}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
