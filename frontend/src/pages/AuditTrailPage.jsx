import { useState } from 'react';
import { Table, Input, Button, Space, message } from 'antd';

const API_BASE_URL = 'YOUR_API_GATEWAY_URL'; // Replace with your API base URL

export default function AuditTrailPage() {
  const [accountId, setAccountId] = useState('');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchAudit = async () => {
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
      setData(json.transactions || []);
    } catch (err) {
      message.error('Error fetching audit trail');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Audit Trail</h2>
      <Space style={{ marginBottom: 16 }}>
        <Input
          placeholder="Account ID"
          value={accountId}
          onChange={e => setAccountId(e.target.value)}
          style={{ width: 200 }}
        />
        <Button type="primary" onClick={fetchAudit}>
          Search
        </Button>
      </Space>
      <Table
        columns={[
          { title: 'ID', dataIndex: 'transactionId', key: 'id' },
          { title: 'Type', dataIndex: 'transactionType', key: 'type' },
          { title: 'Amount', dataIndex: 'amount', key: 'amount', render: (a) => a && typeof a === 'object' ? `${a.value} ${a.currency}` : '' },
          { title: 'Status', dataIndex: 'status', key: 'status' },
          { title: 'Timestamp', dataIndex: 'receivedTimestamp', key: 'timestamp' },
        ]}
        dataSource={data}
        rowKey="transactionId"
        loading={loading}
        pagination={false}
      />
    </div>
  );
}