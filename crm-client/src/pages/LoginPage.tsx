import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Card, Typography, Alert, Spin } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { loginAdmin, clearError, verifyToken } from '../store/slices/authSlice';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

interface LoginFormData {
  email: string;
  password: string;
}

const LoginPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isLoading, error, isAuthenticated } = useAppSelector((state) => state.auth);
  const [form] = Form.useForm();

  useEffect(() => {
    // Проверяем токен при загрузке страницы
    dispatch(verifyToken());
  }, [dispatch]);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const onFinish = async (values: LoginFormData) => {
    dispatch(clearError());
    const result = await dispatch(loginAdmin(values));
    
    if (loginAdmin.fulfilled.match(result)) {
      navigate('/dashboard');
    }
  };

  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: '#000'
      }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #000 0%, #1a1a1a 100%)',
      padding: '20px'
    }}>
      <Card
        style={{
          width: '100%',
          maxWidth: 400,
          background: '#141414',
          border: '1px solid #303030'
        }}
        bodyStyle={{ padding: '40px' }}
      >
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <Title level={2} style={{ color: '#52c41a', marginBottom: '8px' }}>
            BearPlus CRM
          </Title>
          <Text style={{ color: '#8c8c8c' }}>
            Панель администратора
          </Text>
        </div>

        {error && (
          <Alert
            message={error}
            type="error"
            showIcon
            style={{ marginBottom: '20px' }}
          />
        )}

        <Form
          form={form}
          name="login"
          onFinish={onFinish}
          layout="vertical"
          size="large"
        >
          <Form.Item
            name="email"
            label={<span style={{ color: '#fff' }}>Email</span>}
            rules={[
              { required: true, message: 'Введите email' },
              { type: 'email', message: 'Некорректный email' }
            ]}
          >
            <Input
              prefix={<UserOutlined style={{ color: '#8c8c8c' }} />}
              placeholder="admin@bearplus.com"
              style={{
                background: '#1f1f1f',
                border: '1px solid #303030',
                color: '#fff'
              }}
            />
          </Form.Item>

          <Form.Item
            name="password"
            label={<span style={{ color: '#fff' }}>Пароль</span>}
            rules={[{ required: true, message: 'Введите пароль' }]}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: '#8c8c8c' }} />}
              placeholder="Введите пароль"
              style={{
                background: '#1f1f1f',
                border: '1px solid #303030',
                color: '#fff'
              }}
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: '16px' }}>
            <Button
              type="primary"
              htmlType="submit"
              loading={isLoading}
              block
              style={{
                height: '45px',
                background: '#52c41a',
                borderColor: '#52c41a',
                fontSize: '16px'
              }}
            >
              Войти в систему
            </Button>
          </Form.Item>
        </Form>

        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <Text style={{ color: '#8c8c8c', fontSize: '12px' }}>
            Доступ разрешен только администраторам системы
          </Text>
        </div>

        <div style={{ 
          textAlign: 'center', 
          marginTop: '30px',
          paddingTop: '20px',
          borderTop: '1px solid #303030'
        }}>
          <Text style={{ color: '#666', fontSize: '12px' }}>
            © 2024 BearPlus. Все права защищены.
          </Text>
        </div>
      </Card>
    </div>
  );
};

export default LoginPage;