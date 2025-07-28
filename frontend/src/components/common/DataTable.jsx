import React from 'react';
import { Table, Tag, Button, Space } from 'antd';
import { EyeOutlined } from '@ant-design/icons';

const DataTable = ({ 
  data = [], 
  loading = false, 
  columns = [], 
  onRowClick,
  onViewDetails,
  pagination = false,
  onNextPage,
  hasMore = false,
  rowKey = 'id',
  emptyText = 'No data available'
}) => {
  const defaultColumns = [
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
      render: (status) => {
        const color = status === 'Approved' ? 'green' : 
                    status === 'Declined' ? 'red' : 
                    status === 'Pending' ? 'orange' : 'default';
        return <Tag color={color}>{status}</Tag>;
      },
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
  ];

  // Add actions column if onViewDetails is provided
  const finalColumns = [...(columns.length > 0 ? columns : defaultColumns)];
  
  if (onViewDetails && !columns.some(col => col.key === 'actions')) {
    finalColumns.push({
      title: 'Actions',
      key: 'actions',
      width: 100,
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            size="small"
            icon={<EyeOutlined />}
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails(record);
            }}
          >
            View
          </Button>
        </Space>
      ),
    });
  }

  const handleRowClick = (record) => {
    if (onRowClick) {
      onRowClick(record);
    }
  };

  return (
    <>
      <Table
        className="tranzor-enhanced-table"
        columns={finalColumns}
        dataSource={data}
        rowKey={rowKey}
        loading={loading}
        pagination={false}
        onRow={(record) => ({
          onClick: () => handleRowClick(record),
          style: { 
            cursor: onRowClick ? 'pointer' : 'default',
            transition: 'all 0.2s ease'
          },
        })}
        locale={{ emptyText }}
        scroll={{ x: 'max-content' }}
        size="middle"
      />
      
      {!pagination && hasMore && (
        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <Button 
            onClick={onNextPage} 
            disabled={loading}
            style={{ borderRadius: '8px' }}
          >
            Load More
          </Button>
        </div>
      )}
    </>
  );
};

export default DataTable;