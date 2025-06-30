import React from 'react';
import { Alert, Button, Space } from 'antd';
import { InfoCircleOutlined, PlayCircleOutlined } from '@ant-design/icons';

export default function DemoBanner() {
  return (
    <Alert
      message="Demo Mode - Mock Data Active"
      description={
        <div>
          <p>
            You are currently using <strong>mock data</strong> for testing and demonstration purposes. 
            All data is generated locally and will reset when you refresh the page.
          </p>
          <Space style={{ marginTop: 8 }}>
            <Button 
              type="primary" 
              size="small" 
              icon={<PlayCircleOutlined />}
              onClick={() => window.location.href = '/dashboard'}
            >
              Try Dashboard
            </Button>
            <Button 
              size="small" 
              icon={<InfoCircleOutlined />}
              onClick={() => window.open('https://github.com/your-repo/tranzor', '_blank')}
            >
              View Documentation
            </Button>
          </Space>
        </div>
      }
      type="info"
      showIcon
      icon={<InfoCircleOutlined />}
      style={{ 
        marginBottom: 16,
        borderRadius: 8
      }}
    />
  );
} 