import React from 'react';
import { Layout, Space, Dropdown, Avatar, Typography, Button } from 'antd';
import { UserOutlined, LogoutOutlined, SettingOutlined } from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { logoutAdmin } from '../../store/slices/authSlice';
import { useNavigate } from 'react-router-dom';

const { Header: AntHeader } = Layout;
const { Text } = Typography;

const Header: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logoutAdmin());
    navigate('/login');
  };

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Профиль',
      onClick: () => navigate('/profile'),
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'Настройки',
      onClick: () => navigate('/settings'),
    },
    {
      type: 'divider' as const,
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Выйти',
      onClick: handleLogout,
    },
  ];

  return (
    <AntHeader style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '0 24px',
      background: '#001529',
      borderBottom: '1px solid #303030'
    }}>
      <div>
        <Text style={{ color: '#8c8c8c', fontSize: '14px' }}>
          Добро пожаловать в систему управления BearPlus
        </Text>
      </div>

      <Space>
        <Text style={{ color: '#fff', marginRight: '12px' }}>
          {user?.firstName} {user?.lastName}
        </Text>
        
        <Dropdown
          menu={{ items: userMenuItems }}
          placement="bottomRight"
          trigger={['click']}
        >
          <Button
            type="text"
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              color: '#fff',
              height: '40px'
            }}
          >
            <Avatar 
              size={32} 
              icon={<UserOutlined />} 
              style={{ 
                backgroundColor: '#52c41a',
                marginRight: '8px'
              }} 
            />
          </Button>
        </Dropdown>
      </Space>
    </AntHeader>
  );
};

export default Header;