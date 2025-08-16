import React, { useEffect } from 'react';
import { Row, Col, Card, Statistic, Typography, Space, Progress } from 'antd';
import { 
  UserOutlined, 
  ShoppingCartOutlined, 
  DollarOutlined,
  RiseOutlined 
} from '@ant-design/icons';

const { Title, Text } = Typography;

const DashboardPage: React.FC = () => {
  // Mock данные для статистики
  const stats = {
    totalUsers: 1247,
    totalOrders: 3892,
    totalRevenue: 15678900,
    monthlyGrowth: 12.5,
    activeUsers: 892,
    pendingOrders: 45,
    completedOrders: 3847,
    avgOrderValue: 4025
  };

  return (
    <div>
      <div className="page-header">
        <Title level={2} style={{ margin: 0, color: '#fff' }}>
          Панель управления
        </Title>
        <Text style={{ color: '#8c8c8c' }}>
          Обзор системы BearPlus
        </Text>
      </div>

      {/* Основная статистика */}
      <Row gutter={[16, 16]} className="stats-grid">
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Всего пользователей"
              value={stats.totalUsers}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Всего заказов"
              value={stats.totalOrders}
              prefix={<ShoppingCartOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Общий доход"
              value={stats.totalRevenue}
              prefix={<DollarOutlined />}
              suffix="₽"
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Рост за месяц"
              value={stats.monthlyGrowth}
              prefix={<RiseOutlined />}
              suffix="%"
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        {/* Активность пользователей */}
        <Col xs={24} lg={12}>
          <Card 
            title="Активность пользователей"
            className="content-card"
          >
            <Space direction="vertical" style={{ width: '100%' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <Text style={{ color: '#fff' }}>Активные пользователи</Text>
                  <Text style={{ color: '#52c41a' }}>{stats.activeUsers}</Text>
                </div>
                <Progress 
                  percent={Math.round((stats.activeUsers / stats.totalUsers) * 100)} 
                  strokeColor="#52c41a"
                  trailColor="#303030"
                />
              </div>
              
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <Text style={{ color: '#fff' }}>Завершенные заказы</Text>
                  <Text style={{ color: '#1890ff' }}>{stats.completedOrders}</Text>
                </div>
                <Progress 
                  percent={Math.round((stats.completedOrders / stats.totalOrders) * 100)} 
                  strokeColor="#1890ff"
                  trailColor="#303030"
                />
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <Text style={{ color: '#fff' }}>Заказы в обработке</Text>
                  <Text style={{ color: '#faad14' }}>{stats.pendingOrders}</Text>
                </div>
                <Progress 
                  percent={Math.round((stats.pendingOrders / stats.totalOrders) * 100)} 
                  strokeColor="#faad14"
                  trailColor="#303030"
                />
              </div>
            </Space>
          </Card>
        </Col>

        {/* Последние действия */}
        <Col xs={24} lg={12}>
          <Card 
            title="Последние действия"
            className="content-card"
          >
            <Space direction="vertical" style={{ width: '100%' }}>
              <div style={{ 
                padding: '12px', 
                background: '#1f1f1f', 
                borderRadius: '6px',
                border: '1px solid #303030'
              }}>
                <Text style={{ color: '#52c41a', fontWeight: 500 }}>
                  Новый пользователь зарегистрирован
                </Text>
                <br />
                <Text style={{ color: '#8c8c8c', fontSize: '12px' }}>
                  ivan@example.com - 5 минут назад
                </Text>
              </div>

              <div style={{ 
                padding: '12px', 
                background: '#1f1f1f', 
                borderRadius: '6px',
                border: '1px solid #303030'
              }}>
                <Text style={{ color: '#1890ff', fontWeight: 500 }}>
                  Заказ ORD-2024-001 завершен
                </Text>
                <br />
                <Text style={{ color: '#8c8c8c', fontSize: '12px' }}>
                  Сумма: 45,000 ₽ - 15 минут назад
                </Text>
              </div>

              <div style={{ 
                padding: '12px', 
                background: '#1f1f1f', 
                borderRadius: '6px',
                border: '1px solid #303030'
              }}>
                <Text style={{ color: '#faad14', fontWeight: 500 }}>
                  Агент создал новую ставку
                </Text>
                <br />
                <Text style={{ color: '#8c8c8c', fontSize: '12px' }}>
                  Шанхай → Санкт-Петербург - 30 минут назад
                </Text>
              </div>

              <div style={{ 
                padding: '12px', 
                background: '#1f1f1f', 
                borderRadius: '6px',
                border: '1px solid #303030'
              }}>
                <Text style={{ color: '#722ed1', fontWeight: 500 }}>
                  Обновлена скидка клиента
                </Text>
                <br />
                <Text style={{ color: '#8c8c8c', fontSize: '12px' }}>
                  anna@company.ru - скидка 10% - 1 час назад
                </Text>
              </div>
            </Space>
          </Card>
        </Col>
      </Row>

      {/* Средняя стоимость заказа */}
      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col span={24}>
          <Card 
            title="Ключевые метрики"
            className="content-card"
          >
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={8}>
                <div style={{ textAlign: 'center' }}>
                  <Statistic
                    title="Средняя стоимость заказа"
                    value={stats.avgOrderValue}
                    suffix="₽"
                    valueStyle={{ color: '#52c41a' }}
                  />
                </div>
              </Col>
              <Col xs={24} sm={8}>
                <div style={{ textAlign: 'center' }}>
                  <Statistic
                    title="Конверсия в заказ"
                    value={73.5}
                    suffix="%"
                    valueStyle={{ color: '#1890ff' }}
                  />
                </div>
              </Col>
              <Col xs={24} sm={8}>
                <div style={{ textAlign: 'center' }}>
                  <Statistic
                    title="Время обработки"
                    value={2.4}
                    suffix="дня"
                    valueStyle={{ color: '#faad14' }}
                  />
                </div>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DashboardPage;