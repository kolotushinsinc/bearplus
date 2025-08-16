import * as React from 'react';
import { useState } from 'react';

interface ShippingCalculatorProps {
  className?: string;
}

export type TransportType = 'freight' | 'auto' | 'railway';

interface CalculatorFormData {
  transportType: TransportType;
  departure: string;
  arrival: string;
  containerType: string;
  cargoType: 'dangerous' | 'normal';
  weight: string;
  departureDate: string;
  arrivalDate: string;
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
    departureDate: '',
    arrivalDate: '',
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
      // If dangerous cargo, send for review
      if (formData.cargoType === 'dangerous') {
        // Send to logistics for review
        alert('Запрос с опасным грузом отправлен на рассмотрение логистам. Мы свяжемся с вами в ближайшее время.');
        setIsCalculating(false);
        return;
      }

      // Calculate shipping cost
      const response = await fetch('/api/shipping/calculate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const result = await response.json();
        setCalculationResult(result);
      } else {
        alert('Ошибка при расчете стоимости доставки');
      }
    } catch (error) {
      console.error('Calculation error:', error);
      alert('Ошибка при расчете стоимости доставки');
    } finally {
      setIsCalculating(false);
    }
  };

  const isFormValid = formData.departure && formData.arrival && formData.containerType && formData.weight;

  return (
    <div className={`card ${className}`}>
      <h2 className="text-2xl font-bold text-white mb-6">Расчет доставки</h2>
      
      {/* Transport Type Toggle */}
      <div className="radio-tabs mb-6">
        {(Object.keys(transportTypeLabels) as TransportType[]).map((type) => (
          <button
            key={type}
            onClick={() => handleTransportTypeChange(type)}
            className={`radio-tab ${formData.transportType === type ? 'active' : 'inactive'}`}
          >
            {transportTypeLabels[type]}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Departure */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Пункт отправления *
          </label>
          <input
            type="text"
            value={formData.departure}
            onChange={(e) => handleInputChange('departure', e.target.value)}
            placeholder="Введите город отправления"
            className="input-field w-full"
          />
        </div>

        {/* Arrival */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Пункт прибытия *
          </label>
          <input
            type="text"
            value={formData.arrival}
            onChange={(e) => handleInputChange('arrival', e.target.value)}
            placeholder="Введите город прибытия"
            className="input-field w-full"
          />
        </div>

        {/* Container Type */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Тип контейнера *
          </label>
          <select
            value={formData.containerType}
            onChange={(e) => handleInputChange('containerType', e.target.value)}
            className="select-field w-full"
          >
            <option value="">Выберите тип контейнера</option>
            {containerTypes[formData.transportType].map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        {/* Weight */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Вес груза (кг) *
          </label>
          <input
            type="number"
            value={formData.weight}
            onChange={(e) => handleInputChange('weight', e.target.value)}
            placeholder="Введите вес груза"
            className="input-field w-full"
          />
        </div>

        {/* Departure Date */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Желаемая дата отправления
          </label>
          <input
            type="date"
            value={formData.departureDate}
            onChange={(e) => handleInputChange('departureDate', e.target.value)}
            className="input-field w-full"
          />
        </div>

        {/* Arrival Date */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Желаемая дата прибытия
          </label>
          <input
            type="date"
            value={formData.arrivalDate}
            onChange={(e) => handleInputChange('arrivalDate', e.target.value)}
            className="input-field w-full"
          />
        </div>
      </div>

      {/* Cargo Type */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Характеристики груза
        </label>
        <div className="flex gap-4">
          <label className="flex items-center">
            <input
              type="radio"
              name="cargoType"
              value="normal"
              checked={formData.cargoType === 'normal'}
              onChange={(e) => handleInputChange('cargoType', e.target.value as 'normal' | 'dangerous')}
              className="sr-only"
            />
            <div className={`w-4 h-4 rounded-full border-2 mr-2 ${
              formData.cargoType === 'normal' 
                ? 'bg-bearplus-green border-bearplus-green' 
                : 'border-gray-500'
            }`}>
              {formData.cargoType === 'normal' && (
                <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5"></div>
              )}
            </div>
            <span className="text-white">Неопасный груз</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="cargoType"
              value="dangerous"
              checked={formData.cargoType === 'dangerous'}
              onChange={(e) => handleInputChange('cargoType', e.target.value as 'normal' | 'dangerous')}
              className="sr-only"
            />
            <div className={`w-4 h-4 rounded-full border-2 mr-2 ${
              formData.cargoType === 'dangerous' 
                ? 'bg-bearplus-green border-bearplus-green' 
                : 'border-gray-500'
            }`}>
              {formData.cargoType === 'dangerous' && (
                <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5"></div>
              )}
            </div>
            <span className="text-white">Опасный груз</span>
          </label>
        </div>
      </div>

      {/* MSDS Upload for dangerous cargo */}
      {formData.cargoType === 'dangerous' && (
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

      {/* Calculate Button */}
      <button
        onClick={handleCalculate}
        disabled={!isFormValid || isCalculating}
        className="btn-primary w-full"
      >
        {isCalculating ? 'Расчет...' : 'Рассчитать стоимость'}
      </button>

      {/* Calculation Result */}
      {calculationResult && (
        <div className="mt-6 p-4 bg-bearplus-card-dark rounded-lg border border-bearplus-green">
          <h3 className="text-lg font-bold text-bearplus-green mb-2">Результат расчета</h3>
          <div className="text-white">
            <p>Маршрут: {calculationResult.route}</p>
            <p>Время в пути: {calculationResult.transitTime} дней</p>
            <p className="text-xl font-bold text-bearplus-green">
              Стоимость: {calculationResult.totalCost} {calculationResult.currency}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShippingCalculator;