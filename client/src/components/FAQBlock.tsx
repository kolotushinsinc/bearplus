import * as React from 'react';
import { useState } from 'react';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

interface FAQBlockProps {
  className?: string;
}

const FAQBlock: React.FC<FAQBlockProps> = ({ className = '' }) => {
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);

  const faqItems: FAQItem[] = [
    {
      id: '1',
      question: 'Как быстро рассчитывается стоимость доставки?',
      answer: 'Наша система мгновенно рассчитывает стоимость доставки на основе актуальных данных о тарифах, маршрутах и текущей ситуации на рынке. Расчет занимает менее 5 секунд и включает все возможные дополнительные расходы.'
    },
    {
      id: '2',
      question: 'Какие документы необходимы для международной перевозки?',
      answer: 'Базовый пакет включает коммерческий инвойс, упаковочный лист, договор купли-продажи и сертификат происхождения. Для специальных грузов могут потребоваться дополнительные документы: MSDS для опасных грузов, фитосанитарные сертификаты для продуктов питания, ветеринарные справки и другие.'
    },
    {
      id: '3',
      question: 'Как отследить местоположение моего груза?',
      answer: 'В личном кабинете доступна интерактивная карта с отслеживанием в реальном времени. Вы получаете автоматические уведомления о всех ключевых событиях: отправка из порта, прохождение транзитных портов, прибытие в пункт назначения. Также доступна детальная информация о судне и маршруте.'
    },
    {
      id: '4',
      question: 'Какие виды страхования грузов предоставляются?',
      answer: 'Мы предлагаем полное страхование грузов по условиям "Institute Cargo Clauses A" (максимальное покрытие), частичное страхование с исключениями, а также страхование от конкретных рисков. Страховая сумма может составлять до 110% от стоимости груза. Все полисы покрывают риски во время морской, автомобильной и железнодорожной перевозки.'
    },
    {
      id: '5',
      question: 'Работаете ли вы с малыми объемами грузов?',
      answer: 'Да, мы работаем как с полными контейнерными отправками (FCL), так и со сборными грузами (LCL). Минимальный объем для морских перевозок составляет от 0.5 куб.м. Для автомобильных и железнодорожных перевозок минимальных ограничений нет. Предоставляем выгодные условия и для разовых небольших отправок.'
    }
  ];

  const toggleFAQ = (id: string) => {
    setExpandedFAQ(expandedFAQ === id ? null : id);
  };

  return (
    <div className={`${className}`}>
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-white mb-4">Часто задаваемые вопросы</h2>
      </div>

      <div className="space-y-4 max-w-4xl mx-auto">
        {faqItems.map((item) => (
          <div key={item.id} className="card">
            <button
              onClick={() => toggleFAQ(item.id)}
              className="w-full text-left flex justify-between items-center"
            >
              <h3 className="text-lg font-medium text-white pr-4">{item.question}</h3>
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
          Связаться с нашими специалистами
        </button>
      </div>
    </div>
  );
};

export default FAQBlock;