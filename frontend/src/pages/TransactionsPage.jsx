import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Table, 
  Button, 
  Input, 
  Select, 
  DatePicker, 
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
  Statistic
} from 'antd';
import { 
  SearchOutlined, 
  FilterOutlined, 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  EyeOutlined,
  ReloadOutlined
} from '@ant-design/icons';
import { 
  useGetLatestTransactionsQuery, 
  useUpdateTransactionMutation,
  useCreateTransactionMutation
} from '../store/api/mockApi';
import LoadingSpinner from '../components/common/LoadingSpinner';

const { Title, Text } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

export default function TransactionsPage() {
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [dateRange, setDateRange] = useState(null);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
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
    data: transactionsData, 
    isLoading, 
    error, 
    refetch 
  } = useGetLatestTransactionsQuery({ limit: 100 });

  const [updateTransaction, { isLoading: updating }] = useUpdateTransactionMutation();
  const [createTransaction, { isLoading: creating }] = useCreateTransactionMutation();

  const transactions = transactionsData?.transactions || [];

  // Filter and search transactions
  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = !searchText || 
      transaction.transactionId.toLowerCase().includes(searchText.toLowerCase()) ||
      transaction.merchant.toLowerCase().includes(searchText.toLowerCase()) ||
      transaction.description.toLowerCase().includes(searchText.toLowerCase());
    
    const matchesStatus = !statusFilter || transaction.status === statusFilter;
    const matchesType = !typeFilter || transaction.type === typeFilter;
    
    const matchesDate = !dateRange || !dateRange[0] || !dateRange[1] || 
      (new Date(transaction.timestamp) >= dateRange[0].startOf('day') &&
       new Date(transaction.timestamp) <= dateRange[1].endOf('day'));
    
    return matchesSearch && matchesStatus && matchesType && matchesDate;
  });

  // Update pagination when data changes
  useEffect(() => {
    setPagination(prev => ({
      ...prev,
      total: filteredTransactions.length,
    }));
  }, [filteredTransactions.length]);

  const handleView = (record) => {
    setSelectedTransaction(record);
    setViewModalVisible(true);
  };

  const handleEdit = (record) => {
    setSelectedTransaction(record);
    editForm.setFieldsValue({
      status: record.status,
      description: record.description,
      merchant: record.merchant,
    });
    setEditModalVisible(true);
  };

  const handleUpdate = async (values) => {
    try {
      await updateTransaction({
        transactionId: selectedTransaction.transactionId,
        updates: values
      }).unwrap();
      
      message.success('Transaction updated successfully!');
      setEditModalVisible(false);
      refetch();
    } catch (error) {
      message.error('Failed to update transaction');
    }
  };

  const handleCreate = async (values) => {
    try {
      await createTransaction({
        accountId: 'ACC000001', // Default account for demo
        amount: values.amount,
        currency: values.currency,
        type: values.type,
        merchant: values.merchant,
        description: values.description
      }).unwrap();
      
      message.success('Transaction created successfully!');
      setCreateModalVisible(false);
      createForm.resetFields();
      refetch();
    } catch (error) {
      message.error('Failed to create transaction');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Approved': return 'success';
      case 'Declined': return 'error';
      case 'Pending': return 'warning';
      case 'Failed': return 'default';
      default: return 'default';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'PAYMENT': return 'blue';
      case 'TRANSFER': return 'green';
      case 'WITHDRAWAL': return 'orange';
      case 'DEPOSIT': return 'purple';
      case 'REFUND': return 'cyan';
      default: return 'default';
    }
  };

  const columns = [
    {
      title: 'Transaction ID',
      dataIndex: 'transactionId',
      key: 'transactionId',
      width: 150,
      render: (text) => <Text code>{text}</Text>,
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      width: 120,
      render: (amount, record) => (
        <Text strong>
          {record.currency} {parseFloat(amount).toFixed(2)}
        </Text>
      ),
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      width: 120,
      render: (type) => (
        <Tag color={getTypeColor(type)}>
          {type}
        </Tag>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status) => (
        <Badge 
          status={getStatusColor(status)} 
          text={status}
        />
      ),
    },
    {
      title: 'Merchant',
      dataIndex: 'merchant',
      key: 'merchant',
      width: 150,
      ellipsis: true,
    },
    {
      title: 'Date',
      dataIndex: 'timestamp',
      key: 'timestamp',
      width: 120,
      render: (timestamp) => new Date(timestamp).toLocaleDateString(),
    },
    {
      title: 'Fraud Score',
      dataIndex: 'fraudScore',
      key: 'fraudScore',
      width: 100,
      render: (score) => (
        <Text type={score > 70 ? 'danger' : score > 30 ? 'warning' : 'success'}>
          {score?.toFixed(1)}%
        </Text>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 150,
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
          <Tooltip title="Edit Transaction">
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
    total: filteredTransactions.length,
    approved: filteredTransactions.filter(t => t.status === 'Approved').length,
    declined: filteredTransactions.filter(t => t.status === 'Declined').length,
    pending: filteredTransactions.filter(t => t.status === 'Pending').length,
    totalAmount: filteredTransactions.reduce((sum, t) => sum + parseFloat(t.amount), 0),
  };

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <Title level={2}>Transactions</Title>
        <Text type="secondary">
          Manage and monitor all transaction activities
        </Text>
      </div>

      {/* Statistics Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic 
              title="Total Transactions" 
              value={stats.total}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic 
              title="Total Amount" 
              value={stats.totalAmount}
              valueStyle={{ color: '#52c41a' }}
              precision={2}
              prefix="$"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic 
              title="Approved" 
              value={stats.approved}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic 
              title="Pending" 
              value={stats.pending}
              valueStyle={{ color: '#fa8c16' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Filters and Search */}
      <Card style={{ marginBottom: 24 }}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={8} md={6}>
            <Input
              placeholder="Search transactions..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              allowClear
            />
          </Col>
          <Col xs={24} sm={8} md={4}>
            <Select
              placeholder="Status"
              value={statusFilter}
              onChange={setStatusFilter}
              allowClear
              style={{ width: '100%' }}
            >
              <Option value="Approved">Approved</Option>
              <Option value="Declined">Declined</Option>
              <Option value="Pending">Pending</Option>
              <Option value="Failed">Failed</Option>
            </Select>
          </Col>
          <Col xs={24} sm={8} md={4}>
            <Select
              placeholder="Type"
              value={typeFilter}
              onChange={setTypeFilter}
              allowClear
              style={{ width: '100%' }}
            >
              <Option value="PAYMENT">Payment</Option>
              <Option value="TRANSFER">Transfer</Option>
              <Option value="WITHDRAWAL">Withdrawal</Option>
              <Option value="DEPOSIT">Deposit</Option>
              <Option value="REFUND">Refund</Option>
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
                New Transaction
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Transactions Table */}
      <Card>
        <LoadingSpinner spinning={isLoading}>
          <Table
            columns={columns}
            dataSource={filteredTransactions}
            rowKey="transactionId"
            pagination={{
              ...pagination,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) => 
                `${range[0]}-${range[1]} of ${total} transactions`,
            }}
            onChange={(pagination) => setPagination(pagination)}
            scroll={{ x: 1200 }}
          />
        </LoadingSpinner>
      </Card>

      {/* View Transaction Modal */}
      <Modal
        title="Transaction Details"
        open={viewModalVisible}
        onCancel={() => setViewModalVisible(false)}
        footer={null}
        width={600}
      >
        {selectedTransaction && (
          <div>
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Text strong>Transaction ID:</Text>
                <br />
                <Text code>{selectedTransaction.transactionId}</Text>
              </Col>
              <Col span={12}>
                <Text strong>Amount:</Text>
                <br />
                <Text strong>{selectedTransaction.currency} {selectedTransaction.amount}</Text>
              </Col>
              <Col span={12}>
                <Text strong>Type:</Text>
                <br />
                <Tag color={getTypeColor(selectedTransaction.type)}>
                  {selectedTransaction.type}
                </Tag>
              </Col>
              <Col span={12}>
                <Text strong>Status:</Text>
                <br />
                <Badge 
                  status={getStatusColor(selectedTransaction.status)} 
                  text={selectedTransaction.status}
                />
              </Col>
              <Col span={12}>
                <Text strong>Merchant:</Text>
                <br />
                <Text>{selectedTransaction.merchant}</Text>
              </Col>
              <Col span={12}>
                <Text strong>Fraud Score:</Text>
                <br />
                <Text type={selectedTransaction.fraudScore > 70 ? 'danger' : selectedTransaction.fraudScore > 30 ? 'warning' : 'success'}>
                  {selectedTransaction.fraudScore?.toFixed(2)}%
                </Text>
              </Col>
              <Col span={24}>
                <Text strong>Description:</Text>
                <br />
                <Text>{selectedTransaction.description}</Text>
              </Col>
              <Col span={24}>
                <Text strong>Date:</Text>
                <br />
                <Text>{new Date(selectedTransaction.timestamp).toLocaleString()}</Text>
              </Col>
            </Row>
          </div>
        )}
      </Modal>

      {/* Edit Transaction Modal */}
      <Modal
        title="Edit Transaction"
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
              <Option value="Approved">Approved</Option>
              <Option value="Declined">Declined</Option>
              <Option value="Pending">Pending</Option>
              <Option value="Failed">Failed</Option>
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
            <Button type="primary" htmlType="submit" loading={updating} block>
              Update Transaction
            </Button>
          </Form.Item>
        </Form>
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
          onFinish={handleCreate}
        >
          <Form.Item
            name="amount"
            label="Amount"
            rules={[{ required: true, message: 'Please enter amount' }]}
          >
            <Input 
              type="number"
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
            <Button type="primary" htmlType="submit" loading={creating} block>
              Create Transaction
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}