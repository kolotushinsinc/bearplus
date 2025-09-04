import * as React from 'react';
import { useState } from 'react';

interface FreightRate {
  id: string;
  line: string;
  departurePort: string;
  departureDate: string;
  arrivalPort: string;
  route: string;
  containerType: string;
  containerWeight: number;
  baseRate: number;
  dthc: number;
  ddf: number;
  finalRate: number;
  currency: 'USD' | 'EUR' | 'RUB';
  isDirect: boolean;
  vessel: string;
  transitTime: number;
  validUntil: string;
  notes?: string;
}

interface CalculatorData {
  departure: string;
  arrival: string;
  containerType: string;
  cargoType: 'dangerous' | 'normal';
  departureDate: string;
  weight: string;
}

const FreightRatesPage: React.FC = () => {
  const [calculatorData, setCalculatorData] = useState<CalculatorData>({
    departure: '',
    arrival: '',
    containerType: '',
    cargoType: 'normal',
    departureDate: '',
    weight: ''
  });

  const [expandedRate, setExpandedRate] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'price' | 'date' | 'transit'>('price');
  const [filterBy, setFilterBy] = useState<'all' | 'direct' | 'indirect'>('all');

  // Mock data - в реальном приложении будет загружаться с API
  const [freightRates] = useState<FreightRate[]>([
    {
      id: '1',
      line: 'COSCO',
      departurePort: 'Пусан',
      departureDate: '2024-01-15',
      arrivalPort: 'Владивосток',
      route: 'Пусан → Владивосток',
      containerType: '40HC',
      containerWeight: 28000,
      baseRate: 1200,
      dthc: 150,
      ddf: 80,
      finalRate: 1430,
      currency: 'USD',
      isDirect: true,
      vessel: 'COSCO SHANGHAI',
      transitTime: 3,
      validUntil: '2024-01-20',
      notes: 'Прямой рейс, быстрая обработка'
    },
    {
      id: '2',
      line: 'MSC',
      departurePort: 'Шанхай',
      departureDate: '2024-01-18',
      arrivalPort: 'Новороссийск',
      route: 'Шанхай → Сингапур → Новороссийск',
      containerType: '20DC',
      containerWeight: 20000,
      baseRate: 2500,
      dthc: 200,
      ddf: 120,
      finalRate: 2820,
      currency: 'USD',
      isDirect: false,
      vessel: 'MSC MEDITERRANEAN',
      transitTime: 28,
      validUntil: '2024-01-25',
      notes: 'Заход в Сингапур, надежная линия'
    }
  ]);

  const handleCalculatorChange = (field: keyof CalculatorData, value: string) => {
    setCalculatorData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSearch = () => {
    // Логика поиска ставок
    console.log('Searching with:', calculatorData);
  };

  const toggleRateExpansion = (rateId: string) => {
    setExpandedRate(expandedRate === rateId ? null : rateId);
  };

  const handleBookRate = (rateId: string) => {
    console.log('Booking rate:', rateId);
    // Логика оформления заявки
  };

  const formatCurrency = (amount: number, currency: string) => {
    const symbols = { USD: '$', EUR: '€', RUB: '₽' };
    return `${symbols[currency as keyof typeof symbols]}${amount.toLocaleString()}`;
  };

  const sortedRates = [...freightRates].sort((a, b) => {
    switch (sortBy) {
      case 'price':
        return a.finalRate - b.finalRate;
      case 'date':
        return new Date(a.departureDate).getTime() - new Date(b.departureDate).getTime();
      case 'transit':
        return a.transitTime - b.transitTime;
      default:
        return 0;
    }
  });

  const filteredRates = sortedRates.filter(rate => {
    if (filterBy === 'direct') return rate.isDirect;
    if (filterBy === 'indirect') return !rate.isDirect;
    return true;
  });

  return (
    <div className="py-8 space-y-8">
      {/* Page Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-4">Ставки фрахта</h1>
        <p className="text-gray-300 text-lg max-w-2xl mx-auto">
          Актуальные ставки морского фрахта по всем направлениям. 
          Найдите оптимальный маршрут и забронируйте место на судне.
        </p>
      </div>

      {/* Calculator Section */}
      <section className="card">
        <h2 className="text-2xl font-bold text-white mb-6">Калькулятор фрахта</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Пункт отправления
            </label>
            <input
              type="text"
              value={calculatorData.departure}
              onChange={(e) => handleCalculatorChange('departure', e.target.value)}
              placeholder="Введите порт отправления"
              className="input-field w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Пункт прибытия
            </label>
            <input
              type="text"
              value={calculatorData.arrival}
              onChange={(e) => handleCalculatorChange('arrival', e.target.value)}
              placeholder="Введите порт прибытия"
              className="input-field w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Тип контейнера
            </label>
            <select
              value={calculatorData.containerType}
              onChange={(e) => handleCalculatorChange('containerType', e.target.value)}
              className="select-field w-full"
            >
              <option value="">Выберите тип</option>
              <option value="20DC">20' Dry Container</option>
              <option value="40DC">40' Dry Container</option>
              <option value="40HC">40' High Cube</option>
              <option value="45HC">45' High Cube</option>
              <option value="20RF">20' Reefer</option>
              <option value="40RF">40' Reefer</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Характер груза
            </label>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="cargoType"
                  value="normal"
                  checked={calculatorData.cargoType === 'normal'}
                  onChange={(e) => handleCalculatorChange('cargoType', e.target.value as 'normal' | 'dangerous')}
                  className="sr-only"
                />
                <div className={`w-4 h-4 rounded-full border-2 mr-2 ${
                  calculatorData.cargoType === 'normal' 
                    ? 'bg-bearplus-green border-bearplus-green' 
                    : 'border-gray-500'
                }`} />
                <span className="text-white text-sm">Обычный</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="cargoType"
                  value="dangerous"
                  checked={calculatorData.cargoType === 'dangerous'}
                  onChange={(e) => handleCalculatorChange('cargoType', e.target.value as 'normal' | 'dangerous')}
                  className="sr-only"
                />
                <div className={`w-4 h-4 rounded-full border-2 mr-2 ${
                  calculatorData.cargoType === 'dangerous' 
                    ? 'bg-bearplus-green border-bearplus-green' 
                    : 'border-gray-500'
                }`} />
                <span className="text-white text-sm">Опасный</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Дата отправления
            </label>
            <input
              type="date"
              value={calculatorData.departureDate}
              onChange={(e) => handleCalculatorChange('departureDate', e.target.value)}
              className="input-field w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Вес груза (кг)
            </label>
            <input
              type="number"
              value={calculatorData.weight}
              onChange={(e) => handleCalculatorChange('weight', e.target.value)}
              placeholder="Введите вес"
              className="input-field w-full"
            />
          </div>
        </div>

        <button
          onClick={handleSearch}
          className="btn-primary w-full md:w-auto"
        >
          Найти ставки
        </button>
      </section>

      {/* Filters and Sorting */}
      <section className="flex flex-wrap gap-4 justify-between items-center">
        <div className="flex gap-4">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'price' | 'date' | 'transit')}
            className="select-field"
          >
            <option value="price">Сортировать по цене</option>
            <option value="date">Сортировать по дате</option>
            <option value="transit">Сортировать по времени</option>
          </select>

          <select
            value={filterBy}
            onChange={(e) => setFilterBy(e.target.value as 'all' | 'direct' | 'indirect')}
            className="select-field"
          >
            <option value="all">Все рейсы</option>
            <option value="direct">Прямые рейсы</option>
            <option value="indirect">С заходами</option>
          </select>
        </div>

        <div className="text-gray-400 text-sm">
          Найдено ставок: {filteredRates.length}
        </div>
      </section>

      {/* Rates List */}
      <section className="space-y-4">
        {filteredRates.map((rate) => (
          <div key={rate.id} className="card">
            {/* Rate Header */}
            <div 
              className="cursor-pointer"
              onClick={() => toggleRateExpansion(rate.id)}
            >
              <div className="flex flex-wrap justify-between items-start gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-white">{rate.line}</h3>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      rate.isDirect 
                        ? 'bg-green-900 text-green-300' 
                        : 'bg-orange-900 text-orange-300'
                    }`}>
                      {rate.isDirect ? 'Прямой' : 'С заходом'}
                    </span>
                  </div>
                  <p className="text-gray-300 text-sm mb-1">{rate.route}</p>
                  <p className="text-gray-400 text-xs">
                    Судно: {rate.vessel} | Время в пути: {rate.transitTime} дн.
                  </p>
                </div>

                <div className="text-right">
                  <div className="text-2xl font-bold text-bearplus-green mb-1">
                    {formatCurrency(rate.finalRate, rate.currency)}
                  </div>
                  <div className="text-gray-400 text-xs">
                    Отправление: {new Date(rate.departureDate).toLocaleDateString('ru')}
                  </div>
                </div>

                <div className="flex items-center text-gray-400">
                  <svg 
                    className={`w-5 h-5 transform transition-transform ${
                      expandedRate === rate.id ? 'rotate-180' : ''
                    }`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Expanded Details */}
            {expandedRate === rate.id && (
              <div className="mt-6 pt-6 border-t border-gray-700">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Route Details */}
                  <div>
                    <h4 className="text-lg font-semibold text-bearplus-green mb-3">Детали маршрута</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Порт отправления:</span>
                        <span className="text-white">{rate.departurePort}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Порт прибытия:</span>
                        <span className="text-white">{rate.arrivalPort}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Судно:</span>
                        <span className="text-white">{rate.vessel}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Тип контейнера:</span>
                        <span className="text-white">{rate.containerType}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Время в пути:</span>
                        <span className="text-white">{rate.transitTime} дней</span>
                      </div>
                    </div>
                  </div>

                  {/* Price Breakdown */}
                  <div>
                    <h4 className="text-lg font-semibold text-bearplus-green mb-3">Структура цены</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Базовая ставка:</span>
                        <span className="text-white">{formatCurrency(rate.baseRate, rate.currency)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">DTHC:</span>
                        <span className="text-white">{formatCurrency(rate.dthc, rate.currency)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">DDF:</span>
                        <span className="text-white">{formatCurrency(rate.ddf, rate.currency)}</span>
                      </div>
                      <div className="border-t border-gray-700 pt-3">
                        <div className="flex justify-between text-lg font-semibold">
                          <span className="text-bearplus-green">Итого:</span>
                          <span className="text-bearplus-green">{formatCurrency(rate.finalRate, rate.currency)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Timeline Visualization */}
                <div className="mt-6">
                  <h4 className="text-lg font-semibold text-bearplus-green mb-3">Визуализация пути</h4>
                  <div className="flex items-center justify-between bg-bearplus-card-dark p-4 rounded-lg">
                    <div className="text-center">
                      <div className="w-4 h-4 bg-bearplus-green rounded-full mx-auto mb-2"></div>
                      <div className="text-sm text-white font-medium">{rate.departurePort}</div>
                      <div className="text-xs text-gray-400">{new Date(rate.departureDate).toLocaleDateString('ru')}</div>
                    </div>
                    
                    <div className="flex-1 mx-4">
                      <div className="h-1 bg-gradient-to-r from-bearplus-green to-blue-500 rounded-full relative">
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-xs text-white bg-black px-2 py-1 rounded">
                          {rate.transitTime} дн.
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <div className="w-4 h-4 bg-blue-500 rounded-full mx-auto mb-2"></div>
                      <div className="text-sm text-white font-medium">{rate.arrivalPort}</div>
                      <div className="text-xs text-gray-400">
                        {new Date(new Date(rate.departureDate).getTime() + rate.transitTime * 24 * 60 * 60 * 1000).toLocaleDateString('ru')}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Notes */}
                {rate.notes && (
                  <div className="mt-4">
                    <h4 className="text-sm font-semibold text-gray-400 mb-2">Примечания:</h4>
                    <p className="text-gray-300 text-sm">{rate.notes}</p>
                  </div>
                )}

                {/* Action Button */}
                <div className="mt-6 flex justify-end">
                  <button
                    onClick={() => handleBookRate(rate.id)}
                    className="btn-primary"
                  >
                    Оформить заявку
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </section>

      {/* Statistics */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="text-center">
          <div className="text-3xl font-bold text-bearplus-green mb-2">500+</div>
          <div className="text-gray-400 text-sm">Активных маршрутов</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-bearplus-green mb-2">50+</div>
          <div className="text-gray-400 text-sm">Судоходных линий</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-bearplus-green mb-2">24/7</div>
          <div className="text-gray-400 text-sm">Обновление ставок</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-bearplus-green mb-2">98%</div>
          <div className="text-gray-400 text-sm">Точность прогнозов</div>
        </div>
      </section>
    </div>
  );
};

export default FreightRatesPage;