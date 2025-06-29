import React, { useState } from 'react';
import { Card, Statistic, Row, Col, Input, Button, Modal, Badge, Tooltip } from 'antd';
import { DashboardOutlined, ReloadOutlined, WifiOutlined } from '@ant-design/icons';
import LoadingSpinner from '../components/common/LoadingSpinner';
import DataTable from '../components/common/DataTable';
import { useGetLatestTransactionsQuery, useGetTransactionQuery, useGetRealtimeMetricsQuery } from '../store/api/transactionsApi';

export default function DashboardPage() {
  const [accountId, setAccountId] = useState('');
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [detailsVisible, setDetailsVisible] = useState(false);
  
  // RTK Query hooks
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

  const error = transactionsError || metricsError;

  return (
    <div>
      <div style={{ marginBottom: 24, display: 'flex', alignItems: 'center', gap: 16 }}>
        <DashboardOutlined style={{ fontSize: 24, color: '#1890ff' }} />
        <h2 style={{ margin: 0 }}>Dashboard</h2>
        <Tooltip title="Real-time metrics connected">
          <Badge 
            status="success" 
            text={
              <span style={{ fontSize: '12px', color: '#52c41a' }}>
                Live
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
          loading={transactionsLoading}
          disabled={!accountId.trim()}
        >
          Load Dashboard
        </Button>
        <Button 
          icon={<ReloadOutlined />}
          onClick={refetchTransactions}
          disabled={!accountId || transactionsLoading}
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
          Error: {error.message || 'Failed to load dashboard data'}
        </div>
      )}

      <LoadingSpinner spinning={transactionsLoading || metricsLoading}>
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

        {/* Real-time System Metrics */}
        {metrics && (
          <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic 
                  title="Current TPS" 
                  value={metrics.currentTps || 0}
                  valueStyle={{ color: '#722ed1' }}
                  suffix="tx/s"
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic 
                  title="Avg Latency" 
                  value={metrics.averageLatency || 0}
                  valueStyle={{ color: '#13c2c2' }}
                  suffix="ms"
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic 
                  title="Success Rate" 
                  value={metrics.successRate || 0}
                  valueStyle={{ color: '#52c41a' }}
                  suffix="%"
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic 
                  title="Active Alerts" 
                  value={metrics.activeAlerts || 0}
                  valueStyle={{ color: '#ff4d4f' }}
                />
              </Card>
            </Col>
          </Row>
        )}

        <Card 
          title={
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              Recent Transactions
              <Tooltip title="Real-time updates active">
                <WifiOutlined style={{ color: '#52c41a', fontSize: '14px' }} />
              </Tooltip>
            </div>
          } 
          style={{ marginTop: 24 }}
        >
          <DataTable
            data={transactions}
            loading={transactionsLoading}
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
        {detailsLoading ? (
          <LoadingSpinner spinning={true} />
        ) : transactionDetails ? (
          <div>
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <strong>Transaction ID:</strong><br />
                {transactionDetails.transactionId}
              </Col>
              <Col span={12}>
                <strong>Status:</strong><br />
                {transactionDetails.status}
              </Col>
              <Col span={12}>
                <strong>Amount:</strong><br />
                {transactionDetails.amount?.value} {transactionDetails.amount?.currency}
              </Col>
              <Col span={12}>
                <strong>Type:</strong><br />
                {transactionDetails.transactionType}
              </Col>
              <Col span={12}>
                <strong>Sender:</strong><br />
                {transactionDetails.senderAccountId}
              </Col>
              <Col span={12}>
                <strong>Receiver:</strong><br />
                {transactionDetails.receiverAccountId}
              </Col>
              <Col span={24}>
                <strong>Timestamp:</strong><br />
                {new Date(transactionDetails.receivedTimestamp).toLocaleString()}
              </Col>
              {transactionDetails.metadata && (
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
                    {JSON.stringify(transactionDetails.metadata, null, 2)}
                  </pre>
                </Col>
              )}
            </Row>
          </div>
        ) : (
          <div>No transaction details available</div>
        )}
      </Modal>
    </div>
  );
}