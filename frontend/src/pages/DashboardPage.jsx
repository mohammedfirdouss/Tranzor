import { useState } from 'react';
import { Card, Statistic, Row, Col, Input, Button, Table, message } from 'antd';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function DashboardPage() {
  const [accountId, setAccountId] = useState('');
  const [stats, setStats] = useState({ total: 0, approved: 0, declined: 0 });
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(false);
  // Add: View transaction details
  const [selectedTxn, setSelectedTxn] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);

  const fetchStats = async () => {
    if (!accountId) {
      message.info('Please enter an account ID.');
      return;
    }
    setLoading(true);
    try {
      const url = `${API_BASE_URL}/accounts/${accountId}/transactions?limit=100`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to fetch');
      const json = await res.json();
      const txns = json.transactions || [];
      setStats({
        total: txns.length,
        approved: txns.filter(t => t.status === 'Approved').length,
        declined: txns.filter(t => t.status === 'Declined').length,
      });
      setRecent(txns.slice(0, 5));
    } catch (err) {
      message.error('Error fetching dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const fetchTransactionDetails = async (transactionId) => {
    setDetailsLoading(true);
    try {
      // You need accountId for the composite key
      const url = `${API_BASE_URL}/${transactionId}?accountId=${accountId}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to fetch details');
      const json = await res.json();
      setSelectedTxn(json);
    } catch (err) {
      message.error('Error fetching transaction details');
    } finally {
      setDetailsLoading(false);
    }
  };

  return (
    <div>
      <h2>Dashboard</h2>
      <Input.Search
        placeholder="Account ID"
        enterButton="Load"
        value={accountId}
        onChange={e => setAccountId(e.target.value)}
        onSearch={fetchStats}
        style={{ width: 300, marginBottom: 24 }}
        loading={loading}
      />
      <Button onClick={fetchStats} loading={loading} style={{ marginBottom: 24, marginLeft: 16 }}>
        Refresh
      </Button>
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={8}>
          <Card loading={loading}>
            <Statistic title="Total Transactions" value={stats.total} />
          </Card>
        </Col>
        <Col span={8}>
          <Card loading={loading}>
            <Statistic title="Approved" value={stats.approved} valueStyle={{ color: 'green' }} />
          </Card>
        </Col>
        <Col span={8}>
          <Card loading={loading}>
            <Statistic title="Declined" value={stats.declined} valueStyle={{ color: 'red' }} />
          </Card>
        </Col>
      </Row>
      <h3>Recent Transactions</h3>
      {recent.length === 0 && !loading && (
        <div style={{ marginBottom: 16, color: '#888' }}>No transactions found for this account.</div>
      )}
      <Table
        columns={[
          { title: 'ID', dataIndex: 'transactionId', key: 'id' },
          { title: 'Type', dataIndex: 'transactionType', key: 'type' },
          { title: 'Amount', dataIndex: 'amount', key: 'amount', render: (a) => a && typeof a === 'object' ? `${a.value} ${a.currency}` : '' },
          { title: 'Status', dataIndex: 'status', key: 'status' },
          { title: 'Timestamp', dataIndex: 'receivedTimestamp', key: 'timestamp' },
          { title: 'Action', key: 'action', render: (_, record) => (
            <Button size="small" onClick={() => fetchTransactionDetails(record.transactionId)} loading={detailsLoading && selectedTxn?.transactionId === record.transactionId}>
              View Details
            </Button>
          ) },
        ]}
        dataSource={recent}
        rowKey="transactionId"
        pagination={false}
        loading={loading}
        locale={{ emptyText: loading ? 'Loading...' : 'No transactions found' }}
      />
      {selectedTxn && (
        <Card style={{ marginTop: 24 }} title={`Transaction Details: ${selectedTxn.transactionId}`} onClose={() => setSelectedTxn(null)}>
          <pre>{JSON.stringify(selectedTxn, null, 2)}</pre>
          <Button onClick={() => setSelectedTxn(null)} style={{ marginTop: 8 }}>Close</Button>
        </Card>
      )}
    </div>
  );
}