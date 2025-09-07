import * as React from 'react';
import { useState } from 'react';

interface CompanyInfoBlockProps {
  className?: string;
}

const CompanyInfoBlock: React.FC<CompanyInfoBlockProps> = ({ className = '' }) => {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const toggleSection = (id: string) => {
    setExpandedSection(expandedSection === id ? null : id);
  };

  const sections = [
    {
      id: 'help',
      title: 'Чем Bearplus помогает участникам ВЭД',
      content: [
        'Помогаем провести анализ рынка за секунду.',
        'Вы можете сравнить и выбрать лучшие условия',
        'Конкретная стоимость перевозок в заданных параметрах',
        'Аналитика сроков доставки',
        'Прозрачная доставка'
      ]
    },
    {
      id: 'info',
      title: 'За секунду предоставляет информацию:',
      content: [
        'Прямые подрядчики',
        'Заданные маршруты',
        'Сроки доставки',
        'Наличие оборудования',
        'Места на суднах',
        'Расписание выхода судов',
        'Возможные направления',
        'Полный поэтапный путь отправки'
      ]
    },
    {
      id: 'services',
      title: 'Мы помогаем:',
      content: [
        'Осуществить международную перевозку',
        'Не переплачивать за логистику',
        'Компенсировать расходы с компании, в случае порчи груза',
        'Своевременно получить бухгалтерские документы',
        'Снизить, либо вовсе избавиться от дополнительных расходов',
        'Совершить своевременные и верные действия, в случае непредвиденных обстоятельств',
        'Получать полноценное информирование',
        'Доставить товар в прогнозируемые сроки',
        'Отправить груз без задержек'
      ]
    }
  ];

  return (
    <div className={`${className}`}>
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-white mb-4">Кто мы</h2>
      </div>

      <div className="space-y-4 max-w-4xl mx-auto">
        {sections.map((section) => (
          <div key={section.id} className="card">
            <button
              onClick={() => toggleSection(section.id)}
              className="w-full text-left flex justify-between items-center"
            >
              <h3 className="text-xl font-semibold text-white pr-4">{section.title}</h3>
              <svg
                className={`w-6 h-6 text-bearplus-green transform transition-transform duration-200 flex-shrink-0 ${
                  expandedSection === section.id ? 'rotate-180' : ''
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {expandedSection === section.id && (
              <div className="mt-6 pt-6 border-t border-gray-700">
                <ul className="space-y-3">
                  {section.content.map((item, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-bearplus-green mr-3 mt-1">•</span>
                      <span className="text-gray-300 leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CompanyInfoBlock;