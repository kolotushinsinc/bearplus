import React, { useState, useRef } from 'react';

interface Rate {
  id: string;
  type: 'freight' | 'railway' | 'auto' | 'container_rental';
  origin: string;
  destination: string;
  containerType: string;
  price: number;
  currency: string;
  validFrom: string;
  validTo: string;
  description?: string;
}

const RatesManagement: React.FC = () => {
  const [rates, setRates] = useState<Rate[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [activeTab, setActiveTab] = useState<'freight' | 'railway' | 'auto' | 'container_rental'>('freight');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRate, setEditingRate] = useState<Rate | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<{
    type: 'freight' | 'railway' | 'auto' | 'container_rental';
    origin: string;
    destination: string;
    containerType: string;
    price: string;
    currency: string;
    validFrom: string;
    validTo: string;
    description: string;
  }>({
    type: 'freight',
    origin: '',
    destination: '',
    containerType: '',
    price: '',
    currency: 'USD',
    validFrom: '',
    validTo: '',
    description: ''
  });

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
      alert('Пожалуйста, выберите Excel файл (.xlsx или .xls)');
      return;
    }

    setIsUploading(true);
    
    try {
      // В реальном приложении здесь будет загрузка на сервер
      // const formData = new FormData();
      // formData.append('file', file);
      // const response = await fetch('/api/rates/upload', {
      //   method: 'POST',
      //   body: formData
      // });
      
      // Имитация обработки файла
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock данные для демонстрации
      const mockRates: Rate[] = [
        {
          id: Date.now().toString() + '1',
          type: activeTab,
          origin: 'Шанхай',
          destination: 'Санкт-Петербург',
          containerType: '20DC',
          price: 2500,
          currency: 'USD',
          validFrom: '2024-01-01',
          validTo: '2024-12-31',
          description: 'Стандартная ставка'
        },
        {
          id: Date.now().toString() + '2',
          type: activeTab,
          origin: 'Шанхай',
          destination: 'Москва',
          containerType: '40HC',
          price: 3200,
          currency: 'USD',
          validFrom: '2024-01-01',
          validTo: '2024-12-31',
          description: 'Экспресс доставка'
        }
      ];
      
      setRates(prev => [...prev, ...mockRates]);
      
      alert('Ставки успешно загружены из Excel файла');
    } catch (error) {
      console.error('Ошибка загрузки файла:', error);
      alert('Произошла ошибка при загрузке файла');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newRate: Rate = {
      id: editingRate?.id || Date.now().toString(),
      type: formData.type,
      origin: formData.origin,
      destination: formData.destination,
      containerType: formData.containerType,
      price: parseFloat(formData.price),
      currency: formData.currency,
      validFrom: formData.validFrom,
      validTo: formData.validTo,
      description: formData.description
    };

    if (editingRate) {
      setRates(prev => prev.map(rate => rate.id === editingRate.id ? newRate : rate));
    } else {
      setRates(prev => [...prev, newRate]);
    }

    resetForm();
    setIsModalOpen(false);
  };

  const resetForm = () => {
    setFormData({
      type: activeTab,
      origin: '',
      destination: '',
      containerType: '',
      price: '',
      currency: 'USD',
      validFrom: '',
      validTo: '',
      description: ''
    });
    setEditingRate(null);
  };

  const handleEdit = (rate: Rate) => {
    setEditingRate(rate);
    setFormData({
      type: rate.type,
      origin: rate.origin,
      destination: rate.destination,
      containerType: rate.containerType,
      price: rate.price.toString(),
      currency: rate.currency,
      validFrom: rate.validFrom,
      validTo: rate.validTo,
      description: rate.description || ''
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Удалить эту ставку?')) {
      setRates(prev => prev.filter(rate => rate.id !== id));
    }
  };

  const filteredRates = rates.filter(rate => rate.type === activeTab);

  const tabs = [
    { id: 'freight', label: 'Фрахт', icon: '🚢' },
    { id: 'railway', label: 'ЖД доставка', icon: '🚂' },
    { id: 'auto', label: 'Авто доставка', icon: '🚛' },
    { id: 'container_rental', label: 'Аренда КТК', icon: '📦' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Управление ставками</h2>
        <div className="flex gap-3">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".xlsx,.xls"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="btn-secondary flex items-center gap-2"
          >
            {isUploading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Загрузка...
              </>
            ) : (
              <>
                📁 Загрузить Excel
              </>
            )}
          </button>
          <button
            onClick={() => {
              resetForm();
              setFormData(prev => ({ ...prev, type: activeTab }));
              setIsModalOpen(true);
            }}
            className="btn-primary"
          >
            + Добавить ставку
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-700 pb-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              activeTab === tab.id
                ? 'bg-bearplus-green text-black'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            <span className="mr-2">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Rates Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left p-4 text-gray-300">Маршрут</th>
                <th className="text-left p-4 text-gray-300">Тип контейнера</th>
                <th className="text-left p-4 text-gray-300">Цена</th>
                <th className="text-left p-4 text-gray-300">Валюта</th>
                <th className="text-left p-4 text-gray-300">Действует</th>
                <th className="text-left p-4 text-gray-300">Действия</th>
              </tr>
            </thead>
            <tbody>
              {filteredRates.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center p-8 text-gray-400">
                    Нет ставок для категории "{tabs.find(t => t.id === activeTab)?.label}"
                  </td>
                </tr>
              ) : (
                filteredRates.map((rate) => (
                  <tr key={rate.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                    <td className="p-4 text-white">
                      <div>
                        <div className="font-medium">{rate.origin} → {rate.destination}</div>
                        {rate.description && (
                          <div className="text-gray-400 text-sm">{rate.description}</div>
                        )}
                      </div>
                    </td>
                    <td className="p-4 text-white">{rate.containerType}</td>
                    <td className="p-4 text-bearplus-green font-semibold">{rate.price.toLocaleString()}</td>
                    <td className="p-4 text-white">{rate.currency}</td>
                    <td className="p-4 text-gray-300 text-sm">
                      {new Date(rate.validFrom).toLocaleDateString()} - {new Date(rate.validTo).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(rate)}
                          className="text-blue-400 hover:text-blue-300 p-1"
                          title="Редактировать"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => handleDelete(rate.id)}
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
          <div className="bg-bearplus-card max-w-2xl w-full mx-4 rounded-lg p-6">
            <h3 className="text-xl font-bold text-white mb-4">
              {editingRate ? 'Редактировать ставку' : 'Добавить ставку'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 mb-2">Тип</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as any }))}
                    className="input w-full"
                    required
                  >
                    <option value="freight">Фрахт</option>
                    <option value="railway">ЖД доставка</option>
                    <option value="auto">Авто доставка</option>
                    <option value="container_rental">Аренда КТК</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-300 mb-2">Тип контейнера</label>
                  <input
                    type="text"
                    value={formData.containerType}
                    onChange={(e) => setFormData(prev => ({ ...prev, containerType: e.target.value }))}
                    className="input w-full"
                    placeholder="20DC, 40HC, 40DC..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-2">Откуда</label>
                  <input
                    type="text"
                    value={formData.origin}
                    onChange={(e) => setFormData(prev => ({ ...prev, origin: e.target.value }))}
                    className="input w-full"
                    placeholder="Порт отправления"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-2">Куда</label>
                  <input
                    type="text"
                    value={formData.destination}
                    onChange={(e) => setFormData(prev => ({ ...prev, destination: e.target.value }))}
                    className="input w-full"
                    placeholder="Порт назначения"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-2">Цена</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                    className="input w-full"
                    placeholder="0"
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
                    <option value="CNY">CNY</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-300 mb-2">Действует с</label>
                  <input
                    type="date"
                    value={formData.validFrom}
                    onChange={(e) => setFormData(prev => ({ ...prev, validFrom: e.target.value }))}
                    className="input w-full"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-2">Действует до</label>
                  <input
                    type="date"
                    value={formData.validTo}
                    onChange={(e) => setFormData(prev => ({ ...prev, validTo: e.target.value }))}
                    className="input w-full"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-300 mb-2">Описание</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="input w-full"
                  rows={3}
                  placeholder="Дополнительная информация о ставке"
                />
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
                  {editingRate ? 'Сохранить' : 'Добавить'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RatesManagement;