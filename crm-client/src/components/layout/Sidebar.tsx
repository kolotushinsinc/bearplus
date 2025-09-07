import React from 'react';
import { Layout, Menu } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  DashboardOutlined,
  UserOutlined,
  TeamOutlined,
  ShoppingCartOutlined,
  BarChartOutlined,
  SettingOutlined,
} from '@ant-design/icons';

const { Sider } = Layout;

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      key: '/dashboard',
      icon: <DashboardOutlined />,
      label: 'Панель управления',
    },
    {
      key: '/users',
      icon: <UserOutlined />,
      label: 'Пользователи',
    },
    {
      key: '/agents',
      icon: <TeamOutlined />,
      label: 'Агенты',
    },
    {
      key: '/orders',
      icon: <ShoppingCartOutlined />,
      label: 'Заказы',
    },
    {
      key: '/analytics',
      icon: <BarChartOutlined />,
      label: 'Аналитика',
    },
    {
      key: '/settings',
      icon: <SettingOutlined />,
      label: 'Настройки',
    },
  ];

  const handleMenuClick = ({ key }: { key: string }) => {
    navigate(key);
  };

  return (
    <Sider 
      width={280} 
      style={{
        overflow: 'auto',
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
      }}
      className="slide-in"
    >
      {/* Modern Header */}
      <div style={{
        height: '80px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        borderBottom: '1px solid rgba(0, 255, 136, 0.1)',
        background: 'rgba(5, 10, 5, 0.8)',
        padding: '20px'
      }}>
        <div style={{
          color: '#00ff88',
          fontSize: '24px',
          fontWeight: '700',
          background: 'linear-gradient(135deg, #00ff88, #1de9b6)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          marginBottom: '4px'
        }}>
          BearPlus
        </div>
        <div style={{
          color: '#666',
          fontSize: '12px',
          textTransform: 'uppercase',
          letterSpacing: '1px',
          fontWeight: '500'
        }}>
          CRM System
        </div>
      </div>

      {/* Navigation Menu */}
      <div style={{ 
        flex: 1, 
        padding: '16px 0',
        height: 'calc(100vh - 160px)',
        overflowY: 'auto'
      }}>
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={handleMenuClick}
          style={{ 
            borderRight: 0,
            background: 'transparent'
          }}
        />
      </div>

      {/* Footer with KolTech Branding */}
      <div className="sidebar-footer">
        <div className="koltech-branding">
          Powered by <span className="highlight">KolTech</span>
        </div>
        <div style={{
          color: '#444',
          fontSize: '10px',
          marginTop: '4px',
          letterSpacing: '0.3px'
        }}>
          © 2025 Professional Development
        </div>
      </div>
    </Sider>
  );
};

export default Sidebar;