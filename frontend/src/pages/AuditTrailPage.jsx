import React, { useState } from 'react';
import { Card, Input, Button, Space, DatePicker, Select } from 'antd';
import { FileSearchOutlined, SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import LoadingSpinner from '../components/common/LoadingSpinner';
import DataTable from '../components/common/DataTable';
import useTransactions from '../hooks/useTransactions';

const { RangePicker } = DatePicker;
const { Option } = Select;

export default function AuditTrailPage() {
  const [accountId, setAccountId] = useState('');
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    status: '',
    type: ''
  });

  const { 
    transactions, 
    loading, 
    error, 
    pagination,
    nextPage,
    refresh 
  } = useTransactions(accountId, filters);

  const handleSearch = () => {
    if (!accountId.trim()) {
      return;
    }
    refresh();
  };

  const handleDateRangeChange = (dates, dateStrings) => {
    setFilters(prev => ({
      ...prev,
      startDate: dateStrings[0],
      endDate: dateStrings[1]
    }));
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({ startDate: '', endDate: '', status: '', type: '' });
  };

  const auditColumns = [
    {
      title: 'Transaction ID',
      dataIndex: 'transactionId',
      key: 'transactionId',
      width: 200,
      ellipsis: true,
    },
    {
      title: 'Type',
      dataIndex: 'transactionType',
      key: 'transactionType',
      width: 120,
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      width: 150,
      render: (amount) => {
        if (!amount || typeof amount !== 'object') return '-';
        return `${amount.value} ${amount.currency}`;
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 100,
    },
    {
      title: 'Received',
      dataIndex: 'receivedTimestamp',
      key: 'receivedTimestamp',
      width: 160,
      render: (timestamp) => {
        if (!timestamp) return '-';
        return new Date(timestamp).toLocaleString();
      },
    },
    {
      title: 'Processed',
      dataIndex: 'processedTimestamp',
      key: 'processedTimestamp',
      width: 160,
      render: (timestamp) => {
        if (!timestamp) return 'Not processed';
        return new Date(timestamp).toLocaleString();
      },
    },
    {
      title: 'Sender',
      dataIndex: 'senderAccountId',
      key: 'senderAccountId',
      width: 150,
      ellipsis: true,
    },
    {
      title: 'Receiver',
      dataIndex: 'receiverAccountId',
      key: 'receiverAccountId',
      width: 150,
      ellipsis: true,
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 24, display: 'flex', alignItems: 'center', gap: 16 }}>
        <FileSearchOutlined style={{ fontSize: 24, color: '#1890ff' }} />
        <h2 style={{ margin: 0 }}>Audit Trail</h2>
      </div>

      <Card title="Search Audit Trail">
        <Space direction="vertical" style={{ width: '100%' }} size="middle">
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center' }}>
            <Input
              placeholder="Account ID (required)"
              value={accountId}
              onChange={(e) => setAccountId(e.target.value)}
              style={{ width: 200 }}
              aria-label="Account ID"
            />
            <RangePicker
              onChange={handleDateRangeChange}
              style={{ width: 240 }}
              placeholder={['Start Date', 'End Date']}
            />
            <Select
              placeholder="Status"
              value={filters.status}
              onChange={(value) => handleFilterChange('status', value)}
              style={{ width: 120 }}
              allowClear
            >
              <Option value="Pending">Pending</Option>
              <Option value="Approved">Approved</Option>
              <Option value="Declined">Declined</Option>
            </Select>
            <Select
              placeholder="Type"
              value={filters.type}
              onChange={(value) => handleFilterChange('type', value)}
              style={{ width: 140 }}
              allowClear
            >
              <Option value="transfer">Transfer</Option>
              <Option value="payment">Payment</Option>
              <Option value="deposit">Deposit</Option>
              <Option value="withdrawal">Withdrawal</Option>
              <Option value="refund">Refund</Option>
            </Select>
          </div>
          
          <div style={{ display: 'flex', gap: 8 }}>
            <Button 
              type="primary" 
              icon={<SearchOutlined />}
              onClick={handleSearch}
              loading={loading}
              disabled={!accountId.trim()}
            >
              Search
            </Button>
            <Button 
              icon={<ReloadOutlined />}
              onClick={refresh}
              disabled={!accountId || loading}
            >
              Refresh
            </Button>
            <Button onClick={clearFilters}>
              Clear Filters
            </Button>
          </div>
        </Space>
      </Card>

      {error && (
        <div style={{ 
          margin: '16px 0', 
          padding: 16, 
          background: '#fff2f0', 
          border: '1px solid #ffccc7',
          borderRadius: 6,
          color: '#a8071a'
        }}>
          Error: {error}
        </div>
      )}

      <Card title="Audit Results" style={{ marginTop: 24 }}>
        <LoadingSpinner spinning={loading}>
          <DataTable
            data={transactions}
            columns={auditColumns}
            loading={loading}
            onNextPage={nextPage}
            hasMore={pagination.hasMore}
            emptyText={
              !accountId 
                ? "Enter an Account ID above to view audit trail" 
                : "No audit records found matching your criteria"
            }
          />
        </LoadingSpinner>
      </Card>
    </div>
  );
}