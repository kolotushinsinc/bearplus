import * as React from 'react';
import { useState, useEffect } from 'react';
import { useAppSelector } from '../../hooks/redux';
import { apiService } from '../../services/apiService';

interface Rate {
  id: string;
  name: string;
  description: string;
  type: 'freight' | 'railway' | 'auto' | 'container_rental';
  // Freight specific fields
  line?: string;
  departurePort?: string;
  departureDate?: string;
  arrivalPort?: string;
  route?: string;
  containerType?: string;
  containerWeight?: number;
  dthc?: number;
  ddf?: number;
  // Common fields
  origin: {
    country: string;
    city: string;
    port?: string;
  };
  destination: {
    country: string;
    city: string;
    port?: string;
  };
  pricing: {
    currency: 'USD' | 'EUR' | 'RUB';
    baseCost: number;
    unit: 'kg' | 'cbm' | 'container' | 'pallet' | 'piece';
    finalRate?: number;
    minWeight?: number;
    maxWeight?: number;
    additionalFees: Array<{
      name: string;
      cost: number;
      type: 'fixed' | 'percentage';
    }>;
  };
  transitTime?: {
    min: number;
    max: number;
    unit: 'days' | 'hours';
  };
  // Container rental specific
  normalTerm?: number; // нормативный срок пользования
  overtimeCost?: number; // стоимость суток свыше
  dropOffLocation?: string;
  // Common
  conditions: {
    cargoTypes: string[];
    restrictions: string[];
    requiredDocuments: string[];
  };
  margin: number;
  isActive: boolean;
  validFrom: string;
  validTo?: string;
  lastUpdated: string;
  updatedBy: string;
  notes?: string;
}

interface RateTemplate {
  id: string;
  name: string;
  description: string;
  type: Rate['type'];
  defaultPricing: Partial<Rate['pricing']>;
  defaultConditions: Partial<Rate['conditions']>;
}

const RatesManagement: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);
  const [rates, setRates] = useState<Rate[]>([]);
  const [templates, setTemplates] = useState<RateTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRate, setSelectedRate] = useState<Rate | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showExcelModal, setShowExcelModal] = useState(false);
  const [selectedRateType, setSelectedRateType] = useState<Rate['type']>('freight');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<Rate['type'] | 'all'>('all');
  const [showInactive, setShowInactive] = useState(false);
  const [excelFile, setExcelFile] = useState<File | null>(null);
  const [isProcessingExcel, setIsProcessingExcel] = useState(false);

  useEffect(() => {
    fetchRates();
    fetchTemplates();
  }, []);

  const fetchRates = async () => {
    try {
      setIsLoading(true);
      const response = await apiService.rates.getRates({
        page: 1,
        limit: 50,
        type: filterType === 'all' ? undefined : filterType,
        search: searchTerm
      });
      
      if (response.success) {
        setRates(response.data || []);
      } else {
        console.error('Failed to fetch rates:', response);
        setRates([]);
      }
    } catch (error) {
      console.error('Error fetching rates:', error);
      setRates([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTemplates = async () => {
    try {
      // Mock templates data
      const mockTemplates: RateTemplate[] = [
        {
          id: 'template1',
          name: 'Морские перевозки - Стандарт',
          description: 'Базовый шаблон для морских контейнерных перевозок',
          type: 'freight',
          defaultPricing: {
            currency: 'USD',
            unit: 'container',
            additionalFees: [
              { name: 'THC Origin', cost: 150, type: 'fixed' },
              { name: 'THC Destination', cost: 200, type: 'fixed' },
              { name: 'Documentation', cost: 50, type: 'fixed' }
            ]
          },
          defaultConditions: {
            requiredDocuments: ['Commercial Invoice', 'Packing List', 'Bill of Lading']
          }
        },
        {
          id: 'template2',
          name: 'Авиаперевозки - Экспресс',
          description: 'Шаблон для срочных авиаперевозок',
          type: 'auto',
          defaultPricing: {
            currency: 'USD',
            unit: 'kg',
            additionalFees: [
              { name: 'Security screening', cost: 25, type: 'fixed' },
              { name: 'Express handling', cost: 100, type: 'fixed' }
            ]
          },
          defaultConditions: {
            requiredDocuments: ['Air Waybill', 'Commercial Invoice']
          }
        }
      ];

      setTemplates(mockTemplates);
    } catch (error) {
      console.error('Error fetching templates:', error);
    }
  };

  const handleSaveRate = async (rate: Rate) => {
    try {
      let response;
      
      if (rate.id === 'new') {
        response = await apiService.rates.createRate(rate);
      } else {
        response = await apiService.rates.updateRate(rate.id, rate);
      }
      
      if (response.success) {
        await fetchRates(); // Refresh the rates list
        setIsEditing(false);
        setSelectedRate(null);
        setShowCreateModal(false);
        alert(rate.id === 'new' ? 'Ставка успешно создана' : 'Ставка успешно обновлена');
      } else {
        alert('Ошибка при сохранении ставки: ' + response.message);
      }
    } catch (error) {
      console.error('Error saving rate:', error);
      alert('Ошибка при сохранении ставки');
    }
  };

  const handleDeleteRate = async (rateId: string) => {
    if (confirm('Вы уверены, что хотите удалить этот тариф?')) {
      try {
        const response = await apiService.rates.deleteRate(rateId);
        
        if (response.success) {
          await fetchRates(); // Refresh the rates list
          setSelectedRate(null);
          alert('Ставка успешно удалена');
        } else {
          alert('Ошибка при удалении ставки: ' + response.message);
        }
      } catch (error) {
        console.error('Error deleting rate:', error);
        alert('Ошибка при удалении ставки');
      }
    }
  };

  const handleDuplicateRate = (rate: Rate) => {
    const duplicatedRate: Rate = {
      ...rate,
      id: 'new',
      name: rate.name + ' (Копия)',
      lastUpdated: new Date().toISOString(),
      updatedBy: user?.firstName + ' ' + user?.lastName || 'Агент'
    };
    setSelectedRate(duplicatedRate);
    setIsEditing(true);
  };

  const filteredRates = rates.filter(rate => {
    const matchesSearch = rate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         rate.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         rate.origin.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         rate.destination.city.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === 'all' || rate.type === filterType;
    const matchesActive = showInactive || rate.isActive;

    return matchesSearch && matchesType && matchesActive;
  });

  const handleExcelUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && (file.type.includes('spreadsheet') || file.name.endsWith('.xlsx') || file.name.endsWith('.xls'))) {
      setExcelFile(file);
    } else {
      alert('Пожалуйста, выберите файл Excel (.xlsx или .xls)');
    }
  };

  const handleProcessExcel = async () => {
    if (!excelFile) return;
    
    setIsProcessingExcel(true);
    
    try {
      const response = await apiService.rates.uploadExcel(excelFile, selectedRateType);
      
      if (response.success) {
        await fetchRates(); // Refresh the rates list
        setShowExcelModal(false);
        setExcelFile(null);
        alert('Ставки успешно загружены из Excel');
      } else {
        alert('Ошибка при обработке Excel файла: ' + response.message);
      }
    } catch (error) {
      console.error('Excel processing error:', error);
      alert('Ошибка при загрузке Excel файла');
    } finally {
      setIsProcessingExcel(false);
    }
  };

  const getRateTypeIcon = (type: Rate['type']) => {
    switch (type) {
      case 'freight': return '🚢';
      case 'railway': return '🚂';
      case 'auto': return '🚛';
      case 'container_rental': return '📦';
      default: return '📋';
    }
  };

  const getRateTypeName = (type: Rate['type']) => {
    switch (type) {
      case 'freight': return 'Фрахт';
      case 'railway': return 'ЖД';
      case 'auto': return 'Авто';
      case 'container_rental': return 'Аренда КТК';
      default: return type;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU');
  };

  const calculateFinalPrice = (rate: Rate, weight?: number) => {
    let basePrice = rate.pricing.baseCost;
    
    if (weight && rate.pricing.unit === 'kg') {
      basePrice *= weight;
    }

    let totalFees = 0;
    rate.pricing.additionalFees.forEach(fee => {
      if (fee.type === 'fixed') {
        totalFees += fee.cost;
      } else if (fee.type === 'percentage') {
        totalFees += (basePrice * fee.cost) / 100;
      }
    });

    const subtotal = basePrice + totalFees;
    const margin = (subtotal * rate.margin) / 100;
    
    return subtotal + margin;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-white text-xl">Загрузка тарифов...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Создание ставок</h2>
        <div className="flex gap-3">
          <button
            onClick={() => setShowExcelModal(true)}
            className="btn-secondary"
          >
            📊 Загрузить из Excel
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn-primary"
          >
            ➕ Создать ставку
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-bearplus-card rounded-lg p-4">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex-1 min-w-[250px]">
            <input
              type="text"
              placeholder="Поиск по названию, описанию, маршруту..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field"
            />
          </div>

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as Rate['type'] | 'all')}
            className="input-field min-w-[180px]"
          >
            <option value="all">Все типы</option>
            <option value="freight">Фрахт</option>
            <option value="railway">ЖД</option>
            <option value="auto">Авто</option>
            <option value="container_rental">Аренда КТК</option>
          </select>

          <label className="flex items-center space-x-2 text-white cursor-pointer">
            <input
              type="checkbox"
              checked={showInactive}
              onChange={(e) => setShowInactive(e.target.checked)}
              className="rounded border-gray-600 bg-gray-700"
            />
            <span>Показать неактивные</span>
          </label>
        </div>
      </div>

      {/* Rates List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredRates.map((rate) => (
          <div
            key={rate.id}
            className={`bg-bearplus-card rounded-lg p-6 cursor-pointer transition-colors border-2 ${
              selectedRate?.id === rate.id
                ? 'border-bearplus-green'
                : rate.isActive
                ? 'border-transparent hover:border-gray-600'
                : 'border-red-600/30 opacity-75'
            }`}
            onClick={() => setSelectedRate(rate)}
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{getRateTypeIcon(rate.type)}</span>
                <div>
                  <h3 className="font-semibold text-white">{rate.name}</h3>
                  <p className="text-sm text-bearplus-green">{getRateTypeName(rate.type)}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                {!rate.isActive && (
                  <span className="bg-red-600 text-white text-xs px-2 py-1 rounded">
                    Неактивен
                  </span>
                )}
                <span className="text-xs text-gray-400">
                  {rate.margin}% margin
                </span>
              </div>
            </div>

            <p className="text-gray-400 text-sm mb-4">{rate.description}</p>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Маршрут:</span>
                <span className="text-white">
                  {rate.origin.city} → {rate.destination.city}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-400">Базовая стоимость:</span>
                <span className="text-white">
                  {rate.pricing.baseCost} {rate.pricing.currency}/{rate.pricing.unit}
                </span>
              </div>

              {rate.transitTime && (
                <div className="flex justify-between">
                  <span className="text-gray-400">Время доставки:</span>
                  <span className="text-white">
                    {rate.transitTime.min}-{rate.transitTime.max} {rate.transitTime.unit === 'days' ? 'дней' : 'часов'}
                  </span>
                </div>
              )}

              <div className="flex justify-between">
                <span className="text-gray-400">Действует до:</span>
                <span className="text-white">
                  {rate.validTo ? formatDate(rate.validTo) : 'Бессрочно'}
                </span>
              </div>
            </div>

            <div className="flex gap-2 mt-4 pt-4 border-t border-gray-700">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedRate(rate);
                  setIsEditing(true);
                }}
                className="btn-secondary text-xs flex-1"
              >
                Редактировать
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDuplicateRate(rate);
                }}
                className="btn-secondary text-xs flex-1"
              >
                Копировать
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteRate(rate.id);
                }}
                className="text-red-400 hover:text-red-300 text-xs px-2"
              >
                🗑️
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredRates.length === 0 && (
        <div className="text-center py-12">
          <div className="text-4xl mb-4">📋</div>
          <h3 className="text-lg font-semibold text-gray-400 mb-2">
            Тарифы не найдены
          </h3>
          <p className="text-gray-500">
            Попробуйте изменить параметры поиска или создайте новый тариф
          </p>
        </div>
      )}

      {/* Rate Details Modal */}
      {selectedRate && !isEditing && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={() => setSelectedRate(null)}>
          <div className="bg-bearplus-card-dark rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-gray-700" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-2xl font-bold text-white">{selectedRate.name}</h3>
                <p className="text-bearplus-green">{getRateTypeName(selectedRate.type)}</p>
              </div>
              <button
                onClick={() => setSelectedRate(null)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-lg font-semibold text-white mb-4">Основная информация</h4>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="text-gray-400">Описание:</span>
                    <p className="text-white mt-1">{selectedRate.description}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Статус:</span>
                    <span className={`ml-2 px-2 py-1 rounded text-xs ${
                      selectedRate.isActive ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
                    }`}>
                      {selectedRate.isActive ? 'Активен' : 'Неактивен'}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400">Маржа агента:</span>
                    <span className="text-white ml-2">{selectedRate.margin}%</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Действует с:</span>
                    <span className="text-white ml-2">{formatDate(selectedRate.validFrom)}</span>
                  </div>
                  {selectedRate.validTo && (
                    <div>
                      <span className="text-gray-400">Действует до:</span>
                      <span className="text-white ml-2">{formatDate(selectedRate.validTo)}</span>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-white mb-4">Ценообразование</h4>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="text-gray-400">Базовая стоимость:</span>
                    <span className="text-white ml-2">
                      {selectedRate.pricing.baseCost} {selectedRate.pricing.currency}/{selectedRate.pricing.unit}
                    </span>
                  </div>
                  {selectedRate.pricing.minWeight && (
                    <div>
                      <span className="text-gray-400">Мин. вес:</span>
                      <span className="text-white ml-2">{selectedRate.pricing.minWeight} кг</span>
                    </div>
                  )}
                  {selectedRate.pricing.maxWeight && (
                    <div>
                      <span className="text-gray-400">Макс. вес:</span>
                      <span className="text-white ml-2">{selectedRate.pricing.maxWeight} кг</span>
                    </div>
                  )}
                  <div>
                    <span className="text-gray-400">Дополнительные сборы:</span>
                    <div className="mt-2 space-y-1">
                      {selectedRate.pricing.additionalFees.map((fee, index) => (
                        <div key={index} className="flex justify-between">
                          <span className="text-white">{fee.name}:</span>
                          <span className="text-white">
                            {fee.cost} {fee.type === 'percentage' ? '%' : selectedRate.pricing.currency}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-white mb-4">Маршрут и время</h4>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="text-gray-400">Откуда:</span>
                    <p className="text-white">
                      {selectedRate.origin.city}, {selectedRate.origin.country}
                      {selectedRate.origin.port && ` (${selectedRate.origin.port})`}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-400">Куда:</span>
                    <p className="text-white">
                      {selectedRate.destination.city}, {selectedRate.destination.country}
                      {selectedRate.destination.port && ` (${selectedRate.destination.port})`}
                    </p>
                  </div>
                  {selectedRate.transitTime && (
                    <div>
                      <span className="text-gray-400">Время доставки:</span>
                      <span className="text-white ml-2">
                        {selectedRate.transitTime.min}-{selectedRate.transitTime.max} {selectedRate.transitTime.unit === 'days' ? 'дней' : 'часов'}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-white mb-4">Условия и требования</h4>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="text-gray-400">Типы грузов:</span>
                    <div className="mt-1">
                      {selectedRate.conditions.cargoTypes.map((type, index) => (
                        <span key={index} className="inline-block bg-blue-600 text-white text-xs px-2 py-1 rounded mr-1 mb-1">
                          {type}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-400">Ограничения:</span>
                    <ul className="mt-1 text-white list-disc list-inside">
                      {selectedRate.conditions.restrictions.map((restriction, index) => (
                        <li key={index}>{restriction}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <span className="text-gray-400">Необходимые документы:</span>
                    <ul className="mt-1 text-white list-disc list-inside">
                      {selectedRate.conditions.requiredDocuments.map((doc, index) => (
                        <li key={index}>{doc}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-700 flex gap-4">
              <button
                onClick={() => setIsEditing(true)}
                className="btn-primary"
              >
                Редактировать
              </button>
              <button
                onClick={() => handleDuplicateRate(selectedRate)}
                className="btn-secondary"
              >
                Создать копию
              </button>
              <button
                onClick={() => handleDeleteRate(selectedRate.id)}
                className="text-red-400 hover:text-red-300 px-4"
              >
                Удалить
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Excel Upload Modal */}
      {showExcelModal && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-bearplus-card-dark rounded-xl p-6 w-full max-w-2xl border border-gray-700">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white">Загрузка ставок из Excel</h3>
              <button
                onClick={() => setShowExcelModal(false)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Тип ставки
                </label>
                <select
                  value={selectedRateType}
                  onChange={(e) => setSelectedRateType(e.target.value as Rate['type'])}
                  className="select-field w-full"
                >
                  <option value="freight">Фрахт</option>
                  <option value="railway">ЖД</option>
                  <option value="auto">Авто</option>
                  <option value="container_rental">Аренда КТК</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Файл Excel
                </label>
                <input
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={handleExcelUpload}
                  className="input-field w-full"
                />
                {excelFile && (
                  <div className="mt-2 text-sm text-bearplus-green">
                    Выбран файл: {excelFile.name}
                  </div>
                )}
              </div>

              <div className="bg-bearplus-card p-4 rounded-lg">
                <h4 className="text-sm font-medium text-white mb-2">Формат файла для {getRateTypeName(selectedRateType)}:</h4>
                <div className="text-xs text-gray-400 space-y-1">
                  {selectedRateType === 'freight' && (
                    <div>Столбцы: Линия, Порт выхода, Дата выхода, Порт назначения, Путь, Тип контейнера, Вес контейнера, Цена ставки ($), DTHC, DDF, Конечная ставка ($), Примечание</div>
                  )}
                  {selectedRateType === 'railway' && (
                    <div>Столбцы: Откуда, Куда, Дата отправления, Тип контейнера, Цена ставки (₽), Примечание</div>
                  )}
                  {selectedRateType === 'auto' && (
                    <div>Столбцы: Откуда, Куда, Тип контейнера, Цена ставки (₽), Примечание</div>
                  )}
                  {selectedRateType === 'container_rental' && (
                    <div>Столбцы: Откуда, Тип контейнера, Стоимость ставки, Нормативный срок пользования, Стоимость суток свыше, Возможность локации drop off, Примечание</div>
                  )}
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleProcessExcel}
                  disabled={!excelFile || isProcessingExcel}
                  className="btn-primary flex-1"
                >
                  {isProcessingExcel ? 'Обработка...' : 'Загрузить ставки'}
                </button>
                <button
                  onClick={() => setShowExcelModal(false)}
                  className="btn-secondary flex-1"
                >
                  Отмена
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create/Edit Rate Modal */}
      {(showCreateModal || isEditing) && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-bearplus-card-dark rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-gray-700">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white">
                {isEditing ? 'Редактировать ставку' : 'Создать новую ставку'}
              </h3>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setIsEditing(false);
                  setSelectedRate(null);
                }}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Тип ставки *
                  </label>
                  <select
                    value={selectedRate?.type || 'freight'}
                    onChange={(e) => setSelectedRate(prev => ({
                      ...prev!,
                      type: e.target.value as Rate['type']
                    }))}
                    className="select-field w-full"
                  >
                    <option value="freight">Фрахт</option>
                    <option value="railway">ЖД</option>
                    <option value="auto">Авто</option>
                    <option value="container_rental">Аренда КТК</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Название ставки *
                  </label>
                  <input
                    type="text"
                    value={selectedRate?.name || ''}
                    onChange={(e) => setSelectedRate(prev => ({
                      ...prev!,
                      name: e.target.value
                    }))}
                    className="input-field w-full"
                    placeholder="Введите название ставки"
                  />
                </div>
              </div>

              {/* Type-specific fields would go here */}
              <div className="text-center py-8 text-gray-400">
                <p>Форма создания/редактирования ставок будет здесь</p>
                <p className="text-sm">Поля зависят от выбранного типа ставки</p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    // Handle save logic here
                    console.log('Saving rate');
                  }}
                  className="btn-primary flex-1"
                >
                  {isEditing ? 'Сохранить изменения' : 'Создать ставку'}
                </button>
                <button
                  onClick={() => {
                    setShowCreateModal(false);
                    setIsEditing(false);
                    setSelectedRate(null);
                  }}
                  className="btn-secondary flex-1"
                >
                  Отмена
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RatesManagement;