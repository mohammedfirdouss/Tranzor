import { useState } from 'react';
import { Table, Input, Button, Space, Tag, message } from 'antd';

const API_BASE_URL = 'YOUR_API_GATEWAY_URL'; // Replace with your API base URL

export default function FraudAlertsPage() {
  const [accountId, setAccountId] = useState('');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchFraudAlerts = async () => {
    if (!accountId) {
      message.info('Please enter an account ID to search.');
      return;
    }
    setLoading(true);
    try {
      const url = `${API_BASE_URL}/accounts/${accountId}/transactions?status=Declined`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to fetch fraud alerts');
      const json = await res.json();
      setData(json.transactions || []);
    } catch (err) {
      message.error('Error fetching fraud alerts');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { title: 'ID', dataIndex: 'transactionId', key: 'id' },
    { title: 'Type', dataIndex: 'transactionType', key: 'type' },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount) =>
        amount && typeof amount === 'object'
          ? `${amount.value} ${amount.currency}`
          : '',
    },
    { title: 'Status', dataIndex: 'status', key: 'status', render: (status) => <Tag color="red">{status}</Tag> },
    { title: 'Timestamp', dataIndex: 'receivedTimestamp', key: 'timestamp' },
    { title: 'Sender', dataIndex: 'senderAccountId', key: 'sender' },
    { title: 'Receiver', dataIndex: 'receiverAccountId', key: 'receiver' },
  ];

  return (
    <div>
      <h2>Fraud Alerts</h2>
      <Space style={{ marginBottom: 16 }}>
        <Input
          placeholder="Account ID"
          value={accountId}
          onChange={(e) => setAccountId(e.target.value)}
          style={{ width: 200 }}
        />
        <Button type="primary" onClick={fetchFraudAlerts}>
          Search
        </Button>
      </Space>
      <Table
        columns={columns}
        dataSource={data}
        rowKey="transactionId"
        loading={loading}
        pagination={false}
      />
    </div>
  );
}