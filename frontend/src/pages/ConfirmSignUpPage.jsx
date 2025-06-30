import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Alert, Typography, Card } from 'antd';
import { LoginOutlined } from '@ant-design/icons';
import { useAuth } from '../contexts/AuthContext';
import { useLocation } from 'react-router-dom';

export default function ConfirmSignUpPage() {
  const [form] = Form.useForm();
  const { confirmSignUp, resendSignUpCode } = useAuth();
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const location = useLocation();

  useEffect(() => {
    if (location.state?.email) {
      form.setFieldsValue({ email: location.state.email });
    }
  }, [location.state, form]);

  const onFinish = async (values) => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      await confirmSignUp(values.email, values.code);
      setSuccess('Your account has been confirmed! You can now log in.');
    } catch (e) {
      setError(e.message || 'Failed to confirm sign up.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    const email = form.getFieldValue('email');
    if (!email) {
      setError('Please enter your email before resending the code.');
      return;
    }
    setResendLoading(true);
    setError(null);
    setSuccess(null);
    try {
      await resendSignUpCode(email);
      setSuccess('Verification code resent. Please check your email.');
    } catch (e) {
      setError(e.message || 'Failed to resend code.');
    } finally {
      setResendLoading(false);
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
          <Typography.Title level={2} style={{ margin: 0, color: '#1890ff' }}>
            <LoginOutlined style={{ marginRight: '8px' }} />
            Tranzor Admin
          </Typography.Title>
          <Typography.Text type="secondary">
            Confirm your account to access the transaction management system
          </Typography.Text>
        </div>
        <Form form={form} layout="vertical" onFinish={onFinish} size="large">
          <Form.Item label="Email" name="email" rules={[{ required: true, message: 'Please enter your email' }]}> 
            <Input autoFocus autoComplete="email" aria-label="Email" placeholder="Enter your email" />
          </Form.Item>
          <Form.Item label="Verification Code" name="code" rules={[{ required: true, message: 'Please enter the verification code' }]}> 
            <Input autoComplete="one-time-code" aria-label="Verification code" placeholder="Enter verification code" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block style={{
              width: '100%',
              height: '48px',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600'
            }}>Confirm</Button>
          </Form.Item>
          <Form.Item>
            <Button type="link" onClick={handleResend} loading={resendLoading} block>Resend Code</Button>
          </Form.Item>
          <Form.Item style={{ marginBottom: 0 }}>
            <div style={{ textAlign: 'center' }}>
              <a href="/login">Back to Login</a>
            </div>
          </Form.Item>
        </Form>
        {success && <Alert type="success" message={success} showIcon style={{ marginTop: 16 }} />}
        {error && <Alert type="error" message={error} showIcon style={{ marginTop: 16 }} />}
        <div style={{ textAlign: 'center', marginTop: '24px' }}>
          <Typography.Text type="secondary" style={{ fontSize: '12px' }}>
            Secure authentication powered by AWS Cognito
          </Typography.Text>
        </div>
      </Card>
    </div>
  );
}