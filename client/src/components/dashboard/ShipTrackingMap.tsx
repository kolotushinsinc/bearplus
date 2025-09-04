import * as React from 'react';
import { useState, useEffect } from 'react';
import { useAppSelector } from '../../hooks/redux';

interface Vessel {
  id: string;
  name: string;
  imo: string;
  mmsi: string;
  type: 'container' | 'bulk' | 'tanker' | 'ro-ro' | 'general';
  flag: string;
  position: {
    latitude: number;
    longitude: number;
    heading: number;
    speed: number;
  };
  destination: string;
  eta: string;
  status: 'underway' | 'anchored' | 'moored' | 'loading' | 'discharging';
  lastUpdate: string;
}

interface Cargo {
  id: string;
  orderId: string;
  orderNumber: string;
  vesselId: string;
  vesselName: string;
  description: string;
  origin: {
    port: string;
    country: string;
    coordinates: [number, number];
  };
  destination: {
    port: string;
    country: string;
    coordinates: [number, number];
  };
  status: 'loading' | 'in_transit' | 'discharged' | 'delivered';
  departureDate?: string;
  arrivalDate?: string;
  estimatedArrival: string;
  progress: number; // 0-100%
}

interface Port {
  id: string;
  name: string;
  country: string;
  coordinates: [number, number];
  type: 'major' | 'regional' | 'local';
}

const ShipTrackingMap: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);
  const [vessels, setVessels] = useState<Vessel[]>([]);
  const [cargos, setCargos] = useState<Cargo[]>([]);
  const [ports, setPorts] = useState<Port[]>([]);
  const [selectedCargo, setSelectedCargo] = useState<Cargo | null>(null);
  const [selectedVessel, setSelectedVessel] = useState<Vessel | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [mapView, setMapView] = useState<'world' | 'region'>('world');
  const [trackingFilter, setTrackingFilter] = useState<'all' | 'my_orders'>('my_orders');

  useEffect(() => {
    fetchTrackingData();
    const interval = setInterval(fetchTrackingData, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, [trackingFilter]);

  const fetchTrackingData = async () => {
    try {
      setIsLoading(true);
      
      // Mock data - replace with API calls
      const mockPorts: Port[] = [
        {
          id: 'port1',
          name: 'Порт Санкт-Петербург',
          country: 'Россия',
          coordinates: [59.9311, 30.3609],
          type: 'major'
        },
        {
          id: 'port2',
          name: 'Порт Гамбург',
          country: 'Германия',
          coordinates: [53.5511, 9.9937],
          type: 'major'
        },
        {
          id: 'port3',
          name: 'Порт Шанхай',
          country: 'Китай',
          coordinates: [31.2304, 121.4737],
          type: 'major'
        },
        {
          id: 'port4',
          name: 'Порт Роттердам',
          country: 'Нидерланды',
          coordinates: [51.9244, 4.4777],
          type: 'major'
        }
      ];

      const mockVessels: Vessel[] = [
        {
          id: 'vessel1',
          name: 'MSC GÜLSÜN',
          imo: '9811000',
          mmsi: '636019825',
          type: 'container',
          flag: 'Либерия',
          position: {
            latitude: 55.7558,
            longitude: 15.3731,
            heading: 125,
            speed: 18.5
          },
          destination: 'Порт Санкт-Петербург',
          eta: '2024-01-18T14:00:00Z',
          status: 'underway',
          lastUpdate: '2024-01-16T15:30:00Z'
        },
        {
          id: 'vessel2',
          name: 'EVER GIVEN',
          imo: '9811000',
          mmsi: '353136000',
          type: 'container',
          flag: 'Панама',
          position: {
            latitude: 31.1155,
            longitude: 121.2920,
            heading: 275,
            speed: 0
          },
          destination: 'Порт Роттердам',
          eta: '2024-01-25T08:00:00Z',
          status: 'loading',
          lastUpdate: '2024-01-16T15:25:00Z'
        }
      ];

      const mockCargos: Cargo[] = [
        {
          id: 'cargo1',
          orderId: 'order1',
          orderNumber: 'ORD-2024-001',
          vesselId: 'vessel1',
          vesselName: 'MSC GÜLSÜN',
          description: 'Контейнер 40HC с электроникой',
          origin: {
            port: 'Порт Гамбург',
            country: 'Германия',
            coordinates: [53.5511, 9.9937]
          },
          destination: {
            port: 'Порт Санкт-Петербург',
            country: 'Россия',
            coordinates: [59.9311, 30.3609]
          },
          status: 'in_transit',
          departureDate: '2024-01-15T10:00:00Z',
          estimatedArrival: '2024-01-18T14:00:00Z',
          progress: 65
        },
        {
          id: 'cargo2',
          orderId: 'order2',
          orderNumber: 'ORD-2024-002',
          vesselId: 'vessel2',
          vesselName: 'EVER GIVEN',
          description: 'Партия промышленного оборудования',
          origin: {
            port: 'Порт Шанхай',
            country: 'Китай',
            coordinates: [31.2304, 121.4737]
          },
          destination: {
            port: 'Порт Роттердам',
            country: 'Нидерланды',
            coordinates: [51.9244, 4.4777]
          },
          status: 'loading',
          estimatedArrival: '2024-01-25T08:00:00Z',
          progress: 5
        }
      ];

      setTimeout(() => {
        setPorts(mockPorts);
        setVessels(mockVessels);
        setCargos(mockCargos);
        setIsLoading(false);
      }, 1000);

    } catch (error) {
      console.error('Error fetching tracking data:', error);
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'loading':
        return 'text-yellow-400';
      case 'in_transit':
        return 'text-blue-400';
      case 'discharged':
        return 'text-orange-400';
      case 'delivered':
        return 'text-green-400';
      case 'underway':
        return 'text-blue-400';
      case 'anchored':
        return 'text-yellow-400';
      case 'moored':
        return 'text-gray-400';
      default:
        return 'text-gray-400';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'loading':
        return 'Погрузка';
      case 'in_transit':
        return 'В пути';
      case 'discharged':
        return 'Выгружен';
      case 'delivered':
        return 'Доставлен';
      case 'underway':
        return 'В пути';
      case 'anchored':
        return 'На якоре';
      case 'moored':
        return 'В порту';
      case 'discharging':
        return 'Выгрузка';
      default:
        return status;
    }
  };

  const getVesselIcon = (type: string) => {
    switch (type) {
      case 'container':
        return '🚢';
      case 'bulk':
        return '🚜';
      case 'tanker':
        return '🛢️';
      case 'ro-ro':
        return '🚗';
      default:
        return '⛵';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const calculateDistance = (coord1: [number, number], coord2: [number, number]) => {
    // Simplified distance calculation for display
    const R = 6371; // Earth's radius in km
    const dLat = (coord2[0] - coord1[0]) * Math.PI / 180;
    const dLon = (coord2[1] - coord1[1]) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(coord1[0] * Math.PI / 180) * Math.cos(coord2[0] * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return Math.round(R * c);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-white text-xl">Загрузка данных отслеживания...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className="flex gap-4">
          <select
            value={trackingFilter}
            onChange={(e) => setTrackingFilter(e.target.value as 'all' | 'my_orders')}
            className="input-field"
          >
            <option value="my_orders">Мои заказы</option>
            <option value="all">Все суда</option>
          </select>
          
          <select
            value={mapView}
            onChange={(e) => setMapView(e.target.value as 'world' | 'region')}
            className="input-field"
          >
            <option value="world">Мировая карта</option>
            <option value="region">Региональная карта</option>
          </select>
        </div>

        <button
          onClick={fetchTrackingData}
          className="btn-secondary"
        >
          🔄 Обновить
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map Placeholder */}
        <div className="lg:col-span-2">
          <div className="bg-bearplus-card rounded-lg p-6 h-[500px]">
            <h3 className="text-lg font-semibold text-white mb-4">
              Отслеживание судов и грузов
            </h3>
            
            {/* Map placeholder with position markers */}
            <div className="relative bg-gray-800 rounded-lg h-[430px] overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-gray-400">
                  <div className="text-4xl mb-2">🗺️</div>
                  <p>Интерактивная карта отслеживания</p>
                  <p className="text-sm mt-1">
                    Здесь будет отображаться карта с позициями судов
                  </p>
                </div>
              </div>

              {/* Mock vessel positions */}
              <div className="absolute top-20 left-32 bg-blue-500 text-white px-2 py-1 rounded text-xs cursor-pointer"
                   onClick={() => setSelectedVessel(vessels[0])}>
                🚢 MSC GÜLSÜN
              </div>
              
              <div className="absolute bottom-32 right-24 bg-yellow-500 text-black px-2 py-1 rounded text-xs cursor-pointer"
                   onClick={() => setSelectedVessel(vessels[1])}>
                🚢 EVER GIVEN
              </div>

              {/* Mock ports */}
              {ports.map((port, index) => (
                <div
                  key={port.id}
                  className={`absolute w-3 h-3 bg-bearplus-green rounded-full cursor-pointer ${
                    index === 0 ? 'top-16 left-48' : 
                    index === 1 ? 'top-24 left-40' :
                    index === 2 ? 'bottom-40 right-16' : 'top-28 left-44'
                  }`}
                  title={port.name}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Cargo List */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">Мои грузы</h3>
          
          {cargos.map((cargo) => (
            <div
              key={cargo.id}
              onClick={() => setSelectedCargo(cargo)}
              className={`bg-bearplus-card rounded-lg p-4 cursor-pointer transition-colors ${
                selectedCargo?.id === cargo.id ? 'ring-2 ring-bearplus-green' : 'hover:bg-bearplus-card-hover'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-medium text-white">{cargo.orderNumber}</h4>
                <span className={`text-xs px-2 py-1 rounded ${getStatusColor(cargo.status)}`}>
                  {getStatusText(cargo.status)}
                </span>
              </div>
              
              <p className="text-sm text-gray-400 mb-2">{cargo.description}</p>
              
              <div className="text-xs text-gray-500 space-y-1">
                <div>Судно: {cargo.vesselName}</div>
                <div>
                  {cargo.origin.port} → {cargo.destination.port}
                </div>
                <div>
                  Прибытие: {formatDate(cargo.estimatedArrival)}
                </div>
              </div>

              {/* Progress bar */}
              <div className="mt-3">
                <div className="flex justify-between text-xs text-gray-400 mb-1">
                  <span>Прогресс</span>
                  <span>{cargo.progress}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-bearplus-green h-2 rounded-full transition-all duration-300"
                    style={{ width: `${cargo.progress}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Selected Cargo Details */}
      {selectedCargo && (
        <div className="bg-bearplus-card rounded-lg p-6">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xl font-bold text-white">
              Детали груза {selectedCargo.orderNumber}
            </h3>
            <button
              onClick={() => setSelectedCargo(null)}
              className="text-gray-400 hover:text-white"
            >
              ✕
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <h4 className="text-sm font-medium text-gray-400 mb-2">Описание груза</h4>
              <p className="text-white">{selectedCargo.description}</p>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-400 mb-2">Судно</h4>
              <p className="text-white">{selectedCargo.vesselName}</p>
              <p className="text-xs text-gray-500 mt-1">
                {getVesselIcon(vessels.find(v => v.id === selectedCargo.vesselId)?.type || 'container')}
              </p>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-400 mb-2">Маршрут</h4>
              <p className="text-white text-sm">
                {selectedCargo.origin.port}, {selectedCargo.origin.country}
              </p>
              <div className="text-gray-400 my-1">↓</div>
              <p className="text-white text-sm">
                {selectedCargo.destination.port}, {selectedCargo.destination.country}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                ~{calculateDistance(selectedCargo.origin.coordinates, selectedCargo.destination.coordinates)} км
              </p>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-400 mb-2">Временные рамки</h4>
              {selectedCargo.departureDate && (
                <div className="text-sm">
                  <span className="text-gray-400">Отправлен:</span>
                  <br />
                  <span className="text-white">{formatDate(selectedCargo.departureDate)}</span>
                </div>
              )}
              <div className="text-sm mt-2">
                <span className="text-gray-400">Ожидаемое прибытие:</span>
                <br />
                <span className="text-white">{formatDate(selectedCargo.estimatedArrival)}</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-700">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(selectedCargo.status)}`}>
                  {getStatusText(selectedCargo.status)}
                </span>
                <span className="text-gray-400">Прогресс: {selectedCargo.progress}%</span>
              </div>
              
              <div className="flex gap-2">
                <button className="btn-secondary text-sm">
                  📍 Показать на карте
                </button>
                <button className="btn-primary text-sm">
                  📄 Документы
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Selected Vessel Details */}
      {selectedVessel && (
        <div className="bg-bearplus-card rounded-lg p-6">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xl font-bold text-white">
              Информация о судне {selectedVessel.name}
            </h3>
            <button
              onClick={() => setSelectedVessel(null)}
              className="text-gray-400 hover:text-white"
            >
              ✕
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <h4 className="text-sm font-medium text-gray-400 mb-2">Основная информация</h4>
              <p className="text-white">{selectedVessel.name}</p>
              <p className="text-sm text-gray-400">IMO: {selectedVessel.imo}</p>
              <p className="text-sm text-gray-400">MMSI: {selectedVessel.mmsi}</p>
              <p className="text-sm text-gray-400">Флаг: {selectedVessel.flag}</p>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-400 mb-2">Текущее положение</h4>
              <p className="text-white">
                {selectedVessel.position.latitude.toFixed(4)}°N
              </p>
              <p className="text-white">
                {selectedVessel.position.longitude.toFixed(4)}°E
              </p>
              <p className="text-sm text-gray-400">
                Курс: {selectedVessel.position.heading}°
              </p>
              <p className="text-sm text-gray-400">
                Скорость: {selectedVessel.position.speed} узлов
              </p>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-400 mb-2">Статус и назначение</h4>
              <span className={`px-2 py-1 rounded text-sm ${getStatusColor(selectedVessel.status)}`}>
                {getStatusText(selectedVessel.status)}
              </span>
              <p className="text-white mt-2">{selectedVessel.destination}</p>
              <p className="text-sm text-gray-400">
                ETA: {formatDate(selectedVessel.eta)}
              </p>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-400 mb-2">Тип судна</h4>
              <p className="text-white">
                {getVesselIcon(selectedVessel.type)} {selectedVessel.type}
              </p>
              <p className="text-sm text-gray-400 mt-2">
                Обновлено: {formatDate(selectedVessel.lastUpdate)}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShipTrackingMap;