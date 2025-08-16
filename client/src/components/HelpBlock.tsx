import * as React from 'react';
import { useState } from 'react';

interface HelpBlockProps {
  className?: string;
}

const HelpBlock: React.FC<HelpBlockProps> = ({ className = '' }) => {
  const [selectedCategory, setSelectedCategory] = useState<'market' | 'information' | 'support'>('market');

  const renderMarketAnalysis = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-white mb-4">Анализ рынка</h3>
        <p className="text-gray-300 text-lg max-w-2xl mx-auto">
          Получите полную картину рынка морских перевозок с актуальными данными и прогнозами
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="card">
          <div className="text-3xl mb-4">📊</div>
          <h4 className="text-lg font-semibold text-white mb-3">Аналитика ставок</h4>
          <p className="text-gray-300 text-sm mb-4">
            Ежедневный мониторинг ставок фрахта по всем направлениям. 
            Графики изменений, сравнение с предыдущими периодами.
          </p>
          <ul className="space-y-2 text-sm text-gray-400">
            <li>• Динамика цен в реальном времени</li>
            <li>• Сравнительный анализ маршрутов</li>
            <li>• Прогнозы на ближайшие периоды</li>
          </ul>
        </div>

        <div className="card">
          <div className="text-3xl mb-4">🌍</div>
          <h4 className="text-lg font-semibold text-white mb-3">Обзор направлений</h4>
          <p className="text-gray-300 text-sm mb-4">
            Подробная информация о популярности маршрутов, 
            загруженности портов, сезонных трендах.
          </p>
          <ul className="space-y-2 text-sm text-gray-400">
            <li>• Топ маршрутов по объемам</li>
            <li>• Загруженность портов</li>
            <li>• Сезонные колебания спроса</li>
          </ul>
        </div>

        <div className="card">
          <div className="text-3xl mb-4">⚓</div>
          <h4 className="text-lg font-semibold text-white mb-3">Состояние портов</h4>
          <p className="text-gray-300 text-sm mb-4">
            Мониторинг работы портов, очереди судов, 
            изменения в портовых сборах и регулировании.
          </p>
          <ul className="space-y-2 text-sm text-gray-400">
            <li>• Время обработки в портах</li>
            <li>• Очереди и задержки</li>
            <li>• Изменения тарифов портов</li>
          </ul>
        </div>

        <div className="card">
          <div className="text-3xl mb-4">📈</div>
          <h4 className="text-lg font-semibold text-white mb-3">Рыночные тренды</h4>
          <p className="text-gray-300 text-sm mb-4">
            Анализ глобальных трендов в логистике, 
            влияние экономических и политических факторов.
          </p>
          <ul className="space-y-2 text-sm text-gray-400">
            <li>• Влияние мировых событий</li>
            <li>• Новые торговые соглашения</li>
            <li>• Технологические инновации</li>
          </ul>
        </div>

        <div className="card">
          <div className="text-3xl mb-4">💱</div>
          <h4 className="text-lg font-semibold text-white mb-3">Валютные курсы</h4>
          <p className="text-gray-300 text-sm mb-4">
            Актуальные курсы валют, влияние на стоимость перевозок, 
            рекомендации по хеджированию рисков.
          </p>
          <ul className="space-y-2 text-sm text-gray-400">
            <li>• Курсы основных валют</li>
            <li>• Прогнозы изменений</li>
            <li>• Влияние на логистику</li>
          </ul>
        </div>

        <div className="card">
          <div className="text-3xl mb-4">🔮</div>
          <h4 className="text-lg font-semibold text-white mb-3">Прогнозирование</h4>
          <p className="text-gray-300 text-sm mb-4">
            AI-алгоритмы для прогнозирования ставок, 
            оптимального времени отправки грузов.
          </p>
          <ul className="space-y-2 text-sm text-gray-400">
            <li>• Машинное обучение</li>
            <li>• Предиктивная аналитика</li>
            <li>• Рекомендации по срокам</li>
          </ul>
        </div>
      </div>

      <div className="text-center mt-8">
        <button className="btn-primary">
          Получить детальный анализ рынка
        </button>
      </div>
    </div>
  );

  const renderInformation = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-white mb-4">Информация</h3>
        <p className="text-gray-300 text-lg max-w-2xl mx-auto">
          Исчерпывающая база знаний о международной логистике и морских перевозках
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="card">
            <h4 className="text-lg font-semibold text-bearplus-green mb-3">📚 База знаний</h4>
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-start">
                <span className="text-bearplus-green mr-3">•</span>
                <div>
                  <span className="font-medium">Инкотермс 2020</span>
                  <p className="text-sm text-gray-400">Полное руководство по международным торговым терминам</p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-bearplus-green mr-3">•</span>
                <div>
                  <span className="font-medium">Таможенное оформление</span>
                  <p className="text-sm text-gray-400">Процедуры, документы, коды ТН ВЭД</p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-bearplus-green mr-3">•</span>
                <div>
                  <span className="font-medium">Страхование грузов</span>
                  <p className="text-sm text-gray-400">Виды страхования, условия, расчет премий</p>
                </div>
              </li>
            </ul>
          </div>

          <div className="card">
            <h4 className="text-lg font-semibold text-bearplus-green mb-3">🌐 Справочники</h4>
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-start">
                <span className="text-bearplus-green mr-3">•</span>
                <div>
                  <span className="font-medium">Коды портов</span>
                  <p className="text-sm text-gray-400">UN/LOCODE, названия, координаты</p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-bearplus-green mr-3">•</span>
                <div>
                  <span className="font-medium">Судоходные линии</span>
                  <p className="text-sm text-gray-400">Контакты, маршруты, расписания</p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-bearplus-green mr-3">•</span>
                <div>
                  <span className="font-medium">Валютные курсы</span>
                  <p className="text-sm text-gray-400">ЦБ РФ, исторические данные</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="space-y-6">
          <div className="card">
            <h4 className="text-lg font-semibold text-bearplus-green mb-3">⚖️ Правовая информация</h4>
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-start">
                <span className="text-bearplus-green mr-3">•</span>
                <div>
                  <span className="font-medium">Международные конвенции</span>
                  <p className="text-sm text-gray-400">Гаагские правила, Гамбургские правила</p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-bearplus-green mr-3">•</span>
                <div>
                  <span className="font-medium">Национальное законодательство</span>
                  <p className="text-sm text-gray-400">КТМ РФ, таможенное право</p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-bearplus-green mr-3">•</span>
                <div>
                  <span className="font-medium">Санкционные списки</span>
                  <p className="text-sm text-gray-400">Актуальные ограничения и запреты</p>
                </div>
              </li>
            </ul>
          </div>

          <div className="card">
            <h4 className="text-lg font-semibold text-bearplus-green mb-3">🎓 Обучение</h4>
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-start">
                <span className="text-bearplus-green mr-3">•</span>
                <div>
                  <span className="font-medium">Вебинары</span>
                  <p className="text-sm text-gray-400">Еженедельные онлайн-семинары</p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-bearplus-green mr-3">•</span>
                <div>
                  <span className="font-medium">Курсы повышения квалификации</span>
                  <p className="text-sm text-gray-400">Сертифицированные программы</p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-bearplus-green mr-3">•</span>
                <div>
                  <span className="font-medium">Библиотека материалов</span>
                  <p className="text-sm text-gray-400">Статьи, презентации, кейсы</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4 mt-8">
        <button className="btn-secondary">
          Скачать справочники
        </button>
        <button className="btn-secondary">
          Записаться на вебинар
        </button>
        <button className="btn-secondary">
          Получить консультацию
        </button>
      </div>
    </div>
  );

  const renderSupport = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-white mb-4">Помощь</h3>
        <p className="text-gray-300 text-lg max-w-2xl mx-auto">
          Профессиональная поддержка на каждом этапе вашего логистического путешествия
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="card text-center">
          <div className="text-4xl mb-4">🆘</div>
          <h4 className="text-lg font-semibold text-white mb-3">Круглосуточная поддержка</h4>
          <p className="text-gray-300 text-sm mb-4">
            Наша команда готова помочь вам 24/7. 
            Срочные вопросы решаем в течение 15 минут.
          </p>
          <div className="space-y-2 text-sm text-gray-400">
            <div>📞 +7 (930) 201-19-93</div>
            <div>📧 support@bearplus.ru</div>
            <div>💬 Онлайн-чат</div>
          </div>
        </div>

        <div className="card text-center">
          <div className="text-4xl mb-4">🎯</div>
          <h4 className="text-lg font-semibold text-white mb-3">Персональный менеджер</h4>
          <p className="text-gray-300 text-sm mb-4">
            Для крупных клиентов выделяется персональный менеджер, 
            который знает специфику вашего бизнеса.
          </p>
          <div className="space-y-2 text-sm text-gray-400">
            <div>Индивидуальный подход</div>
            <div>Прямая линия связи</div>
            <div>Приоритетная обработка</div>
          </div>
        </div>

        <div className="card text-center">
          <div className="text-4xl mb-4">🔧</div>
          <h4 className="text-lg font-semibold text-white mb-3">Техническая поддержка</h4>
          <p className="text-gray-300 text-sm mb-4">
            Помощь в работе с платформой, интеграции API, 
            настройке автоматизации процессов.
          </p>
          <div className="space-y-2 text-sm text-gray-400">
            <div>Помощь с API</div>
            <div>Обучение функциям</div>
            <div>Решение технических проблем</div>
          </div>
        </div>

        <div className="card text-center">
          <div className="text-4xl mb-4">📋</div>
          <h4 className="text-lg font-semibold text-white mb-3">Консультации</h4>
          <p className="text-gray-300 text-sm mb-4">
            Экспертные консультации по оптимизации логистики, 
            выбору маршрутов, снижению затрат.
          </p>
          <div className="space-y-2 text-sm text-gray-400">
            <div>Анализ логистических цепей</div>
            <div>Оптимизация затрат</div>
            <div>Стратегическое планирование</div>
          </div>
        </div>

        <div className="card text-center">
          <div className="text-4xl mb-4">📚</div>
          <h4 className="text-lg font-semibold text-white mb-3">Обучение и тренинги</h4>
          <p className="text-gray-300 text-sm mb-4">
            Корпоративные тренинги для ваших сотрудников, 
            обучение работе с международной логистикой.
          </p>
          <div className="space-y-2 text-sm text-gray-400">
            <div>Корпоративные программы</div>
            <div>Сертификация специалистов</div>
            <div>Практические семинары</div>
          </div>
        </div>

        <div className="card text-center">
          <div className="text-4xl mb-4">🚨</div>
          <h4 className="text-lg font-semibold text-white mb-3">Экстренная помощь</h4>
          <p className="text-gray-300 text-sm mb-4">
            При форс-мажорных обстоятельствах наша команда 
            оперативно найдет альтернативные решения.
          </p>
          <div className="space-y-2 text-sm text-gray-400">
            <div>Антикризисное управление</div>
            <div>Поиск альтернатив</div>
            <div>Минимизация потерь</div>
          </div>
        </div>
      </div>

      <div className="card bg-gradient-to-r from-bearplus-green/10 to-bearplus-green/5 border-bearplus-green/30">
        <div className="text-center">
          <h4 className="text-xl font-bold text-white mb-3">Свяжитесь с нами прямо сейчас</h4>
          <p className="text-gray-300 mb-6">
            Наши специалисты готовы ответить на любые вопросы и помочь решить ваши задачи
          </p>
          <div className="grid md:grid-cols-3 gap-4">
            <button className="btn-primary">
              Написать в чат
            </button>
            <button className="btn-secondary">
              Заказать звонок
            </button>
            <button className="btn-secondary">
              Отправить email
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className={`${className}`}>
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-4">Чем Bearplus помогает</h2>
        <p className="text-gray-300 text-lg max-w-2xl mx-auto">
          Комплексная поддержка вашего бизнеса на всех этапах логистических операций
        </p>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        <button
          onClick={() => setSelectedCategory('market')}
          className={`flex items-center px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
            selectedCategory === 'market'
              ? 'bg-bearplus-green text-black'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          <span className="mr-2">📊</span>
          Анализ рынка
        </button>
        <button
          onClick={() => setSelectedCategory('information')}
          className={`flex items-center px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
            selectedCategory === 'information'
              ? 'bg-bearplus-green text-black'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          <span className="mr-2">📚</span>
          Информация
        </button>
        <button
          onClick={() => setSelectedCategory('support')}
          className={`flex items-center px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
            selectedCategory === 'support'
              ? 'bg-bearplus-green text-black'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          <span className="mr-2">🆘</span>
          Помощь
        </button>
      </div>

      {/* Content */}
      <div className="min-h-[400px]">
        {selectedCategory === 'market' && renderMarketAnalysis()}
        {selectedCategory === 'information' && renderInformation()}
        {selectedCategory === 'support' && renderSupport()}
      </div>
    </div>
  );
};

export default HelpBlock;