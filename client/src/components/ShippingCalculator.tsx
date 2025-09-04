import * as React from 'react';
import { useState } from 'react';
import { apiService } from '../services/apiService';

interface ShippingCalculatorProps {
  className?: string;
}

export type TransportType = 'freight' | 'auto' | 'railway';
export type CargoType = 'normal' | 'dangerous' | 'consolidated' | 'consolidated_dangerous';

interface CalculatorFormData {
  transportType: TransportType;
  departure: string;
  arrival: string;
  containerType: string;
  cargoType: CargoType;
  weight: string;
  dimensions?: {
    length: string;
    width: string;
    height: string;
  };
  departureDate: string;
  arrivalDate: string;
  deliveryType: 'direct' | 'with_stops';
  msdsFiles: File[];
}

const ShippingCalculator: React.FC<ShippingCalculatorProps> = ({ className = '' }) => {
  const [formData, setFormData] = useState<CalculatorFormData>({
    transportType: 'freight',
    departure: '',
    arrival: '',
    containerType: '',
    cargoType: 'normal',
    weight: '',
    dimensions: {
      length: '',
      width: '',
      height: ''
    },
    departureDate: '',
    arrivalDate: '',
    deliveryType: 'direct',
    msdsFiles: []
  });

  const [isCalculating, setIsCalculating] = useState(false);
  const [calculationResult, setCalculationResult] = useState<any>(null);

  const containerTypes = {
    freight: [
      { value: '20ft', label: '20\' контейнер' },
      { value: '40ft', label: '40\' контейнер' },
      { value: '40hc', label: '40\' HC контейнер' },
      { value: '45ft', label: '45\' контейнер' },
      { value: 'reefer20', label: '20\' рефрижератор' },
      { value: 'reefer40', label: '40\' рефрижератор' },
    ],
    auto: [
      { value: 'truck', label: 'Грузовик до 20т' },
      { value: 'semitrailer', label: 'Полуприцеп' },
      { value: 'jumbo', label: 'Джамбо' },
    ],
    railway: [
      { value: 'container20', label: '20\' контейнер' },
      { value: 'container40', label: '40\' контейнер' },
      { value: 'wagon', label: 'Крытый вагон' },
      { value: 'platform', label: 'Платформа' },
    ]
  };

  const transportTypeLabels = {
    freight: 'Фрахт',
    auto: 'Авто',
    railway: 'ЖД'
  };

  const handleTransportTypeChange = (type: TransportType) => {
    setFormData(prev => ({
      ...prev,
      transportType: type,
      containerType: '' // Reset container type when transport type changes
    }));
  };

  const handleInputChange = (field: keyof CalculatorFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setFormData(prev => ({
      ...prev,
      msdsFiles: [...prev.msdsFiles, ...files]
    }));
  };

  const removeFile = (index: number) => {
    setFormData(prev => ({
      ...prev,
      msdsFiles: prev.msdsFiles.filter((_, i) => i !== index)
    }));
  };

  const handleCalculate = async () => {
    setIsCalculating(true);
    
    try {
      // Check if request should be sent for review
      const needsReview = formData.cargoType === 'dangerous' ||
                         formData.cargoType === 'consolidated' ||
                         formData.cargoType === 'consolidated_dangerous';
      
      if (needsReview) {
        // Send request for review
        const response = await apiService.shipping.submitDangerousCargoRequest(formData);
        
        if (response.success) {
          alert('Запрос отправлен на рассмотрение логистам. Мы свяжемся с вами в ближайшее время с индивидуальным предложением.');
        } else {
          alert('Ошибка при отправке запроса: ' + (response.message || 'Неизвестная ошибка'));
        }
        setIsCalculating(false);
        return;
      }

      // Calculate shipping cost for normal cargo
      const response = await apiService.shipping.calculateRate(formData);
      
      if (response.success) {
        setCalculationResult(response.data);
      } else {
        alert('Ошибка при расчете стоимости доставки: ' + (response.message || 'Неизвестная ошибка'));
      }
    } catch (error) {
      console.error('Calculation error:', error);
      alert('Ошибка при расчете стоимости доставки');
    } finally {
      setIsCalculating(false);
    }
  };

  const isFormValid = formData.departure && formData.arrival && formData.containerType && formData.weight;

  const getButtonText = () => {
    const needsReview = formData.cargoType === 'dangerous' ||
                       formData.cargoType === 'consolidated' ||
                       formData.cargoType === 'consolidated_dangerous';
    
    if (isCalculating) return 'Обработка...';
    return needsReview ? 'Оставить запрос' : 'Найти варианты';
  };

  const showDimensions = formData.cargoType === 'consolidated' || formData.cargoType === 'consolidated_dangerous';
  const showMsds = formData.cargoType === 'dangerous' || formData.cargoType === 'consolidated_dangerous';

  return (
    <div className={`card relative overflow-hidden animate-fade-in ${className}`}>
      <div className="absolute inset-0 bg-gradient-to-br from-tech-primary/3 via-transparent to-tech-secondary/3"></div>
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 bg-tech-primary/10 rounded-lg border border-tech-primary/20">
            <span className="text-xl">🧮</span>
          </div>
          <h2 className="text-tech-title">Расчет доставки</h2>
        </div>
        
        {/* Modern Transport Type Toggle */}
        <div className="radio-tabs mb-8">
          {(Object.keys(transportTypeLabels) as TransportType[]).map((type) => (
            <button
              key={type}
              onClick={() => handleTransportTypeChange(type)}
              className={`radio-tab ${formData.transportType === type ? 'active' : 'inactive'}`}
            >
              <span className="mr-2">
                {type === 'freight' ? '🚢' : type === 'auto' ? '🚛' : '🚂'}
              </span>
              {transportTypeLabels[type]}
            </button>
          ))}
        </div>

        <div className="grid tech-grid-2 gap-6 mb-8">
          {/* Departure */}
          <div className="form-group">
            <label className="form-label">
              📍 Пункт отправления *
            </label>
            <input
              type="text"
              value={formData.departure}
              onChange={(e) => handleInputChange('departure', e.target.value)}
              placeholder="Москва, Санкт-Петербург..."
              className="input-field"
            />
          </div>

          {/* Arrival */}
          <div className="form-group">
            <label className="form-label">
              🎯 Пункт прибытия *
            </label>
            <input
              type="text"
              value={formData.arrival}
              onChange={(e) => handleInputChange('arrival', e.target.value)}
              placeholder="Шанхай, Гамбург..."
              className="input-field"
            />
          </div>

          {/* Container Type */}
          <div className="form-group">
            <label className="form-label">
              📦 Тип контейнера *
            </label>
            <select
              value={formData.containerType}
              onChange={(e) => handleInputChange('containerType', e.target.value)}
              className="select-field"
            >
              <option value="">Выберите тип</option>
              {containerTypes[formData.transportType].map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {/* Weight */}
          <div className="form-group">
            <label className="form-label">
              ⚖️ Вес груза (кг) *
            </label>
            <input
              type="number"
              value={formData.weight}
              onChange={(e) => handleInputChange('weight', e.target.value)}
              placeholder="15000"
              className="input-field"
            />
          </div>

          {/* Departure Date */}
          <div className="form-group">
            <label className="form-label">
              🗓️ Дата отправления
            </label>
            <input
              type="date"
              value={formData.departureDate}
              onChange={(e) => handleInputChange('departureDate', e.target.value)}
              className="input-field"
            />
          </div>

          {/* Arrival Date */}
          <div className="form-group">
            <label className="form-label">
              📅 Дата прибытия
            </label>
            <input
              type="date"
              value={formData.arrivalDate}
              onChange={(e) => handleInputChange('arrivalDate', e.target.value)}
              className="input-field"
            />
          </div>
        </div>

        {/* Modern Delivery Type */}
        <div className="mb-8">
          <label className="form-label mb-4">
            🚀 Тип доставки
          </label>
          <div className="grid tech-grid-2 gap-4">
            <label className="card-interactive p-4 cursor-pointer border border-tech-border">
              <input
                type="radio"
                name="deliveryType"
                value="direct"
                checked={formData.deliveryType === 'direct'}
                onChange={(e) => handleInputChange('deliveryType', e.target.value as 'direct' | 'with_stops')}
                className="sr-only"
              />
              <div className="flex items-center gap-3">
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  formData.deliveryType === 'direct'
                    ? 'bg-tech-primary border-tech-primary'
                    : 'border-tech-border-light'
                }`}>
                  {formData.deliveryType === 'direct' && (
                    <div className="w-2 h-2 bg-tech-bg rounded-full"></div>
                  )}
                </div>
                <div>
                  <div className="text-tech-body font-medium">Прямой рейс</div>
                  <div className="text-tech-caption">Без промежуточных остановок</div>
                </div>
              </div>
            </label>
            <label className="card-interactive p-4 cursor-pointer border border-tech-border">
              <input
                type="radio"
                name="deliveryType"
                value="with_stops"
                checked={formData.deliveryType === 'with_stops'}
                onChange={(e) => handleInputChange('deliveryType', e.target.value as 'direct' | 'with_stops')}
                className="sr-only"
              />
              <div className="flex items-center gap-3">
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  formData.deliveryType === 'with_stops'
                    ? 'bg-tech-primary border-tech-primary'
                    : 'border-tech-border-light'
                }`}>
                  {formData.deliveryType === 'with_stops' && (
                    <div className="w-2 h-2 bg-tech-bg rounded-full"></div>
                  )}
                </div>
                <div>
                  <div className="text-tech-body font-medium">С заходом в порт</div>
                  <div className="text-tech-caption">Возможны промежуточные остановки</div>
                </div>
              </div>
            </label>
          </div>
        </div>

        {/* Modern Cargo Type */}
        <div className="mb-8">
          <label className="form-label mb-4">
            📋 Характеристики груза
          </label>
          <div className="grid tech-grid-2 gap-3">
            {[
              { value: 'normal', label: 'Неопасный груз', icon: '✅', desc: 'Стандартные товары' },
              { value: 'dangerous', label: 'Опасный груз', icon: '⚠️', desc: 'Требует MSDS' },
              { value: 'consolidated', label: 'Сборный груз', icon: '📦', desc: 'Частичная загрузка' },
              { value: 'consolidated_dangerous', label: 'Сборный + Опасный', icon: '🚨', desc: 'Особые требования' }
            ].map((option) => (
              <label key={option.value} className="card-interactive p-3 cursor-pointer border border-tech-border">
                <input
                  type="radio"
                  name="cargoType"
                  value={option.value}
                  checked={formData.cargoType === option.value}
                  onChange={(e) => handleInputChange('cargoType', e.target.value as CargoType)}
                  className="sr-only"
                />
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    formData.cargoType === option.value
                      ? 'bg-tech-primary border-tech-primary'
                      : 'border-tech-border-light'
                  }`}>
                    {formData.cargoType === option.value && (
                      <div className="w-2 h-2 bg-tech-bg rounded-full"></div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{option.icon}</span>
                      <span className="text-tech-body font-medium">{option.label}</span>
                    </div>
                    <div className="text-tech-caption">{option.desc}</div>
                  </div>
                </div>
              </label>
            ))}
          </div>
        </div>

      {/* Dimensions for consolidated cargo */}
      {showDimensions && (
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Габариты груза
          </label>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <input
                type="number"
                value={formData.dimensions?.length || ''}
                onChange={(e) => handleInputChange('dimensions', {
                  ...formData.dimensions,
                  length: e.target.value
                })}
                placeholder="Длина (см)"
                className="input-field w-full"
              />
            </div>
            <div>
              <input
                type="number"
                value={formData.dimensions?.width || ''}
                onChange={(e) => handleInputChange('dimensions', {
                  ...formData.dimensions,
                  width: e.target.value
                })}
                placeholder="Ширина (см)"
                className="input-field w-full"
              />
            </div>
            <div>
              <input
                type="number"
                value={formData.dimensions?.height || ''}
                onChange={(e) => handleInputChange('dimensions', {
                  ...formData.dimensions,
                  height: e.target.value
                })}
                placeholder="Высота (см)"
                className="input-field w-full"
              />
            </div>
          </div>
        </div>
      )}

      {/* MSDS Upload for dangerous cargo */}
      {showMsds && (
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Загрузить MSDS документы
          </label>
          <input
            type="file"
            multiple
            accept=".pdf,.doc,.docx"
            onChange={handleFileUpload}
            className="input-field w-full"
          />
          {formData.msdsFiles.length > 0 && (
            <div className="mt-2">
              {formData.msdsFiles.map((file, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-700 p-2 rounded mb-1">
                  <span className="text-sm text-white">{file.name}</span>
                  <button
                    onClick={() => removeFile(index)}
                    className="text-red-400 hover:text-red-300"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

        {/* Modern Calculate Button */}
        <div className="flex justify-center mt-10">
          <button
            onClick={handleCalculate}
            disabled={!isFormValid || isCalculating}
            className="btn-primary px-8 relative group"
          >
            {isCalculating && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-4 h-4 border-2 border-tech-bg border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
            <span className={isCalculating ? 'opacity-0' : 'opacity-100'}>
              {getButtonText()}
            </span>
          </button>
        </div>

        {/* Modern Calculation Result */}
        {calculationResult && (
          <div className="mt-8 card bg-tech-surface border-tech-primary/30 relative overflow-hidden animate-slide-up">
            <div className="absolute inset-0 bg-gradient-to-br from-tech-primary/10 via-transparent to-tech-secondary/10"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-tech-primary/20 rounded-lg border border-tech-primary/30">
                  <span className="text-lg">📊</span>
                </div>
                <h3 className="text-tech-subtitle text-gradient">Результат расчета</h3>
              </div>
              <div className="grid tech-grid-2 gap-6">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-tech-caption">Маршрут:</span>
                    <span className="text-tech-body font-medium">{calculationResult.route}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-tech-caption">Время в пути:</span>
                    <span className="text-tech-body font-medium">{calculationResult.transitTime} дней</span>
                  </div>
                </div>
                <div className="flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-tech-caption mb-1">Стоимость доставки</div>
                    <div className="text-2xl font-bold text-gradient">
                      {calculationResult.totalCost?.toLocaleString()} {calculationResult.currency}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShippingCalculator;