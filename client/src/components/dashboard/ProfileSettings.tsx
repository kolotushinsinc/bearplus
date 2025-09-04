import * as React from 'react';
import { useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../../hooks/redux';

interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  company: string;
  position: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  userType: 'client' | 'agent' | 'admin';
  avatar?: string;
  preferences: {
    language: 'ru' | 'en';
    currency: 'RUB' | 'USD' | 'EUR';
    timezone: string;
    notifications: {
      email: boolean;
      sms: boolean;
      push: boolean;
      orderUpdates: boolean;
      priceAlerts: boolean;
      newsletters: boolean;
    };
  };
  security: {
    twoFactorEnabled: boolean;
    lastPasswordChange: string;
    loginSessions: Array<{
      id: string;
      device: string;
      location: string;
      lastActive: string;
      isCurrent: boolean;
    }>;
  };
}

interface PasswordChangeForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const ProfileSettings: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'general' | 'security' | 'notifications' | 'preferences'>('general');
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState<PasswordChangeForm>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [previewAvatar, setPreviewAvatar] = useState<string>('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      
      // Mock profile data - replace with API call
      const mockProfile: UserProfile = {
        id: user?.id || 'user1',
        email: user?.email || 'client@example.com',
        firstName: user?.firstName || 'Иван',
        lastName: user?.lastName || 'Петров',
        phone: '+7 (999) 123-45-67',
        company: 'ООО "Торговый дом"',
        position: 'Логист',
        address: {
          street: 'ул. Невский проспект, 100',
          city: 'Санкт-Петербург',
          state: 'Ленинградская область',
          zipCode: '190000',
          country: 'Россия'
        },
        userType: user?.userType || 'client',
        avatar: '/avatars/user1.jpg',
        preferences: {
          language: 'ru',
          currency: 'RUB',
          timezone: 'Europe/Moscow',
          notifications: {
            email: true,
            sms: true,
            push: true,
            orderUpdates: true,
            priceAlerts: false,
            newsletters: true
          }
        },
        security: {
          twoFactorEnabled: false,
          lastPasswordChange: '2024-01-01T10:00:00Z',
          loginSessions: [
            {
              id: 'session1',
              device: 'Chrome (Windows)',
              location: 'Санкт-Петербург, Россия',
              lastActive: '2024-01-16T15:30:00Z',
              isCurrent: true
            },
            {
              id: 'session2',
              device: 'Safari (iPhone)',
              location: 'Москва, Россия',
              lastActive: '2024-01-15T08:20:00Z',
              isCurrent: false
            }
          ]
        }
      };

      setTimeout(() => {
        setProfile(mockProfile);
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching profile:', error);
      setIsLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!profile) return;

    try {
      setIsSaving(true);
      
      // In production, send profile data to API
      console.log('Saving profile:', profile);
      
      setTimeout(() => {
        setIsSaving(false);
        setIsEditing(false);
        // Show success message
      }, 1000);
    } catch (error) {
      console.error('Error saving profile:', error);
      setIsSaving(false);
    }
  };

  const handlePasswordChange = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert('Новые пароли не совпадают');
      return;
    }

    try {
      setIsSaving(true);
      
      // In production, send password change request to API
      console.log('Changing password');
      
      setTimeout(() => {
        setIsSaving(false);
        setShowPasswordModal(false);
        setPasswordForm({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        if (profile) {
          setProfile({
            ...profile,
            security: {
              ...profile.security,
              lastPasswordChange: new Date().toISOString()
            }
          });
        }
      }, 1000);
    } catch (error) {
      console.error('Error changing password:', error);
      setIsSaving(false);
    }
  };

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewAvatar(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadAvatar = async () => {
    if (!avatarFile || !profile) return;

    try {
      setIsSaving(true);
      
      // In production, upload avatar to API
      console.log('Uploading avatar:', avatarFile);
      
      setTimeout(() => {
        setProfile({
          ...profile,
          avatar: previewAvatar
        });
        setAvatarFile(null);
        setPreviewAvatar('');
        setIsSaving(false);
      }, 1000);
    } catch (error) {
      console.error('Error uploading avatar:', error);
      setIsSaving(false);
    }
  };

  const handleLogoutSession = async (sessionId: string) => {
    if (!profile) return;

    try {
      // In production, logout specific session via API
      console.log('Logging out session:', sessionId);
      
      setProfile({
        ...profile,
        security: {
          ...profile.security,
          loginSessions: profile.security.loginSessions.filter(s => s.id !== sessionId)
        }
      });
    } catch (error) {
      console.error('Error logging out session:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading || !profile) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-white text-xl">Загрузка профиля...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="bg-bearplus-card rounded-lg p-6">
        <div className="flex items-center space-x-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-700">
              {previewAvatar || profile.avatar ? (
                <img 
                  src={previewAvatar || profile.avatar} 
                  alt="Avatar" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-2xl text-gray-400">
                  {profile.firstName[0]}{profile.lastName[0]}
                </div>
              )}
            </div>
            <label className="absolute bottom-0 right-0 bg-bearplus-green text-black rounded-full w-8 h-8 flex items-center justify-center cursor-pointer hover:bg-bearplus-green/80">
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
              📷
            </label>
          </div>

          <div className="flex-1">
            <h2 className="text-2xl font-bold text-white">
              {profile.firstName} {profile.lastName}
            </h2>
            <p className="text-bearplus-green">{profile.position}</p>
            <p className="text-gray-400">{profile.company}</p>
            <p className="text-gray-400">{profile.email}</p>
          </div>

          <div className="flex gap-2">
            {avatarFile && (
              <button
                onClick={handleUploadAvatar}
                disabled={isSaving}
                className="btn-primary"
              >
                {isSaving ? 'Загрузка...' : 'Сохранить фото'}
              </button>
            )}
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="btn-secondary"
            >
              {isEditing ? 'Отмена' : 'Редактировать'}
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-bearplus-card rounded-lg">
        <div className="border-b border-gray-700">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'general', label: 'Основная информация' },
              { id: 'security', label: 'Безопасность' },
              { id: 'notifications', label: 'Уведомления' },
              { id: 'preferences', label: 'Настройки' }
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
          {/* General Tab */}
          {activeTab === 'general' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Имя
                  </label>
                  <input
                    type="text"
                    value={profile.firstName}
                    onChange={(e) => isEditing && setProfile({
                      ...profile,
                      firstName: e.target.value
                    })}
                    disabled={!isEditing}
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Фамилия
                  </label>
                  <input
                    type="text"
                    value={profile.lastName}
                    onChange={(e) => isEditing && setProfile({
                      ...profile,
                      lastName: e.target.value
                    })}
                    disabled={!isEditing}
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) => isEditing && setProfile({
                      ...profile,
                      email: e.target.value
                    })}
                    disabled={!isEditing}
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Телефон
                  </label>
                  <input
                    type="tel"
                    value={profile.phone}
                    onChange={(e) => isEditing && setProfile({
                      ...profile,
                      phone: e.target.value
                    })}
                    disabled={!isEditing}
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Компания
                  </label>
                  <input
                    type="text"
                    value={profile.company}
                    onChange={(e) => isEditing && setProfile({
                      ...profile,
                      company: e.target.value
                    })}
                    disabled={!isEditing}
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Должность
                  </label>
                  <input
                    type="text"
                    value={profile.position}
                    onChange={(e) => isEditing && setProfile({
                      ...profile,
                      position: e.target.value
                    })}
                    disabled={!isEditing}
                    className="input-field"
                  />
                </div>
              </div>

              <div>
                <h4 className="text-lg font-medium text-white mb-4">Адрес</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Улица
                    </label>
                    <input
                      type="text"
                      value={profile.address.street}
                      onChange={(e) => isEditing && setProfile({
                        ...profile,
                        address: { ...profile.address, street: e.target.value }
                      })}
                      disabled={!isEditing}
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Город
                    </label>
                    <input
                      type="text"
                      value={profile.address.city}
                      onChange={(e) => isEditing && setProfile({
                        ...profile,
                        address: { ...profile.address, city: e.target.value }
                      })}
                      disabled={!isEditing}
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Область
                    </label>
                    <input
                      type="text"
                      value={profile.address.state}
                      onChange={(e) => isEditing && setProfile({
                        ...profile,
                        address: { ...profile.address, state: e.target.value }
                      })}
                      disabled={!isEditing}
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Почтовый индекс
                    </label>
                    <input
                      type="text"
                      value={profile.address.zipCode}
                      onChange={(e) => isEditing && setProfile({
                        ...profile,
                        address: { ...profile.address, zipCode: e.target.value }
                      })}
                      disabled={!isEditing}
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Страна
                    </label>
                    <input
                      type="text"
                      value={profile.address.country}
                      onChange={(e) => isEditing && setProfile({
                        ...profile,
                        address: { ...profile.address, country: e.target.value }
                      })}
                      disabled={!isEditing}
                      className="input-field"
                    />
                  </div>
                </div>
              </div>

              {isEditing && (
                <div className="flex gap-4">
                  <button
                    onClick={handleSaveProfile}
                    disabled={isSaving}
                    className="btn-primary"
                  >
                    {isSaving ? 'Сохранение...' : 'Сохранить изменения'}
                  </button>
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      fetchProfile(); // Reset changes
                    }}
                    className="btn-secondary"
                  >
                    Отмена
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-medium text-white mb-4">Безопасность аккаунта</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-bearplus-card-dark rounded-lg p-4">
                    <h5 className="font-medium text-white mb-2">Пароль</h5>
                    <p className="text-sm text-gray-400 mb-4">
                      Последнее изменение: {formatDate(profile.security.lastPasswordChange)}
                    </p>
                    <button
                      onClick={() => setShowPasswordModal(true)}
                      className="btn-secondary"
                    >
                      Изменить пароль
                    </button>
                  </div>

                  <div className="bg-bearplus-card-dark rounded-lg p-4">
                    <h5 className="font-medium text-white mb-2">Двухфакторная аутентификация</h5>
                    <p className="text-sm text-gray-400 mb-4">
                      {profile.security.twoFactorEnabled ? 'Включена' : 'Отключена'}
                    </p>
                    <button
                      onClick={() => setProfile({
                        ...profile,
                        security: {
                          ...profile.security,
                          twoFactorEnabled: !profile.security.twoFactorEnabled
                        }
                      })}
                      className={profile.security.twoFactorEnabled ? 'btn-secondary' : 'btn-primary'}
                    >
                      {profile.security.twoFactorEnabled ? 'Отключить' : 'Включить'}
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-medium text-white mb-4">Активные сессии</h4>
                <div className="space-y-3">
                  {profile.security.loginSessions.map((session) => (
                    <div key={session.id} className="bg-bearplus-card-dark rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center space-x-2">
                            <h5 className="font-medium text-white">{session.device}</h5>
                            {session.isCurrent && (
                              <span className="bg-green-600 text-white text-xs px-2 py-1 rounded">
                                Текущая
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-400">{session.location}</p>
                          <p className="text-xs text-gray-500">
                            Последняя активность: {formatDate(session.lastActive)}
                          </p>
                        </div>
                        {!session.isCurrent && (
                          <button
                            onClick={() => handleLogoutSession(session.id)}
                            className="text-red-400 hover:text-red-300 text-sm"
                          >
                            Завершить
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <h4 className="text-lg font-medium text-white mb-4">Настройки уведомлений</h4>
              
              <div className="space-y-4">
                {Object.entries(profile.preferences.notifications).map(([key, value]) => {
                  const labels = {
                    email: 'Email уведомления',
                    sms: 'SMS уведомления',
                    push: 'Push уведомления',
                    orderUpdates: 'Обновления заказов',
                    priceAlerts: 'Уведомления о ценах',
                    newsletters: 'Рассылки и новости'
                  };

                  return (
                    <div key={key} className="flex items-center justify-between p-4 bg-bearplus-card-dark rounded-lg">
                      <div>
                        <h5 className="font-medium text-white">{labels[key as keyof typeof labels]}</h5>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={value}
                          onChange={(e) => setProfile({
                            ...profile,
                            preferences: {
                              ...profile.preferences,
                              notifications: {
                                ...profile.preferences.notifications,
                                [key]: e.target.checked
                              }
                            }
                          })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-bearplus-green/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-bearplus-green"></div>
                      </label>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Preferences Tab */}
          {activeTab === 'preferences' && (
            <div className="space-y-6">
              <h4 className="text-lg font-medium text-white mb-4">Общие настройки</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Язык интерфейса
                  </label>
                  <select
                    value={profile.preferences.language}
                    onChange={(e) => setProfile({
                      ...profile,
                      preferences: {
                        ...profile.preferences,
                        language: e.target.value as 'ru' | 'en'
                      }
                    })}
                    className="input-field"
                  >
                    <option value="ru">Русский</option>
                    <option value="en">English</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Валюта
                  </label>
                  <select
                    value={profile.preferences.currency}
                    onChange={(e) => setProfile({
                      ...profile,
                      preferences: {
                        ...profile.preferences,
                        currency: e.target.value as 'RUB' | 'USD' | 'EUR'
                      }
                    })}
                    className="input-field"
                  >
                    <option value="RUB">₽ Российский рубль</option>
                    <option value="USD">$ Доллар США</option>
                    <option value="EUR">€ Евро</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Часовой пояс
                  </label>
                  <select
                    value={profile.preferences.timezone}
                    onChange={(e) => setProfile({
                      ...profile,
                      preferences: {
                        ...profile.preferences,
                        timezone: e.target.value
                      }
                    })}
                    className="input-field"
                  >
                    <option value="Europe/Moscow">Москва (UTC+3)</option>
                    <option value="Europe/London">Лондон (UTC+0)</option>
                    <option value="America/New_York">Нью-Йорк (UTC-5)</option>
                    <option value="Asia/Shanghai">Шанхай (UTC+8)</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={() => setShowPasswordModal(false)}>
          <div className="bg-bearplus-card-dark rounded-xl p-6 w-full max-w-md border border-gray-700" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-white mb-4">Изменение пароля</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Текущий пароль
                </label>
                <input
                  type="password"
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm({
                    ...passwordForm,
                    currentPassword: e.target.value
                  })}
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Новый пароль
                </label>
                <input
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({
                    ...passwordForm,
                    newPassword: e.target.value
                  })}
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Подтвердите новый пароль
                </label>
                <input
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({
                    ...passwordForm,
                    confirmPassword: e.target.value
                  })}
                  className="input-field"
                />
              </div>
            </div>

            <div className="flex gap-4 mt-6">
              <button
                onClick={handlePasswordChange}
                disabled={isSaving || !passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword}
                className="btn-primary flex-1"
              >
                {isSaving ? 'Изменение...' : 'Изменить пароль'}
              </button>
              <button
                onClick={() => setShowPasswordModal(false)}
                className="btn-secondary flex-1"
              >
                Отмена
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileSettings;