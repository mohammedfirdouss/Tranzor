import React from 'react';
import { Card, Divider, Switch, InputNumber, Select, Button, Form, message } from 'antd';
import { SettingOutlined, SaveOutlined } from '@ant-design/icons';

const { Option } = Select;

export default function SettingsPage() {
  const [form] = Form.useForm();

  const handleSave = (values) => {
    console.log('Settings saved:', values);
    message.success('Settings saved successfully!');
  };

  return (
    <div>
      <div style={{ marginBottom: 24, display: 'flex', alignItems: 'center', gap: 16 }}>
        <SettingOutlined style={{ fontSize: 24, color: '#1890ff' }} />
        <h2 style={{ margin: 0 }}>Settings</h2>
      </div>

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
      >
        <Card title="Display Settings" style={{ marginBottom: 24 }}>
          <Form.Item
            label="Theme"
            name="theme"
          >
            <Select style={{ width: 200 }}>
              <Option value="light">Light</Option>
              <Option value="dark">Dark</Option>
              <Option value="auto">Auto</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Default Page Size"
            name="pageSize"
          >
            <InputNumber min={5} max={100} style={{ width: 200 }} />
          </Form.Item>

          <Form.Item
            label="Auto Refresh"
            name="autoRefresh"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>

          <Form.Item
            label="Refresh Interval (seconds)"
            name="refreshInterval"
          >
            <InputNumber min={10} max={300} style={{ width: 200 }} />
          </Form.Item>
        </Card>

        <Card title="Notification Settings" style={{ marginBottom: 24 }}>
          <Form.Item
            label="Enable Notifications"
            name="notifications"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>

          <Form.Item
            label="Sound Alerts"
            name="soundAlerts"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
        </Card>

        <Card title="API Settings" style={{ marginBottom: 24 }}>
          <div style={{ color: '#666', marginBottom: 16 }}>
            <strong>Current API Base URL:</strong><br />
            {import.meta.env.VITE_API_BASE_URL || 'Not configured'}
          </div>
          <div style={{ color: '#666' }}>
            <strong>Environment:</strong><br />
            {import.meta.env.DEV ? 'Development' : 'Production'}
          </div>
        </Card>

        <Form.Item>
          <Button 
            type="primary" 
            htmlType="submit"
            icon={<SaveOutlined />}
            size="large"
          >
            Save Settings
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}