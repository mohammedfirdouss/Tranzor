const axios = require('axios');
const { DynamoDBClient, GetItemCommand, QueryCommand } = require('@aws-sdk/client-dynamodb');
const { v4: uuidv4 } = require('uuid');

const API_BASE = process.env.E2E_API_BASE || 'http://localhost:3000';
const TRANSACTIONS_TABLE = process.env.TRANSACTIONS_TABLE_NAME || 'Transactions';
const FRAUD_CHECKS_TABLE = process.env.FRAUD_CHECKS_TABLE_NAME || 'FraudChecks';
const AUDIT_LOGS_TABLE = process.env.AUDIT_LOGS_TABLE_NAME || 'AuditLogs';
const REGION = process.env.AWS_REGION || 'us-east-1';

const dynamo = new DynamoDBClient({ region: REGION });

// Helper: Wait for a condition with timeout
async function waitFor(fn, { timeout = 10000, interval = 500 } = {}) {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    const result = await fn();
    if (result) return result;
    await new Promise(res => setTimeout(res, interval));
  }
  throw new Error('Timeout waiting for condition');
}

describe('E2E: Transaction Flow', () => {
  let transactionId;

  it('should process a transaction end-to-end', async () => {
    // 1. POST /v1/transactions
    transactionId = uuidv4();
    const postRes = await axios.post(`${API_BASE}/v1/transactions`, {
      referenceId: 'e2e-ref-' + transactionId,
      senderAccountId: 'acct-sender-1',
      receiverAccountId: 'acct-receiver-1',
      amount: { value: '100.00', currency: 'USD' },
      transactionType: 'PAYMENT',
      metadata: { test: 'e2e' }
    });
    expect(postRes.status).toBe(202);
    expect(postRes.data.transactionId).toBeDefined();
    expect(postRes.data.status).toBe('Pending');

    // 2. Poll GET /v1/transactions/{transactionId} until status is not Pending
    const txn = await waitFor(async () => {
      const getRes = await axios.get(`${API_BASE}/v1/transactions/${postRes.data.transactionId}`);
      if (getRes.data.status !== 'Pending') return getRes.data;
      return null;
    }, { timeout: 15000, interval: 1000 });

    expect(['Approved', 'Declined']).toContain(txn.status);
    expect(txn.fraudCheckId).toBeDefined();

    // 3. Check FraudChecks table for fraud check result
    const fraudCheckRes = await dynamo.send(new QueryCommand({
      TableName: FRAUD_CHECKS_TABLE,
      IndexName: 'TransactionId-Timestamp-index',
      KeyConditionExpression: 'transactionId = :tid',
      ExpressionAttributeValues: { ':tid': { S: txn.transactionId } },
      Limit: 1
    }));
    expect(fraudCheckRes.Items && fraudCheckRes.Items.length).toBe(1);
    const fraudCheck = fraudCheckRes.Items[0];
    expect(fraudCheck.status.S).toMatch(/Approved|Declined/);
    expect(fraudCheck.score.N).toBeDefined();

    // 4. Check AuditLogs table for audit log entry
    const auditLogRes = await dynamo.send(new QueryCommand({
      TableName: AUDIT_LOGS_TABLE,
      IndexName: 'EntityId-Timestamp-index',
      KeyConditionExpression: 'entityId = :tid',
      ExpressionAttributeValues: { ':tid': { S: txn.transactionId } },
      Limit: 1
    }));
    expect(auditLogRes.Items && auditLogRes.Items.length).toBeGreaterThan(0);
    const auditLog = auditLogRes.Items[0];
    expect(auditLog.eventType.S).toBe('TransactionStatusUpdated');
    expect(auditLog.details.S).toContain(txn.status);
  }, 20000);
}); 