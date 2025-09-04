import * as React from 'react';
import { useState, useEffect } from 'react';
import { useAppSelector } from '../../hooks/redux';

interface LoyaltyProgram {
  id: string;
  name: string;
  description: string;
  type: 'points' | 'tier' | 'cashback' | 'discount';
  isActive: boolean;
  startDate: string;
  endDate?: string;
  conditions: {
    minOrderValue?: number;
    serviceTypes?: string[];
    currency: 'USD' | 'EUR' | 'RUB';
    eligibleClientTypes?: ('new' | 'regular' | 'vip' | 'corporate')[];
    maxUsesPerClient?: number;
    maxUsesTotal?: number;
  };
  rewards: {
    pointsPerDollar?: number;
    cashbackPercentage?: number;
    discountPercentage?: number;
    tiers?: Array<{
      name: string;
      minPoints: number;
      benefits: string[];
      discountPercentage: number;
    }>;
  };
  createdBy: string;
  lastUpdated: string;
}

interface ClientLoyalty {
  clientId: string;
  clientName: string;
  email: string;
  currentTier: string;
  totalPoints: number;
  availablePoints: number;
  lifetimeSpent: number;
  joinDate: string;
  lastActivity: string;
  earnedRewards: Array<{
    id: string;
    programId: string;
    programName: string;
    type: 'points' | 'cashback' | 'discount';
    amount: number;
    earnedDate: string;
    orderId: string;
  }>;
  redeemedRewards: Array<{
    id: string;
    programId: string;
    programName: string;
    type: 'points' | 'cashback' | 'discount';
    amount: number;
    redeemedDate: string;
    orderId: string;
  }>;
}

interface LoyaltyStats {
  totalParticipants: number;
  activeParticipants: number;
  totalPointsIssued: number;
  totalPointsRedeemed: number;
  totalCashbackPaid: number;
  averageOrderValue: number;
  retentionRate: number;
  programPerformance: Array<{
    programId: string;
    programName: string;
    participants: number;
    totalRewards: number;
    conversionRate: number;
  }>;
  tierDistribution: Array<{
    tierName: string;
    clientCount: number;
    percentage: number;
  }>;
}

// Create Program Modal Component
interface CreateProgramModalProps {
  onSave: (program: Omit<LoyaltyProgram, 'id' | 'createdBy' | 'lastUpdated'>) => void;
  onClose: () => void;
}

const CreateProgramModal: React.FC<CreateProgramModalProps> = ({ onSave, onClose }) => {
  const [formData, setFormData] = useState<Partial<LoyaltyProgram>>({
    name: '',
    description: '',
    type: 'points',
    isActive: true,
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    conditions: {
      minOrderValue: 0,
      serviceTypes: [],
      currency: 'USD',
      eligibleClientTypes: [],
      maxUsesPerClient: undefined,
      maxUsesTotal: undefined
    },
    rewards: {
      pointsPerDollar: 1,
      cashbackPercentage: 0,
      discountPercentage: 0,
      tiers: []
    }
  });

  const programTypes = [
    { value: 'points', label: 'Баллы' },
    { value: 'cashback', label: 'Кэшбэк' },
    { value: 'discount', label: 'Скидки' },
    { value: 'tier', label: 'Уровни' }
  ];

  const serviceTypes = [
    { value: 'sea_freight', label: 'Морские перевозки' },
    { value: 'air_freight', label: 'Авиаперевозки' },
    { value: 'land_freight', label: 'Автоперевозки' },
    { value: 'customs', label: 'Таможенное оформление' },
    { value: 'warehouse', label: 'Складские услуги' },
    { value: 'insurance', label: 'Страхование' }
  ];

  const clientTypes = [
    { value: 'new', label: 'Новые' },
    { value: 'regular', label: 'Обычные' },
    { value: 'vip', label: 'VIP' },
    { value: 'corporate', label: 'Корпоративные' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.description) {
      onSave(formData as Omit<LoyaltyProgram, 'id' | 'createdBy' | 'lastUpdated'>);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-bearplus-card-dark rounded-xl p-6 w-full max-w-4xl border border-gray-700 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-white">Создать программу лояльности</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Название программы</label>
              <input
                type="text"
                value={formData.name || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="input-field"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Тип программы</label>
              <select
                value={formData.type || 'points'}
                onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as any }))}
                className="input-field"
              >
                {programTypes.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
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
              required
            />
          </div>

          {/* Period */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Дата начала</label>
              <input
                type="date"
                value={formData.startDate?.split('T')[0] || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                className="input-field"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Дата окончания (опционально)</label>
              <input
                type="date"
                value={formData.endDate?.split('T')[0] || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value || undefined }))}
                className="input-field"
              />
            </div>
          </div>

          {/* Conditions */}
          <div className="bg-bearplus-card rounded-lg p-4 space-y-4">
            <h4 className="font-medium text-white">Условия участия</h4>
            
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

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Макс. использований на клиента</label>
                <input
                  type="number"
                  value={formData.conditions?.maxUsesPerClient || ''}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    conditions: { ...prev.conditions!, maxUsesPerClient: e.target.value ? Number(e.target.value) : undefined }
                  }))}
                  className="input-field"
                />
              </div>
            </div>

            {/* Service Types */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Применимые услуги</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {serviceTypes.map(service => (
                  <label key={service.value} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.conditions?.serviceTypes?.includes(service.value) || false}
                      onChange={(e) => {
                        const serviceTypes = formData.conditions?.serviceTypes || [];
                        setFormData(prev => ({
                          ...prev,
                          conditions: {
                            ...prev.conditions!,
                            serviceTypes: e.target.checked
                              ? [...serviceTypes, service.value]
                              : serviceTypes.filter(s => s !== service.value)
                          }
                        }));
                      }}
                      className="rounded border-gray-600 bg-bearplus-card text-bearplus-green focus:ring-bearplus-green"
                    />
                    <span className="text-sm text-gray-300">{service.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Client Types */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Типы клиентов</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {clientTypes.map(client => (
                  <label key={client.value} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.conditions?.eligibleClientTypes?.includes(client.value as any) || false}
                      onChange={(e) => {
                        const clientTypes = formData.conditions?.eligibleClientTypes || [];
                        setFormData(prev => ({
                          ...prev,
                          conditions: {
                            ...prev.conditions!,
                            eligibleClientTypes: e.target.checked
                              ? [...clientTypes, client.value as any]
                              : clientTypes.filter(c => c !== client.value)
                          }
                        }));
                      }}
                      className="rounded border-gray-600 bg-bearplus-card text-bearplus-green focus:ring-bearplus-green"
                    />
                    <span className="text-sm text-gray-300">{client.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Rewards */}
          <div className="bg-bearplus-card rounded-lg p-4 space-y-4">
            <h4 className="font-medium text-white">Настройки вознаграждений</h4>
            
            {formData.type === 'points' && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Баллов за доллар</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.rewards?.pointsPerDollar || ''}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    rewards: { ...prev.rewards!, pointsPerDollar: Number(e.target.value) }
                  }))}
                  className="input-field"
                />
              </div>
            )}

            {formData.type === 'cashback' && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Процент кэшбэка (%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.rewards?.cashbackPercentage || ''}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    rewards: { ...prev.rewards!, cashbackPercentage: Number(e.target.value) }
                  }))}
                  className="input-field"
                />
              </div>
            )}

            {formData.type === 'discount' && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Процент скидки (%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.rewards?.discountPercentage || ''}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    rewards: { ...prev.rewards!, discountPercentage: Number(e.target.value) }
                  }))}
                  className="input-field"
                />
              </div>
            )}
          </div>

          {/* Active Status */}
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={formData.isActive ?? true}
              onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
              className="rounded border-gray-600 bg-bearplus-card text-bearplus-green focus:ring-bearplus-green"
            />
            <span className="text-sm text-gray-300">Программа активна</span>
          </label>

          {/* Actions */}
          <div className="flex gap-4 pt-4 border-t border-gray-700">
            <button type="button" onClick={onClose} className="btn-secondary flex-1">
              Отменить
            </button>
            <button type="submit" className="btn-primary flex-1">
              Создать программу
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Award Points Modal Component
interface AwardPointsModalProps {
  clients: ClientLoyalty[];
  onAward: (clientId: string, points: number, reason: string) => void;
  onClose: () => void;
}

const AwardPointsModal: React.FC<AwardPointsModalProps> = ({ clients, onAward, onClose }) => {
  const [selectedClientId, setSelectedClientId] = useState('');
  const [points, setPoints] = useState(0);
  const [reason, setReason] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedClientId && points > 0 && reason) {
      onAward(selectedClientId, points, reason);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-bearplus-card-dark rounded-xl p-6 w-full max-w-md border border-gray-700" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-white">Начислить баллы</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Выберите клиента</label>
            <select
              value={selectedClientId}
              onChange={(e) => setSelectedClientId(e.target.value)}
              className="input-field"
              required
            >
              <option value="">Выберите клиента...</option>
              {clients.map(client => (
                <option key={client.clientId} value={client.clientId}>
                  {client.clientName} ({client.currentTier})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Количество баллов</label>
            <input
              type="number"
              min="1"
              value={points}
              onChange={(e) => setPoints(Number(e.target.value))}
              className="input-field"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Причина начисления</label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="input-field"
              placeholder="Бонус за активность, компенсация и т.д."
              rows={3}
              required
            />
          </div>

          <div className="flex gap-4 pt-4 border-t border-gray-700">
            <button type="button" onClick={onClose} className="btn-secondary flex-1">
              Отменить
            </button>
            <button type="submit" className="btn-primary flex-1">
              Начислить баллы
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const LoyaltyManagement: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);
  const [programs, setPrograms] = useState<LoyaltyProgram[]>([]);
  const [clientLoyalties, setClientLoyalties] = useState<ClientLoyalty[]>([]);
  const [stats, setStats] = useState<LoyaltyStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'programs' | 'clients' | 'stats'>('programs');
  const [selectedProgram, setSelectedProgram] = useState<LoyaltyProgram | null>(null);
  const [selectedClient, setSelectedClient] = useState<ClientLoyalty | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showRewardModal, setShowRewardModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchLoyaltyData();
  }, []);

  const fetchLoyaltyData = async () => {
    try {
      setIsLoading(true);
      
      // Mock loyalty programs data
      const mockPrograms: LoyaltyProgram[] = [
        {
          id: 'program1',
          name: 'BearPlus Points',
          description: 'Зарабатывайте баллы за каждый заказ и обменивайте их на скидки',
          type: 'points',
          isActive: true,
          startDate: '2024-01-01T00:00:00Z',
          conditions: {
            minOrderValue: 100,
            currency: 'USD',
            eligibleClientTypes: ['regular', 'vip', 'corporate']
          },
          rewards: {
            pointsPerDollar: 1,
            tiers: [
              {
                name: 'Бронзовый',
                minPoints: 0,
                benefits: ['1 балл за 1$', 'Приоритетная поддержка'],
                discountPercentage: 0
              },
              {
                name: 'Серебряный',
                minPoints: 1000,
                benefits: ['1.5 балла за 1$', 'Скидка 5%', 'Бесплатная консультация'],
                discountPercentage: 5
              },
              {
                name: 'Золотой',
                minPoints: 5000,
                benefits: ['2 балла за 1$', 'Скидка 10%', 'Персональный менеджер'],
                discountPercentage: 10
              },
              {
                name: 'Платиновый',
                minPoints: 15000,
                benefits: ['3 балла за 1$', 'Скидка 15%', 'VIP обслуживание'],
                discountPercentage: 15
              }
            ]
          },
          createdBy: user?.firstName + ' ' + user?.lastName || 'Агент',
          lastUpdated: '2024-01-15T10:00:00Z'
        },
        {
          id: 'program2',
          name: 'Кэшбэк для новых клиентов',
          description: 'Возврат 3% с первых 5 заказов для новых клиентов',
          type: 'cashback',
          isActive: true,
          startDate: '2024-01-01T00:00:00Z',
          endDate: '2024-06-30T23:59:59Z',
          conditions: {
            minOrderValue: 500,
            currency: 'USD',
            eligibleClientTypes: ['new'],
            maxUsesPerClient: 5
          },
          rewards: {
            cashbackPercentage: 3
          },
          createdBy: user?.firstName + ' ' + user?.lastName || 'Агент',
          lastUpdated: '2024-01-10T14:00:00Z'
        }
      ];

      // Mock client loyalty data
      const mockClientLoyalties: ClientLoyalty[] = [
        {
          clientId: 'client1',
          clientName: 'ООО "Торговый дом"',
          email: 'trade@company.com',
          currentTier: 'Золотой',
          totalPoints: 7500,
          availablePoints: 2100,
          lifetimeSpent: 45000,
          joinDate: '2023-06-15T00:00:00Z',
          lastActivity: '2024-01-15T10:30:00Z',
          earnedRewards: [
            {
              id: 'reward1',
              programId: 'program1',
              programName: 'BearPlus Points',
              type: 'points',
              amount: 800,
              earnedDate: '2024-01-15T10:30:00Z',
              orderId: 'ORD-2024-001'
            }
          ],
          redeemedRewards: [
            {
              id: 'redeem1',
              programId: 'program1',
              programName: 'BearPlus Points',
              type: 'discount',
              amount: 500,
              redeemedDate: '2024-01-10T14:00:00Z',
              orderId: 'ORD-2024-002'
            }
          ]
        },
        {
          clientId: 'client2',
          clientName: 'ИП Петров И.И.',
          email: 'petrov@email.com',
          currentTier: 'Серебряный',
          totalPoints: 2800,
          availablePoints: 1200,
          lifetimeSpent: 15000,
          joinDate: '2023-10-20T00:00:00Z',
          lastActivity: '2024-01-12T16:45:00Z',
          earnedRewards: [
            {
              id: 'reward2',
              programId: 'program2',
              programName: 'Кэшбэк для новых клиентов',
              type: 'cashback',
              amount: 45,
              earnedDate: '2024-01-12T16:45:00Z',
              orderId: 'ORD-2024-003'
            }
          ],
          redeemedRewards: []
        }
      ];

      // Mock stats
      const mockStats: LoyaltyStats = {
        totalParticipants: 248,
        activeParticipants: 186,
        totalPointsIssued: 125000,
        totalPointsRedeemed: 87000,
        totalCashbackPaid: 4250,
        averageOrderValue: 2800,
        retentionRate: 78.5,
        programPerformance: [
          {
            programId: 'program1',
            programName: 'BearPlus Points',
            participants: 215,
            totalRewards: 125000,
            conversionRate: 65.2
          },
          {
            programId: 'program2',
            programName: 'Кэшбэк для новых клиентов',
            participants: 33,
            totalRewards: 4250,
            conversionRate: 89.1
          }
        ],
        tierDistribution: [
          { tierName: 'Бронзовый', clientCount: 125, percentage: 58.1 },
          { tierName: 'Серебряный', clientCount: 58, percentage: 27.0 },
          { tierName: 'Золотой', clientCount: 24, percentage: 11.2 },
          { tierName: 'Платиновый', clientCount: 8, percentage: 3.7 }
        ]
      };

      setTimeout(() => {
        setPrograms(mockPrograms);
        setClientLoyalties(mockClientLoyalties);
        setStats(mockStats);
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching loyalty data:', error);
      setIsLoading(false);
    }
  };

  const handleToggleProgram = async (programId: string) => {
    try {
      setPrograms(prev => prev.map(p => p.id === programId ? {
        ...p,
        isActive: !p.isActive,
        lastUpdated: new Date().toISOString()
      } : p));
    } catch (error) {
      console.error('Error toggling program:', error);
    }
  };

  const handleAwardPoints = async (clientId: string, points: number, reason: string) => {
    try {
      console.log('Awarding points:', { clientId, points, reason });
      
      setClientLoyalties(prev => prev.map(c => c.clientId === clientId ? {
        ...c,
        totalPoints: c.totalPoints + points,
        availablePoints: c.availablePoints + points,
        lastActivity: new Date().toISOString()
      } : c));

      setShowRewardModal(false);
    } catch (error) {
      console.error('Error awarding points:', error);
    }
  };

  const filteredClients = clientLoyalties.filter(client =>
    client.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.currentTier.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU');
  };

  const formatCurrency = (amount: number, currency: string = 'USD') => {
    const symbols = { USD: '$', EUR: '€', RUB: '₽' };
    return `${symbols[currency as keyof typeof symbols] || currency} ${amount.toLocaleString()}`;
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'Бронзовый': return 'text-amber-600';
      case 'Серебряный': return 'text-gray-400';
      case 'Золотой': return 'text-yellow-400';
      case 'Платиновый': return 'text-purple-400';
      default: return 'text-gray-400';
    }
  };

  const getProgramTypeIcon = (type: string) => {
    switch (type) {
      case 'points': return '🏆';
      case 'cashback': return '💰';
      case 'discount': return '🏷️';
      case 'tier': return '⭐';
      default: return '🎁';
    }
  };

  const getProgramTypeName = (type: string) => {
    switch (type) {
      case 'points': return 'Баллы';
      case 'cashback': return 'Кэшбэк';
      case 'discount': return 'Скидки';
      case 'tier': return 'Уровни';
      default: return type;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-white text-xl">Загрузка программы лояльности...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Программа лояльности</h2>
        <button
          onClick={() => setShowCreateModal(true)}
          className="btn-primary"
        >
          ➕ Создать программу
        </button>
      </div>

      {/* Tabs */}
      <div className="bg-bearplus-card rounded-lg">
        <div className="border-b border-gray-700">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'programs', label: 'Программы лояльности' },
              { id: 'clients', label: 'Клиенты' },
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
          {/* Programs Tab */}
          {activeTab === 'programs' && (
            <div className="space-y-4">
              {programs.map((program) => (
                <div
                  key={program.id}
                  className={`bg-bearplus-card-dark rounded-lg p-6 cursor-pointer transition-colors border-2 ${
                    selectedProgram?.id === program.id
                      ? 'border-bearplus-green'
                      : program.isActive
                      ? 'border-transparent hover:border-gray-600'
                      : 'border-red-600/30 opacity-75'
                  }`}
                  onClick={() => setSelectedProgram(program)}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{getProgramTypeIcon(program.type)}</span>
                      <div>
                        <h3 className="font-semibold text-white">{program.name}</h3>
                        <p className="text-sm text-bearplus-green">{getProgramTypeName(program.type)}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {!program.isActive && (
                        <span className="bg-red-600 text-white text-xs px-2 py-1 rounded">
                          Неактивна
                        </span>
                      )}
                      {program.endDate && new Date(program.endDate) < new Date() && (
                        <span className="bg-orange-600 text-white text-xs px-2 py-1 rounded">
                          Истекла
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="text-gray-400 text-sm mb-4">{program.description}</p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-400">Период действия:</span>
                      <p className="text-white">
                        {formatDate(program.startDate)}
                        {program.endDate && ` - ${formatDate(program.endDate)}`}
                      </p>
                    </div>

                    {program.conditions.minOrderValue && (
                      <div>
                        <span className="text-gray-400">Мин. сумма заказа:</span>
                        <p className="text-white">
                          {formatCurrency(program.conditions.minOrderValue, program.conditions.currency)}
                        </p>
                      </div>
                    )}

                    {program.rewards.pointsPerDollar && (
                      <div>
                        <span className="text-gray-400">Баллы:</span>
                        <p className="text-white">
                          {program.rewards.pointsPerDollar} балл за 1$
                        </p>
                      </div>
                    )}

                    {program.rewards.cashbackPercentage && (
                      <div>
                        <span className="text-gray-400">Кэшбэк:</span>
                        <p className="text-white">
                          {program.rewards.cashbackPercentage}%
                        </p>
                      </div>
                    )}
                  </div>

                  {program.rewards.tiers && (
                    <div className="mt-4 pt-4 border-t border-gray-700">
                      <h4 className="text-sm font-medium text-gray-400 mb-2">Уровни:</h4>
                      <div className="flex flex-wrap gap-2">
                        {program.rewards.tiers.map((tier, index) => (
                          <span
                            key={index}
                            className={`px-2 py-1 rounded text-xs ${getTierColor(tier.name)} bg-gray-800`}
                          >
                            {tier.name} ({tier.minPoints}+ баллов)
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2 mt-4 pt-4 border-t border-gray-700">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        // Edit program logic
                        console.log('Edit program:', program.id);
                      }}
                      className="btn-secondary text-xs flex-1"
                    >
                      Редактировать
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleProgram(program.id);
                      }}
                      className={`text-xs px-4 ${program.isActive ? 'text-red-400 hover:text-red-300' : 'text-green-400 hover:text-green-300'}`}
                    >
                      {program.isActive ? 'Деактивировать' : 'Активировать'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Clients Tab */}
          {activeTab === 'clients' && (
            <div className="space-y-4">
              {/* Search */}
              <div className="flex gap-4 items-center">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Поиск по имени, email или уровню..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="input-field"
                  />
                </div>
                <button
                  onClick={() => setShowRewardModal(true)}
                  className="btn-secondary"
                >
                  🎁 Начислить баллы
                </button>
              </div>

              {/* Client Cards */}
              {filteredClients.map((client) => (
                <div
                  key={client.clientId}
                  className={`bg-bearplus-card-dark rounded-lg p-6 cursor-pointer transition-colors border-2 ${
                    selectedClient?.clientId === client.clientId
                      ? 'border-bearplus-green'
                      : 'border-transparent hover:border-gray-600'
                  }`}
                  onClick={() => setSelectedClient(client)}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-semibold text-white mb-1">{client.clientName}</h3>
                      <p className="text-sm text-gray-400">{client.email}</p>
                    </div>
                    
                    <div className="text-right">
                      <span className={`px-3 py-1 rounded text-sm font-semibold ${getTierColor(client.currentTier)} bg-gray-800`}>
                        {client.currentTier}
                      </span>
                      <p className="text-xs text-gray-400 mt-1">
                        {client.totalPoints} баллов
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-400">Доступно баллов:</span>
                      <p className="text-white font-semibold">{client.availablePoints}</p>
                    </div>

                    <div>
                      <span className="text-gray-400">Потрачено всего:</span>
                      <p className="text-white">{formatCurrency(client.lifetimeSpent)}</p>
                    </div>

                    <div>
                      <span className="text-gray-400">Участник с:</span>
                      <p className="text-white">{formatDate(client.joinDate)}</p>
                    </div>

                    <div>
                      <span className="text-gray-400">Последняя активность:</span>
                      <p className="text-white">{formatDate(client.lastActivity)}</p>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-700">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">
                        Заработано наград: {client.earnedRewards.length}
                      </span>
                      <span className="text-gray-400">
                        Использовано наград: {client.redeemedRewards.length}
                      </span>
                    </div>
                  </div>
                </div>
              ))}

              {filteredClients.length === 0 && (
                <div className="text-center py-8">
                  <div className="text-4xl mb-4">👥</div>
                  <h3 className="text-lg font-semibold text-gray-400 mb-2">
                    Клиенты не найдены
                  </h3>
                  <p className="text-gray-500">
                    Попробуйте изменить параметры поиска
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
                  <h4 className="text-sm font-medium text-gray-400 mb-2">Участников</h4>
                  <p className="text-2xl font-bold text-white">{stats.totalParticipants}</p>
                  <p className="text-xs text-gray-500">Активных: {stats.activeParticipants}</p>
                </div>

                <div className="bg-bearplus-card-dark rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-400 mb-2">Выдано баллов</h4>
                  <p className="text-2xl font-bold text-bearplus-green">{stats.totalPointsIssued.toLocaleString()}</p>
                  <p className="text-xs text-gray-500">Использовано: {stats.totalPointsRedeemed.toLocaleString()}</p>
                </div>

                <div className="bg-bearplus-card-dark rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-400 mb-2">Кэшбэк выплачен</h4>
                  <p className="text-2xl font-bold text-green-400">{formatCurrency(stats.totalCashbackPaid)}</p>
                </div>

                <div className="bg-bearplus-card-dark rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-400 mb-2">Удержание клиентов</h4>
                  <p className="text-2xl font-bold text-blue-400">{stats.retentionRate}%</p>
                </div>
              </div>

              {/* Program Performance */}
              <div className="bg-bearplus-card-dark rounded-lg p-6">
                <h4 className="text-lg font-semibold text-white mb-4">Эффективность программ</h4>
                <div className="space-y-3">
                  {stats.programPerformance.map((program) => (
                    <div key={program.programId} className="flex items-center justify-between p-3 bg-bearplus-card rounded-lg">
                      <div>
                        <h5 className="font-medium text-white">{program.programName}</h5>
                        <p className="text-sm text-gray-400">{program.participants} участников</p>
                      </div>
                      <div className="text-right">
                        <p className="text-white font-semibold">{program.totalRewards.toLocaleString()}</p>
                        <p className="text-sm text-bearplus-green">{program.conversionRate}% конверсия</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tier Distribution */}
              <div className="bg-bearplus-card-dark rounded-lg p-6">
                <h4 className="text-lg font-semibold text-white mb-4">Распределение по уровням</h4>
                <div className="space-y-3">
                  {stats.tierDistribution.map((tier) => (
                    <div key={tier.tierName} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className={`font-medium ${getTierColor(tier.tierName)}`}>
                          {tier.tierName}
                        </span>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className="text-white">{tier.clientCount} клиентов</span>
                        <div className="w-32 bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-bearplus-green h-2 rounded-full"
                            style={{ width: `${tier.percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-gray-400 text-sm w-12 text-right">
                          {tier.percentage}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Create Program Modal */}
      {showCreateModal && (
        <CreateProgramModal
          onSave={(program: Omit<LoyaltyProgram, 'id' | 'createdBy' | 'lastUpdated'>) => {
            const newProgram: LoyaltyProgram = {
              ...program,
              id: Date.now().toString(),
              createdBy: user?.firstName + ' ' + user?.lastName || 'Агент',
              lastUpdated: new Date().toISOString()
            };
            setPrograms(prev => [...prev, newProgram]);
            setShowCreateModal(false);
          }}
          onClose={() => setShowCreateModal(false)}
        />
      )}

      {/* Award Points Modal */}
      {showRewardModal && (
        <AwardPointsModal
          clients={clientLoyalties}
          onAward={handleAwardPoints}
          onClose={() => setShowRewardModal(false)}
        />
      )}
    </div>
  );
};

export default LoyaltyManagement;