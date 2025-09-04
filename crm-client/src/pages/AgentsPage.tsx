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
  Statistic,
  Progress,
  Avatar,
  Tooltip
} from 'antd';
import {
  SearchOutlined,
  UserAddOutlined,
  EditOutlined,
  DeleteOutlined,
  CheckOutlined,
  CloseOutlined,
  DollarOutlined,
  TeamOutlined,
  PercentageOutlined,
  PhoneOutlined,
  MailOutlined
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
  thisMonthRevenue: number;
  rating: number;
  experience: string;
  languages: string[];
  avatar?: string;
  lastLogin: string;
  createdAt: string;
}

const AgentsPage: React.FC = () => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingAgent, setEditingAgent] = useState<Agent | null>(null);
  const [form] = Form.useForm();

  // Mock данные агентов
  const mockAgents: Agent[] = [
    {
      id: '1',
      email: 'anna.petrova@bearplus.com',
      firstName: 'Анна',
      lastName: 'Петрова',
      phone: '+7 (999) 123-45-67',
      department: 'sales',
      position: 'Старший менеджер по продажам',
      specialization: ['Морские перевозки', 'Таможенное оформление'],
      isActive: true,
      commissionRate: 3.5,
      totalClients: 45,
      totalOrders: 189,
      totalRevenue: 2450000,
      thisMonthRevenue: 185000,
      rating: 4.8,
      experience: '5 лет',
      languages: ['Русский', 'Английский', 'Китайский'],
      avatar: '/avatars/anna-petrova.jpg',
      lastLogin: '2024-01-16T15:30:00Z',
      createdAt: '2019-03-15T09:00:00Z'
    },
    {
      id: '2',
      email: 'mikhail.sidorov@bearplus.com',
      firstName: 'Михаил',
      lastName: 'Сидоров',
      phone: '+7 (999) 234-56-78',
      department: 'logistics',
      position: 'Специалист по логистике',
      specialization: ['Авиаперевозки', 'Экспресс доставка'],
      isActive: true,
      commissionRate: 4.0,
      totalClients: 32,
      totalOrders: 156,
      totalRevenue: 1980000,
      thisMonthRevenue: 142000,
      rating: 4.6,
      experience: '3 года',
      languages: ['Русский', 'Английский'],
      lastLogin: '2024-01-16T11:45:00Z',
      createdAt: '2021-07-20T10:00:00Z'
    },
    {
      id: '3',
      email: 'elena.kozlova@bearplus.com',
      firstName: 'Елена',
      lastName: 'Козлова',
      phone: '+7 (999) 345-67-89',
      department: 'customs',
      position: 'Эксперт по ВЭД',
      specialization: ['Таможенное оформление', 'Сертификация'],
      isActive: true,
      commissionRate: 2.5,
      totalClients: 28,
      totalOrders: 98,
      totalRevenue: 890000,
      thisMonthRevenue: 76000,
      rating: 4.9,
      experience: '7 лет',
      languages: ['Русский', 'Английский', 'Немецкий'],
      lastLogin: '2024-01-16T14:20:00Z',
      createdAt: '2018-11-10T08:30:00Z'
    },
    {
      id: '4',
      email: 'dmitry.volkov@bearplus.com',
      firstName: 'Дмитрий',
      lastName: 'Волков',
      phone: '+7 (999) 456-78-90',
      department: 'sales',
      position: 'Менеджер по работе с клиентами',
      specialization: ['Автоперевозки', 'Складские услуги'],
      isActive: false,
      commissionRate: 3.0,
      totalClients: 18,
      totalOrders: 67,
      totalRevenue: 450000,
      thisMonthRevenue: 0,
      rating: 4.2,
      experience: '2 года',
      languages: ['Русский'],
      lastLogin: '2024-01-10T16:00:00Z',
      createdAt: '2022-04-12T12:00:00Z'
    }
  ];

  const departments = [
    { value: 'sales', label: 'Продажи', color: 'blue' },
    { value: 'logistics', label: 'Логистика', color: 'green' },
    { value: 'customs', label: 'ВЭД', color: 'orange' },
    { value: 'support', label: 'Поддержка', color: 'purple' }
  ];

  useEffect(() => {
    loadAgents();
  }, []);

  const loadAgents = async () => {
    setLoading(true);
    try {
      setTimeout(() => {
        setAgents(mockAgents);
        setLoading(false);
      }, 1000);
    } catch (error) {
      message.error('Ошибка при загрузке агентов');
      setLoading(false);
    }
  };

  const handleSearch = (value: string) => {
    setSearchText(value);
  };

  const filteredAgents = agents.filter(agent => {
    const matchesSearch = agent.firstName.toLowerCase().includes(searchText.toLowerCase()) ||
                         agent.lastName.toLowerCase().includes(searchText.toLowerCase()) ||
                         agent.email.toLowerCase().includes(searchText.toLowerCase()) ||
                         agent.position.toLowerCase().includes(searchText.toLowerCase());
    
    const matchesDepartment = departmentFilter === 'all' || agent.department === departmentFilter;
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'active' && agent.isActive) ||
                         (statusFilter === 'inactive' && !agent.isActive);
    
    return matchesSearch && matchesDepartment && matchesStatus;
  });

  const handleEdit = (agent: Agent) => {
    setEditingAgent(agent);
    form.setFieldsValue({
      ...agent,
      specialization: agent.specialization,
      languages: agent.languages
    });
    setIsModalVisible(true);
  };

  const handleDelete = async (agentId: string) => {
    try {
      setAgents(prev => prev.filter(agent => agent.id !== agentId));
      message.success('Агент удален');
    } catch (error) {
      message.error('Ошибка при удалении агента');
    }
  };

  const handleActivate = async (agentId: string, isActive: boolean) => {
    try {
      setAgents(prev => prev.map(agent => 
        agent.id === agentId ? { ...agent, isActive } : agent
      ));
      message.success(`Агент ${isActive ? 'активирован' : 'деактивирован'}`);
    } catch (error) {
      message.error('Ошибка при изменении статуса агента');
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      if (editingAgent) {
        setAgents(prev => prev.map(agent => 
          agent.id === editingAgent.id ? { ...agent, ...values } : agent
        ));
        message.success('Агент обновлен');
      } else {
        const newAgent: Agent = {
          id: Date.now().toString(),
          ...values,
          isActive: true,
          totalClients: 0,
          totalOrders: 0,
          totalRevenue: 0,
          thisMonthRevenue: 0,
          rating: 0,
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString()
        };
        setAgents(prev => [...prev, newAgent]);
        message.success('Агент создан');
      }
      
      setIsModalVisible(false);
      setEditingAgent(null);
      form.resetFields();
    } catch (error) {
      message.error('Ошибка при сохранении агента');
    }
  };

  const getDepartmentInfo = (dept: string) => {
    return departments.find(d => d.value === dept) || { label: dept, color: 'default' };
  };

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString() + ' ₽';
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return '#52c41a';
    if (rating >= 4.0) return '#faad14';
    if (rating >= 3.5) return '#fa8c16';
    return '#ff4d4f';
  };

  const columns = [
    {
      title: 'Агент',
      key: 'agent',
      width: 300,
      render: (record: Agent) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Avatar 
            size={48} 
            src={record.avatar}
            style={{ backgroundColor: '#52c41a' }}
          >
            {record.firstName[0]}{record.lastName[0]}
          </Avatar>
          <div>
            <div style={{ fontWeight: 500, color: '#fff', fontSize: 14 }}>
              {record.firstName} {record.lastName}
            </div>
            <div style={{ fontSize: 12, color: '#8c8c8c', marginBottom: 2 }}>
              {record.position}
            </div>
            <div style={{ fontSize: 12, color: '#8c8c8c' }}>
              <MailOutlined style={{ marginRight: 4 }} />
              {record.email}
            </div>
            <div style={{ fontSize: 12, color: '#8c8c8c' }}>
              <PhoneOutlined style={{ marginRight: 4 }} />
              {record.phone}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Отдел',
      dataIndex: 'department',
      key: 'department',
      render: (department: string) => {
        const deptInfo = getDepartmentInfo(department);
        return <Tag color={deptInfo.color}>{deptInfo.label}</Tag>;
      },
    },
    {
      title: 'Статус',
      key: 'status',
      render: (record: Agent) => (
        <div>
          <Tag color={record.isActive ? 'success' : 'error'}>
            {record.isActive ? 'Активен' : 'Неактивен'}
          </Tag>
          <div style={{ marginTop: 4, fontSize: 12, color: '#8c8c8c' }}>
            Рейтинг: <span style={{ color: getRatingColor(record.rating) }}>★ {record.rating}</span>
          </div>
        </div>
      ),
    },
    {
      title: 'Клиенты',
      dataIndex: 'totalClients',
      key: 'totalClients',
      render: (clients: number) => (
        <div style={{ textAlign: 'center' }}>
          <div style={{ color: '#1890ff', fontWeight: 500, fontSize: 16 }}>{clients}</div>
          <div style={{ fontSize: 12, color: '#8c8c8c' }}>клиентов</div>
        </div>
      ),
    },
    {
      title: 'Заказы',
      dataIndex: 'totalOrders',
      key: 'totalOrders',
      render: (orders: number) => (
        <div style={{ textAlign: 'center' }}>
          <div style={{ color: '#722ed1', fontWeight: 500, fontSize: 16 }}>{orders}</div>
          <div style={{ fontSize: 12, color: '#8c8c8c' }}>заказов</div>
        </div>
      ),
    },
    {
      title: 'Выручка',
      key: 'revenue',
      render: (record: Agent) => (
        <div>
          <div style={{ color: '#52c41a', fontWeight: 500 }}>
            {formatCurrency(record.totalRevenue)}
          </div>
          <div style={{ fontSize: 12, color: '#8c8c8c' }}>
            Этот месяц: {formatCurrency(record.thisMonthRevenue)}
          </div>
          <div style={{ fontSize: 12, color: '#faad14' }}>
            Комиссия: {record.commissionRate}%
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
          {specialization.map((spec, index) => (
            <Tag key={index} size="small" style={{ marginBottom: 2 }}>
              {spec}
            </Tag>
          ))}
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
            block
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
              type={record.isActive ? 'default' : 'primary'}
              block
            >
              {record.isActive ? 'Деактивировать' : 'Активировать'}
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // Статистика
  const stats = {
    total: agents.length,
    active: agents.filter(a => a.isActive).length,
    totalClients: agents.reduce((sum, a) => sum + a.totalClients, 0),
    totalRevenue: agents.reduce((sum, a) => sum + a.totalRevenue, 0),
    avgRating: agents.length > 0 ? agents.reduce((sum, a) => sum + a.rating, 0) / agents.length : 0
  };

  return (
    <div>
      <div className="page-header">
        <Title level={2} style={{ margin: 0, color: '#fff' }}>
          Управление агентами
        </Title>
        <Text style={{ color: '#8c8c8c' }}>
          Менеджеры и специалисты компании
        </Text>
      </div>

      {/* Статистика */}
      <Row gutter={16} className="stats-grid">
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Всего агентов"
              value={stats.total}
              prefix={<TeamOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Активных"
              value={stats.active}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Всего клиентов"
              value={stats.totalClients}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Общая выручка"
              value={stats.totalRevenue}
              prefix={<DollarOutlined />}
              suffix="₽"
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Фильтры и поиск */}
      <Card className="content-card">
        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col flex="auto">
            <Input
              placeholder="Поиск агентов..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </Col>
          <Col>
            <Select
              value={departmentFilter}
              onChange={setDepartmentFilter}
              style={{ width: 150 }}
            >
              <Option value="all">Все отделы</Option>
              {departments.map(dept => (
                <Option key={dept.value} value={dept.value}>{dept.label}</Option>
              ))}
            </Select>
          </Col>
          <Col>
            <Select
              value={statusFilter}
              onChange={setStatusFilter}
              style={{ width: 120 }}
            >
              <Option value="all">Все</Option>
              <Option value="active">Активные</Option>
              <Option value="inactive">Неактивные</Option>
            </Select>
          </Col>
          <Col>
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
          </Col>
        </Row>

        <Table
          columns={columns}
          dataSource={filteredAgents}
          loading={loading}
          rowKey="id"
          scroll={{ x: 1200 }}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => 
              `${range[0]}-${range[1]} из ${total} агентов`,
          }}
        />
      </Card>

      {/* Модальное окно создания/редактирования */}
      <Modal
        title={editingAgent ? 'Редактировать агента' : 'Добавить агента'}
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setEditingAgent(null);
          form.resetFields();
        }}
        footer={null}
        width={800}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="firstName"
                label="Имя"
                rules={[{ required: true, message: 'Введите имя' }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="lastName"
                label="Фамилия"
                rules={[{ required: true, message: 'Введите фамилию' }]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { required: true, message: 'Введите email' },
                  { type: 'email', message: 'Некорректный email' }
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="phone"
                label="Телефон"
                rules={[{ required: true, message: 'Введите телефон' }]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="department"
                label="Отдел"
                rules={[{ required: true, message: 'Выберите отдел' }]}
              >
                <Select>
                  {departments.map(dept => (
                    <Option key={dept.value} value={dept.value}>{dept.label}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="commissionRate"
                label="Ставка комиссии (%)"
                rules={[{ required: true, message: 'Введите ставку комиссии' }]}
              >
                <Input type="number" min={0} max={100} step={0.1} />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="position"
            label="Должность"
            rules={[{ required: true, message: 'Введите должность' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="experience"
            label="Опыт работы"
          >
            <Input placeholder="например: 3 года" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="specialization"
                label="Специализация"
              >
                <Select mode="tags" placeholder="Выберите или введите специализации">
                  <Option value="Морские перевозки">Морские перевозки</Option>
                  <Option value="Авиаперевозки">Авиаперевозки</Option>
                  <Option value="Автоперевозки">Автоперевозки</Option>
                  <Option value="Таможенное оформление">Таможенное оформление</Option>
                  <Option value="Складские услуги">Складские услуги</Option>
                  <Option value="Страхование">Страхование</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="languages"
                label="Языки"
              >
                <Select mode="tags" placeholder="Выберите или введите языки">
                  <Option value="Русский">Русский</Option>
                  <Option value="Английский">Английский</Option>
                  <Option value="Китайский">Китайский</Option>
                  <Option value="Немецкий">Немецкий</Option>
                  <Option value="Французский">Французский</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {editingAgent ? 'Обновить' : 'Создать'}
              </Button>
              <Button onClick={() => {
                setIsModalVisible(false);
                setEditingAgent(null);
                form.resetFields();
              }}>
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