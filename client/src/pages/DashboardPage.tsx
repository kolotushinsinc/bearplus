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
import CompanyInfoManagement from '../components/dashboard/CompanyInfoManagement';
import CompanyPartnerships from '../components/dashboard/CompanyPartnerships';

type DashboardTab = 'overview' | 'calculator' | 'orders' | 'documents' | 'messenger' | 'tracking' | 'profile' | 'company-info' | 'partnerships' | 'rates' | 'margins' | 'calculator-settings' | 'loyalty';

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
    { id: 'company-info', label: 'Информация о компании', icon: '🏢' },
    { id: 'partnerships', label: 'Сотрудничество', icon: '🤝' },
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
    <div className="space-y-8">
      {/* Modern Stats Grid */}
      <div className="grid tech-grid-4 gap-6 mb-8">
        <div className="card-interactive text-center group">
          <div className="flex items-center justify-center mb-3">
            <div className="p-3 bg-tech-success/10 rounded-lg border border-tech-success/20 group-hover:glow-tech-sm transition-all">
              <span className="text-2xl text-gradient font-bold">5</span>
            </div>
          </div>
          <div className="text-tech-caption font-medium">Активных заявок</div>
          <div className="progress-bar mt-2">
            <div className="progress-fill" style={{width: '65%'}}></div>
          </div>
        </div>
        <div className="card-interactive text-center group">
          <div className="flex items-center justify-center mb-3">
            <div className="p-3 bg-tech-info/10 rounded-lg border border-tech-info/20 group-hover:glow-tech-sm transition-all">
              <span className="text-2xl text-gradient font-bold">12</span>
            </div>
          </div>
          <div className="text-tech-caption font-medium">Завершенных заявок</div>
          <div className="progress-bar mt-2">
            <div className="progress-fill" style={{width: '85%'}}></div>
          </div>
        </div>
        <div className="card-interactive text-center group">
          <div className="flex items-center justify-center mb-3">
            <div className="p-3 bg-tech-warning/10 rounded-lg border border-tech-warning/20 group-hover:glow-tech-sm transition-all">
              <span className="text-2xl text-gradient font-bold">3</span>
            </div>
          </div>
          <div className="text-tech-caption font-medium">Судов в пути</div>
          <div className="progress-bar mt-2">
            <div className="progress-fill" style={{width: '45%'}}></div>
          </div>
        </div>
        <div className="card-interactive text-center group">
          <div className="flex items-center justify-center mb-3">
            <div className="p-3 bg-tech-secondary/10 rounded-lg border border-tech-secondary/20 group-hover:glow-tech-sm transition-all">
              <span className="text-2xl text-gradient font-bold">24</span>
            </div>
          </div>
          <div className="text-tech-caption font-medium">Документов</div>
          <div className="progress-bar mt-2">
            <div className="progress-fill" style={{width: '92%'}}></div>
          </div>
        </div>
      </div>

      {/* Modern Quick Actions */}
      <div className="grid tech-grid-3 gap-6">
        {[
          { tab: 'calculator', icon: '🧮', title: 'Рассчитать доставку', desc: 'Получите стоимость доставки груза', color: 'tech-primary' },
          { tab: 'orders', icon: '📋', title: 'Создать заявку', desc: 'Оформите новую заявку на перевозку', color: 'tech-secondary' },
          { tab: 'tracking', icon: '🗺️', title: 'Отследить груз', desc: 'Посмотрите текущее местоположение', color: 'tech-accent' },
          { tab: 'documents', icon: '📄', title: 'Загрузить документы', desc: 'Управление документооборотом', color: 'tech-info' },
          { tab: 'messenger', icon: '💬', title: 'Связаться с логистом', desc: 'Прямой диалог со специалистом', color: 'tech-warning' },
          { tab: 'profile', icon: '👤', title: 'Настройки профиля', desc: 'Управление аккаунтом', color: 'tech-error' }
        ].slice(0, 6).map((action) => (
          <div
            key={action.tab}
            className="card-interactive cursor-pointer group relative overflow-hidden"
            onClick={() => setActiveTab(action.tab as DashboardTab)}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-tech-primary/5 via-transparent to-tech-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative z-10">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-tech-surface-elevated rounded-lg border border-tech-border-light group-hover:border-tech-primary/50 transition-colors">
                  <span className="text-lg">{action.icon}</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-tech-subtitle mb-2 group-hover:text-gradient transition-colors">{action.title}</h3>
                  <p className="text-tech-caption">{action.desc}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modern Activity Feed */}
      <div className="card">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-tech-primary/10 rounded-lg border border-tech-primary/20">
            <span className="text-lg">📊</span>
          </div>
          <h3 className="text-tech-subtitle">Последняя активность</h3>
        </div>
        <div className="space-y-3">
          {[
            { type: 'success', icon: '✅', title: 'Заявка #ORD-2024-001 обновлена', desc: 'Груз прибыл в порт Шанхай', time: '2 часа назад' },
            { type: 'info', icon: '💬', title: 'Новое сообщение от логиста', desc: 'Требуется дополнительный документ', time: '5 часов назад' },
            { type: 'warning', icon: '📄', title: 'Документ загружен', desc: 'Commercial_Invoice.pdf', time: '1 день назад' }
          ].map((activity, index) => (
            <div key={index} className="flex items-center gap-4 p-4 bg-tech-surface rounded-lg border border-tech-border hover:border-tech-border-light transition-colors group">
              <div className={`p-2 rounded-lg border ${
                activity.type === 'success' ? 'bg-tech-success/10 border-tech-success/20' :
                activity.type === 'info' ? 'bg-tech-info/10 border-tech-info/20' :
                'bg-tech-warning/10 border-tech-warning/20'
              }`}>
                <span className="text-sm">{activity.icon}</span>
              </div>
              <div className="flex-1">
                <div className="text-tech-body font-medium group-hover:text-gradient transition-colors">{activity.title}</div>
                <div className="text-tech-caption">{activity.desc}</div>
              </div>
              <div className="text-tech-mono text-xs">{activity.time}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex-1 py-8 tech-container animate-fade-in">
      {/* Modern Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 bg-tech-primary/10 rounded-xl border border-tech-primary/20">
            <span className="text-2xl">🏠</span>
          </div>
          <div>
            <h1 className="text-tech-title">Личный кабинет</h1>
            <p className="text-tech-caption">
              Добро пожаловать, <span className="text-gradient font-semibold">{user.firstName}</span>
            </p>
          </div>
        </div>
        
        {/* Modern Navigation Tabs */}
        <div className="filter-bar flex-wrap">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as DashboardTab)}
              className={`filter-btn flex items-center gap-2 ${
                activeTab === tab.id ? 'active' : ''
              }`}
            >
              <span className="text-sm">{tab.icon}</span>
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <div className="min-h-[600px] animate-slide-up">
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'calculator' && <ShippingCalculator className="max-w-5xl mx-auto" />}
        {activeTab === 'orders' && <OrdersManagement />}
        {activeTab === 'documents' && <DocumentsManagement />}
        {activeTab === 'messenger' && <MessengerSystem />}
        {activeTab === 'tracking' && <ShipTrackingMap />}
        {activeTab === 'company-info' && <CompanyInfoManagement />}
        {activeTab === 'partnerships' && <CompanyPartnerships />}
        {activeTab === 'profile' && <ProfileSettings />}
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
  );
};

export default DashboardPage;