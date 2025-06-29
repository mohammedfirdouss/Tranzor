import React, { useState } from 'react';
import { Card, Statistic, Row, Col, Input, Button, Modal, Badge, Tooltip } from 'antd';
import { DashboardOutlined, ReloadOutlined, WifiOutlined, WifiOutlined as WifiOffOutlined } from '@ant-design/icons';
import LoadingSpinner from '../components/common/LoadingSpinner';
import DataTable from '../components/common/DataTable';
import useRealtimeTransactions from '../hooks/useRealTimeTransactions';

export default function DashboardPage() {
  const [accountId, setAccountId] = useState('');
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [detailsVisible, setDetailsVisible] = useState(false);
  
  const { 
    transactions, 
    loading, 
    error, 
    wsConnected,
    getTransactionDetails, 
    refresh 
  } = useRealtimeTransactions(accountId);

  const stats = {
    total: transactions.length,
    approved: transactions.filter(t => t.status === 'Approved').length,
    declined: transactions.filter(t => t.status === 'Declined').length,
    pending: transactions.filter(t => t.status === 'Pending').length,
  };

  const handleViewDetails = async (transaction) => {
    try {
      const details = await getTransactionDetails(transaction.transactionId);
      setSelectedTransaction(details);
      setDetailsVisible(true);
    } catch (error) {
      console.error('Failed to fetch transaction details:', error);
    }
  };

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

  return (
    <div>
      <div style={{ marginBottom: 24, display: 'flex', alignItems: 'center', gap: 16 }}>
        <DashboardOutlined style={{ fontSize: 24, color: '#1890ff' }} />
        <h2 style={{ margin: 0 }}>Dashboard</h2>
        <Tooltip title={wsConnected ? 'Real-time updates connected' : 'Real-time updates disconnected'}>
          <Badge 
            status={wsConnected ? 'success' : 'error'} 
            text={
              <span style={{ fontSize: '12px', color: wsConnected ? '#52c41a' : '#ff4d4f' }}>
                {wsConnected ? 'Live' : 'Offline'}
              </span>
            }
          />
        </Tooltip>
      </div>

      <div style={{ marginBottom: 24, display: 'flex', gap: 16, alignItems: 'center' }}>
        <Input
          placeholder="Enter Account ID to load dashboard data"
          value={accountId}
          onChange={(e) => setAccountId(e.target.value)}
          onKeyPress={handleKeyPress}
          style={{ width: 300 }}
          aria-label="Account ID input"
        />
        <Button 
          type="primary" 
          onClick={handleSearch}
          loading={loading}
          disabled={!accountId.trim()}
        >
          Load Dashboard
        </Button>
        <Button 
          icon={<ReloadOutlined />}
          onClick={refresh}
          disabled={!accountId || loading}
          title="Refresh data"
        >
          Refresh
        </Button>
      </div>

      {error && (
        <div style={{ 
          marginBottom: 24, 
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
                title="Approved" 
                value={stats.approved} 
                valueStyle={{ color: '#52c41a' }} 
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic 
                title="Declined" 
                value={stats.declined} 
                valueStyle={{ color: '#ff4d4f' }} 
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

        <Card 
          title={
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              Recent Transactions
              {wsConnected && (
                <Tooltip title="Real-time updates active">
                  <WifiOutlined style={{ color: '#52c41a', fontSize: '14px' }} />
                </Tooltip>
              )}
            </div>
          } 
          style={{ marginTop: 24 }}
        >
          <DataTable
            data={transactions.slice(0, 10)}
            loading={loading}
            onViewDetails={handleViewDetails}
            emptyText={
              !accountId 
                ? "Enter an Account ID above to view transactions" 
                : "No transactions found for this account"
            }
          />
        </Card>
      </LoadingSpinner>

      <Modal
        title={`Transaction Details`}
        open={detailsVisible}
        onCancel={() => setDetailsVisible(false)}
        footer={[
          <Button key="close" onClick={() => setDetailsVisible(false)}>
            Close
          </Button>
        ]}
        width={800}
      >
        {selectedTransaction && (
          <div>
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <strong>Transaction ID:</strong><br />
                {selectedTransaction.transactionId}
              </Col>
              <Col span={12}>
                <strong>Status:</strong><br />
                {selectedTransaction.status}
              </Col>
              <Col span={12}>
                <strong>Amount:</strong><br />
                {selectedTransaction.amount?.value} {selectedTransaction.amount?.currency}
              </Col>
              <Col span={12}>
                <strong>Type:</strong><br />
                {selectedTransaction.transactionType}
              </Col>
              <Col span={12}>
                <strong>Sender:</strong><br />
                {selectedTransaction.senderAccountId}
              </Col>
              <Col span={12}>
                <strong>Receiver:</strong><br />
                {selectedTransaction.receiverAccountId}
              </Col>
              <Col span={24}>
                <strong>Timestamp:</strong><br />
                {new Date(selectedTransaction.receivedTimestamp).toLocaleString()}
              </Col>
              {selectedTransaction.metadata && (
                <Col span={24}>
                  <strong>Metadata:</strong>
                  <pre style={{ 
                    background: '#f5f5f5', 
                    padding: 12, 
                    borderRadius: 4,
                    marginTop: 8,
                    fontSize: '12px',
                    overflow: 'auto'
                  }}>
                    {JSON.stringify(selectedTransaction.metadata, null, 2)}
                  </pre>
                </Col>
              )}
            </Row>
          </div>
        )}
      </Modal>
    </div>
  );
}