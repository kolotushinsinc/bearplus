import * as React from 'react';
import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { logoutUser } from '../store/slices/authSlice';
import { useNavigate } from 'react-router-dom';
import ShippingCalculator from '../components/ShippingCalculator';
import OrdersManagement from '../components/dashboard/OrdersManagement';
import DocumentsManagement from '../components/dashboard/DocumentsManagement';
import MessengerSystem from '../components/dashboard/MessengerSystem';
import ShipTrackingMap from '../components/dashboard/ShipTrackingMap';
import ProfileSettings from '../components/dashboard/ProfileSettings';
import RatesManagement from '../components/dashboard/RatesManagement';
import MarginSettings from '../components/dashboard/MarginSettings';
import CalculatorSettings from '../components/dashboard/CalculatorSettings';
import LoyaltyManagement from '../components/dashboard/LoyaltyManagement';

type DashboardTab = 'overview' | 'calculator' | 'orders' | 'documents' | 'messenger' | 'tracking' | 'profile' | 'rates' | 'margins' | 'calculator-settings' | 'loyalty';

const DashboardPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user, isLoading } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<DashboardTab>('overview');

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser());
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (isLoading || !user) {
    return (
      <div className="flex-1 flex items-center justify-center py-12">
        <div className="text-white text-xl">Загрузка...</div>
      </div>
    );
  }

  const baseTabs = [
    { id: 'overview', label: 'Обзор', icon: '📊' },
    { id: 'calculator', label: 'Расчет доставки', icon: '🧮' },
    { id: 'orders', label: 'Заявки', icon: '📋' },
    { id: 'documents', label: 'Документы', icon: '📄' },
    { id: 'messenger', label: 'Сообщения', icon: '💬' },
    { id: 'tracking', label: 'Судовая карта', icon: '🗺️' },
    { id: 'profile', label: 'Профиль', icon: '👤' }
  ];

  const agentTabs = [
    { id: 'rates', label: 'Управление ставками', icon: '💰' },
    { id: 'margins', label: 'Настройки маржи', icon: '📈' },
    { id: 'calculator-settings', label: 'Настройки калькулятора', icon: '⚙️' },
    { id: 'loyalty', label: 'Лояльность', icon: '🎁' }
  ];

  const tabs = user?.userType === 'agent'
    ? [...baseTabs, ...agentTabs]
    : baseTabs;

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-4">
          Добро пожаловать, {user.firstName} {user.lastName}!
        </h1>
        <p className="text-gray-300">Управляйте своими логистическими операциями</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="card text-center">
          <div className="text-2xl font-bold text-bearplus-green mb-2">5</div>
          <div className="text-gray-400 text-sm">Активных заявок</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-bearplus-green mb-2">12</div>
          <div className="text-gray-400 text-sm">Завершенных заявок</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-bearplus-green mb-2">3</div>
          <div className="text-gray-400 text-sm">Судов в пути</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-bearplus-green mb-2">24</div>
          <div className="text-gray-400 text-sm">Документов</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="card hover:shadow-glow-sm transition-all duration-300 cursor-pointer"
             onClick={() => setActiveTab('calculator')}>
          <div className="text-3xl mb-4">🧮</div>
          <h3 className="text-lg font-semibold text-white mb-2">Рассчитать доставку</h3>
          <p className="text-gray-300 text-sm">Получите стоимость доставки груза</p>
        </div>

        <div className="card hover:shadow-glow-sm transition-all duration-300 cursor-pointer"
             onClick={() => setActiveTab('orders')}>
          <div className="text-3xl mb-4">📋</div>
          <h3 className="text-lg font-semibold text-white mb-2">Создать заявку</h3>
          <p className="text-gray-300 text-sm">Оформите новую заявку на перевозку</p>
        </div>

        <div className="card hover:shadow-glow-sm transition-all duration-300 cursor-pointer"
             onClick={() => setActiveTab('tracking')}>
          <div className="text-3xl mb-4">🗺️</div>
          <h3 className="text-lg font-semibold text-white mb-2">Отследить груз</h3>
          <p className="text-gray-300 text-sm">Посмотрите текущее местоположение</p>
        </div>

        <div className="card hover:shadow-glow-sm transition-all duration-300 cursor-pointer"
             onClick={() => setActiveTab('documents')}>
          <div className="text-3xl mb-4">📄</div>
          <h3 className="text-lg font-semibold text-white mb-2">Загрузить документы</h3>
          <p className="text-gray-300 text-sm">Управление документооборотом</p>
        </div>

        <div className="card hover:shadow-glow-sm transition-all duration-300 cursor-pointer"
             onClick={() => setActiveTab('messenger')}>
          <div className="text-3xl mb-4">💬</div>
          <h3 className="text-lg font-semibold text-white mb-2">Связаться с логистом</h3>
          <p className="text-gray-300 text-sm">Прямой диалог со специалистом</p>
        </div>

        <div className="card hover:shadow-glow-sm transition-all duration-300 cursor-pointer"
             onClick={() => setActiveTab('profile')}>
          <div className="text-3xl mb-4">👤</div>
          <h3 className="text-lg font-semibold text-white mb-2">Настройки профиля</h3>
          <p className="text-gray-300 text-sm">Управление аккаунтом</p>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card">
        <h3 className="text-xl font-bold text-white mb-4">Последняя активность</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-bearplus-card-dark rounded-lg">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-bearplus-green rounded-full mr-3"></div>
              <div>
                <div className="text-white font-medium">Заявка #ORD-2024-001 обновлена</div>
                <div className="text-gray-400 text-sm">Груз прибыл в порт Шанхай</div>
              </div>
            </div>
            <div className="text-gray-500 text-sm">2 часа назад</div>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-bearplus-card-dark rounded-lg">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
              <div>
                <div className="text-white font-medium">Новое сообщение от логиста</div>
                <div className="text-gray-400 text-sm">Требуется дополнительный документ</div>
              </div>
            </div>
            <div className="text-gray-500 text-sm">5 часов назад</div>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-bearplus-card-dark rounded-lg">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></div>
              <div>
                <div className="text-white font-medium">Документ загружен</div>
                <div className="text-gray-400 text-sm">Commercial_Invoice.pdf</div>
              </div>
            </div>
            <div className="text-gray-500 text-sm">1 день назад</div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex-1 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 border-b border-gray-700 pb-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as DashboardTab)}
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

        {/* Content */}
        <div className="min-h-[600px]">
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'calculator' && <ShippingCalculator className="max-w-4xl mx-auto" />}
          {activeTab === 'orders' && <OrdersManagement />}
          {activeTab === 'documents' && <DocumentsManagement />}
          {activeTab === 'messenger' && <MessengerSystem />}
          {activeTab === 'tracking' && <ShipTrackingMap />}
          {activeTab === 'profile' && <ProfileSettings onLogout={handleLogout} />}
          {/* Agent-specific tabs */}
          {user?.userType === 'agent' && (
            <>
              {activeTab === 'rates' && <RatesManagement />}
              {activeTab === 'margins' && <MarginSettings />}
              {activeTab === 'calculator-settings' && <CalculatorSettings />}
              {activeTab === 'loyalty' && <LoyaltyManagement />}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;