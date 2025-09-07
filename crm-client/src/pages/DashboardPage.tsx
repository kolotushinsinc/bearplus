import React from 'react';
import { Card, Row, Col, Statistic, Progress, Typography, Space, Button } from 'antd';
import {
  UserOutlined,
  TeamOutlined,
  ShoppingCartOutlined,
  DollarOutlined,
  RiseOutlined,
  EyeOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;

const DashboardPage: React.FC = () => {
  const stats = {
    totalUsers: 1247,
    totalAgents: 34,
    totalOrders: 892,
    totalRevenue: 15420000,
    newUsersToday: 12,
    newOrdersToday: 23,
    activeAgents: 28,
    pendingApprovals: 8
  };

  const recentActivity = [
    { type: 'user', action: 'Новый пользователь зарегистрирован', user: 'Иван Петров', time: '5 мин назад', status: 'success' },
    { type: 'agent', action: 'Агент подал заявку на модерацию', user: 'ООО "ЛогТранс"', time: '12 мин назад', status: 'pending' },
    { type: 'order', action: 'Новый заказ создан', user: 'Анна Сидорова', time: '18 мин назад', status: 'info' },
    { type: 'agent', action: 'Агент одобрен и активирован', user: 'ИП Козлов М.И.', time: '25 мин назад', status: 'success' }
  ];

  return (
    <div className="fade-in">
      {/* Modern Header */}
      <div style={{ marginBottom: '32px' }}>
        <Title level={2} style={{ margin: 0, color: '#fff', fontSize: '32px', fontWeight: '700' }}>
          Панель управления
        </Title>
        <Text style={{ 
          color: '#8c8c8c', 
          fontSize: '16px',
          display: 'block',
          marginTop: '8px'
        }}>
          Добро пожаловать в административную панель BearPlus
        </Text>
      </div>

      {/* Stats Grid */}
      <Row gutter={[24, 24]} style={{ marginBottom: '32px' }}>
        <Col xs={24} sm={12} lg={6}>
          <Card className="stat-card glow-effect">
            <Statistic
              title="Всего пользователей"
              value={stats.totalUsers}
              prefix={<UserOutlined style={{ color: '#1890ff' }} />}
              suffix={
                <div style={{ fontSize: '12px', color: '#52c41a', marginTop: '4px' }}>
                  +{stats.newUsersToday} сегодня
                </div>
              }
            />
            <Progress 
              percent={85} 
              showInfo={false} 
              strokeColor="#1890ff"
              style={{ marginTop: '8px' }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card className="stat-card">
            <Statistic
              title="Агенты"
              value={stats.totalAgents}
              prefix={<TeamOutlined style={{ color: '#52c41a' }} />}
              suffix={
                <div style={{ fontSize: '12px', color: '#52c41a', marginTop: '4px' }}>
                  {stats.activeAgents} активных
                </div>
              }
            />
            <Progress 
              percent={Math.round((stats.activeAgents / stats.totalAgents) * 100)} 
              showInfo={false} 
              strokeColor="#52c41a"
              style={{ marginTop: '8px' }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card className="stat-card">
            <Statistic
              title="Заказы"
              value={stats.totalOrders}
              prefix={<ShoppingCartOutlined style={{ color: '#722ed1' }} />}
              suffix={
                <div style={{ fontSize: '12px', color: '#52c41a', marginTop: '4px' }}>
                  +{stats.newOrdersToday} сегодня
                </div>
              }
            />
            <Progress 
              percent={78} 
              showInfo={false} 
              strokeColor="#722ed1"
              style={{ marginTop: '8px' }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card className="stat-card">
            <Statistic
              title="Выручка"
              value={stats.totalRevenue}
              prefix={<DollarOutlined style={{ color: '#faad14' }} />}
              suffix="₽"
              precision={0}
            />
            <div style={{
              marginTop: '8px',
              fontSize: '12px',
              color: '#52c41a',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              <RiseOutlined />
              +12.5% за месяц
            </div>
          </Card>
        </Col>
      </Row>

      {/* Main Content Grid */}
      <Row gutter={[24, 24]}>
        {/* Recent Activity */}
        <Col xs={24} lg={14}>
          <Card 
            title={
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <EyeOutlined style={{ color: '#00ff88' }} />
                <span>Последняя активность</span>
              </div>
            }
            extra={
              <Button type="link" style={{ color: '#00ff88' }}>
                Показать все
              </Button>
            }
          >
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
              {recentActivity.map((activity, index) => (
                <div key={index} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  padding: '12px 16px',
                  background: 'rgba(20, 25, 20, 0.5)',
                  borderRadius: '12px',
                  border: '1px solid rgba(0, 255, 136, 0.05)',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(0, 255, 136, 0.08)';
                  e.currentTarget.style.borderColor = 'rgba(0, 255, 136, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(20, 25, 20, 0.5)';
                  e.currentTarget.style.borderColor = 'rgba(0, 255, 136, 0.05)';
                }}
                >
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '10px',
                    background: activity.status === 'success' 
                      ? 'rgba(82, 196, 26, 0.15)' 
                      : activity.status === 'pending'
                      ? 'rgba(250, 173, 20, 0.15)'
                      : 'rgba(24, 144, 255, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: `1px solid ${
                      activity.status === 'success' 
                        ? 'rgba(82, 196, 26, 0.3)' 
                        : activity.status === 'pending'
                        ? 'rgba(250, 173, 20, 0.3)'
                        : 'rgba(24, 144, 255, 0.3)'
                    }`
                  }}>
                    {activity.status === 'success' && <CheckCircleOutlined style={{ color: '#52c41a' }} />}
                    {activity.status === 'pending' && <ClockCircleOutlined style={{ color: '#faad14' }} />}
                    {activity.status === 'info' && <EyeOutlined style={{ color: '#1890ff' }} />}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ color: '#fff', fontWeight: '500', marginBottom: '2px' }}>
                      {activity.action}
                    </div>
                    <div style={{ color: '#8c8c8c', fontSize: '13px' }}>
                      {activity.user} • {activity.time}
                    </div>
                  </div>
                </div>
              ))}
            </Space>
          </Card>
        </Col>

        {/* Quick Actions */}
        <Col xs={24} lg={10}>
          <Card 
            title={
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <RiseOutlined style={{ color: '#00ff88' }} />
                <span>Быстрые действия</span>
              </div>
            }
          >
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              <Card 
                size="small" 
                style={{ 
                  background: 'rgba(0, 255, 136, 0.05)',
                  border: '1px solid rgba(0, 255, 136, 0.2)'
                }}
              >
                <div style={{ textAlign: 'center' }}>
                  <Title level={4} style={{ color: '#faad14', margin: '0 0 8px 0' }}>
                    {stats.pendingApprovals}
                  </Title>
                  <Text style={{ color: '#8c8c8c' }}>Заявок на модерацию</Text>
                  <br />
                  <Button 
                    type="primary" 
                    size="small" 
                    style={{ marginTop: '12px' }}
                    onClick={() => window.location.href = '/agents?filter=pending'}
                  >
                    Перейти к модерации
                  </Button>
                </div>
              </Card>

              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '16px'
              }}>
                <Button 
                  type="default"
                  style={{
                    height: '60px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'rgba(24, 144, 255, 0.1)',
                    border: '1px solid rgba(24, 144, 255, 0.3)',
                    color: '#1890ff'
                  }}
                  onClick={() => window.location.href = '/users'}
                >
                  <UserOutlined style={{ fontSize: '20px', marginBottom: '4px' }} />
                  <span style={{ fontSize: '12px' }}>Пользователи</span>
                </Button>

                <Button 
                  type="default"
                  style={{
                    height: '60px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'rgba(114, 46, 209, 0.1)',
                    border: '1px solid rgba(114, 46, 209, 0.3)',
                    color: '#722ed1'
                  }}
                  onClick={() => window.location.href = '/orders'}
                >
                  <ShoppingCartOutlined style={{ fontSize: '20px', marginBottom: '4px' }} />
                  <span style={{ fontSize: '12px' }}>Заказы</span>
                </Button>
              </div>

              <div style={{
                background: 'rgba(82, 196, 26, 0.05)',
                border: '1px solid rgba(82, 196, 26, 0.2)',
                borderRadius: '12px',
                padding: '16px',
                textAlign: 'center'
              }}>
                <Text style={{ color: '#52c41a', fontSize: '14px', fontWeight: '600' }}>
                  Система работает стабильно
                </Text>
                <br />
                <Text style={{ color: '#8c8c8c', fontSize: '12px' }}>
                  Все сервисы доступны • Время отклика: 45мс
                </Text>
              </div>
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DashboardPage;