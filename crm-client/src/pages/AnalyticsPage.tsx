import React, { useState, useEffect } from 'react';
import {
  Card,
  Row,
  Col,
  Statistic,
  Typography,
  Select,
  DatePicker,
  Space,
  Progress,
  Table,
  Tag,
  Divider
} from 'antd';
import {
  DollarOutlined,
  ShoppingCartOutlined,
  UserOutlined,
  RiseOutlined,
  FallOutlined,
  TrophyOutlined,
  ClockCircleOutlined,
  GlobalOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;

interface AnalyticsData {
  overview: {
    totalRevenue: number;
    revenueGrowth: number;
    totalOrders: number;
    ordersGrowth: number;
    activeClients: number;
    clientsGrowth: number;
    averageOrderValue: number;
    aovGrowth: number;
  };
  revenueByMonth: Array<{
    month: string;
    revenue: number;
    orders: number;
  }>;
  serviceTypes: Array<{
    type: string;
    name: string;
    revenue: number;
    orders: number;
    percentage: number;
  }>;
  topClients: Array<{
    id: string;
    name: string;
    email: string;
    totalRevenue: number;
    ordersCount: number;
    averageOrderValue: number;
    lastOrderDate: string;
  }>;
  topAgents: Array<{
    id: string;
    name: string;
    email: string;
    totalRevenue: number;
    ordersCount: number;
    clientsCount: number;
    commission: number;
    rating: number;
  }>;
  orderStatuses: Array<{
    status: string;
    name: string;
    count: number;
    percentage: number;
  }>;
  routeAnalytics: Array<{
    route: string;
    ordersCount: number;
    revenue: number;
    averageDeliveryTime: number;
  }>;
}

const AnalyticsPage: React.FC = () => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [timeRange, setTimeRange] = useState<string>('last_30_days');
  const [compareWith, setCompareWith] = useState<string>('previous_period');

  // Mock аналитических данных
  const mockAnalytics: AnalyticsData = {
    overview: {
      totalRevenue: 2450000,
      revenueGrowth: 15.3,
      totalOrders: 189,
      ordersGrowth: 23.7,
      activeClients: 67,
      clientsGrowth: 8.2,
      averageOrderValue: 12963,
      aovGrowth: -4.1
    },
    revenueByMonth: [
      { month: 'Октябрь', revenue: 180000, orders: 32 },
      { month: 'Ноябрь', revenue: 220000, orders: 45 },
      { month: 'Декабрь', revenue: 290000, orders: 58 },
      { month: 'Январь', revenue: 195000, orders: 34 },
      { month: 'Февраль', revenue: 265000, orders: 49 },
      { month: 'Март', revenue: 320000, orders: 62 }
    ],
    serviceTypes: [
      {
        type: 'sea_freight',
        name: 'Морские перевозки',
        revenue: 1450000,
        orders: 89,
        percentage: 59.2
      },
      {
        type: 'air_freight',
        name: 'Авиаперевозки',
        revenue: 680000,
        orders: 45,
        percentage: 27.8
      },
      {
        type: 'land_freight',
        name: 'Автоперевозки',
        revenue: 250000,
        orders: 32,
        percentage: 10.2
      },
      {
        type: 'customs',
        name: 'Таможенное оформление',
        revenue: 70000,
        orders: 23,
        percentage: 2.8
      }
    ],
    topClients: [
      {
        id: '1',
        name: 'ООО "Торговый дом"',
        email: 'trade@company.com',
        totalRevenue: 450000,
        ordersCount: 12,
        averageOrderValue: 37500,
        lastOrderDate: '2024-01-15T10:00:00Z'
      },
      {
        id: '2',
        name: 'ТД "Импорт-Экспорт"',
        email: 'import@trade.ru',
        totalRevenue: 320000,
        ordersCount: 8,
        averageOrderValue: 40000,
        lastOrderDate: '2024-01-14T16:30:00Z'
      },
      {
        id: '3',
        name: 'ИП Петров И.И.',
        email: 'petrov@email.com',
        totalRevenue: 180000,
        ordersCount: 15,
        averageOrderValue: 12000,
        lastOrderDate: '2024-01-16T09:15:00Z'
      }
    ],
    topAgents: [
      {
        id: '1',
        name: 'Анна Петрова',
        email: 'anna.petrova@bearplus.com',
        totalRevenue: 890000,
        ordersCount: 45,
        clientsCount: 28,
        commission: 31150,
        rating: 4.8
      },
      {
        id: '2',
        name: 'Михаил Сидоров',
        email: 'mikhail.sidorov@bearplus.com',
        totalRevenue: 650000,
        ordersCount: 32,
        clientsCount: 19,
        commission: 22750,
        rating: 4.6
      },
      {
        id: '3',
        name: 'Елена Козлова',
        email: 'elena.kozlova@bearplus.com',
        totalRevenue: 420000,
        ordersCount: 28,
        clientsCount: 15,
        commission: 10500,
        rating: 4.9
      }
    ],
    orderStatuses: [
      { status: 'delivered', name: 'Доставлено', count: 89, percentage: 47.1 },
      { status: 'in_progress', name: 'В работе', count: 45, percentage: 23.8 },
      { status: 'shipped', name: 'Отправлено', count: 32, percentage: 16.9 },
      { status: 'pending', name: 'Ожидает', count: 15, percentage: 7.9 },
      { status: 'cancelled', name: 'Отменено', count: 8, percentage: 4.2 }
    ],
    routeAnalytics: [
      {
        route: 'Китай → Россия',
        ordersCount: 67,
        revenue: 980000,
        averageDeliveryTime: 28
      },
      {
        route: 'Европа → Россия',
        ordersCount: 45,
        revenue: 720000,
        averageDeliveryTime: 12
      },
      {
        route: 'США → Россия',
        ordersCount: 23,
        revenue: 560000,
        averageDeliveryTime: 35
      }
    ]
  };

  useEffect(() => {
    loadAnalyticsData();
  }, [timeRange, compareWith]);

  const loadAnalyticsData = async () => {
    setLoading(true);
    try {
      // В реальном приложении здесь будет API запрос
      setTimeout(() => {
        setAnalyticsData(mockAnalytics);
        setLoading(false);
      }, 1000);
    } catch (error) {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString() + ' ₽';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU');
  };

  const getGrowthIcon = (growth: number) => {
    return growth >= 0 ? <RiseOutlined style={{ color: '#52c41a' }} /> : <FallOutlined style={{ color: '#ff4d4f' }} />;
  };

  const getGrowthColor = (growth: number) => {
    return growth >= 0 ? '#52c41a' : '#ff4d4f';
  };

  const getStatusColor = (status: string) => {
    const colors = {
      delivered: 'success',
      in_progress: 'processing',
      shipped: 'blue',
      pending: 'warning',
      cancelled: 'error'
    };
    return colors[status as keyof typeof colors] || 'default';
  };

  const topClientsColumns = [
    {
      title: 'Клиент',
      key: 'client',
      render: (record: any) => (
        <div>
          <div style={{ fontWeight: 500, color: '#fff' }}>{record.name}</div>
          <div style={{ fontSize: 12, color: '#8c8c8c' }}>{record.email}</div>
        </div>
      ),
    },
    {
      title: 'Выручка',
      dataIndex: 'totalRevenue',
      key: 'totalRevenue',
      render: (amount: number) => (
        <span style={{ color: '#52c41a', fontWeight: 500 }}>
          {formatCurrency(amount)}
        </span>
      ),
    },
    {
      title: 'Заказы',
      dataIndex: 'ordersCount',
      key: 'ordersCount',
      render: (count: number) => <span style={{ color: '#fff' }}>{count}</span>,
    },
    {
      title: 'Средний чек',
      dataIndex: 'averageOrderValue',
      key: 'averageOrderValue',
      render: (amount: number) => (
        <span style={{ color: '#1890ff' }}>
          {formatCurrency(amount)}
        </span>
      ),
    },
    {
      title: 'Последний заказ',
      dataIndex: 'lastOrderDate',
      key: 'lastOrderDate',
      render: (date: string) => (
        <span style={{ color: '#8c8c8c' }}>{formatDate(date)}</span>
      ),
    },
  ];

  const topAgentsColumns = [
    {
      title: 'Агент',
      key: 'agent',
      render: (record: any) => (
        <div>
          <div style={{ fontWeight: 500, color: '#fff' }}>{record.name}</div>
          <div style={{ fontSize: 12, color: '#8c8c8c' }}>{record.email}</div>
          <div style={{ fontSize: 12, color: '#faad14' }}>
            Рейтинг: ★ {record.rating}
          </div>
        </div>
      ),
    },
    {
      title: 'Выручка',
      dataIndex: 'totalRevenue',
      key: 'totalRevenue',
      render: (amount: number) => (
        <span style={{ color: '#52c41a', fontWeight: 500 }}>
          {formatCurrency(amount)}
        </span>
      ),
    },
    {
      title: 'Заказы',
      dataIndex: 'ordersCount',
      key: 'ordersCount',
      render: (count: number) => <span style={{ color: '#fff' }}>{count}</span>,
    },
    {
      title: 'Клиенты',
      dataIndex: 'clientsCount',
      key: 'clientsCount',
      render: (count: number) => <span style={{ color: '#1890ff' }}>{count}</span>,
    },
    {
      title: 'Комиссия',
      dataIndex: 'commission',
      key: 'commission',
      render: (amount: number) => (
        <span style={{ color: '#722ed1' }}>
          {formatCurrency(amount)}
        </span>
      ),
    },
  ];

  if (!analyticsData) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <Title level={3} style={{ color: '#8c8c8c' }}>
          Загрузка аналитики...
        </Title>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <Title level={2} style={{ margin: 0, color: '#fff' }}>
          Аналитика и отчеты
        </Title>
        <Text style={{ color: '#8c8c8c' }}>
          Детальная аналитика деятельности компании
        </Text>
      </div>

      {/* Фильтры */}
      <Card className="content-card" style={{ marginBottom: 24 }}>
        <Row gutter={16} align="middle">
          <Col>
            <Text style={{ color: '#fff', marginRight: 8 }}>Период:</Text>
            <Select
              value={timeRange}
              onChange={setTimeRange}
              style={{ width: 180 }}
            >
              <Option value="last_7_days">Последние 7 дней</Option>
              <Option value="last_30_days">Последние 30 дней</Option>
              <Option value="last_3_months">Последние 3 месяца</Option>
              <Option value="last_6_months">Последние 6 месяцев</Option>
              <Option value="last_year">Последний год</Option>
            </Select>
          </Col>
          <Col>
            <Text style={{ color: '#fff', marginRight: 8 }}>Сравнить с:</Text>
            <Select
              value={compareWith}
              onChange={setCompareWith}
              style={{ width: 180 }}
            >
              <Option value="previous_period">Предыдущий период</Option>
              <Option value="previous_year">Прошлый год</Option>
            </Select>
          </Col>
          <Col>
            <RangePicker style={{ width: 280 }} />
          </Col>
        </Row>
      </Card>

      {/* Основные метрики */}
      <Row gutter={[24, 24]} style={{ marginBottom: '32px' }}>
        <Col xs={24} sm={12} lg={6}>
          <Card className="stat-card">
            <Statistic
              title="Общая выручка"
              value={analyticsData.overview.totalRevenue}
              prefix={<DollarOutlined />}
              suffix="₽"
            />
            <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {getGrowthIcon(analyticsData.overview.revenueGrowth)}
              <Text style={{
                color: getGrowthColor(analyticsData.overview.revenueGrowth),
                marginLeft: 4,
                fontSize: 12,
                fontWeight: '500'
              }}>
                {Math.abs(analyticsData.overview.revenueGrowth)}% vs период
              </Text>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="stat-card">
            <Statistic
              title="Всего заказов"
              value={analyticsData.overview.totalOrders}
              prefix={<ShoppingCartOutlined />}
            />
            <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {getGrowthIcon(analyticsData.overview.ordersGrowth)}
              <Text style={{
                color: getGrowthColor(analyticsData.overview.ordersGrowth),
                marginLeft: 4,
                fontSize: 12,
                fontWeight: '500'
              }}>
                {Math.abs(analyticsData.overview.ordersGrowth)}% vs период
              </Text>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="stat-card">
            <Statistic
              title="Активные клиенты"
              value={analyticsData.overview.activeClients}
              prefix={<UserOutlined />}
            />
            <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {getGrowthIcon(analyticsData.overview.clientsGrowth)}
              <Text style={{
                color: getGrowthColor(analyticsData.overview.clientsGrowth),
                marginLeft: 4,
                fontSize: 12,
                fontWeight: '500'
              }}>
                {Math.abs(analyticsData.overview.clientsGrowth)}% vs период
              </Text>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="stat-card">
            <Statistic
              title="Средний чек"
              value={analyticsData.overview.averageOrderValue}
              suffix="₽"
            />
            <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {getGrowthIcon(analyticsData.overview.aovGrowth)}
              <Text style={{
                color: getGrowthColor(analyticsData.overview.aovGrowth),
                marginLeft: 4,
                fontSize: 12,
                fontWeight: '500'
              }}>
                {Math.abs(analyticsData.overview.aovGrowth)}% vs период
              </Text>
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginTop: 24 }}>
        {/* Выручка по типам услуг */}
        <Col xs={24} lg={12}>
          <Card title="Выручка по типам услуг" className="content-card">
            <div style={{ marginBottom: 16 }}>
              {analyticsData.serviceTypes.map((service, index) => (
                <div key={service.type} style={{ marginBottom: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <Text style={{ color: '#fff' }}>{service.name}</Text>
                    <Text style={{ color: '#52c41a' }}>
                      {formatCurrency(service.revenue)} ({service.percentage}%)
                    </Text>
                  </div>
                  <Progress 
                    percent={service.percentage} 
                    strokeColor="#52c41a" 
                    trailColor="#303030"
                    size="small"
                  />
                  <div style={{ fontSize: 11, color: '#8c8c8c', marginTop: 2 }}>
                    {service.orders} заказов
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </Col>

        {/* Статусы заказов */}
        <Col xs={24} lg={12}>
          <Card title="Распределение заказов по статусам" className="content-card">
            <div style={{ marginBottom: 16 }}>
              {analyticsData.orderStatuses.map((status) => (
                <div key={status.status} style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  marginBottom: 12,
                  padding: '8px 12px',
                  background: '#1f1f1f',
                  borderRadius: 6
                }}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Tag color={getStatusColor(status.status)} style={{ marginRight: 8 }}>
                      {status.name}
                    </Tag>
                    <Text style={{ color: '#fff', fontSize: 14 }}>
                      {status.count} заказов
                    </Text>
                  </div>
                  <Text style={{ color: '#8c8c8c', fontSize: 12 }}>
                    {status.percentage}%
                  </Text>
                </div>
              ))}
            </div>
          </Card>
        </Col>
      </Row>

      {/* Топ клиенты */}
      <Row gutter={16} style={{ marginTop: 24 }}>
        <Col span={24}>
          <Card 
            title={
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <TrophyOutlined style={{ marginRight: 8, color: '#faad14' }} />
                <span>Топ клиенты по выручке</span>
              </div>
            }
            className="content-card"
          >
            <Table
              columns={topClientsColumns}
              dataSource={analyticsData.topClients}
              pagination={false}
              size="small"
              rowKey="id"
            />
          </Card>
        </Col>
      </Row>

      {/* Топ агенты */}
      <Row gutter={16} style={{ marginTop: 24 }}>
        <Col span={24}>
          <Card 
            title={
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <TrophyOutlined style={{ marginRight: 8, color: '#faad14' }} />
                <span>Топ агенты по эффективности</span>
              </div>
            }
            className="content-card"
          >
            <Table
              columns={topAgentsColumns}
              dataSource={analyticsData.topAgents}
              pagination={false}
              size="small"
              rowKey="id"
            />
          </Card>
        </Col>
      </Row>

      {/* Аналитика маршрутов */}
      <Row gutter={16} style={{ marginTop: 24 }}>
        <Col span={24}>
          <Card 
            title={
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <GlobalOutlined style={{ marginRight: 8, color: '#1890ff' }} />
                <span>Популярные маршруты</span>
              </div>
            }
            className="content-card"
          >
            <Row gutter={16}>
              {analyticsData.routeAnalytics.map((route, index) => (
                <Col xs={24} md={8} key={index}>
                  <div style={{ 
                    padding: 16,
                    background: '#1f1f1f',
                    borderRadius: 8,
                    border: '1px solid #303030'
                  }}>
                    <Title level={5} style={{ color: '#fff', marginBottom: 8 }}>
                      {route.route}
                    </Title>
                    <div style={{ marginBottom: 8 }}>
                      <Text style={{ color: '#8c8c8c', fontSize: 12 }}>Заказов:</Text>
                      <Text style={{ color: '#1890ff', marginLeft: 8, fontWeight: 500 }}>
                        {route.ordersCount}
                      </Text>
                    </div>
                    <div style={{ marginBottom: 8 }}>
                      <Text style={{ color: '#8c8c8c', fontSize: 12 }}>Выручка:</Text>
                      <Text style={{ color: '#52c41a', marginLeft: 8, fontWeight: 500 }}>
                        {formatCurrency(route.revenue)}
                      </Text>
                    </div>
                    <div>
                      <Text style={{ color: '#8c8c8c', fontSize: 12 }}>Время доставки:</Text>
                      <Text style={{ color: '#faad14', marginLeft: 8, fontWeight: 500 }}>
                        <ClockCircleOutlined style={{ marginRight: 4 }} />
                        {route.averageDeliveryTime} дней
                      </Text>
                    </div>
                  </div>
                </Col>
              ))}
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AnalyticsPage;