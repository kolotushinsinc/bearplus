import React, { useState, useEffect } from 'react';
import {
  Table,
  Card,
  Button,
  Space,
  Tag,
  Input,
  Select,
  Modal,
  Form,
  message,
  Typography,
  Row,
  Col,
  Statistic,
  Descriptions,
  Steps,
  Timeline,
  Tabs
} from 'antd';
import {
  SearchOutlined,
  EyeOutlined,
  EditOutlined,
  CheckOutlined,
  CloseOutlined,
  ExportOutlined,
  FileTextOutlined,
  DollarOutlined,
  ShoppingCartOutlined,
  ClockCircleOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;
const { Option } = Select;
const { Step } = Steps;
const { TabPane } = Tabs;

interface Order {
  id: string;
  orderNumber: string;
  clientId: string;
  clientName: string;
  clientEmail: string;
  agentId: string;
  agentName: string;
  status: 'draft' | 'pending' | 'confirmed' | 'in_progress' | 'shipped' | 'delivered' | 'cancelled';
  serviceType: 'sea_freight' | 'air_freight' | 'land_freight' | 'customs' | 'warehouse';
  cargo: {
    description: string;
    weight: number;
    volume: number;
    value: number;
    currency: string;
  };
  route: {
    origin: string;
    destination: string;
    portOfLoading?: string;
    portOfDischarge?: string;
  };
  pricing: {
    basePrice: number;
    additionalFees: number;
    discount: number;
    totalPrice: number;
    currency: string;
  };
  timeline: {
    estimatedDeparture?: string;
    estimatedArrival: string;
    actualDeparture?: string;
    actualArrival?: string;
  };
  documents: Array<{
    id: string;
    name: string;
    type: string;
    status: 'pending' | 'approved' | 'rejected';
    uploadedAt: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [serviceTypeFilter, setServiceTypeFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);

  // Mock данные заказов
  const mockOrders: Order[] = [
    {
      id: '1',
      orderNumber: 'ORD-2024-001',
      clientId: 'client1',
      clientName: 'ООО "Торговый дом"',
      clientEmail: 'trade@company.com',
      agentId: 'agent1',
      agentName: 'Анна Петрова',
      status: 'in_progress',
      serviceType: 'sea_freight',
      cargo: {
        description: 'Электроника и комплектующие',
        weight: 15000,
        volume: 28,
        value: 450000,
        currency: 'USD'
      },
      route: {
        origin: 'Шанхай, Китай',
        destination: 'Санкт-Петербург, Россия',
        portOfLoading: 'Порт Шанхай',
        portOfDischarge: 'Порт СПб'
      },
      pricing: {
        basePrice: 12000,
        additionalFees: 2500,
        discount: 1000,
        totalPrice: 13500,
        currency: 'USD'
      },
      timeline: {
        estimatedDeparture: '2024-01-20T10:00:00Z',
        estimatedArrival: '2024-02-15T14:00:00Z'
      },
      documents: [
        {
          id: 'doc1',
          name: 'Commercial Invoice',
          type: 'invoice',
          status: 'approved',
          uploadedAt: '2024-01-16T10:00:00Z'
        },
        {
          id: 'doc2',
          name: 'Packing List',
          type: 'packing_list',
          status: 'approved',
          uploadedAt: '2024-01-16T10:30:00Z'
        }
      ],
      createdAt: '2024-01-15T14:30:00Z',
      updatedAt: '2024-01-16T16:45:00Z'
    },
    {
      id: '2',
      orderNumber: 'ORD-2024-002',
      clientId: 'client2',
      clientName: 'ИП Петров И.И.',
      clientEmail: 'petrov@email.com',
      agentId: 'agent2',
      agentName: 'Михаил Сидоров',
      status: 'pending',
      serviceType: 'air_freight',
      cargo: {
        description: 'Медицинское оборудование',
        weight: 250,
        volume: 2.5,
        value: 85000,
        currency: 'EUR'
      },
      route: {
        origin: 'Франкфурт, Германия',
        destination: 'Москва, Россия'
      },
      pricing: {
        basePrice: 3500,
        additionalFees: 800,
        discount: 0,
        totalPrice: 4300,
        currency: 'EUR'
      },
      timeline: {
        estimatedDeparture: '2024-01-18T08:00:00Z',
        estimatedArrival: '2024-01-20T16:00:00Z'
      },
      documents: [
        {
          id: 'doc3',
          name: 'Air Waybill',
          type: 'awb',
          status: 'pending',
          uploadedAt: '2024-01-16T11:00:00Z'
        }
      ],
      createdAt: '2024-01-16T09:15:00Z',
      updatedAt: '2024-01-16T14:20:00Z'
    },
    {
      id: '3',
      orderNumber: 'ORD-2024-003',
      clientId: 'client3',
      clientName: 'ТД "Импорт-Экспорт"',
      clientEmail: 'import@trade.ru',
      agentId: 'agent1',
      agentName: 'Анна Петрова',
      status: 'delivered',
      serviceType: 'land_freight',
      cargo: {
        description: 'Автозапчасти',
        weight: 8500,
        volume: 15,
        value: 125000,
        currency: 'EUR'
      },
      route: {
        origin: 'Берлин, Германия',
        destination: 'Москва, Россия'
      },
      pricing: {
        basePrice: 5800,
        additionalFees: 1200,
        discount: 500,
        totalPrice: 6500,
        currency: 'EUR'
      },
      timeline: {
        estimatedDeparture: '2024-01-10T06:00:00Z',
        estimatedArrival: '2024-01-17T18:00:00Z',
        actualDeparture: '2024-01-10T07:30:00Z',
        actualArrival: '2024-01-16T20:15:00Z'
      },
      documents: [
        {
          id: 'doc4',
          name: 'CMR Document',
          type: 'cmr',
          status: 'approved',
          uploadedAt: '2024-01-09T16:00:00Z'
        },
        {
          id: 'doc5',
          name: 'Custom Declaration',
          type: 'customs',
          status: 'approved',
          uploadedAt: '2024-01-16T15:00:00Z'
        }
      ],
      createdAt: '2024-01-08T10:00:00Z',
      updatedAt: '2024-01-16T20:30:00Z'
    }
  ];

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    setLoading(true);
    try {
      setTimeout(() => {
        setOrders(mockOrders);
        setLoading(false);
      }, 1000);
    } catch (error) {
      message.error('Ошибка при загрузке заказов');
      setLoading(false);
    }
  };

  const handleSearch = (value: string) => {
    setSearchText(value);
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.orderNumber.toLowerCase().includes(searchText.toLowerCase()) ||
                         order.clientName.toLowerCase().includes(searchText.toLowerCase()) ||
                         order.cargo.description.toLowerCase().includes(searchText.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    const matchesServiceType = serviceTypeFilter === 'all' || order.serviceType === serviceTypeFilter;
    
    return matchesSearch && matchesStatus && matchesServiceType;
  });

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      setOrders(prev => prev.map(order => 
        order.id === orderId ? { ...order, status: newStatus as any, updatedAt: new Date().toISOString() } : order
      ));
      message.success('Статус заказа обновлен');
    } catch (error) {
      message.error('Ошибка при обновлении статуса');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'default';
      case 'pending': return 'processing';
      case 'confirmed': return 'blue';
      case 'in_progress': return 'orange';
      case 'shipped': return 'purple';
      case 'delivered': return 'success';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'draft': return 'Черновик';
      case 'pending': return 'Ожидает';
      case 'confirmed': return 'Подтвержден';
      case 'in_progress': return 'В работе';
      case 'shipped': return 'Отправлен';
      case 'delivered': return 'Доставлен';
      case 'cancelled': return 'Отменен';
      default: return status;
    }
  };

  const getServiceTypeText = (serviceType: string) => {
    switch (serviceType) {
      case 'sea_freight': return 'Морские перевозки';
      case 'air_freight': return 'Авиаперевозки';
      case 'land_freight': return 'Автоперевозки';
      case 'customs': return 'Таможня';
      case 'warehouse': return 'Склад';
      default: return serviceType;
    }
  };

  const getServiceTypeIcon = (serviceType: string) => {
    switch (serviceType) {
      case 'sea_freight': return '🚢';
      case 'air_freight': return '✈️';
      case 'land_freight': return '🚛';
      case 'customs': return '📋';
      case 'warehouse': return '🏭';
      default: return '📦';
    }
  };

  const formatCurrency = (amount: number, currency: string) => {
    const symbols = { USD: '$', EUR: '€', RUB: '₽' };
    return `${symbols[currency as keyof typeof symbols] || currency} ${amount.toLocaleString()}`;
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

  const getOrderProgress = (status: string) => {
    const statuses = ['draft', 'pending', 'confirmed', 'in_progress', 'shipped', 'delivered'];
    return statuses.indexOf(status);
  };

  const columns = [
    {
      title: 'Заказ',
      key: 'order',
      width: 200,
      render: (record: Order) => (
        <div>
          <div style={{ fontWeight: 500, color: '#fff', marginBottom: 4 }}>
            {record.orderNumber}
          </div>
          <div style={{ fontSize: 12, color: '#8c8c8c', display: 'flex', alignItems: 'center', gap: 4 }}>
            <span>{getServiceTypeIcon(record.serviceType)}</span>
            <span>{getServiceTypeText(record.serviceType)}</span>
          </div>
          <div style={{ fontSize: 12, color: '#8c8c8c' }}>
            {formatDate(record.createdAt)}
          </div>
        </div>
      ),
    },
    {
      title: 'Клиент',
      key: 'client',
      render: (record: Order) => (
        <div>
          <div style={{ fontWeight: 500, color: '#fff' }}>
            {record.clientName}
          </div>
          <div style={{ fontSize: 12, color: '#8c8c8c' }}>
            {record.clientEmail}
          </div>
          <div style={{ fontSize: 12, color: '#1890ff' }}>
            Агент: {record.agentName}
          </div>
        </div>
      ),
    },
    {
      title: 'Маршрут',
      key: 'route',
      render: (record: Order) => (
        <div>
          <div style={{ fontSize: 12, color: '#fff' }}>
            {record.route.origin}
          </div>
          <div style={{ color: '#8c8c8c', margin: '4px 0' }}>↓</div>
          <div style={{ fontSize: 12, color: '#fff' }}>
            {record.route.destination}
          </div>
        </div>
      ),
    },
    {
      title: 'Груз',
      key: 'cargo',
      render: (record: Order) => (
        <div>
          <div style={{ fontSize: 12, color: '#fff', marginBottom: 2 }}>
            {record.cargo.description}
          </div>
          <div style={{ fontSize: 11, color: '#8c8c8c' }}>
            Вес: {record.cargo.weight} кг
          </div>
          <div style={{ fontSize: 11, color: '#8c8c8c' }}>
            Объем: {record.cargo.volume} м³
          </div>
          <div style={{ fontSize: 11, color: '#52c41a' }}>
            {formatCurrency(record.cargo.value, record.cargo.currency)}
          </div>
        </div>
      ),
    },
    {
      title: 'Статус',
      dataIndex: 'status',
      key: 'status',
      render: (status: string, record: Order) => (
        <div>
          <Tag color={getStatusColor(status)}>
            {getStatusText(status)}
          </Tag>
          <div style={{ marginTop: 4, fontSize: 11, color: '#8c8c8c' }}>
            Обновлен: {formatDate(record.updatedAt)}
          </div>
        </div>
      ),
    },
    {
      title: 'Стоимость',
      key: 'pricing',
      render: (record: Order) => (
        <div>
          <div style={{ color: '#52c41a', fontWeight: 500, fontSize: 14 }}>
            {formatCurrency(record.pricing.totalPrice, record.pricing.currency)}
          </div>
          {record.pricing.discount > 0 && (
            <div style={{ fontSize: 11, color: '#faad14' }}>
              Скидка: {formatCurrency(record.pricing.discount, record.pricing.currency)}
            </div>
          )}
        </div>
      ),
    },
    {
      title: 'Действия',
      key: 'actions',
      width: 120,
      render: (record: Order) => (
        <Space direction="vertical" size="small">
          <Button
            icon={<EyeOutlined />}
            size="small"
            onClick={() => {
              setSelectedOrder(record);
              setIsDetailModalVisible(true);
            }}
            block
          >
            Просмотр
          </Button>
          {record.status !== 'delivered' && record.status !== 'cancelled' && (
            <Select
              size="small"
              value={record.status}
              onChange={(value) => handleStatusChange(record.id, value)}
              style={{ width: '100%' }}
            >
              <Option value="pending">Ожидает</Option>
              <Option value="confirmed">Подтвержден</Option>
              <Option value="in_progress">В работе</Option>
              <Option value="shipped">Отправлен</Option>
              <Option value="delivered">Доставлен</Option>
              <Option value="cancelled">Отменен</Option>
            </Select>
          )}
        </Space>
      ),
    },
  ];

  // Статистика
  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    inProgress: orders.filter(o => o.status === 'in_progress').length,
    delivered: orders.filter(o => o.status === 'delivered').length,
    totalRevenue: orders.reduce((sum, o) => sum + o.pricing.totalPrice, 0)
  };

  return (
    <div>
      <div className="page-header">
        <Title level={2} style={{ margin: 0, color: '#fff' }}>
          Управление заказами
        </Title>
        <Text style={{ color: '#8c8c8c' }}>
          Отслеживание и управление всеми заказами системы
        </Text>
      </div>

      {/* Статистика */}
      <Row gutter={[24, 24]} style={{ marginBottom: '32px' }}>
        <Col xs={24} sm={12} lg={6}>
          <Card className="stat-card">
            <Statistic
              title="Всего заказов"
              value={stats.total}
              prefix={<ShoppingCartOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="stat-card">
            <Statistic
              title="Ожидают"
              value={stats.pending}
              prefix={<ClockCircleOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="stat-card">
            <Statistic
              title="В работе"
              value={stats.inProgress}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="stat-card">
            <Statistic
              title="Доставлено"
              value={stats.delivered}
              prefix={<CheckOutlined />}
            />
          </Card>
        </Col>
      </Row>

      {/* Фильтры и поиск */}
      <Card className="content-card">
        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col flex="auto">
            <Input
              placeholder="Поиск заказов..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </Col>
          <Col>
            <Select
              value={statusFilter}
              onChange={setStatusFilter}
              style={{ width: 150 }}
            >
              <Option value="all">Все статусы</Option>
              <Option value="pending">Ожидает</Option>
              <Option value="confirmed">Подтвержден</Option>
              <Option value="in_progress">В работе</Option>
              <Option value="shipped">Отправлен</Option>
              <Option value="delivered">Доставлен</Option>
              <Option value="cancelled">Отменен</Option>
            </Select>
          </Col>
          <Col>
            <Select
              value={serviceTypeFilter}
              onChange={setServiceTypeFilter}
              style={{ width: 180 }}
            >
              <Option value="all">Все услуги</Option>
              <Option value="sea_freight">Морские перевозки</Option>
              <Option value="air_freight">Авиаперевозки</Option>
              <Option value="land_freight">Автоперевозки</Option>
              <Option value="customs">Таможня</Option>
              <Option value="warehouse">Склад</Option>
            </Select>
          </Col>
          <Col>
            <Button icon={<ExportOutlined />}>
              Экспорт
            </Button>
          </Col>
        </Row>

        <Table
          columns={columns}
          dataSource={filteredOrders}
          loading={loading}
          rowKey="id"
          scroll={{ x: 1200 }}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => 
              `${range[0]}-${range[1]} из ${total} заказов`,
          }}
        />
      </Card>

      {/* Модальное окно детального просмотра */}
      {selectedOrder && (
        <Modal
          title={`Заказ ${selectedOrder.orderNumber}`}
          open={isDetailModalVisible}
          onCancel={() => {
            setIsDetailModalVisible(false);
            setSelectedOrder(null);
          }}
          footer={null}
          width={1000}
        >
          <Tabs defaultActiveKey="details">
            <TabPane tab="Детали заказа" key="details">
              <Row gutter={24}>
                <Col span={12}>
                  <Descriptions title="Основная информация" bordered size="small">
                    <Descriptions.Item label="Номер заказа" span={3}>
                      {selectedOrder.orderNumber}
                    </Descriptions.Item>
                    <Descriptions.Item label="Клиент" span={3}>
                      {selectedOrder.clientName}
                    </Descriptions.Item>
                    <Descriptions.Item label="Агент" span={3}>
                      {selectedOrder.agentName}
                    </Descriptions.Item>
                    <Descriptions.Item label="Тип услуги" span={3}>
                      {getServiceTypeIcon(selectedOrder.serviceType)} {getServiceTypeText(selectedOrder.serviceType)}
                    </Descriptions.Item>
                    <Descriptions.Item label="Статус" span={3}>
                      <Tag color={getStatusColor(selectedOrder.status)}>
                        {getStatusText(selectedOrder.status)}
                      </Tag>
                    </Descriptions.Item>
                  </Descriptions>
                </Col>
                <Col span={12}>
                  <Descriptions title="Финансовая информация" bordered size="small">
                    <Descriptions.Item label="Базовая стоимость" span={3}>
                      {formatCurrency(selectedOrder.pricing.basePrice, selectedOrder.pricing.currency)}
                    </Descriptions.Item>
                    <Descriptions.Item label="Дополнительные сборы" span={3}>
                      {formatCurrency(selectedOrder.pricing.additionalFees, selectedOrder.pricing.currency)}
                    </Descriptions.Item>
                    <Descriptions.Item label="Скидка" span={3}>
                      {formatCurrency(selectedOrder.pricing.discount, selectedOrder.pricing.currency)}
                    </Descriptions.Item>
                    <Descriptions.Item label="Итого" span={3}>
                      <Text strong style={{ color: '#52c41a', fontSize: 16 }}>
                        {formatCurrency(selectedOrder.pricing.totalPrice, selectedOrder.pricing.currency)}
                      </Text>
                    </Descriptions.Item>
                  </Descriptions>
                </Col>
              </Row>

              <Row gutter={24} style={{ marginTop: 24 }}>
                <Col span={12}>
                  <Descriptions title="Информация о грузе" bordered size="small">
                    <Descriptions.Item label="Описание" span={3}>
                      {selectedOrder.cargo.description}
                    </Descriptions.Item>
                    <Descriptions.Item label="Вес">
                      {selectedOrder.cargo.weight} кг
                    </Descriptions.Item>
                    <Descriptions.Item label="Объем">
                      {selectedOrder.cargo.volume} м³
                    </Descriptions.Item>
                    <Descriptions.Item label="Стоимость груза" span={3}>
                      {formatCurrency(selectedOrder.cargo.value, selectedOrder.cargo.currency)}
                    </Descriptions.Item>
                  </Descriptions>
                </Col>
                <Col span={12}>
                  <Descriptions title="Маршрут доставки" bordered size="small">
                    <Descriptions.Item label="Откуда" span={3}>
                      {selectedOrder.route.origin}
                    </Descriptions.Item>
                    <Descriptions.Item label="Куда" span={3}>
                      {selectedOrder.route.destination}
                    </Descriptions.Item>
                    {selectedOrder.route.portOfLoading && (
                      <Descriptions.Item label="Порт погрузки" span={3}>
                        {selectedOrder.route.portOfLoading}
                      </Descriptions.Item>
                    )}
                    {selectedOrder.route.portOfDischarge && (
                      <Descriptions.Item label="Порт выгрузки" span={3}>
                        {selectedOrder.route.portOfDischarge}
                      </Descriptions.Item>
                    )}
                  </Descriptions>
                </Col>
              </Row>
            </TabPane>

            <TabPane tab="Временная шкала" key="timeline">
              <Timeline>
                <Timeline.Item color="green">
                  <p><strong>Заказ создан</strong></p>
                  <p>{formatDate(selectedOrder.createdAt)}</p>
                </Timeline.Item>
                
                {selectedOrder.timeline.estimatedDeparture && (
                  <Timeline.Item color={selectedOrder.timeline.actualDeparture ? "green" : "blue"}>
                    <p><strong>Планируемая отправка</strong></p>
                    <p>{formatDate(selectedOrder.timeline.estimatedDeparture)}</p>
                    {selectedOrder.timeline.actualDeparture && (
                      <p><Text type="success">Фактическая: {formatDate(selectedOrder.timeline.actualDeparture)}</Text></p>
                    )}
                  </Timeline.Item>
                )}

                <Timeline.Item color={selectedOrder.timeline.actualArrival ? "green" : "blue"}>
                  <p><strong>Планируемое прибытие</strong></p>
                  <p>{formatDate(selectedOrder.timeline.estimatedArrival)}</p>
                  {selectedOrder.timeline.actualArrival && (
                    <p><Text type="success">Фактическое: {formatDate(selectedOrder.timeline.actualArrival)}</Text></p>
                  )}
                </Timeline.Item>

                <Timeline.Item>
                  <p><strong>Последнее обновление</strong></p>
                  <p>{formatDate(selectedOrder.updatedAt)}</p>
                </Timeline.Item>
              </Timeline>
            </TabPane>

            <TabPane tab="Документы" key="documents">
              <div style={{ marginBottom: 16 }}>
                <Title level={4}>Документы по заказу</Title>
              </div>
              <Table
                size="small"
                dataSource={selectedOrder.documents}
                pagination={false}
                columns={[
                  {
                    title: 'Документ',
                    dataIndex: 'name',
                    key: 'name',
                    render: (name: string, record: any) => (
                      <div>
                        <FileTextOutlined style={{ marginRight: 8 }} />
                        {name}
                      </div>
                    ),
                  },
                  {
                    title: 'Тип',
                    dataIndex: 'type',
                    key: 'type',
                  },
                  {
                    title: 'Статус',
                    dataIndex: 'status',
                    key: 'status',
                    render: (status: string) => (
                      <Tag color={status === 'approved' ? 'success' : status === 'rejected' ? 'error' : 'processing'}>
                        {status === 'approved' ? 'Одобрен' : status === 'rejected' ? 'Отклонен' : 'На рассмотрении'}
                      </Tag>
                    ),
                  },
                  {
                    title: 'Загружен',
                    dataIndex: 'uploadedAt',
                    key: 'uploadedAt',
                    render: (date: string) => formatDate(date),
                  },
                ]}
              />
            </TabPane>
          </Tabs>
        </Modal>
      )}
    </div>
  );
};

export default OrdersPage