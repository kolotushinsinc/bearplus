import * as React from 'react';
import { useState } from 'react';

interface AutoDeliveryRate {
  id: string;
  carrier: string;
  route: {
    from: string;
    to: string;
    region: string;
  };
  vehicleType: string;
  capacity: {
    weight: number;
    volume: number;
  };
  baseRate: {
    upTo25t: number;
    upTo30t: number;
  };
  finalRate?: number;
  currency: 'RUB';
  loadingTime: number; // hours
  returnTime: number; // hours
  transitTime: number; // days
  services: string[];
  restrictions: string[];
  availability: boolean;
}

interface CalculatorData {
  fromLocation: string;
  toLocation: string;
  containerType: string;
  cargoType: 'dangerous' | 'normal';
  departureDate: string;
  cargoWeight: string;
}

const AutoDeliveryPage: React.FC = () => {
  const [calculatorData, setCalculatorData] = useState<CalculatorData>({
    fromLocation: '',
    toLocation: '',
    containerType: '',
    cargoType: 'normal',
    departureDate: '',
    cargoWeight: ''
  });

  const [searchResults, setSearchResults] = useState<AutoDeliveryRate[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Mock data for auto delivery rates
  const autoDeliveryRates: AutoDeliveryRate[] = [
    {
      id: '1',
      carrier: 'ДальТранс Логистик',
      route: {
        from: 'Владивосток',
        to: 'Москва',
        region: 'Центральный ФО'
      },
      vehicleType: 'Контейнеровоз 20DC',
      capacity: {
        weight: 25000,
        volume: 33
      },
      baseRate: {
        upTo25t: 180000,
        upTo30t: 220000
      },
      currency: 'RUB',
      loadingTime: 4,
      returnTime: 6,
      transitTime: 7,
      services: ['Страхование груза', 'Отслеживание GPS', 'Экспедирование'],
      restrictions: ['Не перевозим опасные грузы класса 1', 'Максимальная высота 2.6м'],
      availability: true
    },
    {
      id: '2',
      carrier: 'СибирьТранс',
      route: {
        from: 'Владивосток',
        to: 'Новосибирск',
        region: 'Сибирский ФО'
      },
      vehicleType: 'Полуприцеп 40DC',
      capacity: {
        weight: 30000,
        volume: 67
      },
      baseRate: {
        upTo25t: 120000,
        upTo30t: 150000
      },
      currency: 'RUB',
      loadingTime: 3,
      returnTime: 4,
      transitTime: 5,
      services: ['Срочная доставка', 'Охрана груза', 'Температурный контроль'],
      restrictions: ['Только контейнерные грузы', 'Предварительная подача за 24 часа'],
      availability: true
    },
    {
      id: '3',
      carrier: 'УралАвтоТранс',
      route: {
        from: 'Екатеринбург',
        to: 'Москва',
        region: 'Центральный ФО'
      },
      vehicleType: 'Фура 20',
      capacity: {
        weight: 20000,
        volume: 33
      },
      baseRate: {
        upTo25t: 85000,
        upTo30t: 95000
      },
      currency: 'RUB',
      loadingTime: 2,
      returnTime: 3,
      transitTime: 3,
      services: ['Быстрая загрузка', 'Документооборот', 'SMS уведомления'],
      restrictions: ['Груз до 2.4м высотой', 'Рабочие дни только'],
      availability: false
    }
  ];

  const containerTypes = [
    { value: '20dc', label: '20DC контейнер' },
    { value: '40dc', label: '40DC контейнер' },
    { value: 'truck20', label: 'Фура 20' },
    { value: 'truck40', label: 'Фура 40' },
    { value: 'jumbo', label: 'Джамбо' }
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
      
      // Фильтрация результатов
      let results = autoDeliveryRates.filter(rate => rate.availability);
      
      if (calculatorData.fromLocation) {
        results = results.filter(rate => 
          rate.route.from.toLowerCase().includes(calculatorData.fromLocation.toLowerCase())
        );
      }
      
      if (calculatorData.toLocation) {
        results = results.filter(rate => 
          rate.route.to.toLowerCase().includes(calculatorData.toLocation.toLowerCase())
        );
      }

      // Расчет стоимости на основе веса
      if (calculatorData.cargoWeight) {
        const weight = parseInt(calculatorData.cargoWeight);
        results = results.map(rate => ({
          ...rate,
          finalRate: weight <= 25000 ? rate.baseRate.upTo25t : rate.baseRate.upTo30t
        }));
      }

      setSearchResults(results);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBookDelivery = (rateId: string) => {
    console.log('Booking delivery:', rateId);
    // Логика бронирования
  };

  const formatCurrency = (amount: number) => {
    return `${amount.toLocaleString()} ₽`;
  };

  return (
    <div className="py-8 space-y-8">
      {/* Page Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-4">Авто доставка</h1>
        <p className="text-gray-300 text-lg max-w-2xl mx-auto">
          Автомобильные перевозки "от двери до двери". Найдите оптимальное решение 
          для доставки ваших грузов по всей России.
        </p>
      </div>

      {/* Calculator Section */}
      <section className="card">
        <h2 className="text-2xl font-bold text-white mb-6">Калькулятор автодоставки</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Откуда *
            </label>
            <input
              type="text"
              value={calculatorData.fromLocation}
              onChange={(e) => handleCalculatorChange('fromLocation', e.target.value)}
              placeholder="Город отправления"
              className="input-field w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Куда *
            </label>
            <input
              type="text"
              value={calculatorData.toLocation}
              onChange={(e) => handleCalculatorChange('toLocation', e.target.value)}
              placeholder="Город назначения"
              className="input-field w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Тип контейнера/фуры *
            </label>
            <select
              value={calculatorData.containerType}
              onChange={(e) => handleCalculatorChange('containerType', e.target.value)}
              className="select-field w-full"
            >
              <option value="">Выберите тип</option>
              {containerTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Вид груза *
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
              Вес груза (кг) *
            </label>
            <input
              type="number"
              value={calculatorData.cargoWeight}
              onChange={(e) => handleCalculatorChange('cargoWeight', e.target.value)}
              placeholder="Введите вес"
              className="input-field w-full"
            />
          </div>
        </div>

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
              {searchResults.length > 0 ? 'Доступные варианты' : 'Результаты поиска'}
            </h2>
            {searchResults.length > 0 && (
              <p className="text-gray-400">Найдено: {searchResults.length} вариантов</p>
            )}
          </div>

          {searchResults.length === 0 && !isLoading ? (
            <div className="card text-center">
              <div className="text-4xl mb-4">🚛</div>
              <h3 className="text-xl font-semibold text-white mb-2">Перевозчики не найдены</h3>
              <p className="text-gray-400 mb-4">
                Попробуйте изменить параметры поиска или свяжитесь с нами для подбора индивидуального решения.
              </p>
              <button className="btn-secondary">
                Связаться с менеджером
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {searchResults.map((rate) => (
                <div key={rate.id} className="card">
                  <div className="grid md:grid-cols-3 gap-6">
                    {/* Carrier Info */}
                    <div className="md:col-span-2">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-semibold text-white mb-1">
                            {rate.carrier}
                          </h3>
                          <p className="text-bearplus-green text-sm font-medium">
                            {rate.route.from} → {rate.route.to}
                          </p>
                          <p className="text-gray-400 text-sm">{rate.route.region}</p>
                        </div>
                        <span className={`px-3 py-1 rounded text-sm font-medium ${
                          rate.availability 
                            ? 'bg-green-900 text-green-300' 
                            : 'bg-red-900 text-red-300'
                        }`}>
                          {rate.availability ? 'Доступно' : 'Занято'}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <h4 className="text-sm font-medium text-gray-400 mb-2">Транспорт</h4>
                          <ul className="text-sm text-gray-300 space-y-1">
                            <li>Тип: {rate.vehicleType}</li>
                            <li>Грузоподъемность: {rate.capacity.weight.toLocaleString()} кг</li>
                            <li>Объем: {rate.capacity.volume} м³</li>
                            <li>Время в пути: {rate.transitTime} дн.</li>
                          </ul>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-400 mb-2">Время</h4>
                          <ul className="text-sm text-gray-300 space-y-1">
                            <li>Подача: {rate.loadingTime} ч</li>
                            <li>Возврат: {rate.returnTime} ч</li>
                            <li>Общее время: {rate.transitTime} дн.</li>
                          </ul>
                        </div>
                      </div>

                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-400 mb-2">Услуги</h4>
                        <div className="flex flex-wrap gap-2">
                          {rate.services.map((service, index) => (
                            <span key={index} className="text-xs bg-bearplus-green/20 text-bearplus-green px-2 py-1 rounded">
                              {service}
                            </span>
                          ))}
                        </div>
                      </div>

                      {rate.restrictions.length > 0 && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-400 mb-2">Ограничения</h4>
                          <ul className="text-sm text-gray-400 space-y-1">
                            {rate.restrictions.map((restriction, index) => (
                              <li key={index}>• {restriction}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    {/* Pricing */}
                    <div className="border-l border-gray-700 pl-6">
                      <div className="text-center mb-4">
                        {rate.finalRate ? (
                          <div className="text-3xl font-bold text-bearplus-green mb-1">
                            {formatCurrency(rate.finalRate)}
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <div>
                              <div className="text-lg font-bold text-bearplus-green">
                                {formatCurrency(rate.baseRate.upTo25t)}
                              </div>
                              <div className="text-gray-400 text-xs">до 25 тонн</div>
                            </div>
                            <div>
                              <div className="text-lg font-bold text-bearplus-green">
                                {formatCurrency(rate.baseRate.upTo30t)}
                              </div>
                              <div className="text-gray-400 text-xs">до 30 тонн</div>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="space-y-3 mb-6">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Время подачи:</span>
                          <span className="text-white">{rate.loadingTime} ч</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Время возврата:</span>
                          <span className="text-white">{rate.returnTime} ч</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Транзит:</span>
                          <span className="text-white">{rate.transitTime} дн.</span>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <button
                          onClick={() => handleBookDelivery(rate.id)}
                          disabled={!rate.availability}
                          className={`w-full ${rate.availability ? 'btn-primary' : 'btn-secondary opacity-50 cursor-not-allowed'}`}
                        >
                          {rate.availability ? 'Оформить' : 'Недоступно'}
                        </button>
                        <button className="btn-secondary w-full">
                          Подробнее
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* Available Routes Overview */}
      {!hasSearched && (
        <section className="card">
          <h2 className="text-2xl font-bold text-white mb-6">Популярные направления</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {autoDeliveryRates.map((rate) => (
              <div key={rate.id} className="p-4 bg-bearplus-card-dark rounded-lg hover:bg-gray-700 transition-colors cursor-pointer">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-white text-sm">{rate.route.from} → {rate.route.to}</h3>
                    <p className="text-gray-400 text-xs">{rate.route.region}</p>
                  </div>
                  <span className={`w-3 h-3 rounded-full ${rate.availability ? 'bg-green-400' : 'bg-red-400'}`}></span>
                </div>
                
                <div className="space-y-2 text-xs text-gray-400">
                  <div className="flex justify-between">
                    <span>Базовая ставка:</span>
                    <span className="text-bearplus-green">{formatCurrency(rate.baseRate.upTo25t)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Время в пути:</span>
                    <span className="text-white">{rate.transitTime} дн.</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Statistics */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="text-center">
          <div className="text-3xl font-bold text-bearplus-green mb-2">200+</div>
          <div className="text-gray-400 text-sm">Перевозчиков</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-bearplus-green mb-2">85</div>
          <div className="text-gray-400 text-sm">Регионов РФ</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-bearplus-green mb-2">24/7</div>
          <div className="text-gray-400 text-sm">Отслеживание</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-bearplus-green mb-2">99%</div>
          <div className="text-gray-400 text-sm">Вовремя</div>
        </div>
      </section>
    </div>
  );
};

export default AutoDeliveryPage;