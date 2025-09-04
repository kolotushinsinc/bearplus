import * as React from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

interface CompanyStats {
  label: string;
  value: string;
  icon: string;
  description: string;
}

interface TeamMember {
  id: string;
  name: string;
  position: string;
  description: string;
  avatar?: string;
  experience: string;
  specialization: string[];
}

interface CompanyValues {
  title: string;
  description: string;
  icon: string;
}

const CompanyInfoBlock: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'about' | 'team' | 'values' | 'achievements'>('about');

  const stats: CompanyStats[] = [
    {
      label: 'Лет на рынке',
      value: '15+',
      icon: '📅',
      description: 'Опыт работы в логистике с 2009 года'
    },
    {
      label: 'Довольных клиентов',
      value: '2,500+',
      icon: '👥',
      description: 'Компаний доверяют нам свои грузы'
    },
    {
      label: 'Стран доставки',
      value: '50+',
      icon: '🌍',
      description: 'Покрытие по всему миру'
    },
    {
      label: 'Тонн груза в год',
      value: '100K+',
      icon: '📦',
      description: 'Объем обрабатываемых грузов'
    }
  ];

  const teamMembers: TeamMember[] = [
    {
      id: '1',
      name: 'Алексей Медведев',
      position: 'Генеральный директор',
      description: 'Основатель компании с 20-летним опытом в международной логистике. Эксперт по развитию логистических сетей.',
      avatar: '/avatars/alexey-medvedev.jpg',
      experience: '20 лет',
      specialization: ['Стратегическое планирование', 'Международная логистика', 'Развитие бизнеса']
    },
    {
      id: '2',
      name: 'Марина Волкова',
      position: 'Директор по операциям',
      description: 'Руководит операционной деятельностью и обеспечивает высокое качество обслуживания клиентов.',
      avatar: '/avatars/marina-volkova.jpg',
      experience: '15 лет',
      specialization: ['Операционное управление', 'Контроль качества', 'Клиентский сервис']
    },
    {
      id: '3',
      name: 'Дмитрий Козлов',
      position: 'Руководитель отдела ВЭД',
      description: 'Эксперт по таможенному оформлению и внешнеэкономической деятельности.',
      avatar: '/avatars/dmitry-kozlov.jpg',
      experience: '12 лет',
      specialization: ['Таможенное право', 'ВЭД', 'Международное право']
    },
    {
      id: '4',
      name: 'Екатерина Иванова',
      position: 'IT-директор',
      description: 'Отвечает за цифровизацию процессов и развитие технологических решений компании.',
      avatar: '/avatars/ekaterina-ivanova.jpg',
      experience: '10 лет',
      specialization: ['IT-архитектура', 'Цифровизация', 'Системная интеграция']
    }
  ];

  const values: CompanyValues[] = [
    {
      title: 'Надежность',
      description: 'Мы гарантируем безопасность ваших грузов и соблюдение всех сроков доставки',
      icon: '🛡️'
    },
    {
      title: 'Инновации',
      description: 'Используем передовые технологии для оптимизации логистических процессов',
      icon: '🚀'
    },
    {
      title: 'Клиентоориентированность',
      description: 'Каждый клиент получает персональное внимание и индивидуальные решения',
      icon: '🤝'
    },
    {
      title: 'Прозрачность',
      description: 'Открытое ценообразование и полная отчетность по всем операциям',
      icon: '💎'
    },
    {
      title: 'Экологичность',
      description: 'Заботимся об окружающей среде и используем эко-френдли решения',
      icon: '🌱'
    },
    {
      title: 'Профессионализм',
      description: 'Команда экспертов с многолетним опытом в международной логистике',
      icon: '🎯'
    }
  ];

  const achievements = [
    {
      year: '2009',
      title: 'Основание компании',
      description: 'Начало работы как небольшой логистической компании'
    },
    {
      year: '2012',
      title: 'Расширение географии',
      description: 'Открытие маршрутов в страны АТР и Европы'
    },
    {
      year: '2015',
      title: 'Цифровизация',
      description: 'Запуск собственной IT-платформы для управления грузами'
    },
    {
      year: '2018',
      title: 'Складские комплексы',
      description: 'Открытие современных складов в Москве и СПб'
    },
    {
      year: '2021',
      title: 'Международное признание',
      description: 'Получение сертификата ISO 9001:2015'
    },
    {
      year: '2024',
      title: 'Новые технологии',
      description: 'Внедрение AI и IoT для оптимизации маршрутов'
    }
  ];

  return (
    <section className="bg-bearplus-card py-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">
            О компании BearPlus
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Надежный партнер в сфере международной логистики с 15-летним опытом работы
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, index) => (
            <div key={index} className="text-center bg-bearplus-card-dark rounded-xl p-6 hover:bg-bearplus-card-hover transition-colors">
              <div className="text-3xl mb-3">{stat.icon}</div>
              <div className="text-3xl font-bold text-bearplus-green mb-2">{stat.value}</div>
              <div className="text-white font-semibold mb-1">{stat.label}</div>
              <div className="text-sm text-gray-400">{stat.description}</div>
            </div>
          ))}
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {[
            { id: 'about', label: 'О нас', icon: '🏢' },
            { id: 'team', label: 'Команда', icon: '👥' },
            { id: 'values', label: 'Ценности', icon: '💎' },
            { id: 'achievements', label: 'Достижения', icon: '🏆' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 px-6 py-3 rounded-full transition-all duration-300 ${
                activeTab === tab.id
                  ? 'bg-bearplus-green text-black font-semibold'
                  : 'bg-bearplus-card-dark text-gray-300 hover:bg-bearplus-card-hover'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content Sections */}
        <div className="max-w-6xl mx-auto">
          {/* About Section */}
          {activeTab === 'about' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-2xl font-bold text-white mb-6">
                  Профессиональная логистика с 2009 года
                </h3>
                <div className="space-y-4 text-gray-300">
                  <p>
                    BearPlus — это команда профессионалов, которая на протяжении более 15 лет помогает 
                    российским компаниям эффективно решать задачи международной логистики.
                  </p>
                  <p>
                    Мы специализируемся на комплексном обслуживании внешнеторговых операций: от 
                    консультаций по выбору оптимального маршрута до полного сопровождения груза 
                    от склада поставщика до получателя.
                  </p>
                  <p>
                    Наша миссия — сделать международную торговлю простой, надежной и выгодной для 
                    каждого клиента, независимо от масштаба бизнеса.
                  </p>
                </div>
                <div className="mt-8 flex flex-col sm:flex-row gap-4">
                  <Link
                    to="/about"
                    className="px-6 py-3 bg-bearplus-green text-black font-semibold rounded-lg hover:bg-bearplus-green/90 transition-colors text-center"
                  >
                    Подробнее о компании
                  </Link>
                  <Link
                    to="/contact"
                    className="px-6 py-3 border border-bearplus-green text-bearplus-green rounded-lg hover:bg-bearplus-green hover:text-black transition-colors text-center"
                  >
                    Связаться с нами
                  </Link>
                </div>
              </div>
              <div className="relative">
                <img
                  src="/images/company/office.jpg"
                  alt="Офис BearPlus"
                  className="rounded-xl w-full h-80 object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjMzc0MTUxIi8+Cjx0ZXh0IHg9IjIwMCIgeT0iMTUwIiBmaWxsPSIjNkI3Mjg5IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTgiPk9mZmljZSBQaG90bzwvdGV4dD4KPC9zdmc+';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-xl"></div>
                <div className="absolute bottom-4 left-4 text-white">
                  <h4 className="font-semibold">Головной офис</h4>
                  <p className="text-sm opacity-90">Москва, Россия</p>
                </div>
              </div>
            </div>
          )}

          {/* Team Section */}
          {activeTab === 'team' && (
            <div>
              <h3 className="text-2xl font-bold text-white text-center mb-8">
                Наша команда экспертов
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {teamMembers.map((member) => (
                  <div key={member.id} className="bg-bearplus-card-dark rounded-xl p-6 text-center hover:bg-bearplus-card-hover transition-colors">
                    <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-600 overflow-hidden">
                      {member.avatar ? (
                        <img
                          src={member.avatar}
                          alt={member.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                            (e.target as HTMLImageElement).nextElementSibling?.setAttribute('style', 'display: flex');
                          }}
                        />
                      ) : null}
                      <div className="w-full h-full flex items-center justify-center text-2xl text-white" style={{ display: member.avatar ? 'none' : 'flex' }}>
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </div>
                    </div>
                    <h4 className="text-white font-semibold mb-1">{member.name}</h4>
                    <p className="text-bearplus-green text-sm mb-2">{member.position}</p>
                    <p className="text-gray-400 text-sm mb-3">{member.description}</p>
                    <div className="text-xs text-gray-500">
                      <p className="mb-1">Опыт: {member.experience}</p>
                      <div className="flex flex-wrap gap-1 justify-center">
                        {member.specialization.map((spec, index) => (
                          <span key={index} className="bg-bearplus-card px-2 py-1 rounded text-xs">
                            {spec}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Values Section */}
          {activeTab === 'values' && (
            <div>
              <h3 className="text-2xl font-bold text-white text-center mb-8">
                Наши ценности и принципы
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {values.map((value, index) => (
                  <div key={index} className="bg-bearplus-card-dark rounded-xl p-6 text-center hover:bg-bearplus-card-hover transition-colors">
                    <div className="text-4xl mb-4">{value.icon}</div>
                    <h4 className="text-white font-semibold text-lg mb-3">{value.title}</h4>
                    <p className="text-gray-400 text-sm">{value.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Achievements Section */}
          {activeTab === 'achievements' && (
            <div>
              <h3 className="text-2xl font-bold text-white text-center mb-8">
                Наша история и достижения
              </h3>
              <div className="relative">
                {/* Timeline Line */}
                <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-bearplus-green opacity-30"></div>
                
                <div className="space-y-8">
                  {achievements.map((achievement, index) => (
                    <div key={index} className={`flex items-center ${index % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
                      <div className={`w-5/12 ${index % 2 === 0 ? 'text-right pr-8' : 'text-left pl-8'}`}>
                        <div className="bg-bearplus-card-dark rounded-xl p-6 hover:bg-bearplus-card-hover transition-colors">
                          <div className="text-bearplus-green font-bold text-lg mb-2">{achievement.year}</div>
                          <h4 className="text-white font-semibold mb-2">{achievement.title}</h4>
                          <p className="text-gray-400 text-sm">{achievement.description}</p>
                        </div>
                      </div>
                      
                      {/* Timeline Dot */}
                      <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-bearplus-green rounded-full border-4 border-bearplus-card"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <div className="bg-bearplus-card-dark rounded-xl p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-white mb-4">
              Готовы начать сотрудничество?
            </h3>
            <p className="text-gray-400 mb-6">
              Свяжитесь с нами для получения персональной консультации и индивидуального предложения
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/contact"
                className="px-8 py-3 bg-bearplus-green text-black font-semibold rounded-lg hover:bg-bearplus-green/90 transition-colors"
              >
                Связаться с нами
              </Link>
              <Link
                to="/calculator"
                className="px-8 py-3 border border-bearplus-green text-bearplus-green rounded-lg hover:bg-bearplus-green hover:text-black transition-colors"
              >
                Рассчитать стоимость
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CompanyInfoBlock;