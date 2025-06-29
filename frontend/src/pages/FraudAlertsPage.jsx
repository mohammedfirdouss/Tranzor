import React, { useState } from 'react';
import { Card, Input, Button, Space, Tag } from 'antd';
import { AlertOutlined, SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import LoadingSpinner from '../components/common/LoadingSpinner';
import DataTable from '../components/common/DataTable';
import useTransactions from '../hooks/useTransactions';

export default function FraudAlertsPage() {
  const [accountId, setAccountId] = useState('');
  
  const { 
    transactions, 
    loading, 
    error, 
    refresh 
  } = useTransactions(accountId, { status: 'Declined' });

  const handleSearch = () => {
    if (!accountId.trim()) {
      return;
    }
    refresh();
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const fraudColumns = [
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
      render: (status) => (
        <Tag color="red" icon={<AlertOutlined />}>
          {status}
        </Tag>
      ),
    },
    {
      title: 'Timestamp',
      dataIndex: 'receivedTimestamp',
      key: 'receivedTimestamp',
      width: 180,
      render: (timestamp) => {
        if (!timestamp) return '-';
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
    {
      title: 'Reason',
      dataIndex: 'statusReason',
      key: 'statusReason',
      width: 200,
      render: (reason) => reason || 'Fraud Detected',
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 24, display: 'flex', alignItems: 'center', gap: 16 }}>
        <AlertOutlined style={{ fontSize: 24, color: '#ff4d4f' }} />
        <h2 style={{ margin: 0 }}>Fraud Alerts</h2>
        <Tag color="red" style={{ marginLeft: 'auto' }}>
          {transactions.length} Alert{transactions.length !== 1 ? 's' : ''}
        </Tag>
      </div>

      <Card title="Search Fraud Alerts">
        <Space style={{ marginBottom: 16 }}>
          <Input
            placeholder="Enter Account ID to search fraud alerts"
            value={accountId}
            onChange={(e) => setAccountId(e.target.value)}
            onKeyPress={handleKeyPress}
            style={{ width: 300 }}
            aria-label="Account ID"
          />
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
        </Space>

        {error && (
          <div style={{ 
            marginBottom: 16, 
            padding: 16, 
            background: '#fff2f0', 
            border: '1px solid #ffccc7',
            borderRadius: 6,
            color: '#a8071a'
          }}>
            Error: {error}
          </div>
        )}

        <LoadingSpinner spinning={loading}>
          <DataTable
            data={transactions}
            columns={fraudColumns}
            loading={loading}
            emptyText={
              !accountId 
                ? "Enter an Account ID above to search for fraud alerts" 
                : "No fraud alerts found for this account"
            }
          />
        </LoadingSpinner>
      </Card>
    </div>
  );
}