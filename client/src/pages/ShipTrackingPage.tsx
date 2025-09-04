import * as React from 'react';
import { useState } from 'react';

interface VesselInfo {
  name: string;
  imo: string;
  mmsi: string;
  callSign: string;
  flag: string;
  type: string;
  length: number;
  beam: number;
  dwt: number;
  yearBuilt: number;
  status: string;
  destination: string;
  eta: string;
  position: {
    lat: number;
    lng: number;
  };
  speed: number;
  course: number;
  lastUpdate: string;
}

const ShipTrackingPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState<'name' | 'imo' | 'mmsi'>('name');
  const [vesselInfo, setVesselInfo] = useState<VesselInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Mock vessel data for demonstration
  const mockVessel: VesselInfo = {
    name: 'COSCO SHANGHAI',
    imo: '9234567',
    mmsi: '412345678',
    callSign: 'BQHM',
    flag: 'China',
    type: 'Container Ship',
    length: 366,
    beam: 51,
    dwt: 147794,
    yearBuilt: 2018,
    status: 'Under way using engine',
    destination: 'VLADIVOSTOK',
    eta: '2024-01-20 14:00 UTC',
    position: {
      lat: 42.8876,
      lng: 132.6543
    },
    speed: 18.5,
    course: 245,
    lastUpdate: '2024-01-15 12:30 UTC'
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setError('Введите название или номер судна для поиска');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Имитация поиска - в реальном приложении здесь будет API call к MarineTraffic
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (searchQuery.toLowerCase().includes('cosco') || searchQuery === '9234567') {
        setVesselInfo(mockVessel);
      } else {
        setError('Судно не найдено. Попробуйте другой запрос.');
        setVesselInfo(null);
      }
    } catch (err) {
      setError('Ошибка при поиске судна. Попробуйте позже.');
      setVesselInfo(null);
    } finally {
      setIsLoading(false);
    }
  };

  const formatPosition = (lat: number, lng: number) => {
    const latDir = lat >= 0 ? 'N' : 'S';
    const lngDir = lng >= 0 ? 'E' : 'W';
    return `${Math.abs(lat).toFixed(4)}°${latDir} ${Math.abs(lng).toFixed(4)}°${lngDir}`;
  };

  return (
    <div className="py-8 space-y-8">
      {/* Page Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-4">Судовая карта</h1>
        <p className="text-gray-300 text-lg max-w-2xl mx-auto">
          Отслеживание судов в реальном времени с помощью интеграции с MarineTraffic.
          Найдите ваше судно и следите за его движением.
        </p>
        <div className="mt-4 inline-block bg-orange-900 text-orange-200 px-4 py-2 rounded-lg text-sm">
          ⚠️ Страница находится в разработке - интеграция с MarineTraffic скоро будет доступна
        </div>
      </div>

      {/* Search Section */}
      <section className="card">
        <h2 className="text-2xl font-bold text-white mb-6">Поиск судна</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Введите название или номер судна
            </label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Например: COSCO SHANGHAI или 9234567"
              className="input-field w-full"
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Тип поиска
            </label>
            <select
              value={searchType}
              onChange={(e) => setSearchType(e.target.value as 'name' | 'imo' | 'mmsi')}
              className="select-field w-full"
            >
              <option value="name">Название судна</option>
              <option value="imo">IMO номер</option>
              <option value="mmsi">MMSI номер</option>
            </select>
          </div>
        </div>

        <button
          onClick={handleSearch}
          disabled={isLoading}
          className="btn-primary w-full md:w-auto"
        >
          {isLoading ? 'Поиск...' : 'Найти судно'}
        </button>

        {error && (
          <div className="mt-4 p-4 bg-red-900 border border-red-700 rounded-lg text-red-200">
            {error}
          </div>
        )}
      </section>

      {/* Marine Traffic Map Placeholder */}
      <section className="card">
        <h2 className="text-2xl font-bold text-white mb-6">Карта судов</h2>
        
        <div className="aspect-video bg-gray-800 rounded-lg flex items-center justify-center relative overflow-hidden">
          {/* Placeholder for MarineTraffic integration */}
          <div className="text-center">
            <div className="text-6xl mb-4">🗺️</div>
            <h3 className="text-xl font-semibold text-white mb-2">Интерактивная карта MarineTraffic</h3>
            <p className="text-gray-400 max-w-md">
              Здесь будет интегрирована карта MarineTraffic для отслеживания судов в реальном времени.
              Функция находится в разработке.
            </p>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute top-4 left-4 bg-bearplus-green text-black px-3 py-1 rounded text-sm font-medium">
            LIVE
          </div>
          <div className="absolute bottom-4 right-4 text-gray-500 text-xs">
            Powered by MarineTraffic
          </div>
        </div>
      </section>

      {/* Vessel Information */}
      {vesselInfo && (
        <section className="card">
          <h2 className="text-2xl font-bold text-white mb-6">Информация о судне</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Basic Information */}
            <div>
              <h3 className="text-lg font-semibold text-bearplus-green mb-4">Основная информация</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Название:</span>
                  <span className="text-white font-medium">{vesselInfo.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">IMO номер:</span>
                  <span className="text-white">{vesselInfo.imo}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">MMSI:</span>
                  <span className="text-white">{vesselInfo.mmsi}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Позывной:</span>
                  <span className="text-white">{vesselInfo.callSign}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Флаг:</span>
                  <span className="text-white">{vesselInfo.flag}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Тип судна:</span>
                  <span className="text-white">{vesselInfo.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Год постройки:</span>
                  <span className="text-white">{vesselInfo.yearBuilt}</span>
                </div>
              </div>
            </div>

            {/* Technical Specifications */}
            <div>
              <h3 className="text-lg font-semibold text-bearplus-green mb-4">Технические характеристики</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Длина:</span>
                  <span className="text-white">{vesselInfo.length} м</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Ширина:</span>
                  <span className="text-white">{vesselInfo.beam} м</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Дедвейт:</span>
                  <span className="text-white">{vesselInfo.dwt.toLocaleString()} т</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Статус:</span>
                  <span className="text-bearplus-green">{vesselInfo.status}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Пункт назначения:</span>
                  <span className="text-white">{vesselInfo.destination}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">ETA:</span>
                  <span className="text-white">{vesselInfo.eta}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Current Position and Movement */}
          <div className="mt-8 grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-bearplus-green mb-4">Текущее положение</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Координаты:</span>
                  <span className="text-white">{formatPosition(vesselInfo.position.lat, vesselInfo.position.lng)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Скорость:</span>
                  <span className="text-white">{vesselInfo.speed} узлов</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Курс:</span>
                  <span className="text-white">{vesselInfo.course}°</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Последнее обновление:</span>
                  <span className="text-white">{vesselInfo.lastUpdate}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-bearplus-green mb-4">Дополнительная информация</h3>
              <div className="space-y-3">
                <button className="w-full btn-secondary text-left">
                  📍 Показать на карте
                </button>
                <button className="w-full btn-secondary text-left">
                  📊 История движения
                </button>
                <button className="w-full btn-secondary text-left">
                  📧 Настроить уведомления
                </button>
                <button className="w-full btn-secondary text-left">
                  📋 Подробная информация
                </button>
              </div>
            </div>
          </div>

          {/* Movement Visualization */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-bearplus-green mb-4">Движение судна</h3>
            <div className="bg-bearplus-card-dark p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="text-center">
                  <div className="w-4 h-4 bg-blue-500 rounded-full mx-auto mb-2"></div>
                  <div className="text-sm text-white font-medium">Текущее положение</div>
                  <div className="text-xs text-gray-400">{formatPosition(vesselInfo.position.lat, vesselInfo.position.lng)}</div>
                </div>
                
                <div className="flex-1 mx-4">
                  <div className="h-1 bg-gradient-to-r from-blue-500 to-bearplus-green rounded-full relative">
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-xs text-white bg-black px-2 py-1 rounded">
                      {vesselInfo.speed} уз
                    </div>
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="w-4 h-4 bg-bearplus-green rounded-full mx-auto mb-2"></div>
                  <div className="text-sm text-white font-medium">{vesselInfo.destination}</div>
                  <div className="text-xs text-gray-400">ETA: {vesselInfo.eta}</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Quick Search Examples */}
      <section className="card">
        <h2 className="text-2xl font-bold text-white mb-6">Популярные поисковые запросы</h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          <button
            onClick={() => {setSearchQuery('COSCO SHANGHAI'); setSearchType('name');}}
            className="p-4 bg-bearplus-card-dark rounded-lg hover:bg-gray-700 transition-colors text-left"
          >
            <div className="text-bearplus-green font-medium mb-1">COSCO SHANGHAI</div>
            <div className="text-gray-400 text-sm">Контейнеровоз</div>
          </button>
          
          <button
            onClick={() => {setSearchQuery('MSC MEDITERRANEAN'); setSearchType('name');}}
            className="p-4 bg-bearplus-card-dark rounded-lg hover:bg-gray-700 transition-colors text-left"
          >
            <div className="text-bearplus-green font-medium mb-1">MSC MEDITERRANEAN</div>
            <div className="text-gray-400 text-sm">Контейнеровоз</div>
          </button>
          
          <button
            onClick={() => {setSearchQuery('9234567'); setSearchType('imo');}}
            className="p-4 bg-bearplus-card-dark rounded-lg hover:bg-gray-700 transition-colors text-left"
          >
            <div className="text-bearplus-green font-medium mb-1">IMO: 9234567</div>
            <div className="text-gray-400 text-sm">Поиск по IMO номеру</div>
          </button>
        </div>
      </section>

      {/* Information Block */}
      <section className="card bg-gradient-to-r from-blue-900/20 to-bearplus-green/10 border-bearplus-green/30">
        <div className="text-center">
          <h3 className="text-xl font-bold text-white mb-3">Возможности системы отслеживания</h3>
          <div className="grid md:grid-cols-3 gap-6 mt-6">
            <div className="text-center">
              <div className="text-3xl mb-2">🌐</div>
              <h4 className="font-semibold text-white mb-2">Глобальное покрытие</h4>
              <p className="text-gray-300 text-sm">Отслеживание судов по всему миру в режиме реального времени</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">📊</div>
              <h4 className="font-semibold text-white mb-2">Детальная информация</h4>
              <p className="text-gray-300 text-sm">Полная техническая информация о судне и его текущем статусе</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">🔔</div>
              <h4 className="font-semibold text-white mb-2">Уведомления</h4>
              <p className="text-gray-300 text-sm">Автоматические уведомления о прибытии и изменении статуса</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ShipTrackingPage;