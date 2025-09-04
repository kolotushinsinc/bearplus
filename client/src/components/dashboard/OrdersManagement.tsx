import * as React from 'react';
import { useState, useEffect } from 'react';
import { useAppSelector } from '../../hooks/redux';
import { apiService } from '../../services/apiService';

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
      const response = await apiService.orders.getOrders({
        status: filter === 'all' ? undefined : filter,
        page: 1,
        limit: 20
      });
      
      if (response.success) {
        setOrders(response.data || []);
      } else {
        console.error('Failed to fetch orders:', response);
        setOrders([]);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      setOrders([]);
    } finally {
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
      const response = await apiService.orders.confirmStage(orderId, stageId);
      
      if (response.success) {
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
      } else {
        alert('Ошибка при подтверждении этапа: ' + response.message);
      }
    } catch (error) {
      console.error('Error confirming stage:', error);
      alert('Ошибка при подтверждении этапа');
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
    <div className="space-y-8 animate-fade-in">
      {/* Modern Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-tech-primary/10 rounded-xl border border-tech-primary/20">
            <span className="text-2xl">📋</span>
          </div>
          <div>
            <h2 className="text-tech-title">Управление заявками</h2>
            <p className="text-tech-caption">Отслеживайте статус ваших грузов</p>
          </div>
        </div>
        <button
          onClick={() => setShowCreateOrder(true)}
          className="btn-primary btn-sm"
        >
          ➕ Создать заявку
        </button>
      </div>

      {/* Modern Filters */}
      <div className="filter-bar">
        {[
          { key: 'all', label: 'Все заявки', icon: '📊' },
          { key: 'active', label: 'Активные', icon: '🔄' },
          { key: 'completed', label: 'Завершенные', icon: '✅' }
        ].map((filterOption) => (
          <button
            key={filterOption.key}
            onClick={() => setFilter(filterOption.key as any)}
            className={`filter-btn flex items-center gap-2 ${
              filter === filterOption.key ? 'active' : ''
            }`}
          >
            <span className="text-xs">{filterOption.icon}</span>
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

      {/* Modern Create Order Modal */}
      {showCreateOrder && (
        <div className="fixed inset-0 modal-backdrop z-50 flex items-center justify-center p-4" onClick={() => setShowCreateOrder(false)}>
          <div className="modal-content p-8 w-full max-w-lg animate-fade-in" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-tech-primary/10 rounded-xl border border-tech-primary/20">
                <span className="text-2xl">➕</span>
              </div>
              <div>
                <h3 className="text-tech-title">Создание новой заявки</h3>
                <p className="text-tech-caption">Используйте калькулятор доставки</p>
              </div>
            </div>
            
            <div className="alert alert-info mb-6">
              <span className="text-lg">💡</span>
              <span>Перейдите в калькулятор для создания заявки с точными расчетами</span>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowCreateOrder(false);
                  // Switch to calculator tab - would need to pass callback up
                }}
                className="btn-primary flex-1"
              >
                🧮 Калькулятор
              </button>
              <button
                onClick={() => setShowCreateOrder(false)}
                className="btn-secondary btn-sm px-6"
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