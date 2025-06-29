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

  // Transaction creation form state
  const [form, setForm] = useState({
    referenceId: '',
    senderAccountId: '',
    receiverAccountId: '',
    amountValue: '',
    amountCurrency: 'USD',
    transactionType: '',
  });
  const [creating, setCreating] = useState(false);

  const handleCreate = async () => {
    if (!form.referenceId || !form.senderAccountId || !form.receiverAccountId || !form.amountValue || !form.amountCurrency || !form.transactionType) {
      message.info('Please fill in all fields to create a transaction.');
      return;
    }
    setCreating(true);
    try {
      const res = await fetch(`${API_BASE_URL}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          referenceId: form.referenceId,
          senderAccountId: form.senderAccountId,
          receiverAccountId: form.receiverAccountId,
          amount: { value: form.amountValue, currency: form.amountCurrency },
          transactionType: form.transactionType
        })
      });
      if (!res.ok) throw new Error('Failed to create transaction');
      message.success('Transaction created!');
      setForm({ referenceId: '', senderAccountId: '', receiverAccountId: '', amountValue: '', amountCurrency: 'USD', transactionType: '' });
      fetchTransactions();
    } catch (err) {
      message.error('Error creating transaction');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div>
      <h2>Transactions</h2>
      {/* Transaction creation form */}
      <Space style={{ marginBottom: 24 }} direction="vertical">
        <Input placeholder="Reference ID" value={form.referenceId} onChange={e => setForm(f => ({ ...f, referenceId: e.target.value }))} style={{ width: 200 }} />
        <Input placeholder="Sender Account ID" value={form.senderAccountId} onChange={e => setForm(f => ({ ...f, senderAccountId: e.target.value }))} style={{ width: 200 }} />
        <Input placeholder="Receiver Account ID" value={form.receiverAccountId} onChange={e => setForm(f => ({ ...f, receiverAccountId: e.target.value }))} style={{ width: 200 }} />
        <Input placeholder="Amount Value" value={form.amountValue} onChange={e => setForm(f => ({ ...f, amountValue: e.target.value }))} style={{ width: 120 }} type="number" />
        <Input placeholder="Amount Currency" value={form.amountCurrency} onChange={e => setForm(f => ({ ...f, amountCurrency: e.target.value }))} style={{ width: 120 }} />
        <Input placeholder="Transaction Type" value={form.transactionType} onChange={e => setForm(f => ({ ...f, transactionType: e.target.value }))} style={{ width: 200 }} />
        <Button type="primary" onClick={handleCreate} loading={creating}>Create Transaction</Button>
      </Space>
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