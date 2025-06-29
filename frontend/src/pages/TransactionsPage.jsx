import React, { useState } from 'react';
import { Input, Button, Space, DatePicker, message, Select } from 'antd';
import * as RadixThemes from '@radix-ui/themes';
import '@radix-ui/themes/styles.css';
import { MagnifyingGlassIcon, PlusIcon, ReloadIcon, TableIcon } from '@radix-ui/react-icons';
import { FiWifi } from 'react-icons/fi';
import * as RadixTooltip from '@radix-ui/react-tooltip';
import LoadingSpinner from '../components/common/LoadingSpinner';
import DataTable from '../components/common/DataTable';
import TransactionForm from '../components/forms/TransactionForm';
import { useGetAccountTransactionsQuery, useCreateTransactionMutation } from '../store/api/transactionsApi';

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

  // RTK Query hooks
  const { 
    data: transactionsData, 
    isLoading: transactionsLoading, 
    error: transactionsError,
    refetch: refetchTransactions
  } = useGetAccountTransactionsQuery(
    { 
      accountId, 
      limit: 50,
      status: filters.status,
      type: filters.type,
      startDate: filters.startDate,
      endDate: filters.endDate
    },
    { skip: !accountId }
  );

  const [createTransaction, { isLoading: createLoading }] = useCreateTransactionMutation();

  const transactions = transactionsData?.transactions || [];
  const pagination = {
    hasMore: transactionsData?.hasMore || false,
    nextToken: transactionsData?.nextToken || null,
  };

  const handleSearch = () => {
    if (!accountId.trim()) {
      message.warning('Please enter an Account ID to search transactions');
      return;
    }
    refetchTransactions();
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
      await createTransaction(transactionData).unwrap();
      setShowCreateForm(false);
      message.success('Transaction created successfully!');
      refetchTransactions(); // Refresh the list
    } catch (error) {
      message.error('Failed to create transaction: ' + (error.data?.message || error.message));
      throw error;
    }
  };

  const clearFilters = () => {
    setFilters({ status: '', type: '', startDate: '', endDate: '' });
  };

  const nextPage = () => {
    if (pagination.nextToken) {
      // For now, we'll refetch with the next token
      // In a more advanced implementation, we'd use RTK Query's pagination features
      refetchTransactions();
    }
  };

  return (
    <RadixThemes.Theme appearance="light" accentColor="indigo" grayColor="mauve" radius="large">
      <div>
        {/* Header */}
        <div style={{ marginBottom: 24, display: 'flex', alignItems: 'center', gap: 16 }}>
          <TableIcon width={24} height={24} color="#6366f1" />
          <h2 style={{ margin: 0 }}>Transactions</h2>
          <RadixTooltip.Root>
            <RadixTooltip.Trigger asChild>
              <span>
                <RadixThemes.Badge color="green" variant="solid" size="2">Live</RadixThemes.Badge>
              </span>
            </RadixTooltip.Trigger>
            <RadixTooltip.Content side="bottom">Real-time updates connected</RadixTooltip.Content>
          </RadixTooltip.Root>
          <RadixThemes.Button
            color="indigo"
            variant="solid"
            size="3"
            onClick={() => setShowCreateForm(!showCreateForm)}
            style={{ marginLeft: 'auto' }}
          >
            {showCreateForm ? <ReloadIcon /> : <PlusIcon />}
            {showCreateForm ? 'Cancel' : 'Create Transaction'}
          </RadixThemes.Button>
        </div>

        {/* Create Transaction Form */}
        {showCreateForm && (
          <RadixThemes.Card style={{ marginBottom: 24 }}>
            <RadixThemes.Heading as="h3" size="4" mb="3">Create New Transaction</RadixThemes.Heading>
            <TransactionForm
              onSubmit={handleCreateTransaction}
              loading={createLoading}
              onCancel={() => setShowCreateForm(false)}
            />
          </RadixThemes.Card>
        )}

        {/* Search & Filter Card */}
        <RadixThemes.Card>
          <RadixThemes.Flex direction="column" gap="3">
            <RadixThemes.Flex gap="3" align="center" wrap="wrap">
              <Input
                placeholder="Account ID (required)"
                value={accountId}
                onChange={e => setAccountId(e.target.value)}
                aria-label="Account ID"
                style={{ width: 200 }}
              />
              <Select
                placeholder="Status"
                value={filters.status}
                onChange={value => handleFilterChange('status', value)}
                style={{ width: 120 }}
                allowClear
              >
                <Select.Option value="Pending">Pending</Select.Option>
                <Select.Option value="Approved">Approved</Select.Option>
                <Select.Option value="Declined">Declined</Select.Option>
              </Select>
              <Select
                placeholder="Type"
                value={filters.type}
                onChange={value => handleFilterChange('type', value)}
                style={{ width: 140 }}
                allowClear
              >
                <Select.Option value="transfer">Transfer</Select.Option>
                <Select.Option value="payment">Payment</Select.Option>
                <Select.Option value="deposit">Deposit</Select.Option>
                <Select.Option value="withdrawal">Withdrawal</Select.Option>
                <Select.Option value="refund">Refund</Select.Option>
              </Select>
              {/* Keep AntD RangePicker for now, can be replaced with a Radix/other date picker later */}
              <RangePicker
                onChange={handleDateRangeChange}
                style={{ width: 240 }}
              />
            </RadixThemes.Flex>
            <RadixThemes.Flex gap="2">
              <RadixThemes.Button
                color="indigo"
                variant="solid"
                size="2"
                onClick={handleSearch}
                loading={transactionsLoading}
                disabled={!accountId.trim()}
              >
                <MagnifyingGlassIcon /> Search
              </RadixThemes.Button>
              <RadixThemes.Button
                color="gray"
                variant="soft"
                size="2"
                onClick={refetchTransactions}
                disabled={!accountId || transactionsLoading}
              >
                <ReloadIcon /> Refresh
              </RadixThemes.Button>
              <RadixThemes.Button
                color="gray"
                variant="ghost"
                size="2"
                onClick={clearFilters}
              >
                Clear Filters
              </RadixThemes.Button>
            </RadixThemes.Flex>
          </RadixThemes.Flex>
        </RadixThemes.Card>

        {/* Error Message */}
        {transactionsError && (
          <RadixThemes.AlertDialog.Root open>
            <RadixThemes.AlertDialog.Content>
              <RadixThemes.AlertDialog.Title>Error</RadixThemes.AlertDialog.Title>
              <RadixThemes.Text color="red">
                {transactionsError.message || 'Failed to load transactions'}
              </RadixThemes.Text>
            </RadixThemes.AlertDialog.Content>
          </RadixThemes.AlertDialog.Root>
        )}

        {/* Results Card */}
        <RadixThemes.Card style={{ marginTop: 24 }}>
          <RadixThemes.Flex align="center" gap="2">
            <RadixThemes.Heading as="h4" size="3">Transaction Results</RadixThemes.Heading>
            <RadixTooltip.Root>
              <RadixTooltip.Trigger asChild>
                <span><FiWifi color="#52c41a" size={16} /></span>
              </RadixTooltip.Trigger>
              <RadixTooltip.Content side="bottom">Real-time updates active</RadixTooltip.Content>
            </RadixTooltip.Root>
          </RadixThemes.Flex>
          <LoadingSpinner spinning={transactionsLoading}>
            <DataTable
              data={transactions}
              loading={transactionsLoading}
              onNextPage={nextPage}
              hasMore={pagination.hasMore}
              emptyText={
                !accountId
                  ? 'Enter an Account ID above to search transactions'
                  : 'No transactions found matching your criteria'
              }
            />
          </LoadingSpinner>
        </RadixThemes.Card>
      </div>
    </RadixThemes.Theme>
  );
}