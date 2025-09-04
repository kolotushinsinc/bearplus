import * as React from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'shipping' | 'customs' | 'payment' | 'tracking' | 'general';
  helpful: number;
}

interface SupportChannel {
  id: string;
  name: string;
  description: string;
  icon: string;
  available: boolean;
  responseTime: string;
  contact: string;
  workingHours?: string;
}

interface HelpResource {
  id: string;
  title: string;
  description: string;
  type: 'guide' | 'video' | 'template' | 'calculator';
  icon: string;
  url: string;
  downloadCount?: number;
}

const HelpBlock: React.FC = () => {
  const [selectedFAQCategory, setSelectedFAQCategory] = useState<string>('general');
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const faqCategories = [
    { id: 'general', name: 'Общие вопросы', icon: '❓' },
    { id: 'shipping', name: 'Доставка', icon: '🚚' },
    { id: 'customs', name: 'Таможня', icon: '📋' },
    { id: 'payment', name: 'Оплата', icon: '💳' },
    { id: 'tracking', name: 'Отслеживание', icon: '📍' }
  ];

  const faqItems: FAQItem[] = [
    {
      id: '1',
      question: 'Как оформить заказ на доставку?',
      answer: 'Для оформления заказа зарегистрируйтесь на нашем сайте, войдите в личный кабинет и заполните форму заказа, указав детали груза и маршрут доставки. Наш менеджер свяжется с вами для подтверждения.',
      category: 'general',
      helpful: 145
    },
    {
      id: '2',
      question: 'Какие документы нужны для международной доставки?',
      answer: 'Основные документы: коммерческий инвойс, упаковочный лист, договор купли-продажи. Дополнительно могут потребоваться сертификаты, разрешения в зависимости от типа товара.',
      category: 'customs',
      helpful: 132
    },
    {
      id: '3',
      question: 'Как отследить мой груз?',
      answer: 'В личном кабинете перейдите в раздел "Мои заказы" и выберите нужную отправку. Вы увидите актуальный статус и местоположение груза в реальном времени.',
      category: 'tracking',
      helpful: 167
    },
    {
      id: '4',
      question: 'Какие способы оплаты доступны?',
      answer: 'Мы принимаем оплату по безналичному расчету для юридических лиц, банковские карты для физических лиц, а также работаем с рассрочкой платежа.',
      category: 'payment',
      helpful: 89
    },
    {
      id: '5',
      question: 'Сколько времени занимает доставка из Китая?',
      answer: 'Морская доставка: 25-35 дней, авиадоставка: 5-7 дней, железнодорожная: 15-20 дней. Точные сроки зависят от маршрута и типа груза.',
      category: 'shipping',
      helpful: 201
    },
    {
      id: '6',
      question: 'Что делать, если груз поврежден?',
      answer: 'Немедленно зафиксируйте повреждения актом, сфотографируйте груз и упаковку, обратитесь к нашему менеджеру. Если груз застрахован, поможем оформить страховое возмещение.',
      category: 'shipping',
      helpful: 76
    },
    {
      id: '7',
      question: 'Можно ли изменить адрес доставки?',
      answer: 'Да, адрес можно изменить до момента отправки груза. После отправки изменения возможны за дополнительную плату и согласование с перевозчиком.',
      category: 'general',
      helpful: 54
    },
    {
      id: '8',
      question: 'Как рассчитывается стоимость доставки?',
      answer: 'Стоимость зависит от веса, объема груза, маршрута, типа перевозки и дополнительных услуг. Используйте наш калькулятор для предварительного расчета.',
      category: 'general',
      helpful: 189
    }
  ];

  const supportChannels: SupportChannel[] = [
    {
      id: 'phone',
      name: 'Телефон',
      description: 'Прямая связь с менеджером',
      icon: '📞',
      available: true,
      responseTime: 'Моментально',
      contact: '+7 (495) 123-45-67',
      workingHours: 'Пн-Пт 9:00-18:00 МСК'
    },
    {
      id: 'email',
      name: 'Email поддержка',
      description: 'Подробные консультации',
      icon: '✉️',
      available: true,
      responseTime: 'До 2 часов',
      contact: 'support@bearplus.ru',
      workingHours: '24/7'
    },
    {
      id: 'chat',
      name: 'Онлайн чат',
      description: 'Быстрые ответы на вопросы',
      icon: '💬',
      available: true,
      responseTime: '1-3 минуты',
      contact: 'Чат на сайте',
      workingHours: 'Пн-Пт 9:00-21:00 МСК'
    },
    {
      id: 'whatsapp',
      name: 'WhatsApp',
      description: 'Удобное общение в мессенджере',
      icon: '📱',
      available: true,
      responseTime: 'До 30 минут',
      contact: '+7 (999) 123-45-67',
      workingHours: 'Пн-Пт 9:00-18:00 МСК'
    }
  ];

  const helpResources: HelpResource[] = [
    {
      id: '1',
      title: 'Руководство по импорту',
      description: 'Подробная инструкция по организации импортных поставок',
      type: 'guide',
      icon: '📖',
      url: '/downloads/import-guide.pdf',
      downloadCount: 1240
    },
    {
      id: '2',
      title: 'Калькулятор стоимости',
      description: 'Рассчитайте предварительную стоимость доставки',
      type: 'calculator',
      icon: '🧮',
      url: '/calculator'
    },
    {
      id: '3',
      title: 'Шаблоны документов',
      description: 'Готовые формы инвойсов и упаковочных листов',
      type: 'template',
      icon: '📄',
      url: '/downloads/document-templates.zip',
      downloadCount: 890
    },
    {
      id: '4',
      title: 'Видео-инструкции',
      description: 'Обучающие видео по работе с платформой',
      type: 'video',
      icon: '🎥',
      url: '/help/videos'
    },
    {
      id: '5',
      title: 'ТН ВЭД коды',
      description: 'Справочник кодов товарной номенклатуры',
      type: 'guide',
      icon: '📋',
      url: '/downloads/tnved-codes.pdf',
      downloadCount: 567
    },
    {
      id: '6',
      title: 'Упаковочные требования',
      description: 'Правила упаковки различных типов грузов',
      type: 'guide',
      icon: '📦',
      url: '/downloads/packaging-guide.pdf',
      downloadCount: 423
    }
  ];

  const filteredFAQ = faqItems.filter(item => {
    const matchesCategory = selectedFAQCategory === 'all' || item.category === selectedFAQCategory;
    const matchesSearch = searchQuery === '' || 
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleFAQ = (id: string) => {
    setExpandedFAQ(expandedFAQ === id ? null : id);
  };

  const getCategoryName = (categoryId: string) => {
    const category = faqCategories.find(cat => cat.id === categoryId);
    return category ? category.name : categoryId;
  };

  const getResourceTypeIcon = (type: string) => {
    switch (type) {
      case 'guide': return '📖';
      case 'video': return '🎥';
      case 'template': return '📄';
      case 'calculator': return '🧮';
      default: return '📄';
    }
  };

  return (
    <section className="bg-bearplus-bg py-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">
            Центр поддержки
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Найдите ответы на ваши вопросы или свяжитесь с нашей службой поддержки
          </p>
        </div>

        {/* Quick Search */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <input
              type="text"
              placeholder="Поиск по вопросам и ответам..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-6 py-4 bg-bearplus-card text-white rounded-xl border border-gray-600 focus:border-bearplus-green focus:outline-none pl-12"
            />
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
              🔍
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* FAQ Section */}
          <div className="lg:col-span-2">
            <h3 className="text-2xl font-bold text-white mb-6">Частые вопросы</h3>
            
            {/* FAQ Categories */}
            <div className="flex flex-wrap gap-2 mb-6">
              <button
                onClick={() => setSelectedFAQCategory('all')}
                className={`px-4 py-2 rounded-full text-sm transition-colors ${
                  selectedFAQCategory === 'all'
                    ? 'bg-bearplus-green text-black font-semibold'
                    : 'bg-bearplus-card text-gray-300 hover:bg-bearplus-card-hover'
                }`}
              >
                Все
              </button>
              {faqCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedFAQCategory(category.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm transition-colors ${
                    selectedFAQCategory === category.id
                      ? 'bg-bearplus-green text-black font-semibold'
                      : 'bg-bearplus-card text-gray-300 hover:bg-bearplus-card-hover'
                  }`}
                >
                  <span>{category.icon}</span>
                  <span>{category.name}</span>
                </button>
              ))}
            </div>

            {/* FAQ Items */}
            <div className="space-y-4">
              {filteredFAQ.map((item) => (
                <div key={item.id} className="bg-bearplus-card rounded-xl overflow-hidden">
                  <button
                    onClick={() => toggleFAQ(item.id)}
                    className="w-full p-6 text-left hover:bg-bearplus-card-hover transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="text-white font-semibold mb-1">{item.question}</h4>
                        <div className="flex items-center space-x-4 text-sm text-gray-400">
                          <span>{getCategoryName(item.category)}</span>
                          <span>👍 {item.helpful}</span>
                        </div>
                      </div>
                      <div className={`ml-4 transform transition-transform ${
                        expandedFAQ === item.id ? 'rotate-180' : ''
                      }`}>
                        ▼
                      </div>
                    </div>
                  </button>
                  
                  {expandedFAQ === item.id && (
                    <div className="px-6 pb-6">
                      <div className="bg-bearplus-card-dark rounded-lg p-4">
                        <p className="text-gray-300 leading-relaxed">{item.answer}</p>
                        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-600">
                          <span className="text-sm text-gray-400">Был ли ответ полезен?</span>
                          <div className="flex space-x-2">
                            <button className="text-green-400 hover:text-green-300 text-sm">
                              👍 Да
                            </button>
                            <button className="text-red-400 hover:text-red-300 text-sm">
                              👎 Нет
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {filteredFAQ.length === 0 && (
              <div className="text-center py-8">
                <div className="text-4xl mb-4">🔍</div>
                <h4 className="text-white font-semibold mb-2">Ничего не найдено</h4>
                <p className="text-gray-400">Попробуйте изменить параметры поиска или обратитесь в поддержку</p>
              </div>
            )}
          </div>

          {/* Support Channels */}
          <div>
            <h3 className="text-2xl font-bold text-white mb-6">Связаться с нами</h3>
            <div className="space-y-4 mb-8">
              {supportChannels.map((channel) => (
                <div
                  key={channel.id}
                  className={`bg-bearplus-card rounded-xl p-4 transition-colors ${
                    channel.available ? 'hover:bg-bearplus-card-hover' : 'opacity-60'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="text-2xl">{channel.icon}</div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="text-white font-semibold">{channel.name}</h4>
                        {channel.available && (
                          <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                        )}
                      </div>
                      <p className="text-gray-400 text-sm mb-2">{channel.description}</p>
                      <div className="text-bearplus-green font-medium text-sm">{channel.contact}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        <div>Ответ: {channel.responseTime}</div>
                        {channel.workingHours && <div>{channel.workingHours}</div>}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Help Resources */}
            <h3 className="text-xl font-bold text-white mb-4">Полезные ресурсы</h3>
            <div className="space-y-3">
              {helpResources.map((resource) => (
                <Link
                  key={resource.id}
                  to={resource.url}
                  className="block bg-bearplus-card rounded-lg p-4 hover:bg-bearplus-card-hover transition-colors"
                >
                  <div className="flex items-start space-x-3">
                    <div className="text-xl">{resource.icon}</div>
                    <div className="flex-1">
                      <h4 className="text-white font-medium text-sm mb-1">{resource.title}</h4>
                      <p className="text-gray-400 text-xs mb-2">{resource.description}</p>
                      {resource.downloadCount && (
                        <div className="text-xs text-gray-500">
                          ⬇️ {resource.downloadCount} скачиваний
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Still Need Help CTA */}
        <div className="mt-16 text-center">
          <div className="bg-bearplus-card rounded-xl p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-white mb-4">
              Не нашли ответ на свой вопрос?
            </h3>
            <p className="text-gray-400 mb-6">
              Наши эксперты готовы помочь вам с любыми вопросами по логистике и доставке
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/contact"
                className="px-8 py-3 bg-bearplus-green text-black font-semibold rounded-lg hover:bg-bearplus-green/90 transition-colors"
              >
                Связаться с поддержкой
              </Link>
              <button
                onClick={() => {
                  // Open chat widget or modal
                  console.log('Opening chat...');
                }}
                className="px-8 py-3 border border-bearplus-green text-bearplus-green rounded-lg hover:bg-bearplus-green hover:text-black transition-colors"
              >
                Открыть чат
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HelpBlock;