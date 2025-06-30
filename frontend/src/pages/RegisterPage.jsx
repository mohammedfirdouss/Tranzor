import React, { useState } from 'react';
import { useRegisterMutation } from '../store/api/authApi';
import { useNavigate } from 'react-router-dom';
import { Button, Form, Input, Alert, Typography, Card } from 'antd';
import { LoginOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

export default function RegisterPage() {
  const [register, { isLoading }] = useRegisterMutation();
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setError(null);
    try {
      // Only send email and password to backend
      await register({ email: values.email, password: values.password }).unwrap();
      navigate('/confirm-signup', { state: { email: values.email } });
    } catch (err) {
      setError(err.data?.message || 'Registration failed');
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
            Create your account to access the transaction management system
          </Text>
        </div>
        {error && <Alert type="error" message={error} showIcon style={{ marginBottom: 16 }} />}
        <Form layout="vertical" onFinish={onFinish} size="large">
          <Form.Item name="name" label="Name" rules={[{ required: true, message: 'Please enter your name' }]}> 
            <Input autoComplete="name" placeholder="Enter your name" />
          </Form.Item>
          <Form.Item name="email" label="Email" rules={[{ required: true, message: 'Please enter your email', type: 'email' }]}> 
            <Input type="email" autoComplete="email" placeholder="Enter your email" />
          </Form.Item>
          <Form.Item name="password" label="Password" rules={[{ required: true, message: 'Please enter your password' }]}> 
            <Input.Password autoComplete="new-password" placeholder="Enter your password" />
          </Form.Item>
          <Form.Item name="confirmPassword" label="Confirm Password" dependencies={["password"]} rules={[
            { required: true, message: 'Please confirm your password' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('Passwords do not match!'));
              },
            }),
          ]}>
            <Input.Password autoComplete="new-password" placeholder="Confirm your password" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={isLoading} style={{
              width: '100%',
              height: '48px',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600'
            }}>
              {isLoading ? 'Registering...' : 'Register'}
            </Button>
          </Form.Item>
          <Form.Item style={{ marginBottom: 0 }}>
            <div style={{ textAlign: 'center' }}>
              Already have an account?{' '}
              <a href="/login">Sign in</a>
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
