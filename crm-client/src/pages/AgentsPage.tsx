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
  Popconfirm,
  Typography,
  Row,
  Col,
  Avatar,
  Progress
} from 'antd';
import {
  SearchOutlined,
  UserAddOutlined,
  EditOutlined,
  CheckOutlined,
  CloseOutlined,
  TeamOutlined,
  MailOutlined,
  PhoneOutlined,
  TrophyOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;
const { Option } = Select;

interface Agent {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  department: string;
  position: string;
  specialization: string[];
  isActive: boolean;
  commissionRate: number;
  totalClients: number;
  totalOrders: number;
  totalRevenue: number;
  rating: number;
  experience: string;
  lastLogin: string;
  createdAt: string;
}

const AgentsPage: React.FC = () => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingAgent, setEditingAgent] = useState<Agent | null>(null);
  const [form] = Form.useForm();

  const mockAgents: Agent[] = [
    {
      id: '1',
      email: 'anna.petrova@bearplus.com',
      firstName: 'Анна',
      lastName: 'Петрова',
      phone: '+7 (999) 123-45-67',
      department: 'Продажи',
      position: 'Старший менеджер',
      specialization: ['Морские перевозки', 'Таможенное оформление'],
      isActive: true,
      commissionRate: 3.5,
      totalClients: 45,
      totalOrders: 189,
      totalRevenue: 2450000,
      rating: 4.8,
      experience: '5 лет',
      lastLogin: '2024-01-16T15:30:00Z',
      createdAt: '2019-03-15T09:00:00Z'
    },
    {
      id: '2',
      email: 'mikhail.sidorov@bearplus.com',
      firstName: 'Михаил',
      lastName: 'Сидоров',
      phone: '+7 (999) 234-56-78',
      department: 'Логистика',
      position: 'Специалист по логистике',
      specialization: ['Авиаперевозки', 'Экспресс доставка'],
      isActive: true,
      commissionRate: 4.0,
      totalClients: 32,
      totalOrders: 156,
      totalRevenue: 1980000,
      rating: 4.6,
      experience: '3 года',
      lastLogin: '2024-01-16T11:45:00Z',
      createdAt: '2021-07-20T10:00:00Z'
    },
    {
      id: '3',
      email: 'elena.kozlova@bearplus.com',
      firstName: 'Елена',
      lastName: 'Козлова',
      phone: '+7 (999) 345-67-89',
      department: 'ВЭД',
      position: 'Эксперт по ВЭД',
      specialization: ['Таможенное оформление', 'Сертификация'],
      isActive: false,
      commissionRate: 2.5,
      totalClients: 28,
      totalOrders: 98,
      totalRevenue: 890000,
      rating: 4.9,
      experience: '7 лет',
      lastLogin: '2024-01-10T14:20:00Z',
      createdAt: '2018-11-10T08:30:00Z'
    }
  ];

  useEffect(() => {
    loadAgents();
  }, []);

  const loadAgents = async () => {
    setLoading(true);
    setTimeout(() => {
      setAgents(mockAgents);
      setLoading(false);
    }, 800);
  };

  const filteredAgents = agents.filter(agent => {
    const matchesSearch = agent.firstName.toLowerCase().includes(searchText.toLowerCase()) ||
                         agent.lastName.toLowerCase().includes(searchText.toLowerCase()) ||
                         agent.email.toLowerCase().includes(searchText.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'active' && agent.isActive) ||
                         (statusFilter === 'inactive' && !agent.isActive);
    
    return matchesSearch && matchesStatus;
  });

  const handleEdit = (agent: Agent) => {
    setEditingAgent(agent);
    form.setFieldsValue(agent);
    setIsModalVisible(true);
  };

  const handleActivate = async (agentId: string, isActive: boolean) => {
    setAgents(prev => prev.map(agent => 
      agent.id === agentId ? { ...agent, isActive } : agent
    ));
    message.success(`Агент ${isActive ? 'активирован' : 'деактивирован'}`);
  };

  const formatCurrency = (amount: number) => {
    return (amount / 1000000).toFixed(1) + 'M ₽';
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return '#52c41a';
    if (rating >= 4.0) return '#faad14';
    return '#ff7875';
  };

  const columns = [
    {
      title: 'Агент',
      key: 'agent',
      width: 280,
      render: (record: Agent) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Avatar 
            size={48} 
            style={{ 
              background: 'linear-gradient(135deg, #00ff88, #1de9b6)',
              color: '#000',
              fontWeight: '600'
            }}
          >
            {record.firstName[0]}{record.lastName[0]}
          </Avatar>
          <div>
            <div style={{ 
              fontWeight: '600', 
              color: '#fff', 
              fontSize: '15px',
              marginBottom: '4px'
            }}>
              {record.firstName} {record.lastName}
            </div>
            <div style={{ 
              fontSize: '12px', 
              color: '#8c8c8c',
              marginBottom: '2px'
            }}>
              {record.position}
            </div>
            <div style={{ 
              fontSize: '11px', 
              color: '#666',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              <MailOutlined />
              {record.email}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Статус & Рейтинг',
      key: 'status',
      width: 160,
      render: (record: Agent) => (
        <div style={{ textAlign: 'center' }}>
          <Tag 
            color={record.isActive ? 'success' : 'error'}
            style={{ 
              borderRadius: '20px',
              fontWeight: '600',
              fontSize: '11px',
              textTransform: 'uppercase',
              marginBottom: '8px'
            }}
          >
            {record.isActive ? 'Активен' : 'Неактивен'}
          </Tag>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            gap: '4px'
          }}>
            <TrophyOutlined style={{ color: getRatingColor(record.rating), fontSize: '14px' }} />
            <span style={{ 
              color: getRatingColor(record.rating), 
              fontWeight: '600',
              fontSize: '14px'
            }}>
              {record.rating}
            </span>
          </div>
        </div>
      ),
    },
    {
      title: 'Клиенты',
      dataIndex: 'totalClients',
      key: 'totalClients',
      width: 100,
      render: (clients: number) => (
        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            color: '#1890ff', 
            fontWeight: '700', 
            fontSize: '18px'
          }}>
            {clients}
          </div>
        </div>
      ),
    },
    {
      title: 'Заказы',
      dataIndex: 'totalOrders',
      key: 'totalOrders',
      width: 100,
      render: (orders: number) => (
        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            color: '#722ed1', 
            fontWeight: '700', 
            fontSize: '18px'
          }}>
            {orders}
          </div>
        </div>
      ),
    },
    {
      title: 'Выручка',
      key: 'revenue',
      width: 120,
      render: (record: Agent) => (
        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            color: '#52c41a', 
            fontWeight: '700',
            fontSize: '16px'
          }}>
            {formatCurrency(record.totalRevenue)}
          </div>
          <div style={{ 
            fontSize: '11px', 
            color: '#faad14',
            marginTop: '2px'
          }}>
            {record.commissionRate}% комиссия
          </div>
        </div>
      ),
    },
    {
      title: 'Специализация',
      dataIndex: 'specialization',
      key: 'specialization',
      render: (specialization: string[]) => (
        <div>
          {specialization.slice(0, 2).map((spec, index) => (
            <Tag 
              key={index} 
              style={{ 
                marginBottom: '4px',
                fontSize: '11px',
                borderRadius: '6px',
                background: 'rgba(0, 255, 136, 0.1)',
                border: '1px solid rgba(0, 255, 136, 0.3)',
                color: '#00ff88'
              }}
            >
              {spec}
            </Tag>
          ))}
          {specialization.length > 2 && (
            <div style={{ fontSize: '10px', color: '#666', marginTop: '2px' }}>
              +{specialization.length - 2} еще
            </div>
          )}
        </div>
      ),
    },
    {
      title: 'Действия',
      key: 'actions',
      width: 120,
      render: (record: Agent) => (
        <Space direction="vertical" size="small">
          <Button
            icon={<EditOutlined />}
            size="small"
            onClick={() => handleEdit(record)}
            style={{
              background: 'rgba(24, 144, 255, 0.1)',
              border: '1px solid rgba(24, 144, 255, 0.3)',
              color: '#1890ff'
            }}
          >
            Изменить
          </Button>
          <Popconfirm
            title={`${record.isActive ? 'Деактивировать' : 'Активировать'} агента?`}
            onConfirm={() => handleActivate(record.id, !record.isActive)}
          >
            <Button
              icon={record.isActive ? <CloseOutlined /> : <CheckOutlined />}
              size="small"
              style={{
                background: record.isActive 
                  ? 'rgba(245, 34, 45, 0.1)' 
                  : 'rgba(82, 196, 26, 0.1)',
                border: record.isActive 
                  ? '1px solid rgba(245, 34, 45, 0.3)' 
                  : '1px solid rgba(82, 196, 26, 0.3)',
                color: record.isActive ? '#ff4d4f' : '#52c41a'
              }}
            >
              {record.isActive ? 'Деактивировать' : 'Активировать'}
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const stats = {
    total: agents.length,
    active: agents.filter(a => a.isActive).length,
    totalRevenue: agents.reduce((sum, a) => sum + a.totalRevenue, 0)
  };

  return (
    <div className="fade-in">
      {/* Modern Header */}
      <div style={{ marginBottom: '32px' }}>
        <Title level={2} style={{ 
          margin: 0, 
          color: '#fff', 
          fontSize: '32px', 
          fontWeight: '700',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <TeamOutlined style={{ color: '#00ff88' }} />
          Управление агентами
        </Title>
        <Text style={{ 
          color: '#8c8c8c', 
          fontSize: '16px',
          display: 'block',
          marginTop: '8px'
        }}>
          Модерация и управление агентами платформы
        </Text>
      </div>

      {/* Quick Stats */}
      <Row gutter={[24, 24]} style={{ marginBottom: '32px' }}>
        <Col xs={24} sm={8}>
          <Card className="stat-card">
            <div className="stat-number">{stats.total}</div>
            <div className="stat-label">Всего агентов</div>
            <Progress 
              percent={100} 
              showInfo={false} 
              strokeColor="#00ff88"
              style={{ marginTop: '12px' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card className="stat-card">
            <div className="stat-number">{stats.active}</div>
            <div className="stat-label">Активных</div>
            <Progress 
              percent={Math.round((stats.active / stats.total) * 100)} 
              showInfo={false} 
              strokeColor="#1890ff"
              style={{ marginTop: '12px' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card className="stat-card">
            <div className="stat-number">{(stats.totalRevenue / 1000000).toFixed(1)}M</div>
            <div className="stat-label">Общая выручка</div>
            <Progress 
              percent={85} 
              showInfo={false} 
              strokeColor="#52c41a"
              style={{ marginTop: '12px' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Main Table Card */}
      <Card 
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <TeamOutlined style={{ color: '#00ff88' }} />
            <span>Список агентов</span>
          </div>
        }
        extra={
          <Button
            type="primary"
            icon={<UserAddOutlined />}
            onClick={() => {
              setEditingAgent(null);
              form.resetFields();
              setIsModalVisible(true);
            }}
          >
            Добавить агента
          </Button>
        }
      >
        {/* Filters */}
        <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
          <Col xs={24} sm={12} lg={8}>
            <Input
              placeholder="Поиск агентов..."
              prefix={<SearchOutlined style={{ color: '#8c8c8c' }} />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ height: '40px' }}
            />
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Select
              value={statusFilter}
              onChange={setStatusFilter}
              style={{ width: '100%', height: '40px' }}
              placeholder="Статус"
            >
              <Option value="all">Все статусы</Option>
              <Option value="active">Активные</Option>
              <Option value="inactive">Неактивные</Option>
            </Select>
          </Col>
        </Row>

        {/* Modern Table */}
        <Table
          columns={columns}
          dataSource={filteredAgents}
          loading={loading}
          rowKey="id"
          scroll={{ x: 1000 }}
          pagination={{
            pageSize: 8,
            showSizeChanger: false,
            showQuickJumper: true,
            showTotal: (total, range) => 
              `${range[0]}-${range[1]} из ${total} агентов`,
            style: { marginTop: '24px' }
          }}
          style={{
            background: 'transparent'
          }}
        />
      </Card>

      {/* Edit Modal */}
      <Modal
        title={
          <div style={{ color: '#fff', fontSize: '18px', fontWeight: '600' }}>
            {editingAgent ? 'Редактировать агента' : 'Добавить агента'}
          </div>
        }
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setEditingAgent(null);
          form.resetFields();
        }}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={(values) => {
            console.log('Form values:', values);
            setIsModalVisible(false);
            message.success('Агент сохранен');
          }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="firstName"
                label={<span style={{ color: '#fff' }}>Имя</span>}
                rules={[{ required: true, message: 'Введите имя' }]}
              >
                <Input style={{ height: '40px' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="lastName"
                label={<span style={{ color: '#fff' }}>Фамилия</span>}
                rules={[{ required: true, message: 'Введите фамилию' }]}
              >
                <Input style={{ height: '40px' }} />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="email"
            label={<span style={{ color: '#fff' }}>Email</span>}
            rules={[
              { required: true, message: 'Введите email' },
              { type: 'email', message: 'Некорректный email' }
            ]}
          >
            <Input style={{ height: '40px' }} />
          </Form.Item>

          <Form.Item
            name="phone"
            label={<span style={{ color: '#fff' }}>Телефон</span>}
            rules={[{ required: true, message: 'Введите телефон' }]}
          >
            <Input style={{ height: '40px' }} />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="position"
                label={<span style={{ color: '#fff' }}>Должность</span>}
                rules={[{ required: true, message: 'Введите должность' }]}
              >
                <Input style={{ height: '40px' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="commissionRate"
                label={<span style={{ color: '#fff' }}>Комиссия (%)</span>}
                rules={[{ required: true, message: 'Введите ставку' }]}
              >
                <Input type="number" min={0} max={100} step={0.1} style={{ height: '40px' }} />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item style={{ marginTop: '24px', textAlign: 'center' }}>
            <Space>
              <Button 
                type="primary" 
                htmlType="submit"
                style={{ minWidth: '120px' }}
              >
                {editingAgent ? 'Обновить' : 'Создать'}
              </Button>
              <Button 
                onClick={() => {
                  setIsModalVisible(false);
                  setEditingAgent(null);
                  form.resetFields();
                }}
                style={{ minWidth: '120px' }}
              >
                Отмена
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AgentsPage;