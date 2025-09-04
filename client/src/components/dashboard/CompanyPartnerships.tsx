import * as React from 'react';
import { useState } from 'react';

interface Partner {
  id: string;
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  activityType: string;
  description: string;
  discount: number;
  shipmentsCount: number;
  rating: number;
  joinedDate: string;
  lastActivity: string;
  status: 'active' | 'inactive' | 'pending';
}

interface AddPartnerData {
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  activityType: string;
  description: string;
  discount: number;
}

const CompanyPartnerships: React.FC = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);
  const [showPartnerDetails, setShowPartnerDetails] = useState(false);
  
  const [addPartnerData, setAddPartnerData] = useState<AddPartnerData>({
    companyName: '',
    contactPerson: '',
    email: '',
    phone: '',
    activityType: '',
    description: '',
    discount: 0
  });

  // Mock data for partners
  const [partners] = useState<Partner[]>([
    {
      id: '1',
      companyName: 'ДальТранс Логистик',
      contactPerson: 'Иван Петров',
      email: 'i.petrov@daltrans.ru',
      phone: '+7 (423) 555-0123',
      activityType: 'Логистическая компания',
      description: 'Крупная логистическая компания с офисами в Владивостоке и Хабаровске',
      discount: 5,
      shipmentsCount: 45,
      rating: 4.8,
      joinedDate: '2023-06-15',
      lastActivity: '2024-01-10',
      status: 'active'
    },
    {
      id: '2',
      companyName: 'Азия-Карго',
      contactPerson: 'Мария Сидорова',
      email: 'm.sidorova@asia-cargo.ru',
      phone: '+7 (495) 555-0456',
      activityType: 'Экспедирование',
      description: 'Специализируется на перевозках из Китая и Южной Кореи',
      discount: 7,
      shipmentsCount: 28,
      rating: 4.5,
      joinedDate: '2023-08-20',
      lastActivity: '2024-01-08',
      status: 'active'
    },
    {
      id: '3',
      companyName: 'СибирьТранс',
      contactPerson: 'Алексей Козлов',
      email: 'a.kozlov@sibirtrans.ru',
      phone: '+7 (383) 555-0789',
      activityType: 'Транспортная компания',
      description: 'Автомобильные и железнодорожные перевозки по Сибири',
      discount: 3,
      shipmentsCount: 12,
      rating: 4.2,
      joinedDate: '2023-11-10',
      lastActivity: '2023-12-25',
      status: 'inactive'
    }
  ]);

  const activityTypes = [
    'Логистическая компания',
    'Экспедирование',
    'Таможенное оформление',
    'Транспортная компания',
    'Судоходная линия',
    'Портовый оператор',
    'Другое'
  ];

  const handleAddPartnerChange = (field: keyof AddPartnerData, value: string | number) => {
    setAddPartnerData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddPartner = async () => {
    setIsSubmitting(true);
    
    try {
      // API call to add partner
      const response = await fetch('/api/partnerships', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(addPartnerData)
      });

      if (response.ok) {
        setShowAddForm(false);
        setAddPartnerData({
          companyName: '',
          contactPerson: '',
          email: '',
          phone: '',
          activityType: '',
          description: '',
          discount: 0
        });
        alert('Компания успешно добавлена в список партнеров');
      } else {
        alert('Ошибка при добавлении компании');
      }
    } catch (error) {
      console.error('Add partner error:', error);
      alert('Ошибка при добавлении компании');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleContactPartner = (partner: Partner) => {
    // Open messenger or redirect to contact form
    console.log('Contacting partner:', partner.id);
  };

  const handleViewPartnerInfo = (partner: Partner) => {
    setSelectedPartner(partner);
    setShowPartnerDetails(true);
  };

  const handleUpdateDiscount = async (partnerId: string, newDiscount: number) => {
    try {
      const response = await fetch(`/api/partnerships/${partnerId}/discount`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ discount: newDiscount })
      });

      if (response.ok) {
        alert('Скидка обновлена');
      } else {
        alert('Ошибка при обновлении скидки');
      }
    } catch (error) {
      console.error('Update discount error:', error);
      alert('Ошибка при обновлении скидки');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-400';
      case 'inactive': return 'text-gray-400';
      case 'pending': return 'text-yellow-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return 'Активный';
      case 'inactive': return 'Неактивный';
      case 'pending': return 'Ожидает';
      default: return 'Неизвестно';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Сотрудничество</h2>
        <button
          onClick={() => setShowAddForm(true)}
          className="btn-primary"
        >
          Добавить компанию
        </button>
      </div>

      {/* Add Partner Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-bearplus-card-dark rounded-xl p-6 w-full max-w-2xl border border-gray-700">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white">Добавить компанию-партнера</h3>
              <button
                onClick={() => setShowAddForm(false)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Название компании *
                </label>
                <input
                  type="text"
                  value={addPartnerData.companyName}
                  onChange={(e) => handleAddPartnerChange('companyName', e.target.value)}
                  className="input-field w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Контактное лицо *
                </label>
                <input
                  type="text"
                  value={addPartnerData.contactPerson}
                  onChange={(e) => handleAddPartnerChange('contactPerson', e.target.value)}
                  className="input-field w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  value={addPartnerData.email}
                  onChange={(e) => handleAddPartnerChange('email', e.target.value)}
                  className="input-field w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Телефон *
                </label>
                <input
                  type="tel"
                  value={addPartnerData.phone}
                  onChange={(e) => handleAddPartnerChange('phone', e.target.value)}
                  className="input-field w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Тип деятельности *
                </label>
                <select
                  value={addPartnerData.activityType}
                  onChange={(e) => handleAddPartnerChange('activityType', e.target.value)}
                  className="select-field w-full"
                >
                  <option value="">Выберите тип</option>
                  {activityTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Скидка (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="50"
                  value={addPartnerData.discount}
                  onChange={(e) => handleAddPartnerChange('discount', parseInt(e.target.value) || 0)}
                  className="input-field w-full"
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Описание компании
              </label>
              <textarea
                value={addPartnerData.description}
                onChange={(e) => handleAddPartnerChange('description', e.target.value)}
                className="input-field w-full h-24 resize-none"
                placeholder="Краткое описание деятельности компании..."
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleAddPartner}
                disabled={isSubmitting}
                className="btn-primary flex-1"
              >
                {isSubmitting ? 'Добавление...' : 'Добавить партнера'}
              </button>
              <button
                onClick={() => setShowAddForm(false)}
                className="btn-secondary flex-1"
              >
                Отмена
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Partners List */}
      <div className="grid gap-6">
        {partners.map((partner) => (
          <div key={partner.id} className="card">
            <div className="flex flex-wrap justify-between items-start gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold text-white">{partner.companyName}</h3>
                  <span className={`text-sm font-medium ${getStatusColor(partner.status)}`}>
                    {getStatusLabel(partner.status)}
                  </span>
                </div>
                <p className="text-gray-300 text-sm mb-2">{partner.activityType}</p>
                <p className="text-gray-400 text-sm">{partner.description}</p>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 min-w-0">
                <button
                  onClick={() => handleContactPartner(partner)}
                  className="btn-primary text-sm px-3 py-1"
                >
                  Связаться
                </button>
                <button
                  onClick={() => handleViewPartnerInfo(partner)}
                  className="btn-secondary text-sm px-3 py-1"
                >
                  Информация
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 pt-4 border-t border-gray-700">
              <div className="text-center">
                <div className="text-lg font-bold text-bearplus-green">{partner.discount}%</div>
                <div className="text-gray-400 text-xs">Скидка</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-bearplus-green">{partner.shipmentsCount}</div>
                <div className="text-gray-400 text-xs">Перевозок</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-bearplus-green">{partner.rating}</div>
                <div className="text-gray-400 text-xs">Рейтинг</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-bearplus-green">
                  {new Date(partner.lastActivity).toLocaleDateString('ru')}
                </div>
                <div className="text-gray-400 text-xs">Последняя активность</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {partners.length === 0 && (
        <div className="card text-center py-12">
          <div className="text-4xl mb-4">🤝</div>
          <h3 className="text-xl font-semibold text-white mb-2">Нет партнеров</h3>
          <p className="text-gray-400 mb-6">Добавьте компании-партнеры для расширения сотрудничества</p>
          <button
            onClick={() => setShowAddForm(true)}
            className="btn-primary"
          >
            Добавить первого партнера
          </button>
        </div>
      )}

      {/* Partner Details Modal */}
      {showPartnerDetails && selectedPartner && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-bearplus-card-dark rounded-xl p-6 w-full max-w-2xl border border-gray-700">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white">Информация о партнере</h3>
              <button
                onClick={() => setShowPartnerDetails(false)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-lg font-semibold text-bearplus-green mb-3">Основная информация</h4>
                  <div className="space-y-3">
                    <div>
                      <span className="text-gray-400 text-sm">Компания:</span>
                      <div className="text-white">{selectedPartner.companyName}</div>
                    </div>
                    <div>
                      <span className="text-gray-400 text-sm">Контактное лицо:</span>
                      <div className="text-white">{selectedPartner.contactPerson}</div>
                    </div>
                    <div>
                      <span className="text-gray-400 text-sm">Email:</span>
                      <div className="text-white">{selectedPartner.email}</div>
                    </div>
                    <div>
                      <span className="text-gray-400 text-sm">Телефон:</span>
                      <div className="text-white">{selectedPartner.phone}</div>
                    </div>
                    <div>
                      <span className="text-gray-400 text-sm">Тип деятельности:</span>
                      <div className="text-white">{selectedPartner.activityType}</div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-bearplus-green mb-3">Статистика</h4>
                  <div className="space-y-3">
                    <div>
                      <span className="text-gray-400 text-sm">Статус:</span>
                      <div className={`font-medium ${getStatusColor(selectedPartner.status)}`}>
                        {getStatusLabel(selectedPartner.status)}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-400 text-sm">Дата присоединения:</span>
                      <div className="text-white">{new Date(selectedPartner.joinedDate).toLocaleDateString('ru')}</div>
                    </div>
                    <div>
                      <span className="text-gray-400 text-sm">Количество перевозок:</span>
                      <div className="text-white">{selectedPartner.shipmentsCount}</div>
                    </div>
                    <div>
                      <span className="text-gray-400 text-sm">Рейтинг:</span>
                      <div className="text-white">{selectedPartner.rating} / 5.0</div>
                    </div>
                    <div>
                      <span className="text-gray-400 text-sm">Текущая скидка:</span>
                      <div className="text-bearplus-green font-bold">{selectedPartner.discount}%</div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-bearplus-green mb-3">Описание</h4>
                <p className="text-gray-300">{selectedPartner.description}</p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => handleContactPartner(selectedPartner)}
                  className="btn-primary flex-1"
                >
                  Связаться
                </button>
                <button
                  onClick={() => {
                    const newDiscount = prompt('Введите новую скидку (%)', selectedPartner.discount.toString());
                    if (newDiscount && !isNaN(parseInt(newDiscount))) {
                      handleUpdateDiscount(selectedPartner.id, parseInt(newDiscount));
                    }
                  }}
                  className="btn-secondary flex-1"
                >
                  Изменить скидку
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanyPartnerships;