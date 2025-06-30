import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Alert, Typography } from 'antd';
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
    <div style={{ maxWidth: 400, margin: '60px auto', padding: 24, background: '#fff', borderRadius: 8, boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
      <Typography.Title level={3} style={{ textAlign: 'center' }}>Confirm Your Account</Typography.Title>
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item label="Email" name="email" rules={[{ required: true, message: 'Please enter your email' }]}> 
          <Input autoFocus autoComplete="email" aria-label="Email" />
        </Form.Item>
        <Form.Item label="Verification Code" name="code" rules={[{ required: true, message: 'Please enter the verification code' }]}> 
          <Input autoComplete="one-time-code" aria-label="Verification code" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>Confirm</Button>
        </Form.Item>
        <Form.Item>
          <Button type="link" onClick={handleResend} loading={resendLoading} block>Resend Code</Button>
        </Form.Item>
      </Form>
      {success && <Alert type="success" message={success} showIcon style={{ marginTop: 16 }} />}
      {error && <Alert type="error" message={error} showIcon style={{ marginTop: 16 }} />}
    </div>
  );
} 