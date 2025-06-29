import React, { useState } from 'react';
import { Card, Input, Button, Space, Select, DatePicker, Divider, message } from 'antd';
import { TableOutlined, PlusOutlined, SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import LoadingSpinner from '../components/common/LoadingSpinner';
import DataTable from '../components/common/DataTable';
import TransactionForm from '../components/forms/TransactionForm';
import useTransactions from '../hooks/useTransactions';

const { Option } = Select;
const { RangePicker } = DatePicker;

export default function TransactionsPage() {
  const [accountId, setAccountId] = useState('');
  const [filters, setFilters] = useState({ 
    status: '', 
    type: '', 
    startDate: '', 
    endDate: '' 
  });
  const [showCreateForm, setShowCreateForm] = useState(false);

  const { 
    transactions, 
    loading, 
    error, 
    pagination,
    createTransaction,
    nextPage,
    refresh 
  } = useTransactions(accountId, filters);

  const handleSearch = () => {
    if (!accountId.trim()) {
      message.warning('Please enter an Account ID to search transactions');
      return;
    }
    refresh();
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleDateRangeChange = (dates, dateStrings) => {
    setFilters(prev => ({
      ...prev,
      startDate: dateStrings[0],
      endDate: dateStrings[1]
    }));
  };

  const handleCreateTransaction = async (transactionData) => {
    try {
      await createTransaction(transactionData);
      setShowCreateForm(false);
      message.success('Transaction created successfully!');
    } catch (error) {
      message.error('Failed to create transaction');
      throw error;
    }
  };

  const clearFilters = () => {
    setFilters({ status: '', type: '', startDate: '', endDate: '' });
  };

  return (
    <div>
      <div style={{ marginBottom: 24, display: 'flex', alignItems: 'center', gap: 16 }}>
        <TableOutlined style={{ fontSize: 24, color: '#1890ff' }} />
        <h2 style={{ margin: 0 }}>Transactions</h2>
        <Button 
          type="primary" 
          icon={<PlusOutlined />}
          onClick={() => setShowCreateForm(!showCreateForm)}
        >
          {showCreateForm ? 'Cancel' : 'Create Transaction'}
        </Button>
      </div>

      {showCreateForm && (
        <Card title="Create New Transaction" style={{ marginBottom: 24 }}>
          <TransactionForm
            onSubmit={handleCreateTransaction}
            loading={loading}
            onCancel={() => setShowCreateForm(false)}
          />
        </Card>
      )}

      <Card title="Search & Filter Transactions">
        <Space direction="vertical" style={{ width: '100%' }} size="middle">
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center' }}>
            <Input
              placeholder="Account ID (required)"
              value={accountId}
              onChange={(e) => setAccountId(e.target.value)}
              style={{ width: 200 }}
              aria-label="Account ID"
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
            <RangePicker
              onChange={handleDateRangeChange}
              style={{ width: 240 }}
            />
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

      <Card title="Transaction Results" style={{ marginTop: 24 }}>
        <LoadingSpinner spinning={loading}>
          <DataTable
            data={transactions}
            loading={loading}
            onNextPage={nextPage}
            hasMore={pagination.hasMore}
            emptyText={
              !accountId 
                ? "Enter an Account ID above to search transactions" 
                : "No transactions found matching your criteria"
            }
          />
        </LoadingSpinner>
      </Card>
    </div>
  );
}