import * as React from 'react';
import { useState } from 'react';
import { useAppSelector } from '../../hooks/redux';

interface ProfileSettingsProps {
  onLogout: () => void;
}

interface ProfileFormData {
  firstName: string;
  lastName: string;
  phone: string;
  companyName?: string;
  organizationType?: string;
  activityType?: string;
  language: string;
}

interface PasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface NotificationSettings {
  email: boolean;
  sms: boolean;
  push: boolean;
  marketing: boolean;
}

const ProfileSettings: React.FC<ProfileSettingsProps> = ({ onLogout }) => {
  const { user } = useAppSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState<'profile' | 'password' | 'notifications' | 'security'>('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [profileForm, setProfileForm] = useState<ProfileFormData>({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    phone: user?.phone || '',
    companyName: user?.companyName || '',
    organizationType: user?.organizationType || '',
    activityType: user?.activityType || '',
    language: user?.language || 'ru'
  });

  const [passwordForm, setPasswordForm] = useState<PasswordFormData>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [notifications, setNotifications] = useState<NotificationSettings>({
    email: true,
    sms: false,
    push: true,
    marketing: false
  });

  const organizationTypes = [
    { value: 'llc', label: 'ООО' },
    { value: 'jsc', label: 'АО' },
    { value: 'individual', label: 'ИП' },
    { value: 'foreign', label: 'Иностранная компания' },
    { value: 'other', label: 'Другое' }
  ];

  const activityTypes = [
    { value: 'freight_forwarder', label: 'Экспедитор' },
    { value: 'customs_broker', label: 'Таможенный брокер' },
    { value: 'transport_company', label: 'Транспортная компания' },
    { value: 'logistics', label: 'Логистика' },
    { value: 'other', label: 'Другое' }
  ];

  const languages = [
    { value: 'ru', label: 'Русский' },
    { value: 'en', label: 'English' },
    { value: 'zh', label: '中文' }
  ];

  const handleProfileInputChange = (field: keyof ProfileFormData, value: string) => {
    setProfileForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePasswordInputChange = (field: keyof PasswordFormData, value: string) => {
    setPasswordForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNotificationChange = (field: keyof NotificationSettings, value: boolean) => {
    setNotifications(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const saveProfile = async () => {
    try {
      setIsSaving(true);
      
      // API call to update profile
      const response = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileForm)
      });

      if (response.ok) {
        alert('Профиль успешно обновлен');
        setIsEditing(false);
      } else {
        alert('Ошибка при обновлении профиля');
      }
    } catch (error) {
      console.error('Profile update error:', error);
      alert('Ошибка при обновлении профиля');
    } finally {
      setIsSaving(false);
    }
  };

  const changePassword = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert('Пароли не совпадают');
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      alert('Пароль должен содержать минимум 6 символов');
      return;
    }

    try {
      setIsSaving(true);
      
      // API call to change password
      const response = await fetch('/api/users/change-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword
        })
      });

      if (response.ok) {
        alert('Пароль успешно изменен');
        setPasswordForm({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      } else {
        alert('Ошибка при смене пароля');
      }
    } catch (error) {
      console.error('Password change error:', error);
      alert('Ошибка при смене пароля');
    } finally {
      setIsSaving(false);
    }
  };

  const saveNotifications = async () => {
    try {
      setIsSaving(true);
      
      // API call to update notification settings
      const response = await fetch('/api/users/notifications', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(notifications)
      });

      if (response.ok) {
        alert('Настройки уведомлений сохранены');
      } else {
        alert('Ошибка при сохранении настроек');
      }
    } catch (error) {
      console.error('Notifications update error:', error);
      alert('Ошибка при сохранении настроек');
    } finally {
      setIsSaving(false);
    }
  };

  const exportData = () => {
    // Create export data
    const exportData = {
      profile: user,
      exportDate: new Date().toISOString(),
      dataTypes: ['profile', 'orders', 'documents', 'messages']
    };

    // Download as JSON
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `bearplus_data_export_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const deleteAccount = async () => {
    if (!confirm('Вы уверены, что хотите удалить аккаунт? Это действие необратимо.')) return;
    
    const confirmText = prompt('Введите "УДАЛИТЬ" для подтверждения:');
    if (confirmText !== 'УДАЛИТЬ') return;

    try {
      // API call to delete account
      const response = await fetch('/api/users/delete-account', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (response.ok) {
        alert('Аккаунт успешно удален');
        onLogout();
      } else {
        alert('Ошибка при удалении аккаунта');
      }
    } catch (error) {
      console.error('Account deletion error:', error);
      alert('Ошибка при удалении аккаунта');
    }
  };

  const tabs = [
    { id: 'profile', label: 'Профиль', icon: '👤' },
    { id: 'password', label: 'Пароль', icon: '🔒' },
    { id: 'notifications', label: 'Уведомления', icon: '🔔' },
    { id: 'security', label: 'Безопасность', icon: '🛡️' }
  ];

  const renderProfileTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-white">Информация профиля</h3>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="btn-secondary"
          >
            Редактировать
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={saveProfile}
              disabled={isSaving}
              className="btn-primary"
            >
              {isSaving ? 'Сохранение...' : 'Сохранить'}
            </button>
            <button
              onClick={() => {
                setIsEditing(false);
                // Reset form
                setProfileForm({
                  firstName: user?.firstName || '',
                  lastName: user?.lastName || '',
                  phone: user?.phone || '',
                  companyName: user?.companyName || '',
                  organizationType: user?.organizationType || '',
                  activityType: user?.activityType || '',
                  language: user?.language || 'ru'
                });
              }}
              className="btn-secondary"
            >
              Отмена
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Имя *</label>
          {isEditing ? (
            <input
              type="text"
              value={profileForm.firstName}
              onChange={(e) => handleProfileInputChange('firstName', e.target.value)}
              className="input-field w-full"
            />
          ) : (
            <div className="text-white">{user?.firstName}</div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Фамилия *</label>
          {isEditing ? (
            <input
              type="text"
              value={profileForm.lastName}
              onChange={(e) => handleProfileInputChange('lastName', e.target.value)}
              className="input-field w-full"
            />
          ) : (
            <div className="text-white">{user?.lastName}</div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
          <div className="text-white">{user?.email}</div>
          <div className="text-xs text-gray-500 mt-1">Email нельзя изменить</div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Телефон</label>
          {isEditing ? (
            <input
              type="tel"
              value={profileForm.phone}
              onChange={(e) => handleProfileInputChange('phone', e.target.value)}
              className="input-field w-full"
            />
          ) : (
            <div className="text-white">{user?.phone}</div>
          )}
        </div>

        {user?.userType === 'agent' && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Компания</label>
              {isEditing ? (
                <input
                  type="text"
                  value={profileForm.companyName}
                  onChange={(e) => handleProfileInputChange('companyName', e.target.value)}
                  className="input-field w-full"
                />
              ) : (
                <div className="text-white">{user?.companyName || 'Не указано'}</div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Тип организации</label>
              {isEditing ? (
                <select
                  value={profileForm.organizationType}
                  onChange={(e) => handleProfileInputChange('organizationType', e.target.value)}
                  className="select-field w-full"
                >
                  <option value="">Выберите тип</option>
                  {organizationTypes.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              ) : (
                <div className="text-white">
                  {organizationTypes.find(t => t.value === user?.organizationType)?.label || 'Не указано'}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Тип деятельности</label>
              {isEditing ? (
                <select
                  value={profileForm.activityType}
                  onChange={(e) => handleProfileInputChange('activityType', e.target.value)}
                  className="select-field w-full"
                >
                  <option value="">Выберите тип</option>
                  {activityTypes.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              ) : (
                <div className="text-white">
                  {activityTypes.find(t => t.value === user?.activityType)?.label || 'Не указано'}
                </div>
              )}
            </div>
          </>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Язык интерфейса</label>
          {isEditing ? (
            <select
              value={profileForm.language}
              onChange={(e) => handleProfileInputChange('language', e.target.value)}
              className="select-field w-full"
            >
              {languages.map(lang => (
                <option key={lang.value} value={lang.value}>{lang.label}</option>
              ))}
            </select>
          ) : (
            <div className="text-white">
              {languages.find(l => l.value === user?.language)?.label || 'Русский'}
            </div>
          )}
        </div>
      </div>

      {/* Account Status */}
      <div className="card bg-blue-900/20 border-blue-600/30">
        <h4 className="text-lg font-semibold text-blue-400 mb-3">Статус аккаунта</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <span className="text-gray-400">Email:</span>
            <span className={`ml-2 px-2 py-1 rounded text-xs ${
              user?.isEmailVerified ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
            }`}>
              {user?.isEmailVerified ? 'Подтвержден' : 'Не подтвержден'}
            </span>
          </div>
          <div>
            <span className="text-gray-400">Тип пользователя:</span>
            <span className="ml-2 text-white">
              {user?.userType === 'client' ? 'Клиент' : 'Агент'}
            </span>
          </div>
          <div>
            <span className="text-gray-400">Дата регистрации:</span>
            <span className="ml-2 text-white">
              {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('ru-RU') : 'Не указано'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPasswordTab = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-white">Смена пароля</h3>
      
      <div className="max-w-md space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Текущий пароль</label>
          <input
            type="password"
            value={passwordForm.currentPassword}
            onChange={(e) => handlePasswordInputChange('currentPassword', e.target.value)}
            className="input-field w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Новый пароль</label>
          <input
            type="password"
            value={passwordForm.newPassword}
            onChange={(e) => handlePasswordInputChange('newPassword', e.target.value)}
            className="input-field w-full"
          />
          <div className="text-xs text-gray-500 mt-1">Минимум 6 символов</div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Подтвердите пароль</label>
          <input
            type="password"
            value={passwordForm.confirmPassword}
            onChange={(e) => handlePasswordInputChange('confirmPassword', e.target.value)}
            className="input-field w-full"
          />
        </div>

        <button
          onClick={changePassword}
          disabled={isSaving || !passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword}
          className="btn-primary w-full"
        >
          {isSaving ? 'Изменение...' : 'Изменить пароль'}
        </button>
      </div>
    </div>
  );

  const renderNotificationsTab = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-white">Настройки уведомлений</h3>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-white font-medium">Email уведомления</div>
            <div className="text-sm text-gray-400">Получать уведомления на email</div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={notifications.email}
              onChange={(e) => handleNotificationChange('email', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-bearplus-green"></div>
          </label>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <div className="text-white font-medium">SMS уведомления</div>
            <div className="text-sm text-gray-400">Получать уведомления по SMS</div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={notifications.sms}
              onChange={(e) => handleNotificationChange('sms', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-bearplus-green"></div>
          </label>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <div className="text-white font-medium">Push уведомления</div>
            <div className="text-sm text-gray-400">Уведомления в браузере</div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={notifications.push}
              onChange={(e) => handleNotificationChange('push', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-bearplus-green"></div>
          </label>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <div className="text-white font-medium">Маркетинговые уведомления</div>
            <div className="text-sm text-gray-400">Новости и специальные предложения</div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={notifications.marketing}
              onChange={(e) => handleNotificationChange('marketing', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-bearplus-green"></div>
          </label>
        </div>
      </div>

      <button
        onClick={saveNotifications}
        disabled={isSaving}
        className="btn-primary"
      >
        {isSaving ? 'Сохранение...' : 'Сохранить настройки'}
      </button>
    </div>
  );

  const renderSecurityTab = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-white">Безопасность и конфиденциальность</h3>
      
      <div className="space-y-6">
        {/* Data Export */}
        <div className="card bg-blue-900/20 border-blue-600/30">
          <h4 className="text-lg font-semibold text-blue-400 mb-3">Экспорт данных</h4>
          <p className="text-gray-300 mb-4">
            Вы можете экспортировать все свои данные в формате JSON
          </p>
          <button
            onClick={exportData}
            className="btn-secondary"
          >
            Экспортировать данные
          </button>
        </div>

        {/* Logout from all devices */}
        <div className="card bg-yellow-900/20 border-yellow-600/30">
          <h4 className="text-lg font-semibold text-yellow-400 mb-3">Завершить все сессии</h4>
          <p className="text-gray-300 mb-4">
            Завершить активные сессии на всех устройствах
          </p>
          <button
            onClick={onLogout}
            className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded transition-colors"
          >
            Выйти из всех устройств
          </button>
        </div>

        {/* Delete Account */}
        <div className="card bg-red-900/20 border-red-600/30">
          <h4 className="text-lg font-semibold text-red-400 mb-3">Удаление аккаунта</h4>
          <p className="text-gray-300 mb-4">
            Безвозвратно удалить аккаунт и все связанные данные. Это действие нельзя отменить.
          </p>
          <button
            onClick={deleteAccount}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition-colors"
          >
            Удалить аккаунт
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Настройки профиля</h2>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-gray-700 pb-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
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

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {activeTab === 'profile' && renderProfileTab()}
        {activeTab === 'password' && renderPasswordTab()}
        {activeTab === 'notifications' && renderNotificationsTab()}
        {activeTab === 'security' && renderSecurityTab()}
      </div>
    </div>
  );
};

export default ProfileSettings;