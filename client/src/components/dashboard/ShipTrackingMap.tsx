import * as React from 'react';
import { useState, useEffect } from 'react';
import { useAppSelector } from '../../hooks/redux';

interface Vessel {
  id: string;
  name: string;
  imo: string;
  type: 'container' | 'bulk' | 'tanker' | 'general';
  flag: string;
  position: {
    lat: number;
    lng: number;
  };
  speed: number; // knots
  course: number; // degrees
  destination: string;
  eta: string;
  lastUpdate: string;
  orderId?: string;
  route: Array<{
    lat: number;
    lng: number;
    timestamp: string;
    port?: string;
  }>;
  status: 'sailing' | 'anchored' | 'moored' | 'fishing' | 'not_under_command';
}

interface Port {
  id: string;
  name: string;
  code: string;
  country: string;
  position: {
    lat: number;
    lng: number;
  };
}

const ShipTrackingMap: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);
  const [vessels, setVessels] = useState<Vessel[]>([]);
  const [ports, setPorts] = useState<Port[]>([]);
  const [selectedVessel, setSelectedVessel] = useState<Vessel | null>(null);
  const [filter, setFilter] = useState<'all' | 'my_orders' | 'nearby'>('my_orders');
  const [isLoading, setIsLoading] = useState(true);
  const [mapCenter, setMapCenter] = useState({ lat: 55.7558, lng: 37.6176 }); // Moscow
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadVesselsAndPorts();
    
    // Simulate real-time updates
    const interval = setInterval(() => {
      updateVesselPositions();
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const loadVesselsAndPorts = async () => {
    try {
      setIsLoading(true);

      // Mock data
      const mockPorts: Port[] = [
        {
          id: 'RUMMW',
          name: 'Мурманск',
          code: 'RUMMW',
          country: 'Russia',
          position: { lat: 68.9585, lng: 33.0827 }
        },
        {
          id: 'RULED',
          name: 'Санкт-Петербург',
          code: 'RULED',
          country: 'Russia',
          position: { lat: 59.9311, lng: 30.3609 }
        },
        {
          id: 'CNSHA',
          name: 'Шанхай',
          code: 'CNSHA',
          country: 'China',
          position: { lat: 31.2304, lng: 121.4737 }
        },
        {
          id: 'DEHAM',
          name: 'Гамбург',
          code: 'DEHAM',
          country: 'Germany',
          position: { lat: 53.5511, lng: 9.9937 }
        }
      ];

      const mockVessels: Vessel[] = [
        {
          id: '1',
          name: 'MSC MAYA',
          imo: 'IMO9876543',
          type: 'container',
          flag: 'Panama',
          position: { lat: 45.2671, lng: 19.8335 },
          speed: 18.5,
          course: 127,
          destination: 'Shanghai',
          eta: '2024-02-25T14:00:00Z',
          lastUpdate: '2024-01-16T12:00:00Z',
          orderId: 'ORD-2024-001',
          route: [
            { lat: 59.9311, lng: 30.3609, timestamp: '2024-01-20T09:30:00Z', port: 'St. Petersburg' },
            { lat: 58.2671, lng: 25.8335, timestamp: '2024-01-21T14:00:00Z' },
            { lat: 55.2671, lng: 20.8335, timestamp: '2024-01-22T08:00:00Z' },
            { lat: 45.2671, lng: 19.8335, timestamp: '2024-01-23T12:00:00Z' }
          ],
          status: 'sailing'
        },
        {
          id: '2',
          name: 'COSCO SHIPPING',
          imo: 'IMO9765432',
          type: 'container',
          flag: 'China',
          position: { lat: 32.0668, lng: 118.7778 },
          speed: 22.1,
          course: 95,
          destination: 'Hamburg',
          eta: '2024-02-10T16:00:00Z',
          lastUpdate: '2024-01-16T11:45:00Z',
          route: [
            { lat: 31.2304, lng: 121.4737, timestamp: '2024-01-10T06:00:00Z', port: 'Shanghai' },
            { lat: 32.0668, lng: 118.7778, timestamp: '2024-01-16T11:45:00Z' }
          ],
          status: 'sailing'
        },
        {
          id: '3',
          name: 'MAERSK LINE',
          imo: 'IMO9654321',
          type: 'container',
          flag: 'Denmark',
          position: { lat: 53.5511, lng: 9.9937 },
          speed: 0,
          course: 0,
          destination: 'Hamburg',
          eta: '2024-01-17T08:00:00Z',
          lastUpdate: '2024-01-16T15:20:00Z',
          route: [
            { lat: 53.5511, lng: 9.9937, timestamp: '2024-01-16T15:20:00Z', port: 'Hamburg' }
          ],
          status: 'moored'
        }
      ];

      setTimeout(() => {
        setPorts(mockPorts);
        setVessels(mockVessels);
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error loading vessels and ports:', error);
      setIsLoading(false);
    }
  };

  const updateVesselPositions = () => {
    setVessels(prev => prev.map(vessel => {
      if (vessel.status === 'sailing') {
        // Simulate movement based on speed and course
        const speedKmh = vessel.speed * 1.852; // Convert knots to km/h
        const distanceKm = speedKmh * (30 / 3600); // Distance in 30 seconds
        
        // Simple approximation for new position
        const deltaLat = (distanceKm / 111) * Math.cos(vessel.course * Math.PI / 180);
        const deltaLng = (distanceKm / (111 * Math.cos(vessel.position.lat * Math.PI / 180))) * Math.sin(vessel.course * Math.PI / 180);
        
        return {
          ...vessel,
          position: {
            lat: vessel.position.lat + deltaLat,
            lng: vessel.position.lng + deltaLng
          },
          lastUpdate: new Date().toISOString()
        };
      }
      return vessel;
    }));
  };

  const getVesselIcon = (type: string, status: string) => {
    const icons = {
      container: status === 'moored' ? '🚢' : '⛴️',
      bulk: '🚛',
      tanker: '🛢️',
      general: '🚚'
    };
    return icons[type as keyof typeof icons] || '🚢';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sailing': return 'text-green-400';
      case 'anchored': return 'text-yellow-400';
      case 'moored': return 'text-blue-400';
      case 'fishing': return 'text-purple-400';
      case 'not_under_command': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'sailing': return 'В пути';
      case 'anchored': return 'На якоре';
      case 'moored': return 'Пришвартовано';
      case 'fishing': return 'Рыболовство';
      case 'not_under_command': return 'Не управляется';
      default: return status;
    }
  };

  const filteredVessels = vessels.filter(vessel => {
    const matchesSearch = vessel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         vessel.imo.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         vessel.destination.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!matchesSearch) return false;

    switch (filter) {
      case 'my_orders':
        return vessel.orderId !== undefined;
      case 'nearby':
        // Simple proximity check (within 500km of Moscow for demo)
        const distance = Math.sqrt(
          Math.pow((vessel.position.lat - mapCenter.lat) * 111, 2) +
          Math.pow((vessel.position.lng - mapCenter.lng) * 111 * Math.cos(mapCenter.lat * Math.PI / 180), 2)
        );
        return distance <= 500;
      case 'all':
      default:
        return true;
    }
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-white text-xl">Загрузка карты...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Судовая карта</h2>
        <div className="flex gap-4 items-center">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Поиск судна или порта..."
            className="input-field w-64"
          />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            className="select-field"
          >
            <option value="my_orders">Мои заявки</option>
            <option value="all">Все суда</option>
            <option value="nearby">Рядом</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
        {/* Vessels List */}
        <div className="lg:col-span-1">
          <div className="card h-full">
            <h3 className="text-lg font-semibold text-white mb-4">
              Суда ({filteredVessels.length})
            </h3>
            <div className="space-y-3 overflow-y-auto max-h-[500px]">
              {filteredVessels.map((vessel) => (
                <div
                  key={vessel.id}
                  onClick={() => setSelectedVessel(vessel)}
                  className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 ${
                    selectedVessel?.id === vessel.id
                      ? 'border-bearplus-green bg-bearplus-green/10'
                      : 'border-gray-600 hover:border-gray-500 bg-gray-700/50'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center">
                      <span className="text-xl mr-2">{getVesselIcon(vessel.type, vessel.status)}</span>
                      <div>
                        <h4 className="font-medium text-white text-sm">{vessel.name}</h4>
                        <p className="text-xs text-gray-400">{vessel.imo}</p>
                      </div>
                    </div>
                    {vessel.orderId && (
                      <span className="text-xs bg-bearplus-green text-black px-2 py-1 rounded">
                        {vessel.orderId}
                      </span>
                    )}
                  </div>

                  <div className="text-xs space-y-1">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Статус:</span>
                      <span className={getStatusColor(vessel.status)}>
                        {getStatusLabel(vessel.status)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Скорость:</span>
                      <span className="text-white">{vessel.speed} узлов</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Пункт назначения:</span>
                      <span className="text-white">{vessel.destination}</span>
                    </div>
                    {vessel.eta && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">ETA:</span>
                        <span className="text-white">
                          {new Date(vessel.eta).toLocaleDateString('ru-RU')}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {filteredVessels.length === 0 && (
                <div className="text-center py-8 text-gray-400">
                  <div className="text-4xl mb-2">🗺️</div>
                  <div>Суда не найдены</div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Map Placeholder */}
        <div className="lg:col-span-2">
          <div className="card h-full relative">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-blue-600/20 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl mb-4">🗺️</div>
                <h3 className="text-xl font-bold text-white mb-2">Интерактивная карта</h3>
                <p className="text-gray-300 mb-4">
                  Здесь будет отображаться интерактивная карта с судами в реальном времени
                </p>
                <div className="text-sm text-gray-400">
                  Интеграция с Google Maps / OpenStreetMap в разработке
                </div>
              </div>
            </div>

            {/* Map Controls */}
            <div className="absolute top-4 right-4 space-y-2">
              <button className="bg-white/10 backdrop-blur-sm text-white p-2 rounded hover:bg-white/20 transition-colors">
                🔍+
              </button>
              <button className="bg-white/10 backdrop-blur-sm text-white p-2 rounded hover:bg-white/20 transition-colors">
                🔍-
              </button>
              <button className="bg-white/10 backdrop-blur-sm text-white p-2 rounded hover:bg-white/20 transition-colors">
                📍
              </button>
            </div>

            {/* Legend */}
            <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-sm text-white p-3 rounded-lg text-xs">
              <h4 className="font-medium mb-2">Легенда</h4>
              <div className="space-y-1">
                <div className="flex items-center">
                  <span className="mr-2">⛴️</span>
                  <span>Контейнеровоз в пути</span>
                </div>
                <div className="flex items-center">
                  <span className="mr-2">🚢</span>
                  <span>Судно в порту</span>
                </div>
                <div className="flex items-center">
                  <span className="mr-2">📍</span>
                  <span>Порт</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Selected Vessel Details */}
      {selectedVessel && (
        <div className="card">
          <h3 className="text-lg font-semibold text-white mb-4">
            Детали судна: {selectedVessel.name}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">IMO номер</label>
              <div className="text-white">{selectedVessel.imo}</div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Флаг</label>
              <div className="text-white">{selectedVessel.flag}</div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Тип судна</label>
              <div className="text-white capitalize">{selectedVessel.type}</div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Текущий статус</label>
              <div className={getStatusColor(selectedVessel.status)}>
                {getStatusLabel(selectedVessel.status)}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Скорость</label>
              <div className="text-white">{selectedVessel.speed} узлов</div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Курс</label>
              <div className="text-white">{selectedVessel.course}°</div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Пункт назначения</label>
              <div className="text-white">{selectedVessel.destination}</div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Расчетное время прибытия</label>
              <div className="text-white">
                {new Date(selectedVessel.eta).toLocaleString('ru-RU')}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Текущие координаты</label>
              <div className="text-white">
                {selectedVessel.position.lat.toFixed(4)}°, {selectedVessel.position.lng.toFixed(4)}°
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Последнее обновление</label>
              <div className="text-white">
                {new Date(selectedVessel.lastUpdate).toLocaleString('ru-RU')}
              </div>
            </div>
          </div>

          {selectedVessel.orderId && (
            <div className="mt-4 p-3 bg-bearplus-green/10 border border-bearplus-green/30 rounded-lg">
              <div className="text-bearplus-green font-medium">
                Связанная заявка: {selectedVessel.orderId}
              </div>
              <div className="text-sm text-gray-300 mt-1">
                Это судно перевозит ваш груз
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ShipTrackingMap;