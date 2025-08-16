import React from 'react';
import { Card, Typography } from 'antd';

const { Title } = Typography;

const SettingsPage: React.FC = () => {
  return (
    <div>
      <div className="page-header">
        <Title level={2} style={{ margin: 0, color: '#fff' }}>
          Настройки системы
        </Title>
      </div>
      
      <Card className="content-card">
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <Title level={3} style={{ color: '#8c8c8c' }}>
            Страница в разработке
          </Title>
          <p style={{ color: '#8c8c8c' }}>
            Здесь будут настройки системы
          </p>
        </div>
      </Card>
    </div>
  );
};

export default SettingsPage;