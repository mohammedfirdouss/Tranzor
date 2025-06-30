import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Table, 
  Button, 
  Input, 
  Select, 
  Space, 
  Tag, 
  Typography, 
  Row, 
  Col,
  Tooltip,
  Badge,
  Statistic,
  DatePicker
} from 'antd';
import { 
  SearchOutlined, 
  ReloadOutlined,
  FileSearchOutlined,
  UserOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined
} from '@ant-design/icons';
import { useGetAuditLogsQuery } from '../store/api/mockApi';
import LoadingSpinner from '../components/common/LoadingSpinner';

const { Title, Text } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

export default function AuditTrailPage() {
  const [searchText, setSearchText] = useState('');
  const [eventTypeFilter, setEventTypeFilter] = useState('');
  const [userFilter, setUserFilter] = useState('');
  const [dateRange, setDateRange] = useState(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 20,
    total: 0,
  });

  // Mock API hooks
  const { 
    data: logsData, 
    isLoading, 
    error, 
    refetch 
  } = useGetAuditLogsQuery({ limit: 100 });

  const logs = logsData?.logs || [];

  // Filter logs
  const filteredLogs = logs.filter(log => {
    const matchesSearch = !searchText || 
      log.logId.toLowerCase().includes(searchText.toLowerCase()) ||
      log.eventType.toLowerCase().includes(searchText.toLowerCase()) ||
      log.userId.toLowerCase().includes(searchText.toLowerCase()) ||
      log.ipAddress.toLowerCase().includes(searchText.toLowerCase());
    
    const matchesEventType = !eventTypeFilter || log.eventType === eventTypeFilter;
    const matchesUser = !userFilter || log.userId === userFilter;
    
    const matchesDate = !dateRange || !dateRange[0] || !dateRange[1] || 
      (new Date(log.timestamp) >= dateRange[0].startOf('day') &&
       new Date(log.timestamp) <= dateRange[1].endOf('day'));
    
    return matchesSearch && matchesEventType && matchesUser && matchesDate;
  });

  // Update pagination when data changes
  useEffect(() => {
    setPagination(prev => ({
      ...prev,
      total: filteredLogs.length,
    }));
  }, [filteredLogs.length]);

  const getEventTypeColor = (eventType) => {
    switch (eventType) {
      case 'USER_LOGIN': return 'green';
      case 'USER_LOGOUT': return 'blue';
      case 'TRANSACTION_CREATED': return 'purple';
      case 'TRANSACTION_UPDATED': return 'orange';
      case 'FRAUD_ALERT_CREATED': return 'red';
      case 'SETTINGS_CHANGED': return 'cyan';
      default: return 'default';
    }
  };

  const getEventIcon = (eventType) => {
    switch (eventType) {
      case 'USER_LOGIN': return <UserOutlined />;
      case 'USER_LOGOUT': return <UserOutlined />;
      case 'TRANSACTION_CREATED': return <ClockCircleOutlined />;
      case 'TRANSACTION_UPDATED': return <ClockCircleOutlined />;
      case 'FRAUD_ALERT_CREATED': return <CloseCircleOutlined />;
      case 'SETTINGS_CHANGED': return <CheckCircleOutlined />;
      default: return <ClockCircleOutlined />;
    }
  };

  const columns = [
    {
      title: 'Log ID',
      dataIndex: 'logId',
      key: 'logId',
      width: 120,
      render: (text) => <Text code>{text}</Text>,
    },
    {
      title: 'Event Type',
      dataIndex: 'eventType',
      key: 'eventType',
      width: 150,
      render: (eventType) => (
        <Tag color={getEventTypeColor(eventType)} icon={getEventIcon(eventType)}>
          {eventType.replace(/_/g, ' ')}
        </Tag>
      ),
    },
    {
      title: 'User',
      dataIndex: 'userId',
      key: 'userId',
      width: 180,
      render: (userId) => (
        <Space>
          <UserOutlined />
          <Text>{userId}</Text>
        </Space>
      ),
    },
    {
      title: 'IP Address',
      dataIndex: 'ipAddress',
      key: 'ipAddress',
      width: 120,
      render: (ip) => <Text code>{ip}</Text>,
    },
    {
      title: 'Timestamp',
      dataIndex: 'timestamp',
      key: 'timestamp',
      width: 160,
      render: (timestamp) => new Date(timestamp).toLocaleString(),
    },
    {
      title: 'Status',
      key: 'status',
      width: 100,
      render: (_, record) => (
        <Badge 
          status={record.success ? 'success' : 'error'} 
          text={record.success ? 'Success' : 'Failed'}
        />
      ),
    },
    {
      title: 'Details',
      key: 'details',
      width: 200,
      render: (_, record) => {
        if (record.details?.resource) {
          return (
            <Tooltip title={record.details.action}>
              <Text code>{record.details.resource}</Text>
            </Tooltip>
          );
        }
        return <Text type="secondary">-</Text>;
      },
    },
  ];

  const stats = {
    total: filteredLogs.length,
    successful: filteredLogs.filter(log => log.success).length,
    failed: filteredLogs.filter(log => !log.success).length,
    logins: filteredLogs.filter(log => log.eventType === 'USER_LOGIN').length,
    transactions: filteredLogs.filter(log => log.eventType.includes('TRANSACTION')).length,
  };

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <Title level={2}>
          <FileSearchOutlined style={{ marginRight: 8 }} />
          Audit Trail
        </Title>
        <Text type="secondary">
          Comprehensive audit log of all system activities
        </Text>
      </div>

      {/* Statistics Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic 
              title="Total Logs" 
              value={stats.total}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic 
              title="Successful" 
              value={stats.successful}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic 
              title="Failed" 
              value={stats.failed}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic 
              title="User Logins" 
              value={stats.logins}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Filters and Search */}
      <Card style={{ marginBottom: 24 }}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={8} md={6}>
            <Input
              placeholder="Search logs..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              allowClear
            />
          </Col>
          <Col xs={24} sm={8} md={4}>
            <Select
              placeholder="Event Type"
              value={eventTypeFilter}
              onChange={setEventTypeFilter}
              allowClear
              style={{ width: '100%' }}
            >
              <Option value="USER_LOGIN">User Login</Option>
              <Option value="USER_LOGOUT">User Logout</Option>
              <Option value="TRANSACTION_CREATED">Transaction Created</Option>
              <Option value="TRANSACTION_UPDATED">Transaction Updated</Option>
              <Option value="FRAUD_ALERT_CREATED">Fraud Alert Created</Option>
              <Option value="SETTINGS_CHANGED">Settings Changed</Option>
            </Select>
          </Col>
          <Col xs={24} sm={8} md={4}>
            <Select
              placeholder="User"
              value={userFilter}
              onChange={setUserFilter}
              allowClear
              style={{ width: '100%' }}
            >
              <Option value="admin@tranzor.com">admin@tranzor.com</Option>
              <Option value="analyst@tranzor.com">analyst@tranzor.com</Option>
              <Option value="manager@tranzor.com">manager@tranzor.com</Option>
              <Option value="support@tranzor.com">support@tranzor.com</Option>
            </Select>
          </Col>
          <Col xs={24} sm={8} md={6}>
            <RangePicker
              value={dateRange}
              onChange={setDateRange}
              style={{ width: '100%' }}
              placeholder={['Start Date', 'End Date']}
            />
          </Col>
          <Col xs={24} sm={8} md={4}>
            <Button 
              icon={<ReloadOutlined />} 
              onClick={refetch}
              loading={isLoading}
            >
              Refresh
            </Button>
          </Col>
        </Row>
      </Card>

      {/* Audit Logs Table */}
      <Card>
        <LoadingSpinner spinning={isLoading}>
          <Table
            columns={columns}
            dataSource={filteredLogs}
            rowKey="logId"
            pagination={{
              ...pagination,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) => 
                `${range[0]}-${range[1]} of ${total} logs`,
            }}
            onChange={(pagination) => setPagination(pagination)}
            scroll={{ x: 1200 }}
          />
        </LoadingSpinner>
      </Card>
    </div>
  );
}