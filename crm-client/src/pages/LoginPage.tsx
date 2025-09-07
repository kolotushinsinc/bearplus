import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Card, Typography, Alert, Space } from 'antd';
import { UserOutlined, LockOutlined, LoginOutlined } from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { loginAdmin, clearError } from '../store/slices/authSlice';
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
    // Очищаем ошибки при загрузке
    dispatch(clearError());
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

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0f0a 0%, #1a1f1a 50%, #0f140f 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{ width: '100%', maxWidth: '420px' }}>
        {/* Modern Logo Section */}
        <div style={{ 
          textAlign: 'center', 
          marginBottom: '40px',
          padding: '32px',
          background: 'rgba(20, 25, 20, 0.6)',
          borderRadius: '20px 20px 8px 8px',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(0, 255, 136, 0.1)'
        }}>
          <div style={{
            width: '80px',
            height: '80px',
            background: 'linear-gradient(135deg, #00ff88, #1de9b6)',
            borderRadius: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
            boxShadow: '0 8px 32px rgba(0, 255, 136, 0.3)'
          }}>
            <LoginOutlined style={{ fontSize: '36px', color: '#000' }} />
          </div>
          
          <Title level={2} style={{ 
            color: '#fff', 
            margin: '0 0 8px 0',
            background: 'linear-gradient(135deg, #00ff88, #1de9b6)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            fontSize: '28px',
            fontWeight: '700'
          }}>
            BearPlus CRM
          </Title>
          
          <Text style={{ 
            color: '#8c8c8c',
            fontSize: '14px',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            fontWeight: '500'
          }}>
            Административная панель
          </Text>
        </div>

        {/* Login Card */}
        <Card
          style={{
            background: 'rgba(15, 20, 15, 0.9)',
            border: '1px solid rgba(0, 255, 136, 0.1)',
            borderRadius: '8px 8px 20px 20px',
            backdropFilter: 'blur(30px)',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.4)'
          }}
          bodyStyle={{ padding: '32px' }}
        >
          {error && (
            <Alert
              message={error}
              type="error"
              showIcon
              style={{ 
                marginBottom: '24px',
                background: 'rgba(245, 34, 45, 0.1)',
                border: '1px solid rgba(245, 34, 45, 0.3)',
                borderRadius: '8px'
              }}
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
              label={<span style={{ color: '#fff', fontWeight: '500' }}>Email адрес</span>}
              rules={[
                { required: true, message: 'Введите email' },
                { type: 'email', message: 'Некорректный email' }
              ]}
            >
              <Input
                prefix={<UserOutlined style={{ color: '#8c8c8c' }} />}
                placeholder="admin@bearplus.dev"
                style={{
                  height: '48px',
                  borderRadius: '8px',
                  fontSize: '14px'
                }}
              />
            </Form.Item>

            <Form.Item
              name="password"
              label={<span style={{ color: '#fff', fontWeight: '500' }}>Пароль</span>}
              rules={[{ required: true, message: 'Введите пароль' }]}
            >
              <Input.Password
                prefix={<LockOutlined style={{ color: '#8c8c8c' }} />}
                placeholder="Введите пароль"
                style={{
                  height: '48px',
                  borderRadius: '8px',
                  fontSize: '14px'
                }}
              />
            </Form.Item>

            <Form.Item style={{ marginBottom: '0', marginTop: '24px' }}>
              <Button
                type="primary"
                htmlType="submit"
                loading={isLoading}
                block
                style={{
                  height: '52px',
                  borderRadius: '12px',
                  fontSize: '16px',
                  fontWeight: '600',
                  background: 'linear-gradient(135deg, #00ff88, #1de9b6)',
                  border: 'none',
                  boxShadow: '0 6px 20px rgba(0, 255, 136, 0.3)'
                }}
              >
                {isLoading ? 'Вход в систему...' : 'Войти в панель'}
              </Button>
            </Form.Item>
          </Form>
        </Card>

        {/* Footer Info */}
        <div style={{ 
          textAlign: 'center', 
          marginTop: '32px',
          padding: '20px',
          background: 'rgba(10, 15, 10, 0.6)',
          borderRadius: '12px',
          border: '1px solid rgba(0, 255, 136, 0.05)'
        }}>
          <Text style={{ color: '#666', fontSize: '12px', display: 'block', marginBottom: '8px' }}>
            Доступ разрешен только администраторам системы
          </Text>
          <div style={{ 
            color: '#444', 
            fontSize: '11px',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            Powered by <span style={{ color: '#00ff88', fontWeight: '600' }}>KolTech</span>
          </div>
          <Text style={{ color: '#333', fontSize: '10px', marginTop: '4px', display: 'block' }}>
            © 2025 Professional Development
          </Text>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;