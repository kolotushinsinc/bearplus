import React, { useState } from 'react';

interface Client {
  id: string;
  name: string;
  email: string;
  companyName?: string;
  userType: 'client' | 'agent';
  currentDiscount: number;
  totalOrders: number;
  totalRevenue: number;
  lastOrderDate: string;
  isActive: boolean;
}

interface LoyaltyRule {
  id: string;
  name: string;
  condition: 'orders_count' | 'revenue_amount' | 'manual';
  threshold: number;
  discountPercent: number;
  isActive: boolean;
  description: string;
}

const LoyaltyManagement: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([
    {
      id: '1',
      name: 'Иван Петров',
      email: 'ivan@example.com',
      companyName: 'ООО "Логистика Плюс"',
      userType: 'client',
      currentDiscount: 5,
      totalOrders: 12,
      totalRevenue: 145000,
      lastOrderDate: '2024-01-10',
      isActive: true
    },
    {
      id: '2',
      name: 'Анна Сидорова',
      email: 'anna@company.ru',
      companyName: 'ИП Сидорова А.В.',
      userType: 'client',
      currentDiscount: 10,
      totalOrders: 8,
      totalRevenue: 98000,
      lastOrderDate: '2024-01-15',
      isActive: true
    },
    {
      id: '3',
      name: 'Михаил Козлов',
      email: 'kozlov@trade.com',
      companyName: 'ТД "Импорт-Экспорт"',
      userType: 'client',
      currentDiscount: 0,
      totalOrders: 3,
      totalRevenue: 35000,
      lastOrderDate: '2024-01-12',
      isActive: true
    }
  ]);

  const [loyaltyRules, setLoyaltyRules] = useState<LoyaltyRule[]>([
    {
      id: '1',
      name: 'Постоянный клиент',
      condition: 'orders_count',
      threshold: 10,
      discountPercent: 5,
      isActive: true,
      description: 'Скидка для клиентов с 10+ заказами'
    },
    {
      id: '2',
      name: 'VIP клиент',
      condition: 'revenue_amount',
      threshold: 100000,
      discountPercent: 10,
      isActive: true,
      description: 'Скидка для клиентов с оборотом 100k+'
    },
    {
      id: '3',
      name: 'Премиум партнер',
      condition: 'revenue_amount',
      threshold: 500000,
      discountPercent: 15,
      isActive: true,
      description: 'Максимальная скидка для крупных партнеров'
    }
  ]);

  const [activeTab, setActiveTab] = useState<'clients' | 'rules'>('clients');
  const [searchTerm, setSearchTerm] = useState('');
  const [isDiscountModalOpen, setIsDiscountModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [newDiscount, setNewDiscount] = useState('');
  const [discountReason, setDiscountReason] = useState('');

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (client.companyName && client.companyName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleUpdateDiscount = (clientId: string, discount: number, reason: string) => {
    setClients(prev => prev.map(client =>
      client.id === clientId
        ? { ...client, currentDiscount: discount }
        : client
    ));
    
    // В реальном приложении здесь будет API запрос
    console.log(`Updated discount for client ${clientId}: ${discount}% (${reason})`);
  };

  const handleSubmitDiscount = () => {
    if (selectedClient && newDiscount !== '') {
      handleUpdateDiscount(selectedClient.id, parseFloat(newDiscount), discountReason);
      setIsDiscountModalOpen(false);
      setSelectedClient(null);
      setNewDiscount('');
      setDiscountReason('');
    }
  };

  const openDiscountModal = (client: Client) => {
    setSelectedClient(client);
    setNewDiscount(client.currentDiscount.toString());
    setIsDiscountModalOpen(true);
  };

  const calculateSuggestedDiscount = (client: Client): number => {
    let maxDiscount = 0;
    
    loyaltyRules.forEach(rule => {
      if (!rule.isActive) return;
      
      let qualifies = false;
      if (rule.condition === 'orders_count' && client.totalOrders >= rule.threshold) {
        qualifies = true;
      } else if (rule.condition === 'revenue_amount' && client.totalRevenue >= rule.threshold) {
        qualifies = true;
      }
      
      if (qualifies && rule.discountPercent > maxDiscount) {
        maxDiscount = rule.discountPercent;
      }
    });
    
    return maxDiscount;
  };

  const toggleRuleStatus = (ruleId: string) => {
    setLoyaltyRules(prev => prev.map(rule =>
      rule.id === ruleId ? { ...rule, isActive: !rule.isActive } : rule
    ));
  };

  const getDiscountBadgeColor = (discount: number) => {
    if (discount === 0) return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    if (discount <= 5) return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    if (discount <= 10) return 'bg-green-500/20 text-green-400 border-green-500/30';
    return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Управление лояльностью</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('clients')}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              activeTab === 'clients'
                ? 'bg-bearplus-green text-black'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            👥 Клиенты
          </button>
          <button
            onClick={() => setActiveTab('rules')}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              activeTab === 'rules'
                ? 'bg-bearplus-green text-black'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            📋 Правила
          </button>
        </div>
      </div>

      {activeTab === 'clients' && (
        <>
          {/* Search and Stats */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1">
              <div className="card">
                <h3 className="text-lg font-bold text-white mb-4">Поиск клиентов</h3>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input w-full"
                  placeholder="Имя, email или компания..."
                />
              </div>
            </div>
            
            <div className="lg:col-span-3">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="card text-center">
                  <div className="text-2xl font-bold text-bearplus-green mb-2">
                    {clients.filter(c => c.currentDiscount > 0).length}
                  </div>
                  <div className="text-gray-400 text-sm">Клиентов со скидкой</div>
                </div>
                <div className="card text-center">
                  <div className="text-2xl font-bold text-bearplus-green mb-2">
                    {Math.round(clients.reduce((sum, c) => sum + c.currentDiscount, 0) / clients.length)}%
                  </div>
                  <div className="text-gray-400 text-sm">Средняя скидка</div>
                </div>
                <div className="card text-center">
                  <div className="text-2xl font-bold text-bearplus-green mb-2">
                    {clients.reduce((sum, c) => sum + c.totalRevenue, 0).toLocaleString()}
                  </div>
                  <div className="text-gray-400 text-sm">Общий оборот</div>
                </div>
              </div>
            </div>
          </div>

          {/* Clients Table */}
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left p-4 text-gray-300">Клиент</th>
                    <th className="text-left p-4 text-gray-300">Заказы</th>
                    <th className="text-left p-4 text-gray-300">Оборот</th>
                    <th className="text-left p-4 text-gray-300">Текущая скидка</th>
                    <th className="text-left p-4 text-gray-300">Рекомендуемая</th>
                    <th className="text-left p-4 text-gray-300">Последний заказ</th>
                    <th className="text-left p-4 text-gray-300">Действия</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredClients.map((client) => {
                    const suggestedDiscount = calculateSuggestedDiscount(client);
                    return (
                      <tr key={client.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                        <td className="p-4">
                          <div>
                            <div className="text-white font-medium">{client.name}</div>
                            <div className="text-gray-400 text-sm">{client.email}</div>
                            {client.companyName && (
                              <div className="text-gray-500 text-xs">{client.companyName}</div>
                            )}
                          </div>
                        </td>
                        <td className="p-4 text-white">{client.totalOrders}</td>
                        <td className="p-4 text-bearplus-green font-semibold">
                          {client.totalRevenue.toLocaleString()} ₽
                        </td>
                        <td className="p-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getDiscountBadgeColor(client.currentDiscount)}`}>
                            {client.currentDiscount}%
                          </span>
                        </td>
                        <td className="p-4">
                          {suggestedDiscount > client.currentDiscount ? (
                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
                              ↑ {suggestedDiscount}%
                            </span>
                          ) : (
                            <span className="text-gray-500 text-sm">—</span>
                          )}
                        </td>
                        <td className="p-4 text-gray-300 text-sm">
                          {new Date(client.lastOrderDate).toLocaleDateString()}
                        </td>
                        <td className="p-4">
                          <button
                            onClick={() => openDiscountModal(client)}
                            className="btn-secondary text-sm"
                          >
                            Изменить скидку
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {activeTab === 'rules' && (
        <div className="card">
          <h3 className="text-xl font-bold text-white mb-4">Правила начисления скидок</h3>
          <div className="space-y-4">
            {loyaltyRules.map((rule) => (
              <div
                key={rule.id}
                className={`p-4 rounded-lg border-2 transition-all ${
                  rule.isActive
                    ? 'border-bearplus-green bg-bearplus-green/10'
                    : 'border-gray-600 bg-gray-800/50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-white font-semibold">{rule.name}</h4>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rule.isActive}
                      onChange={() => toggleRuleStatus(rule.id)}
                      className="sr-only"
                    />
                    <div className={`relative w-11 h-6 rounded-full transition-colors ${
                      rule.isActive ? 'bg-bearplus-green' : 'bg-gray-600'
                    }`}>
                      <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                        rule.isActive ? 'translate-x-5' : 'translate-x-0'
                      }`} />
                    </div>
                  </label>
                </div>
                
                <p className="text-gray-300 text-sm mb-3">{rule.description}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">Условие:</span>
                    <div className="text-white font-medium">
                      {rule.condition === 'orders_count' ? 'Количество заказов' : 'Сумма оборота'}
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-400">Порог:</span>
                    <div className="text-white font-medium">
                      {rule.condition === 'orders_count' 
                        ? `${rule.threshold} заказов`
                        : `${rule.threshold.toLocaleString()} ₽`
                      }
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-400">Скидка:</span>
                    <div className="text-bearplus-green font-bold">{rule.discountPercent}%</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Discount Modal */}
      {isDiscountModalOpen && selectedClient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-bearplus-card max-w-md w-full mx-4 rounded-lg p-6">
            <h3 className="text-xl font-bold text-white mb-4">
              Изменить скидку для {selectedClient.name}
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-gray-300 mb-2">Размер скидки (%)</label>
                <input
                  type="number"
                  value={newDiscount}
                  onChange={(e) => setNewDiscount(e.target.value)}
                  className="input w-full"
                  min="0"
                  max="50"
                  step="0.1"
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-2">Причина изменения</label>
                <textarea
                  value={discountReason}
                  onChange={(e) => setDiscountReason(e.target.value)}
                  className="input w-full"
                  rows={3}
                  placeholder="Укажите причину изменения скидки..."
                />
              </div>

              <div className="bg-bearplus-card-dark p-3 rounded-lg">
                <h4 className="text-white font-medium mb-2">Информация о клиенте:</h4>
                <div className="text-sm space-y-1">
                  <div><span className="text-gray-400">Заказов:</span> <span className="text-white">{selectedClient.totalOrders}</span></div>
                  <div><span className="text-gray-400">Оборот:</span> <span className="text-bearplus-green">{selectedClient.totalRevenue.toLocaleString()} ₽</span></div>
                  <div><span className="text-gray-400">Рекомендуемая скидка:</span> <span className="text-yellow-400">{calculateSuggestedDiscount(selectedClient)}%</span></div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  onClick={() => {
                    setIsDiscountModalOpen(false);
                    setSelectedClient(null);
                    setNewDiscount('');
                    setDiscountReason('');
                  }}
                  className="btn-secondary"
                >
                  Отмена
                </button>
                <button
                  onClick={handleSubmitDiscount}
                  className="btn-primary"
                >
                  Применить
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoyaltyManagement;