import React from 'react';
import { Form, Input, Button, Select, InputNumber, message, Space } from 'antd';

const { Option } = Select;

const TransactionForm = ({ onSubmit, loading = false, onCancel }) => {
  const [form] = Form.useForm();

  const validateAmount = (_, value) => {
    if (!value || value <= 0) {
      return Promise.reject(new Error('Amount must be greater than 0'));
    }
    if (value > 1000000) {
      return Promise.reject(new Error('Amount cannot exceed 1,000,000'));
    }
    return Promise.resolve();
  };

  const validateAccountId = (_, value) => {
    if (!value) {
      return Promise.reject(new Error('Account ID is required'));
    }
    if (value.length < 3) {
      return Promise.reject(new Error('Account ID must be at least 3 characters'));
    }
    if (!/^[a-zA-Z0-9-_]+$/.test(value)) {
      return Promise.reject(new Error('Account ID can only contain letters, numbers, hyphens, and underscores'));
    }
    return Promise.resolve();
  };

  const handleSubmit = async (values) => {
    try {
      const transactionData = {
        referenceId: values.referenceId,
        senderAccountId: values.senderAccountId,
        receiverAccountId: values.receiverAccountId,
        amount: {
          value: values.amountValue.toString(),
          currency: values.amountCurrency,
        },
        transactionType: values.transactionType,
        metadata: values.metadata ? JSON.parse(values.metadata) : undefined,
      };

      await onSubmit(transactionData);
      form.resetFields();
      message.success('Transaction created successfully!');
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  const handleReset = () => {
    form.resetFields();
    if (onCancel) onCancel();
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      autoComplete="off"
      style={{ maxWidth: 600 }}
    >
      <Form.Item
        label="Reference ID"
        name="referenceId"
        rules={[
          { required: true, message: 'Reference ID is required' },
          { min: 3, message: 'Reference ID must be at least 3 characters' },
          { max: 50, message: 'Reference ID cannot exceed 50 characters' },
        ]}
      >
        <Input 
          placeholder="Enter unique reference ID"
          maxLength={50}
        />
      </Form.Item>

      <Form.Item
        label="Sender Account ID"
        name="senderAccountId"
        rules={[{ validator: validateAccountId }]}
      >
        <Input 
          placeholder="Enter sender account ID"
          maxLength={50}
        />
      </Form.Item>

      <Form.Item
        label="Receiver Account ID"
        name="receiverAccountId"
        rules={[
          { validator: validateAccountId },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('senderAccountId') !== value) {
                return Promise.resolve();
              }
              return Promise.reject(new Error('Sender and receiver accounts must be different'));
            },
          }),
        ]}
      >
        <Input 
          placeholder="Enter receiver account ID"
          maxLength={50}
        />
      </Form.Item>

      <Form.Item label="Amount">
        <Space.Compact style={{ width: '100%' }}>
          <Form.Item
            name="amountValue"
            noStyle
            rules={[{ validator: validateAmount }]}
          >
            <InputNumber
              placeholder="0.00"
              min={0.01}
              max={1000000}
              precision={2}
              style={{ width: '70%' }}
            />
          </Form.Item>
          <Form.Item
            name="amountCurrency"
            noStyle
            initialValue="USD"
            rules={[{ required: true, message: 'Currency is required' }]}
          >
            <Select placeholder="Currency" style={{ width: '30%' }}>
              <Option value="USD">USD</Option>
              <Option value="EUR">EUR</Option>
              <Option value="GBP">GBP</Option>
              <Option value="JPY">JPY</Option>
              <Option value="CAD">CAD</Option>
            </Select>
          </Form.Item>
        </Space.Compact>
      </Form.Item>

      <Form.Item
        label="Transaction Type"
        name="transactionType"
        rules={[{ required: true, message: 'Transaction type is required' }]}
      >
        <Select placeholder="Select transaction type">
          <Option value="transfer">Transfer</Option>
          <Option value="payment">Payment</Option>
          <Option value="deposit">Deposit</Option>
          <Option value="withdrawal">Withdrawal</Option>
          <Option value="refund">Refund</Option>
        </Select>
      </Form.Item>

      <Form.Item
        label="Metadata (Optional)"
        name="metadata"
        rules={[
          {
            validator: (_, value) => {
              if (!value) return Promise.resolve();
              try {
                JSON.parse(value);
                return Promise.resolve();
              } catch {
                return Promise.reject(new Error('Invalid JSON format'));
              }
            },
          },
        ]}
      >
        <Input.TextArea
          placeholder='{"description": "Payment for services", "category": "business"}'
          rows={3}
        />
      </Form.Item>

      <Form.Item>
        <Button 
          type="primary" 
          htmlType="submit" 
          loading={loading}
          style={{ marginRight: 8 }}
        >
          Create Transaction
        </Button>
        <Button onClick={handleReset}>
          Reset
        </Button>
      </Form.Item>
    </Form>
  );
};

export default TransactionForm;