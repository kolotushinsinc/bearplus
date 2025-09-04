import * as React from 'react';
import { useState } from 'react';

interface ContainerOffer {
  id: string;
  containerType: string;
  size: string;
  location: string;
  destinations: string[];
  condition: 'Excellent' | 'Good' | 'Fair';
  description: string;
  dailyRate: number;
  currency: 'USD' | 'EUR' | 'RUB';
  minRentalDays: number;
  dropOffLocation?: string;
  availability: number;
  depot: string;
  specifications: {
    length: string;
    width: string;
    height: string;
    maxWeight: string;
  };
  features: string[];
}

interface CalculatorData {
  pickupLocation: string;
  dropoffLocation: string;
  containerType: string;
  size: string;
  pickupDate: string;
  returnDate: string;
}

const ContainerRentalPage: React.FC = () => {
  const [calculatorData, setCalculatorData] = useState<CalculatorData>({
    pickupLocation: '',
    dropoffLocation: '',
    containerType: '',
    size: '',
    pickupDate: '',
    returnDate: ''
  });

  const [searchResults, setSearchResults] = useState<ContainerOffer[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Mock data for available containers
  const availableContainers: ContainerOffer[] = [
    {
      id: '1',
      containerType: 'Dry Container',
      size: '20ft',
      location: 'Владивосток',
      destinations: ['Москва', 'Новосибирск', 'Екатеринбург'],
      condition: 'Excellent',
      description: 'Новый контейнер в отличном состоянии, подходит для всех типов сухих грузов',
      dailyRate: 25,
      currency: 'USD',
      minRentalDays: 7,
      dropOffLocation: 'Москва',
      availability: 15,
      depot: 'Владивосток Контейнерный Терминал',
      specifications: {
        length: '6.06 м',
        width: '2.44 м',
        height: '2.59 м',
        maxWeight: '28,200 кг'
      },
      features: ['Стальные стены', 'Водонепроницаемый', 'Lockbox система']
    },
    {
      id: '2',
      containerType: 'High Cube',
      size: '40ft',
      location: 'Владивосток',
      destinations: ['Санкт-Петербург', 'Казань', 'Ростов-на-Дону'],
      condition: 'Good',
      description: 'Контейнер повышенной вместимости для крупногабаритных грузов',
      dailyRate: 45,
      currency: 'USD',
      minRentalDays: 10,
      dropOffLocation: 'Санкт-Петербург',
      availability: 8,
      depot: 'Владивосток Морской Порт',
      specifications: {
        length: '12.19 м',
        width: '2.44 м',
        height: '2.90 м',
        maxWeight: '30,480 кг'
      },
      features: ['Увеличенная высота', 'Двойные двери', 'Усиленный пол']
    },
    {
      id: '3',
      containerType: 'Reefer',
      size: '20ft',
      location: 'Новороссийск',
      destinations: ['Москва', 'Санкт-Петербург'],
      condition: 'Excellent',
      description: 'Рефрижераторный контейнер для перевозки скоропортящихся грузов',
      dailyRate: 65,
      currency: 'USD',
      minRentalDays: 5,
      dropOffLocation: 'Москва',
      availability: 5,
      depot: 'Новороссийск Холодильный Терминал',
      specifications: {
        length: '5.90 м',
        width: '2.29 м',
        height: '2.50 м',
        maxWeight: '27,700 кг'
      },
      features: ['Контроль температуры', 'Генератор', 'Мониторинг 24/7']
    }
  ];

  const containerTypes = [
    { value: 'dry', label: 'Сухой контейнер (Dry Container)' },
    { value: 'reefer', label: 'Рефрижераторный (Reefer)' },
    { value: 'tank', label: 'Танк-контейнер' },
    { value: 'open-top', label: 'Открытый сверху (Open Top)' },
    { value: 'flat-rack', label: 'Платформа (Flat Rack)' },
    { value: 'high-cube', label: 'Увеличенной высоты (High Cube)' }
  ];

  const containerSizes = [
    { value: '20ft', label: '20 футов' },
    { value: '40ft', label: '40 футов' },
    { value: '45ft', label: '45 футов' }
  ];

  const handleCalculatorChange = (field: keyof CalculatorData, value: string) => {
    setCalculatorData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSearch = async () => {
    setIsLoading(true);
    setHasSearched(true);

    try {
      // Имитация поиска
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Фильтрация результатов на основе поисковых критериев
      let results = availableContainers;
      
      if (calculatorData.pickupLocation) {
        results = results.filter(container => 
          container.location.toLowerCase().includes(calculatorData.pickupLocation.toLowerCase())
        );
      }
      
      if (calculatorData.containerType) {
        results = results.filter(container => 
          container.containerType.toLowerCase().includes(calculatorData.containerType.toLowerCase())
        );
      }
      
      if (calculatorData.size) {
        results = results.filter(container => container.size === calculatorData.size);
      }

      setSearchResults(results);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBookContainer = (containerId: string) => {
    console.log('Booking container:', containerId);
    // Логика бронирования
  };

  const formatCurrency = (amount: number, currency: string) => {
    const symbols = { USD: '$', EUR: '€', RUB: '₽' };
    return `${symbols[currency as keyof typeof symbols]}${amount}`;
  };

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'Excellent': return 'text-green-400';
      case 'Good': return 'text-yellow-400';
      case 'Fair': return 'text-orange-400';
      default: return 'text-gray-400';
    }
  };

  const getRentalDays = () => {
    if (calculatorData.pickupDate && calculatorData.returnDate) {
      const pickup = new Date(calculatorData.pickupDate);
      const returnDate = new Date(calculatorData.returnDate);
      const diffTime = returnDate.getTime() - pickup.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays > 0 ? diffDays : 0;
    }
    return 0;
  };

  return (
    <div className="py-8 space-y-8">
      {/* Page Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-4">Аренда контейнеров (КТК)</h1>
        <p className="text-gray-300 text-lg max-w-2xl mx-auto">
          Найдите и арендуйте контейнеры различных типов для ваших логистических нужд.
          Гибкие условия аренды и прозрачное ценообразование.
        </p>
      </div>

      {/* Calculator Section */}
      <section className="card">
        <h2 className="text-2xl font-bold text-white mb-6">Калькулятор аренды</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Город аренды *
            </label>
            <input
              type="text"
              value={calculatorData.pickupLocation}
              onChange={(e) => handleCalculatorChange('pickupLocation', e.target.value)}
              placeholder="Введите город получения"
              className="input-field w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Город возврата *
            </label>
            <input
              type="text"
              value={calculatorData.dropoffLocation}
              onChange={(e) => handleCalculatorChange('dropoffLocation', e.target.value)}
              placeholder="Введите город возврата"
              className="input-field w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Тип КТК *
            </label>
            <select
              value={calculatorData.containerType}
              onChange={(e) => handleCalculatorChange('containerType', e.target.value)}
              className="select-field w-full"
            >
              <option value="">Выберите тип контейнера</option>
              {containerTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Типоразмер *
            </label>
            <select
              value={calculatorData.size}
              onChange={(e) => handleCalculatorChange('size', e.target.value)}
              className="select-field w-full"
            >
              <option value="">Выберите размер</option>
              {containerSizes.map((size) => (
                <option key={size.value} value={size.value}>
                  {size.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Дата выдачи
            </label>
            <input
              type="date"
              value={calculatorData.pickupDate}
              onChange={(e) => handleCalculatorChange('pickupDate', e.target.value)}
              className="input-field w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Дата возврата
            </label>
            <input
              type="date"
              value={calculatorData.returnDate}
              onChange={(e) => handleCalculatorChange('returnDate', e.target.value)}
              className="input-field w-full"
            />
          </div>
        </div>

        {getRentalDays() > 0 && (
          <div className="mb-4 p-3 bg-bearplus-green/10 border border-bearplus-green/30 rounded-lg">
            <p className="text-bearplus-green text-sm">
              Период аренды: {getRentalDays()} дней
            </p>
          </div>
        )}

        <button
          onClick={handleSearch}
          disabled={isLoading}
          className="btn-primary w-full md:w-auto"
        >
          {isLoading ? 'Поиск...' : 'Найти варианты'}
        </button>
      </section>

      {/* Results Section */}
      {hasSearched && (
        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">
              {searchResults.length > 0 ? 'Доступные контейнеры' : 'Результаты поиска'}
            </h2>
            {searchResults.length > 0 && (
              <p className="text-gray-400">Найдено: {searchResults.length} вариантов</p>
            )}
          </div>

          {searchResults.length === 0 && !isLoading ? (
            <div className="card text-center">
              <div className="text-4xl mb-4">📦</div>
              <h3 className="text-xl font-semibold text-white mb-2">Контейнеры не найдены</h3>
              <p className="text-gray-400 mb-4">
                Попробуйте изменить параметры поиска или свяжитесь с нами для подбора индивидуального решения.
              </p>
              <button className="btn-secondary">
                Связаться с менеджером
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {searchResults.map((container) => (
                <div key={container.id} className="card">
                  <div className="grid md:grid-cols-3 gap-6">
                    {/* Container Info */}
                    <div className="md:col-span-2">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-semibold text-white mb-1">
                            {container.containerType} {container.size}
                          </h3>
                          <p className="text-bearplus-green text-sm font-medium">
                            {container.depot}
                          </p>
                        </div>
                        <span className={`px-3 py-1 rounded text-sm font-medium ${getConditionColor(container.condition)} bg-gray-800`}>
                          {container.condition}
                        </span>
                      </div>

                      <p className="text-gray-300 text-sm mb-4">{container.description}</p>

                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <h4 className="text-sm font-medium text-gray-400 mb-2">Характеристики</h4>
                          <ul className="text-sm text-gray-300 space-y-1">
                            <li>Длина: {container.specifications.length}</li>
                            <li>Ширина: {container.specifications.width}</li>
                            <li>Высота: {container.specifications.height}</li>
                            <li>Макс. вес: {container.specifications.maxWeight}</li>
                          </ul>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-400 mb-2">Особенности</h4>
                          <ul className="text-sm text-gray-300 space-y-1">
                            {container.features.map((feature, index) => (
                              <li key={index}>• {feature}</li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                        <span>📍 Локация: {container.location}</span>
                        <span>📦 Доступно: {container.availability} шт.</span>
                        {container.dropOffLocation && (
                          <span>🚚 Возврат: {container.dropOffLocation}</span>
                        )}
                      </div>
                    </div>

                    {/* Pricing and Booking */}
                    <div className="border-l border-gray-700 pl-6">
                      <div className="text-center mb-4">
                        <div className="text-3xl font-bold text-bearplus-green mb-1">
                          {formatCurrency(container.dailyRate, container.currency)}
                        </div>
                        <div className="text-gray-400 text-sm">за сутки</div>
                      </div>

                      <div className="space-y-3 mb-6">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Мин. срок аренды:</span>
                          <span className="text-white">{container.minRentalDays} дн.</span>
                        </div>
                        {getRentalDays() > 0 && (
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Ваш период:</span>
                            <span className="text-white">{getRentalDays()} дн.</span>
                          </div>
                        )}
                        {getRentalDays() > 0 && (
                          <div className="border-t border-gray-700 pt-3">
                            <div className="flex justify-between font-semibold">
                              <span className="text-gray-400">Общая стоимость:</span>
                              <span className="text-bearplus-green">
                                {formatCurrency(container.dailyRate * getRentalDays(), container.currency)}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="space-y-3">
                        <button
                          onClick={() => handleBookContainer(container.id)}
                          className="btn-primary w-full"
                        >
                          Оформить аренду
                        </button>
                        <button className="btn-secondary w-full">
                          Подробнее
                        </button>
                      </div>

                      {container.destinations.length > 0 && (
                        <div className="mt-4 p-3 bg-bearplus-card-dark rounded">
                          <h5 className="text-xs font-medium text-gray-400 mb-2">Доступные направления:</h5>
                          <div className="flex flex-wrap gap-1">
                            {container.destinations.map((dest, index) => (
                              <span key={index} className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded">
                                {dest}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* Info Section */}
      <section className="card bg-gradient-to-r from-blue-900/20 to-bearplus-green/10 border-bearplus-green/30">
        <div className="text-center mb-6">
          <h3 className="text-xl font-bold text-white mb-3">Преимущества аренды контейнеров</h3>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl mb-3">💰</div>
            <h4 className="font-semibold text-white mb-2">Экономия</h4>
            <p className="text-gray-300 text-sm">Гибкие тарифы и скидки для долгосрочной аренды</p>
          </div>
          <div className="text-center">
            <div className="text-3xl mb-3">🔒</div>
            <h4 className="font-semibold text-white mb-2">Надежность</h4>
            <p className="text-gray-300 text-sm">Все контейнеры проходят техническое обслуживание</p>
          </div>
          <div className="text-center">
            <div className="text-3xl mb-3">🌐</div>
            <h4 className="font-semibold text-white mb-2">Доступность</h4>
            <p className="text-gray-300 text-sm">Широкая сеть депо по всей России</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContainerRentalPage;