import * as React from 'react';
import { useState } from 'react';
import { useAppSelector } from '../../hooks/redux';

interface CompanyInfoData {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  phone: string;
  companyName: string;
  organizationType: string;
  activityType: string;
  password: string;
  confirmPassword: string;
  description: string;
  legalAddress: string;
  actualAddress: string;
  documents: File[];
}

const CompanyInfoManagement: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const [formData, setFormData] = useState<CompanyInfoData>({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    username: user?.username || '',
    email: user?.email || '',
    phone: user?.phone || '',
    companyName: user?.companyName || '',
    organizationType: user?.organizationType || '',
    activityType: user?.activityType || '',
    password: '',
    confirmPassword: '',
    description: '',
    legalAddress: '',
    actualAddress: '',
    documents: []
  });

  const organizationTypes = [
    { value: 'llc', label: 'ООО' },
    { value: 'jsc', label: 'ОАО' },
    { value: 'individual', label: 'ИП' },
    { value: 'foreign', label: 'Иностранная компания' },
    { value: 'other', label: 'Другое' }
  ];

  const activityTypes = [
    { value: 'logistics', label: 'Логистическая Компания' },
    { value: 'freight_forwarder', label: 'Экспедирование' },
    { value: 'customs_broker', label: 'Таможенное оформление' },
    { value: 'transport_company', label: 'Транспортная компания' },
    { value: 'other', label: 'Другое' }
  ];

  const handleInputChange = (field: keyof CompanyInfoData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setFormData(prev => ({
      ...prev,
      documents: [...prev.documents, ...files]
    }));
  };

  const removeFile = (index: number) => {
    setFormData(prev => ({
      ...prev,
      documents: prev.documents.filter((_, i) => i !== index)
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    
    try {
      // API call to update company info
      const response = await fetch('/api/users/company-info', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setIsEditing(false);
        alert('Информация о компании успешно обновлена');
      } else {
        alert('Ошибка при сохранении данных');
      }
    } catch (error) {
      console.error('Save error:', error);
      alert('Ошибка при сохранении данных');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    // Reset form data to original values
    setFormData({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      username: user?.username || '',
      email: user?.email || '',
      phone: user?.phone || '',
      companyName: user?.companyName || '',
      organizationType: user?.organizationType || '',
      activityType: user?.activityType || '',
      password: '',
      confirmPassword: '',
      description: '',
      legalAddress: '',
      actualAddress: '',
      documents: []
    });
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Информация о компании</h2>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="btn-primary"
          >
            Редактировать
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="btn-primary"
            >
              {isSaving ? 'Сохранение...' : 'Сохранить изменения'}
            </button>
            <button
              onClick={handleCancel}
              className="btn-secondary"
            >
              Отмена
            </button>
          </div>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Personal Information */}
        <div className="card">
          <h3 className="text-lg font-semibold text-bearplus-green mb-4">Личная информация</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Имя</label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  className="input-field w-full"
                />
              ) : (
                <div className="text-white bg-bearplus-card-dark p-3 rounded">{formData.firstName}</div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Фамилия</label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  className="input-field w-full"
                />
              ) : (
                <div className="text-white bg-bearplus-card-dark p-3 rounded">{formData.lastName}</div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Логин</label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => handleInputChange('username', e.target.value)}
                  className="input-field w-full"
                />
              ) : (
                <div className="text-white bg-bearplus-card-dark p-3 rounded">{formData.username}</div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
              {isEditing ? (
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="input-field w-full"
                />
              ) : (
                <div className="text-white bg-bearplus-card-dark p-3 rounded">{formData.email}</div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Телефон</label>
              {isEditing ? (
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="input-field w-full"
                />
              ) : (
                <div className="text-white bg-bearplus-card-dark p-3 rounded">{formData.phone}</div>
              )}
            </div>
          </div>
        </div>

        {/* Company Information */}
        <div className="card">
          <h3 className="text-lg font-semibold text-bearplus-green mb-4">Информация о компании</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Название компании</label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.companyName}
                  onChange={(e) => handleInputChange('companyName', e.target.value)}
                  className="input-field w-full"
                />
              ) : (
                <div className="text-white bg-bearplus-card-dark p-3 rounded">{formData.companyName}</div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Тип организации</label>
              {isEditing ? (
                <select
                  value={formData.organizationType}
                  onChange={(e) => handleInputChange('organizationType', e.target.value)}
                  className="select-field w-full"
                >
                  <option value="">Выберите тип</option>
                  {organizationTypes.map((type) => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              ) : (
                <div className="text-white bg-bearplus-card-dark p-3 rounded">
                  {organizationTypes.find(t => t.value === formData.organizationType)?.label || formData.organizationType}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Тип деятельности</label>
              {isEditing ? (
                <select
                  value={formData.activityType}
                  onChange={(e) => handleInputChange('activityType', e.target.value)}
                  className="select-field w-full"
                >
                  <option value="">Выберите деятельность</option>
                  {activityTypes.map((type) => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              ) : (
                <div className="text-white bg-bearplus-card-dark p-3 rounded">
                  {activityTypes.find(t => t.value === formData.activityType)?.label || formData.activityType}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Описание компании</label>
              {isEditing ? (
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className="input-field w-full h-24 resize-none"
                  placeholder="Расскажите о вашей компании..."
                />
              ) : (
                <div className="text-white bg-bearplus-card-dark p-3 rounded min-h-[60px]">
                  {formData.description || 'Описание не заполнено'}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Addresses */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-bearplus-green mb-4">Юридический адрес</h3>
          {isEditing ? (
            <textarea
              value={formData.legalAddress}
              onChange={(e) => handleInputChange('legalAddress', e.target.value)}
              className="input-field w-full h-24 resize-none"
              placeholder="Введите юридический адрес..."
            />
          ) : (
            <div className="text-white bg-bearplus-card-dark p-3 rounded min-h-[60px]">
              {formData.legalAddress || 'Адрес не заполнен'}
            </div>
          )}
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-bearplus-green mb-4">Фактический адрес</h3>
          {isEditing ? (
            <textarea
              value={formData.actualAddress}
              onChange={(e) => handleInputChange('actualAddress', e.target.value)}
              className="input-field w-full h-24 resize-none"
              placeholder="Введите фактический адрес..."
            />
          ) : (
            <div className="text-white bg-bearplus-card-dark p-3 rounded min-h-[60px]">
              {formData.actualAddress || 'Адрес не заполнен'}
            </div>
          )}
        </div>
      </div>

      {/* Password Change */}
      {isEditing && (
        <div className="card">
          <h3 className="text-lg font-semibold text-bearplus-green mb-4">Изменение пароля</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Новый пароль</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                className="input-field w-full"
                placeholder="Оставьте пустым, если не хотите менять"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Подтверждение пароля</label>
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                className="input-field w-full"
                placeholder="Повторите пароль"
              />
            </div>
          </div>
        </div>
      )}

      {/* Documents */}
      <div className="card">
        <h3 className="text-lg font-semibold text-bearplus-green mb-4">Документы</h3>
        
        {isEditing && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Приложить документы
            </label>
            <input
              type="file"
              multiple
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              onChange={handleFileUpload}
              className="input-field w-full"
            />
          </div>
        )}

        {formData.documents.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-400">Загруженные документы:</h4>
            {formData.documents.map((file, index) => (
              <div key={index} className="flex items-center justify-between bg-bearplus-card-dark p-3 rounded">
                <div className="flex items-center">
                  <span className="text-bearplus-green mr-2">📄</span>
                  <span className="text-white text-sm">{file.name}</span>
                </div>
                {isEditing && (
                  <button
                    onClick={() => removeFile(index)}
                    className="text-red-400 hover:text-red-300"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {formData.documents.length === 0 && (
          <div className="text-center py-8 text-gray-400">
            <div className="text-4xl mb-2">📄</div>
            <p>Документы не загружены</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanyInfoManagement;