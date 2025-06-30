import React, { useState } from 'react';
import { Card, Form, Input, Button, Typography, Space, Alert } from 'antd';
import { UserOutlined, LockOutlined, LoginOutlined } from '@ant-design/icons';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

const { Title, Text } = Typography;

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Get the page user was trying to access
  const from = location.state?.from?.pathname || '/';

  const onFinish = async (values) => {
    setLoading(true);
    setError('');

    try {
      await signIn(values.email, values.password);
      // Redirect to the page they were trying to access
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Sign in failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px'
    }}>
      <Card
        style={{
          width: '100%',
          maxWidth: '400px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          borderRadius: '12px'
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <Title level={2} style={{ margin: 0, color: '#1890ff' }}>
            <LoginOutlined style={{ marginRight: '8px' }} />
            Tranzor Admin
          </Title>
          <Text type="secondary">
            Sign in to access the transaction management system
          </Text>
        </div>

        {error && (
          <Alert
            message="Authentication Error"
            description={error}
            type="error"
            showIcon
            style={{ marginBottom: '24px' }}
          />
        )}

        <Form
          name="login"
          onFinish={onFinish}
          autoComplete="off"
          layout="vertical"
          size="large"
        >
          <Form.Item
            name="email"
            label="Email"
            rules={[
              {
                required: true,
                message: 'Please enter your email!',
                type: 'email',
              },
            ]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="Enter your email"
              autoComplete="email"
            />
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            rules={[
              {
                required: true,
                message: 'Please enter your password!',
              },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Enter your password"
              autoComplete="current-password"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              style={{
                width: '100%',
                height: '48px',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '600'
              }}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </Button>
          </Form.Item>
          <Form.Item style={{ marginBottom: 0 }}>
            <div style={{ textAlign: 'center' }}>
              Don't have an account?{' '}
              <a href="/register">Sign up</a>
            </div>
          </Form.Item>
        </Form>

        <div style={{ textAlign: 'center', marginTop: '24px' }}>
          <Text type="secondary" style={{ fontSize: '12px' }}>
            Secure authentication powered by AWS Cognito
          </Text>
        </div>
      </Card>
    </div>
  );
}
