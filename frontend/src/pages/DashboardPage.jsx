import { useState } from 'react';
import { Card, Statistic, Row, Col, Input, Button, Table, message } from 'antd';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function DashboardPage() {
  const [accountId, setAccountId] = useState('');
  const [stats, setStats] = useState({ total: 0, approved: 0, declined: 0 });
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(false);

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
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={8}>
          <Card>
            <Statistic title="Total Transactions" value={stats.total} />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic title="Approved" value={stats.approved} valueStyle={{ color: 'green' }} />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic title="Declined" value={stats.declined} valueStyle={{ color: 'red' }} />
          </Card>
        </Col>
      </Row>
      <h3>Recent Transactions</h3>
      <Table
        columns={[
          { title: 'ID', dataIndex: 'transactionId', key: 'id' },
          { title: 'Type', dataIndex: 'transactionType', key: 'type' },
          { title: 'Amount', dataIndex: 'amount', key: 'amount', render: (a) => a && typeof a === 'object' ? `${a.value} ${a.currency}` : '' },
          { title: 'Status', dataIndex: 'status', key: 'status' },
          { title: 'Timestamp', dataIndex: 'receivedTimestamp', key: 'timestamp' },
        ]}
        dataSource={recent}
        rowKey="transactionId"
        pagination={false}
        loading={loading}
      />
    </div>
  );
}