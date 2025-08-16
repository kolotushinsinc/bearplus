import * as React from 'react';
import { useState } from 'react';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

interface CompanyInfoBlockProps {
  className?: string;
}

const CompanyInfoBlock: React.FC<CompanyInfoBlockProps> = ({ className = '' }) => {
  const [activeTab, setActiveTab] = useState<'about' | 'superpower' | 'instruction' | 'faq'>('about');
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);

  const faqItems: FAQItem[] = [
    {
      id: '1',
      question: 'Какие виды грузов вы перевозите?',
      answer: 'Мы осуществляем перевозку всех видов грузов: генеральных, контейнерных, опасных, негабаритных, скоропортящихся. Имеем все необходимые лицензии и сертификаты для работы с опасными грузами всех классов.'
    },
    {
      id: '2',
      question: 'Как рассчитывается стоимость доставки?',
      answer: 'Стоимость рассчитывается по формуле: ((Ставка фрахта + маржа за ставку фрахта) × конвертация валюты 1.05 + Аренда КТК + маржа на КТК + авто доставка + маржа за авто доставку + ЖД доставка + маржа за ЖД доставку). Все расчеты производятся автоматически с учетом актуальных курсов валют.'
    },
    {
      id: '3',
      question: 'Какие документы нужны для оформления перевозки?',
      answer: 'Базовый пакет включает: инвойс, упаковочный лист, договор купли-продажи. Для опасных грузов дополнительно требуются MSDS, сертификат опасного груза, разрешения. Наши специалисты помогут подготовить полный комплект документов.'
    },
    {
      id: '4',
      question: 'Как отследить груз в пути?',
      answer: 'В личном кабинете доступна функция отслеживания груза в реальном времени. Вы получите уведомления о всех ключевых событиях: отправка, прохождение портов, прибытие. Также доступна интерактивная карта с текущим местоположением судна.'
    },
    {
      id: '5',
      question: 'Какие гарантии предоставляете?',
      answer: 'Мы предоставляем страхование грузов, гарантии соблюдения сроков доставки, возмещение ущерба в случае порчи или утери груза. Все условия прописаны в договоре. Наша ответственность подкреплена страховыми полисами.'
    },
    {
      id: '6',
      question: 'Работаете ли вы с мелкими отправками?',
      answer: 'Да, мы работаем как с FCL (полные контейнеры), так и с LCL (сборными грузами). Минимальный объем для морских перевозок - от 1 куб.м. Для автомобильных и железнодорожных перевозок минимальные ограничения отсутствуют.'
    }
  ];

  const tabs = [
    { id: 'about', label: 'Кто мы', icon: '🏢' },
    { id: 'superpower', label: 'Наша супер сила', icon: '⚡' },
    { id: 'instruction', label: 'Видео инструктаж', icon: '🎥' },
    { id: 'faq', label: 'FAQ', icon: '❓' }
  ];

  const toggleFAQ = (id: string) => {
    setExpandedFAQ(expandedFAQ === id ? null : id);
  };

  const renderAboutContent = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-white mb-4">О компании Bearplus</h3>
        <p className="text-gray-300 text-lg leading-relaxed max-w-3xl mx-auto">
          Мы - современная логистическая компания, специализирующаяся на международных перевозках. 
          Наша миссия - обеспечить надежную, быструю и экономически выгодную доставку грузов по всему миру.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <h4 className="text-xl font-semibold text-bearplus-green">Наши принципы</h4>
          <ul className="space-y-3">
            <li className="flex items-start">
              <span className="text-bearplus-green mr-3">•</span>
              <span className="text-gray-300">Прозрачность в ценообразовании и сроках</span>
            </li>
            <li className="flex items-start">
              <span className="text-bearplus-green mr-3">•</span>
              <span className="text-gray-300">Индивидуальный подход к каждому клиенту</span>
            </li>
            <li className="flex items-start">
              <span className="text-bearplus-green mr-3">•</span>
              <span className="text-gray-300">Использование современных технологий</span>
            </li>
            <li className="flex items-start">
              <span className="text-bearplus-green mr-3">•</span>
              <span className="text-gray-300">Постоянное развитие и совершенствование</span>
            </li>
          </ul>
        </div>

        <div className="space-y-4">
          <h4 className="text-xl font-semibold text-bearplus-green">Наша география</h4>
          <p className="text-gray-300">
            Работаем по направлениям: Россия, Китай, Европа, Юго-Восточная Азия, 
            Северная и Южная Америка. Партнерская сеть в 50+ портах мира.
          </p>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="text-center p-4 bg-bearplus-card-dark rounded-lg">
              <div className="text-2xl font-bold text-bearplus-green">50+</div>
              <div className="text-sm text-gray-400">Портов</div>
            </div>
            <div className="text-center p-4 bg-bearplus-card-dark rounded-lg">
              <div className="text-2xl font-bold text-bearplus-green">500+</div>
              <div className="text-sm text-gray-400">Маршрутов</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSuperpowerContent = () => (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-white mb-4">В чем наша супер сила</h3>
        <p className="text-gray-300 text-lg max-w-2xl mx-auto">
          Уникальные преимущества, которые делают нас лидерами в области логистики
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="card">
          <div className="text-3xl mb-4">🚀</div>
          <h4 className="text-lg font-semibold text-white mb-2">Скорость</h4>
          <p className="text-gray-300 text-sm">
            Мгновенный расчет стоимости, быстрое оформление документов, 
            экспресс-доставка критически важных грузов.
          </p>
        </div>

        <div className="card">
          <div className="text-3xl mb-4">💡</div>
          <h4 className="text-lg font-semibold text-white mb-2">Инновации</h4>
          <p className="text-gray-300 text-sm">
            Собственная IT-платформа, автоматизация процессов, 
            цифровой документооборот, AI-оптимизация маршрутов.
          </p>
        </div>

        <div className="card">
          <div className="text-3xl mb-4">🔒</div>
          <h4 className="text-lg font-semibold text-white mb-2">Надежность</h4>
          <p className="text-gray-300 text-sm">
            100% страхование грузов, резервные маршруты, 
            проверенные партнеры, круглосуточная поддержка.
          </p>
        </div>

        <div className="card">
          <div className="text-3xl mb-4">💰</div>
          <h4 className="text-lg font-semibold text-white mb-2">Экономия</h4>
          <p className="text-gray-300 text-sm">
            Прямые договоры с линиями, оптимизация маршрутов, 
            система скидок для постоянных клиентов.
          </p>
        </div>

        <div className="card">
          <div className="text-3xl mb-4">🌐</div>
          <h4 className="text-lg font-semibold text-white mb-2">Глобальность</h4>
          <p className="text-gray-300 text-sm">
            Международная сеть партнеров, мультимодальные перевозки, 
            работа в любой точке мира 24/7.
          </p>
        </div>

        <div className="card">
          <div className="text-3xl mb-4">👥</div>
          <h4 className="text-lg font-semibold text-white mb-2">Экспертность</h4>
          <p className="text-gray-300 text-sm">
            Команда профессионалов с опытом 10+ лет, 
            знание специфики различных отраслей.
          </p>
        </div>
      </div>
    </div>
  );

  const renderInstructionContent = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-white mb-4">Видео инструктаж</h3>
        <p className="text-gray-300 text-lg max-w-2xl mx-auto">
          Обучающие видео для эффективной работы с платформой
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="card cursor-pointer hover:shadow-glow-sm transition-all duration-300">
          <div className="aspect-video bg-gray-700 rounded-lg mb-4 relative overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <div className="w-16 h-16 bg-bearplus-green rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-black ml-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            <div className="absolute bottom-2 right-2 bg-black/80 text-white px-2 py-1 rounded text-xs">
              15:30
            </div>
          </div>
          <h4 className="text-lg font-semibold text-white mb-2">Начало работы с платформой</h4>
          <p className="text-gray-300 text-sm">
            Пошаговое руководство по регистрации, настройке профиля и первому заказу
          </p>
        </div>

        <div className="card cursor-pointer hover:shadow-glow-sm transition-all duration-300">
          <div className="aspect-video bg-gray-700 rounded-lg mb-4 relative overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <div className="w-16 h-16 bg-bearplus-green rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-black ml-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            <div className="absolute bottom-2 right-2 bg-black/80 text-white px-2 py-1 rounded text-xs">
              12:45
            </div>
          </div>
          <h4 className="text-lg font-semibold text-white mb-2">Калькулятор доставки</h4>
          <p className="text-gray-300 text-sm">
            Как правильно заполнить данные для точного расчета стоимости
          </p>
        </div>

        <div className="card cursor-pointer hover:shadow-glow-sm transition-all duration-300">
          <div className="aspect-video bg-gray-700 rounded-lg mb-4 relative overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <div className="w-16 h-16 bg-bearplus-green rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-black ml-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            <div className="absolute bottom-2 right-2 bg-black/80 text-white px-2 py-1 rounded text-xs">
              8:20
            </div>
          </div>
          <h4 className="text-lg font-semibold text-white mb-2">Отслеживание грузов</h4>
          <p className="text-gray-300 text-sm">
            Функции мониторинга и получения уведомлений о статусе груза
          </p>
        </div>

        <div className="card cursor-pointer hover:shadow-glow-sm transition-all duration-300">
          <div className="aspect-video bg-gray-700 rounded-lg mb-4 relative overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <div className="w-16 h-16 bg-bearplus-green rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-black ml-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            <div className="absolute bottom-2 right-2 bg-black/80 text-white px-2 py-1 rounded text-xs">
              6:15
            </div>
          </div>
          <h4 className="text-lg font-semibold text-white mb-2">Работа с документами</h4>
          <p className="text-gray-300 text-sm">
            Загрузка, управление и электронный документооборот
          </p>
        </div>
      </div>
    </div>
  );

  const renderFAQContent = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-white mb-4">Часто задаваемые вопросы</h3>
        <p className="text-gray-300 text-lg max-w-2xl mx-auto">
          Ответы на самые популярные вопросы о наших услугах
        </p>
      </div>

      <div className="space-y-4">
        {faqItems.map((item) => (
          <div key={item.id} className="card">
            <button
              onClick={() => toggleFAQ(item.id)}
              className="w-full text-left flex justify-between items-center"
            >
              <h4 className="text-lg font-medium text-white pr-4">{item.question}</h4>
              <svg
                className={`w-6 h-6 text-bearplus-green transform transition-transform duration-200 flex-shrink-0 ${
                  expandedFAQ === item.id ? 'rotate-180' : ''
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {expandedFAQ === item.id && (
              <div className="mt-4 pt-4 border-t border-gray-700">
                <p className="text-gray-300 leading-relaxed">{item.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="text-center mt-8">
        <p className="text-gray-400 mb-4">Не нашли ответ на свой вопрос?</p>
        <button className="btn-primary">
          Задать вопрос специалисту
        </button>
      </div>
    </div>
  );

  return (
    <div className={`${className}`}>
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-4">О компании</h2>
        <p className="text-gray-300 text-lg max-w-2xl mx-auto">
          Узнайте больше о Bearplus, наших возможностях и подходе к работе
        </p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              activeTab === tab.id
                ? 'bg-bearplus-green text-black'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            <span className="mr-2">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="min-h-[400px]">
        {activeTab === 'about' && renderAboutContent()}
        {activeTab === 'superpower' && renderSuperpowerContent()}
        {activeTab === 'instruction' && renderInstructionContent()}
        {activeTab === 'faq' && renderFAQContent()}
      </div>
    </div>
  );
};

export default CompanyInfoBlock;