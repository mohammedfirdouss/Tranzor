import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Table, 
  Button, 
  Input, 
  Select, 
  Space, 
  Tag, 
  Modal, 
  Form, 
  message, 
  Typography, 
  Row, 
  Col,
  Tooltip,
  Badge,
  Statistic,
  Alert,
  Progress
} from 'antd';
import { 
  SearchOutlined, 
  PlusOutlined, 
  EditOutlined, 
  EyeOutlined,
  ReloadOutlined,
  WarningOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined
} from '@ant-design/icons';
import { 
  useGetFraudAlertsQuery, 
  useUpdateFraudAlertMutation,
  useCreateFraudAlertMutation
} from '../store/api/mockApi';
import LoadingSpinner from '../components/common/LoadingSpinner';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { TextArea } = Input;

export default function FraudAlertsPage() {
  const [searchText, setSearchText] = useState('');
  const [severityFilter, setSeverityFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [editForm] = Form.useForm();
  const [createForm] = Form.useForm();
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  // Mock API hooks
  const { 
    data: alertsData, 
    isLoading, 
    error, 
    refetch 
  } = useGetFraudAlertsQuery({ limit: 50 });

  const [updateAlert, { isLoading: updating }] = useUpdateFraudAlertMutation();
  const [createAlert, { isLoading: creating }] = useCreateFraudAlertMutation();

  const alerts = alertsData?.alerts || [];

  // Filter alerts
  const filteredAlerts = alerts.filter(alert => {
    const matchesSearch = !searchText || 
      alert.alertId.toLowerCase().includes(searchText.toLowerCase()) ||
      alert.transactionId.toLowerCase().includes(searchText.toLowerCase()) ||
      alert.description.toLowerCase().includes(searchText.toLowerCase());
    
    const matchesSeverity = !severityFilter || alert.severity === severityFilter;
    const matchesStatus = !statusFilter || alert.status === statusFilter;
    
    return matchesSearch && matchesSeverity && matchesStatus;
  });

  // Update pagination when data changes
  useEffect(() => {
    setPagination(prev => ({
      ...prev,
      total: filteredAlerts.length,
    }));
  }, [filteredAlerts.length]);

  const handleView = (record) => {
    setSelectedAlert(record);
    setViewModalVisible(true);
  };

  const handleEdit = (record) => {
    setSelectedAlert(record);
    editForm.setFieldsValue({
      status: record.status,
      notes: record.notes,
      resolution: record.resolution,
    });
    setEditModalVisible(true);
  };

  const handleUpdate = async (values) => {
    try {
      await updateAlert({
        alertId: selectedAlert.alertId,
        updates: values
      }).unwrap();
      
      message.success('Alert updated successfully!');
      setEditModalVisible(false);
      refetch();
    } catch (error) {
      message.error('Failed to update alert');
    }
  };

  const handleCreate = async (values) => {
    try {
      await createAlert({
        transactionId: values.transactionId,
        type: values.type,
        severity: values.severity,
        description: values.description,
        riskScore: values.riskScore
      }).unwrap();
      
      message.success('Alert created successfully!');
      setCreateModalVisible(false);
      createForm.resetFields();
      refetch();
    } catch (error) {
      message.error('Failed to create alert');
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'CRITICAL': return 'red';
      case 'HIGH': return 'orange';
      case 'MEDIUM': return 'yellow';
      case 'LOW': return 'green';
      default: return 'default';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'OPEN': return 'error';
      case 'INVESTIGATING': return 'warning';
      case 'RESOLVED': return 'success';
      case 'FALSE_POSITIVE': return 'default';
      default: return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'OPEN': return <WarningOutlined />;
      case 'INVESTIGATING': return <WarningOutlined />;
      case 'RESOLVED': return <CheckCircleOutlined />;
      case 'FALSE_POSITIVE': return <CloseCircleOutlined />;
      default: return <WarningOutlined />;
    }
  };

  const columns = [
    {
      title: 'Alert ID',
      dataIndex: 'alertId',
      key: 'alertId',
      width: 120,
      render: (text) => <Text code>{text}</Text>,
    },
    {
      title: 'Transaction ID',
      dataIndex: 'transactionId',
      key: 'transactionId',
      width: 120,
      render: (text) => <Text code>{text}</Text>,
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      width: 150,
      render: (type) => (
        <Tag color="blue">
          {type.replace(/_/g, ' ')}
        </Tag>
      ),
    },
    {
      title: 'Severity',
      dataIndex: 'severity',
      key: 'severity',
      width: 100,
      render: (severity) => (
        <Tag color={getSeverityColor(severity)}>
          {severity}
        </Tag>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status) => (
        <Badge 
          status={getStatusColor(status)} 
          text={status}
          icon={getStatusIcon(status)}
        />
      ),
    },
    {
      title: 'Risk Score',
      dataIndex: 'riskScore',
      key: 'riskScore',
      width: 100,
      render: (score) => (
        <Progress 
          percent={score} 
          size="small" 
          status={score > 70 ? 'exception' : score > 30 ? 'active' : 'success'}
          format={(percent) => `${percent.toFixed(0)}%`}
        />
      ),
    },
    {
      title: 'Date',
      dataIndex: 'timestamp',
      key: 'timestamp',
      width: 120,
      render: (timestamp) => new Date(timestamp).toLocaleDateString(),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 120,
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="View Details">
            <Button 
              type="text" 
              icon={<EyeOutlined />} 
              onClick={() => handleView(record)}
              size="small"
            />
          </Tooltip>
          <Tooltip title="Edit Alert">
            <Button 
              type="text" 
              icon={<EditOutlined />} 
              onClick={() => handleEdit(record)}
              size="small"
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const stats = {
    total: filteredAlerts.length,
    open: filteredAlerts.filter(a => a.status === 'OPEN').length,
    investigating: filteredAlerts.filter(a => a.status === 'INVESTIGATING').length,
    resolved: filteredAlerts.filter(a => a.status === 'RESOLVED').length,
    critical: filteredAlerts.filter(a => a.severity === 'CRITICAL').length,
    high: filteredAlerts.filter(a => a.severity === 'HIGH').length,
  };

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <Title level={2}>Fraud Alerts</Title>
        <Text type="secondary">
          Monitor and manage fraud detection alerts
        </Text>
      </div>

      {/* Statistics Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic 
              title="Total Alerts" 
              value={stats.total}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic 
              title="Open Alerts" 
              value={stats.open}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic 
              title="Investigating" 
              value={stats.investigating}
              valueStyle={{ color: '#fa8c16' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic 
              title="Critical" 
              value={stats.critical}
              valueStyle={{ color: '#cf1322' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Filters and Search */}
      <Card style={{ marginBottom: 24 }}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={8} md={6}>
            <Input
              placeholder="Search alerts..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              allowClear
            />
          </Col>
          <Col xs={24} sm={8} md={4}>
            <Select
              placeholder="Severity"
              value={severityFilter}
              onChange={setSeverityFilter}
              allowClear
              style={{ width: '100%' }}
            >
              <Option value="CRITICAL">Critical</Option>
              <Option value="HIGH">High</Option>
              <Option value="MEDIUM">Medium</Option>
              <Option value="LOW">Low</Option>
            </Select>
          </Col>
          <Col xs={24} sm={8} md={4}>
            <Select
              placeholder="Status"
              value={statusFilter}
              onChange={setStatusFilter}
              allowClear
              style={{ width: '100%' }}
            >
              <Option value="OPEN">Open</Option>
              <Option value="INVESTIGATING">Investigating</Option>
              <Option value="RESOLVED">Resolved</Option>
              <Option value="FALSE_POSITIVE">False Positive</Option>
            </Select>
          </Col>
          <Col xs={24} sm={8} md={10}>
            <Space>
              <Button 
                icon={<ReloadOutlined />} 
                onClick={refetch}
                loading={isLoading}
              >
                Refresh
              </Button>
              <Button 
                type="primary" 
                icon={<PlusOutlined />}
                onClick={() => setCreateModalVisible(true)}
              >
                New Alert
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Alerts Table */}
      <Card>
        <LoadingSpinner spinning={isLoading}>
          <Table
            columns={columns}
            dataSource={filteredAlerts}
            rowKey="alertId"
            pagination={{
              ...pagination,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) => 
                `${range[0]}-${range[1]} of ${total} alerts`,
            }}
            onChange={(pagination) => setPagination(pagination)}
            scroll={{ x: 1200 }}
          />
        </LoadingSpinner>
      </Card>

      {/* View Alert Modal */}
      <Modal
        title="Alert Details"
        open={viewModalVisible}
        onCancel={() => setViewModalVisible(false)}
        footer={null}
        width={600}
      >
        {selectedAlert && (
          <div>
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Text strong>Alert ID:</Text>
                <br />
                <Text code>{selectedAlert.alertId}</Text>
              </Col>
              <Col span={12}>
                <Text strong>Transaction ID:</Text>
                <br />
                <Text code>{selectedAlert.transactionId}</Text>
              </Col>
              <Col span={12}>
                <Text strong>Type:</Text>
                <br />
                <Tag color="blue">
                  {selectedAlert.type.replace(/_/g, ' ')}
                </Tag>
              </Col>
              <Col span={12}>
                <Text strong>Severity:</Text>
                <br />
                <Tag color={getSeverityColor(selectedAlert.severity)}>
                  {selectedAlert.severity}
                </Tag>
              </Col>
              <Col span={12}>
                <Text strong>Status:</Text>
                <br />
                <Badge 
                  status={getStatusColor(selectedAlert.status)} 
                  text={selectedAlert.status}
                  icon={getStatusIcon(selectedAlert.status)}
                />
              </Col>
              <Col span={12}>
                <Text strong>Risk Score:</Text>
                <br />
                <Progress 
                  percent={selectedAlert.riskScore} 
                  size="small" 
                  status={selectedAlert.riskScore > 70 ? 'exception' : selectedAlert.riskScore > 30 ? 'active' : 'success'}
                  format={(percent) => `${percent.toFixed(0)}%`}
                />
              </Col>
              <Col span={24}>
                <Text strong>Description:</Text>
                <br />
                <Text>{selectedAlert.description}</Text>
              </Col>
              {selectedAlert.notes && (
                <Col span={24}>
                  <Text strong>Notes:</Text>
                  <br />
                  <Text type="secondary">{selectedAlert.notes}</Text>
                </Col>
              )}
              <Col span={12}>
                <Text strong>Investigator:</Text>
                <br />
                <Text>{selectedAlert.investigator}</Text>
              </Col>
              <Col span={12}>
                <Text strong>Date:</Text>
                <br />
                <Text>{new Date(selectedAlert.timestamp).toLocaleString()}</Text>
              </Col>
            </Row>
          </div>
        )}
      </Modal>

      {/* Edit Alert Modal */}
      <Modal
        title="Edit Alert"
        open={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        footer={null}
        width={500}
      >
        <Form
          form={editForm}
          layout="vertical"
          onFinish={handleUpdate}
        >
          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true, message: 'Please select status' }]}
          >
            <Select placeholder="Select status">
              <Option value="OPEN">Open</Option>
              <Option value="INVESTIGATING">Investigating</Option>
              <Option value="RESOLVED">Resolved</Option>
              <Option value="FALSE_POSITIVE">False Positive</Option>
            </Select>
          </Form.Item>
          
          <Form.Item
            name="resolution"
            label="Resolution"
          >
            <Select placeholder="Select resolution" allowClear>
              <Option value="FALSE_POSITIVE">False Positive</Option>
              <Option value="CONFIRMED_FRAUD">Confirmed Fraud</Option>
              <Option value="RESOLVED">Resolved</Option>
            </Select>
          </Form.Item>
          
          <Form.Item
            name="notes"
            label="Notes"
          >
            <TextArea 
              placeholder="Enter investigation notes"
              rows={4}
            />
          </Form.Item>
          
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={updating} block>
              Update Alert
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Create Alert Modal */}
      <Modal
        title="Create New Alert"
        open={createModalVisible}
        onCancel={() => setCreateModalVisible(false)}
        footer={null}
        width={500}
      >
        <Form
          form={createForm}
          layout="vertical"
          onFinish={handleCreate}
        >
          <Form.Item
            name="transactionId"
            label="Transaction ID"
            rules={[{ required: true, message: 'Please enter transaction ID' }]}
          >
            <Input placeholder="Enter transaction ID" />
          </Form.Item>
          
          <Form.Item
            name="type"
            label="Alert Type"
            rules={[{ required: true, message: 'Please select alert type' }]}
          >
            <Select placeholder="Select alert type">
              <Option value="SUSPICIOUS_ACTIVITY">Suspicious Activity</Option>
              <Option value="HIGH_RISK_TRANSACTION">High Risk Transaction</Option>
              <Option value="GEOGRAPHIC_ANOMALY">Geographic Anomaly</Option>
              <Option value="VELOCITY_ALERT">Velocity Alert</Option>
              <Option value="AMOUNT_ANOMALY">Amount Anomaly</Option>
            </Select>
          </Form.Item>
          
          <Form.Item
            name="severity"
            label="Severity"
            rules={[{ required: true, message: 'Please select severity' }]}
          >
            <Select placeholder="Select severity">
              <Option value="LOW">Low</Option>
              <Option value="MEDIUM">Medium</Option>
              <Option value="HIGH">High</Option>
              <Option value="CRITICAL">Critical</Option>
            </Select>
          </Form.Item>
          
          <Form.Item
            name="riskScore"
            label="Risk Score"
            rules={[{ required: true, message: 'Please enter risk score' }]}
          >
            <Input 
              type="number"
              min={0}
              max={100}
              placeholder="Enter risk score (0-100)"
            />
          </Form.Item>
          
          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: 'Please enter description' }]}
          >
            <TextArea 
              placeholder="Enter alert description"
              rows={3}
            />
          </Form.Item>
          
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={creating} block>
              Create Alert
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}