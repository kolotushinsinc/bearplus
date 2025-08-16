import React, { useState } from 'react';

interface SOCContainerPrice {
  id: string;
  port: string;
  containerType: string;
  pricePerDay: number;
  currency: string;
  isActive: boolean;
}

interface CalculatorConfig {
  defaultCurrency: string;
  companyMargin: number;
  autoUpdateRates: boolean;
  showDetailedBreakdown: boolean;
  includePremiumServices: boolean;
}

const CalculatorSettings: React.FC = () => {
  const [socPrices, setSocPrices] = useState<SOCContainerPrice[]>([
    {
      id: '1',
      port: 'Санкт-Петербург',
      containerType: '20DC',
      pricePerDay: 25,
      currency: 'USD',
      isActive: true
    },
    {
      id: '2',
      port: 'Санкт-Петербург',
      containerType: '40HC',
      pricePerDay: 35,
      currency: 'USD',
      isActive: true
    },
    {
      id: '3',
      port: 'Москва',
      containerType: '20DC',
      pricePerDay: 30,
      currency: 'USD',
      isActive: true
    },
    {
      id: '4',
      port: 'Новосибирск',
      containerType: '40DC',
      pricePerDay: 32,
      currency: 'USD',
      isActive: false
    }
  ]);

  const [config, setConfig] = useState<CalculatorConfig>({
    defaultCurrency: 'USD',
    companyMargin: 15,
    autoUpdateRates: true,
    showDetailedBreakdown: true,
    includePremiumServices: false
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPrice, setEditingPrice] = useState<SOCContainerPrice | null>(null);
  const [formData, setFormData] = useState({
    port: '',
    containerType: '',
    pricePerDay: '',
    currency: 'USD'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newPrice: SOCContainerPrice = {
      id: editingPrice?.id || Date.now().toString(),
      port: formData.port,
      containerType: formData.containerType,
      pricePerDay: parseFloat(formData.pricePerDay),
      currency: formData.currency,
      isActive: true
    };

    if (editingPrice) {
      setSocPrices(prev => prev.map(price => 
        price.id === editingPrice.id ? newPrice : price
      ));
    } else {
      setSocPrices(prev => [...prev, newPrice]);
    }

    resetForm();
    setIsModalOpen(false);
  };

  const resetForm = () => {
    setFormData({
      port: '',
      containerType: '',
      pricePerDay: '',
      currency: 'USD'
    });
    setEditingPrice(null);
  };

  const handleEdit = (price: SOCContainerPrice) => {
    setEditingPrice(price);
    setFormData({
      port: price.port,
      containerType: price.containerType,
      pricePerDay: price.pricePerDay.toString(),
      currency: price.currency
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Удалить эту цену?')) {
      setSocPrices(prev => prev.filter(price => price.id !== id));
    }
  };

  const handleToggleActive = (id: string) => {
    setSocPrices(prev => prev.map(price => 
      price.id === id ? { ...price, isActive: !price.isActive } : price
    ));
  };

  const updateConfig = (updates: Partial<CalculatorConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }));
  };

  const exchangeRates = [
    { from: 'USD', to: 'RUB', rate: 92.5 },
    { from: 'EUR', to: 'RUB', rate: 100.2 },
    { from: 'CNY', to: 'RUB', rate: 12.8 }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Настройки калькулятора ставки</h2>
        <button
          onClick={() => {
            resetForm();
            setIsModalOpen(true);
          }}
          className="btn-primary"
        >
          + Добавить цену SOC
        </button>
      </div>

      {/* General Settings */}
      <div className="card">
        <h3 className="text-xl font-bold text-white mb-4">Общие настройки</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-300 mb-2">Валюта по умолчанию</label>
            <select
              value={config.defaultCurrency}
              onChange={(e) => updateConfig({ defaultCurrency: e.target.value })}
              className="input w-full"
            >
              <option value="USD">USD - Доллар США</option>
              <option value="EUR">EUR - Евро</option>
              <option value="RUB">RUB - Российский рубль</option>
              <option value="CNY">CNY - Китайский юань</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-300 mb-2">Маржа компании (%)</label>
            <input
              type="number"
              value={config.companyMargin}
              onChange={(e) => updateConfig({ companyMargin: parseFloat(e.target.value) || 0 })}
              className="input w-full"
              min="0"
              max="100"
              step="0.1"
            />
          </div>
        </div>

        <div className="mt-6 space-y-4">
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={config.autoUpdateRates}
              onChange={(e) => updateConfig({ autoUpdateRates: e.target.checked })}
              className="sr-only"
            />
            <div className={`relative w-11 h-6 rounded-full transition-colors ${
              config.autoUpdateRates ? 'bg-bearplus-green' : 'bg-gray-600'
            }`}>
              <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                config.autoUpdateRates ? 'translate-x-5' : 'translate-x-0'
              }`} />
            </div>
            <span className="ml-3 text-white">Автообновление курсов валют</span>
          </label>

          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={config.showDetailedBreakdown}
              onChange={(e) => updateConfig({ showDetailedBreakdown: e.target.checked })}
              className="sr-only"
            />
            <div className={`relative w-11 h-6 rounded-full transition-colors ${
              config.showDetailedBreakdown ? 'bg-bearplus-green' : 'bg-gray-600'
            }`}>
              <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                config.showDetailedBreakdown ? 'translate-x-5' : 'translate-x-0'
              }`} />
            </div>
            <span className="ml-3 text-white">Показывать детальную разбивку</span>
          </label>

          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={config.includePremiumServices}
              onChange={(e) => updateConfig({ includePremiumServices: e.target.checked })}
              className="sr-only"
            />
            <div className={`relative w-11 h-6 rounded-full transition-colors ${
              config.includePremiumServices ? 'bg-bearplus-green' : 'bg-gray-600'
            }`}>
              <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                config.includePremiumServices ? 'translate-x-5' : 'translate-x-0'
              }`} />
            </div>
            <span className="ml-3 text-white">Включать премиальные услуги</span>
          </label>
        </div>
      </div>

      {/* Currency Rates */}
      <div className="card">
        <h3 className="text-xl font-bold text-white mb-4">Курсы валют (ЦБ РФ)</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {exchangeRates.map((rate, index) => (
            <div key={index} className="p-4 bg-bearplus-card-dark rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-white font-semibold">
                  1 {rate.from} = {rate.to}
                </span>
                <span className="text-bearplus-green font-bold">
                  {rate.rate.toFixed(2)}
                </span>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 text-center">
          <button className="btn-secondary">
            🔄 Обновить курсы
          </button>
        </div>
      </div>

      {/* SOC Container Prices */}
      <div className="card">
        <h3 className="text-xl font-bold text-white mb-4">Цены на аренду SOC контейнеров</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left p-4 text-gray-300">Порт</th>
                <th className="text-left p-4 text-gray-300">Тип контейнера</th>
                <th className="text-left p-4 text-gray-300">Цена за день</th>
                <th className="text-left p-4 text-gray-300">Валюта</th>
                <th className="text-left p-4 text-gray-300">Статус</th>
                <th className="text-left p-4 text-gray-300">Действия</th>
              </tr>
            </thead>
            <tbody>
              {socPrices.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center p-8 text-gray-400">
                    Нет настроенных цен на контейнеры
                  </td>
                </tr>
              ) : (
                socPrices.map((price) => (
                  <tr key={price.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                    <td className="p-4 text-white font-medium">{price.port}</td>
                    <td className="p-4 text-white">{price.containerType}</td>
                    <td className="p-4 text-bearplus-green font-semibold">
                      {price.pricePerDay.toLocaleString()}
                    </td>
                    <td className="p-4 text-white">{price.currency}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        price.isActive 
                          ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                          : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                      }`}>
                        {price.isActive ? 'Активна' : 'Неактивна'}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleToggleActive(price.id)}
                          className="text-blue-400 hover:text-blue-300 p-1"
                          title={price.isActive ? 'Деактивировать' : 'Активировать'}
                        >
                          {price.isActive ? '⏸️' : '▶️'}
                        </button>
                        <button
                          onClick={() => handleEdit(price)}
                          className="text-blue-400 hover:text-blue-300 p-1"
                          title="Редактировать"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => handleDelete(price.id)}
                          className="text-red-400 hover:text-red-300 p-1"
                          title="Удалить"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-bearplus-card max-w-md w-full mx-4 rounded-lg p-6">
            <h3 className="text-xl font-bold text-white mb-4">
              {editingPrice ? 'Редактировать цену' : 'Добавить цену SOC'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-300 mb-2">Порт</label>
                <input
                  type="text"
                  value={formData.port}
                  onChange={(e) => setFormData(prev => ({ ...prev, port: e.target.value }))}
                  className="input w-full"
                  placeholder="Санкт-Петербург"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-2">Тип контейнера</label>
                <select
                  value={formData.containerType}
                  onChange={(e) => setFormData(prev => ({ ...prev, containerType: e.target.value }))}
                  className="input w-full"
                  required
                >
                  <option value="">Выберите тип</option>
                  <option value="20DC">20DC - 20ft Dry Container</option>
                  <option value="40DC">40DC - 40ft Dry Container</option>
                  <option value="40HC">40HC - 40ft High Cube</option>
                  <option value="20RF">20RF - 20ft Reefer</option>
                  <option value="40RF">40RF - 40ft Reefer</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-300 mb-2">Цена за день</label>
                <input
                  type="number"
                  value={formData.pricePerDay}
                  onChange={(e) => setFormData(prev => ({ ...prev, pricePerDay: e.target.value }))}
                  className="input w-full"
                  placeholder="25"
                  required
                  min="0"
                  step="0.01"
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-2">Валюта</label>
                <select
                  value={formData.currency}
                  onChange={(e) => setFormData(prev => ({ ...prev, currency: e.target.value }))}
                  className="input w-full"
                  required
                >
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="RUB">RUB</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    resetForm();
                  }}
                  className="btn-secondary"
                >
                  Отмена
                </button>
                <button type="submit" className="btn-primary">
                  {editingPrice ? 'Сохранить' : 'Добавить'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalculatorSettings;