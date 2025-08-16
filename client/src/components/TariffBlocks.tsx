import * as React from 'react';

interface TariffBlock {
  id: string;
  title: string;
  description: string;
  icon: string;
  link: string;
  color: string;
  features: string[];
}

interface TariffBlocksProps {
  className?: string;
}

const TariffBlocks: React.FC<TariffBlocksProps> = ({ className = '' }) => {
  const tariffBlocks: TariffBlock[] = [
    {
      id: 'shipping-calculator',
      title: 'Расчет доставки',
      description: 'Быстрый расчет стоимости доставки по всем видам транспорта',
      icon: '🧮',
      link: '#calculator',
      color: 'from-blue-600 to-blue-400',
      features: [
        'Мгновенный расчет',
        'Все виды транспорта',
        'Учет особенностей груза',
        'Актуальные тарифы'
      ]
    },
    {
      id: 'freight-rates',
      title: 'Ставки фрахта',
      description: 'Актуальные ставки морского фрахта по всем направлениям',
      icon: '🚢',
      link: '/freight-rates',
      color: 'from-emerald-600 to-emerald-400',
      features: [
        'Ежедневное обновление',
        'Основные направления',
        'История изменений',
        'Прогнозы рынка'
      ]
    },
    {
      id: 'ship-map',
      title: 'Судовая карта',
      description: 'Отслеживание судов в реальном времени',
      icon: '🗺️',
      link: '/ship-tracking',
      color: 'from-cyan-600 to-cyan-400',
      features: [
        'Отслеживание в реальном времени',
        'Расписание портов',
        'Информация о судах',
        'Уведомления о прибытии'
      ]
    },
    {
      id: 'container-rental',
      title: 'Аренда КТК',
      description: 'Контейнерные терминальные комплексы и аренда',
      icon: '📦',
      link: '/container-rental',
      color: 'from-purple-600 to-purple-400',
      features: [
        'Различные типы контейнеров',
        'Гибкие условия аренды',
        'Складские услуги',
        'Прозрачное ценообразование'
      ]
    },
    {
      id: 'auto-delivery',
      title: 'Авто доставка',
      description: 'Автомобильные перевозки и доставка "от двери до двери"',
      icon: '🚛',
      link: '/auto-delivery',
      color: 'from-orange-600 to-orange-400',
      features: [
        'Доставка до двери',
        'Различные типы ТС',
        'Страхование грузов',
        'Экспресс доставка'
      ]
    },
    {
      id: 'railway-tariffs',
      title: 'ЖД тарифы',
      description: 'Железнодорожные перевозки и актуальные тарифы',
      icon: '🚂',
      link: '/railway-tariffs',
      color: 'from-red-600 to-red-400',
      features: [
        'Контейнерные перевозки',
        'Сборные грузы',
        'Специальные вагоны',
        'Мультимодальные схемы'
      ]
    }
  ];

  const handleBlockClick = (link: string) => {
    if (link.startsWith('#')) {
      // Scroll to element on same page
      const element = document.querySelector(link);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // Navigate to different page (you would use router here)
      console.log('Navigate to:', link);
    }
  };

  return (
    <div className={`${className}`}>
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-white mb-4">Тарифы и услуги</h2>
        <p className="text-gray-300 text-lg max-w-2xl mx-auto">
          Полный спектр логистических услуг с прозрачным ценообразованием
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tariffBlocks.map((block) => (
          <div
            key={block.id}
            onClick={() => handleBlockClick(block.link)}
            className="card hover:shadow-glow-sm transition-all duration-300 cursor-pointer group relative overflow-hidden"
          >
            {/* Background Gradient */}
            <div className={`absolute inset-0 bg-gradient-to-br ${block.color} opacity-5 group-hover:opacity-10 transition-opacity duration-300`}></div>
            
            <div className="relative z-10">
              {/* Icon */}
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                {block.icon}
              </div>

              {/* Title */}
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-bearplus-green transition-colors duration-200">
                {block.title}
              </h3>

              {/* Description */}
              <p className="text-gray-300 mb-4 text-sm leading-relaxed">
                {block.description}
              </p>

              {/* Features */}
              <ul className="space-y-2 mb-6">
                {block.features.map((feature, index) => (
                  <li key={index} className="flex items-center text-sm text-gray-400">
                    <svg className="w-4 h-4 text-bearplus-green mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>

              {/* Action Button */}
              <div className="flex items-center justify-between">
                <span className="text-bearplus-green font-medium text-sm group-hover:text-white transition-colors duration-200">
                  Подробнее
                </span>
                <svg className="w-5 h-5 text-bearplus-green group-hover:text-white group-hover:translate-x-1 transition-all duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>

            {/* Hover Effect Border */}
            <div className="absolute inset-0 border border-transparent group-hover:border-bearplus-green/30 rounded-xl transition-all duration-300"></div>
          </div>
        ))}
      </div>

      {/* Call to Action */}
      <div className="text-center mt-12">
        <div className="card max-w-2xl mx-auto">
          <h3 className="text-xl font-bold text-white mb-3">Нужна индивидуальная консультация?</h3>
          <p className="text-gray-300 mb-6">
            Наши эксперты помогут подобрать оптимальное решение для ваших задач
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="btn-primary sm:w-auto">
              Связаться с экспертом
            </button>
            <button className="btn-secondary sm:w-auto">
              Заказать обратный звонок
            </button>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
        <div className="text-center">
          <div className="text-3xl font-bold text-bearplus-green mb-2">500+</div>
          <div className="text-gray-400 text-sm">Маршрутов</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-bearplus-green mb-2">50+</div>
          <div className="text-gray-400 text-sm">Портов</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-bearplus-green mb-2">24/7</div>
          <div className="text-gray-400 text-sm">Поддержка</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-bearplus-green mb-2">98%</div>
          <div className="text-gray-400 text-sm">Довольных клиентов</div>
        </div>
      </div>
    </div>
  );
};

export default TariffBlocks;