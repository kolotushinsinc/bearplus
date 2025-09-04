import * as React from 'react';
import { useState } from 'react';

interface RailwayRate {
  id: string;
  trainNumber: string;
  carrier: string;
  route: {
    fromStation: string;
    fromCity: string;
    toStation: string;
    toCity: string;
  };
  schedule: {
    departureDate: string;
    departureTime: string;
    arrivalDate: string;
    arrivalTime: string;
  };
  transitDays: number;
  wagonType: string;
  cargoType: string;
  rate: number;
  currency: 'RUB';
  capacity: {
    wagonCount: number;
    maxWeight: number;
    volume: number;
  };
  services: string[];
  restrictions: string[];
  availability: boolean;
}

interface CalculatorData {
  fromLocation: string;
  toLocation: string;
  cargoName: string;
  etsgCode: string;
  wagonWeight: string;
  wagonType: string;
  wagonCount: string;
  departureDate: string;
  msdsFiles: File[];
}

const RailwayTariffsPage: React.FC = () => {
  const [calculatorData, setCalculatorData] = useState<CalculatorData>({
    fromLocation: '',
    toLocation: '',
    cargoName: '',
    etsgCode: '',
    wagonWeight: '',
    wagonType: '',
    wagonCount: '',
    departureDate: '',
    msdsFiles: []
  });

  const [searchResults, setSearchResults] = useState<RailwayRate[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showStations, setShowStations] = useState<{from: boolean, to: boolean}>({from: false, to: false});

  // Mock data for railway rates
  const railwayRates: RailwayRate[] = [
    {
      id: '1',
      trainNumber: '001Ч',
      carrier: 'РЖД Логистика',
      route: {
        fromStation: 'Владивосток-Товарный',
        fromCity: 'Владивосток',
        toStation: 'Москва-Товарная-Казанская',
        toCity: 'Москва'
      },
      schedule: {
        departureDate: '2024-01-20',
        departureTime: '14:30',
        arrivalDate: '2024-01-27',
        arrivalTime: '08:45'
      },
      transitDays: 7,
      wagonType: 'Крытый вагон',
      cargoType: 'Контейнеры',
      rate: 85000,
      currency: 'RUB',
      capacity: {
        wagonCount: 5,
        maxWeight: 68000,
        volume: 120
      },
      services: ['Охрана состава', 'Страхование груза', 'Отслеживание'],
      restrictions: ['Только контейнерные грузы', 'Максимум 5 вагонов'],
      availability: true
    },
    {
      id: '2',
      trainNumber: '003М',
      carrier: 'ТрансКонтейнер',
      route: {
        fromStation: 'Находка-Восточная',
        fromCity: 'Находка',
        toStation: 'Санкт-Петербург-Товарный-Московский',
        toCity: 'Санкт-Петербург'
      },
      schedule: {
        departureDate: '2024-01-22',
        departureTime: '16:00',
        arrivalDate: '2024-01-30',
        arrivalTime: '12:20'
      },
      transitDays: 8,
      wagonType: 'Платформа',
      cargoType: 'Контейнеры крупнотоннажные',
      rate: 92000,
      currency: 'RUB',
      capacity: {
        wagonCount: 10,
        maxWeight: 120000,
        volume: 200
      },
      services: ['Экспресс доставка', 'GPS мониторинг', 'Документооборот'],
      restrictions: ['Контейнеры г/п 30 тонн', 'Предварительная подача'],
      availability: true
    },
    {
      id: '3',
      trainNumber: '005Г',
      carrier: 'Дальневосточная ЖД',
      route: {
        fromStation: 'Хабаровск-1',
        fromCity: 'Хабаровск',
        toStation: 'Екатеринбург-Товарный',
        toCity: 'Екатеринбург'
      },
      schedule: {
        departureDate: '2024-01-25',
        departureTime: '20:15',
        arrivalDate: '2024-01-30',
        arrivalTime: '14:30'
      },
      transitDays: 5,
      wagonType: 'Полувагон',
      cargoType: 'Навалочные грузы',
      rate: 65000,
      currency: 'RUB',
      capacity: {
        wagonCount: 8,
        maxWeight: 560000,
        volume: 640
      },
      services: ['Пломбирование', 'Взвешивание', 'Сопровождение'],
      restrictions: ['Только сыпучие грузы', 'Защита от атмосферных осадков'],
      availability: false
    }
  ];

  const wagonTypes = [
    { value: 'covered', label: 'Крытый вагон' },
    { value: 'gondola', label: 'Полувагон' },
    { value: 'platform', label: 'Платформа' },
    { value: 'cistern', label: 'Цистерна' },
    { value: 'isothermic', label: 'Изотермический вагон' },
    { value: 'specialized', label: 'Специализированный вагон' },
    { value: 'grain', label: 'Зерновоз' },
    { value: 'container30', label: 'Контейнер крупнотоннажный г/п 30 тонн' },
    { value: 'container24', label: 'Контейнер крупнотоннажный г/п 24 тонны' }
  ];

  // Mock stations for autocomplete
  const stations = {
    vladivostok: ['Владивосток-Товарный', 'Владивосток-Пассажирский'],
    moscow: ['Москва-Товарная-Казанская', 'Москва-Товарная-Смоленская', 'Москва-Товарная-Курская'],
    spb: ['Санкт-Петербург-Товарный-Московский', 'Санкт-Петербург-Товарный-Витебский'],
    novosibirsk: ['Новосибирск-Главный', 'Новосибирск-Восточный'],
    ekaterinburg: ['Екатеринбург-Товарный', 'Екатеринбург-Пассажирский']
  };

  const handleCalculatorChange = (field: keyof CalculatorData, value: string) => {
    setCalculatorData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setCalculatorData(prev => ({
      ...prev,
      msdsFiles: [...prev.msdsFiles, ...files]
    }));
  };

  const removeFile = (index: number) => {
    setCalculatorData(prev => ({
      ...prev,
      msdsFiles: prev.msdsFiles.filter((_, i) => i !== index)
    }));
  };

  const handleSearch = async () => {
    setIsLoading(true);
    setHasSearched(true);

    try {
      // Имитация поиска
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Фильтрация результатов
      let results = railwayRates.filter(rate => rate.availability);
      
      if (calculatorData.fromLocation) {
        results = results.filter(rate => 
          rate.route.fromCity.toLowerCase().includes(calculatorData.fromLocation.toLowerCase()) ||
          rate.route.fromStation.toLowerCase().includes(calculatorData.fromLocation.toLowerCase())
        );
      }
      
      if (calculatorData.toLocation) {
        results = results.filter(rate => 
          rate.route.toCity.toLowerCase().includes(calculatorData.toLocation.toLowerCase()) ||
          rate.route.toStation.toLowerCase().includes(calculatorData.toLocation.toLowerCase())
        );
      }

      if (calculatorData.wagonType) {
        results = results.filter(rate => 
          rate.wagonType.toLowerCase().includes(calculatorData.wagonType.toLowerCase())
        );
      }

      setSearchResults(results);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBookTrain = (rateId: string) => {
    console.log('Booking train:', rateId);
    // Логика бронирования
  };

  const formatCurrency = (amount: number) => {
    return `${amount.toLocaleString()} ₽`;
  };

  const formatDateTime = (date: string, time: string) => {
    return `${new Date(date).toLocaleDateString('ru')} ${time}`;
  };

  const getStationSuggestions = (city: string) => {
    const cityKey = city.toLowerCase();
    if (cityKey.includes('владивосток')) return stations.vladivostok;
    if (cityKey.includes('москва')) return stations.moscow;
    if (cityKey.includes('петербург')) return stations.spb;
    if (cityKey.includes('новосибирск')) return stations.novosibirsk;
    if (cityKey.includes('екатеринбург')) return stations.ekaterinburg;
    return [];
  };

  return (
    <div className="py-8 space-y-8">
      {/* Page Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-4">ЖД тарифы</h1>
        <p className="text-gray-300 text-lg max-w-2xl mx-auto">
          Железнодорожные перевозки грузов по всей России. Контейнерные, 
          вагонные и сборные грузы с актуальными тарифами.
        </p>
      </div>

      {/* Calculator Section */}
      <section className="card">
        <h2 className="text-2xl font-bold text-white mb-6">Калькулятор ЖД тарифов</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Откуда (станция отправления) *
            </label>
            <input
              type="text"
              value={calculatorData.fromLocation}
              onChange={(e) => handleCalculatorChange('fromLocation', e.target.value)}
              placeholder="Введите город или станцию"
              className="input-field w-full"
            />
            {calculatorData.fromLocation && getStationSuggestions(calculatorData.fromLocation).length > 0 && (
              <div className="mt-1 bg-bearplus-card-dark border border-gray-600 rounded max-h-32 overflow-y-auto">
                {getStationSuggestions(calculatorData.fromLocation).map((station, index) => (
                  <button
                    key={index}
                    onClick={() => handleCalculatorChange('fromLocation', station)}
                    className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-gray-600"
                  >
                    {station}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Куда (станция назначения) *
            </label>
            <input
              type="text"
              value={calculatorData.toLocation}
              onChange={(e) => handleCalculatorChange('toLocation', e.target.value)}
              placeholder="Введите город или станцию"
              className="input-field w-full"
            />
            {calculatorData.toLocation && getStationSuggestions(calculatorData.toLocation).length > 0 && (
              <div className="mt-1 bg-bearplus-card-dark border border-gray-600 rounded max-h-32 overflow-y-auto">
                {getStationSuggestions(calculatorData.toLocation).map((station, index) => (
                  <button
                    key={index}
                    onClick={() => handleCalculatorChange('toLocation', station)}
                    className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-gray-600"
                  >
                    {station}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Название груза
            </label>
            <input
              type="text"
              value={calculatorData.cargoName}
              onChange={(e) => handleCalculatorChange('cargoName', e.target.value)}
              placeholder="Например: Контейнеры"
              className="input-field w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Код ЕТСНГ
            </label>
            <input
              type="text"
              value={calculatorData.etsgCode}
              onChange={(e) => handleCalculatorChange('etsgCode', e.target.value)}
              placeholder="Код по ЕТСНГ"
              className="input-field w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Вес груза в одном вагоне (тонны) *
            </label>
            <input
              type="number"
              value={calculatorData.wagonWeight}
              onChange={(e) => handleCalculatorChange('wagonWeight', e.target.value)}
              placeholder="Введите вес"
              className="input-field w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Тип вагона *
            </label>
            <select
              value={calculatorData.wagonType}
              onChange={(e) => handleCalculatorChange('wagonType', e.target.value)}
              className="select-field w-full"
            >
              <option value="">Выберите тип вагона</option>
              {wagonTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Количество вагонов *
            </label>
            <input
              type="number"
              min="1"
              value={calculatorData.wagonCount}
              onChange={(e) => handleCalculatorChange('wagonCount', e.target.value)}
              placeholder="Введите количество"
              className="input-field w-full"
            />
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
        </div>

        {/* MSDS Upload */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Прикрепить MSDS документы
          </label>
          <input
            type="file"
            multiple
            accept=".pdf,.doc,.docx"
            onChange={handleFileUpload}
            className="input-field w-full"
          />
          {calculatorData.msdsFiles.length > 0 && (
            <div className="mt-2">
              {calculatorData.msdsFiles.map((file, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-700 p-2 rounded mb-1">
                  <span className="text-sm text-white">{file.name}</span>
                  <button
                    onClick={() => removeFile(index)}
                    className="text-red-400 hover:text-red-300"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={handleSearch}
          disabled={isLoading}
          className="btn-primary w-full md:w-auto"
        >
          {isLoading ? 'Расчет ставки...' : 'Рассчитать ставку'}
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
              <div className="text-4xl mb-4">🚂</div>
              <h3 className="text-xl font-semibold text-white mb-2">Поезда не найдены</h3>
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
                    {/* Train Info */}
                    <div className="md:col-span-2">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-semibold text-white mb-1">
                            Поезд {rate.trainNumber}
                          </h3>
                          <p className="text-bearplus-green text-sm font-medium">
                            {rate.carrier}
                          </p>
                          <p className="text-gray-400 text-sm">
                            {rate.route.fromCity} → {rate.route.toCity}
                          </p>
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
                          <h4 className="text-sm font-medium text-gray-400 mb-2">Маршрут</h4>
                          <ul className="text-sm text-gray-300 space-y-1">
                            <li>Отправление: {rate.route.fromStation}</li>
                            <li>Назначение: {rate.route.toStation}</li>
                            <li>Тип вагона: {rate.wagonType}</li>
                            <li>Транзит: {rate.transitDays} дн.</li>
                          </ul>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-400 mb-2">Расписание</h4>
                          <ul className="text-sm text-gray-300 space-y-1">
                            <li>Отправление: {formatDateTime(rate.schedule.departureDate, rate.schedule.departureTime)}</li>
                            <li>Прибытие: {formatDateTime(rate.schedule.arrivalDate, rate.schedule.arrivalTime)}</li>
                          </ul>
                        </div>
                      </div>

                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-400 mb-2">Характеристики</h4>
                        <div className="flex flex-wrap gap-4 text-sm text-gray-300">
                          <span>Вагонов: {rate.capacity.wagonCount}</span>
                          <span>Грузоподъемность: {rate.capacity.maxWeight.toLocaleString()} кг</span>
                          <span>Объем: {rate.capacity.volume} м³</span>
                          <span>Тип груза: {rate.cargoType}</span>
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

                    {/* Pricing and Booking */}
                    <div className="border-l border-gray-700 pl-6">
                      <div className="text-center mb-4">
                        <div className="text-3xl font-bold text-bearplus-green mb-1">
                          {formatCurrency(rate.rate)}
                        </div>
                        <div className="text-gray-400 text-sm">за вагон</div>
                      </div>

                      <div className="space-y-3 mb-6">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Отправление:</span>
                          <span className="text-white">{new Date(rate.schedule.departureDate).toLocaleDateString('ru')}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Прибытие:</span>
                          <span className="text-white">{new Date(rate.schedule.arrivalDate).toLocaleDateString('ru')}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Транзит:</span>
                          <span className="text-white">{rate.transitDays} дн.</span>
                        </div>
                        {calculatorData.wagonCount && (
                          <div className="border-t border-gray-700 pt-3">
                            <div className="flex justify-between font-semibold">
                              <span className="text-gray-400">Общая стоимость:</span>
                              <span className="text-bearplus-green">
                                {formatCurrency(rate.rate * parseInt(calculatorData.wagonCount || '1'))}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="space-y-3">
                        <button
                          onClick={() => handleBookTrain(rate.id)}
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

      {/* Railway Statistics */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="text-center">
          <div className="text-3xl font-bold text-bearplus-green mb-2">5000+</div>
          <div className="text-gray-400 text-sm">Станций</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-bearplus-green mb-2">150+</div>
          <div className="text-gray-400 text-sm">Маршрутов</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-bearplus-green mb-2">24/7</div>
          <div className="text-gray-400 text-sm">Диспетчерская</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-bearplus-green mb-2">95%</div>
          <div className="text-gray-400 text-sm">Точность расписания</div>
        </div>
      </section>
    </div>
  );
};

export default RailwayTariffsPage;