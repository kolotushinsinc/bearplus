import * as React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const DashboardPage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (!user) {
    return (
      <div className="flex-1 flex items-center justify-center py-12">
        <div className="text-white text-xl">Загрузка...</div>
      </div>
    );
  }

  return (
    <div className="flex-1 py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Заголовок */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            Личный кабинет
          </h1>
          <p className="text-gray-400">
            Добро пожаловать, {user.firstName} {user.lastName}!
          </p>
        </div>

        {/* Информация о пользователе */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Основная информация */}
          <div className="card">
            <h2 className="text-xl font-bold text-white mb-4">Основная информация</h2>
            <div className="space-y-3 text-gray-300">
              <div>
                <span className="text-gray-400">Имя:</span> {user.firstName}
              </div>
              <div>
                <span className="text-gray-400">Фамилия:</span> {user.lastName}
              </div>
              <div>
                <span className="text-gray-400">Email:</span> {user.email}
              </div>
              <div>
                <span className="text-gray-400">Логин:</span> {user.username}
              </div>
              <div>
                <span className="text-gray-400">Тип пользователя:</span> 
                {user.userType === 'client' ? ' Клиент' : ' Агент'}
              </div>
              {user.phone && (
                <div>
                  <span className="text-gray-400">Телефон:</span> {user.phone}
                </div>
              )}
            </div>
          </div>

          {/* Статус и настройки */}
          <div className="card">
            <h2 className="text-xl font-bold text-white mb-4">Статус аккаунта</h2>
            <div className="space-y-3 text-gray-300">
              <div className="flex items-center">
                <span className="text-gray-400">Email подтвержден:</span>
                <span className={`ml-2 px-2 py-1 rounded text-xs font-medium ${
                  user.isEmailVerified 
                    ? 'bg-green-500/20 text-green-400' 
                    : 'bg-red-500/20 text-red-400'
                }`}>
                  {user.isEmailVerified ? 'Да' : 'Нет'}
                </span>
              </div>
              {user.isPhoneVerified !== undefined && (
                <div className="flex items-center">
                  <span className="text-gray-400">Телефон подтвержден:</span>
                  <span className={`ml-2 px-2 py-1 rounded text-xs font-medium ${
                    user.isPhoneVerified 
                      ? 'bg-green-500/20 text-green-400' 
                      : 'bg-red-500/20 text-red-400'
                  }`}>
                    {user.isPhoneVerified ? 'Да' : 'Нет'}
                  </span>
                </div>
              )}
              {user.language && (
                <div>
                  <span className="text-gray-400">Язык:</span> 
                  {user.language === 'ru' ? ' Русский' : 
                   user.language === 'en' ? ' English' : 
                   user.language === 'zh' ? ' 中文' : ` ${user.language}`}
                </div>
              )}
              {user.createdAt && (
                <div>
                  <span className="text-gray-400">Дата регистрации:</span> 
                  {new Date(user.createdAt).toLocaleDateString('ru-RU')}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Дополнительная информация для агентов */}
        {user.userType === 'agent' && (
          <div className="card mb-8">
            <h2 className="text-xl font-bold text-white mb-4">Информация об организации</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-300">
              {user.companyName && (
                <div>
                  <span className="text-gray-400">Компания:</span> {user.companyName}
                </div>
              )}
              {user.organizationType && (
                <div>
                  <span className="text-gray-400">Тип организации:</span> 
                  {user.organizationType === 'llc' ? ' ООО' :
                   user.organizationType === 'jsc' ? ' АО' :
                   user.organizationType === 'individual' ? ' ИП' :
                   user.organizationType === 'foreign' ? ' Иностранная компания' :
                   user.organizationType === 'other' ? ' Другое' : ` ${user.organizationType}`}
                </div>
              )}
              {user.activityType && (
                <div>
                  <span className="text-gray-400">Тип деятельности:</span> 
                  {user.activityType === 'freight_forwarder' ? ' Экспедитор' :
                   user.activityType === 'customs_broker' ? ' Таможенный брокер' :
                   user.activityType === 'transport_company' ? ' Транспортная компания' :
                   user.activityType === 'logistics' ? ' Логистика' :
                   user.activityType === 'other' ? ' Другое' : ` ${user.activityType}`}
                </div>
              )}
              {user.loyaltyDiscount !== undefined && user.loyaltyDiscount > 0 && (
                <div>
                  <span className="text-gray-400">Скидка лояльности:</span> {user.loyaltyDiscount}%
                </div>
              )}
            </div>
          </div>
        )}

        {/* Информация для клиентов */}
        {user.userType === 'client' && user.companyName && (
          <div className="card mb-8">
            <h2 className="text-xl font-bold text-white mb-4">Информация о компании</h2>
            <div className="text-gray-300">
              <span className="text-gray-400">Компания:</span> {user.companyName}
            </div>
          </div>
        )}

        {/* Действия */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => {
              // TODO: Implement edit profile
              console.log('Edit profile clicked');
            }}
            className="btn-green py-3 px-6"
          >
            Редактировать профиль
          </button>
          
          <button
            onClick={() => {
              // TODO: Implement change password
              console.log('Change password clicked');
            }}
            className="btn-secondary py-3 px-6"
          >
            Сменить пароль
          </button>
          
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white py-3 px-6 rounded transition-colors"
          >
            Выйти
          </button>
        </div>

        {/* Заглушка для будущего функционала */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card text-center">
            <h3 className="text-lg font-semibold text-white mb-2">Заказы</h3>
            <p className="text-gray-400 text-sm mb-4">Управление заказами</p>
            <button className="btn-secondary w-full" disabled>
              Скоро будет доступно
            </button>
          </div>

          <div className="card text-center">
            <h3 className="text-lg font-semibold text-white mb-2">Документы</h3>
            <p className="text-gray-400 text-sm mb-4">Ваши документы</p>
            <button className="btn-secondary w-full" disabled>
              Скоро будет доступно
            </button>
          </div>

          <div className="card text-center">
            <h3 className="text-lg font-semibold text-white mb-2">Уведомления</h3>
            <p className="text-gray-400 text-sm mb-4">Настройки уведомлений</p>
            <button className="btn-secondary w-full" disabled>
              Скоро будет доступно
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;