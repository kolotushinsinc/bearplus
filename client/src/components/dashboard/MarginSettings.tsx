import * as React from 'react';
import { useState, useEffect } from 'react';
import { useAppSelector } from '../../hooks/redux';

interface MarginRule {
  id: string;
  name: string;
  description: string;
  type: 'flat' | 'percentage' | 'tiered' | 'volume_based';
  serviceTypes: ('sea_freight' | 'air_freight' | 'land_freight' | 'customs' | 'warehouse' | 'insurance')[];
  conditions: {
    minOrderValue?: number;
    maxOrderValue?: number;
    minVolume?: number;
    maxVolume?: number;
    currency: 'USD' | 'EUR' | 'RUB';
    clientTypes?: ('new' | 'regular' | 'vip' | 'corporate')[];
    routes?: Array<{
      origin: string;
      destination: string;
    }>;
  };
  marginValues: {
    baseMargin: number;
    tiers?: Array<{
      minValue: number;
      maxValue?: number;
      margin: number;
    }>;
  };
  priority: number;
  isActive: boolean;
  validFrom: string;
  validTo?: string;
  createdBy: string;
  lastUpdated: string;
}

interface ClientMarginOverride {
  id: string;
  clientId: string;
  clientName: string;
  marginRuleId?: string;
  customMargin: number;
  reason: string;
  isActive: boolean;
  validFrom: string;
  validTo?: string;
  approvedBy: string;
  createdAt: string;
}

interface MarginStats {
  averageMargin: number;
  totalRevenue: number;
  marginRevenue: number;
  ordersCount: number;
  topPerformingRules: Array<{
    ruleId: string;
    ruleName: string;
    ordersCount: number;
    revenue: number;
    averageMargin: number;
  }>;
  monthlyStats: Array<{
    month: string;
    revenue: number;
    margin: number;
    ordersCount: number;
  }>;
}

// Margin Rule Modal Component
interface MarginRuleModalProps {
  rule: MarginRule | null;
  onSave: (rule: MarginRule) => void;
  onClose: () => void;
}

const MarginRuleModal: React.FC<MarginRuleModalProps> = ({ rule, onSave, onClose }) => {
  const { user } = useAppSelector((state) => state.auth);
  const [formData, setFormData] = useState<Partial<MarginRule>>({
    id: rule?.id || 'new',
    name: rule?.name || '',
    description: rule?.description || '',
    type: rule?.type || 'percentage',
    serviceTypes: rule?.serviceTypes || [],
    conditions: {
      minOrderValue: rule?.conditions.minOrderValue || 0,
      maxOrderValue: rule?.conditions.maxOrderValue || undefined,
      currency: rule?.conditions.currency || 'USD',
      clientTypes: rule?.conditions.clientTypes || []
    },
    marginValues: {
      baseMargin: rule?.marginValues.baseMargin || 0,
      tiers: rule?.marginValues.tiers || []
    },
    priority: rule?.priority || 1,
    isActive: rule?.isActive ?? true,
    validFrom: rule?.validFrom || new Date().toISOString().split('T')[0],
    validTo: rule?.validTo || undefined,
    createdBy: rule?.createdBy || '',
    lastUpdated: rule?.lastUpdated || ''
  });

  const serviceTypeOptions = [
    { value: 'sea_freight', label: 'Морские перевозки' },
    { value: 'air_freight', label: 'Авиаперевозки' },
    { value: 'land_freight', label: 'Автоперевозки' },
    { value: 'customs', label: 'Таможенное оформление' },
    { value: 'warehouse', label: 'Складские услуги' },
    { value: 'insurance', label: 'Страхование' }
  ];

  const clientTypeOptions = [
    { value: 'new', label: 'Новый' },
    { value: 'regular', label: 'Обычный' },
    { value: 'vip', label: 'VIP' },
    { value: 'corporate', label: 'Корпоративный' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.marginValues?.baseMargin) {
      onSave(formData as MarginRule);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-bearplus-card-dark rounded-xl p-6 w-full max-w-4xl border border-gray-700 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-white">
            {rule ? 'Редактировать правило маржи' : 'Создать правило маржи'}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Название</label>
              <input
                type="text"
                value={formData.name || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="input-field"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Тип маржи</label>
              <select
                value={formData.type || 'percentage'}
                onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as any }))}
                className="input-field"
              >
                <option value="flat">Фиксированная</option>
                <option value="percentage">Процентная</option>
                <option value="tiered">Многоуровневая</option>
                <option value="volume_based">По объему</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Описание</label>
            <textarea
              value={formData.description || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="input-field"
              rows={3}
            />
          </div>

          {/* Service Types */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Типы услуг</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {serviceTypeOptions.map(option => (
                <label key={option.value} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.serviceTypes?.includes(option.value as any) || false}
                    onChange={(e) => {
                      const value = option.value as any;
                      setFormData(prev => ({
                        ...prev,
                        serviceTypes: e.target.checked
                          ? [...(prev.serviceTypes || []), value]
                          : (prev.serviceTypes || []).filter(t => t !== value)
                      }));
                    }}
                    className="rounded border-gray-600 bg-bearplus-card text-bearplus-green focus:ring-bearplus-green"
                  />
                  <span className="text-sm text-gray-300">{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Conditions */}
          <div className="bg-bearplus-card rounded-lg p-4 space-y-4">
            <h4 className="font-medium text-white">Условия применения</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Мин. сумма заказа</label>
                <input
                  type="number"
                  value={formData.conditions?.minOrderValue || ''}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    conditions: { ...prev.conditions!, minOrderValue: Number(e.target.value) }
                  }))}
                  className="input-field"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Макс. сумма заказа</label>
                <input
                  type="number"
                  value={formData.conditions?.maxOrderValue || ''}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    conditions: { ...prev.conditions!, maxOrderValue: e.target.value ? Number(e.target.value) : undefined }
                  }))}
                  className="input-field"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Валюта</label>
                <select
                  value={formData.conditions?.currency || 'USD'}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    conditions: { ...prev.conditions!, currency: e.target.value as any }
                  }))}
                  className="input-field"
                >
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="RUB">RUB</option>
                </select>
              </div>
            </div>

            {/* Client Types */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Типы клиентов</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {clientTypeOptions.map(option => (
                  <label key={option.value} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.conditions?.clientTypes?.includes(option.value as any) || false}
                      onChange={(e) => {
                        const value = option.value as any;
                        setFormData(prev => ({
                          ...prev,
                          conditions: {
                            ...prev.conditions!,
                            clientTypes: e.target.checked
                              ? [...(prev.conditions?.clientTypes || []), value]
                              : (prev.conditions?.clientTypes || []).filter(t => t !== value)
                          }
                        }));
                      }}
                      className="rounded border-gray-600 bg-bearplus-card text-bearplus-green focus:ring-bearplus-green"
                    />
                    <span className="text-sm text-gray-300">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Margin Values */}
          <div className="bg-bearplus-card rounded-lg p-4 space-y-4">
            <h4 className="font-medium text-white">Настройки маржи</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Базовая маржа (%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.marginValues?.baseMargin || ''}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    marginValues: { ...prev.marginValues!, baseMargin: Number(e.target.value) }
                  }))}
                  className="input-field"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Приоритет</label>
                <input
                  type="number"
                  value={formData.priority || 1}
                  onChange={(e) => setFormData(prev => ({ ...prev, priority: Number(e.target.value) }))}
                  className="input-field"
                  min="1"
                />
              </div>
            </div>
          </div>

          {/* Validity Period */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Действует с</label>
              <input
                type="date"
                value={formData.validFrom?.split('T')[0] || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, validFrom: e.target.value }))}
                className="input-field"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Действует до (опционально)</label>
              <input
                type="date"
                value={formData.validTo?.split('T')[0] || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, validTo: e.target.value || undefined }))}
                className="input-field"
              />
            </div>
          </div>

          {/* Active Status */}
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={formData.isActive ?? true}
              onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
              className="rounded border-gray-600 bg-bearplus-card text-bearplus-green focus:ring-bearplus-green"
            />
            <span className="text-sm text-gray-300">Правило активно</span>
          </label>

          {/* Actions */}
          <div className="flex gap-4 pt-4 border-t border-gray-700">
            <button type="button" onClick={onClose} className="btn-secondary flex-1">
              Отменить
            </button>
            <button type="submit" className="btn-primary flex-1">
              {rule ? 'Сохранить изменения' : 'Создать правило'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Client Override Modal Component
interface ClientOverrideModalProps {
  onSave: (override: Omit<ClientMarginOverride, 'id' | 'createdAt'>) => void;
  onClose: () => void;
}

const ClientOverrideModal: React.FC<ClientOverrideModalProps> = ({ onSave, onClose }) => {
  const { user } = useAppSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    clientId: '',
    clientName: '',
    marginRuleId: '',
    customMargin: 0,
    reason: '',
    isActive: true,
    validFrom: new Date().toISOString().split('T')[0],
    validTo: '',
    approvedBy: user?.firstName + ' ' + user?.lastName || 'Агент'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.clientName && formData.customMargin && formData.reason) {
      onSave({
        ...formData,
        validTo: formData.validTo || undefined
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-bearplus-card-dark rounded-xl p-6 w-full max-w-2xl border border-gray-700" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-white">Индивидуальная настройка маржи</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Название клиента</label>
              <input
                type="text"
                value={formData.clientName}
                onChange={(e) => setFormData(prev => ({ ...prev, clientName: e.target.value }))}
                className="input-field"
                placeholder="ООО 'Название компании'"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">ID клиента</label>
              <input
                type="text"
                value={formData.clientId}
                onChange={(e) => setFormData(prev => ({ ...prev, clientId: e.target.value }))}
                className="input-field"
                placeholder="client123"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Индивидуальная маржа (%)</label>
            <input
              type="number"
              step="0.1"
              value={formData.customMargin}
              onChange={(e) => setFormData(prev => ({ ...prev, customMargin: Number(e.target.value) }))}
              className="input-field"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Причина</label>
            <textarea
              value={formData.reason}
              onChange={(e) => setFormData(prev => ({ ...prev, reason: e.target.value }))}
              className="input-field"
              placeholder="Долгосрочное партнерство, большие объемы..."
              rows={3}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Действует с</label>
              <input
                type="date"
                value={formData.validFrom}
                onChange={(e) => setFormData(prev => ({ ...prev, validFrom: e.target.value }))}
                className="input-field"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Действует до (опционально)</label>
              <input
                type="date"
                value={formData.validTo}
                onChange={(e) => setFormData(prev => ({ ...prev, validTo: e.target.value }))}
                className="input-field"
              />
            </div>
          </div>

          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={formData.isActive}
              onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
              className="rounded border-gray-600 bg-bearplus-card text-bearplus-green focus:ring-bearplus-green"
            />
            <span className="text-sm text-gray-300">Настройка активна</span>
          </label>

          <div className="flex gap-4 pt-4 border-t border-gray-700">
            <button type="button" onClick={onClose} className="btn-secondary flex-1">
              Отменить
            </button>
            <button type="submit" className="btn-primary flex-1">
              Создать настройку
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const MarginSettings: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);
  const [marginRules, setMarginRules] = useState<MarginRule[]>([]);
  const [clientOverrides, setClientOverrides] = useState<ClientMarginOverride[]>([]);
  const [stats, setStats] = useState<MarginStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'rules' | 'overrides' | 'stats'>('rules');
  const [selectedRule, setSelectedRule] = useState<MarginRule | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showOverrideModal, setShowOverrideModal] = useState(false);

  useEffect(() => {
    fetchMarginData();
  }, []);

  const fetchMarginData = async () => {
    try {
      setIsLoading(true);
      
      // Mock margin rules data
      const mockRules: MarginRule[] = [
        {
          id: 'rule1',
          name: 'Стандартная маржа морских перевозок',
          description: 'Базовая маржа для морских контейнерных перевозок',
          type: 'percentage',
          serviceTypes: ['sea_freight'],
          conditions: {
            minOrderValue: 1000,
            currency: 'USD',
            clientTypes: ['regular', 'new']
          },
          marginValues: {
            baseMargin: 15
          },
          priority: 1,
          isActive: true,
          validFrom: '2024-01-01T00:00:00Z',
          createdBy: user?.firstName + ' ' + user?.lastName || 'Агент',
          lastUpdated: '2024-01-15T10:00:00Z'
        },
        {
          id: 'rule2',
          name: 'VIP клиенты - сниженная маржа',
          description: 'Льготная маржа для VIP клиентов с большим объемом',
          type: 'tiered',
          serviceTypes: ['sea_freight', 'air_freight', 'land_freight'],
          conditions: {
            minOrderValue: 5000,
            currency: 'USD',
            clientTypes: ['vip', 'corporate']
          },
          marginValues: {
            baseMargin: 10,
            tiers: [
              { minValue: 5000, maxValue: 20000, margin: 10 },
              { minValue: 20000, maxValue: 50000, margin: 8 },
              { minValue: 50000, margin: 6 }
            ]
          },
          priority: 2,
          isActive: true,
          validFrom: '2024-01-01T00:00:00Z',
          createdBy: user?.firstName + ' ' + user?.lastName || 'Агент',
          lastUpdated: '2024-01-10T14:00:00Z'
        }
      ];

      // Mock client overrides
      const mockOverrides: ClientMarginOverride[] = [
        {
          id: 'override1',
          clientId: 'client1',
          clientName: 'ООО "Крупный Импортёр"',
          marginRuleId: 'rule1',
          customMargin: 12,
          reason: 'Долгосрочное партнерство, большие объемы',
          isActive: true,
          validFrom: '2024-01-01T00:00:00Z',
          validTo: '2024-12-31T23:59:59Z',
          approvedBy: 'Директор',
          createdAt: '2024-01-05T10:00:00Z'
        }
      ];

      // Mock stats
      const mockStats: MarginStats = {
        averageMargin: 16.8,
        totalRevenue: 285000,
        marginRevenue: 47880,
        ordersCount: 142,
        topPerformingRules: [
          {
            ruleId: 'rule1',
            ruleName: 'Стандартная маржа морских перевозок',
            ordersCount: 89,
            revenue: 180000,
            averageMargin: 15
          }
        ],
        monthlyStats: [
          { month: '2024-01', revenue: 60000, margin: 10800, ordersCount: 27 }
        ]
      };

      setTimeout(() => {
        setMarginRules(mockRules);
        setClientOverrides(mockOverrides);
        setStats(mockStats);
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching margin data:', error);
      setIsLoading(false);
    }
  };

  const handleSaveRule = async (rule: MarginRule) => {
    try {
      console.log('Saving margin rule:', rule);
      
      if (rule.id === 'new') {
        const newRule = {
          ...rule,
          id: Date.now().toString(),
          createdBy: user?.firstName + ' ' + user?.lastName || 'Агент',
          lastUpdated: new Date().toISOString()
        };
        setMarginRules(prev => [...prev, newRule]);
      } else {
        setMarginRules(prev => prev.map(r => r.id === rule.id ? {
          ...rule,
          lastUpdated: new Date().toISOString()
        } : r));
      }

      setIsEditing(false);
      setSelectedRule(null);
      setShowCreateModal(false);
    } catch (error) {
      console.error('Error saving margin rule:', error);
    }
  };

  const handleDeleteRule = async (ruleId: string) => {
    if (confirm('Вы уверены, что хотите удалить это правило маржи?')) {
      try {
        console.log('Deleting margin rule:', ruleId);
        setMarginRules(prev => prev.filter(r => r.id !== ruleId));
        setSelectedRule(null);
      } catch (error) {
        console.error('Error deleting margin rule:', error);
      }
    }
  };

  const getServiceTypeName = (type: string) => {
    switch (type) {
      case 'sea_freight': return 'Морские перевозки';
      case 'air_freight': return 'Авиаперевозки';
      case 'land_freight': return 'Автоперевозки';
      case 'customs': return 'Таможенное оформление';
      case 'warehouse': return 'Складские услуги';
      case 'insurance': return 'Страхование';
      default: return type;
    }
  };

  const getClientTypeName = (type: string) => {
    switch (type) {
      case 'new': return 'Новый';
      case 'regular': return 'Обычный';
      case 'vip': return 'VIP';
      case 'corporate': return 'Корпоративный';
      default: return type;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU');
  };

  const formatCurrency = (amount: number, currency: string = 'USD') => {
    const symbols = { USD: '$', EUR: '€', RUB: '₽' };
    return `${symbols[currency as keyof typeof symbols] || currency} ${amount.toLocaleString()}`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-white text-xl">Загрузка настроек маржи...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Настройки маржи</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setShowOverrideModal(true)}
            className="btn-secondary"
          >
            ➕ Индивидуальная маржа
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn-primary"
          >
            ➕ Новое правило
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-bearplus-card rounded-lg">
        <div className="border-b border-gray-700">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'rules', label: 'Правила маржи' },
              { id: 'overrides', label: 'Индивидуальные настройки' },
              { id: 'stats', label: 'Статистика' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-4 px-2 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-bearplus-green text-bearplus-green'
                    : 'border-transparent text-gray-400 hover:text-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* Rules Tab */}
          {activeTab === 'rules' && (
            <div className="space-y-4">
              {marginRules.map((rule) => (
                <div
                  key={rule.id}
                  className={`bg-bearplus-card-dark rounded-lg p-6 cursor-pointer transition-colors border-2 ${
                    selectedRule?.id === rule.id
                      ? 'border-bearplus-green'
                      : rule.isActive
                      ? 'border-transparent hover:border-gray-600'
                      : 'border-red-600/30 opacity-75'
                  }`}
                  onClick={() => setSelectedRule(rule)}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-semibold text-white mb-1">{rule.name}</h3>
                      <p className="text-sm text-gray-400">{rule.description}</p>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {!rule.isActive && (
                        <span className="bg-red-600 text-white text-xs px-2 py-1 rounded">
                          Неактивно
                        </span>
                      )}
                      <span className="bg-bearplus-green text-black text-sm px-3 py-1 rounded font-semibold">
                        {rule.marginValues.baseMargin}%
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-400">Тип:</span>
                      <p className="text-white">
                        {rule.type === 'flat' ? 'Фиксированная' :
                         rule.type === 'percentage' ? 'Процентная' :
                         rule.type === 'tiered' ? 'Многоуровневая' : 'По объему'}
                      </p>
                    </div>

                    <div>
                      <span className="text-gray-400">Услуги:</span>
                      <p className="text-white">
                        {rule.serviceTypes.map(type => getServiceTypeName(type)).join(', ')}
                      </p>
                    </div>

                    <div>
                      <span className="text-gray-400">Приоритет:</span>
                      <p className="text-white">{rule.priority}</p>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-4 pt-4 border-t border-gray-700">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedRule(rule);
                        setIsEditing(true);
                      }}
                      className="btn-secondary text-xs flex-1"
                    >
                      Редактировать
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteRule(rule.id);
                      }}
                      className="text-red-400 hover:text-red-300 text-xs px-2"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Overrides Tab */}
          {activeTab === 'overrides' && (
            <div className="space-y-4">
              {clientOverrides.map((override) => (
                <div
                  key={override.id}
                  className={`bg-bearplus-card-dark rounded-lg p-6 border-2 ${
                    override.isActive ? 'border-transparent' : 'border-red-600/30 opacity-75'
                  }`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-semibold text-white mb-1">{override.clientName}</h3>
                      <p className="text-sm text-gray-400">{override.reason}</p>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {!override.isActive && (
                        <span className="bg-red-600 text-white text-xs px-2 py-1 rounded">
                          Неактивно
                        </span>
                      )}
                      <span className="bg-orange-500 text-white text-sm px-3 py-1 rounded font-semibold">
                        {override.customMargin}%
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-400">Утвердил:</span>
                      <p className="text-white">{override.approvedBy}</p>
                    </div>

                    <div>
                      <span className="text-gray-400">Действует с:</span>
                      <p className="text-white">{formatDate(override.validFrom)}</p>
                    </div>
                  </div>
                </div>
              ))}

              {clientOverrides.length === 0 && (
                <div className="text-center py-8">
                  <div className="text-4xl mb-4">📊</div>
                  <h3 className="text-lg font-semibold text-gray-400 mb-2">
                    Индивидуальных настроек нет
                  </h3>
                  <p className="text-gray-500">
                    Создайте индивидуальную маржу для конкретного клиента
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Stats Tab */}
          {activeTab === 'stats' && stats && (
            <div className="space-y-6">
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-bearplus-card-dark rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-400 mb-2">Средняя маржа</h4>
                  <p className="text-2xl font-bold text-bearplus-green">{stats.averageMargin}%</p>
                </div>

                <div className="bg-bearplus-card-dark rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-400 mb-2">Общая выручка</h4>
                  <p className="text-2xl font-bold text-white">{formatCurrency(stats.totalRevenue)}</p>
                </div>

                <div className="bg-bearplus-card-dark rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-400 mb-2">Доход с маржи</h4>
                  <p className="text-2xl font-bold text-green-400">{formatCurrency(stats.marginRevenue)}</p>
                </div>

                <div className="bg-bearplus-card-dark rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-400 mb-2">Заказов</h4>
                  <p className="text-2xl font-bold text-white">{stats.ordersCount}</p>
                </div>
              </div>

              {/* Top Performing Rules */}
              <div className="bg-bearplus-card-dark rounded-lg p-6">
                <h4 className="text-lg font-semibold text-white mb-4">Наиболее эффективные правила</h4>
                <div className="space-y-3">
                  {stats.topPerformingRules.map((rule, index) => (
                    <div key={rule.ruleId} className="flex items-center justify-between p-3 bg-bearplus-card rounded-lg">
                      <div className="flex items-center space-x-3">
                        <span className="bg-bearplus-green text-black w-8 h-8 rounded-full flex items-center justify-center font-bold">
                          {index + 1}
                        </span>
                        <div>
                          <h5 className="font-medium text-white">{rule.ruleName}</h5>
                          <p className="text-sm text-gray-400">{rule.ordersCount} заказов</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-white font-semibold">{formatCurrency(rule.revenue)}</p>
                        <p className="text-sm text-bearplus-green">{rule.averageMargin}% маржа</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Monthly Stats */}
              <div className="bg-bearplus-card-dark rounded-lg p-6">
                <h4 className="text-lg font-semibold text-white mb-4">Помесячная статистика</h4>
                <div className="relative h-64 bg-gray-800 rounded-lg flex items-center justify-center">
                  <div className="text-center text-gray-400">
                    <div className="text-4xl mb-2">📈</div>
                    <p>Здесь будет график помесячной статистики</p>
                    <p className="text-sm mt-1">Выручка, маржа и количество заказов</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Create/Edit Margin Rule Modal */}
      {(showCreateModal || isEditing) && (
        <MarginRuleModal
          rule={isEditing ? selectedRule : null}
          onSave={handleSaveRule}
          onClose={() => {
            setShowCreateModal(false);
            setIsEditing(false);
            setSelectedRule(null);
          }}
        />
      )}

      {/* Client Override Modal */}
      {showOverrideModal && (
        <ClientOverrideModal
          onSave={(override: Omit<ClientMarginOverride, 'id' | 'createdAt'>) => {
            const newOverride: ClientMarginOverride = {
              ...override,
              id: Date.now().toString(),
              createdAt: new Date().toISOString()
            };
            setClientOverrides(prev => [...prev, newOverride]);
            setShowOverrideModal(false);
          }}
          onClose={() => setShowOverrideModal(false)}
        />
      )}
    </div>
  );
};

export default MarginSettings;