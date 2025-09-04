import * as React from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

interface TariffService {
  id: string;
  name: string;
  description: string;
  icon: string;
  features: string[];
  basePrice: number;
  currency: 'USD' | 'EUR' | 'RUB';
  unit: string;
  popular: boolean;
  category: 'shipping' | 'customs' | 'warehouse' | 'insurance' | 'additional';
  estimatedTime: string;
  routes?: string[];
}

const TariffBlocks: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('shipping');

  const services: TariffService[] = [
    // Shipping Services
    {
      id: 'sea-freight',
      name: 'Морские перевозки',
      description: 'Контейнерные перевозки FCL и LCL по всему миру',
      icon: '🚢',
      features: [
        'Контейнеры 20\' и 40\'',
        'Сборные грузы (LCL)',
        'Страхование груза',
        'Отслеживание в реальном времени',
        'Таможенное оформление'
      ],
      basePrice: 1200,
      currency: 'USD',
      unit: 'за контейнер 20\'',
      popular: true,
      category: 'shipping',
      estimatedTime: '25-35 дней',
      routes: ['Китай → Россия', 'Европа → Россия', 'США → Россия']
    },
    {
      id: 'air-freight',
      name: 'Авиаперевозки',
      description: 'Экспресс доставка воздушным транспортом',
      icon: '✈️',
      features: [
        'Срочная доставка 2-5 дней',
        'Температурный режим',
        'Опасные грузы (DG)',
        'Консолидация грузов',
        'Приоритетная обработка'
      ],
      basePrice: 4.5,
      currency: 'USD',
      unit: 'за кг',
      popular: false,
      category: 'shipping',
      estimatedTime: '2-5 дней',
      routes: ['Европа → Россия', 'Азия → Россия', 'США → Россия']
    },
    {
      id: 'road-freight',
      name: 'Автоперевозки',
      description: 'Наземные перевозки по Европе и СНГ',
      icon: '🚛',
      features: [
        'Полные и частичные загрузки',
        'Рефрижераторные перевозки',
        'Негабаритные грузы',
        'Экспресс доставка',
        'Сборные грузы'
      ],
      basePrice: 2.8,
      currency: 'EUR',
      unit: 'за кг',
      popular: false,
      category: 'shipping',
      estimatedTime: '5-10 дней',
      routes: ['Германия → Россия', 'Польша → Россия', 'Беларусь → Россия']
    },
    
    // Customs Services
    {
      id: 'customs-clearance',
      name: 'Таможенное оформление',
      description: 'Полный спектр таможенных услуг',
      icon: '📋',
      features: [
        'Декларирование товаров',
        'Получение разрешений',
        'Валютное законодательство',
        'Льготное оформление',
        'Консультации по ВЭД'
      ],
      basePrice: 150,
      currency: 'USD',
      unit: 'за декларацию',
      popular: true,
      category: 'customs',
      estimatedTime: '1-3 дня',
    },
    {
      id: 'customs-consulting',
      name: 'Консультации по ВЭД',
      description: 'Экспертная помощь по внешнеэкономической деятельности',
      icon: '💼',
      features: [
        'Классификация товаров',
        'Определение таможенной стоимости',
        'Льготы и преференции',
        'Валютное регулирование',
        'Подготовка документов'
      ],
      basePrice: 80,
      currency: 'USD',
      unit: 'за час',
      popular: false,
      category: 'customs',
      estimatedTime: 'По запросу',
    },

    // Warehouse Services
    {
      id: 'warehouse-storage',
      name: 'Складские услуги',
      description: 'Хранение и обработка грузов',
      icon: '🏭',
      features: [
        'Современные склады класса А',
        'Температурные режимы',
        'Комплектация заказов',
        'Упаковка и маркировка',
        'Система WMS'
      ],
      basePrice: 8,
      currency: 'USD',
      unit: 'за м³ в месяц',
      popular: false,
      category: 'warehouse',
      estimatedTime: 'Долгосрочно',
    },
    {
      id: 'cargo-handling',
      name: 'Обработка грузов',
      description: 'Погрузочно-разгрузочные работы',
      icon: '📦',
      features: [
        'Разгрузка контейнеров',
        'Паллетирование',
        'Сортировка грузов',
        'Проверка качества',
        'Фотофиксация'
      ],
      basePrice: 25,
      currency: 'USD',
      unit: 'за тонну',
      popular: false,
      category: 'warehouse',
      estimatedTime: '1-2 дня',
    },

    // Insurance Services
    {
      id: 'cargo-insurance',
      name: 'Страхование груза',
      description: 'Защита от рисков при перевозке',
      icon: '🛡️',
      features: [
        'Покрытие до 110% стоимости',
        'Все виды транспорта',
        'Быстрое урегулирование',
        'Международные страховщики',
        'Online оформление'
      ],
      basePrice: 0.3,
      currency: 'USD',
      unit: '% от стоимости груза',
      popular: true,
      category: 'insurance',
      estimatedTime: 'Моментально',
    },

    // Additional Services
    {
      id: 'quality-control',
      name: 'Контроль качества',
      description: 'Инспекция товаров у поставщика',
      icon: '🔍',
      features: [
        'Предотгрузочная инспекция',
        'Проверка качества',
        'Фото и видео отчеты',
        'Замеры и тесты',
        'Сертификация'
      ],
      basePrice: 200,
      currency: 'USD',
      unit: 'за инспекцию',
      popular: false,
      category: 'additional',
      estimatedTime: '1-2 дня',
    },
    {
      id: 'documentation',
      name: 'Подготовка документов',
      description: 'Оформление внешнеторговых документов',
      icon: '📄',
      features: [
        'Коммерческие документы',
        'Сертификаты происхождения',
        'Инвойсы и упаковочные листы',
        'Транспортные документы',
        'Легализация документов'
      ],
      basePrice: 50,
      currency: 'USD',
      unit: 'за комплект',
      popular: false,
      category: 'additional',
      estimatedTime: '2-5 дней',
    }
  ];

  const categories = [
    { id: 'shipping', name: 'Перевозки', icon: '🚛', count: services.filter(s => s.category === 'shipping').length },
    { id: 'customs', name: 'Таможня', icon: '📋', count: services.filter(s => s.category === 'customs').length },
    { id: 'warehouse', name: 'Склад', icon: '🏭', count: services.filter(s => s.category === 'warehouse').length },
    { id: 'insurance', name: 'Страхование', icon: '🛡️', count: services.filter(s => s.category === 'insurance').length },
    { id: 'additional', name: 'Доп. услуги', icon: '⚙️', count: services.filter(s => s.category === 'additional').length }
  ];

  const filteredServices = services.filter(service => service.category === selectedCategory);

  const formatPrice = (price: number, currency: string, unit: string) => {
    const symbols = { USD: '$', EUR: '€', RUB: '₽' };
    const symbol = symbols[currency as keyof typeof symbols] || currency;
    
    if (price < 1) {
      return `${price}% ${unit}`;
    }
    
    return `${symbol}${price.toLocaleString()} ${unit}`;
  };

  return (
    <section className="bg-bearplus-bg py-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">
            Наши услуги и тарифы
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Комплексные логистические решения для вашего бизнеса с прозрачным ценообразованием
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center space-x-3 px-6 py-3 rounded-full transition-all duration-300 ${
                selectedCategory === category.id
                  ? 'bg-bearplus-green text-black font-semibold'
                  : 'bg-bearplus-card text-gray-300 hover:bg-bearplus-card-hover'
              }`}
            >
              <span className="text-xl">{category.icon}</span>
              <span>{category.name}</span>
              <span className={`text-xs px-2 py-1 rounded-full ${
                selectedCategory === category.id ? 'bg-black/20' : 'bg-gray-600'
              }`}>
                {category.count}
              </span>
            </button>
          ))}
        </div>

        {/* Service Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredServices.map((service) => (
            <div
              key={service.id}
              className={`relative bg-bearplus-card rounded-xl p-6 transition-all duration-300 hover:bg-bearplus-card-hover hover:transform hover:scale-105 ${
                service.popular ? 'ring-2 ring-bearplus-green' : ''
              }`}
            >
              {/* Popular Badge */}
              {service.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-bearplus-green text-black text-xs font-bold px-4 py-1 rounded-full">
                    ПОПУЛЯРНО
                  </span>
                </div>
              )}

              {/* Service Header */}
              <div className="text-center mb-6">
                <div className="text-4xl mb-3">{service.icon}</div>
                <h3 className="text-xl font-bold text-white mb-2">{service.name}</h3>
                <p className="text-gray-400 text-sm">{service.description}</p>
              </div>

              {/* Price */}
              <div className="text-center mb-6">
                <div className="text-3xl font-bold text-bearplus-green mb-1">
                  {formatPrice(service.basePrice, service.currency, service.unit)}
                </div>
                <div className="text-sm text-gray-500">
                  Время доставки: {service.estimatedTime}
                </div>
              </div>

              {/* Features */}
              <div className="mb-6">
                <ul className="space-y-2">
                  {service.features.map((feature, index) => (
                    <li key={index} className="flex items-start text-sm text-gray-300">
                      <span className="text-bearplus-green mr-2 mt-0.5">✓</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Routes (if available) */}
              {service.routes && (
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-white mb-2">Популярные маршруты:</h4>
                  <div className="space-y-1">
                    {service.routes.map((route, index) => (
                      <div key={index} className="text-xs text-gray-400 bg-bearplus-card-dark px-2 py-1 rounded">
                        {route}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-3">
                <Link
                  to="/calculator"
                  state={{ service: service.id }}
                  className="block w-full text-center bg-bearplus-green text-black font-semibold py-3 rounded-lg hover:bg-bearplus-green/90 transition-colors"
                >
                  Рассчитать стоимость
                </Link>
                <button className="w-full text-bearplus-green border border-bearplus-green py-2 rounded-lg hover:bg-bearplus-green hover:text-black transition-colors">
                  Подробнее
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <div className="bg-bearplus-card rounded-xl p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-white mb-4">
              Нужна индивидуальная консультация?
            </h3>
            <p className="text-gray-400 mb-6">
              Наши эксперты помогут выбрать оптимальное решение для вашего бизнеса и рассчитают персональные тарифы
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/contact"
                className="px-8 py-3 bg-bearplus-green text-black font-semibold rounded-lg hover:bg-bearplus-green/90 transition-colors"
              >
                Получить консультацию
              </Link>
              <Link
                to="/calculator"
                className="px-8 py-3 border border-bearplus-green text-bearplus-green rounded-lg hover:bg-bearplus-green hover:text-black transition-colors"
              >
                Калькулятор стоимости
              </Link>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { icon: '⚡', title: 'Быстро', desc: 'Оперативная обработка заявок' },
            { icon: '💰', title: 'Выгодно', desc: 'Конкурентные цены' },
            { icon: '🛡️', title: 'Надежно', desc: 'Страхование грузов' },
            { icon: '📱', title: 'Удобно', desc: 'Online отслеживание' }
          ].map((item, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl mb-3">{item.icon}</div>
              <h4 className="text-white font-semibold mb-1">{item.title}</h4>
              <p className="text-gray-400 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TariffBlocks;