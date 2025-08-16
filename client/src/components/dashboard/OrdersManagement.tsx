import * as React from 'react';
import { useState, useEffect } from 'react';
import { useAppSelector } from '../../hooks/redux';

interface Order {
  id: string;
  orderNumber: string;
  status: 'pending' | 'confirmed' | 'in_transit' | 'delivered' | 'cancelled';
  transportType: 'freight' | 'auto' | 'railway';
  route: {
    departure: string;
    arrival: string;
  };
  cargo: {
    description: string;
    weight: number;
    containerType: string;
    isDangerous: boolean;
  };
  dates: {
    created: string;
    estimatedDeparture?: string;
    estimatedArrival?: string;
    actualDeparture?: string;
    actualArrival?: string;
  };
  tracking?: {
    currentLocation: string;
    vesselName?: string;
    vesselIMO?: string;
    lastUpdate: string;
  };
  cost: {
    total: number;
    currency: string;
    paid: boolean;
  };
  documents: Array<{
    id: string;
    name: string;
    type: string;
    uploadedAt: string;
  }>;
  stages: Array<{
    id: string;
    name: string;
    status: 'pending' | 'in_progress' | 'completed' | 'requires_confirmation';
    description: string;
    completedAt?: string;
    requiresClientConfirmation: boolean;
  }>;
}

const OrdersManagement: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateOrder, setShowCreateOrder] = useState(false);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      // Mock data - replace with API call
      const mockOrders: Order[] = [
        {
          id: '1',
          orderNumber: 'ORD-2024-001',
          status: 'in_transit',
          transportType: 'freight',
          route: {
            departure: 'Москва',
            arrival: 'Шанхай'
          },
          cargo: {
            description: 'Промышленное оборудование',
            weight: 15000,
            containerType: '40ft',
            isDangerous: false
          },
          dates: {
            created: '2024-01-15T10:00:00Z',
            estimatedDeparture: '2024-01-20T08:00:00Z',
            estimatedArrival: '2024-02-25T14:00:00Z',
            actualDeparture: '2024-01-20T09:30:00Z'
          },
          tracking: {
            currentLocation: 'Порт Шанхай',
            vesselName: 'MSC MAYA',
            vesselIMO: 'IMO9876543',
            lastUpdate: '2024-01-16T12:00:00Z'
          },
          cost: {
            total: 125000,
            currency: 'RUB',
            paid: true
          },
          documents: [
            { id: '1', name: 'Commercial_Invoice.pdf', type: 'invoice', uploadedAt: '2024-01-15T10:30:00Z' },
            { id: '2', name: 'Packing_List.pdf', type: 'packing_list', uploadedAt: '2024-01-15T10:35:00Z' }
          ],
          stages: [
            { id: '1', name: 'Подача документов', status: 'completed', description: 'Документы поданы и проверены', completedAt: '2024-01-15T12:00:00Z', requiresClientConfirmation: false },
            { id: '2', name: 'Бронирование места', status: 'completed', description: 'Место на судне забронировано', completedAt: '2024-01-16T10:00:00Z', requiresClientConfirmation: false },
            { id: '3', name: 'Погрузка', status: 'completed', description: 'Груз погружен на судно', completedAt: '2024-01-20T10:00:00Z', requiresClientConfirmation: false },
            { id: '4', name: 'Отправление', status: 'in_progress', description: 'Судно в пути', requiresClientConfirmation: false },
            { id: '5', name: 'Прибытие', status: 'pending', description: 'Ожидается прибытие в порт назначения', requiresClientConfirmation: false },
            { id: '6', name: 'Выгрузка', status: 'pending', description: 'Выгрузка груза в порту', requiresClientConfirmation: true }
          ]
        },
        {
          id: '2',
          orderNumber: 'ORD-2024-002',
          status: 'pending',
          transportType: 'auto',
          route: {
            departure: 'СПб',
            arrival: 'Хельсинки'
          },
          cargo: {
            description: 'Текстильная продукция',
            weight: 2500,
            containerType: 'truck',
            isDangerous: false
          },
          dates: {
            created: '2024-01-16T14:00:00Z',
            estimatedDeparture: '2024-01-18T06:00:00Z',
            estimatedArrival: '2024-01-18T18:00:00Z'
          },
          cost: {
            total: 45000,
            currency: 'RUB',
            paid: false
          },
          documents: [],
          stages: [
            { id: '1', name: 'Подтверждение заявки', status: 'requires_confirmation', description: 'Требуется подтверждение условий доставки', requiresClientConfirmation: true },
            { id: '2', name: 'Подготовка документов', status: 'pending', description: 'Подготовка документов для перевозки', requiresClientConfirmation: false },
            { id: '3', name: 'Забор груза', status: 'pending', description: 'Забор груза у отправителя', requiresClientConfirmation: false },
            { id: '4', name: 'Доставка', status: 'pending', description: 'Доставка до места назначения', requiresClientConfirmation: false }
          ]
        }
      ];

      setTimeout(() => {
        setOrders(mockOrders);
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-600';
      case 'confirmed': return 'bg-blue-600';
      case 'in_transit': return 'bg-bearplus-green';
      case 'delivered': return 'bg-green-600';
      case 'cancelled': return 'bg-red-600';
      default: return 'bg-gray-600';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return 'Ожидает';
      case 'confirmed': return 'Подтверждена';
      case 'in_transit': return 'В пути';
      case 'delivered': return 'Доставлена';
      case 'cancelled': return 'Отменена';
      default: return status;
    }
  };

  const getStageStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-400';
      case 'in_progress': return 'text-bearplus-green';
      case 'requires_confirmation': return 'text-yellow-400';
      case 'pending': return 'text-gray-500';
      default: return 'text-gray-500';
    }
  };

  const filteredOrders = orders.filter(order => {
    if (filter === 'active') return ['pending', 'confirmed', 'in_transit'].includes(order.status);
    if (filter === 'completed') return ['delivered', 'cancelled'].includes(order.status);
    return true;
  });

  const confirmStage = async (orderId: string, stageId: string) => {
    try {
      // API call to confirm stage
      console.log('Confirming stage:', orderId, stageId);
      
      // Update local state
      setOrders(prev => prev.map(order => {
        if (order.id === orderId) {
          return {
            ...order,
            stages: order.stages.map(stage => 
              stage.id === stageId 
                ? { ...stage, status: 'completed' as const, completedAt: new Date().toISOString() }
                : stage
            )
          };
        }
        return order;
      }));
    } catch (error) {
      console.error('Error confirming stage:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-white text-xl">Загрузка заявок...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Управление заявками</h2>
        <button
          onClick={() => setShowCreateOrder(true)}
          className="btn-primary"
        >
          Создать заявку
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {[
          { key: 'all', label: 'Все заявки' },
          { key: 'active', label: 'Активные' },
          { key: 'completed', label: 'Завершенные' }
        ].map((filterOption) => (
          <button
            key={filterOption.key}
            onClick={() => setFilter(filterOption.key as any)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              filter === filterOption.key
                ? 'bg-bearplus-green text-black'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            {filterOption.label}
          </button>
        ))}
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.map((order) => (
          <div
            key={order.id}
            className="card hover:shadow-glow-sm transition-all duration-300 cursor-pointer"
            onClick={() => setSelectedOrder(order)}
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">
                  Заявка {order.orderNumber}
                </h3>
                <p className="text-gray-300 text-sm">
                  {order.route.departure} → {order.route.arrival}
                </p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium text-white ${getStatusColor(order.status)}`}>
                {getStatusLabel(order.status)}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-gray-400">Груз:</span>
                <div className="text-white">{order.cargo.description}</div>
                <div className="text-gray-500">{order.cargo.weight} кг</div>
              </div>
              <div>
                <span className="text-gray-400">Транспорт:</span>
                <div className="text-white capitalize">{order.transportType}</div>
                <div className="text-gray-500">{order.cargo.containerType}</div>
              </div>
              <div>
                <span className="text-gray-400">Стоимость:</span>
                <div className="text-white">{order.cost.total.toLocaleString()} {order.cost.currency}</div>
                <div className={`text-xs ${order.cost.paid ? 'text-green-400' : 'text-yellow-400'}`}>
                  {order.cost.paid ? 'Оплачено' : 'К оплате'}
                </div>
              </div>
            </div>

            {order.tracking && (
              <div className="mt-4 p-3 bg-bearplus-card-dark rounded-lg">
                <div className="text-sm">
                  <span className="text-gray-400">Текущее местоположение:</span>
                  <span className="text-bearplus-green ml-2">{order.tracking.currentLocation}</span>
                </div>
                {order.tracking.vesselName && (
                  <div className="text-xs text-gray-500 mt-1">
                    Судно: {order.tracking.vesselName} (IMO: {order.tracking.vesselIMO})
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={() => setSelectedOrder(null)}>
          <div className="bg-bearplus-card-dark rounded-xl p-6 w-full max-w-4xl max-h-[80vh] overflow-y-auto border border-gray-700" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white">Заявка {selectedOrder.orderNumber}</h3>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Order Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-4">
                <div>
                  <h4 className="text-lg font-semibold text-bearplus-green mb-2">Информация о грузе</h4>
                  <div className="space-y-2 text-sm">
                    <div><span className="text-gray-400">Описание:</span> {selectedOrder.cargo.description}</div>
                    <div><span className="text-gray-400">Вес:</span> {selectedOrder.cargo.weight} кг</div>
                    <div><span className="text-gray-400">Тип контейнера:</span> {selectedOrder.cargo.containerType}</div>
                    <div><span className="text-gray-400">Опасный груз:</span> {selectedOrder.cargo.isDangerous ? 'Да' : 'Нет'}</div>
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-bearplus-green mb-2">Даты</h4>
                  <div className="space-y-2 text-sm">
                    <div><span className="text-gray-400">Создана:</span> {new Date(selectedOrder.dates.created).toLocaleDateString('ru-RU')}</div>
                    {selectedOrder.dates.estimatedDeparture && (
                      <div><span className="text-gray-400">Плановая отправка:</span> {new Date(selectedOrder.dates.estimatedDeparture).toLocaleDateString('ru-RU')}</div>
                    )}
                    {selectedOrder.dates.estimatedArrival && (
                      <div><span className="text-gray-400">Плановое прибытие:</span> {new Date(selectedOrder.dates.estimatedArrival).toLocaleDateString('ru-RU')}</div>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-bearplus-green mb-2">Этапы выполнения</h4>
                <div className="space-y-3">
                  {selectedOrder.stages.map((stage, index) => (
                    <div key={stage.id} className="flex items-start">
                      <div className="flex flex-col items-center mr-3">
                        <div className={`w-3 h-3 rounded-full ${
                          stage.status === 'completed' ? 'bg-green-400' :
                          stage.status === 'in_progress' ? 'bg-bearplus-green' :
                          stage.status === 'requires_confirmation' ? 'bg-yellow-400' :
                          'bg-gray-500'
                        }`}></div>
                        {index < selectedOrder.stages.length - 1 && (
                          <div className="w-0.5 h-8 bg-gray-600 mt-1"></div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className={`font-medium ${getStageStatusColor(stage.status)}`}>
                              {stage.name}
                            </div>
                            <div className="text-gray-400 text-xs">{stage.description}</div>
                            {stage.completedAt && (
                              <div className="text-gray-500 text-xs mt-1">
                                Завершено: {new Date(stage.completedAt).toLocaleDateString('ru-RU')}
                              </div>
                            )}
                          </div>
                          {stage.status === 'requires_confirmation' && (
                            <button
                              onClick={() => confirmStage(selectedOrder.id, stage.id)}
                              className="btn-secondary text-xs px-3 py-1"
                            >
                              Подтвердить
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Documents */}
            <div>
              <h4 className="text-lg font-semibold text-bearplus-green mb-2">Документы</h4>
              {selectedOrder.documents.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {selectedOrder.documents.map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between p-2 bg-gray-700 rounded">
                      <span className="text-white text-sm">{doc.name}</span>
                      <button className="text-bearplus-green hover:text-bearplus-green/80 text-sm">
                        Скачать
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-gray-400 text-sm">Документы не загружены</div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Create Order Modal placeholder */}
      {showCreateOrder && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={() => setShowCreateOrder(false)}>
          <div className="bg-bearplus-card-dark rounded-xl p-6 w-full max-w-2xl border border-gray-700" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-white mb-4">Создание новой заявки</h3>
            <p className="text-gray-300 mb-4">Используйте калькулятор доставки для создания заявки</p>
            <div className="flex gap-4">
              <button
                onClick={() => {
                  setShowCreateOrder(false);
                  // Switch to calculator tab - would need to pass callback up
                }}
                className="btn-primary"
              >
                Перейти к калькулятору
              </button>
              <button
                onClick={() => setShowCreateOrder(false)}
                className="btn-secondary"
              >
                Отмена
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersManagement;