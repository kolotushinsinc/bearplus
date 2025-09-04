import React, { useState } from 'react';
import {
  Card,
  Typography,
  Form,
  Input,
  Button,
  Switch,
  Select,
  Divider,
  Space,
  Row,
  Col,
  InputNumber,
  message,
  Tabs,
  Upload,
  Tag
} from 'antd';
import {
  SettingOutlined,
  SaveOutlined,
  GlobalOutlined,
  SecurityScanOutlined,
  MailOutlined,
  DatabaseOutlined,
  UploadOutlined,
  ApiOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;
const { TabPane } = Tabs;

interface SystemSettings {
  general: {
    siteName: string;
    siteDescription: string;
    defaultLanguage: string;
    timezone: string;
    currency: string;
    maintenanceMode: boolean;
  };
  email: {
    smtpHost: string;
    smtpPort: number;
    smtpUser: string;
    smtpPassword: string;
    fromEmail: string;
    fromName: string;
    encryption: string;
  };
  security: {
    passwordMinLength: number;
    sessionTimeout: number;
    enableTwoFactor: boolean;
    ipWhitelist: string[];
    maxLoginAttempts: number;
    lockoutDuration: number;
  };
  api: {
    rateLimit: number;
    enableApiDocs: boolean;
    allowedOrigins: string[];
    apiVersion: string;
  };
  backup: {
    autoBackup: boolean;
    backupInterval: string;
    backupRetention: number;
    backupPath: string;
  };
}

const SettingsPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [activeTab, setActiveTab] = useState('general');

  // Mock данные настроек
  const [settings, setSettings] = useState<SystemSettings>({
    general: {
      siteName: 'BearPlus Logistics CRM',
      siteDescription: 'Система управления логистическими процессами',
      defaultLanguage: 'ru',
      timezone: 'Europe/Moscow',
      currency: 'RUB',
      maintenanceMode: false
    },
    email: {
      smtpHost: 'smtp.gmail.com',
      smtpPort: 587,
      smtpUser: 'noreply@bearplus.com',
      smtpPassword: '',
      fromEmail: 'noreply@bearplus.com',
      fromName: 'BearPlus Logistics',
      encryption: 'tls'
    },
    security: {
      passwordMinLength: 8,
      sessionTimeout: 3600,
      enableTwoFactor: false,
      ipWhitelist: ['127.0.0.1', '192.168.1.0/24'],
      maxLoginAttempts: 5,
      lockoutDuration: 15
    },
    api: {
      rateLimit: 1000,
      enableApiDocs: true,
      allowedOrigins: ['http://localhost:3000', 'https://bearplus.com'],
      apiVersion: 'v1'
    },
    backup: {
      autoBackup: true,
      backupInterval: 'daily',
      backupRetention: 30,
      backupPath: '/var/backups/bearplus'
    }
  });

  const handleSave = async (values: any) => {
    setLoading(true);
    try {
      // В реальном приложении здесь будет API запрос
      console.log('Saving settings:', values);
      
      // Обновляем локальные настройки
      setSettings(prev => ({
        ...prev,
        [activeTab]: values
      }));
      
      message.success('Настройки сохранены успешно');
    } catch (error) {
      message.error('Ошибка при сохранении настроек');
    } finally {
      setLoading(false);
    }
  };

  const handleTestEmail = async () => {
    try {
      message.loading('Отправка тестового письма...', 2);
      // В реальном приложении здесь будет API запрос
      setTimeout(() => {
        message.success('Тестовое письмо отправлено успешно');
      }, 2000);
    } catch (error) {
      message.error('Ошибка при отправке тестового письма');
    }
  };

  const handleBackupNow = async () => {
    try {
      message.loading('Создание резервной копии...', 3);
      // В реальном приложении здесь будет API запрос
      setTimeout(() => {
        message.success('Резервная копия создана успешно');
      }, 3000);
    } catch (error) {
      message.error('Ошибка при создании резервной копии');
    }
  };

  const renderGeneralSettings = () => (
    <Form
      form={form}
      layout="vertical"
      initialValues={settings.general}
      onFinish={handleSave}
    >
      <Row gutter={24}>
        <Col span={12}>
          <Form.Item
            name="siteName"
            label="Название системы"
            rules={[{ required: true, message: 'Введите название системы' }]}
          >
            <Input placeholder="BearPlus Logistics CRM" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="defaultLanguage"
            label="Язык по умолчанию"
          >
            <Select>
              <Option value="ru">Русский</Option>
              <Option value="en">English</Option>
              <Option value="zh">中文</Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>

      <Form.Item
        name="siteDescription"
        label="Описание системы"
      >
        <TextArea rows={3} placeholder="Краткое описание системы" />
      </Form.Item>

      <Row gutter={24}>
        <Col span={8}>
          <Form.Item
            name="timezone"
            label="Часовой пояс"
          >
            <Select>
              <Option value="Europe/Moscow">Europe/Moscow</Option>
              <Option value="Asia/Shanghai">Asia/Shanghai</Option>
              <Option value="America/New_York">America/New_York</Option>
              <Option value="Europe/London">Europe/London</Option>
            </Select>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name="currency"
            label="Валюта по умолчанию"
          >
            <Select>
              <Option value="RUB">₽ RUB</Option>
              <Option value="USD">$ USD</Option>
              <Option value="EUR">€ EUR</Option>
              <Option value="CNY">¥ CNY</Option>
            </Select>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name="maintenanceMode"
            label="Режим обслуживания"
            valuePropName="checked"
          >
            <Switch checkedChildren="Включен" unCheckedChildren="Выключен" />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading} icon={<SaveOutlined />}>
          Сохранить общие настройки
        </Button>
      </Form.Item>
    </Form>
  );

  const renderEmailSettings = () => (
    <Form
      form={form}
      layout="vertical"
      initialValues={settings.email}
      onFinish={handleSave}
    >
      <Row gutter={24}>
        <Col span={12}>
          <Form.Item
            name="smtpHost"
            label="SMTP сервер"
            rules={[{ required: true, message: 'Введите SMTP сервер' }]}
          >
            <Input placeholder="smtp.gmail.com" />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item
            name="smtpPort"
            label="Порт"
            rules={[{ required: true, message: 'Введите порт' }]}
          >
            <InputNumber min={1} max={65535} style={{ width: '100%' }} />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item
            name="encryption"
            label="Шифрование"
          >
            <Select>
              <Option value="none">Нет</Option>
              <Option value="tls">TLS</Option>
              <Option value="ssl">SSL</Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={24}>
        <Col span={12}>
          <Form.Item
            name="smtpUser"
            label="Пользователь SMTP"
            rules={[{ required: true, message: 'Введите пользователя' }]}
          >
            <Input placeholder="username@example.com" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="smtpPassword"
            label="Пароль SMTP"
          >
            <Input.Password placeholder="••••••••" />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={24}>
        <Col span={12}>
          <Form.Item
            name="fromEmail"
            label="Email отправителя"
            rules={[
              { required: true, message: 'Введите email отправителя' },
              { type: 'email', message: 'Некорректный email' }
            ]}
          >
            <Input placeholder="noreply@bearplus.com" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="fromName"
            label="Имя отправителя"
          >
            <Input placeholder="BearPlus Logistics" />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item>
        <Space>
          <Button type="primary" htmlType="submit" loading={loading} icon={<SaveOutlined />}>
            Сохранить настройки почты
          </Button>
          <Button onClick={handleTestEmail} icon={<MailOutlined />}>
            Отправить тестовое письмо
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );

  const renderSecuritySettings = () => (
    <Form
      form={form}
      layout="vertical"
      initialValues={settings.security}
      onFinish={handleSave}
    >
      <Row gutter={24}>
        <Col span={8}>
          <Form.Item
            name="passwordMinLength"
            label="Минимальная длина пароля"
          >
            <InputNumber min={6} max={32} style={{ width: '100%' }} />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name="sessionTimeout"
            label="Время сессии (сек)"
          >
            <InputNumber min={300} max={86400} style={{ width: '100%' }} />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name="enableTwoFactor"
            label="Двухфакторная аутентификация"
            valuePropName="checked"
          >
            <Switch checkedChildren="Включена" unCheckedChildren="Выключена" />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={24}>
        <Col span={8}>
          <Form.Item
            name="maxLoginAttempts"
            label="Максимум попыток входа"
          >
            <InputNumber min={1} max={20} style={{ width: '100%' }} />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name="lockoutDuration"
            label="Блокировка (мин)"
          >
            <InputNumber min={1} max={1440} style={{ width: '100%' }} />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item
        name="ipWhitelist"
        label="Белый список IP"
      >
        <Select
          mode="tags"
          style={{ width: '100%' }}
          placeholder="Добавьте IP адреса или подсети"
          tokenSeparators={[',']}
        >
          {settings.security.ipWhitelist.map(ip => (
            <Option key={ip} value={ip}>{ip}</Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading} icon={<SaveOutlined />}>
          Сохранить настройки безопасности
        </Button>
      </Form.Item>
    </Form>
  );

  const renderApiSettings = () => (
    <Form
      form={form}
      layout="vertical"
      initialValues={settings.api}
      onFinish={handleSave}
    >
      <Row gutter={24}>
        <Col span={8}>
          <Form.Item
            name="rateLimit"
            label="Лимит запросов в час"
          >
            <InputNumber min={100} max={10000} style={{ width: '100%' }} />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name="apiVersion"
            label="Версия API"
          >
            <Select>
              <Option value="v1">v1</Option>
              <Option value="v2">v2</Option>
            </Select>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name="enableApiDocs"
            label="Документация API"
            valuePropName="checked"
          >
            <Switch checkedChildren="Включена" unCheckedChildren="Выключена" />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item
        name="allowedOrigins"
        label="Разрешенные домены (CORS)"
      >
        <Select
          mode="tags"
          style={{ width: '100%' }}
          placeholder="Добавьте разрешенные домены"
          tokenSeparators={[',']}
        >
          {settings.api.allowedOrigins.map(origin => (
            <Option key={origin} value={origin}>{origin}</Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading} icon={<SaveOutlined />}>
          Сохранить настройки API
        </Button>
      </Form.Item>
    </Form>
  );

  const renderBackupSettings = () => (
    <div>
      <Form
        form={form}
        layout="vertical"
        initialValues={settings.backup}
        onFinish={handleSave}
      >
        <Row gutter={24}>
          <Col span={6}>
            <Form.Item
              name="autoBackup"
              label="Автоматическое резервирование"
              valuePropName="checked"
            >
              <Switch checkedChildren="Включено" unCheckedChildren="Выключено" />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              name="backupInterval"
              label="Интервал резервирования"
            >
              <Select>
                <Option value="daily">Ежедневно</Option>
                <Option value="weekly">Еженедельно</Option>
                <Option value="monthly">Ежемесячно</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              name="backupRetention"
              label="Хранить (дней)"
            >
              <InputNumber min={1} max={365} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="backupPath"
          label="Путь для резервных копий"
        >
          <Input placeholder="/var/backups/bearplus" />
        </Form.Item>

        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit" loading={loading} icon={<SaveOutlined />}>
              Сохранить настройки резервирования
            </Button>
            <Button onClick={handleBackupNow} icon={<DatabaseOutlined />}>
              Создать копию сейчас
            </Button>
          </Space>
        </Form.Item>
      </Form>

      <Divider />

      <div>
        <Title level={4} style={{ color: '#fff', marginBottom: 16 }}>
          Последние резервные копии
        </Title>
        <div style={{ background: '#1f1f1f', padding: 16, borderRadius: 8, border: '1px solid #303030' }}>
          {[
            { date: '2024-01-16 03:00:00', size: '2.3 GB', status: 'success' },
            { date: '2024-01-15 03:00:00', size: '2.1 GB', status: 'success' },
            { date: '2024-01-14 03:00:00', size: '2.0 GB', status: 'success' },
            { date: '2024-01-13 03:00:00', size: '1.9 GB', status: 'failed' }
          ].map((backup, index) => (
            <div key={index} style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              padding: '8px 0',
              borderBottom: index < 3 ? '1px solid #303030' : 'none'
            }}>
              <div>
                <Text style={{ color: '#fff' }}>{backup.date}</Text>
                <Text style={{ color: '#8c8c8c', marginLeft: 16 }}>{backup.size}</Text>
              </div>
              <Tag color={backup.status === 'success' ? 'success' : 'error'}>
                {backup.status === 'success' ? 'Успешно' : 'Ошибка'}
              </Tag>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div>
      <div className="page-header">
        <Title level={2} style={{ margin: 0, color: '#fff' }}>
          <SettingOutlined style={{ marginRight: 8 }} />
          Настройки системы
        </Title>
        <Text style={{ color: '#8c8c8c' }}>
          Конфигурация и управление системными параметрами
        </Text>
      </div>

      <Card className="content-card">
        <Tabs 
          activeKey={activeTab} 
          onChange={setActiveTab}
          type="card"
          size="large"
        >
          <TabPane 
            tab={
              <span>
                <GlobalOutlined />
                Общие
              </span>
            } 
            key="general"
          >
            {renderGeneralSettings()}
          </TabPane>
          
          <TabPane 
            tab={
              <span>
                <MailOutlined />
                Почта
              </span>
            } 
            key="email"
          >
            {renderEmailSettings()}
          </TabPane>
          
          <TabPane 
            tab={
              <span>
                <SecurityScanOutlined />
                Безопасность
              </span>
            } 
            key="security"
          >
            {renderSecuritySettings()}
          </TabPane>
          
          <TabPane 
            tab={
              <span>
                <ApiOutlined />
                API
              </span>
            } 
            key="api"
          >
            {renderApiSettings()}
          </TabPane>
          
          <TabPane 
            tab={
              <span>
                <DatabaseOutlined />
                Резервирование
              </span>
            } 
            key="backup"
          >
            {renderBackupSettings()}
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
};

export default SettingsPage;