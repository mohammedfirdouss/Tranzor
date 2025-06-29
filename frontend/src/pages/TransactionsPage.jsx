import { useEffect, useState } from 'react';
import { Table, Tag, Input, Button, Space, message } from 'antd';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL; // <-- Replace with your deployed API base URL

export default function TransactionsPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [accountId, setAccountId] = useState(''); // User must enter an accountId
  const [filters, setFilters] = useState({ status: '', type: '' });
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, nextToken: null });

  const fetchTransactions = async (params = {}) => {
    if (!accountId) {
      message.info('Please enter an account ID to search.');
      return;
    }
    setLoading(true);
    try {
      const query = new URLSearchParams({
        limit: params.pageSize || pagination.pageSize,
        status: filters.status,
        type: filters.type,
        nextToken: params.nextToken || '',
      });
      const url = `${API_BASE_URL}/accounts/${accountId}/transactions?${query.toString()}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to fetch transactions');
      const json = await res.json();
      setData(json.transactions || []);
      setPagination((prev) => ({
        ...prev,
        nextToken: json.nextToken || null,
      }));
    } catch (err) {
      message.error('Error fetching transactions');
    } finally {
      setLoading(false);
    }
  };

  // Table columns
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
    { title: 'Status', dataIndex: 'status', key: 'status', render: (status) => <Tag>{status}</Tag> },
    { title: 'Timestamp', dataIndex: 'receivedTimestamp', key: 'timestamp' },
    { title: 'Sender', dataIndex: 'senderAccountId', key: 'sender' },
    { title: 'Receiver', dataIndex: 'receiverAccountId', key: 'receiver' },
  ];

  // Handle search
  const handleSearch = () => {
    setPagination((prev) => ({ ...prev, current: 1, nextToken: null }));
    fetchTransactions({ pageSize: pagination.pageSize, nextToken: null });
  };

  // Handle pagination (next page)
  const handleNextPage = () => {
    if (pagination.nextToken) {
      fetchTransactions({ pageSize: pagination.pageSize, nextToken: pagination.nextToken });
    }
  };

  return (
    <div>
      <h2>Transactions</h2>
      <Space style={{ marginBottom: 16 }}>
        <Input
          placeholder="Account ID"
          value={accountId}
          onChange={(e) => setAccountId(e.target.value)}
          style={{ width: 200 }}
        />
        <Input
          placeholder="Status"
          value={filters.status}
          onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value }))}
          style={{ width: 120 }}
        />
        <Input
          placeholder="Type"
          value={filters.type}
          onChange={(e) => setFilters((f) => ({ ...f, type: e.target.value }))}
          style={{ width: 120 }}
        />
        <Button type="primary" onClick={handleSearch}>
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
      <div style={{ marginTop: 16 }}>
        <Button
          onClick={handleNextPage}
          disabled={!pagination.nextToken}
        >
          Next Page
        </Button>
      </div>
    </div>
  );
}