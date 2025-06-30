import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Select, DatePicker, Input, Button, Tag, Space, Alert } from 'antd';
import { SearchOutlined, ReloadOutlined, FilterOutlined } from '@ant-design/icons';
import { useTransactionsQuery } from '../store/api/transactionsApi';
import { useRealtimeTransactions } from '../hooks/useRealtimeTransactions';
import VirtualizedTable from '../components/common/VirtualizedTable';

const { RangePicker } = DatePicker;
const { Option } = Select;

export default function TransactionsPage() {
  const [filters, setFilters] = useState({
    status: '',
    search: '',
    dateRange: null,
  });

  // Fetch historical transactions
  const { data: transactions = [], isLoading, error, refetch } = useTransactionsQuery();

  // Real-time transaction feed
  const { transactions: realtimeTransactions, isConnected, connectionStatus } = useRealtimeTransactions();

  // Combine historical and real-time data
  const allTransactions = [...realtimeTransactions, ...transactions];

  // Filter transactions
  const filteredTransactions = allTransactions.filter(transaction => {
    if (filters.status && transaction.status !== filters.status) return false;
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      return (
        transaction.id?.toLowerCase().includes(searchLower) ||
        transaction.customerId?.toLowerCase().includes(searchLower) ||
        transaction.amount?.toString().includes(searchLower)
      );
    }
    if (filters.dateRange) {
      const [start, end] = filters.dateRange;
      const transactionDate = new Date(transaction.timestamp);
      return transactionDate >= start && transactionDate <= end;
    }
    return true;
  });

  const columns = [
    {
      title: 'Transaction ID',
      dataIndex: 'id',
      key: 'id',
      width: 200,
      render: (id) => <code>{id}</code>,
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      width: 120,
      render: (amount, record) => (
        <span style={{ fontWeight: 'bold', color: amount > 1000 ? '#cf1322' : '#3f8600' }}>
          ${amount?.toFixed(2)}
        </span>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status) => {
        const statusConfig = {
          'SUCCESS': { color: 'green', text: 'Success' },
          'FAILED': { color: 'red', text: 'Failed' },
          'PENDING': { color: 'orange', text: 'Pending' },
          'SUSPECTED_FRAUD': { color: 'volcano', text: 'Fraud' },
        };
        const config = statusConfig[status] || { color: 'default', text: status };
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
    {
      title: 'Customer ID',
      dataIndex: 'customerId',
      key: 'customerId',
      width: 150,
      render: (customerId) => <code>{customerId}</code>,
    },
    {
      title: 'Risk Score',
      dataIndex: 'riskScore',
      key: 'riskScore',
      width: 100,
      render: (score) => {
        if (!score) return '-';
        const color = score > 80 ? 'red' : score > 50 ? 'orange' : 'green';
        return <Tag color={color}>{score}</Tag>;
      },
    },
    {
      title: 'Timestamp',
      dataIndex: 'timestamp',
      key: 'timestamp',
      width: 180,
      render: (timestamp) => new Date(timestamp).toLocaleString(),
    },
  ];

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      status: '',
      search: '',
      dateRange: null,
    });
  };

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1>Transactions</h1>
        <p>Monitor and manage transaction processing in real-time</p>
      </div>

      {/* Connection Status */}
      {!isConnected && (
        <Alert
          message="WebSocket Disconnected"
          description={`Connection status: ${connectionStatus}. Real-time updates may not be available.`}
          type="warning"
          showIcon
          style={{ marginBottom: 16 }}
        />
      )}

      {/* Statistics Cards */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="Total Transactions"
              value={allTransactions.length}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Success Rate"
              value={allTransactions.filter(t => t.status === 'SUCCESS').length}
              suffix={`/ ${allTransactions.length}`}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Failed Transactions"
              value={allTransactions.filter(t => t.status === 'FAILED').length}
              valueStyle={{ color: '#cf1322' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Fraud Alerts"
              value={allTransactions.filter(t => t.status === 'SUSPECTED_FRAUD').length}
              valueStyle={{ color: '#fa8c16' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Filters */}
      <Card style={{ marginBottom: 16 }}>
        <Space wrap style={{ width: '100%', justifyContent: 'space-between' }}>
          <Space wrap>
            <Input
              placeholder="Search transactions..."
              prefix={<SearchOutlined />}
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              style={{ width: 250 }}
            />
            <Select
              placeholder="Filter by status"
              value={filters.status}
              onChange={(value) => handleFilterChange('status', value)}
              style={{ width: 150 }}
              allowClear
            >
              <Option value="SUCCESS">Success</Option>
              <Option value="FAILED">Failed</Option>
              <Option value="PENDING">Pending</Option>
              <Option value="SUSPECTED_FRAUD">Fraud</Option>
            </Select>
            <RangePicker
              value={filters.dateRange}
              onChange={(dates) => handleFilterChange('dateRange', dates)}
              placeholder={['Start Date', 'End Date']}
            />
          </Space>
          <Space>
            <Button icon={<FilterOutlined />} onClick={clearFilters}>
              Clear Filters
            </Button>
            <Button icon={<ReloadOutlined />} onClick={refetch} loading={isLoading}>
              Refresh
            </Button>
          </Space>
        </Space>
      </Card>

      {/* Transactions Table */}
      <Card>
        <VirtualizedTable
          data={filteredTransactions}
          columns={columns}
          loading={isLoading}
          rowKey="id"
          containerHeight={600}
          rowHeight={54}
          pagination={false}
          onRow={(record) => ({
            onClick: () => {
              // TODO: Open transaction details modal
              console.log('Transaction clicked:', record);
            },
            style: { cursor: 'pointer' },
          })}
        />
      </Card>

      {error && (
        <Alert
          message="Error Loading Transactions"
          description={error.message}
          type="error"
          showIcon
          style={{ marginTop: 16 }}
        />
      )}
    </div>
  );
}