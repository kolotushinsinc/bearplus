import React, { useState } from 'react';

interface MarginSetting {
  id: string;
  type: 'container_rental' | 'railway' | 'freight' | 'auto_delivery';
  marginPercent: number;
  isActive: boolean;
  description?: string;
}

interface CurrencyConversion {
  from: string;
  to: string;
  rate: number;
  lastUpdated: string;
}

const MarginSettings: React.FC = () => {
  const [margins, setMargins] = useState<MarginSetting[]>([
    {
      id: '1',
      type: 'container_rental',
      marginPercent: 15,
      isActive: true,
      description: 'Маржа на аренду чужих контейнеров'
    },
    {
      id: '2',
      type: 'railway',
      marginPercent: 12,
      isActive: true,
      description: 'Маржа на ЖД доставку'
    },
    {
      id: '3',
      type: 'freight',
      marginPercent: 18,
      isActive: true,
      description: 'Маржа на морской фрахт'
    },
    {
      id: '4',
      type: 'auto_delivery',
      marginPercent: 20,
      isActive: true,
      description: 'Маржа на автодоставку'
    }
  ]);

  const [currencies, setCurrencies] = useState<CurrencyConversion[]>([
    { from: 'USD', to: 'RUB', rate: 92.5, lastUpdated: '2024-01-16T12:00:00Z' },
    { from: 'EUR', to: 'RUB', rate: 100.2, lastUpdated: '2024-01-16T12:00:00Z' },
    { from: 'CNY', to: 'RUB', rate: 12.8, lastUpdated: '2024-01-16T12:00:00Z' }
  ]);

  const [isUpdatingRates, setIsUpdatingRates] = useState(false);

  const handleMarginChange = (id: string, marginPercent: number) => {
    setMargins(prev => prev.map(margin => 
      margin.id === id ? { ...margin, marginPercent } : margin
    ));
  };

  const handleToggleMargin = (id: string) => {
    setMargins(prev => prev.map(margin => 
      margin.id === id ? { ...margin, isActive: !margin.isActive } : margin
    ));
  };

  const updateCurrencyRates = async () => {
    setIsUpdatingRates(true);
    try {
      // В реальном приложении здесь будет запрос к API ЦБ РФ
      // const response = await fetch('/api/currency/update');
      // const rates = await response.json();
      
      // Имитация обновления курсов валют
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setCurrencies(prev => prev.map(currency => ({
        ...currency,
        rate: currency.rate + (Math.random() - 0.5) * 2, // Случайное изменение ±1
        lastUpdated: new Date().toISOString()
      })));
      
      alert('Курсы валют обновлены');
    } catch (error) {
      console.error('Ошибка обновления курсов:', error);
      alert('Произошла ошибка при обновлении курсов валют');
    } finally {
      setIsUpdatingRates(false);
    }
  };

  const getTypeLabel = (type: MarginSetting['type']) => {
    const labels = {
      container_rental: 'Аренда контейнеров',
      railway: 'ЖД доставка',
      freight: 'Морской фрахт',
      auto_delivery: 'Автодоставка'
    };
    return labels[type];
  };

  const getTypeIcon = (type: MarginSetting['type']) => {
    const icons = {
      container_rental: '📦',
      railway: '🚂',
      freight: '🚢',
      auto_delivery: '🚛'
    };
    return icons[type];
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Настройки маржи</h2>
        <button
          onClick={updateCurrencyRates}
          disabled={isUpdatingRates}
          className="btn-secondary flex items-center gap-2"
        >
          {isUpdatingRates ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Обновление...
            </>
          ) : (
            <>
              🔄 Обновить курсы
            </>
          )}
        </button>
      </div>

      {/* Margin Settings */}
      <div className="card">
        <h3 className="text-xl font-bold text-white mb-4">Настройки маржи по услугам</h3>
        <div className="space-y-4">
          {margins.map((margin) => (
            <div
              key={margin.id}
              className={`p-4 rounded-lg border-2 transition-all ${
                margin.isActive
                  ? 'border-bearplus-green bg-bearplus-green/10'
                  : 'border-gray-600 bg-gray-800/50'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{getTypeIcon(margin.type)}</span>
                  <div>
                    <h4 className="text-white font-semibold">{getTypeLabel(margin.type)}</h4>
                    {margin.description && (
                      <p className="text-gray-400 text-sm">{margin.description}</p>
                    )}
                  </div>
                </div>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={margin.isActive}
                    onChange={() => handleToggleMargin(margin.id)}
                    className="sr-only"
                  />
                  <div className={`relative w-11 h-6 rounded-full transition-colors ${
                    margin.isActive ? 'bg-bearplus-green' : 'bg-gray-600'
                  }`}>
                    <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                      margin.isActive ? 'translate-x-5' : 'translate-x-0'
                    }`} />
                  </div>
                </label>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <label className="block text-gray-300 text-sm mb-2">
                    Маржа (%)
                  </label>
                  <input
                    type="number"
                    value={margin.marginPercent}
                    onChange={(e) => handleMarginChange(margin.id, parseFloat(e.target.value) || 0)}
                    className="input w-full"
                    min="0"
                    max="100"
                    step="0.1"
                    disabled={!margin.isActive}
                  />
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-400">Примерная надбавка</div>
                  <div className="text-lg font-bold text-bearplus-green">
                    +{margin.marginPercent.toFixed(1)}%
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Currency Conversion */}
      <div className="card">
        <h3 className="text-xl font-bold text-white mb-4">Конвертация валют</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {currencies.map((currency, index) => (
            <div key={index} className="p-4 bg-bearplus-card-dark rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="text-white font-semibold">
                  {currency.from} → {currency.to}
                </span>
                <span className="text-bearplus-green font-bold">
                  {currency.rate.toFixed(2)}
                </span>
              </div>
              <div className="text-gray-400 text-xs">
                Обновлено: {new Date(currency.lastUpdated).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
          <div className="flex items-center gap-2 text-blue-400">
            <span>ℹ️</span>
            <span className="text-sm">
              Курсы валют автоматически обновляются каждые 30 минут с сайта ЦБ РФ
            </span>
          </div>
        </div>
      </div>

      {/* Margin Calculator */}
      <div className="card">
        <h3 className="text-xl font-bold text-white mb-4">Калькулятор маржи</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-300 mb-2">Базовая стоимость</label>
            <input
              type="number"
              className="input w-full"
              placeholder="1000"
            />
          </div>
          <div>
            <label className="block text-gray-300 mb-2">Тип услуги</label>
            <select className="input w-full">
              <option value="">Выберите тип услуги</option>
              {margins.map((margin) => (
                <option key={margin.id} value={margin.type}>
                  {getTypeLabel(margin.type)} ({margin.marginPercent}%)
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="mt-4 p-4 bg-bearplus-green/10 border border-bearplus-green/30 rounded-lg">
          <div className="text-center">
            <div className="text-gray-400 text-sm">Стоимость с маржой</div>
            <div className="text-2xl font-bold text-bearplus-green">1,150 USD</div>
            <div className="text-gray-400 text-xs">Маржа: +150 USD (15%)</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarginSettings;