import React, { useState } from 'react';
import { Card, Statistic, Row, Col, Input, Button, Modal, Badge, Tooltip, Typography, Divider, message, Form, Select, InputNumber } from 'antd';
import { DashboardOutlined, ReloadOutlined, WifiOutlined, InfoCircleOutlined, PlusOutlined } from '@ant-design/icons';
import LoadingSpinner from '../components/common/LoadingSpinner';
import DataTable from '../components/common/DataTable';
import { 
  useGetLatestTransactionsQuery, 
  useGetTransactionQuery, 
  useGetRealtimeMetricsQuery,
  useCreateTransactionMutation
} from '../store/api/mockApi';

const { Title, Text } = Typography;
const { Option } = Select;

export default function DashboardPage() {
  const [accountId, setAccountId] = useState('ACC000001'); // Default account for demo
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [detailsVisible, setDetailsVisible] = useState(false);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [createForm] = Form.useForm();
  
  // Mock API hooks
  const { 
    data: transactionsData, 
    isLoading: transactionsLoading, 
    error: transactionsError,
    refetch: refetchTransactions
  } = useGetLatestTransactionsQuery(
    { accountId, limit: 10 },
    { skip: !accountId }
  );

  const { 
    data: metricsData,
    isLoading: metricsLoading,
    error: metricsError
  } = useGetRealtimeMetricsQuery(
    { accountId },
    { skip: !accountId, pollingInterval: 5000 }
  );

  const { 
    data: transactionDetails,
    isLoading: detailsLoading
  } = useGetTransactionQuery(
    { transactionId: selectedTransaction?.transactionId, accountId },
    { skip: !selectedTransaction?.transactionId }
  );

  const [createTransaction, { isLoading: creatingTransaction }] = useCreateTransactionMutation();

  const transactions = transactionsData?.transactions || [];
  const metrics = metricsData || {};

  const stats = {
    total: transactions.length,
    approved: transactions.filter(t => t.status === 'Approved').length,
    declined: transactions.filter(t => t.status === 'Declined').length,
    pending: transactions.filter(t => t.status === 'Pending').length,
  };

  const handleViewDetails = async (transaction) => {
    setSelectedTransaction(transaction);
    setDetailsVisible(true);
  };

  const handleSearch = () => {
    if (!accountId.trim()) {
      return;
    }
    refetchTransactions();
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleCreateTransaction = async (values) => {
    try {
      await createTransaction({
        accountId: accountId,
        amount: values.amount,
        currency: values.currency,
        type: values.type,
        merchant: values.merchant,
        description: values.description
      }).unwrap();
      
      message.success('Transaction created successfully!');
      setCreateModalVisible(false);
      createForm.resetFields();
      refetchTransactions();
    } catch (error) {
      message.error('Failed to create transaction');
    }
  };

  const error = transactionsError || metricsError;

  return (
    <div>
      <div style={{ marginBottom: 24, display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
        <DashboardOutlined style={{ fontSize: 24, color: '#1890ff' }} aria-label="Dashboard Icon" />
        <Title level={2} style={{ margin: 0, fontSize: 24 }}>Dashboard</Title>
        <Tooltip title="Real-time metrics connected">
          <Badge 
            status="success" 
            text={<span style={{ fontSize: '12px', color: '#52c41a' }}>Live</span>}
            aria-label="Live Metrics"
          />
        </Tooltip>
      </div>
      <Divider />
      <div style={{ marginBottom: 24, display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
        <Input
          placeholder="Enter Account ID to load dashboard data"
          value={accountId}
          onChange={(e) => setAccountId(e.target.value)}
          onKeyPress={handleKeyPress}
          style={{ width: 300, maxWidth: '100%' }}
          aria-label="Account ID input"
          allowClear
        />
        <Button 
          type="primary" 
          onClick={handleSearch}
          loading={transactionsLoading}
          disabled={!accountId.trim()}
          aria-label="Load Dashboard"
        >
          Load Dashboard
        </Button>
        <Button 
          icon={<ReloadOutlined />} 
          onClick={refetchTransactions}
          disabled={!accountId || transactionsLoading}
          title="Refresh data"
          aria-label="Refresh Dashboard"
        >
          Refresh
        </Button>
        <Button 
          type="dashed"
          icon={<PlusOutlined />}
          onClick={() => setCreateModalVisible(true)}
          disabled={!accountId}
        >
          Create Transaction
        </Button>
      </div>
      {error && (
        <div style={{ 
          marginBottom: 24, 
          padding: 16, 
          background: '#fff2f0', 
          border: '1px solid #ffccc7',
          borderRadius: 6,
          color: '#a8071a',
          fontWeight: 500
        }} role="alert">
          Error: {error.message || 'Failed to load dashboard data'}
        </div>
      )}
      <LoadingSpinner spinning={transactionsLoading || metricsLoading}>
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col xs={24} sm={12} lg={6}>
            <Card className="tranzor-card-elevated">
              <Statistic 
                title="Total Transactions" 
                value={stats.total}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card className="tranzor-card-elevated">
              <Statistic 
                title="Approved" 
                value={stats.approved} 
                valueStyle={{ color: '#52c41a' }} 
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card className="tranzor-card-elevated">
              <Statistic 
                title="Declined" 
                value={stats.declined} 
                valueStyle={{ color: '#ff4d4f' }} 
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card className="tranzor-card-elevated">
              <Statistic 
                title="Pending" 
                value={stats.pending} 
                valueStyle={{ color: '#fa8c16' }} 
              />
            </Card>
          </Col>
        </Row>

        {/* Real-time System Metrics */}
        {metrics && (
          <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
            <Col xs={24} sm={12} lg={6}>
              <Card className="tranzor-card-elevated">
                <Statistic 
                  title="Current TPS" 
                  value={metrics.currentTps || 0}
                  valueStyle={{ color: '#722ed1' }}
                  suffix="tx/s"
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card className="tranzor-card-elevated">
                <Statistic 
                  title="Avg Latency" 
                  value={metrics.averageLatency || 0}
                  valueStyle={{ color: '#13c2c2' }}
                  suffix="ms"
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card className="tranzor-card-elevated">
                <Statistic 
                  title="Success Rate" 
                  value={metrics.successRate || 0}
                  valueStyle={{ color: '#52c41a' }}
                  suffix="%"
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card className="tranzor-card-elevated">
                <Statistic 
                  title="Uptime" 
                  value={metrics.uptime || 0}
                  valueStyle={{ color: '#1890ff' }}
                  suffix="%"
                />
              </Card>
            </Col>
          </Row>
        )}

        {/* Transactions Table */}
        <Card 
          title={
            <span className="tranzor-gradient-text">
              Latest Transactions
            </span>
          } 
          className="tranzor-card-elevated"
          style={{ marginBottom: 24 }}
        >
          <DataTable
            data={transactions}
            columns={[
              { title: 'Transaction ID', dataIndex: 'transactionId', key: 'transactionId' },
              { title: 'Amount', dataIndex: 'amount', key: 'amount', render: (amount, record) => `${record.currency} ${amount}` },
              { title: 'Type', dataIndex: 'type', key: 'type' },
              { title: 'Status', dataIndex: 'status', key: 'status' },
              { title: 'Merchant', dataIndex: 'merchant', key: 'merchant' },
              { title: 'Date', dataIndex: 'timestamp', key: 'timestamp', render: (timestamp) => new Date(timestamp).toLocaleDateString() },
              {
                title: 'Actions',
                key: 'actions',
                render: (_, record) => (
                  <Button type="link" onClick={() => handleViewDetails(record)}>
                    View Details
                  </Button>
                ),
              },
            ]}
            loading={transactionsLoading}
            pagination={false}
          />
        </Card>
      </LoadingSpinner>

      {/* Transaction Details Modal */}
      <Modal
        title="Transaction Details"
        open={detailsVisible}
        onCancel={() => setDetailsVisible(false)}
        footer={null}
        width={600}
      >
        <LoadingSpinner spinning={detailsLoading}>
          {transactionDetails && (
            <div>
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Text strong>Transaction ID:</Text>
                  <br />
                  <Text>{transactionDetails.transactionId}</Text>
                </Col>
                <Col span={12}>
                  <Text strong>Amount:</Text>
                  <br />
                  <Text>{transactionDetails.currency} {transactionDetails.amount}</Text>
                </Col>
                <Col span={12}>
                  <Text strong>Type:</Text>
                  <br />
                  <Text>{transactionDetails.type}</Text>
                </Col>
                <Col span={12}>
                  <Text strong>Status:</Text>
                  <br />
                  <Text>{transactionDetails.status}</Text>
                </Col>
                <Col span={12}>
                  <Text strong>Merchant:</Text>
                  <br />
                  <Text>{transactionDetails.merchant}</Text>
                </Col>
                <Col span={12}>
                  <Text strong>Fraud Score:</Text>
                  <br />
                  <Text>{transactionDetails.fraudScore?.toFixed(2)}%</Text>
                </Col>
                <Col span={24}>
                  <Text strong>Description:</Text>
                  <br />
                  <Text>{transactionDetails.description}</Text>
                </Col>
              </Row>
            </div>
          )}
        </LoadingSpinner>
      </Modal>

      {/* Create Transaction Modal */}
      <Modal
        title="Create New Transaction"
        open={createModalVisible}
        onCancel={() => setCreateModalVisible(false)}
        footer={null}
        width={500}
      >
        <Form
          form={createForm}
          layout="vertical"
          onFinish={handleCreateTransaction}
        >
          <Form.Item
            name="amount"
            label="Amount"
            rules={[{ required: true, message: 'Please enter amount' }]}
          >
            <InputNumber
              style={{ width: '100%' }}
              min={0.01}
              step={0.01}
              placeholder="Enter amount"
            />
          </Form.Item>
          
          <Form.Item
            name="currency"
            label="Currency"
            rules={[{ required: true, message: 'Please select currency' }]}
          >
            <Select placeholder="Select currency">
              <Option value="USD">USD</Option>
              <Option value="EUR">EUR</Option>
              <Option value="GBP">GBP</Option>
              <Option value="CAD">CAD</Option>
            </Select>
          </Form.Item>
          
          <Form.Item
            name="type"
            label="Transaction Type"
            rules={[{ required: true, message: 'Please select type' }]}
          >
            <Select placeholder="Select type">
              <Option value="PAYMENT">Payment</Option>
              <Option value="TRANSFER">Transfer</Option>
              <Option value="WITHDRAWAL">Withdrawal</Option>
              <Option value="DEPOSIT">Deposit</Option>
            </Select>
          </Form.Item>
          
          <Form.Item
            name="merchant"
            label="Merchant"
            rules={[{ required: true, message: 'Please enter merchant' }]}
          >
            <Input placeholder="Enter merchant name" />
          </Form.Item>
          
          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: 'Please enter description' }]}
          >
            <Input.TextArea placeholder="Enter transaction description" />
          </Form.Item>
          
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={creatingTransaction} block>
              Create Transaction
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}