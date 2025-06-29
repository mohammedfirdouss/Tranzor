import React from 'react';
import { Card, Divider, Switch, InputNumber, Select, Button, Form, message, Typography, Space } from 'antd';
import { SettingOutlined, SaveOutlined, InfoCircleOutlined } from '@ant-design/icons';

const { Option } = Select;
const { Title, Text } = Typography;

export default function SettingsPage() {
  const [form] = Form.useForm();

  const handleSave = (values) => {
    console.log('Settings saved:', values);
    message.success('Settings saved successfully!');
  };

  return (
    <div>
      <div style={{ marginBottom: 24, display: 'flex', alignItems: 'center', gap: 16 }}>
        <SettingOutlined style={{ fontSize: 24, color: '#1890ff' }} aria-label="Settings Icon" />
        <Title level={2} style={{ margin: 0, fontSize: 24 }}>Settings</Title>
      </div>
      <Divider />
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSave}
        initialValues={{
          autoRefresh: true,
          refreshInterval: 30,
          pageSize: 10,
          theme: 'light',
          notifications: true,
          soundAlerts: false,
        }}
        style={{ maxWidth: 600 }}
      >
        <Card title={<span><InfoCircleOutlined style={{ color: '#1890ff', marginRight: 8 }} />Display Settings</span>} style={{ marginBottom: 24 }}>
          <Form.Item
            label="Theme"
            name="theme"
            extra={<Text type="secondary">Choose your preferred color theme.</Text>}
          >
            <Select style={{ width: 200 }} aria-label="Theme Selector">
              <Option value="light">Light</Option>
              <Option value="dark">Dark</Option>
              <Option value="auto">Auto</Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="Default Page Size"
            name="pageSize"
            extra={<Text type="secondary">Number of items per page in tables.</Text>}
          >
            <InputNumber min={5} max={100} style={{ width: 200 }} aria-label="Page Size" />
          </Form.Item>
          <Form.Item
            label="Auto Refresh"
            name="autoRefresh"
            valuePropName="checked"
            extra={<Text type="secondary">Enable to refresh data automatically.</Text>}
          >
            <Switch aria-label="Auto Refresh" />
          </Form.Item>
          <Form.Item
            label="Refresh Interval (seconds)"
            name="refreshInterval"
            extra={<Text type="secondary">How often to refresh data (10-300s).</Text>}
          >
            <InputNumber min={10} max={300} style={{ width: 200 }} aria-label="Refresh Interval" />
          </Form.Item>
        </Card>
        <Card title={<span><InfoCircleOutlined style={{ color: '#1890ff', marginRight: 8 }} />Notification Settings</span>} style={{ marginBottom: 24 }}>
          <Form.Item
            label="Enable Notifications"
            name="notifications"
            valuePropName="checked"
            extra={<Text type="secondary">Show notifications for important events.</Text>}
          >
            <Switch aria-label="Enable Notifications" />
          </Form.Item>
          <Form.Item
            label="Sound Alerts"
            name="soundAlerts"
            valuePropName="checked"
            extra={<Text type="secondary">Play a sound for alerts.</Text>}
          >
            <Switch aria-label="Sound Alerts" />
          </Form.Item>
        </Card>
        <Card title={<span><InfoCircleOutlined style={{ color: '#1890ff', marginRight: 8 }} />API Settings</span>} style={{ marginBottom: 24 }}>
          <Space direction="vertical" size={4}>
            <Text strong>Current API Base URL:</Text>
            <Text code>{import.meta.env.VITE_API_BASE_URL || 'Not configured'}</Text>
            <Text strong>Environment:</Text>
            <Text>{import.meta.env.DEV ? 'Development' : 'Production'}</Text>
          </Space>
        </Card>
        <Form.Item>
          <Button 
            type="primary" 
            htmlType="submit"
            icon={<SaveOutlined />}
            size="large"
            aria-label="Save Settings"
          >
            Save Settings
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}