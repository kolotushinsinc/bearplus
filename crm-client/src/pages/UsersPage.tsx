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
  Statistic
} from 'antd';
import {
  SearchOutlined,
  UserAddOutlined,
  EditOutlined,
  DeleteOutlined,
  CheckOutlined,
  CloseOutlined
} from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from '../hooks/redux';

const { Title } = Typography;
const { Option } = Select;

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  userType: 'client' | 'agent' | 'admin';
  companyName?: string;
  phone?: string;
  isEmailVerified: boolean;
  isActive: boolean;
  totalOrders: number;
  totalRevenue: number;
  loyaltyDiscount: number;
  lastLogin?: string;
  createdAt: string;
}

const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'client' | 'agent'>('all');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [form] = Form.useForm();

  // Mock данные пользователей
  const mockUsers: User[] = [
    {
      id: '1',
      email: 'ivan@example.com',
      firstName: 'Иван',
      lastName: 'Петров',
      userType: 'client',
      companyName: 'ООО "Логистика Плюс"',
      phone: '+7 (999) 123-45-67',
      isEmailVerified: true,
      isActive: true,
      totalOrders: 12,
      totalRevenue: 145000,
      loyaltyDiscount: 5,
      lastLogin: '2024-01-16T10:30:00Z',
      createdAt: '2023-11-01T09:00:00Z'
    },
    {
      id: '2',
      email: 'anna@agent.com',
      firstName: 'Анна',
      lastName: 'Сидорова',
      userType: 'agent',
      companyName: 'BearPlus Logistics',
      phone: '+7 (999) 234-56-78',
      isEmailVerified: true,
      isActive: true,
      totalOrders: 45,
      totalRevenue: 890000,
      loyaltyDiscount: 0,
      lastLogin: '2024-01-16T14:15:00Z',
      createdAt: '2023-10-15T10:00:00Z'
    },
    {
      id: '3',
      email: 'mikhail@trade.com',
      firstName: 'Михаил',
      lastName: 'Козлов',
      userType: 'client',
      companyName: 'ТД "Импорт-Экспорт"',
      phone: '+7 (999) 345-67-89',
      isEmailVerified: false,
      isActive: false,
      totalOrders: 3,
      totalRevenue: 35000,
      loyaltyDiscount: 0,
      lastLogin: '2024-01-10T16:45:00Z',
      createdAt: '2024-01-05T11:00:00Z'
    }
  ];

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      // В реальном приложении здесь будет API запрос
      setTimeout(() => {
        setUsers(mockUsers);
        setLoading(false);
      }, 1000);
    } catch (error) {
      message.error('Ошибка при загрузке пользователей');
      setLoading(false);
    }
  };

  const handleSearch = (value: string) => {
    setSearchText(value);
  };

  const handleUserTypeFilter = (value: string) => {
    setFilterType(value as 'all' | 'client' | 'agent');
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.firstName.toLowerCase().includes(searchText.toLowerCase()) ||
                         user.lastName.toLowerCase().includes(searchText.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchText.toLowerCase()) ||
                         (user.companyName && user.companyName.toLowerCase().includes(searchText.toLowerCase()));
    
    const matchesType = filterType === 'all' || user.userType === filterType;
    
    return matchesSearch && matchesType;
  });

  const handleEdit = (user: User) => {
    setEditingUser(user);
    form.setFieldsValue(user);
    setIsModalVisible(true);
  };

  const handleDelete = async (userId: string) => {
    try {
      // В реальном приложении здесь будет API запрос
      setUsers(prev => prev.filter(user => user.id !== userId));
      message.success('Пользователь удален');
    } catch (error) {
      message.error('Ошибка при удалении пользователя');
    }
  };

  const handleActivate = async (userId: string, isActive: boolean) => {
    try {
      setUsers(prev => prev.map(user => 
        user.id === userId ? { ...user, isActive } : user
      ));
      message.success(`Пользователь ${isActive ? 'активирован' : 'деактивирован'}`);
    } catch (error) {
      message.error('Ошибка при изменении статуса пользователя');
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      if (editingUser) {
        // Обновление пользователя
        setUsers(prev => prev.map(user => 
          user.id === editingUser.id ? { ...user, ...values } : user
        ));
        message.success('Пользователь обновлен');
      } else {
        // Создание нового пользователя
        const newUser: User = {
          id: Date.now().toString(),
          ...values,
          isEmailVerified: false,
          isActive: true,
          totalOrders: 0,
          totalRevenue: 0,
          loyaltyDiscount: 0,
          createdAt: new Date().toISOString()
        };
        setUsers(prev => [...prev, newUser]);
        message.success('Пользователь создан');
      }
      
      setIsModalVisible(false);
      setEditingUser(null);
      form.resetFields();
    } catch (error) {
      message.error('Ошибка при сохранении пользователя');
    }
  };

  const getUserTypeColor = (userType: string) => {
    switch (userType) {
      case 'admin': return 'red';
      case 'agent': return 'blue';
      case 'client': return 'green';
      default: return 'default';
    }
  };

  const getUserTypeLabel = (userType: string) => {
    switch (userType) {
      case 'admin': return 'Администратор';
      case 'agent': return 'Агент';
      case 'client': return 'Клиент';
      default: return userType;
    }
  };

  const columns = [
    {
      title: 'Пользователь',
      key: 'user',
      render: (record: User) => (
        <div>
          <div style={{ fontWeight: 500, color: '#fff' }}>
            {record.firstName} {record.lastName}
          </div>
          <div style={{ fontSize: 12, color: '#8c8c8c' }}>
            {record.email}
          </div>
          {record.companyName && (
            <div style={{ fontSize: 12, color: '#8c8c8c' }}>
              {record.companyName}
            </div>
          )}
        </div>
      ),
    },
    {
      title: 'Тип',
      dataIndex: 'userType',
      key: 'userType',
      render: (userType: string) => (
        <Tag color={getUserTypeColor(userType)}>
          {getUserTypeLabel(userType)}
        </Tag>
      ),
    },
    {
      title: 'Статус',
      key: 'status',
      render: (record: User) => (
        <div>
          <Tag color={record.isActive ? 'success' : 'error'}>
            {record.isActive ? 'Активен' : 'Неактивен'}
          </Tag>
          {record.isEmailVerified && (
            <Tag color="blue" style={{ marginTop: 4 }}>
              Email подтвержден
            </Tag>
          )}
        </div>
      ),
    },
    {
      title: 'Заказы',
      dataIndex: 'totalOrders',
      key: 'totalOrders',
      render: (orders: number) => <span style={{ color: '#fff' }}>{orders}</span>,
    },
    {
      title: 'Оборот',
      dataIndex: 'totalRevenue',
      key: 'totalRevenue',
      render: (revenue: number) => (
        <span style={{ color: '#52c41a', fontWeight: 500 }}>
          {revenue.toLocaleString()} ₽
        </span>
      ),
    },
    {
      title: 'Скидка',
      dataIndex: 'loyaltyDiscount',
      key: 'loyaltyDiscount',
      render: (discount: number) => (
        <span style={{ color: '#faad14' }}>{discount}%</span>
      ),
    },
    {
      title: 'Действия',
      key: 'actions',
      render: (record: User) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            size="small"
            onClick={() => handleEdit(record)}
          />
          <Popconfirm
            title={`${record.isActive ? 'Деактивировать' : 'Активировать'} пользователя?`}
            onConfirm={() => handleActivate(record.id, !record.isActive)}
          >
            <Button
              icon={record.isActive ? <CloseOutlined /> : <CheckOutlined />}
              size="small"
              type={record.isActive ? 'default' : 'primary'}
            />
          </Popconfirm>
          <Popconfirm
            title="Удалить пользователя?"
            onConfirm={() => handleDelete(record.id)}
          >
            <Button
              icon={<DeleteOutlined />}
              size="small"
              danger
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // Статистика
  const stats = {
    total: users.length,
    clients: users.filter(u => u.userType === 'client').length,
    agents: users.filter(u => u.userType === 'agent').length,
    active: users.filter(u => u.isActive).length,
  };

  return (
    <div>
      <div className="page-header">
        <Title level={2} style={{ margin: 0, color: '#fff' }}>
          Управление пользователями
        </Title>
      </div>

      {/* Статистика */}
      <Row gutter={[24, 24]} style={{ marginBottom: '32px' }}>
        <Col xs={24} sm={12} lg={6}>
          <Card className="stat-card">
            <Statistic
              title="Всего пользователей"
              value={stats.total}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="stat-card">
            <Statistic
              title="Клиенты"
              value={stats.clients}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="stat-card">
            <Statistic
              title="Агенты"
              value={stats.agents}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="stat-card">
            <Statistic
              title="Активные"
              value={stats.active}
            />
          </Card>
        </Col>
      </Row>

      {/* Фильтры и поиск */}
      <Card className="content-card">
        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col flex="auto">
            <Input
              placeholder="Поиск пользователей..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </Col>
          <Col>
            <Select
              value={filterType}
              onChange={handleUserTypeFilter}
              style={{ width: 120 }}
            >
              <Option value="all">Все</Option>
              <Option value="client">Клиенты</Option>
              <Option value="agent">Агенты</Option>
            </Select>
          </Col>
          <Col>
            <Button
              type="primary"
              icon={<UserAddOutlined />}
              onClick={() => {
                setEditingUser(null);
                form.resetFields();
                setIsModalVisible(true);
              }}
            >
              Добавить пользователя
            </Button>
          </Col>
        </Row>

        <Table
          columns={columns}
          dataSource={filteredUsers}
          loading={loading}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => 
              `${range[0]}-${range[1]} из ${total} пользователей`,
          }}
        />
      </Card>

      {/* Модальное окно создания/редактирования */}
      <Modal
        title={editingUser ? 'Редактировать пользователя' : 'Добавить пользователя'}
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setEditingUser(null);
          form.resetFields();
        }}
        footer={null}
        width={600}
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

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="userType"
                label="Тип пользователя"
                rules={[{ required: true, message: 'Выберите тип' }]}
              >
                <Select>
                  <Option value="client">Клиент</Option>
                  <Option value="agent">Агент</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="phone"
                label="Телефон"
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="companyName"
            label="Компания"
          >
            <Input />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {editingUser ? 'Обновить' : 'Создать'}
              </Button>
              <Button onClick={() => {
                setIsModalVisible(false);
                setEditingUser(null);
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

export default UsersPage;